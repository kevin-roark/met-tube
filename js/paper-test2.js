// Config
var imageURL = 'mona.jpg';
var length = 20;
var speed = 10; // higher is slower (upside down smiley face)
var skip = 0;

// State
var loaded = false;
var rasterColors;

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
    rasterColors = getColors(raster);

    loaded = true;
};

var rasterPreview = new Raster(imageURL);
rasterPreview.fitBounds(displayRect.bounds,true);

var previewRect = new Path.Rectangle({
    point: [0, 0],
    size: [view.size.width / 3, view.size.height / 3],
    fillColor: 'black'
});



var outlineRect = new Path.Rectangle({
    point: [0, 0],
    size: [length, length],
    strokeColor: 'red',
    strokeWidth: 3
});

function onFrame (event) {
    if (!loaded) return;

    if (event.count % speed === 0) {
        var colorIndex = ((event.count * (skip + 1)) / speed) % rasterColors.length;
        previewRect.fillColor = rasterColors[colorIndex];

        outlineRect.position.x += length;
        if (outlineRect.position.x >= (view.size.width - length)){
            outlineRect.position.x = 0;
            outlineRect.position.y += length;
        }
        if (outlineRect.position.y >= (view.size.height - length)){
            outlineRect.position.x = 0;
            outlineRect.position.y = 0;

        }

    }
}

console.log(outlineRect);

function getColors (r) {
    // Fill colors with sequential color-squares
    var colors = [];
    for (var x = 0; x < view.size.width - length; x += length) {
        for (var y = 0; y < view.size.height - length; y += length) {
            var rect = new Rectangle(x, y, length, length);
            var path = new Path.Rectangle(rect);
            var color = r.getAverageColor(path);
            colors.push(color);
        }
    }

    return colors;
}
