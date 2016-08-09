// Config
var imageURL = 'mona.jpg';
var captureFactor = 30;
var captureWidth = view.size.width / captureFactor;
var captureHeight = view.size.height / captureFactor;
var previewFactor = 4;
var speed = 20; // higher is slower (upside down smiley face)
var skip = 0;

// State
var loaded = false;
var rasterColors, subRasters;

// Initialize rect for full-screen COLOR
var displayRect = new Path.Rectangle({
    point: [0, 0],
    size: [view.size.width, view.size.height]
});

// Load image
var raster = new Raster(imageURL);
raster.fitBounds(view.bounds, true);
raster.visible = false;
raster.onLoad = function () {
    // Get colors

    var getColorOffload = getColors(raster);
    rasterColors = getColorOffload.colors;
    subRasters = getColorOffload.subRasters;

    loaded = true;

    // var rect2 = new Rectangle(0, view.size.height, captureWidth, captureHeight);
    // var path2 = new Path.Rectangle(rect2);
    // path2.strokeColor = 'red';
    // var path3 = path2.clone();
    // var sub = raster.getSubRaster(rect2);
    // sub.position = view.center;
    //
    // path3.position = view.center;
    // path3.strokeWidth = 5;

};

var previewRect = new Path.Rectangle({
    point: [0, 0],
    size: [view.size.width / previewFactor, view.size.height / previewFactor],
});

var rasterPreview = new Raster(imageURL);
rasterPreview.fitBounds(previewRect.bounds,true);

var outlineRect = new Path.Rectangle({
    point: [0, 0],
    size: [captureWidth / previewFactor, captureHeight / previewFactor],
    strokeColor: 'red',
    strokeWidth: 3
});


function onFrame (event) {
    if (!loaded) return;

    if (event.count % speed === 0) {
        var colorIndex = (((event.count * (skip + 1)) / speed)) % rasterColors.length;
        displayRect.fillColor = rasterColors[colorIndex];

        console.log(colorIndex);

        // var previousIndex = colorIndex > 0 ? colorIndex - 1 : subRasters.length - 1;
        // subRasters[previousIndex].visible = false;
        //
        //
        // subRasters[colorIndex].fitBounds(view.bounds);
        // subRasters[colorIndex].sendToBack();
        // subRasters[colorIndex].visible = true;

        outlineRect.position.x += captureWidth / previewFactor;
        if (outlineRect.position.x >= (view.size.width) / previewFactor){
            outlineRect.position.x = captureWidth / previewFactor / 2;
            outlineRect.position.y += captureHeight / previewFactor;
        }
        if (outlineRect.position.y >= (view.size.height) / previewFactor){
            outlineRect.position.x = captureWidth / previewFactor / 2;
            outlineRect.position.y = captureHeight / previewFactor / 2;

        }

    }
}


function getColors (r) {
    // Fill colors with sequential color-squares
    var colors = [];
    var subRasterArray = [];
    for (var y = 0; y < view.size.height ; y += captureHeight) {
        for (var x = 0; x < view.size.width; x += captureWidth) {
            var rect = new Rectangle(x, y, captureWidth, captureHeight);
            var path = new Path.Rectangle(rect);
            var color = r.getAverageColor(path);
            colors.push(color);

            //var subRasterTemp = r.getSubRaster(rect);
            //subRasterTemp.visible = false;
            //subRasterArray.push(subRasterTemp);

        }
    }

    return { subRasters: subRasterArray, colors: colors };
}
