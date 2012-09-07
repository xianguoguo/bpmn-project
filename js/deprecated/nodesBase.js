(function(window,oCanvas,undefined){
    function setStyle(ctx){
        if (this.fill !== "") {
            ctx.fillStyle = this.fill;
        }
        if(this.strokeWidth > 0){
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeStyle = this.strokeColor;
        }
        if (this.shadow.blur > 0) {
            ctx.shadowOffsetX = this.shadow.offsetX;
            ctx.shadowOffsetY = this.shadow.offsetY;
            ctx.shadowBlur = this.shadow.blur;
            ctx.shadowColor = this.shadow.color;
        }
    };
    //btn_remove button class
    oCanvas.registerDisplayObject("btn_remove",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "radial",
            init: function(){},
            draw: function(){
                var ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    x = this.abs_x - origin.x,
                    y = this.abs_y - origin.y,
                    r = this.radius;

                ctx.beginPath();
                ctx.translate(x,y);
                ctx.rotate(Math.PI / 4);
                setStyle.call(this,ctx);
                ctx.arc(0,0,r,0,Math.PI * 2,false);
                ctx.moveTo(- r / 4 * 3,0);
                ctx.lineTo(r / 4 * 3,0);
                ctx.moveTo(0,- r / 4 * 3);
                ctx.lineTo(0,r / 4 * 3);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
        },settings);
    },"init");
    //btn_link button class
    oCanvas.registerDisplayObject("btn_link",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "radial",
            init: function(){},
            draw: function(){
                var ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    x = this.abs_x - origin.x,
                    y = this.abs_y - origin.y,
                    r = this.radius;
                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                ctx.rotate(Math.PI / 4);
                setStyle.call(this,ctx);
                ctx.arc(0,0,r,0,Math.PI * 2,false);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                ctx.rotate(Math.PI / 4);
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.lineWidth = 1;
                ctx.translate(r / 4 * 3,0);
                ctx.moveTo(0,0);
                ctx.lineTo(- r / 2 * 3,0);
                ctx.rotate(Math.PI / 6);
                ctx.moveTo(0,0);
                ctx.lineTo(- 5,0);
                ctx.rotate(- Math.PI / 3);
                ctx.moveTo(0,0);
                ctx.lineTo(- 5,0);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        },settings);
    },"init");
    //btn_modify button class
    oCanvas.registerDisplayObject("btn_modify",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "radial",
            init: function(){},
            draw: function(){
                var ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    x = this.abs_x - origin.x,
                    y = this.abs_y - origin.y,
                    r = this.radius,
                    r2 = r / 2,
                    rsqrt32 = r * Math.sqrt(3) / 2,
                    i = 0;
                ctx.save();
                ctx.beginPath();
                setStyle.call(this,ctx);
                ctx.translate(x,y);
                ctx.moveTo(r,0);
                for(; i <= 6; i ++){
                    ctx.lineTo(Math.cos(Math.PI / 3 * i) * r,Math.sin(Math.PI / 3 * i) * r);
                }
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = "rgba(0,0,0,0.2)";
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.lineWidth = 1;
                ctx.arc(0,0,r / 2,0,Math.PI * 2,false);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        },settings);
    },"init");
    //linkLine
    oCanvas.registerDisplayObject("linkLine",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "ractangular",
            init: function(){
                this.opacity = 0;
                this.fadeIn(500);
            },
            draw: function(){
                var tmp ,
                    i ,
                    points,
                    ctx = this.core.canvas,
                    s = this.start,
                    e = this.end,
                    sh2 = s.height / 2 || 0,
                    eh2 = e.height / 2 || 0;
                if(s.y > e.y){
                    points = [{
                        x: s.x,
                        y: s.y - sh2
                    },{
                        x: e.x,
                        y: e.y + eh2
                    }];
                    tmp = (points[0].y + points[1].y) / 2;
                    points.splice(1,0,{
                        x: s.x,
                        y: tmp
                    },{
                        x: e.x,
                        y: tmp
                    });
                } else {
                    points = [{
                        x: s.x,
                        y: s.y + sh2
                    },{
                        x: e.x,
                        y: e.y - eh2
                    }];
                    tmp = (points[0].y + points[1].y) / 2;
                    points.splice(1,0,{
                        x: s.x,
                        y: tmp
                    },{
                        x: e.x,
                        y: tmp
                    });
                }
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(points[0].x,points[0].y);
                for(i = 1; i < points.length; i ++){
                    ctx.lineTo(points[i].x,points[i].y);
                }
                ctx.stroke();
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.translate(points[0].x,points[0].y);
                ctx.arc(0,0,5,0,Math.PI * 2,false);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();

                tmp = points[3].y > points[2].y ? - 10 : 10;
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.translate(points[3].x,points[3].y);
                ctx.rotate(Math.PI / 6);
                ctx.moveTo(0,0);
                ctx.lineTo(0,tmp);
                ctx.rotate(- Math.PI / 3);
                ctx.moveTo(0,0);
                ctx.lineTo(0,tmp);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        },settings);
    },"init");
    //startEvent element class
    oCanvas.registerDisplayObject("startEvent",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "radial",
            init: function(){
                this.radius = 20;
                this.origin = {x:"center",y:"center"};
                this.fill = "linear-gradient(270deg, #0f0, #ff0)";
                this.stroke = "2px rgba(0,0,0,1)";
                this.shadow = "5 5 5px rgba(0,0,0,0.5)";
                this.dragAndDrop();
            },
            draw: function(){
                var ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    x = this.abs_x - origin.x,
                    y = this.abs_y - origin.y,
                    r = this.radius;
                ctx.beginPath();
                setStyle.call(this,ctx);
                ctx.arc(x,y,r,Math.PI * 2,false);
                if(this.strokeWidth > 0){
                    ctx.stroke();
                }
                if(this.fill !== ""){
                    ctx.fill();
                }
                ctx.closePath();
            }
        },settings);
    },"init");
    //endEvent element class
    oCanvas.registerDisplayObject("endEvent",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "radial",
            init: function(){
                this.radius = 20;
                this.origin = {x:"center",y:"center"};
                this.fill = "linear-gradient(270deg, #f00, #fff)";
                this.stroke = "2px rgba(0,0,0,1)";
                this.shadow = "5 5 5px rgba(0,0,0,0.5)";
                this.dragAndDrop();
            },
            draw: function(){
                var ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    x = this.abs_x - origin.x,
                    y = this.abs_y - origin.y,
                    r = this.radius;
                ctx.beginPath();
                setStyle.call(this,ctx);
                ctx.arc(x,y,r,Math.PI * 2,false);
                if(this.strokeWidth > 0){
                    ctx.stroke();
                }
                if(this.fill !== ""){
                    ctx.fill();
                }
                ctx.closePath();
            }
        },settings);
    },"init");
    //eventSubprocess element class
    oCanvas.registerDisplayObject("eventSubprocess",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "rectangular",
            init: function(){
                var text = core.display.text({
                    y: -10,
                    origin: {x:"center",y:"center"},
                    align: "center",
                    font: "bold 14px sans-serif",
                    text: this.text,
                    fill: "rgba(0,0,0,1)"
                });
                this.origin = {x:"center",y:"center"};
                this.fill = "linear-gradient(315deg, #52baea, #aadef6)";
                //this.stroke = "2px rgba(0,0,0,1)";
                this.shadow = "5 5 5px rgba(0,0,0,0.5)";
                this.border_radius = 10;
                this.icon_size = 16;
                this.width = text.width + 70 < 160 ? 160 : text.width + 70;
                this.height = text.height + 40;

                var old = this.remove;
                this.remove = function(){
                    text.remove();
                    old.call(this);
                };
                this.addChild(text);
                this.dragAndDrop();
            },
            draw: function(){
                var ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    w = this.width,
                    h = this.height,
                    w2 = w / 2,
                    h2 = h / 2,
                    x = this.abs_x - origin.x + w2,
                    y = this.abs_y - origin.y + h2,
                    br = this.border_radius,
                    is = this.icon_size,
                    is2 = is / 2;
                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                setStyle.call(this,ctx);
                ctx.moveTo(- w2,- h2 + br);
                ctx.arcTo(- w2,- h2,- w2 + br,- h2,br);
                ctx.lineTo(w2 - br,- h2);
                ctx.arcTo(w2,-h2,w2,-h2 + br,br);
                ctx.lineTo(w2,h2 - br);
                ctx.arcTo(w2,h2,w2 - br,h2,br);
                ctx.lineTo(- w2 + br,h2);
                ctx.arcTo(- w2,h2,-w2,h2 - br,br);
                ctx.lineTo(-w2,-h2 + br);
                if(this.fill !== ""){
                    ctx.fill();
                }
                if(this.strokeWidth > 0){
                    ctx.stroke();
                }
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                setStyle.call(this,ctx);
                ctx.moveTo(- w2,- h2 + br);

                if(this.fill !== ""){
                    ctx.fill();
                }
                if(this.strokeWidth > 0){
                    ctx.stroke();
                }
                ctx.closePath();
                ctx.restore();

                //icon
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgba(100,100,100,1)";
                ctx.shadowColor = "rgba(0,0,0,0)";
                ctx.translate(- is2,h2 - is);
                ctx.rect(0,0,is,is);
                ctx.moveTo(2,is2);
                ctx.lineTo(is - 2,is2);
                ctx.moveTo(is2,2);
                ctx.lineTo(is2,is - 2);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        },settings);
    },"init");
    //transactionSubprocess element class
    oCanvas.registerDisplayObject("transactionSubprocess",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "rectangular",
            init: function(){
                var text = core.display.text({
                    y: -10,
                    origin: {x:"center",y:"center"},
                    align: "center",
                    font: "bold 14px sans-serif",
                    text: this.text,
                    fill: "rgba(0,0,0,1)"
                });
                this.origin = {x:"center",y:"center"};
                this.fill = "linear-gradient(315deg, #f0bc4d, #f2daa1)";
                //this.stroke = "2px rgba(0,0,0,1)";
                this.shadow = "5 5 5px rgba(0,0,0,0.5)";
                this.border_radius = 10;
                this.icon_size = 16;
                this.width = text.width + 70 < 160 ? 160 : text.width + 70;
                this.height = text.height + 40;

                var old = this.remove;
                this.remove = function(){
                    text.remove();
                    old.call(this);
                };
                this.addChild(text);
                this.dragAndDrop();
            },
            draw: function(){
                var ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    w = this.width,
                    h = this.height,
                    w2 = w / 2,
                    h2 = h / 2,
                    x = this.abs_x - origin.x + w2,
                    y = this.abs_y - origin.y + h2,
                    br = this.border_radius,
                    is = this.icon_size,
                    is2 = is / 2;
                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                setStyle.call(this,ctx);
                ctx.moveTo(- w2,- h2 + br);
                ctx.arcTo(- w2,- h2,- w2 + br,- h2,br);
                ctx.lineTo(w2 - br,- h2);
                ctx.arcTo(w2,-h2,w2,-h2 + br,br);
                ctx.lineTo(w2,h2 - br);
                ctx.arcTo(w2,h2,w2 - br,h2,br);
                ctx.lineTo(- w2 + br,h2);
                ctx.arcTo(- w2,h2,-w2,h2 - br,br);
                ctx.lineTo(-w2,-h2 + br);
                if(this.fill !== ""){
                    ctx.fill();
                }
                if(this.strokeWidth > 0){
                    ctx.stroke();
                }
                ctx.closePath();
                ctx.restore();

                //icon
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgba(100,100,100,1)";
                ctx.shadowColor = "rgba(0,0,0,0)";
                ctx.translate(- is2,h2 - is);
                ctx.rect(0,0,is,is);
                ctx.moveTo(2,is2);
                ctx.lineTo(is - 2,is2);
                ctx.moveTo(is2,2);
                ctx.lineTo(is2,is - 2);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        },settings);
    },"init");
    //exclusiveGateway element class
    oCanvas.registerDisplayObject("exclusiveGateway",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "rectangular",
            init: function(){
                this.origin = {x:"center",y:"center"};
                this.fill = "linear-gradient(315deg, #f5f32a, #fefefb)";
                //this.stroke = "2px rgba(0,0,0,1)";
                this.shadow = "5 5 10px rgba(0,0,0,0.5)";
                this.width = 50;
                this.height = 50;
                this.rotation = 45;
                this.icon_size = 30;

                this.dragAndDrop();
            },
            draw: function(){
                ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    w = this.width,
                    h = this.height,
                    w2 = w / 2,
                    h2 = h / 2,
                    x = this.abs_x - origin.x + w2,
                    y = this.abs_y - origin.y + h2,
                    s = this.icon_size,
                    s2 = s / 2;
                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                setStyle.call(this,ctx);
                ctx.rect(- w2, - h2,this.width,this.height);
                if(this.fill !== ""){
                    ctx.fill();
                }
                if(this.strokeWidth > 0){
                    ctx.stroke();
                }
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                ctx.fillStyle = "rgba(255,255,255,1)";
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.rotate(- Math.PI / 4);
                ctx.rect(- s2, - s2,s,s);
                ctx.fill();
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.rotate(- Math.PI / 4);
                ctx.lineWidth = 5;
                ctx.lineCap = "round";
                ctx.strokeStyle = "rgba(100,100,100,1)";
                ctx.shadowColor = "rgba(0,0,0,0)";
                ctx.moveTo(- s2 + 2,s2 - 2);
                ctx.lineTo(s2 - 2,- s2 + 2);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        },settings);
    },"init");
    //inclusiveGateway element class
    oCanvas.registerDisplayObject("inclusiveGateway",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "rectangular",
            init: function(){
                this.origin = {x:"center",y:"center"};
                this.fill = "linear-gradient(315deg, #f5f32a, #fefefb)";
                //this.stroke = "2px rgba(0,0,0,1)";
                this.shadow = "5 5 10px rgba(0,0,0,0.5)";
                this.width = 50;
                this.height = 50;
                this.rotation = 45;
                this.icon_size = 30;

                this.dragAndDrop();
            },
            draw: function(){
                ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    w = this.width,
                    h = this.height,
                    w2 = w / 2,
                    h2 = h / 2,
                    x = this.abs_x - origin.x + w2,
                    y = this.abs_y - origin.y + h2,
                    s = this.icon_size,
                    s2 = s / 2;
                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                setStyle.call(this,ctx);
                ctx.rect(- w2, - h2,this.width,this.height);
                if(this.fill !== ""){
                    ctx.fill();
                }
                if(this.strokeWidth > 0){
                    ctx.stroke();
                }
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgba(100,100,100,1)";
                ctx.shadowColor = "rgba(0,0,0,0)";
                ctx.translate(x,y);
                ctx.arc(0,0,s2,0,Math.PI * 2,false);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        },settings);
    },"init");
    //parallelGateway
    oCanvas.registerDisplayObject("parallelGateway",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "rectangular",
            init: function(){
                this.origin = {x:"center",y:"center"};
                this.fill = "linear-gradient(315deg, #f5f32a, #fefefb)";
                //this.stroke = "2px rgba(0,0,0,1)";
                this.shadow = "5 5 10px rgba(0,0,0,0.5)";
                this.width = 50;
                this.height = 50;
                this.rotation = 45;
                this.icon_size = 30;

                this.dragAndDrop();
            },
            draw: function(){
                ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    w = this.width,
                    h = this.height,
                    w2 = w / 2,
                    h2 = h / 2,
                    x = this.abs_x - origin.x + w2,
                    y = this.abs_y - origin.y + h2,
                    s = this.icon_size,
                    s2 = s / 2;
                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                setStyle.call(this,ctx);
                ctx.rect(- w2, - h2,this.width,this.height);
                if(this.fill !== ""){
                    ctx.fill();
                }
                if(this.strokeWidth > 0){
                    ctx.stroke();
                }
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgba(100,100,100,1)";
                ctx.shadowColor = "rgba(0,0,0,0)";
                ctx.translate(x,y);
                ctx.rotate(- Math.PI / 4);
                ctx.moveTo(- s2,0);
                ctx.lineTo(s2,0);
                ctx.moveTo(0,- s2);
                ctx.lineTo(0,s2);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        },settings);
    },"init");
    //dataObject element class
    oCanvas.registerDisplayObject("dataObject",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "rectangular",
            init: function(){
                this.origin = {x:"center",y:"center"};
                this.fill = "linear-gradient(45deg, #aaaaaa, #eaeaea, #aaaaaa)";
                //this.stroke = "2px rgba(0,0,0,1)";
                this.shadow = "5 5 5px rgba(0,0,0,0.5)";
                this.width = 65;
                this.height = 80;
                this.icon_size = 15;

                this.dragAndDrop();
            },
            draw: function(){
                ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    w = this.width,
                    h = this.height,
                    w2 = w / 2,
                    h2 = h / 2,
                    x = this.abs_x - origin.x + w2,
                    y = this.abs_y - origin.y + h2,
                    s = this.icon_size;
                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                setStyle.call(this,ctx);
                ctx.moveTo(- w2,- h2);
                ctx.lineTo(- w2,h2);
                ctx.lineTo(w2,h2);
                ctx.lineTo(w2,- h2 + s);
                ctx.lineTo(w2 - s,- h2);
                if(this.fill !== ""){
                    ctx.fill();
                }
                if(this.strokeWidth > 0){
                    ctx.stroke();
                }
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.shadowBlur = 5;
                ctx.shadowColor = "rgba(0,0,0,1)";
                ctx.fillStyle = this.fill;
                ctx.translate(w2 - s,- h2);
                ctx.moveTo(0,0);
                ctx.lineTo(0,s);
                ctx.lineTo(s,s);
                ctx.lineTo(0,0);
                ctx.fill();
                ctx.closePath();
                ctx.restore();

            }
        },settings);
    },"init");
    //dataInput element class
    oCanvas.registerDisplayObject("dataInput",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "rectangular",
            init: function(){
                this.origin = {x:"center",y:"center"};
                this.fill = "linear-gradient(45deg, #aaaaaa, #eaeaea, #aaaaaa)";
                //this.stroke = "2px rgba(0,0,0,1)";
                this.shadow = "5 5 10px rgba(0,0,0,0.5)";
                this.width = 65;
                this.height = 80;
                this.icon_size = 15;

                this.dragAndDrop();
            },
            draw: function(){
                ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    w = this.width,
                    h = this.height,
                    w2 = w / 2,
                    h2 = h / 2,
                    x = this.abs_x - origin.x + w2,
                    y = this.abs_y - origin.y + h2,
                    s = this.icon_size,
                    s2 = s / 2;
                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                setStyle.call(this,ctx);
                ctx.moveTo(- w2,- h2);
                ctx.lineTo(- w2,h2);
                ctx.lineTo(w2,h2);
                ctx.lineTo(w2,- h2 + s);
                ctx.lineTo(w2 - s,- h2);
                if(this.fill !== ""){
                    ctx.fill();
                }
                if(this.strokeWidth > 0){
                    ctx.stroke();
                }
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.shadowBlur = 5;
                ctx.shadowColor = "rgba(0,0,0,1)";
                ctx.fillStyle = this.fill;
                ctx.translate(w2 - s,- h2);
                ctx.moveTo(0,0);
                ctx.lineTo(0,s);
                ctx.lineTo(s,s);
                ctx.lineTo(0,0);
                ctx.fill();
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 5;
                ctx.shadowColor = "rgba(0,0,0,1)";
                ctx.fillStyle = "rgba(255,255,255,1)";
                ctx.translate(w2 - s,- h2 + s2);
                ctx.moveTo(0,0);
                ctx.lineTo(- s2,- s2);
                ctx.lineTo(- s2,- s2 + s2 / 2);
                ctx.lineTo(- s,- s2 + s2 / 2);
                ctx.lineTo(- s,s2 - s2 /2);
                ctx.lineTo(- s2,s2 - s2 /2);
                ctx.lineTo(- s2,s2);
                ctx.lineTo(0,0);
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }
        },settings);
    },"init");
    //dataOutput element class
    oCanvas.registerDisplayObject("dataOutput",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "rectangular",
            init: function(){
                this.origin = {x:"center",y:"center"};
                this.fill = "linear-gradient(45deg, #aaaaaa, #eaeaea, #aaaaaa)";
                //this.stroke = "1px rgba(0,0,0,1)";
                this.shadow = "5 5 10px rgba(0,0,0,0.5)";
                this.width = 65;
                this.height = 80;
                this.icon_size = 15;

                this.dragAndDrop();
            },
            draw: function(){
                ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    w = this.width,
                    h = this.height,
                    w2 = w / 2,
                    h2 = h / 2,
                    x = this.abs_x - origin.x + w2,
                    y = this.abs_y - origin.y + h2,
                    s = this.icon_size,
                    s2 = s / 2;
                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                setStyle.call(this,ctx);
                ctx.moveTo(- w2,- h2);
                ctx.lineTo(- w2,h2);
                ctx.lineTo(w2,h2);
                ctx.lineTo(w2,- h2 + s);
                ctx.lineTo(w2 - s,- h2);
                if(this.fill !== ""){
                    ctx.fill();
                }
                if(this.strokeWidth > 0){
                    ctx.stroke();
                }
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.shadowBlur = 5;
                ctx.shadowColor = "rgba(0,0,0,1)";
                ctx.fillStyle = this.fill;
                ctx.translate(w2 - s,- h2);
                ctx.moveTo(0,0);
                ctx.lineTo(0,s);
                ctx.lineTo(s,s);
                ctx.lineTo(0,0);
                ctx.fill();
                ctx.closePath();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 5;
                ctx.shadowColor = "rgba(255,255,255,1)";
                ctx.fillStyle = "rgba(100,100,100,1)";
                ctx.translate(w2 - s,- h2 + s2);
                ctx.moveTo(0,0);
                ctx.lineTo(- s2,- s2);
                ctx.lineTo(- s2,- s2 + s2 / 2);
                ctx.lineTo(- s,- s2 + s2 / 2);
                ctx.lineTo(- s,s2 - s2 /2);
                ctx.lineTo(- s2,s2 - s2 /2);
                ctx.lineTo(- s2,s2);
                ctx.lineTo(0,0);
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }
        },settings);
    },"init");
    //dataStore element class
    oCanvas.registerDisplayObject("dataStore",function(settings,core){
        return oCanvas.extend({
            core: core,
            shapeType: "rectangular",
            init: function(){
                this.origin = {x:"center",y:"center"};
                this.fill = "linear-gradient(0deg, #aaaaaa, #eaeaea, #aaaaaa)";
                //this.stroke = "2px rgba(0,0,0,1)";
                this.shadow = "5 5 10px rgba(0,0,0,0.7)";
                this.width = 50;
                this.height = 70;
                this.border_radius = 8;

                this.dragAndDrop();
            },
            draw: function(){
                ctx = this.core.canvas,
                    origin = this.getOrigin(),
                    w = this.width,
                    h = this.height,
                    w2 = w / 2,
                    h2 = h / 2,
                    x = this.abs_x - origin.x + w2,
                    y = this.abs_y - origin.y + h2,
                    br = this.border_radius;
                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                setStyle.call(this,ctx);
                ctx.moveTo(0,- h2);
                ctx.quadraticCurveTo(w2,- h2,w2,- h2 + br);
                ctx.lineTo(w2,h2 - br);
                ctx.quadraticCurveTo(w2,h2,0,h2);
                ctx.quadraticCurveTo(- w2,h2,- w2,h2 - br);
                ctx.lineTo(- w2,- h2 + br);
                ctx.quadraticCurveTo(- w2,- h2,0,- h2);
                if(this.fill !== ""){
                    ctx.fill();
                }
                if(this.strokeWidth > 0){
                    ctx.stroke();
                }
                ctx.closePath();
                ctx.restore();

                for(var i = 0; i < 3; i ++){
                    ctx.save();
                    ctx.beginPath();
                    ctx.shadowBlur = 10;
                    ctx.shadowOffsetY = 3;
                    ctx.shadowColor = "rgba(0,0,0,0.7)";
                    ctx.fillStyle = this.fill;
                    ctx.translate(x,y - i * 6);
                    ctx.moveTo(- w2,- h2 + br);
                    ctx.quadraticCurveTo(- w2,- h2 + 2 * br,0,- h2 + 2 * br);
                    ctx.quadraticCurveTo(w2,- h2 + 2 * br,w2,- h2 + br);
                    ctx.quadraticCurveTo(w2,- h2,0,- h2);
                    ctx.quadraticCurveTo(- w2,- h2,- w2,- h2 + br);
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                }
            }
        },settings);
    },"init");
})(window,oCanvas,undefined);