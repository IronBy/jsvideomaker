function blackAndWhite(options) {
  let play = new purePlay();

  return {
    draw: draw
  }

  function draw(previewContext) {
    play.draw(previewContext, previewContext.videos);
    let context = previewContext.canvasContext;
    let canvas = previewContext.canvasContext.canvas;

    var imgd = context.getImageData(0, 0, canvas.width, canvas.height);
    var pix = imgd.data;
    for (var i = 0, n = pix.length; i < n; i += 4) {
      var grayscale = pix[i ] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
      pix[i] = grayscale; // red
      pix[i + 1] = grayscale; // green
      pix[i + 2] = grayscale; // blue
    }

    context.putImageData(imgd, 0, 0);
  }
}