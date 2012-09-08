(function (oCanvas, window, undefined) {
    function round(value) {
        return ~~(0.5 + value);
    }

    function onDragStart() {
    }

    function onDragEnd() {
        //this.sx = this.x;
        //this.sy = this.y;
    }

    function event(setting, core) {
        return oCanvas.extend({
            core:core,
            shapeType:"radial",
            init:function () {
                this.origin = {x:"center", y:"center"};
                this.radius = 16;
                this.shadow = "5px 5px 5px rgba(100,100,100,0.5)";

                this.dragAndDrop({
                    start:onDragStart,
                    end:onDragEnd,
                    changeZindex:true
                });
                this.add();
            },
            draw:function () {
                this.radius = 16;
                var ctx = core.canvas,
                    o = this.getOrigin(),
                    x = this.abs_x - o.x,
                    y = this.abs_y - o.y,
                    r = this.radius,
                    img = this.image;

                ctx.beginPath({start:onDragStart});
                ctx.drawImage(img, round(x - r), round(y - r), round(r * 2), round(r * 2));
                ctx.closePath();
            }
        }, setting);
    }

    oCanvas.registerDisplayObject("event", event, "init");

    function subprocess(setting, core) {
        return oCanvas.extend({
            core:core,
            shapeType:"rectangular",
            init:function () {
                //var icon = core.ready.images["subprocess_icon"];
                this.text = core.display.text({
                    align:"center",
                    font:"bold 12px 'Microsoft YaHei'",
                    text:"New subprocess.",
                    fill:"#000"
                });
                this.origin = {x:"center", y:"center"};
                this.shadow = "5px 5px 5px rgba(100,100,100,0.5)";
                this.cache = document.createElement("canvas");

                this.pre_render = function () {
                    var opos,
                        otmp,
                        pos,
                        tmp,
                        w,
                        h,
                        ctx,
                        imgs = this.images;
                    this.width = this.text.width + 32;
                    this.height = this.text.height + 32;
                    w = this.width;
                    h = this.height;
                    this.cache.width = w;
                    this.cache.height = h;
                    ctx = this.cache.getContext("2d");
                    opos = [
                        [
                            {w:6, h:6},
                            {w:95, h:6},
                            {w:6, h:6}
                        ],
                        [
                            {w:6, h:63},
                            {w:95, h:63},
                            {w:6, h:63}
                        ],
                        [
                            {w:6, h:6},
                            {w:95, h:6},
                            {w:6, h:6}
                        ]
                    ];
                    pos = [
                        [
                            {x:0, y:0, w:6, h:6},
                            {x:6, y:0, w:w - 12, h:6},
                            {x:w - 6, y:0, w:6, h:6}
                        ],
                        [
                            {x:0, y:6, w:6, h:h - 12},
                            {x:6, y:6, w:w - 12, h:h - 12},
                            {x:w - 6, y:6, w:6, h:h - 12}
                        ],
                        [
                            {x:0, y:h - 6, w:6, h:6},
                            {x:6, y:h - 6, w:w - 12, h:6},
                            {x:w - 6, y:h - 6, w:6, h:6}
                        ]
                    ];
                    for (var i = 0; i < 3; i++) {
                        for (var j = 0; j < 3; j++) {
                            otmp = opos[i][j];
                            tmp = pos[i][j];
                            ctx.drawImage(imgs[i][j], 0, 0, otmp.w, otmp.h, tmp.x, tmp.y, tmp.w, tmp.h);
                        }
                    }
                    //ctx.drawImage(icon,round(w / 2 - 6),round(h - 12),12,12);
                };

                this.pre_render();

                this.addChild(this.text);
                this.dragAndDrop({
                    start:onDragStart,
                    end:onDragEnd,
                    changeZindex:true
                });
                this.add();
            },
            draw:function () {
                var ctx = core.canvas,
                    o = this.getOrigin(),
                    x = this.abs_x - o.x,
                    y = this.abs_y - o.y;
                this.text.origin.x = o.x - this.width / 2 + this.text.width / 2;
                this.text.origin.y = o.y - this.height / 2 + this.text.height / 2;
                ctx.beginPath();
                ctx.drawImage(this.cache, round(x), round(y));
                ctx.closePath();
            }
        }, setting);
    }

    oCanvas.registerDisplayObject("subprocess", subprocess, "init");

    function data(setting, core) {
        return oCanvas.extend({
            core:core,
            shapeType:"rectangular",
            init:function () {
                this.origin = {x:"center", y:"center"};
                this.width = 44;
                this.height = 59;
                this.shadow = "5px 5px 5px rgba(100,100,100,0.5)";

                this.dragAndDrop({
                    start:onDragStart,
                    end:onDragEnd,
                    changeZindex:true
                });
                this.add();
            },
            draw:function () {
                var ctx = core.canvas,
                    o = this.getOrigin(),
                    x = this.abs_x - o.x,
                    y = this.abs_y - o.y,
                    w = this.width,
                    h = this.height,
                    img = this.image;
                ctx.beginPath();
                ctx.drawImage(img, round(x), round(y), round(w), round(h));
                ctx.closePath();
            }
        }, setting);
    }

    oCanvas.registerDisplayObject("data", data, "init");

    function gateway(setting, core) {
        return oCanvas.extend({
            core:core,
            shapeType:"rectangular",
            init:function () {
                this.origin = {x:"center", y:"center"};
                this.width = 32;
                this.height = 32;
                this.rotation = 45;
                this.shadow = "5px 5px 5px rgba(100,100,100,0.5)";

                this.dragAndDrop({
                    start:onDragStart,
                    end:onDragEnd,
                    changeZindex:true
                });
                this.add();
            },
            draw:function () {
                var ctx = core.canvas,
                    o = this.getOrigin(),
                    x = this.abs_x - o.x,
                    y = this.abs_y - o.y,
                    w = this.width,
                    h = this.height,
                    img = this.image;
                ctx.beginPath();
                ctx.drawImage(img, round(x), round(y), round(w), round(h));
                ctx.closePath();
            }
        }, setting);
    }

    oCanvas.registerDisplayObject("gateway", gateway, "init");

    function linkLine(settings, core) {
        return oCanvas.extend({
            core:core,
            shapeType:"ractangular",
            init:function () {
                this.add();
            },
            draw:function () {
                var tmp ,
                    i ,
                    points,
                    ctx = this.core.canvas,
                    s = this.start,
                    e = this.end,
                    sh2 = s.height / 2 || s.radius || 0,
                    eh2 = e.height / 2 || e.radius || 0;
                if (s.type === "gateway") {
                    sh2 *= Math.sqrt(2);
                }
                if (e.type === "gateway") {
                    eh2 *= Math.sqrt(2);
                }
                if (s.y > e.y) {
                    points = [
                        {
                            x:s.x,
                            y:s.y - sh2
                        },
                        {
                            x:e.x,
                            y:e.y + eh2
                        }
                    ];
                    tmp = (points[0].y + points[1].y) / 2;
                    points.splice(1, 0, {
                        x:s.x,
                        y:tmp
                    }, {
                        x:e.x,
                        y:tmp
                    });
                } else {
                    points = [
                        {
                            x:s.x,
                            y:s.y + sh2
                        },
                        {
                            x:e.x,
                            y:e.y - eh2
                        }
                    ];
                    tmp = (points[0].y + points[1].y) / 2;
                    points.splice(1, 0, {
                        x:s.x,
                        y:tmp
                    }, {
                        x:e.x,
                        y:tmp
                    });
                }
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(round(points[0].x), round(points[0].y));
                for (i = 1; i < points.length; i++) {
                    ctx.lineTo(round(points[i].x), round(points[i].y));
                }
                ctx.stroke();
                ctx.closePath();
                ctx.restore();

                tmp = points[3].y > points[2].y ? -10 : 10;
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.translate(round(points[3].x), round(points[3].y));
                ctx.rotate(Math.PI / 6);
                ctx.moveTo(0, 0);
                ctx.lineTo(0, tmp);
                ctx.rotate(-Math.PI / 3);
                ctx.moveTo(0, 0);
                ctx.lineTo(0, tmp);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }, settings);
    }

    oCanvas.registerDisplayObject("linkLine", linkLine, "init");

    function directLine(settings, core) {
        return oCanvas.extend({
            core:core,
            shapeType:"ractangular",
            init:function () {
                this.add();
            },
            draw:function () {
                var tmp ,
                    len,
                    dx,
                    dy,
                    w,
                    director,
                    points,
                    ctx = this.core.canvas,
                    s = this.start,
                    e = this.end,
                    sh2 = s.height / 2 || s.radius || 0,
                    eh2 = e.height / 2 || e.radius || 0;
                if (s.type === "gateway") {
                    sh2 *= Math.sqrt(2);
                }
                if (e.type === "gateway") {
                    eh2 *= Math.sqrt(2);
                }
                if (s.y > e.y) {
                    points = [
                        {
                            x:s.x,
                            y:s.y - sh2
                        },
                        {
                            x:e.x,
                            y:e.y + eh2
                        }
                    ];
                } else {
                    points = [
                        {
                            x:s.x,
                            y:s.y + sh2
                        },
                        {
                            x:e.x,
                            y:e.y - eh2
                        }
                    ];
                }

                //通过角度旋转的方式绘制带箭头的图形
                dx = points[1].x - points[0].x;
                dy = points[1].y - points[0].y;
                len = Math.sqrt(dx * dx + dy * dy);
                tmp = Math.asin(dy / len);
                director = dx > 0 ? tmp : - Math.PI - tmp;
                len = Math.max(len, 12);
                w = 1;

                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.translate(round(points[0].x), round(points[0].y));
                ctx.rotate(director);

                ctx.moveTo(0, w);
                ctx.lineTo(0, -w);
                ctx.lineTo(len - 12, -w);
                ctx.lineTo(len - 12, -3);
                ctx.lineTo(len, 0);
                ctx.lineTo(len - 12, 3);
                ctx.lineTo(len - 12, w);
                ctx.lineTo(0, w);

                ctx.fillStyle = "rgba(0,0,0,0.5)"
                ctx.fill();
                //ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }, settings);
    }

    oCanvas.registerDisplayObject("directLine", directLine, "init");

    oCanvas.registerModule("elems", function () {
        return {
            startEvent:function (arg) {
                arg.image = this.core.ready.images["startEvent"];
                return this.core.display.event(arg);
            },
            endEvent:function (arg) {
                arg.image = this.core.ready.images["endEvent"];
                return this.core.display.event(arg);
            },
            dataObject:function (arg) {
                arg.image = this.core.ready.images["dataObject"];
                return this.core.display.data(arg);
            },
            dataInput:function (arg) {
                arg.image = this.core.ready.images["dataInput"];
                return this.core.display.data(arg);
            },
            dataOutput:function (arg) {
                arg.image = this.core.ready.images["dataOutput"];
                return this.core.display.data(arg);
            },
            dataStore:function (arg) {
                arg.image = this.core.ready.images["dataStore"];
                return this.core.display.data(arg);
            },
            eventSubprocess:function (arg) {
                var imgs = this.core.ready.images;
                arg.images = [
                    [imgs["eventSubprocess_left_top"   ], imgs["eventSubprocess_top"   ], imgs["eventSubprocess_right_top"   ]],
                    [imgs["eventSubprocess_left"       ], imgs["eventSubprocess_mid"   ], imgs["eventSubprocess_right"       ]],
                    [imgs["eventSubprocess_left_bottom"], imgs["eventSubprocess_bottom"], imgs["eventSubprocess_right_bottom"]]
                ];
                return this.core.display.subprocess(arg);
            },
            transactionSubprocess:function (arg) {
                var imgs = this.core.ready.images;
                arg.images = [
                    [imgs["transactionSubprocess_left_top"   ], imgs["transactionSubprocess_top"   ], imgs["transactionSubprocess_right_top"   ]],
                    [imgs["transactionSubprocess_left"       ], imgs["transactionSubprocess_mid"   ], imgs["transactionSubprocess_right"       ]],
                    [imgs["transactionSubprocess_left_bottom"], imgs["transactionSubprocess_bottom"], imgs["transactionSubprocess_right_bottom"]]
                ];
                return this.core.display.subprocess(arg);
            },
            //mormal
            exclusiveGateway:function (arg) {
                arg.image = this.core.ready.images["exclusiveGateway"];
                return this.core.display.gateway(arg);
            },
            inclusiveGateway:function (arg) {
                arg.image = this.core.ready.images["inclusiveGateway"];
                return this.core.display.gateway(arg);
            },
            parallelGateway:function (arg) {
                arg.image = this.core.ready.images["parallelGateway"];
                return this.core.display.gateway(arg);
            },
            //deeper
            exclusiveGatewayDeeper:function (arg) {
                arg.image = this.core.ready.images["exclusiveGatewayDeeper"];
                return this.core.display.gateway(arg);
            },
            inclusiveGatewayDeeper:function (arg) {
                arg.image = this.core.ready.images["inclusiveGatewayDeeper"];
                return this.core.display.gateway(arg);
            },
            parallelGatewayDeeper:function (arg) {
                arg.image = this.core.ready.images["parallelGatewayDeeper"];
                return this.core.display.gateway(arg);
            }
        };
    }, "init");
})(oCanvas, window, undefined);