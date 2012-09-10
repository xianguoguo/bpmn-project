(function ($, window, undefined) {
    var $canvas = $("#cav"),
        imgsBuffer = {};

    $(".showBackground").bind("click", function () {
        $(this).children("span").toggleText("√");
        $canvas.toggleClass("backgroundLiner");
    });

    $(".save").bind("click", function () {

    });

    $(".quit").bind("click", function () {

    });

    $(".reload").bind("click", function () {
        $.bpmn.resetCanvas();
        $.bpmn.reload();
    });

    $(".resize").bind("click", function () {
        var size = $(this).text(),
            width,
            height,
            temp;
        temp = size.split("×");
        if (temp.length === 2) {
            width = parseInt(temp[0], 10);
            height = parseInt(temp[1], 10);
        }
        $.bpmn.setCanvasWidth(width);
        $.bpmn.setCanvasHeight(height);

        $.bpmn.$majorWindow.adjustWidth(width);
        $.bpmn.$majorWindow.adjustHeight(height);

        $.bpmn.$majorWindow.toCenter(500);
    });

    $(".customResize").bind("click", function () {
        $.bpmn.showCustomResizeWindow();
    });

    $(".autoLayout").bind("click", function () {
        $.bpmn.autoLayout();
    });

    $(".saveLayout").bind("click", function () {
        $.bpmn.saveLayout();
        alert("布局数据已保存！");
    });

    $(".restoreLayout").bind("click", function () {
        $.bpmn.restoreLayout();
    });

    $(".useLinkLine").bind("click", function () {
        var flag = $(this).children("span").text();

        if (flag !== "√") {
            $(this).children("span").text("√");
            $(".useDirectLine").children("span").text("");
            $.bpmn.showLines();
        }
    });

    $(".useDirectLine").bind("click", function () {
        var flag = $(this).children("span").text();

        if (flag !== "√") {
            $(this).children("span").text("√");
            $(".useLinkLine").children("span").text("");
            $.bpmn.showLines();
        }
    });

    $(".grayscale").bind("click", function () {
        var flag = $(this).children("span").text(),
            images = $.bpmn.canvas.ready.images,
            canvas = $.bpmn.canvas,
            db = canvas.dataBase;

        if (flag !== "√") {
            $(this).children("span").text("√");

            try {
                for (var i in images) {
                    var ctx = images[i].getContext("2d"),
                        imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
                        pixel = imgData.data;

                    if (parseInt(i, 10) > 0 && parseInt(i, 10) < 106) {

                        //do nothing
                    } else {
                        for (var j = 0; j < pixel.length; j += 4) {
                            var avg = (pixel[j] + pixel[j + 1] + pixel[j + 2]) / 3;
                            avg = ~~avg;

                            pixel[j] = avg;
                            pixel[j + 1] = avg;
                            pixel[j + 2] = avg;
                        }

                        if (!imgsBuffer[i]) {
                            imgsBuffer[i] = document.createElement("canvas");
                            imgsBuffer[i].width = ctx.canvas.width;
                            imgsBuffer[i].height = ctx.canvas.height;
                            imgsBuffer[i].getContext("2d").drawImage(images[i], 0, 0);
                        }

                        ctx.putImageData(imgData, 0, 0);

                    }
                }
            } catch (e) {
            }

            db.all().each(function () {
                if (!!this.export.pre_render) {
                    this.export.pre_render();
                }
            });

            $(".colorful").children("span").text("");
            $.bpmn.redraw();
        }
    });

    $(".colorful").bind("click", function () {
        var flag = $(this).children("span").text(),
            images = $.bpmn.canvas.ready.images,
            canvas = $.bpmn.canvas,
            db = canvas.dataBase;

        if (flag !== "√") {
            $(this).children("span").text("√");

            try {
                for (var i in imgsBuffer) {
                    images[i].getContext("2d").drawImage(imgsBuffer[i], 0, 0);
                }
            } catch (e) {
            }

            db.all().each(function () {
                if (!!this.export.pre_render) {
                    this.export.pre_render();
                }
            });

            $(".grayscale").children("span").text("");
            $.bpmn.redraw();
        }
    });
})(jQuery, window, undefined);