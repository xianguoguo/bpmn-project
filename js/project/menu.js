(function ($, window, undefined) {
    var $canvas = $("#cav");

    $(".showBackground").bind("click", function () {
        $(this).find("input:checkbox").toggleAttr("checked", "checked");
        $canvas.toggleClass("backgroundLiner");
    });

    $(".resize").bind("click", function () {
        var size = $(this).text(),
            width,
            height,
            temp;
        temp = size.split("*");
        if (temp.length === 2) {
            width = parseInt(temp[0], 10);
            height = parseInt(temp[1], 10);
        }
        $.bpmn.setCanvasWidth(width);
        $.bpmn.setCanvasHeight(height);

        $.bpmn.$majorWindow.adjustWidth(width);
        $.bpmn.$majorWindow.adjustHeight(height);

        $.bpmn.centerTheMajorWindow();
    });

    $(".customResize").bind("click", function () {

    });

    $(".autoLayout").bind("click", function () {
        $.bpmn.autoLayout();
    });
})(jQuery, window, undefined);