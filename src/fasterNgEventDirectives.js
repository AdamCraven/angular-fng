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


/**
 * @ngdoc directive
 * @name ngClick
 *
 * @description
 * The ngClick directive allows you to specify custom behavior when
 * an element is clicked.
 *
 * @element ANY
 * @priority 0
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate upon
 * click. ({@link guide/expression#-event- Event object is available as `$event`})
 *
 * @example
   <example>
     <file name="index.html">
      <button ng-click="count = count + 1" ng-init="count=0">
        Increment
      </button>
      <span>
        count: {{count}}
      </span>
     </file>
     <file name="protractor.js" type="protractor">
       it('should check ng-click', function() {
         expect(element(by.binding('count')).getText()).toMatch('0');
         element(by.css('button')).click();
         expect(element(by.binding('count')).getText()).toMatch('1');
       });
     </file>
   </example>
 */
/*
 * A collection of directives that allows creation of custom event handlers that are defined as
 * angular expressions and are compiled and executed within the current scope.
 */
var ngEventDirectives = {};

function scopeToCallDigestIn(scope) {
  var digestScope = scope;
  while (scope.$parent) {
    if (scope.$$digestContext) {
      break;
    } else {
      digestScope = scope.$parent;
    }
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
'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' ').forEach(
  function(eventName) {
    var directiveName = directiveNormalize('fng-' + eventName);
    ngEventDirectives[directiveName] = ['$parse', '$rootScope', function($parse, $rootScope) {
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
              if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                scope.$evalAsync(callback);
              } else {
                var digestScope = scopeToCallDigestIn(scope);

                if (digestScope.$$digestContext) {
                  digestScope.$digest();
                  callback();
                } else {
                  scope.$apply(callback);
                }
              }
            });
          };
        }
      };
    }];
  }
);