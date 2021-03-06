
# angular-fng (**F**aster a**NG**ular)

Performance focused event directives, that act the same as the ng-event directives (ng-click, ng-mousedown, etc.). But instead of triggering a global root scope digest, it can trigger a partial scope digest, increasing performance and responsiveness.

Example: Simulated large app (Greater than 1000 watchers)

<img src="https://code.adamcrvn.com/images/fng-directives/ng-event-anim.gif" width="360" alt="ng-event">
<img src="https://code.adamcrvn.com/images/fng-directives/fng-event-anim.gif" width="360" alt="fng-event">

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

Not sure what's it all about? Have a read of: [angular-fng - Improve the performance of large angular 1.x apps, by using faster event directives](https://code.adamcrvn.com/increasing-performance-on-large-angular-apps/)

## Requirements

* Angular 1.2.0 or greater - May work on older versions.

## Installation

* bower: `bower install angular-fng --save`
* npm: `npm install angular-fng --save`
* Or download from github: [angular-fng.zip](https://github.com/AdamCraven/angular-fng/archive/master.zip)

Include angular-fng after angular.js has been loaded.

```html
<script src="components/angular-fng/angular-fng.js"></script>
```

Or can be required in via require.js or other module loaders which support CommonJS or AMD module definition, just be sure that angular is loaded first

## Usage

To enable add fng to your main module:

```js
angular.module('myApp', ['fng'])
```

Enable partial digesting by setting $stopDigestPropagation on your chosen scope:

```js
$chosenScope.$stopDigestPropagation = true
```

Then replace all uses of the ng-event directives with fng:
```html
<a fng-click="ctrl.click()">Click Me</a>
```

When clicked, the digest will occur from the $chosenScope.

### How it works

The fng events are opt-in directives, which behave *the same* as an ng event directive. However, it differs in one important way. When triggered (e.g. fng-click) it bubbles up the scope tree and searches for a defined $stopDigestPropagation property.

When found it will call a $digest in the scope where $stopDigestPropagation is set and checks all the child scopes as shown below:

<figure class="half">
    <img src="https://code.adamcrvn.com/images/fng-directives/scope-tree-local.gif" alt="Scope tree local">
    <img src="https://code.adamcrvn.com/images/fng-directives/scope-local-digest.gif" alt="Scope tree">
</figure>

<br />

If $stopDigestPropagation property isn't found, it will fallback to the default behaviour and act **the same** as the ng-event directives, calling a root scope digest:

<figure class="half">
    <img src="https://code.adamcrvn.com/images/fng-directives/scope-tree.gif" alt="Scope tree local">
    <img src="https://code.adamcrvn.com/images/fng-directives/scope-full-digest.gif" alt="Scope tree">
</figure>

Because they work the same as the existing ng-event directives, they can be dropped in and used as a replacement.
That means all ng-keydowns can be converted to fng-keydowns, and so forth.


### How to chose where to digest

It is not recommended that these are used at low levels, such as in individual components. The live search component, mentioned in [angular-fng - Improve the performance of large angular 1.x apps, by using faster event directives](https://code.adamcrvn.com/increasing-performance-on-large-angular-apps/), would not implement $stopDigestPropagation property. It should be implemented at the module level, or higher. Such as a group of modules that relate to a major aspect of functionality on a page.
