# CustomAnimation
Small JavaScript libary for animating css properties of HTML element.It works on cross browser including IE-8. It supports callBack and promise of animation.

Demos
-------
*  [Simple Ping Pong Game](https://samantachinmoy.github.io/CustomAnimation/sample3.html)
*  [Simple Custom Animation](https://samantachinmoy.github.io/CustomAnimation/sample1.html)
*  [Bounc the ball](https://samantachinmoy.github.io/CustomAnimation/sample2.html)
*  For more demos chekout this [JsFiddle](https://jsfiddle.net/ChinmoySamanta1993/dxkuby1n/1/)

How To Use
----------

Reference the [customAnimate.js.js file] from your HTML document. 
Then call the animate method.
Basics: Arguments for animate method.

```js
/*
- @elements {Elements||[Elements]} can be single or array of elements.
- @styleObj {styleObj||[styleObj]} can be single or array of style objects.
- @duration is in millisecond.
- @callBack (optional) function 
- @easing (optional) {String || Function} can be any one of pre defined type ['linear','swing','spring'] or custom easing 
- function 
- @return Object which containes promise object and reset function which is used to reset the element with same animation.
*/
var animateRef = animate(elements,styleObj,duration,callBack,easing);
```
Supported Browsers
------------------
* Chrome
* Firefox
* Safari
* Opera
* Internet Explorer 8+
