
#angular-fng Performance event directives for Angular

angular-fng are performance focused event directives, which behave as the standard ng-event directives (e.g. ng-click, ng-mousedown), but can be called in a desired scope instead of triggering a global, root scope, digest.

They can be used as a replacement or in addition to the default directives.

Example: Simulated large app (Greater 1000 watchers)
<img src="http://www.adamcraven.me/images/fng-directives/ng-event-anim.gif" width="360" alt="ng-event">
<img src="http://www.adamcraven.me/images/fng-directives/fng-event-anim.gif" width="360" alt="fng-event">

LEFT: Using ng-event. RIGHT: Using fng-event, not refreshing all the watchers in an app.

## Usage

Add $stopDigestPropagation = true to a scope to prevent rootscope digest

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