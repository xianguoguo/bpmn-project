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
        toggleText:function (str) {
            var $this = $(this);
            if ($this.text() === str) {
                $this.text("");
            } else {
                $this.text(str);
            }
        }
    });
})(jQuery, window, undefined);