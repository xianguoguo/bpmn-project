(function(window,undefined){
    var canvas = oCanvas.create({
        canvas: "#cav",
        fps: 60
    });
    canvas.display.register(
        "arrow",{
            shapeType: "arrow"
        }, function(canvas){
            canvas.beginPath();
            canvas.moveTo(this.x,this.y);
            canvas.lineTo(this.x + 10,this.y + 10);
            canvas.strokeStyle = "#000";
            canvas.stroke();
            canvas.closePath();
    });
    var myObj = canvas.display.arrow({
        x: 50,
        y: 50
    });
    var rect = canvas.display.rectangle({
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        fill: "#0aa"
    });
    var anotherRect = rect.clone({
        fill: "#f00"
    });
    canvas.addChild(rect);
    canvas.addChild(anotherRect);
    canvas.addChild(myObj);
    rect.dragAndDrop();
    anotherRect.dragAndDrop();
    myObj.dragAndDrop();
})(window,undefined);