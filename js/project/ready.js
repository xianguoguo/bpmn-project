(function(oCanvas,$,window,undefined){
    function ready(){
        var images = {};
        var text;
        var circle;
        var config = {
            startEvent: "32 32 img/event/start.png",
            endEvent: "32 32 img/event/end.png",

            exclusiveGateway: "32 32 img/gateway/exclusive.png",
            inclusiveGateway: "32 32 img/gateway/inclusive.png",
            parallelGateway: "32 32 img/gateway/parallel.png",

            exclusiveGatewayDeeper: "32 32 img/gateway/exclusive_deeper.png",
            inclusiveGatewayDeeper: "32 32 img/gateway/inclusive_deeper.png",
            parallelGatewayDeeper: "32 32 img/gateway/parallel_deeper.png",

            dataObject: "44 59 img/data/object.png",
            dataInput: "44 59 img/data/input.png",
            dataOutput: "44 59 img/data/output.png",
            dataStore: "44 59 img/data/store.png",

            subprocess_icon: "12 12 img/subprocess/icon.png",
            eventSubprocess_left_top:"6 6 img/subprocess/event/left_top.png",
            eventSubprocess_top:"95 6 img/subprocess/event/top.png",
            eventSubprocess_right_top:"6 6 img/subprocess/event/right_top.png",
            eventSubprocess_left:"6 63 img/subprocess/event/left.png",
            eventSubprocess_mid:"95 63 img/subprocess/event/mid.png",
            eventSubprocess_right:"6 63 img/subprocess/event/right.png",
            eventSubprocess_left_bottom:"6 6 img/subprocess/event/left_bottom.png",
            eventSubprocess_bottom:"95 6 img/subprocess/event/bottom.png",
            eventSubprocess_right_bottom:"6 6 img/subprocess/event/right_bottom.png",

            transactionSubprocess_left_top:"6 6 img/subprocess/transaction/left_top.png",
            transactionSubprocess_top:"95 6 img/subprocess/transaction/top.png",
            transactionSubprocess_right_top:"6 6 img/subprocess/transaction/right_top.png",
            transactionSubprocess_left:"6 63 img/subprocess/transaction/left.png",
            transactionSubprocess_mid:"95 63 img/subprocess/transaction/mid.png",
            transactionSubprocess_right:"6 63 img/subprocess/transaction/right.png",
            transactionSubprocess_left_bottom:"6 6 img/subprocess/transaction/left_bottom.png",
            transactionSubprocess_bottom:"95 6 img/subprocess/transaction/bottom.png",
            transactionSubprocess_right_bottom:"6 6 img/subprocess/transaction/right_bottom.png"
        };
        return {
            get images(){
                return images;
            },
            drawLoadingAnimation: function(str,end){
                circle.start = 0;
                circle.end = end;
                text.text = "loading: " + str;
                text.redraw();
            },
            createText: function(){
                text = this.core.display.text({
                    origin: {x:"center",y:"center"},
                    x: 0,
                    y: 0,
                    align: "center",
                    font: "bold 20px Microsoft YaHei",
                    text: "Weleome, please wait...",
                    fill: "#000"
                });
                circle = this.core.display.arc({
                    origin: {x:"center",y:"center"},
                    x: 300,
                    y: 300,
                    radius:120,
                    fill:"linear-gradient(315deg, #fff, #358ced)"
                });
                circle.addChild(text);
                circle.add();
            },
            getImagesCount: function(){
                var url,count = 0;
                for(url in config){
                    count += 1;
                }
                return count;
            },
            loadImages: function(callback){
                var url,
                    count,
                    img,
                    info,
                    loaded = 0,
                    _this = this;
                /*********************************************************************************/
                for(var i = 1; i < 106; i ++){
                    config[i] = "200 200 img/icon/Activity_" + (i < 10 ? "0" + i : i) + ".png";
                }
                /*********************************************************************************/
                count = this.getImagesCount();
                this.createText();
                for(url in config){
                    img = new Image();
                    img.onload = function(url){
                        return function(){
                            loaded ++;
                            images[url] = document.createElement("canvas");
                            images[url].width = this.width;
                            images[url].height = this.height;
                            images[url].getContext("2d").drawImage(this,0,0);

                            _this.drawLoadingAnimation(loaded + "/" + count,loaded / count * 360);
                            if(loaded === count){
                                text.fadeOut(500,function(){
                                    this.remove();
                                });
                                circle.fadeOut(500,function(){
                                    this.remove();
                                    this.core.reset();
                                    callback();
                                });
                            };
                        };
                    }(url);
                    info = config[url].split(" ");
                    img.width = info[0];
                    img.height = info[1];
                    img.src =  info[2];
                }
            }
        };
    }
    oCanvas.registerModule("ready",ready,"init");
})(oCanvas,jQuery,window,undefined);