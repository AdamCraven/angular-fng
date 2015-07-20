
#angular-fng

angular-fng are performance focused event directives, which behave as the standard ng-event directives (e.g. ng-click, ng-mousedown), but can be called in a desired scope instead of triggering a global, root scope, digest.

They can be used as a replacement or in addition to the default directives.

Example: Simulated large app (Greater than 1000 watchers)
<img src="http://www.adamcraven.me/images/fng-directives/ng-event-anim.gif" width="360" alt="ng-event">
<img src="http://www.adamcraven.me/images/fng-directives/fng-event-anim.gif" width="360" alt="fng-event">

LEFT: Using ng-event. RIGHT: Using fng-event, not refreshing all the watchers in an app.

## Installation

* bower: `bower install angular-fng --save`
* npm: `npm install angular-fng --save`
* Or download from github: [angular-moment.zip](https://github.com/AdamCraven/angular-fng/archive/master.zip)


Include angular-fng after angular.js

```html
<script src="components/angular-fng/angular-fng.js"></script>
```

Or can be required in via require.js or other module loaders which support CommonJS or AMD module definition, just be sure that angular is loaded first

## Usage

To enable add fng module your apps main module:

```js
angular.module('myApp', ['fng'])
```

Enable by setting on your chosen module's scope:

```js
$scope.$stopDigestPropagation = true
```

Then replace all uses of the ng-event directives with fng:
```html
<a fng-click="ctrl.click()">Click Me</a>
```



<img src="http://www.adamcraven.me/images/fng-directives/scope-tree-local.gif" alt="Scope tree local">
<img src="http://www.adamcraven.me/images/fng-directives/scope-local-digest.gif" alt="Scope tree">


New directives defined:

* fng-click
* fng-dblclick
* fng-mousedown
* fng-mouseup
* fng-mouseover
* fng-mouseout
* fng-mousemove
* fng-mouseenter
* fng-mouseleave
* fng-keydown
* fng-keyup
* fng-keypress
* fng-submit
* fng-focus
* fng-blur
* fng-copy
* fng-cut
* fng-paste