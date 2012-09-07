(function(window,$,undefined){
    var macor = {
        ID_CANVAS: "cav",
        ID_OPTION: "opt",
        FPS: 60
    };
    macor.fn = {
        test: function(times,fn){
            var args = Array.prototype.splice.call(arguments,0,2);
            var i = 0;
            var start;
            var end;
            start = (new Date()).getTime();
            for(; i < times; i ++){
                fn.apply(this,args);
            }
            end = (new Date()).getTime();
            console.log("taken time: " + (end - start) + ", result:" + fn.apply(this,args));
        },
        eachArray: function(arr,fn){
            var i = 0;
            for(; i < arr.length; i ++){
                try {
                    fn.call(arr[i],i);
                } catch (e){
                    throw new Error("macor.fn.eachArray: the function may be error.");
                }
            }
        },
        eachObject: function(obj,fn){
            var key;
            for(key in obj){
                if(obj.hasOwnProperty(key)){
                    try {
                        fn.call(obj[key],key);
                    } catch (e){
                        throw new Error("macor.fn.eachObject: the function may be error.");
                    }
                }
            }
        }
    };
    macor.obj = {
        $canvas: $("#" + macor.ID_CANVAS),
        $option: $("#" + macor.ID_OPTION)
    };
    window.macor = macor;
})(window,jQuery,undefined);