(function (window, oCanvas, $, undefined) {
    var data = {
        "0":{type:"startEvent", next:"5"},
        "1":{type:"endEvent"},
        "5":{type:"parallelGateway", next:"7,8,9"},
        "7":{type:"eventSubprocess", text:"获取个人偏好信息", next:"11"},
        "8":{type:"eventSubprocess", text:"查询目的地", next:"11"},
        "9":{type:"inclusiveGateway", next:"18,19,20,21,22"},
        "19":{type:"transactionSubprocess", text:"查询路况信息", next:"11"},
        "20":{type:"transactionSubprocess", text:"查询天气信息", next:"11"},
        "21":{type:"transactionSubprocess", text:"查询酒店", next:"11"},
        "22":{type:"transactionSubprocess", text:"查询停车场信息", next:"11"},
        "18":{type:"inclusiveGateway", next:"44,45"},
        "44":{type:"transactionSubprocess", text:"根据站点\n查询公交信息", next:"11"},
        "45":{type:"transactionSubprocess", text:"根据时间\n查询公交信息", next:"11"},
        "11":{type:"inclusiveGateway", next:"28,29"},
        "28":{type:"transactionSubprocess", text:"根据最短时间\n规划出行路线", next:"12"},
        "29":{type:"transactionSubprocess", text:"根据最少花费\n规划出行路线", next:"12"},
        "12":{type:"inclusiveGateway", next:"35,36,37,38"},
        "35":{type:"transactionSubprocess", text:"音频显示出行路线", next:"1"},
        "36":{type:"transactionSubprocess", text:"视频显示出行路线", next:"1"},
        "37":{type:"transactionSubprocess", text:"地图显示出行路线", next:"1"},
        "38":{type:"transactionSubprocess", text:"文本显示出行路线", next:"1"}
    };
    $(function () {
        $(document).ready(function () {
            var canvas,
                options,
                $rightOptionPanel,
                $background,
                $majorWindow,
                $horizonScroll,
                $horizonSlider,
                $verticalScroll,
                $verticalSlider,
                selectedObjects = [],
                moudleWindows = {},
                specialNodeOptions = "link insert replace rename remove property",
                specialNotProcessOptions = "link remove",
                specialStageOptions = "fullscreen add layout redo undo",
                linker = null,
                linkers = {},
                timer = new Timer();
            options = {
                status:"default",
                get screenDimensions() {
                    return $.findDimensions();
                },
                get isSelected() {
                    if (selectedObjects.length > 0) {
                        return true;
                    } else return false;
                },
                get isGrouped() {
                    if (selectedObjects.length > 1) {
                        return true;
                    } else return false;
                },
                get mapWidth() {
                    var minX = -this.offsetX;
                    var maxX = 0;
                    var width;
                    canvas.dataBase.all().each(function () {
                        maxX = Math.max(this.export.x + (this.export.width / Math.sqrt(2) || this.export.radius), maxX);
                    });
                    width = Math.max(maxX - minX, canvas.width - minX);
                    return width;
                },
                get mapHeight() {
                    var minY = -this.offsetY;
                    var maxY = 0;
                    var height;
                    canvas.dataBase.all().each(function () {
                        maxY = Math.max(this.export.y + (this.export.height / Math.sqrt(2) || this.export.radius), maxY);
                    });
                    height = Math.max(maxY - minY, canvas.height - minY);
                    return height;
                },
                get isFullScreen() {
                    return /block/i.test($background.css("display"));
                },
                get isRightOptionExist() {
                    return /block/i.test($rightOptionPanel.css("display"));
                },
                get isScrollShow() {
                    return /block/i.test($horizonScroll.css("display") + $verticalScroll.css("display"));
                },
                get lineType() {
                    var flag = $(".useLinkLine").children("span").text();
                    if (flag === "√") {
                        return "linkLine";
                    }
                    return "directLine";
                },
                scrollSensitivity:10,
                //The hot point(position) of the tree's nodes.
                offsetX:0,
                offsetY:0,
                //Just to be the cache of old fullscreen's canvas dimention.
                canvasHeight:600,
                canvasWidth:550,
                //Flag if there are some nodes clicked.
                isClickNode:false
            };

            //初始化全局timer,用来处理自定义动画。
            timer.init();

            canvas = oCanvas.create({canvas:"#cav"});
            $rightOptionPanel = $("#opt");
            $background = $(".back");
            $blackBackground = $(".blackback");
            $horizonScroll = $("#horizon_scroll");
            $verticalScroll = $("#vertical_scroll");

            $majorWindow = $("#ctx")
                .windows(".back", {
                    "minWidth":420
                }).resize(function (w, h) {

                    !w || setCanvasWidth(w);
                    !h || setCanvasHeight(h - 28);

                }).close(function () {

                    quitFullScreen();
                    $("#fullscreen").text("进入全屏");

                }).minimize(function () {

                    quitFullScreen();
                    $("#fullscreen").text("进入全屏");

                }).css({"display":"none"});

            createMoudleWindow("#prop", "property");

            createMoudleWindow("#customWinSize", "customResize");

            createMoudleWindow("#showInfo", "about");

            createMoudleWindow("#contactUs", "contact");

            $horizonSlider = $horizonScroll
                .children(".slider")
                .drag(null, {
                    xMode:true,
                    onDragStart:function () {
                        options.status = "scrolling";
                        canvas.dataBase.all().each(function () {
                            this.export.sx = this.export.x;
                        });
                    },
                    onDrag:function (sx, sy, dx, dy) {
                        var k = canvas.width / parseFloat($horizonSlider.css("width"));
                        var sliderX = parseFloat($horizonSlider.css("left"));
                        options.offsetX = sliderX * k;
                        canvas.dataBase.all().each(function () {
                            this.export.x = this.export.sx - (sliderX - sx) * k;
                        });
                        canvas.redraw();
                    },
                    onDragEnd:function (sx, sy, dx, dy) {
                        var k = canvas.width / parseFloat($horizonSlider.css("width"));
                        var sliderX = parseFloat($horizonSlider.css("left"));
                        options.offsetX = sliderX * k;
                        canvas.dataBase.all().each(function () {
                            this.export.x = this.export.sx - (sliderX - sx) * k;
                        });

                        canvas.redraw();

                        options.status = "default";
                        $horizonScroll.fadeOut(200);
                    }
                });

            $verticalSlider = $verticalScroll
                .children(".slider")
                .drag(null, {
                    yMode:true,
                    onDragStart:function () {
                        options.status = "scrolling";
                        canvas.dataBase.all().each(function () {
                            this.export.sy = this.export.y;
                        });
                    },
                    onDrag:function (sx, sy, dx, dy) {
                        var k = canvas.height / parseFloat($verticalSlider.css("height"));
                        var sliderY = parseFloat($verticalSlider.css("top"));
                        options.offsetY = sliderY * k;
                        canvas.dataBase.all().each(function () {
                            this.export.y = this.export.sy - (sliderY - sy) * k;
                        });
                        canvas.redraw();
                    },
                    onDragEnd:function (sx, sy, dx, dy) {
                        var k = canvas.height / parseFloat($verticalSlider.css("height"));
                        var sliderY = parseFloat($verticalSlider.css("top"));
                        options.offsetY = sliderY * k;
                        canvas.dataBase.all().each(function () {
                            this.export.y = this.export.sy - (sliderY - sy) * k;
                        });

                        canvas.redraw();

                        options.status = "default";
                        $verticalScroll.fadeOut(200);
                    }
                });

            function createMoudleWindow(domID, name) {
                var width = $(domID).width(),
                    height = $(domID).height(),
                    zIndex = 1000,
                    $theMoudleWin;
                for (var key in moudleWindows) {
                    zIndex = Math.max(zIndex, parseInt(moudleWindows[key].css("z-index"), 10));
                }
                $theMoudleWin = $(domID)
                    .windows("body")
                    .css({
                        "display":"none",
                        "z-index":zIndex + 1,
                        "position":"fixed",
                        "left":options.screenDimensions.width / 2 - width / 2,
                        "top":options.screenDimensions.height / 2 - height / 2
                    }).close(function () {
                        this.adjustWidth(width);
                        this.adjustHeight(height);
                        options.isFullScreen || $("body").removeClass("hidescroll");
                        $blackBackground.fadeOut(500);
                    }).minimize(function () {
                        this.adjustWidth(width);
                        this.adjustHeight(height);
                        options.isFullScreen || $("body").removeClass("hidescroll");
                        $blackBackground.fadeOut(500);
                    });
                registerMoudleWindows(name, $theMoudleWin);
                return $theMoudleWin;
            }

            function registerMoudleWindows(name, $win) {
                moudleWindows[name] = $win;
            }

            function saveTreePos_Y() {
                canvas.dataBase.all().each(function () {
                    this.export.sy = this.export.y;
                });
            }

            function saveTreePos_X() {
                canvas.dataBase.all().each(function () {
                    this.export.sx = this.export.x;
                });
            }

            function updateTheTreeView_X(sx) {
                var k = canvas.width / parseFloat($horizonSlider.css("width"));
                var sliderX = parseFloat($horizonSlider.css("left"));
                options.offsetX = sliderX * k;
                canvas.dataBase.all().each(function () {
                    this.export.x = this.export.sx - (sliderX - sx) * k;
                });
                canvas.redraw();
            }

            function updateTheTreeView_Y(sy) {
                var k = canvas.height / parseFloat($verticalSlider.css("height"));
                var sliderY = parseFloat($verticalSlider.css("top"));
                options.offsetY = sliderY * k;
                canvas.dataBase.all().each(function () {
                    this.export.y = this.export.sy - (sliderY - sy) * k;
                });
                canvas.redraw();
            }

            function setCanvasWidth(w, force) {
                canvas.width = w;
                var k = w / options.mapWidth;
                var theSliderWidth = w * k;
                $horizonScroll
                    .css({"width":w})
                    .children(".slider")
                    .css({
                        "width":theSliderWidth,
                        "left":options.offsetX * k
                    });
                $horizonSlider.setHorizon(0, w - theSliderWidth);

                $verticalScroll.css({
                    "left":!options.isFullScreen || force ? (w - 13 + $("#cav").parent("div").offset().left) : w - 9
                });
            }

            function setCanvasHeight(h, force) {
                canvas.height = h;
                var k = h / options.mapHeight;
                var theSliderHeight = h * k;
                $verticalScroll
                    .css({"height":h})
                    .children(".slider")
                    .css({
                        "height":theSliderHeight,
                        "top":options.offsetY * k
                    });
                $verticalSlider.setVertical(0, h - theSliderHeight);

                $horizonScroll.css({
                    "top":!options.isFullScreen || force ? h - 13 + $("#cav").parent("div").offset().top : h + 44
                });
            }

            function addSelectedNode(obj) {
                if (!!obj) {
                    obj.animate({
                        opacity:0.5
                    }, 100);
                }
                selectedObjects.push(obj);
            }

            function popSelectedNode() {
                var obj = selectedObjects.pop();
                if (!!obj) {
                    obj.animate({
                        opacity:1
                    }, 100);
                }
                return obj;
            }

            function shiftSelectedNode() {
                var obj = selectedObjects.shift();
                if (!!obj) {
                    obj.animate({
                        opacity:1
                    }, 200);
                }
                return obj;
            }

            function showRightOptionPanel(x, y) {
                var left = options.isFullScreen ? x + 6 : x,
                    top = options.isFullScreen ? y + 59 : y;
                //console.log($.browser);
                if (!$.browser.chrome) {
                    left += $("body").scrollLeft();
                    top += $("body").scrollTop();
                }
                if (!options.isRightOptionExist) {
                    $rightOptionPanel.css({
                        "left":left,
                        "top":top
                    }).fadeIn(100);

                } else {
                    $rightOptionPanel.fadeOut(100, function () {
                        $(this).css({
                            "left":left,
                            "top":top
                        }).fadeIn(100);
                    });
                }
            }

            function hideRightOptionPanel() {
                $rightOptionPanel.fadeOut(100);
            }

            function buildLinker(start, end, type) {
                linker = canvas.display[type]({
                    start:start,
                    end:end
                });
                return linker;
            }

            function endLink() {
                linker = null;
                options.status = "default";
            }

            function setOptionsForNode() {
                $rightOptionPanel
                    .children("ul")
                    .children("li")
                    .children("a")
                    .each(function () {
                        var spec = specialNodeOptions.split(" ");
                        $(this).css({"display":"none"});
                        for (var i = 0; i < spec.length; i++) {
                            if ($(this).attr("id") === spec[i]) {
                                $(this).css({"display":"block"});
                            }
                        }
                    });
            }

            function setOptionsForStage() {
                $rightOptionPanel
                    .children("ul")
                    .children("li")
                    .children("a")
                    .each(function () {
                        var spec = specialStageOptions.split(" ");
                        $(this).css({"display":"none"});
                        for (var i = 0; i < spec.length; i++) {
                            if ($(this).attr("id") === spec[i]) {
                                $(this).css({"display":"block"});
                            }
                        }
                    });
            }

            function setOptionsForNotProcessNode() {
                $rightOptionPanel
                    .children("ul")
                    .children("li")
                    .children("a")
                    .each(function () {
                        var spec = specialNotProcessOptions.split(" ");
                        $(this).css({"display":"none"});
                        for (var i = 0; i < spec.length; i++) {
                            if ($(this).attr("id") === spec[i]) {
                                $(this).css({"display":"block"});
                            }
                        }
                    });
            }

            function resizeBackground() {
                if (options.screenDimensions.width > parseInt($background.css("width"), 10)) {
                    $background.css({"width":options.screenDimensions.width});
                }
                if (options.screenDimensions.height > parseInt($background.css("height"), 10)) {
                    $background.css({"height":options.screenDimensions.height});
                }
            }

            function showMoudleWindow(name) {
                $blackBackground.fadeTo(500, 0.5, function () {
                    $("body").addClass("hidescroll");
                    moudleWindows[name].fadeIn(500, function () {
                        //centerThePropertyWindow();
                        $(this).toCenter(500);
                    });
                });
            }

            function hideMoudleWindow(name) {
                $blackBackground.fadeOut(300);
                moudleWindows[name].fadeOut(300, function () {
                    options.isFullScreen || $("body").removeClass("hidescroll");
                });
            }

            function createNode(type, seeting) {
                var node = canvas.elems[type](seeting);
                node.bind("mousedown", function (e) {
                    if (e.button === 0) {
                        if (selectedObjects.lastIndexOf(this) === -1) {
                            //selectedObjects.push(this);
                            addSelectedNode(this);
                        }
                        options.isClickNode = true;
                    }
                    if (e.button === 2) {
                        if (selectedObjects.lastIndexOf(this) === -1) {
                            while (selectedObjects.length > 0) {
                                popSelectedNode();
                            }
                            addSelectedNode(this);
                        }
                        options.isClickNode = true;
                    }
                });
                return node;
            }

            function autoLayout() {
                canvas
                    .dataBase
                    .all()
                    .layout(0);
                restoreLayout();
            }

            function saveLayout() {
                canvas
                    .dataBase
                    .all()
                    .each(function () {
                        this.x = this.export.x + options.offsetX;
                        this.y = this.export.y + options.offsetY;
                    });
            }

            function restoreLayout() {
                canvas
                    .dataBase
                    .all()
                    .each(function () {
                        if (this.export.x !== this.x || this.export.y !== this.y) {
                            this.export.stop().animate({
                                "x":this.x - options.offsetX,
                                "y":this.y - options.offsetY
                            }, {
                                duration:500,
                                easing:"ease-out-back"
                            });
                        }
                    });
            }

            function startShowIcons(cav, callback) {
                var ctx = cav.getContext("2d"),
                    _frameID = null;
                ani = new Animation({
                    "from":1,
                    "to":105,
                    "duration":2000
                });

                ani.every(function (val) {
                    if (_frameID === null) {
                        _frameID = requestAnimationFrame(function () {
                            ctx.clearRect(0, 0, 200, 200);
                            //console.log(~~val);
                            ctx.drawImage(canvas.ready.images[~~val], 0, 0);
                            $(cav).css({
                                "left":options.screenDimensions.width / 2 - 100,
                                "top":options.screenDimensions.height / 2 - 100
                            });
                            _frameID = null;
                        });
                    }
                });
                ani.init(null, callback);
                ani.play(timer);
            }

            function onEnter() {
                $("#ctx")
                    .find("td:last")
                    .append($("#cav")
                    .parent("div"))
                    .append($rightOptionPanel);
                $majorWindow
                    //.adjustPosition(options.screenDimensions.width / 2 - options.canvasWidth / 2,options.screenDimensions.height / 2 - options.canvasHeight / 2)
                    .adjustWidth(options.canvasWidth)
                    .adjustHeight(options.canvasHeight)
                    .fadeIn(500, function () {
                        //centerTheMajorWindow();
                        $majorWindow.toCenter(500);
                    });
            }

            function toFullScreen() {
                $("body").addClass("hidescroll");
                resizeBackground();
                $background.fadeIn(500, function () {
                    var $icon = $("<canvas></canvas>")
                        .css({
                            "position":"absolute"
                        }).attr({
                            "height":"200px",
                            "width":"200px"
                        }).appendTo(this);

                    startShowIcons($icon[0], function () {
                        $icon.fadeOut(300, function () {
                            $(this).remove();
                            onEnter();
                        });
                    });

                });
            }

            function quitFullScreen() {
                $("body").removeClass("hidescroll");

                if (options.isRightOptionExist) {
                    $rightOptionPanel.css({
                        "display":"none"
                    });
                }

                if (options.isScrollShow) {
                    $verticalScroll.css({
                        "display":"none"
                    });
                    $horizonScroll.css({
                        "display":"none"
                    });
                }

                options.canvasWidth = canvas.width;
                options.canvasHeight = canvas.height + 28;

                $("#old_position")
                    .append($("#cav").parent("div"))
                    .append($rightOptionPanel);

                setCanvasHeight(600, true);
                setCanvasWidth(550, true);

                $background.fadeOut(500);
            }

            $(window).resize(function () {
                if (options.isFullScreen) {
                    resizeBackground();
                    //centerTheMajorWindow();
                    $majorWindow.toCenter(500);
                }
                for (var key in moudleWindows) {
                    if (/block/g.test(moudleWindows[key].css("display"))) {
                        moudleWindows[key].toCenter(500);
                    }
                }
            });

            canvas.bind("mousedown", function (e) {
                if (e.button === 0) {
                    switch (options.status) {
                        case "default":
                            if (options.isClickNode && options.isGrouped) {
                                while (options.isGrouped) {
                                    //selectedObjects.shift();
                                    shiftSelectedNode();
                                }
                            } else if (!options.isClickNode) {
                                while (options.isSelected) {
                                    popSelectedNode();
                                }
                            }
                            break;
                    }
                }
                if (e.button === 2) {
                    var offset = $("#cav").offset();
                    if (options.isClickNode) {
                        if (options.isSelected && /Subprocess$/g.test(selectedObjects[0].export.type)) {
                            setOptionsForNode();
                        } else {
                            setOptionsForNotProcessNode();
                        }
                    } else {
                        setOptionsForStage();
                    }
                    if (options.isFullScreen) {
                        showRightOptionPanel(e.x + 1, e.y + 1);
                    } else {
                        showRightOptionPanel(e.x + offset.left + 1, e.y + offset.top + 1);
                        //console.log(e.y + offset.top + 1);
                    }
                }
            });

            canvas.bind("click", function (e) {
                if (e.button === 0) {
                    if (options.isRightOptionExist) {
                        hideRightOptionPanel();
                    }
                    switch (options.status) {
                        case "linking":
                            if (options.isGrouped && !!linker && selectedObjects[0].export.next.indexOf(selectedObjects[1].export.key) === -1) {
                                linker.end = selectedObjects[1];
                                linker.start.export.next.push(linker.end.export.key);
                                linker.end.export.prev.push(linker.start.export.key);
                                linkers["_" + linker.start.export.key + "_" + linker.end.export.key + "_"] = function () {
                                    if (linker.type === "linkLine") {
                                        return {
                                            "linkLine":linker,
                                            "directLine":buildLinker(linker.start, linker.end, "directLine")
                                        };
                                    }
                                    return {
                                        "directLine":linker,
                                        "linkLine":buildLinker(linker.start, linker.end, "linkLine")
                                    };
                                }();
                                linker.redraw();
                            } else {
                                linker.remove();
                            }
                            //selectedObjects.pop();
                            popSelectedNode();
                            endLink();
                            break;
                    }
                }
                options.isClickNode = false;
            });

            canvas.bind("mousemove", function (e) {
                switch (options.status) {
                    case "linking":
                        if (options.isSelected && !options.isGrouped && !!linker) {
                            linker.end = e;
                            linker.redraw();
                        }
                        break;
                }


                if (!options.isScrollShow && options.status === "default") {
                    if (e.y >= canvas.height - 10 && e.y <= canvas.height) {
                        $horizonScroll.fadeTo(600, 0.7);
                    }
                    if (e.x >= canvas.width - 10 && e.x <= canvas.width) {
                        $verticalScroll.fadeTo(600, 0.7);
                    }
                } else if (options.status !== "scrolling") {
                    if (e.y < canvas.height - 10 || e.y > canvas.height) {
                        $horizonScroll.fadeOut(200);
                    }
                    if (e.x < canvas.width - 10 || e.x > canvas.width) {
                        $verticalScroll.fadeOut(200);
                    }
                }

            });

            function onSliderChose() {
                if (options.isRightOptionExist) {
                    hideRightOptionPanel();
                }
                if (!options.isClickNode) {
                    while (options.isSelected) {
                        popSelectedNode();
                    }
                }
                if ($.inputer.obj !== null) {
                    $.inputer.obj.blur();
                }
            }

            function getWheelValue(e) {
                e = e || event;
                return ( e.wheelDelta ? e.wheelDelta / 120 : -( e.detail % 3 == 0 ? e.detail : e.detail / 3 ) );
            }

            function activeMouseWheel_X(e) {
                var gap,
                    temp,
                    val = -getWheelValue(e),
                    slider_w = $horizonSlider.width(),
                    scroll_w = $horizonScroll.width(),
                    dw = scroll_w - slider_w,
                    x = parseFloat($horizonSlider.css("left"));

                if ((x >= dw && val > 0) || (x <= 0 && val < 0)) {
                    val = 0;
                }

                gap = val * options.scrollSensitivity;

                saveTreePos_X();

                if (gap + x < 0) {
                    temp = 0
                } else if (gap + x > dw) {
                    temp = dw;
                } else {
                    temp = "+=" + gap;
                }

                $horizonSlider.css({"left":temp});
                if (gap !== 0) {
                    updateTheTreeView_X(x);
                }
            }

            function activeMouseWheel_Y(e) {
                var gap,
                    temp,
                    val = -getWheelValue(e),
                    slider_h = $verticalSlider.height(),
                    scroll_h = $verticalScroll.height(),
                    dh = scroll_h - slider_h,
                    y = parseFloat($verticalSlider.css("top"));

                if ((y >= dh && val > 0) || (y <= 0 && val < 0)) {
                    val = 0;
                }

                gap = val * options.scrollSensitivity;

                saveTreePos_Y();

                if (gap + y < 0) {
                    temp = 0
                } else if (gap + y > dh) {
                    temp = dh;
                } else {
                    temp = "+=" + gap;
                }

                $verticalSlider.css({"top":temp});
                if (gap !== 0) {
                    updateTheTreeView_Y(y);
                }
            }

            function forbidenMouseWheel(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }


            $horizonSlider.bind("mousedown", onSliderChose);

            $verticalSlider.bind("mousedown", onSliderChose);

            $horizonScroll.hover(function () {
                window.onmousewheel = document.onmousewheel = forbidenMouseWheel;
                if ($.browser.msie) {
                    this.attachEvent("mousewheel", activeMouseWheel_X);
                } else {
                    this.addEventListener("mousewheel", activeMouseWheel_X, false);
                }
            }, function () {
                window.onmousewheel = document.onmousewheel = null;
                if ($.browser.msie) {
                    this.detachEvent("mousewheel", activeMouseWheel_X);
                } else {
                    this.removeEventListener("mousewheel", activeMouseWheel_X, false);
                }
            });

            $verticalScroll.hover(function () {
                window.onmousewheel = document.onmousewheel = forbidenMouseWheel;
                if ($.browser.msie) {
                    this.attachEvent("mousewheel", activeMouseWheel_Y);
                } else {
                    this.addEventListener("mousewheel", activeMouseWheel_Y, false);
                }
            }, function () {
                window.onmousewheel = document.onmousewheel = null;
                if ($.browser.msie) {
                    this.detachEvent("mousewheel", activeMouseWheel_Y);
                } else {
                    this.removeEventListener("mousewheel", activeMouseWheel_Y, false);
                }
            });

            $rightOptionPanel.find("a").each(function () {
                $(this).bind("click", function (e) {
                    var i;
                    switch ($(this).attr("id")) {
                        case "link":
                            if (options.isSelected && !options.isGrouped) {
                                options.status = "linking";
                                buildLinker(selectedObjects[0], {
                                    x:e.clientX,
                                    y:e.clientY
                                }, options.lineType).add();
                            }
                            break;
                        case "remove":
                            if (options.isSelected) {
                                for (i = 0; i < selectedObjects.length; i++) {
                                    var obj = selectedObjects[i];
                                    canvas
                                        .dataBase
                                        .find(obj.export.key)
                                        .parents()
                                        .each(function () {
                                            var theKey = "_" + this.key + "_" + obj.export.key + "_";
                                            linkers[theKey].remove();
                                            delete linkers[theKey];
                                        }).find(obj.export.key).children()
                                        .each(function () {
                                            var theKey = "_" + obj.export.key + "_" + this.key + "_";
                                            linkers[theKey].remove();
                                            delete linkers[theKey];
                                        }).find(obj.export.key).remove();
                                    obj.remove();
                                    //selectedObjects.pop();
                                    popSelectedNode();
                                }
                            }
                            break;
                        case "layout":
                            autoLayout();
                            break;
                        case "rename":
                            if (options.isSelected && !options.isGrouped) {
                                var obj = selectedObjects[0];
                                if (!!obj.export.type.match(/Subprocess$/g)) {
                                    var offset,
                                        width = Math.max(obj.text.width, 50),
                                        height = obj.text.height,
                                        left = obj.x - width / 2,
                                        top = obj.y - height / 2,
                                        prevText = obj.text.text.length > 0 ? obj.text.text : " ";

                                    obj.text.text = "";
                                    obj.text.redraw();

                                    $.inputer.create();
                                    if (options.isFullScreen) {
                                        $.inputer.init($("#cav").parent("div"), left + 6, top + 55, width, height, prevText);
                                    } else {
                                        offset = $("#cav").offset();
                                        left += offset.left - 1;
                                        top += offset.top - 1;
                                        $.inputer.init($("#cav").parent("div"), left, top, width, height, prevText);
                                    }
                                    $.inputer.change(function () {
                                        $.inputer.setText($(this).val());
                                        obj.export.text = obj.text.text = $.inputer.getText();

                                        obj.pre_render();
                                        obj.redraw();
                                    });
                                    $.inputer.blur(function () {
                                        if (obj.text.text === "") {
                                            obj.text.text = prevText;

                                            obj.pre_render();
                                            obj.redraw();
                                        }
                                    });
                                    $.inputer.show();
                                }
                            }
                            break;
                        case "fullscreen":
                            if (!options.isFullScreen) {
                                toFullScreen();
                                $(this).text("退出全屏");
                            } else {
                                $majorWindow.css({"display":"none"});
                                quitFullScreen();
                                $(this).text("进入全屏");
                            }
                            break;
                        case "property":
                            showMoudleWindow("property");
                            break;
                    }
                    hideRightOptionPanel();
                    return false;
                });
            });

            //重新设置canvas
            function resetCanvas() {
                canvas.reset();
            }

            function showLines() {
                var key;
                if (options.lineType === "linkLine") {
                    for (key in linkers) {
                        linkers[key]["linkLine"].add();
                        linkers[key]["directLine"].remove();
                    }
                } else {
                    for (key in linkers) {
                        linkers[key]["linkLine"].remove();
                        linkers[key]["directLine"].add();
                    }
                }
            }

            function onImagesLoaded() {
                linkers = {};
                canvas.dataBase.json = data;
                canvas.dataBase
                    .layout("0")
                    .all()
                    .each(function () {
                        this.export = createNode(this.type, {
                            x:this.x,
                            y:this.y
                        });
                        if (this.text !== "") {
                            this.export.text.text = this.text;
                            this.export.pre_render();
                        }
                        this.export.export = this;
                    }).each(function () {
                        var _this = this;
                        canvas.dataBase
                            .find(this.key)
                            .children()
                            .each(function () {
                                if (this.export !== null) {
                                    linkers["_" + _this.key + "_" + this.key + "_"] = {
                                        "directLine":buildLinker(_this.export, this.export, "directLine"),
                                        "linkLine":buildLinker(_this.export, this.export, "linkLine")
                                    };
                                }
                            }).all();
                    });

                //获取文档默认的连接线的type值，显示对应的连接线。
                showLines();

                setCanvasHeight(parseInt(canvas.height, 10));
                setCanvasWidth(parseInt(canvas.width, 10));
            }

            canvas.ready.loadImages(onImagesLoaded);


            $.extend({
                bpmn:{
                    setCanvasWidth:setCanvasWidth,
                    setCanvasHeight:setCanvasHeight,
                    $majorWindow:$majorWindow,
                    $blackBackground:$blackBackground,
                    showMoudleWindow:showMoudleWindow,
                    hideMoudleWindow:hideMoudleWindow,
                    autoLayout:autoLayout,
                    saveLayout:saveLayout,
                    restoreLayout:restoreLayout,
                    reload:onImagesLoaded,
                    resetCanvas:resetCanvas,
                    showLines:showLines,
                    canvas:canvas,
                    redraw:function () {
                        canvas.redraw();
                    }
                }
            });

        });
    });
})(window, oCanvas, jQuery, undefined);