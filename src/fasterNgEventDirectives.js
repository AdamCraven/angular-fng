/*jshint unused:true*/
define(['angular'], function(angular) {
    'use strict';

    var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;
    /**
     * Converts all accepted directives format into proper directive name.
     * @param name Name to normalize
     */
    //FIXME: Use https://docs.angularjs.org/api/ng/type/$compile.directive.Attributes if accessible
    function directiveNormalize(name) {
        return camelCase(name.replace(PREFIX_REGEXP, ''));
    }

    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;

    /**
     * Converts snake_case to camelCase.
     * Also there is special case for Moz prefix starting with upper case letter.
     * @param name Name to normalize
     */
    function camelCase(name) {
        return name.
        replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        });
    }

    function scopeToCallDigestIn(scope) {
        var digestScope = scope;
        while (digestScope.$parent) {
            if (digestScope.hasOwnProperty('$stopDigestPropagation')) {
                break;
            }
            digestScope = digestScope.$parent;
        }
        return digestScope;
    }

    // For events that might fire synchronously during DOM manipulation
    // we need to execute their event handlers asynchronously using $evalAsync,
    // so that they are not executed in an inconsistent state.
    var forceAsyncEvents = {
        'blur': true,
        'focus': true
    };
    var events = 'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' ');

    return function fasterNgDirectives(module) {
        function assignDirectives(eventName) {
            var directiveName = directiveNormalize('fng-' + eventName);
            module.directive(directiveName, ['$parse', '$rootScope', function($parse, $rootScope) {
                return {
                    restrict: 'A',
                    compile: function($element, attr) {
                        // We expose the powerful $event object on the scope that provides access to the Window,
                        // etc. that isn't protected by the fast paths in $parse.  We explicitly request better
                        // checks at the cost of speed since event handler expressions are not executed as
                        // frequently as regular change detection.
                        var fn = $parse(attr[directiveName], /* interceptorFn */ null, /* expensiveChecks */ true);
                        return function ngEventHandler(scope, element) {
                            element.on(eventName, function(event) {
                                var callback = function() {
                                    fn(scope, {
                                        $event: event
                                    });
                                };

                                var digestScope = scopeToCallDigestIn(scope);

                                if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                                    scope.$evalAsync(callback);
                                } else {
                                    if (digestScope.$stopDigestPropagation) {
                                        callback();
                                        digestScope.$digest();
                                    } else {
                                        scope.$apply(callback);
                                    }
                                }
                            });
                        };
                    }
                };
            }]);
        }

        events.forEach(assignDirectives);
    };
});