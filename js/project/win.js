(function ($, window, undefined) {
    $.fn.windows = function (root, setting) {
        var div = "<div></div>",
            a = "<a></a>",
            width = this.css("width"),
            height = this.css("height"),
            $parent = $(root),
            $main,
            $parts,
            minWidth = 100,
            maxWidth = 1200,
            minHeight = 50,
            maxHeight = 800,
            minX = 0,
            minY = 0,
            maxX = 1200,
            maxY = 800,
            ox = 0,
            oy = 0,
            children = [],
            _this = this,
            onClose = null,
            onMinimize = null,
            onResize = null;
        if (!!setting) {
            minWidth = setting.minWidth || 100;
            maxWidth = setting.maxWidth || 1200;
            minHeight = setting.minHeight || 50;
            maxHeight = setting.maxHeight || 800;
            minX = setting.minX || 0;
            minY = setting.minY || 0;
            maxX = setting.maxX || 1200;
            maxY = setting.maxY || 800;
            ox = setting.ox || 0;
            oy = setting.oy || 0;
            !setting.fixWidth || (maxWidth = minWidth = setting.fixWidth);
            !setting.fixHeight || (maxHeight = minHeight = setting.fixHeight);
        }
        function initSize(width, height) {
            var w = parseInt(width, 10) || 800;
            var h = parseInt(height, 10) || 600;
            return [
                [
                    [5, 31],
                    [w + 2, 31],
                    [5, 31]
                ],
                [
                    [6, h ],
                    [w    , h ],
                    [6, h]
                ],
                [
                    [6, 6 ],
                    [w    , 6 ],
                    [6, 6]
                ]
            ];
        }

        function getAlignX(j) {
            var x;
            switch (j) {
                case 0:
                    x = "left";
                    break
                case 1:
                    x = "center";
                    break;
                case 2:
                    x = "right";
                    break;
                default:
                    "";
            }
            return x;
        }

        function getAlignY(i) {
            var y;
            switch (i) {
                case 0:
                    y = "top";
                    break
                case 1:
                    y = "middle";
                    break;
                case 2:
                    y = "bottom";
                    break;
                default:
                    "";
            }
            return y;
        }

        function getPos(i, j) {
            return getAlignX(j) + "_" + getAlignY(i);
        }

        function regulateValue(value, min, max) {
            if (value > max) {
                return max;
            } else if (value < min) {
                return min;
            } else {
                return value;
            }
        }

        function createMainFrame() {
            return $(div).css({
                "width":parseInt(width, 10) + 12,
                "height":parseInt(height, 10) + 37
            }).addClass("win");
        }

        function composeParts($main, $context) {
            var $parts = [],
                i,
                j,
                old = null,
                size,
                $btns;
            size = initSize(width, height);
            for (i = 0; i < 3; i++) {
                $parts[i] = [];
                for (j = 0; j < 3; j++) {
                    $parts[i][j] = $(div).css({
                        "width":size[i][j][0],
                        "height":size[i][j][1]
                    }).addClass(getPos(i, j));
                    $main.append($parts[i][j]);
                }
            }
            var toggleMaxAndRestore = function () {
                if (old === null) {
                    old = {};
                    toMax(old);
                } else {
                    toRestore(old);
                    old = null;
                }
                $btns[1].toggleClass("restore");
            };
            $parts[1][1].append($context);
            $btns = createButtons($parts[0][1]);
            //为窗口添加拖拽功能
            $parts[0][1].drag($main, {
                onDragEnd:function () {
                    if (parseInt(this.css("top"), 10) < 0) {
                        this.animate({"top":0}, 500, "easeOutBack");
                    }
                }
            }).dblclick(toggleMaxAndRestore);
            $btns[1].click(toggleMaxAndRestore);
            return $parts;
        }

        function createButtons($handler) {
            var btns = [],
                i;
            for (i = 2; i >= 0; i--) {
                btns[i] = $(a).appendTo($handler);
            }
            btns[0].attr({"title":"Minimize"})
                .addClass("minimize")
                .click(minimize);
            btns[1].attr({"title":"Maximize"})
                .addClass("maximize");
            btns[2].attr({"title":"Close"})
                .addClass("close")
                .click(close);
            return btns;
        }

        function close() {
            var count = 0;
            var timer = null;
            var x = parseInt($main.css("left"), 10);
            var y = parseInt($main.css("top"), 10);
            var width = parseInt($parts[1][1].css("width"), 10);
            var height = parseInt($parts[1][1].css("height"), 10);
            var i = 0;

            !onClose || onClose.call($main);

            (function () {
                count += 1;
                adjustWidth($main, $parts, width - count * 10, true);
                adjustHeight($main, $parts, height - count * 10, true);
                $main.css({
                    left:x + count * 5,
                    top:y + count * 5
                });
                timer = requestAnimationFrame(arguments.callee);
            })();
            for (; i < children.length; i++) {
                children[i].remove();
            }
            $main.fadeOut(150, function () {
                cancelAnimationFrame(timer);
            });
        }

        function minimize() {
            var count = 0;
            var timer = null;
            var x = parseInt($main.css("left"), 10);
            var y = parseInt($main.css("top"), 10);
            var width = parseInt($parts[1][1].css("width"), 10);
            var height = parseInt($parts[1][1].css("height"), 10);

            !onMinimize || onMinimize.call($main);

            (function () {
                count += 1;
                adjustWidth($main, $parts, width - count * (width - 0) / 15, true);
                adjustHeight($main, $parts, height - count * (height - 0) / 15, true);
                $main.css({
                    left:x - (x - ox) / 15 * count,
                    top:y - (y - oy) / 15 * count
                });
                timer = requestAnimationFrame(arguments.callee);
            })();
            $main.fadeOut(300, function () {
                cancelAnimationFrame(timer);
            });
        }

        function toMax(temp) {
            var dim = $.findDimensions();
            maxWidth = dim.width;
            maxHeight = dim.height;
            if (temp) {
                temp.width = parseInt($parts[1][1].css("width"), 10);
                temp.height = parseInt($parts[1][1].css("height"), 10);
                temp.x = parseInt($main.css("left"));
                temp.y = parseInt($main.css("top"));
            }
            adjustWidth($main, $parts, dim.width - 12);
            adjustHeight($main, $parts, dim.height - 37);
            adjustPosition(ox, oy);
        }

        function toRestore(temp) {
            adjustWidth($main, $parts, temp.width);
            adjustHeight($main, $parts, temp.height);
            adjustPosition(temp.x, temp.y);
        }

        function adjustWidth($main, $parts, width, isFade) {
            var i = 0,
                w = isFade ? width : regulateValue(width, minWidth, maxWidth);
            for (; i < 3; i++) {
                $parts[i][1].css({"width":i === 0 ? w + 2 : w});
            }
            $main.css({"width":w + 12});
            //!isFade ||  $main.find("canvas").css({"width": w});
            !onResize || isFade || onResize.call(_this, w, undefined);
        }

        function adjustHeight($main, $parts, height, isFade) {
            var i = 0,
                h = isFade ? height : regulateValue(height, minHeight, maxHeight);
            for (; i < 3; i++) {
                $parts[1][i].css({"height":h});
            }
            $main.css({"height":h + 37});
            //!isFade || $main.find("canvas").css({"height":h - 24});
            !onResize || isFade || onResize.call(_this, undefined, h);
        }

        function adjustPosition(x, y) {
            $main.css({
                "left":regulateValue(x, minX, maxX),
                "top":regulateValue(y, minY, maxY)
            });
        }

        function resize($main, $parts) {
            var i,
                j,
                direction;
            for (i = 0; i < 3; i++) {
                for (j = 0; j < 3; j++) {
                    direction = function () {
                        if (i === 0) {
                            return "n";
                        } else if (i === 2) {
                            return "s";
                        } else {
                            return "";
                        }
                    }()
                        + function () {
                        if (j === 0) {
                            return "w";
                        } else if (j === 2) {
                            return "e";
                        } else {
                            return "";
                        }
                    }();
                    if (direction !== "" && direction !== "n") {
                        (function (direction) {
                            var $root;
                            var old = null;
                            var xMode = (i === 1);
                            var yMode = (j === 1);
                            var xReverse = false;
                            var yReverse = false;
                            switch (direction) {
                                case "w":
                                    $root = $main;
                                    break;
                                case "nw":
                                    $root = $main;
                                    break;
                                case "sw":
                                    $root = $main;
                                    xMode = true;
                                    break;
                                case "ne":
                                    $root = $main;
                                    yMode = true;
                                    break;
                                default :
                                    $root = null;
                                    break;
                            }
                            $parts[i][j].drag($root, function () {
                                return {
                                    xMode:xMode,
                                    yMode:yMode,
                                    xReverse:xReverse,
                                    yReverse:yReverse,
                                    onDragStart:function () {
                                        old = {};
                                        yMode || (old.width = parseInt($parts[1][1].css("width"), 10));
                                        xMode || (old.height = parseInt($parts[1][1].css("height"), 10));
                                        if (direction === "sw") {
                                            old.height = parseInt($parts[1][1].css("height"), 10);
                                        } else if (direction === "ne") {
                                            old.width = parseInt($parts[1][1].css("width"), 10);
                                        }
                                        $parent.css({cursor:direction + "-resize"});
                                    },
                                    onDrag:function (sx, sy, dx, dy) {
                                        if (old !== null) {
                                            yMode || adjustWidth($main, $parts, old.width + ($root === null ? dx : -dx));
                                            xMode || adjustHeight($main, $parts, old.height + ($root === null ? dy : -dy));
                                        }
                                        if (direction === "sw") {
                                            adjustHeight($main, $parts, old.height + dy);
                                        } else if (direction === "ne") {
                                            adjustWidth($main, $parts, old.width + dx);
                                        }
                                    },
                                    onDragEnd:function () {
                                        $parent.css({"cursor":"default"});
                                        old = null;
                                    }
                                }
                            }()).css({"cursor":direction + "-resize"});
                        })(direction);
                    }
                }
            }
        }

        $main = createMainFrame();
        adjustPosition(ox, oy);
        $parts = composeParts($main, this);
        resize($main, $parts);
        $parent.append($main);
        $main.getParts = function () {
            return $parts;
        };
        $main.addChildWin = function ($win) {
            if ($win !== $main) {
                children.push($win);
            }
            return this;
        };
        $main.resize = function (fn) {
            if (typeof fn === "function") {
                onResize = fn;
            }
            return this;
        };
        $main.close = function (fn) {
            if (typeof fn === "function") {
                onClose = fn;
            }
            return this;
        };
        $main.minimize = function (fn) {
            if (typeof fn === "function") {
                onMinimize = fn;
            }
            return this;
        };
        $main.adjustWidth = function (width) {
            adjustWidth(this, $parts, width, false);
            return this;
        };
        $main.adjustHeight = function (height) {
            adjustHeight(this, $parts, height, false);
            return this;
        };
        $main.adjustPosition = function (x, y) {
            adjustPosition(x, y);
            return this;
        };
        return $main;
    };
})(jQuery, window, undefined)