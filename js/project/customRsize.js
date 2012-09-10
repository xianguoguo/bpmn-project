(function ($, window, undefined) {
    $("#saveTheSize").bind("click", function () {
        var w = parseFloat($("#setWinWidth").val()),
            h = parseFloat($("#setWinHeight").val());
        if (!isNaN(w) && !isNaN(h)) {
            if(w > $(window).width() || h > $(window).height()){
                $("#showError").text("输入值太大！");
            } else if(w < 0 || h < 0){
                $("#showError").text("输入值不能为负数！");
            } else {
                $.bpmn.$majorWindow.adjustWidth(w);
                $.bpmn.$majorWindow.adjustHeight(h);
                $.bpmn.$majorWindow.toCenter(500);

                $.bpmn.$customResizeWin.fadeOut(500);
                $.bpmn.$blackBackground.fadeOut(500);

                $("#showError").text("");
            }
        } else {
            $("#showError").text("输入值不是数字或者为空！");
        }
    });
    $("#cancelTheSize").bind("click", function () {
        $.bpmn.$customResizeWin.fadeOut(500);
        $.bpmn.$blackBackground.fadeOut(500);

        $("#showError").text("");
    });
})(jQuery, window, undefined);