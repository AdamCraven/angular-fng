// Angular fng / MIT License
(function() {
    'use strict';

    // Refer to https://github.com/angular/angular.js/blob/master/src/ng/directive/ngEventDirs.js
    // and angular code base for much of the originating source code.
    // There are many private methods in angular, duplication has been necessary.

    var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;

    /**
     * Converts all accepted directives format into proper directive name.
     * @param name Name to normalize
     */
    function directiveNormalize(name) {
        return camelCase(name.replace(PREFIX_REGEXP, ''));
    }

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

    /**
     * Bubbles up the scope tree recursively to check if stopDigestPropagation is set on scope
     * returns that scope if defined otherwise undefined
     * @param {object} scope Where scope originated
     * @return {object} Scope to partial digest in or undefined
     */
    function findPartialScope(scope) {
        if (scope.hasOwnProperty('$stopDigestPropagation')) {
            return scope;
        } else if (scope.$parent) {
            return findPartialScope(scope.$parent);
        }
        return;
    }

    function partialDigest(scope, callback) {
        callback();
        scope.$digest();
    }

    function fullDigest (scope, callback) {
        scope.$apply(callback);
    }

    // For events that might fire synchronously during DOM manipulation
    // we need to execute their event handlers asynchronously using $evalAsync,
    // so that they are not executed in an inconsistent state.
    var forceAsyncEvents = {
        'blur': true,
        'focus': true
    };
    var events = 'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' ');

    function fng(angular) {
        var fngModule = angular.module('fng', []);

        function assignDirectives(eventName) {
            var directiveName = directiveNormalize('fng-' + eventName);
            fngModule.directive(directiveName, ['$parse', '$rootScope', function($parse, $rootScope) {
                return {
                    restrict: 'A',
                    compile: function($element, attr) {
                        // We expose the powerful $event object on the scope that provides access to the Window,
                        // etc. that isn't protected by the fast paths in $parse.  We explicitly request better
                        // checks at the cost of speed since event handler expressions are not executed as
                        // frequently as regular change detection.
                        var fn = $parse(attr[directiveName], /* interceptorFn */ null, /* expensiveChecks */ true);
                        return function ngEventHandler(scope, element) {
                            element.on(eventName, function fngEventHandler(event) {
                                var partialDigestScope;
                                var callback = function() {
                                    fn(scope, {
                                        $event: event
                                    });
                                };

                                if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                                    scope.$evalAsync(callback);
                                } else if ((partialDigestScope = findPartialScope(scope))) {
                                    partialDigest(partialDigestScope, callback);
                                } else {
                                    fullDigest(scope, callback);
                                }
                            });
                        };
                    }
                };
            }]);
        }
        events.forEach(assignDirectives);
    }

    if (typeof define === 'function' && define.amd) {
        define(['angular'], fng);
    } else if (typeof module !== 'undefined' && module && module.exports) {
        fng(angular);
        module.exports = 'fng';
    } else {
        fng(angular);
    }

})();