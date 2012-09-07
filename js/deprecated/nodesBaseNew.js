(function(window,oCanvas,undefined){
    function loadImages(){
        var images = {};
        var text;
        var urls = {
            startEvent: "img/startEvent.png",
            endEvent: "img/endEvent.png",
            eventSubprocess: "img/eventSubprocess.png",
            transactionSubprocess: "img/transactionSubprocess.png",
            exclusiveGateway: "img/exclusiveGateway_45deg.png",
            inclusiveGateway: "img/inclusiveGateway_45deg.png",
            parallelGateway: "img/parallelGateway_45deg.png",
            dataObject: "img/dataObject.png",
            dataInput: "img/dataInput.png",
            dataOutput: "img/dataOutput.png",
            dataStore: "img/dataStore.png",
            subprocess_icon: "img/subprocess/icon.png"
        };
        return {
            get images(){
                return images;
            },
            drawLoadingAnimation: function(str){
                text.text = "loading: " + str;
                text.redraw();
            },
            createText: function(){
                text = this.core.display.text({
                    origin: {x:"center",y:"center"},
                    x: 300,
                    y: 300,
                    align: "center",
                    font: "bold 30px sans-serif",
                    text: "Weleome, please wait...",
                    fill: "#000"
                });
                text.add();
            },
            getImagesCount: function(){
                var url,count = 0;
                for(url in urls){
                    count += 1;
                }
                return count;
            },
            createImages: function(callback){
                var url,count,loaded = 0,_this = this;
                count = this.getImagesCount();
                this.createText();
                for(url in urls){
                    images[url] = new Image();
                    loaded ++;
                    images[url].onload = function(loaded){
                        return function(){
                            _this.drawLoadingAnimation(loaded + "/" + count);
                            if(loaded === count){
                                text.fadeOut(500,function(){
                                    this.remove();
                                    callback();
                                });
                            };
                        };
                    }(loaded);
                    images[url].src = urls[url];
                }
            }
        };
    }
    oCanvas.registerModule("loadImages",loadImages,"init");

    function event(setting,core){
        return oCanvas.extend({
            core: core,
            shapeType: "radial",
            init: function(){
                this.radius = 20;
                this.shadow = "5px 5px 5px rgba(100,100,100,0.5)";
                this.dragAndDrop();
                this.add();
            },
            draw: function(){
                var ctx = core.canvas,
                    o = this.getOrigin(),
                    x = this.abs_x - o.x,
                    y = this.abs_y - o.y,
                    r = this.radius,
                    img = this.image;
                ctx.beginPath();
                ctx.drawImage(img,x - r,y - r,r * 2,r * 2);
                ctx.closePath();
            }
        },setting);
    };
    oCanvas.registerDisplayObject("event",event,"init");

    function subprocess(setting,core){
        return oCanvas.extend({
            core: core,
            shapeType: "rectangular",
            init: function(){
                this.width = 150;
                this.height = 105;
                this.shadow = "5px 5px 5px rgba(100,100,100,0.5)";
                this.icon = core.loadImages.images["subprocess_icon"];
                this.icon.width = 22;
                this.icon.height = 22;
                this.dragAndDrop();
                this.add();
            },
            draw: function(){
                var ctx = core.canvas,
                    o = this.getOrigin(),
                    x = this.abs_x - o.x,
                    y = this.abs_y - o.y,
                    w = this.width,
                    h = this.height,
                    img = this.image,
                    icon = this.icon;
                ctx.beginPath();
                ctx.drawImage(img,x,y,w,h);
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = "rgba(0,0,0,0)";
                ctx.drawImage(icon,x + w / 2 - icon.width / 2,y + h -icon.height,icon.width,icon.height);
                ctx.closePath();
            }
        },setting);
    };
    oCanvas.registerDisplayObject("subprocess",subprocess,"init");

    function data(setting,core){
        return oCanvas.extend({
            core: core,
            shapeType: "rectangular",
            init: function(){
                this.width = 75;
                this.height = 100;
                this.shadow = "5px 5px 5px rgba(100,100,100,0.5)";
                this.dragAndDrop();
                this.add();
            },
            draw: function(){
                var ctx = core.canvas,
                    o = this.getOrigin(),
                    x = this.abs_x - o.x,
                    y = this.abs_y - o.y,
                    w = this.width,
                    h = this.height,
                    img = this.image;
                ctx.beginPath();
                ctx.drawImage(img,x,y,w,h);
                ctx.closePath();
            }
        },setting);
    };
    oCanvas.registerDisplayObject("data",data,"init");

    function gateway(setting,core){
        return oCanvas.extend({
            core: core,
            shapeType: "rectangular",
            init: function(){
                this.width = 60;
                this.height = 60;
                this.rotation = 45;
                this.shadow = "5px 5px 5px rgba(100,100,100,0.5)";
                this.dragAndDrop();
                this.add();
            },
            draw: function(){
                var ctx = core.canvas,
                    o = this.getOrigin(),
                    x = this.abs_x - o.x,
                    y = this.abs_y - o.y,
                    w = this.width,
                    h = this.height,
                    img = this.image;
                ctx.beginPath();
                ctx.drawImage(img,x,y,w,h);
                ctx.closePath();
            }
        },setting);
    };
    oCanvas.registerDisplayObject("gateway",gateway,"init");

})(window,oCanvas,undefined);