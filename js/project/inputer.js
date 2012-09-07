(function ($, window, undefined) {
    $.extend({
        inputer:{
            obj:null,
            str:"<input/>",
            text:"",
            textJump:10,
            options:{
                x:0,
                y:0,
                width:100,
                heigth:14,
                font:"bold 12px Microsoft YaHei",
                _handle:null
            },
            create:function () {
                this.obj = $(this.str);
            },
            init:function (root, x, y, width, height, text) {
                if (!!this.obj) {

                    this.setOpts(x, y, width, height);
                    this.setText(text);
                    this.obj
                        .val(this.text)
                        .attr({"type":"text"})
                        .appendTo(root)
                        .css({
                            "left":this.options.x,
                            "top":this.options.y,
                            "width":this.options.width,
                            "height":this.options.heigth,
                            "position":"absolute",
                            "display":"none",
                            "border":"0px solid #000",
                            "background-color":"transparent",
                            "textAlign":"center"
                        });


                }
            },
            show:function () {
                if (!!this.obj) {
                    this.obj.fadeIn(200).focus().select();
                }
            },
            hide:function () {
                if (!!this.obj) {
                    this.obj.fadeOut(100);
                }
            },
            setOpts:function (x, y, width, height) {
                this.options.x = x || 0;
                this.options.y = y || 0;
                this.options.width = width;
                this.options.heigth = height;
            },
            getText:function () {
                return this.text;
            },
            setText:function (text) {
                ///*
                var str = text,
                    temp = [];
                while (str.length > 0) {
                    if (str.length > this.textJump) {
                        temp.push(str.substring(0, this.textJump));
                        str = str.slice(this.textJump);
                    } else {
                        temp.push(str);
                        break;
                    }
                }
                this.text = temp.join("\n");
                //*/
                //this.text = text;
            },
            change:function (handle) {
                if (!!this.obj && $.isFunction(handle)) {
                    this.obj.bind("change", handle);
                    this.options._handle = handle;
                }
            },
            blur:function (callback) {
                if (!!this.obj && $.isFunction(callback)) {
                    var _this = this;
                    this.obj.bind("blur", function () {
                        _this.hide();
                        $(this).remove();
                        callback();
                    });
                }
            },
            remove:function () {
                if (this.obj !== null) {
                    this.obj.unbind();
                    this.obj.remove();
                }
                this.obj = null;
            }
        }
    });
})(jQuery, window, undefined);