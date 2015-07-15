#Faster Default directives for angular

Faster angular events mimic the functionality of the existing ng-event directives, but have a feature that allows them to be called in a desired scope, rather than trigger a rootScope digest.


<img src="http://www.adamcraven.me/images/fng-directives/ng-event-anim.gif" width="364" style="float:left" alt="Scope tree">
<img src="http://www.adamcraven.me/images/fng-directives/fng-event-anim.gif" width="364" style="float:right;" alt="Scope tree">



## Usage

Add $stopDigestPropagation to a scope to prevent rootscope digest

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