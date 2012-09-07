(function ($, window, undefined) {
    $.fn.drag = function (root, setting) {
        var sx,
            sy,
            msx,
            msy,
            ox = 0,
            oy = 0,
            maxX,
            maxY,
            minX,
            minY,
            xMode = false,
            yMode = false,
            xReverse = false,
            yReverse = false,
            onDragStart,
            onDrag,
            onDragEnd,
            $obj = $(root || this),
            $dom = $(document),
            frameID = null,
            allowMoving = true;
        if (!!setting) {
            ox = setting.ox || 0;
            oy = setting.oy || 0;
            xReverse = setting.xReverse || false;
            yReverse = setting.yReverse || false;
            xMode = setting.xMode || false;
            yMode = setting.yMode || false;
            maxX = setting.maxX;
            minX = setting.minX;
            minY = setting.minY;
            maxY = setting.maxY;
            onDragStart = setting.onDragStart;
            onDrag = setting.onDrag;
            onDragEnd = setting.onDragEnd;
        }
        function start(e) {
            sx = parseFloat($obj.css("left")) || ox || 0;
            sy = parseFloat($obj.css("top")) || oy || 0;
            msx = e.pageX;
            msy = e.pageY;
            addDragEvents();
            !onDragStart || onDragStart.call(this, sx, sy, msy, msy);
            return false;
        }

        function _move(e) {
            var x, y;
            var dx = yMode === true ? 0 : e.pageX - msx;
            var dy = xMode === true ? 0 : e.pageY - msy;
            dx = xReverse ? -dx : dx;
            dy = yReverse ? -dy : dy;
            x = dx + sx;
            y = dy + sy;
            x = minX !== undefined && x < minX ? minX : x;
            x = maxX !== undefined && x > maxX ? maxX : x;
            y = minY !== undefined && y < minY ? minY : y;
            y = maxY !== undefined && y > maxY ? maxY : y;
            $obj.css({"left":x});
            $obj.css({"top":y});
            !onDrag || onDrag.call($obj, sx, sy, e.pageX - msx, e.pageY - msy);
        }

        function move(e) {
            if(allowMoving === true){
                //lock the frame
                allowMoving = false;
                frameID = requestAnimationFrame(function () {
                    _move(e);
                    //release the frame
                    allowMoving = true;
                });
            }
            return false;
        }

        function end(e) {
            var x, y;
            var dx = yMode === true ? 0 : e.pageX - msx;
            var dy = xMode === true ? 0 : e.pageY - msy;
            dx = xReverse ? -dx : dx;
            dy = yReverse ? -dy : dy;
            x = dx + sx;
            y = dy + sy;
            x = minX !== undefined && x < minX ? minX : x;
            x = maxX !== undefined && x > maxX ? maxX : x;
            y = minY !== undefined && y < minY ? minY : y;
            y = maxY !== undefined && y > maxY ? maxY : y;
            $obj.css({"left":x});
            $obj.css({"top":y});
            !onDragEnd || onDragEnd.call($obj, sx, sy, e.pageX - msx, e.pageY - msy);
            removeDragEvents();
        }

        function removeDragEvents() {
            $dom.unbind("mousemove", move);
            $dom.unbind("mouseup", end);
            return this;
        }

        function addDragEvents() {
            $dom.bind("mousemove", move);
            $dom.bind("mouseup", end);
            return this;
        }

        this.cancelDrag = function () {
            this.unbind("mousedown", start);
            return this;
        };
        this.setHorizon = function (min, max) {
            minX = min;
            maxX = max;
            return this;
        };
        this.setVertical = function (min, max) {
            minY = min;
            maxY = max;
            return this;
        };
        this.startDrag = function (fn) {
            if (typeof fn === "function") {
                onDragStart = fn;
            }
            return this;
        };
        this.moveDrag = function (fn) {
            if (typeof fn === "function") {
                onDrag = fn;
            }
            return this;
        };
        this.endDrag = function (fn) {
            if (typeof fn === "function") {
                onDragEnd = fn;
            }
            return this;
        };
        this.mousedown(start);
        return this;
    };
})(jQuery, window, undefined);