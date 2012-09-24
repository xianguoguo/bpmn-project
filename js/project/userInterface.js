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
                demo,
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
                speciallinkerOptions = "removeLinker",
                specialStageOptions = "show fullscreen add refresh layout redo undo",
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

            /*****************************************************************/
            demo = oCanvas.create({"canvas":"#demo"});
            var circle_start = demo.display.arc({
                x:demo.width / 2 - canvas.dataBase.gap_x / 2,
                y:demo.height / 2 - canvas.dataBase.gap_y / 2,
                radius:20,
                start:0,
                end:360,
                fill:"#0af",
                opacity:0.5
            }).add();

            var circle_end = (function () {
                this.fill = "#f00";
                this.x = demo.width / 2 + canvas.dataBase.gap_x / 2;
                this.y = demo.height / 2 + canvas.dataBase.gap_y / 2;
                return this;
            }).call(circle_start.clone()).add();

            var rectStander = demo.display.rectangle({
                x:circle_start.x,
                y:circle_start.y,
                width:circle_end.x - circle_start.x,
                height:circle_end.y - circle_start.y,
                fill:"#000",
                opacity:0.3
            }).add();

            var countLine = demo.display.line({
                start:circle_start,
                end:circle_end,
                stroke:"2px #f00",
                cap:"round"
            }).add();

            var gapLength = demo.display.text({
                x:demo.width / 2,
                y:demo.height / 2,
                origin:{ x:"left", y:"top" },
                font:"bold 12px sans-serif",
                text:Math.sqrt(rectStander.width * rectStander.width + rectStander.height * rectStander.width).toFixed(1) + "px",
                fill:"#000"
            }).add();
            var gapWidth = demo.display.text({
                x:demo.width / 2,
                y:circle_end.y,
                origin:{ x:"center", y:"top" },
                font:"bold 12px sans-serif",
                text:rectStander.width.toFixed(1) + "px",
                fill:"#000"
            }).add();
            var gapHeight = demo.display.text({
                x:circle_start.x,
                y:demo.width / 2,
                origin:{ x:"center", y:"top" },
                font:"bold 12px sans-serif",
                text:rectStander.height.toFixed(1) + "px",
                fill:"#000"
            }).add();
            /*****************************************************************/

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

            createMoudleWindow("#adjustTreeGap", "treeGap");

            createMoudleWindow("#listOfHiddenNodes", "list").resize(function (w, h) {
                $("#listOfHiddenNodes").css({
                    "height":h,
                    "width":w
                });
            });

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

            function newRow(key, text) {
                var $p = $("<p></p>").text(text),
                    $tr = $("<tr></tr>"),
                    $td = $("<td></td>"),
                    $span = $("<span></span>"),
                    $checkbox = $("<input/>").attr({"type":"checkbox"}).val(key);

                $span.append($checkbox);
                $p.append($span);
                $td.append($p);

                return $tr.append($td);
            }

            function clearTable(domId) {
                $(domId).find("tr").each(function (i) {
                    if (i > 0) {
                        $(this).remove();
                    }
                });
            }

            function createNodeList(domId, arrList) {
                var list = arrList;
                clearTable(domId);
                for (var i = 0; i < list.length; i++) {
                    $(domId).find(".list").append(newRow(list[i].id, list[i].text || "error!"));
                }
            }

            function setVerticalScrollPos(w, force) {
                if (w === undefined) {
                    w = canvas.width;
                    force = false;
                }
                $verticalScroll.css({
                    "left":!options.isFullScreen || force ? (w - 13 + $("#cav").parent("div").offset().left) : w - 9
                });
            }

            function setHorizonScrollPos(h, force) {
                if (h === undefined) {
                    h = canvas.height;
                    force = false;
                }
                $horizonScroll.css({
                    "top":!options.isFullScreen || force ? h - 13 + $("#cav").parent("div").offset().top : h + 44
                });
            }

            function setCanvasWidth(w, force) {
                if(w){
                    canvas.width = w;
                } else {
                    w = canvas.width;
                }

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

                setVerticalScrollPos(w, force);
            }

            function setCanvasHeight(h, force) {
                if(h){
                    canvas.height = h;
                } else {
                    h = canvas.height;
                }

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

                setHorizonScrollPos(h, force);
            }

            function updateScrolls() {
                setCanvasHeight(canvas.height);
                setCanvasWidth(canvas.width);
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
                linker.bind("mousedown", function (e) {
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
                linker.bind("mouseenter", function () {
                    this.fill = "rgba(0,255,0,1)";
                    this.redraw();
                });
                linker.bind("mouseleave", function () {
                    this.fill = "rgba(0,0,0,1)";
                    this.redraw();
                });
                return linker;
            }

            function endLink() {
                linker = null;
                options.status = "default";
            }

            function setSpecialOptions(options) {
                $rightOptionPanel.stop()
                    .fadeOut(100, function () {
                        $(this).children("ul")
                            .children("li")
                            .children("a")
                            .each(function () {
                                var spec = options.split(" ");
                                $(this).css({"display":"none"});
                                for (var i = 0; i < spec.length; i++) {
                                    if ($(this).attr("id") === spec[i]) {
                                        $(this).css({"display":"block"});
                                    }
                                }
                            });
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

            function hideMoudleWindow(name, callback) {
                $blackBackground.fadeOut(300);
                moudleWindows[name].fadeOut(500, function () {
                    options.isFullScreen || $("body").removeClass("hidescroll");
                    !callback || callback.call(this);
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

            function autoLayout(gap) {
                if (!!gap) {
                    canvas.dataBase.gap_x = gap.x;
                    canvas.dataBase.gap_y = gap.y;
                }
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
                    if (/block/i.test(moudleWindows[key].css("display"))) {
                        moudleWindows[key].toCenter(500);
                    }
                }
                setHorizonScrollPos();
                setVerticalScrollPos();
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
                        if (selectedObjects[0].export) {
                            if (options.isSelected && /Subprocess$/i.test(selectedObjects[0].type)) {
                                setSpecialOptions(specialNodeOptions);
                            } else {
                                setSpecialOptions(specialNotProcessOptions);
                            }
                        } else {
                            setSpecialOptions(speciallinkerOptions);
                        }
                    } else {
                        setSpecialOptions(specialStageOptions);
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
                            if (options.isGrouped && !!linker
                                && selectedObjects[0].export
                                && selectedObjects[1].export
                                && selectedObjects[0].export.isNode === true
                                && selectedObjects[1].export.isNode === true
                                && selectedObjects[0].export.next.indexOf(selectedObjects[1].export.key) === -1) {

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

                val = val > 0 ? 1 : -1;

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

                val = val > 0 ? 1 : -1;

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

            var mouseWheelEvent = $.browser.mozilla ? "DOMMouseScroll" : "mousewheel";

            $horizonScroll.hover(function () {
                if ($.browser.msie) {
                    this.attachEvent(mouseWheelEvent, activeMouseWheel_X);
                    window.attachEvent(mouseWheelEvent, forbidenMouseWheel);
                } else {
                    this.addEventListener(mouseWheelEvent, activeMouseWheel_X, false);
                    window.addEventListener(mouseWheelEvent, forbidenMouseWheel, false);
                }
            }, function () {
                if ($.browser.msie) {
                    this.detachEvent(mouseWheelEvent, activeMouseWheel_X);
                    window.detachEvent(mouseWheelEvent, forbidenMouseWheel);
                } else {
                    this.removeEventListener(mouseWheelEvent, activeMouseWheel_X, false);
                    window.removeEventListener(mouseWheelEvent, forbidenMouseWheel, false);
                }
            });

            $verticalScroll.hover(function () {
                if ($.browser.msie) {
                    this.attachEvent(mouseWheelEvent, activeMouseWheel_Y);
                    window.attachEvent(mouseWheelEvent, forbidenMouseWheel);
                } else {
                    this.addEventListener(mouseWheelEvent, activeMouseWheel_Y, false);
                    window.addEventListener(mouseWheelEvent, forbidenMouseWheel, false);
                }
            }, function () {
                if ($.browser.msie) {
                    this.detachEvent(mouseWheelEvent, activeMouseWheel_Y);
                    window.detachEvent(mouseWheelEvent, forbidenMouseWheel);
                } else {
                    this.removeEventListener(mouseWheelEvent, activeMouseWheel_Y, false);
                    window.removeEventListener(mouseWheelEvent, forbidenMouseWheel, false);
                }
            });

            $rightOptionPanel.find("a").each(function () {
                $(this).bind("click", function (e) {
                    var i;
                    switch ($(this).attr("id")) {
                        case "show":
                            createNodeList("#listOfHiddenNodes", [
                                {"id":6, "text":"hello!"}
                            ]);
                            showMoudleWindow("list");
                            break;
                        case "event":
                            var node = createNode("eventSubprocess", {
                                x:80,
                                y:50
                            });
                            node.text.text = "未定义子流程";
                            node.pre_render();
                            node.add();
                            canvas.dataBase.add({
                                "text":node.text.text,
                                "export":node,
                                "type":node.type
                            });
                            break;
                        case "transaction":
                            var node = createNode("transactionSubprocess", {
                                x:80,
                                y:50
                            });
                            node.text.text = "未定义子流程";
                            node.pre_render();
                            node.add();
                            canvas.dataBase.add({
                                "text":node.text.text,
                                "export":node,
                                "type":node.type
                            });
                            break;
                        case "link":
                            if (options.isSelected && !options.isGrouped) {
                                options.status = "linking";
                                buildLinker(selectedObjects[0], {
                                    x:e.clientX,
                                    y:e.clientY
                                }, options.lineType).add();
                            }
                            break;
                        case "removeLinker":
                            if (options.isSelected) {
                                var lin = selectedObjects[0];
                                var s = lin.start.export;
                                var e = lin.end.export;
                                var name = "_" + s.key + "_" + e.key + "_";

                                s.next.splice(s.next.indexOf(e.key),1);
                                e.prev.splice(e.prev.indexOf(s.key),1);

                                for(var key in linkers[name]){
                                    linkers[name][key].remove();
                                }

                                delete linkers[name];
                            }
                            break;
                        case "remove":
                            ///*
                            if (options.isSelected) {
                                for (i = 0; i < selectedObjects.length; i++) {
                                    var obj = selectedObjects[i];
                                    canvas
                                        .dataBase
                                        .find(obj.export.key)
                                        .parents()
                                        .each(function () {
                                            var theKey = "_" + this.key + "_" + obj.export.key + "_";
                                            for (var key in linkers[theKey]) {
                                                try {
                                                    linkers[theKey][key].remove();
                                                } catch (e) {
                                                }
                                            }
                                            delete linkers[theKey];
                                        }).find(obj.export.key).children()
                                        .each(function () {
                                            var theKey = "_" + obj.export.key + "_" + this.key + "_";
                                            for (var key in linkers[theKey]) {
                                                try {
                                                    linkers[theKey][key].remove();
                                                } catch (e) {
                                                }
                                            }
                                            delete linkers[theKey];
                                        }).find(obj.export.key).remove();
                                    obj.remove();
                                    //selectedObjects.pop();
                                    popSelectedNode();
                                }
                            }
                            //*/
                            break;
                        case "layout":
                            autoLayout();
                            break;
                        case "rename":
                            if (options.isSelected && !options.isGrouped) {
                                var obj = selectedObjects[0];
                                if (!!obj.type.match(/Subprocess$/i)) {
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
                        case "refresh":
                            setCanvasHeight();
                            setCanvasWidth();
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

            function showNodes() {
                canvas.dataBase.all().each(function () {
                    this.export.add();
                });
            }

            function onImagesLoaded() {
                linkers = {};
                canvas.dataBase.json = data;
                canvas.dataBase
                    .layout("0")
                    .all()
                    .each(function () {
                        this.export = createNode(this.type, {
                            x:this.x - options.offsetX,
                            y:this.y - options.offsetY
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
                showNodes();

                setCanvasHeight(parseInt(canvas.height, 10));
                setCanvasWidth(parseInt(canvas.width, 10));
            }

            canvas.ready.loadImages(onImagesLoaded);


            $.extend({
                bpmn:{
                    demo:{
                        start:circle_start,
                        end:circle_end,
                        width:demo.width,
                        height:demo.height,
                        rect:rectStander,
                        line:countLine,
                        gapLength:gapLength,
                        gapWidth:gapWidth,
                        gapHeight:gapHeight
                    },
                    canvas:canvas,
                    updateScrolls:updateScrolls,
                    setCanvasWidth:setCanvasWidth,
                    setCanvasHeight:setCanvasHeight,
                    $majorWindow:$majorWindow,
                    moudleWindows:moudleWindows,
                    $blackBackground:$blackBackground,
                    showMoudleWindow:showMoudleWindow,
                    hideMoudleWindow:hideMoudleWindow,
                    autoLayout:autoLayout,
                    saveLayout:saveLayout,
                    restoreLayout:restoreLayout,
                    reload:onImagesLoaded,
                    resetCanvas:resetCanvas,
                    showLines:showLines,
                    redraw:function () {
                        canvas.redraw();
                    }
                }
            });

        });
    });
})(window, oCanvas, jQuery, undefined);