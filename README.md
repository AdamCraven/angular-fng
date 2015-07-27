
#angular-fng

angular-fng (faster angular) are performance focused event directives, which behave as the standard ng-event directives (e.g. ng-click, ng-mousedown), but can trigger a partial scope digest instead of always triggering a global root scope digest.

Example: Simulated large app (Greater than 1000 watchers)
<img src="http://www.adamcraven.me/images/fng-directives/ng-event-anim.gif" width="360" alt="ng-event">
<img src="http://www.adamcraven.me/images/fng-directives/fng-event-anim.gif" width="360" alt="fng-event">
LEFT: Using ng-event. RIGHT: Using fng-event, not refreshing all the watchers in an app.

New directives defined, which can be used as a replacement or in addition to the default directives:

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


## Why

Not sure what's it all about? Have a read here: http://www.adamcraven.me/increasing-performance-on-large-angular-apps/

## Installation

* bower: `bower install angular-fng --save`
* npm: `npm install angular-fng --save`
* Or download from github: [angular-moment.zip](https://github.com/AdamCraven/angular-fng/archive/master.zip)

Include angular-fng after angular.js has been loaded.

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


### How it works

The fng are opt-in directives, they behave *the same* as an ng event directive. But it differs in one important way. When triggered (e.g. fng-click) it bubbles up the scope tree and searches for a defined $stopDigestPropagation property.

When found it will call a $digest in the scope where $stopDigestPropagation is set and checks all the child scopes as shown below:

<figure class="half">
    <img src="http://www.adamcraven.me//images/fng-directives/scope-tree-local.gif" alt="Scope tree local">
    <img src="http://www.adamcraven.me//images/fng-directives/scope-local-digest.gif" alt="Scope tree">
</figure>

<br />

If $stopDigestPropagation property isn't found, it will fallback to the default behaviour and act **the same** as the ng-event directives, calling a root scope digest:

<figure class="half">
    <img src="http://www.adamcraven.me//images/fng-directives/scope-tree.gif" alt="Scope tree local">
    <img src="http://www.adamcraven.me//images/fng-directives/scope-full-digest.gif" alt="Scope tree">
</figure>

Because they work the same as the existing ng-event directives, they can be dropped in and used as a replacement.
That means all ng-keydowns can be converted to fng-keydowns, and so forth.


###How to chose where to digest

It is not recommended that these are used at low levels, such as in individual components. The live search component mentioned before would not implement $stopDigestPropagation property. It should be implemented at the module level, or higher. Such as a group of modules that relate to a major aspect of functionality on a page.