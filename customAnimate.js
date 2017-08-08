/*
 - @author Chinmoy Samanta (chinmoysamanta.2010@gmail.com).
 - Custom Animate utility. For Small Animation Purpose.
 - @HowToUse :
 - animate(element1, {'margin-left': 100+"px"},1000,function(){
   animate(element2,{height : 330,width : 300,'margin-left' : 45},3000,null,"spring");
 - for more example check this following fiddle.
 - https://jsfiddle.net/ChinmoySamanta1993/dxkuby1n/1/ 
});
*/
"use strict";
(function(win, doc, factory) {
    /*
    - @function name doAnimation
    - @desc This function is globaly exposed by animate name. This is use for intilize all value in global.conf object and push in 
    - global.caller array.
    - @param element {Element object refernce}
    - @param properties {Object} css Style properties
    - @param duration {number} Time duration in ms for animation.
    - @param callBack {Function} . Animation complete callback.
    - @param easing {function or string["swing","linear","spring"]}. Type of easing.
    */
    var doAnimation = function(elements, properties, duration, callBack, easing) {
            var caller = global.caller,
                getUnit = function(str) {
                    var unit;
                    str = str + '';
                    unit = str.match(/[a-z%]+/) || "";
                    (unit === "") && (unit = "px");
                    return unit;
                },
                unitOfpro,
                propertiesValue,
                presentCaller,
                i,
                style,
                promiseData = {
                    promise: null,
                    resolver: null
                },
                Promises = Util.Promise,
                indexOfElementsArray = {
                    index: 0
                },
                presentElement,
                call,
                indexOfPropertiesArray = {
                    index: 0
                },
                j,
                k,
                defaultProperties = [],
                startValue,
                endValue,
                resetFunction;
            // End of variable declaration in doAnimation function.    
            promiseData.promise = new Promises(function(resolve, reject) {
                promiseData.resolver = resolve;
            });
            // If elements and properties is not array, convert to it array.
            (elements.constructor !== Array) && (elements = [elements]);
            (properties.constructor !== Array) && (properties = [properties]);
            caller.push({});
            i = global.index++;
            /* 
            - store the refernce of indexOfElementsArray in indexOfPropertiesArray.
            - if properties array length is greater then 1. This code is written to prevent from written the condition in for loop
            - of elementsarray. We have to match the index of element array with index of properties array.
            - https://stackoverflow.com/questions/1686990/javascript-variable-reference-alias
            */
            (properties.length === 1) ? (indexOfPropertiesArray.index = 0) : (indexOfPropertiesArray = indexOfElementsArray);
            //Caller array containes each instance of animate function.
            for (; i < caller.length; i++) {
                presentCaller = caller[i];
                //call array contains elements array passing to animate function.
                call = presentCaller.call = [];
                for (indexOfElementsArray.index = 0; indexOfElementsArray.index < elements.length; indexOfElementsArray.index++) {
                    j = indexOfElementsArray.index;
                    presentElement = elements[j];
                    call.push({});
                    //pros object in call array containes style property with startvalue, endvalue, unit.
                    call[j].pros = {};
                    k = indexOfPropertiesArray.index;
                    defaultProperties.push({});
                    for (style in properties[k]) {
                        if (properties[k].hasOwnProperty(style)) {
                            propertiesValue = properties[k][style];
                            unitOfpro = getUnit(propertiesValue);
                            startValue = parseInt(Util.getPropertyValue(presentElement, style));
                            endValue = parseInt(properties[k][style]);
                            call[j].pros[style] = {
                                startValue: startValue,
                                endValue: endValue,
                                unit: unitOfpro
                            }
                            defaultProperties[j][style] = startValue;
                        }
                    }
                    call[j].element = presentElement;
                }
                presentCaller.duration = duration;
                presentCaller.callBackModule = callBack;
                presentCaller.resolverModule = promiseData.resolver;
                presentCaller.timeStart = '';
                presentCaller.easingType = easing || "linear";
                presentCaller.elementsArray = elements;
            }
            global.animationState = true;
            ticker(tick);
            (function(elements, defaultProperties, duration, cb, easing) {
                promiseData.promise.reset = function(callBackForReset) {
                    return doAnimation(elements, defaultProperties, duration, callBackForReset, easing);
                };
            })(elements, defaultProperties, duration, easing);
            //promiseData.promise.reset = resetFunction;
            return promiseData.promise;
        },
        Util = factory(doc, win),
        // global object contain all properties which is need for animation.
        global = {
            animationState: false,
            caller: [],
            easing: {
                linear: function(p) {
                    return p;
                },
                swing: function(p) {
                    return 0.5 - Math.cos(p * Math.PI) / 2;
                },
                spring: function(p) {
                    return 1 - (Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6));
                }
            },
            index: 0
        },
        ticker = win.requestAnimationFrame,
        /*
        - This function is passed to requestAnimationFrame.
        - All calls to animate is pushed to global.caller array. And iterate on global.caller array to generate animation.
        */
        tick = function(timestamp) {
            if (timestamp) {
                var timeCurrent = timestamp,
                    caller = global.caller,
                    presentCaller,
                    timeStart,
                    millisecondsEllapsed,
                    percentComplete,
                    tweensContainer,
                    easing,
                    property,
                    tween,
                    tweenDelta,
                    currentValue,
                    i,
                    easingType,
                    element,
                    call;
                // End of variable declaration in tick function.
                // iterate in caller array.    
                for (i = 0; i < caller.length; i++) {
                    presentCaller = caller[i];
                    if (!presentCaller) {
                        continue;
                    }
                    call = presentCaller.call;
                    timeStart = presentCaller.timeStart;
                    easingType = presentCaller.easingType;
                    if (timeStart === '') {
                        timeStart = presentCaller.timeStart = timeCurrent - 16;
                    }
                    millisecondsEllapsed = presentCaller.millisecondsEllapsed = timeCurrent - timeStart;
                    percentComplete = Math.min((millisecondsEllapsed) / presentCaller.duration, 1);
                    easing = (typeof easingType === "string" ? global.easing[easingType] : easingType);
                    // iterate in call array.
                    for (var j = 0, callLength = call.length; j < callLength; j++) {
                        tweensContainer = call[j].pros;
                        element = call[j].element;
                        for (property in tweensContainer) {
                            if (tweensContainer.hasOwnProperty(property)) {
                                tween = tweensContainer[property];
                                if (percentComplete === 1) {
                                    currentValue = (tween.endValue);
                                } else {
                                    tweenDelta = (tween.endValue) - (tween.startValue);
                                    currentValue = (tween.startValue) + (tweenDelta * easing(percentComplete));
                                }
                                tween.currentValue = currentValue;
                                Util.setPropertyValue(element, property, tween.currentValue, tween.unit);
                            }
                        }
                    }
                    if (percentComplete === 1) {
                        completeCall(i);
                    }
                }
                if (global.animationState) {
                    ticker(tick);
                }
            }
        },
        /*
        - @desc Use to complete the queue of global.caller array.
        - @param index {number}
        */
        completeCall = function(index) {
            var presentCaller = global.caller[index],
                resolver = presentCaller.resolverModule,
                element,
                remainingCallsExist = false,
                callsLength = global.caller.length,
                i,
                j;
            element = presentCaller.elementsArray;
            // End of variable declaration in completeCall function.    
            /* 
             - Since this call is complete, set it to false so that the tick function skips it.(For performance reasons, the call is 
             - set to false instead of being deleted from 
             - the array: http://www.html5rocks.com/en/tutorials/speed/v8/) */
            global.caller[index] = false;
            //resolve the promises and callback module
            resolver && resolver(element);
            presentCaller.callBackModule && presentCaller.callBackModule(element);
            for (i = 0; i < global.caller.length; i++) {
                if (global.caller[i] !== false) {
                    remainingCallsExist = true;
                    break;
                }
            }
            if (remainingCallsExist === false) {
                global.index = 0;
                global.animationState = false;
                // Clear the calls array so that its length is reset.
                delete global.caller;
                global.caller = [];
                delete global.elementArray;
                global.elementArray = [];
            }
        };
    win["animate"] = doAnimation;
})(typeof window !== "undefined" ? window : null, typeof document !== "undefined" ? document : null,
    function(doc, win) {
        return {
            /*
            - Use to calculate style value of an element.
            - @param {Element Object} element
            - @param property {string} css style property.
            - @return {string} computed value of css property.
            */
            getPropertyValue: function(element, property) {
                var computedStyle,
                    computedValue,
                    propertyValue;
                computedStyle = win.getComputedStyle(element, null);
                computedValue = computedStyle[property];
                (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) && (propertyValue = 0);
                return computedValue;
            },
            /*
            - Use to set css property value of an element.
            - @param element {Element Object}.
            - @param propertyName {String}.
            - @param propertyValue {number}.
            - @param unit {string} unit of css style value.
            */
            setPropertyValue: function(element, propertyName, propertyValue, unit) {
                element.style[propertyName] = propertyValue + unit;
            },
            /*
            - Promise Method for ployfill of native promise function. For time now only support for resolved callBack.
            - No support for reject callback Module.
            - @return Promise Constructor.
            */
            Promise: (function() {
                /*
                - @constructor for promise utility.
                - @properties
                - _state:
                - _value: value pass to then function.
                - _deferreds: containes callBack function pass to then function.
                - _reset: reset modules of animate function
                */
                var PromiseConstructor = function(fn) {
                        this._state = 0;
                        this._value = undefined;
                        this._deferreds = [];
                        this.reset = undefined;
                        doResolve(fn, this);
                    },
                    /*
                    - Resolve the onSucees callBack function.
                    */
                    doResolve = function(fn, self) {
                        var done = false;
                        fn(function(value) {
                            if (done) return;
                            done = true;
                            resolve(self, value);
                        });
                    },
                    // assign resolved callback in this of PromiseConstructor
                    Handler = function(onFulfilled, promise) {
                        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
                    },
                    // self.state = 0 when assign value into this._deferreds array.
                    handle = function(self, deferred) {
                        if (self._state === 0) {
                            self._deferreds.push(deferred);
                            return;
                        }
                        _immediateFn(function() {
                            var cb = deferred.onFulfilled;
                            if (cb === null) {
                                return;
                            }
                            cb(self._value);
                        });
                    },
                    // self.state = 1 when assign value into this._deferreds array.
                    resolve = function(self, newValue) {
                        self._state = 1;
                        self._value = newValue;
                        finale(self);
                    },
                    // Execute callBack function assign to _deferreds array.
                    finale = function(self) {
                        for (var i = 0, len = self._deferreds.length; i < len; i++) {
                            handle(self, self._deferreds[i]);
                        }
                        self._deferreds = null;
                    },
                    _immediateFn = function(fn) {
                        setTimeout(fn, 0);
                    };
                PromiseConstructor.prototype.then = function(onFulfilled) {
                    handle(this, new Handler(onFulfilled, this));
                    return this;
                };
            return PromiseConstructor;    
            })()
        };
    });