(function (jQuery, window, undefined) {
    $.extend({
        findDimensions:function () {
            var winWidth = 0,
                winHeight = 0;
            if (window.innerWidth) {
                winWidth = window.innerWidth;
            } else if (document.body && document.body.clientWidth) {
                winWidth = document.body.clientWidth;
            }
            if (document.documentElement && document.documentElement.clientWidth && document.documentElement.clientHeight) {
                winWidth = document.documentElement.clientWidth;
                winHeight = document.documentElement.clientHeight;
            }
            return {
                width:winWidth,
                height:winHeight
            };
        }
    });
    $.fn.extend({
        toggleAttr:function (name, value) {
            var $this = $(this),
                prop = {},
                comp = $this.attr(name);
            prop[name] = value;
            if (comp === undefined) {
                $this.attr(prop);
            } else {
                $this.removeAttr(name);
            }
        }
    });
})(jQuery, window, undefined);