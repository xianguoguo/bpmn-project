(function ($, oCanvas, window, undefined) {

    function setGap_X(gap_x) {
        var demo = $.bpmn.demo;
        demo.start.stop().animate({
            x:demo.width / 2 - gap_x / 2
        }, 100);
        demo.end.stop().animate({
            x:demo.width / 2 + gap_x / 2
        }, 100, updateRect);
    }

    function setGap_Y(gap_y) {
        var demo = $.bpmn.demo;
        demo.start.stop().animate({
            y:demo.height / 2 - gap_y / 2
        }, 100);
        demo.end.stop().animate({
            y:demo.height / 2 + gap_y / 2
        }, 100, updateRect);
    }

    function updateRect() {
        var rect = $.bpmn.demo.rect,
            tl = $.bpmn.demo.gapLength,
            tw = $.bpmn.demo.gapWidth,
            th = $.bpmn.demo.gapHeight,
            l = $.bpmn.demo.line,
            s = $.bpmn.demo.start,
            e = $.bpmn.demo.end,
            x = s.x,
            y = s.y,
            width = e.x - s.x,
            height = e.y - s.y;
        rect.stop().animate({
            x:x,
            y:y,
            width:width,
            height:height
        }, 300, function () {
            l.stop().fadeOut(300, function () {
                this.start = s;
                this.end = e;
                this.fadeIn(300);
            });
            tl.stop().fadeOut(300, function () {
                this.text = Math.sqrt(width * width + height * height).toFixed(1) + "px";
                this.fadeIn(300);
            });
            tw.stop().fadeOut(300, function () {
                this.y = e.y;
                this.text = width.toFixed(1) + "px";
                this.fadeIn(300);
            });
            th.stop().fadeOut(300, function () {
                this.x = s.x;
                this.text = height.toFixed(1) + "px";
                this.fadeIn(300);
            });
        });
    }

    function showText() {
        var val = $(this).val(),
            max = $(this).attr("max"),
            min = $(this).attr("min");

        val = parseFloat(val);
        max = parseFloat(max);
        min = parseFloat(min);

        val = Math.max(val, min);
        val = Math.min(val, max);

        $(this).next("label").text(val).each(function () {
            if ($(this).attr("id") === "gap_x") {
                setGap_X(val);
            }
            if ($(this).attr("id") === "gap_y") {
                setGap_Y(val);
            }
        });
    }

    $("#adjustTreeGap").find("input").each(function () {
        $(this).bind("change", function () {
            showText.call(this);
        });
    });

    $("#saveTheGap").bind("click", function () {
        $.bpmn.autoLayout({
            x:parseFloat($("#gap_x").text()),
            y:parseFloat($("#gap_y").text())
        });

        $.bpmn.hideMoudleWindow("treeGap", function () {
            $.bpmn.updateScrolls();
        });
    });
    $("#cancelTheGap").bind("click", function () {
        $.bpmn.hideMoudleWindow("treeGap");
    });
})(jQuery, oCanvas, window, undefined);