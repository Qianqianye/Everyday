(function(window, undefined) {
    MOTION = function(duration, delay) {
        this._name = '';

        this._playTime = 0;
        this._time = 0;
        this._duration = (typeof duration === 'undefined') ? 0 : duration;
        this._delayTime = (typeof delay === 'undefined') ? 0 : delay;

        this._repeatTime = 0;
        this._repeatDuration = 0;

        this._reverseTime = 0;

        this._timeScale = 1;

        this._isPlaying = false;
        this._isRepeating = false;
        this._isRepeatingDelay = false;
        this._isReversing = false;
        this._isSeeking = false;

        this._hasController = false;
        this._useOnce = MOTION._useOnce;

        this._onStart = null;
        this._onEnd = null;
        this._onUpdate = null;
        this._onRepeat = null;

        MOTION._add(this);
    };

    MOTION.REVISION = '1';

    MOTION.ABSOLUTE = 'absolute';
    MOTION.RELATIVE = 'relative';

    MOTION.LINEAR = 'linear';
    MOTION.COSINE = 'cosine';
    MOTION.CUBIC = 'cubic';
    MOTION.HERMITE = 'hermite';

    MOTION._motions = [];

    MOTION._performance = (typeof window !== undefined && window.performance !== undefined && window.performance.now !== undefined) ? window.performance : Date;
    MOTION._useOnce = false;
    MOTION._time = 0;
    MOTION._valueMode = MOTION.ABSOLUTE;

    MOTION.valueMode = function(mode) {
        MOTION._valueMode = mode;
    }

    MOTION.playAll = function() {
        for (var i = 0; i < MOTION._motions.length; i++)
            MOTION._motions[i].play();
    };

    MOTION.stopAll = function() {
        for (var i = 0; i < MOTION._motions.length; i++)
            MOTION._motions[i].stop();
    };

    MOTION.resumeAll = function() {
        for (var i = 0; i < MOTION._motions.length; i++)
            MOTION._motions[i].resume();
    };

    MOTION.pauseAll = function() {
        for (var i = 0; i < MOTION._motions.length; i++)
            MOTION._motions[i].pause();
    };

    MOTION.seekAll = function(t) {
        for (var i = 0; i < MOTION._motions.length; i++)
            MOTION._motions[i].seek(t);
    };

    MOTION.repeatAll = function(duration) {
        for (var i = 0; i < MOTION._motions.length; i++)
            MOTION._motions[i].repeat(duration);
    };

    MOTION.reverseAll = function() {
        for (var i = 0; i < MOTION._motions.length; i++)
            MOTION._motions[i].reverse();
    };

    MOTION.timeScaleAll = function(t) {
        for (var i = 0; i < MOTION._motions.length; i++)
            MOTION._motions[i].timeScale(t);
    };

    MOTION.useOnce = function(useOnce) {
        MOTION._useOnce = (typeof useOnce !== 'undefined') ? useOnce : true;

        for (var i = 0; i < MOTION._motions.length; i++)
            MOTION._motions[i].useOnce(MOTION._useOnce);
    };

    MOTION._add = function(child) {
        MOTION._motions.push(child);
    };

    MOTION.remove = function(child) {
        var i = MOTION._motions.indexOf(child);
        MOTION._motions.splice(i, 1);
    };

    MOTION.removeAll = function(child) {
        MOTION._motions = [];
    };

    MOTION.update = function(time) {
        if (typeof time == 'undefined') return false;

        MOTION._time = typeof time !== undefined ? time : this._performance.now();

        for (var i = 0; i < MOTION._motions.length; i++)
            MOTION._motions[i]._update();
    };

    MOTION.autoUpdate = function() {
        _isAutoUpdating = true;

        return this;
    };

    MOTION.noAutoUpdate = function() {
        _isAutoUpdating = false;

        return this;
    };

    MOTION.time = function() {
        return MOTION._time;
    }

    MOTION.isPlaying = function() {
        for (var i = 0; i < MOTION._motions.length; i++)
            if (MOTION._motions[i].isPlaying())
                return true;

        return false;
    };

    MOTION.prototype.constructor = MOTION;

    MOTION.prototype.play = function() {
        this.dispatchStartedEvent();

        this.seek(0);
        this.resume();

        this._repeatTime = 0;

        return this;
    };

    MOTION.prototype.stop = function() {
        this.seek(1);
        this.pause();

        this._repeatTime = 0;

        this.dispatchEndedEvent();

        if (this._useOnce && !this._hasController)
            MOTION.remove(this);
        else
            return this;
    };

    MOTION.prototype.pause = function() {
        this._isPlaying = false;

        this._playTime = this._time;

        return this;
    };

    MOTION.prototype.resume = function() {
        this._isPlaying = true;

        this._playTime = MOTION._time - this._playTime;

        return this;
    };

    MOTION.prototype.seek = function(value) {
        this._isPlaying = false;
        this._isSeeking = true;

        this._playTime = (this._delayTime + this._duration) * value;

        this.setTime(this._playTime);

        this.dispatchChangedEvent();

        this._isSeeking = false;

        return this;
    };

    MOTION.prototype.repeat = function(duration) {
        this._isRepeating = true;
        this._repeatDuration = (typeof duration !== 'undefined') ? duration : 0;

        return this;
    };

    MOTION.prototype.noRepeat = function() {
        this._isRepeating = false;
        this._repeatDuration = 0;

        return this;
    };

    MOTION.prototype.reverse = function() {
        this._isReversing = true;

        return this;
    };

    MOTION.prototype.noReverse = function() {
        this._isReversing = false;

        return this;
    };

    MOTION.prototype._update = function(time) {
        if (this._isPlaying) {
            if (typeof time == 'undefined')
                this._updateTime();
            else
                this.setTime(time);

            this.dispatchChangedEvent();

            if (!this._isInsidePlayingTime(this._time) && !this._isInsideDelayingTime(this._time)) {
                this._reverseTime = (this._reverseTime === 0) ? this._duration : 0;

                if (this._isRepeating && (this._repeatDuration === 0 || this._repeatTime < this._repeatDuration)) {
                    this.seek(0);
                    this.resume();

                    this._repeatTime++;

                    if (!this._isRepeatingDelay)
                        this._delayTime = 0;

                    this.dispatchRepeatedEvent();
                } else {

                    this.stop();
                }
            }
        }
    };

    MOTION.prototype._updateTime = function() {
        this._time = (MOTION._time - this._playTime) * this._timeScale;

        if (this._isReversing && this._reverseTime !== 0)
            this._time = this._reverseTime - this._time;
    };

    MOTION.prototype.setName = function(name) {
        this._name = name;

        return this;
    };

    MOTION.prototype.name = MOTION.prototype.setName;

    MOTION.prototype.getName = function() {
        return this._name;
    };

    MOTION.prototype.setTime = function(time) {
        this._time = time * this._timeScale;

        if (this._isReversing && this._reverseTime !== 0) this._time = this._reverseTime - this._time;

        return this;
    };

    MOTION.prototype.getTime = function() {
        return (this._time < this._delayTime) ? 0 : (this._time - this._delayTime);
    };

    MOTION.prototype.time = MOTION.prototype.getTime;

    MOTION.prototype.setTimeScale = function(timeScale) {
        this._timeScale = timeScale;

        return this;
    };

    MOTION.prototype.timeScale = MOTION.prototype.setTimeScale;

    MOTION.prototype.getTimeScale = function() {
        return this._timeScale;
    };

    MOTION.prototype.getPosition = function() {
        return this.getTime() / this._duration;
    };

    MOTION.prototype.position = MOTION.prototype.getPosition;

    MOTION.prototype.setDuration = function(_duration) {
        this._duration = _duration;

        return this;
    };

    MOTION.prototype.getDuration = function() {
        return this._duration;
    };

    MOTION.prototype.duration = MOTION.prototype.getDuration;

    MOTION.prototype.getRepeatTime = function() {
        return this._repeatTime;
    };

    MOTION.prototype.repeatTime = MOTION.prototype.getRepeatTime;

    MOTION.prototype.setDelay = function(delay) {
        this._delayTime = delay;

        return this;
    };

    MOTION.prototype.delay = MOTION.prototype.setDelay;

    MOTION.prototype.noDelay = function() {
        this._delayTime = 0;

        return this;
    };

    MOTION.prototype.getDelay = function() {
        return this._delayTime;
    };

    MOTION.prototype.repeatDelay = function(duration) {
        this.repeat(duration);
        this._isRepeatingDelay = true;

        return this;
    };

    MOTION.prototype.noRepeatDelay = function() {
        this.noRepeat();
        this._isRepeatingDelay = false;

        return this;
    };

    MOTION.prototype.isDelaying = function() {
        return (this._time <= this._delayTime);
    };

    MOTION.prototype.isPlaying = function() {
        return this._isPlaying;
    };

    MOTION.prototype._isInsideDelayingTime = function(value) {
        return (value >= 0 && value < this._delayTime);
    };

    MOTION.prototype._isInsidePlayingTime = function(value) {
        return (value >= this._delayTime && value < this._delayTime + this._duration);
    };

    MOTION.prototype._isAbovePlayingTime = function(value) {
        return value >= this._delayTime + this._duration;
    };

    MOTION.prototype.useOnce = function(useOnce) {
        this._useOnce = (typeof useOnce !== 'undefined') ? useOnce : true;

        return this;
    }

    MOTION._map = function(n, start1, end1, start2, end2) {
        return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
    };

    MOTION.prototype.onStart = function(func) {
        this._onStart = func;

        return this;
    };

    MOTION.prototype.onEnd = function(func) {
        this._onEnd = func;

        return this;
    };

    MOTION.prototype.onUpdate = function(func) {
        this._onUpdate = func;

        return this;
    };

    MOTION.prototype.onRepeat = function(func) {
        this._onRepeat = func;

        return this;
    };

    MOTION.prototype.dispatchStartedEvent = function() {
        if (this._onStart)
            this._onStart();
    };

    MOTION.prototype.dispatchEndedEvent = function() {
        if (this._onEnd)
            this._onEnd();
    };

    MOTION.prototype.dispatchChangedEvent = function() {
        if (this._onUpdate)
            this._onUpdate();
    };

    MOTION.prototype.dispatchRepeatedEvent = function() {
        if (this._onRepeat)
            this._onRepeat();
    };

    window.MOTION = MOTION;

    if (typeof Object.create != 'function') {
        Object.create = (function() {
            var Object = function() {};
            return function(prototype) {
                if (arguments.length > 1) {
                    throw Error('Second argument not supported');
                }
                if (typeof prototype != 'object') {
                    throw TypeError('Argument must be an object');
                }
                Object.prototype = prototype;
                var result = new Object();
                Object.prototype = null;
                return result;
            };
        })();
    }
})(window);;(function(MOTION, undefined) {    
    MOTION.Easing = function() {};

    MOTION.Easing.Quad = function() {};
    MOTION.Easing.Quad.In = function(t) {
        return (t /= 1) * t;
    };
    MOTION.Easing.Quad.Out = function(t) {
        return -(t /= 1) * (t - 2);
    };
    MOTION.Easing.Quad.InOut = function(t) {
        if ((t /= 1 / 2) < 1) return .5 * t * t;
        return -.5 * ((--t) * (t - 2) - 1);
    };

    MOTION.Easing.Cubic = function() {};
    MOTION.Easing.Cubic.In = function(t) {
        return (t /= 1) * t * t;
    };
    MOTION.Easing.Cubic.Out = function(t) {
        return ((t = t / 1 - 1) * t * t + 1);
    };
    MOTION.Easing.Cubic.InOut = function(t) {
        if ((t /= 1 / 2) < 1) return .5 * t * t * t;
        return .5 * ((t -= 2) * t * t + 2);
    };

    MOTION.Easing.Quart = function() {};
    MOTION.Easing.Quart.In = function(t) {
        return (t /= 1) * t * t * t;
    };
    MOTION.Easing.Quart.Out = function(t) {
        return -((t = t / 1 - 1) * t * t * t - 1);
    };
    MOTION.Easing.Quart.InOut = function(t) {
        if ((t /= 1 / 2) < 1) return .5 * t * t * t * t;
        return -.5 * ((t -= 2) * t * t * t - 2);
    };

    MOTION.Easing.Quint = function() {};
    MOTION.Easing.Quint.In = function(t) {
        return (t /= 1) * t * t * t * t;
    };
    MOTION.Easing.Quint.Out = function(t) {
        return ((t = t / 1 - 1) * t * t * t * t + 1);
    };
    MOTION.Easing.Quint.InOut = function(t) {
        if ((t /= 1 / 2) < 1) return .5 * t * t * t * t * t;
        return .5 * ((t -= 2) * t * t * t * t + 2);
    };

    MOTION.Easing.Sine = function() {};
    MOTION.Easing.Sine.In = function(t) {
        return -Math.cos(t / 1 * (Math.PI / 2)) + 1;
    };
    MOTION.Easing.Sine.Out = function(t) {
        return Math.sin(t / 1 * (Math.PI / 2));
    };
    MOTION.Easing.Sine.InOut = function(t) {
        return -.5 * (Math.cos(Math.PI * t / 1) - 1);
    };

    MOTION.Easing.Expo = function() {};
    MOTION.Easing.Expo.In = function(t) {
        return (t == 0) ? 0 : Math.pow(2, 10 * (t / 1 - 1));
    };
    MOTION.Easing.Expo.Out = function(t) {
        return (t == 1) ? 1 : (-Math.pow(2, -10 * t / 1) + 1);
    };
    MOTION.Easing.Expo.InOut = function(t) {
        if (t == 0) return 0;
        if (t == 1) return 1;
        if ((t /= 1 / 2) < 1) return .5 * Math.pow(2, 10 * (t - 1));
        return .5 * (-Math.pow(2, -10 * --t) + 2);
    };

    MOTION.Easing.Circ = function() {};
    MOTION.Easing.Circ.In = function(t) {
        return -(Math.sqrt(1 - (t /= 1) * t) - 1);
    };
    MOTION.Easing.Circ.Out = function(t) {
        return Math.sqrt(1 - (t = t / 1 - 1) * t);
    };
    MOTION.Easing.Circ.InOut = function(t) {
        if ((t /= 1 / 2) < 1) return -.5 * (Math.sqrt(1 - t * t) - 1);
        return .5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    };

    MOTION.Easing.Elastic = function() {};
    MOTION.Easing.Elastic.In = function(t) {
        var s = 1.70158;
        var p = 0;
        var a = 1;
        if (t == 0) return 0;
        if ((t /= 1) == 1) return 1;
        if (!p) p = .3;
        if (a < Math.abs(1)) {
            a = 1;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(1 / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
    };
    MOTION.Easing.Elastic.Out = function(t) {
        var s = 1.70158;
        var p = 0;
        var a = 1;
        if (t == 0) return 0;
        if ((t /= 1) == 1) return 1;
        if (!p) p = .3;
        if (a < Math.abs(1)) {
            a = 1;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(1 / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
    };
    MOTION.Easing.Elastic.InOut = function(t) {
        var s = 1.70158;
        var p = 0;
        var a = 1;
        if (t == 0) return 0;
        if ((t /= 1 / 2) == 2) return 1;
        if (!p) p = (.3 * 1.5);
        if (a < Math.abs(1)) {
            a = 1;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(1 / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * .5 + 1;
    };

    MOTION.Easing.Back = function() {};
    MOTION.Easing.Back.In = function(t, s) {
        if (s == undefined) s = 1.70158;
        return (t /= 1) * t * ((s + 1) * t - s);
    };
    MOTION.Easing.Back.Out = function(t, s) {
        if (s == undefined) s = 1.70158;
        return ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
    };
    MOTION.Easing.Back.InOut = function(t, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= 1 / 2) < 1) return .5 * (t * t * (((s *= (1.525)) + 1) * t - s));
        return .5 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
    };

    MOTION.Easing.Bounce = function() {};
    MOTION.Easing.Bounce.In = function(t) {
        return 1 - MOTION.Easing.Bounce.Out(1 - t, 0);
    };
    MOTION.Easing.Bounce.Out = function(t) {
        if ((t /= 1) < (1 / 2.75)) {
            return (7.5625 * t * t);
        } else if (t < (2 / 2.75)) {
            return (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
        } else if (t < (2.5 / 2.75)) {
            return (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
        } else {
            return (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
        }
    };
    MOTION.Easing.Bounce.InOut = function(t) {
        if (t < .5) return MOTION.Easing.Bounce.In(t * 2, 0) * .5;
        return MOTION.Easing.Bounce.Out(t * 2 - 1, 0) * .5 + .5;
    };

    MOTION.Quad = MOTION.Easing.Quad;
    MOTION.Cubic = MOTION.Easing.Cubic;
    MOTION.Quart = MOTION.Easing.Quart;
    MOTION.Quint = MOTION.Easing.Quint;
    MOTION.Sine = MOTION.Easing.Sine;
    MOTION.Expo = MOTION.Easing.Expo;
    MOTION.Circ = MOTION.Easing.Circ;
    MOTION.Elastic = MOTION.Easing.Elastic;
    MOTION.Back = MOTION.Easing.Back;
    MOTION.Bounce = MOTION.Easing.Bounce;
})(MOTION);;(function(MOTION, undefined) {
    MOTION.Interoplation = function() {}

    MOTION.Interoplation.Linear = function(t, y1, y2) {
        // debugger
        if (y1 instanceof Array) {
            y2 = y1[2];
            y1 = y1[1];
        }
        return (y1 * (1 - t) + y2 * t);
    };

    // MOTION.Interoplation.Smoothstep = function(t,y1, y2) {
    //     // return (y1 * (1 - t) + y2 * t);
    //     // ((x) * (x) * (3 - 2 * (x)))
    // };

    MOTION.Interoplation.Cosine = function(t, y1, y2) {
        if (y1 instanceof Array) {
            y2 = y1[2];
            y1 = y1[1];
        }

        var t2 = (1 - PApplet.cos(t * PConstants.PI)) / 2;
        return (y1 * (1 - t2) + y2 * t2);
    };

    MOTION.Interoplation.Cubic = function(t, y0, y1, y2, y3) {
        // debugger
        if (y0 instanceof Array) {
            y1 = y0[1];
            y2 = y0[2];
            y3 = y0[3];
            y0 = y0[0];
        }

        var a0, a1, a2, a3, t2;
        t2 = t * t;
        a0 = y3 - y2 - y0 + y1;
        a1 = y0 - y1 - a0;
        a2 = y2 - y0;
        a3 = y1;
        //http://paulbourke.net/miscellaneous/interpolation/
        //     a0 = -0.5*y0 + 1.5*y1 - 1.5*y2 + 0.5*y3;
        // a1 = y0 - 2.5*y1 + 2*y2 - 0.5*y3;
        // a2 = -0.5*y0 + 0.5*y2;
        // a3 = y1;
        return (a0 * t * t2 + a1 * t2 + a2 * t + a3);
    };

    /*
     * Tension: 1 is high, 0 normal, -1 is low Bias: 0 is even, positive is
     * towards first segment, negative towards the other
     */
    MOTION.Interoplation.Hermite = function(t, y0, y1, y2, y3, tension, bias) {
        if (tension == undefined) tension = 0;
        if (bias == undefined) bias = 0;

        if (y0 instanceof Array) {
            y1 = y0[1];
            y2 = y0[2];
            y3 = y0[3];
            y0 = y0[0];
        }

        var m0, m1, t2, t3;
        var a0, a1, a2, a3;
        t2 = t * t;
        t3 = t2 * t;
        m0 = (y1 - y0) * (1 + bias) * (1 - tension) / 2;
        m0 += (y2 - y1) * (1 - bias) * (1 - tension) / 2;
        m1 = (y2 - y1) * (1 + bias) * (1 - tension) / 2;
        m1 += (y3 - y2) * (1 - bias) * (1 - tension) / 2;
        a0 = 2 * t3 - 3 * t2 + 1;
        a1 = t3 - 2 * t2 + t;
        a2 = t3 - t2;
        a3 = -2 * t3 + 3 * t2;
        return (a0 * y1 + a1 * m0 + a2 * m1 + a3 * y2);
    }; 

    MOTION.Interoplation.getInterpolationAt = function(t, points, interpolation) {
        if (interpolation == undefined) interpolation = MOTION.Interoplation.Hermite;  

        var segmentLength = 1 / points.length
        var segmentIndex = Math.floor(MOTION._map(t, 0, 1, 0, points.length));
        var segmentT = MOTION._map(t, segmentIndex * segmentLength, (segmentIndex + 1) * segmentLength, 0, 1);

        var segmentLength = 1 / points.length
        var segmentIndex = Math.floor(MOTION._map(t, 0, 1, 0, points.length));

        var p1, p2, p3, p4;

        p2 = points[segmentIndex];
        p3 = points[segmentIndex + 1]; 

        if (segmentIndex == 0) {
            var segmentBegin = points[0];
            var segmentEnd = points[1];
            var segmentSlope = segmentEnd - segmentBegin;
            p1 = segmentEnd - segmentSlope;
        } else 
            p1 = points[segmentIndex - 1]; 

        if (segmentIndex == points.length - 2) {
            var segmentBegin = points[points.length - 2];
            var segmentEnd = points[points.length - 1];
            var segmentSlope = segmentEnd - segmentBegin;
            p4 = segmentEnd + segmentSlope;
        } else 
            p4 = points[segmentIndex + 2]; 
 
        return interpolation(segmentT, [p1, p2, p3, p4])
    }
})(MOTION);
;(function(MOTION, undefined) {
    MOTION.MotionController = function(motions) {
        MOTION.call(this);

        this._motions = [];
        this._valueMode = null;

        if (motions) this.addAll(motions);
    };

    MOTION.MotionController.prototype = Object.create(MOTION.prototype);
    MOTION.MotionController.prototype.constructor = MOTION.MotionController;

    MOTION.MotionController.prototype.reverse = function() {
        MOTION.prototype.reverse.call(this);

        for (var i = 0; i < this._motions.length; i++)
            this._motions[i].reverse();

        return this;
    };

    MOTION.MotionController.prototype._updateMotions = function() {
        for (var i = 0; i < this._motions.length; i++) {
            var m = this._motions[i];

            if (this._isSeeking) {
                if (m._isInsidePlayingTime(this.getTime()))
                    m.seek(MOTION._map(this.getTime(), 0, m.getDelay() + m.getDuration(), 0, 1));
                else if (m._isAbovePlayingTime(this.getTime()))
                    m.seek(1);
                else
                    m.seek(0);
            } else if (m._isInsidePlayingTime(this.getTime())) {
                if (m.isPlaying())
                    m._update(this.getTime(), false);
                else
                    m.play();
            } else if (m.isPlaying())
                m.stop();
        }
    };

    MOTION.MotionController.prototype._updateDuration = function() {
        for (var i = 0; i < this._motions.length; i++)
            this._duration = Math.max(this._duration, this._motions[i].getDelay() + this._motions[i].getDuration());
    };

    MOTION.MotionController.prototype.getPosition = function() {
        return this.getTime() / this._duration;
    };

    MOTION.MotionController.prototype.get = function(name) {
        if (typeof arguments[0] === 'number') {
            return this._motions[arguments[0]];
        } else if (typeof arguments[0] === 'string') {
            for (var j = 0; j < this._motions.length; j++)
                if (this._motions[j]._name === arguments[0])
                    return this._motions[j];
        }

        return this._motions;
    };

    MOTION.MotionController.prototype.getFirst = function() {
        return this._motions[0];
    }

    MOTION.MotionController.prototype.first = MOTION.MotionController.prototype.getFirst;

    MOTION.MotionController.prototype.getLast = function() {
        return this._motions[this._motions.length];
    }

    MOTION.MotionController.prototype.last = MOTION.MotionController.prototype.getLast;

    MOTION.MotionController.prototype.getCount = function() {
        return this._motions.length;
    };

    MOTION.MotionController.prototype.count = MOTION.MotionController.prototype.getCount;

    MOTION.MotionController.prototype.setEasing = function(easing) {
        this._easing = (typeof easing == 'undefined') ? (function(t) {
            return t;
        }) : easing;

        for (var i = 0; i < this._motions.length; i++) {
            if (this._motions[i] instanceof MOTION.Tween) {
                this._motions[i].easing(this._easing);
            }
        }

        return this;
    };

    MOTION.MotionController.prototype.easing = MOTION.MotionController.prototype.setEasing;

    MOTION.MotionController.prototype.getEasing = function() {
        return this._easing;
    };

    MOTION.MotionController.prototype.add = function(motion) {
        this.insert(motion, 0);
        return this;
    };

    MOTION.MotionController.prototype.insert = function(motion, time) {
        motion.delay(time);
        // if (this._valueMode) motion.valueMode(this._valueMode);
        motion._hasController = true;

        this._motions.push(motion);

        MOTION.remove(motion);

        this._updateDuration();

        return this;
    };

    MOTION.MotionController.prototype.remove = function(motion) {
        var i;

        if (typeof arguments[0] === 'number') {
            i = arguments[0];
        } else if (typeof arguments[0] === 'string') {
            for (var j = 0; j < this._motions.length; j++)
                if (this._motions[j]._name === arguments[0])
                    motion = this._motions[j];
        } else if (typeof arguments[0] === 'object') {
            i = this._motions.indexOf(motion);
        }

        if (i != -1) {
            this._motions.splice(i, 1);
            this._updateDuration();
        }

        return this;
    };

    MOTION.MotionController.prototype.addAll = function(motions) {
        for (var i = 0; i < motions.length; i++)
            this.add(motions[i]);

        return this;
    };

    MOTION.MotionController.prototype.removeAll = function() {
        for (var i = 0; i < this._motions.length; i++)
            this.remove(this._motions[i]);

        return this;
    };

    MOTION.MotionController.prototype.dispatchChangedEvent = function() {
        this._updateMotions();
        MOTION.prototype.dispatchChangedEvent.call(this);
    };
})(MOTION)
;(function(MOTION, undefined) {
    MOTION.Parallel = function(motions) {
        MOTION.MotionController.call(this, name, motions);
    };

    MOTION.Parallel.prototype = Object.create(MOTION.MotionController.prototype);
    MOTION.Parallel.prototype.constructor = MOTION.Parallel;

    MOTION.Parallel.prototype._updateMotions = function() {
        for (var i = 0; i < this._motions.length; i++) {
            var m = this._motions[i];

            if (this._isSeeking) {
                if (m._isInsidePlayingTime(this.getTime()))
                    m.seek(MOTION._map(this.getTime(), 0, m.getDelay() + m.getDuration(), 0, 1));
                else if (m._isAbovePlayingTime(this.getTime()))
                    m.seek(1);
                else
                    m.seek(0);
            } else if (m._isInsidePlayingTime(this.getTime())) {
                if (m.isPlaying())
                    m._update(this.getTime(), false);
                else
                    m.play();
            } else if (m.isPlaying()) {
                if (this._isReversing && i < this._motions.length - 1)
                    m.seek(1);
                else
                    for (var i = 0; i < this._motions.length; i++)
                        this._motions[i].stop();
            }
        }
    };
})(MOTION);
;(function(MOTION, undefined) {

    MOTION._properties = [];

    MOTION.Property = function(object, field, values) {
        this._object = (typeof arguments[0] == 'object') ? object : window;
        this._field = (typeof arguments[1] == 'string') ? field : arguments[0];
        
        this._order = MOTION._properties.filter(function(d) { 
            return d._object == this._object && d._field == this._field;
        }, this).length; 

        this._isArray = false;
        this._isPath = false;

        var values = (typeof arguments[1] == 'string') ? values : arguments[1];

        if (values instanceof Array) {
            //it'll either be interpolating between 2 arrays or through multiple points
            if (values.length == 2) {
                //interpolates between a start and end number or number values/properties of a custom color or vector object;
                //(window, 'x', [0,1]) or (window, 'x', [[0,0,0],[1,2,3])
                this._start = values[0];
                this._end = values[1]
                this._isArray = values[0] instanceof Array && values[1] instanceof Array;
            } else {
                if (this._object[this._field] instanceof Array) {
                    this._start = (this._object[this._field].length == 0) ? new Array(values.length) : this._object[this._field];
                    this._end = values;
                    this._isArray = true;
                } else {
                    //interpolates through an array of values as a path   
                    //(window, 'x', [0,1,2,3,4])
                    this._start = values[0];
                    this._end = values
                    this._isPath = true;
                }
            }
        } else {
            //it'll either interpolating between a number or number values/properties of a custom color or vector object
            //(window, 'x', 1) 
            this._start = (typeof this._object[this._field] == 'undefined') ? 0 : this._object[this._field];
            this._end = values;
        }
 
        MOTION._properties.push(this);
    };

    MOTION.Property.prototype.update = function(t, easing, interoplation) {
        // if ((t > 0 && t <= 1) || (t == 0 && this._order == 1)) {
        if (this._isArray) {
            var a = [];
            for (var i = 0; i < this._start.length; i++)
                a.push(MOTION.Interoplation.Linear(easing(t), this._start[i], this._end[i]));
            this._object[this._field] = a;
        } else if (this._isPath)
            this._object[this._field] = MOTION.Interoplation.getInterpolationAt(easing(t), this._end, interoplation);
        else
            this._object[this._field] = MOTION.Interoplation.Linear(easing(t), this._start, this._end);
        // } else {}
    };

    MOTION.Property.prototype.getStart = function() {
        return this._start;
    };

    MOTION.Property.prototype.setStart = function(start) {
        if (typeof start === 'undefined') {
            debugger
            if (typeof this._object[this._field] === 'undefined')
                this._start = 0;
            else
                this._start = this._object[this._field];
        } else
            this._start = start;

        return this;
    };

    MOTION.Property.prototype.start = MOTION.Property.prototype.setStart;

    MOTION.Property.prototype.getEnd = function() {
        return this._end;
    };

    MOTION.Property.prototype.setEnd = function(end) {
        this._end = end;
        return this;
    };

    MOTION.Property.prototype.end = MOTION.Property.prototype.setEnd;

    MOTION.Property.prototype.getValue = function() {
        return this._object[this._field];
    };

    MOTION.Property.prototype.value = MOTION.Property.prototype.getValue;
})(MOTION);
;(function(MOTION, undefined) {
    MOTION.Sequence = function(children) {
        MOTION.MotionController.call(this, children);

        this._current = null;
        this._currentIndex = 0;
    };

    MOTION.Sequence.prototype = Object.create(MOTION.MotionController.prototype);
    MOTION.Sequence.prototype.constructor = MOTION.Sequence;

    MOTION.Sequence.prototype.add = function(child) {
        MOTION.MotionController.prototype.insert.call(this, child, this._duration);

        return this;
    };

    MOTION.Sequence.prototype.getCurrentIndex = function() {
        return this._currentIndex;
    };

    MOTION.Sequence.prototype.currentIndex = MOTION.Sequence.prototype.getCurrentIndex;

    MOTION.Sequence.prototype.getCurrent = function() {
        return this._current;
    };

    MOTION.Sequence.prototype.current = MOTION.Sequence.prototype.getCurrent;

    MOTION.MotionController.prototype.dispatchStartedEvent = function() {
        this._current = null;
        this._currentIndex = 0;

        MOTION.prototype.dispatchStartedEvent.call(this)
    };

    MOTION.MotionController.prototype.dispatchChangedEvent = function() {
        this._updateMotions();

        if (this._isPlaying) {
            for (var i = 0; i < this._motions.length; i++) {
                var c = this._motions[i];

                if (c._isInsidePlayingTime(this._time)) {
                    this._currentIndex = i;
                    this._current = c;

                    break;
                }
            }
        }

        MOTION.prototype.dispatchChangedEvent.call(this)
    };

    MOTION.MotionController.prototype.dispatchRepeatedEvent = function() {
        this._current = null;
        this._currentIndex = 0;

        MOTION.prototype.dispatchRepeatedEvent.call(this)
    };
})(MOTION);
;(function(MOTION, undefined) {
    MOTION.Keyframe = function(time, motions) {
        MOTION.MotionController.call(this, motions)
        this.delay(time);
    };

    MOTION.Keyframe.prototype = Object.create(MOTION.MotionController.prototype);
    MOTION.Keyframe.prototype.constructor = MOTION.Keyframe;

    MOTION.Timeline = function() {
        MOTION.MotionController.call(this);
    };

    MOTION.Timeline.prototype = Object.create(MOTION.MotionController.prototype);
    MOTION.Timeline.prototype.constructor = MOTION.Timeline;


    MOTION.Timeline.prototype.play = function(time) { 
        if (typeof arguments[0] == 'undefined') {
            MOTION.MotionController.prototype.play.call(this);
        } else if (typeof arguments[0] == 'number') {
            this.seek(arguments[0] / this._duration);
            this.resume();
        } else if (typeof arguments[0] == 'string') {
            for (var i = 0; i < this._motions.length; i++)
                if (this._motions[i]._name === arguments[0]) {
                    this.seek(this._motions[i] / this._duration);
                    this.resume();
                }
        } else if (typeof arguments[0] == 'object') {
            this.seek(arguments[0].getPlayTime() / this._duration);
            this.resume();
        }

        return this;
    };

    MOTION.Timeline.prototype.stop = function(time) {
        if (typeof arguments[0] == 'undefined')
            MOTION.MotionController.prototype.stop.call(this);
        else if (typeof arguments[0] == 'number') {
            this.seek(arguments[0] / this._duration);
            this.pause();
        } else if (typeof arguments[0] == 'string') {
            for (var i = 0; i < this._motions.length; i++)
                if (this._motions[i]._name === arguments[0]) {
                    this.seek(this._motions[i] / this._duration);
                    this.pause();
                }
        } else if (typeof arguments[0] == 'object') {
            this.seek(arguments[0].getPlayTime() / this._duration);
            this.pause();
        }

        return this;
    };

    MOTION.Timeline.prototype.add = function(motion, time) {
        if (motion instanceof MOTION.Keyframe) {
            if (typeof time == 'undefined')
                this.insert(motion, motion.getDelay());
            else
                this.insert(motion, time);
        } else {
            if (typeof time == 'undefined') {
                this._motions[this._motions.indexOf(c)] = c;
            } else {
                var key = time + '';

                var k = new MOTION.Keyframe(time + '');
                k.add(motion);

                this.insert(k, time);
            }
        }

        return this;
    };

    MOTION.Timeline.prototype.getCurrent = function(index) {
        var current = [];

        for (var i = 0; i < this._motions.length; i++)
            if (this._motions[i].isInsidePlayingTime(this.getTime()))
                current.push(this._motions[i]);

        if (current.length == 0)
            return null;
        else
            return current;
    };

    MOTION.Timeline.prototype.current = MOTION.Timeline.prototype.getCurrent
})(MOTION)
;(function(MOTION, undefined) {
    MOTION.Tween = function(object, property, end, duration, delay, easing) {
        this._properties = [];;

        this._easing = function(t) {
            return t;
        };
        this._interpolation = MOTION.Interoplation.Hermite;

        if (typeof arguments[0] === 'object') {
            MOTION.call(this, arguments[3], arguments[4]);
            this.addProperty(arguments[0], arguments[1], arguments[2]);

            if (typeof arguments[5] !== 'undefined')
                this.setEasing(arguments[5]);
        } else if (typeof arguments[0] === 'string') {
            MOTION.call(this, arguments[2], arguments[3]);
            this.addProperty(arguments[0], arguments[1]);

            if (typeof arguments[4] !== 'undefined')
                this.setEasing(arguments[4]);
        } else {
            MOTION.call(this, arguments[0], arguments[1]);

            if (typeof arguments[2] !== 'undefined')
                this.setEasing(arguments[2]);
        }
    };

    MOTION.Tween.prototype = Object.create(MOTION.prototype);
    MOTION.Tween.prototype.constrctor = MOTION.Tween;

    MOTION.Tween.prototype._updateProperties = function() {
        for (var i = 0; i < this._properties.length; i++)
            this._properties[i].update(this.position(), this._easing, this._interpolation);
    };

    MOTION.Tween.prototype.addProperty = function(object, property, values) {
        if (arguments[0] instanceof MOTION.Property)
            this._properties.push(arguments[0]);
        else if (typeof arguments[0] === 'object')
            this._properties.push(new MOTION.Property(object, property, values));
        else
            this._properties.push(new MOTION.Property(arguments[0], arguments[1]));

        return this;
    };

    MOTION.Tween.prototype.add = MOTION.Tween.prototype.addProperty;

    MOTION.Tween.prototype.remove = function(child) {
        var i;

        if (typeof arguments[0] === 'number') {
            i = arguments[0];
        } else if (typeof arguments[0] === 'name') {
            i = this._properties.indexOf(property);
        } else if (typeof arguments[0] === 'object') {
            for (var j = 0; j < this._properties.length; j++)
                if (this._properties[j]._field === arguments[0])
                    j = i;
        }

        if (i && i != -1)
            this._properties.splice(i, 1);

        return this;
    };

    MOTION.Tween.prototype.getProperty = function() {
        if (typeof arguments[0] === 'string') {
            for (var j = 0; j < this._properties.length; j++)
                if (this._properties[j]._field === arguments[0])
                    return this._properties[j];
        } else if (typeof arguments[0] === 'number') {
            return this._properties[arguments[0]];
        } else {
            return this._properties;
        }
    };

    MOTION.Tween.prototype.get = MOTION.Tween.prototype.getProperty;

    MOTION.Tween.prototype.getFirstProperty = function() {
        return this._properties[0];
    }

    MOTION.Tween.prototype.first = MOTION.Tween.prototype.getFirstProperty;

    MOTION.Tween.prototype.getLastProperty = function() {
        return this._properties[this._properties.length];
    }

    MOTION.Tween.prototype.last = MOTION.Tween.prototype.getLastProperty;

    MOTION.Tween.prototype.getCount = function() {
        return this._properties.length;
    };

    MOTION.Tween.prototype.count = MOTION.Tween.prototype.getCount;

    MOTION.Tween.prototype.setEasing = function(easing) {
        this._easing = easing;
        return this;
    };

    MOTION.Tween.prototype.easing = MOTION.Tween.prototype.setEasing;

    MOTION.Tween.prototype.getEasing = function() {
        return this._easing;
    };

    MOTION.Tween.prototype.noEasing = function() {
        this._easing = function(t) {
            return t;
        };
        return this;
    };

    MOTION.Tween.prototype.setInterpolation = function(inpterpolation) {
        this._interpolation = inpterpolation;
        return this;
    };

    MOTION.Tween.prototype.interpolation = MOTION.Tween.prototype.setInterpolation;

    MOTION.Tween.prototype.getInterpolation = function() {
        return this._interpolation;
    };

    MOTION.Tween.prototype.relative = function() {
        this.setValueMode(MOTION.RELATIVE);

        return this;
    };

    MOTION.Tween.prototype.absolute = function() {
        this.setValueMode(MOTION.ABSOLUTE);

        return this;
    };

    MOTION.Tween.prototype.setValueMode = function(_valueMode) {
        this._valueMode = _valueMode;

        return this;
    };

    MOTION.Tween.prototype.valueMode = MOTION.Tween.prototype.setValueMode;

    MOTION.Tween.prototype.getValueMode = function() {
        return this._valueMode;
    };

    MOTION.Tween.prototype.dispatchStartedEvent = function() {
        if (this._valueMode == MOTION.RELATIVE)
            for (var i = 0; i < this._properties.length; i++) 
                this._properties[i].setStart(); 

        if (this._onStart)
            this._onStart(this._object);
    };

    MOTION.Tween.prototype.dispatchEndedEvent = function() {
        if (this._onEnd)
            this._onEnd(this._object);
    };

    MOTION.Tween.prototype.dispatchChangedEvent = function() {
        this._updateProperties();

        if (this._onUpdate)
            this._onUpdate(this._object);
    };

    MOTION.Tween.prototype.dispatchRepeatedEvent = function() {
        if (this._onRepeat)
            this._onRepeat(this._object);
    };
})(MOTION);
