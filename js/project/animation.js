(function (window, undefined) {
    var isFunction = function (o) {
        return Object.prototype.toString.call(o) === "[object Function]";
    };

    var isArray = function (o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    };

    var isObject = function (o) {
        return Object.prototype.toString.call(o) === "[object Object]";
    };

    var now = function () {
        return (new Date()).getTime();
    };

    function Queue() {
    }

    Queue.prototype = {
        init:function () {
            this.queue = [];
        },
        isQueue:true,
        enQueue:function (func) {
            this.queue.push(func);
        },
        deQueue:function () {
            var temp = this.queue.shift(),
                save = true;
            if (isFunction(temp) && temp() === false) {
                save = false;
            } else {
                save = true;
            }
            return {
                front:temp,
                saveToQueue:save
            };
        },
        size:function () {
            return this.queue.length;
        },
        copy:function (queue) {
            if (!!queue && queue.isQueue === true) {
                this.clearQueue();
                for (var i = 0, length = queue.size(); i < length; i++) {
                    this.queue[i] = queue.queue[i];
                }
            }
        },
        clone:function () {
            var theQueue = new Queue();
            theQueue.copy(this);
            return theQueue;
        },
        clearQueue:function () {
            this.init();
        }
    };

    function Timer() {
    }

    Timer.prototype = function () {

        var step = function (queue) {
            if (!queue) {
                return;
            }
            var opt = queue.deQueue(),
                func = opt.front,
                toQueue = opt.saveToQueue;
            if (toQueue === true) {
                queue.enQueue(func);
            }
        };

        var loop = function (timer, delay) {
            delay = delay || 16;
            (function _loop() {
                timer.timeID = setTimeout(_loop, delay);
                step(timer);
                if(timer.queue.length <= 0){
                    timer.pause();
                }
            })();
        };

        this.init = function () {
            Queue.prototype.init.call(this);
            this.timeID = null;
            this.fps = 60;
        };

        this.add = function (func) {
            this.enQueue(func);
            this.resume();
        };

        this.resume = function () {
            if (this.timeID !== null) {
                return;
            }
            var delay = 1000 / this.fps;
            loop(this, delay);
        };

        this.pause = function () {
            if (this.timeID !== null) {
                clearTimeout(this.timeID);
                this.timeID = null;
            }
        };

        return this;
    }.call(new Queue());

    function Animation(setting) {
        if (isObject(setting)) {
            this.from = setting["from"] || 0;
            this.to = setting["to"] || 0;
            this.duration = setting["duration"] || 0;
        }
    }

    Animation.prototype = {
        init:function (easing, callback) {
            this.easing = isFunction(easing) ?
                easing :
                function (s) {
                    return s;
                };
            this.callback = callback || null;
            this.isReady = true;

            return this;
        },
        play:function (timer) {
            if (!timer || !this.isReady) {
                return;
            }
            this.startTime = now();
            this.isFinished = false;

            var _this = this;

            timer.add(function () {
                if(_this.isFinished === true){
                    return false;
                }
                _this.step();
            });

            return this;
        },
        every:function (factory) {
            if (factory && isFunction(factory)) {
                this._updater = factory;
            }
            return this;
        },
        step:function () {
            var current;
            if (now() > this.startTime + this.duration) {
                this._updater.call(this, this.to);
                this.isFinished = true;
                if (!!this.callback) {
                    this.callback.call(this);
                }
            } else {
                current = this.current(this.easing(this.state()));
                this._updater.call(this, current);
            }
        },
        state:function () {
            return (now() - this.startTime) / this.duration;
        },
        current:function (pos) {
            return this.from + (this.to - this.from) * pos;
        },
        stop:function () {
            this.isFinished = true;
            return this;
        }
    };

    window.Timer = Timer;
    window.Animation = Animation;
})(window, undefined);