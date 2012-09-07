(function(oCanvas,$,window,undefined){
    function option(){
        var $opt = $("#opt"),
            obj = null,
            status = "",
            referObj = null,
            linker = null;
        var opt = {
            init: function(){

            },
            show: function(){
                $opt.css({
                    "display": "block"
                });
            },
            hide: function(){
                $opt.css({
                   "display": "none"
                });
            }
        }
        return {
            set obj(value){
                if(!!value){
                    obj = value;
                    $opt.css({
                        "display":"block"
                    });
                } else if(value === null){
                    obj = value;
                    $opt.css({
                        "display":"none"
                    });
                }
            },
            set position(value){
                $opt.css({
                    left: value.x,
                    top: value.y
                });
            },
            set referObj(value){
                referObj = value;
            },
            get status(){
                return status;
            },
            load: function(){
                var _this = this;
                $opt.find("#link").click(function(e){
                    status = "link";
                    if(linker === null){
                        linker = _this.core.display.linkLine({
                            start: obj,
                            end: e
                        });
                    } else {
                        linker.start = obj;
                        linker.end = e;
                    }
                    if(linker.added === false){
                        linker.add();
                    }
                    _this.obj = null;
                });
                $opt.find("#remove").click(function(e){
                    if(obj !== null){
                        obj.remove();
                    }
                    _this.obj = null;
                });
                $opt.find("#fullscreen").toggle(function(){
                    $("body").addClass("hidescroll");
                    $("#cav").parent().appendTo("#_cav");
                    $("#cav").removeClass("border");
                    $("#cav")[0].width = $.findDimensions().width;
                    $("#cav")[0].height = $.findDimensions().height;
                    $(".back").fadeIn(500).css({
                        "height":$.findDimensions().height
                    });
                    $(this).text("退出全屏");
                    _this.obj = null;
                },function(){
                    $("body").removeClass("hidescroll");
                    $("#cav").parent().appendTo("body");
                    $("#cav").addClass("border");
                    $("#cav")[0].width = 550;
                    $("#cav")[0].height = 600;
                    _this.core.redraw();
                    $(".back").fadeOut(500);
                    $(this).text("全屏");
                    _this.obj = null;
                });
                this.core.bind("mousemove",function(e){
                    if(status === "link"){
                        linker.end = e;
                        linker.redraw();
                    }
                });
                this.core.bind("click",function(e){
                    if(e.button === 0){
                        if(status === "link" && linker !== null){
                            if(referObj !== null && referObj.id !== linker.start.id && !referObj.prevLinkers[linker.start.export.key]){
                                referObj.prevLinkers[linker.start.export.key] = linker;
                                linker.start.nextLinkers[referObj.export.key] = linker;
                                _this.core.dataBase.
                                    find(linker.start.export.key).each(function(){
                                        this.next.push(referObj.export.key);
                                    }).find(referObj.export.key).each(function(){
                                        this.prev.push(linker.start.export.key);
                                    });
                                linker.end = referObj;
                                linker.redraw();
                                linker = null;
                                referObj = null;
                                status = "";
                            } else {
                                linker.remove();
                            }
                        }
                        _this.obj = null;
                    }
                });
            }
        };
    };
    oCanvas.registerModule("option",option,"init");
})(oCanvas,jQuery,window,undefined);