(function(oCanvas,$,window,undefined){
    $.fn.menu = function(){
    };
    function menu(){
        var panel,
            btn,
            obj = null;
        return {
            load: function(){
                this.createButtons();
                this.createPanel();
                panel.add();
                panel.addChild(btn);
            },
            createPanel: function(){
                panel = this.core.display.image({
                    origin: {x:"left",y:"top"},
                    x: -540,
                    y: 0,
                    width: 540,
                    height: 40,
                    image:"img/menu.png",
                    stroke: "1px rgba(0,0,0,1)"
                });
                panel.bind("mousedown",function(e){
                    var which = parseInt((e.x - panel.x) / 40,10),
                        type;
                    switch (which){
                        case 0: type = "startEvent"; break;
                        case 1: type = "endEvent"; break;
                        case 2: type = "dataObject"; break;
                        case 3: type = "dataInput"; break;
                        case 4: type = "dataOutput"; break;
                        case 5: type = "dataStore"; break;
                        case 6: type = "eventSubprocess"; break;
                        case 7: type = "transactionSubprocess"; break;
                        case 8: type = "exclusiveGateway"; break;
                        case 9: type = "inclusiveGateway"; break;
                        case 10: type = "parallelGateway"; break;
                        default: type = undefined; break;
                    }
                    if(type !== undefined){
                        obj = this.core.elems[type]({x:e.x,y:e.y});
                        this.core.dataBase.add({
                            "type": type,
                            "export": obj
                        });
                    }
                });
                this.core.bind("mousemove",function(e){
                    if(!!obj){
                        obj.x = e.x;
                        obj.y = e.y;
                        obj.redraw();
                    }
                });
                this.core.bind("mouseup",function(e){
                    if(!!obj){
                        obj.x = e.x;
                        obj.y = e.y;
                        obj.redraw();
                        obj = null;
                    }
                });

            },
            createButtons: function(){
                btn = this.core.display.rectangle({
                    origin: {x:"left",y:"top"},
                    x: 540,
                    y: 0,
                    width: 10,
                    height: 40,
                    fill: "rgba(0,150,100,0.8)",
                    stroke: "1px rgba(0,0,0,1)"
                });
                btn.bind("click",function(){
                    if(panel.x !== 0){
                        panel.animate({
                            x: 0
                        },500,"esae-in",false);
                    } else {
                        panel.animate({
                            x: -540
                        },500,"esae-in",false);
                    }
                });
            }
        };
    };
    oCanvas.registerModule("menu",menu,"init");
})(oCanvas,jQuery,window,undefined);