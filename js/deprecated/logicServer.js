(function(window,oCanvas,macor,undefined){
    var map = dataBase();
    function hover(fn1,fn2){
        this.bind("mouseenter",fn1);
        this.bind("mouseleave",fn2);
    };
    //controlPanel module
    oCanvas.registerModule("controlPanel",function(){
        var obj = null;
        var panel = null;
        var btns = [];
        return {
            get obj(){
                return obj;
            },
            set obj(value){
                obj = value;
            },
            set panel(value){
                panel = value;
            },
            get panel(){
                return panel;
            },
            get btns(){
                return btns;
            },
            create: function(){
                var i = 0 ,
                    colors = [
                    "rgba(255,255,0,0.5)",
                    "rgba(0,255,255,0.5)",
                    "rgba(255,0,0,0.5)",
                    "rgba(0,0,0,0)"
                    ];
                this.panel = this.core.display.rectangle({
                    origin: {x:"center",y:"center"}
                });
                this.btns.push(this.core.display.btn_link({
                    radius:8
                }));
                this.btns.push(this.core.display.btn_modify({
                    radius:8.5
                }));
                this.btns.push(this.core.display.btn_remove({
                    radius:8
                }));
                for(; i < this.btns.length; i ++){
                    this.btns[i].origin = {x:"center",y:"center"};
                    this.btns[i].fill = colors[3];
                    hover.call(this.btns[i],function(e,_this){
                        return function(){
                            _this.allFinish();
                            this.fill = colors[e];
                            this.animate({
                                rotation: this.rotation + 360
                            },500,"ease-in",false);
                            if(!!_this.obj){
                                _this.obj.shadow = "0 0 10px " + this.fill.replace(/\d*\.*\d*\)$/,"1)");
                                this.redraw();
                            }
                        }
                    }(i,this),function(e,_this){
                        return function(){
                            _this.allFinish();
                            this.fill = colors[3];
                            if(!!_this.obj){
                                _this.obj.shadow = "0 0 5px rgba(0,0,0,0)";
                                this.redraw();
                            }
                        };
                    }(i,this));
                    this.panel.addChild(this.btns[i]);
                }
            },
            appedTo: function(obj){
                if(!obj.addChild){
                    return;
                }
                this.allFinish();
                if(obj.shapeType === "rectangular"){
                    this.panel.width = obj.width;
                    this.panel.height = obj.height;
                } else if(obj.shapeType === "radial"){
                    this.panel.width = obj.radius;
                    this.panel.height = obj.radius;
                }
                for(i = 0; i < this.btns.length; i ++){
                    this.btns[2 - i].x = - i * 22 - 10 + this.panel.width / 2;
                    this.btns[2 - i].y = - this.panel.height / 2 + 10;
                }
                this.obj = obj;
                this.obj.addChild(this.panel);
                this.panel.animate({y: - 20},300,"ease-in",false);
            },
            dropOut: function(){
                if(!!this.obj){
                    this.allFinish();
                    this.obj.removeChild(this.panel);
                    this.panel.y = 0;
                    this.obj = null;
                }
            },
            allFinish: function(){
                for(i = 0; i < this.btns.length; i ++){
                    this.btns[i].finish();
                }
                this.panel.finish();
            }
        };
    },"init");
    var server = {
        initializeCanvas: function(){
            return oCanvas.create({
                canvas: "#" + macor.ID_CANVAS,
                fps: macor.FPS
            });
        },
        createNodes: function(stage){
            var node,
                text,
                nodes = [],
                table = map.layout();
            map.each(function(){
                text = stage.display.text({
                    origin: {x:"center",y:"center"},
                    align: "center",
                    font: "bold 14px consoles",
                    text: "Hello world",
                    fill: "#000"
                });
                node = stage.display[this.type[0].toLocaleLowerCase() + this.type.substring(1)]({
                    _id: this.id,
                    width: text.width + 50,
                    height: text.height + 50,
                    fill: "rgba(0,0,0,0.5)",
                    border_radius: 10,
                    origin: {x:"center",y:"center"}
                });
                node.addChild(text);
                nodes.push(node);
            });
            return nodes;
        }
    };
    window.server = server;
})(window,oCanvas,macor,undefined);