function convolutedFilter(options) {
  let play = new purePlay();

  // Filter size must be N x N where N is uneven (3x3, 5x5 and 7x7)
  // The sum of all elements of the filter should be 1. Bias from 1 affects brightness
    // let filter = [
    //   1,  1,  1,
    //   1, -7,  1,
    //   1,  1,  1
    // ];
  let filter = [
    1, 1, 1,
    1, 0.7, -1,
    -1, -1, -1
  ];

  let filterWidth = Math.round(Math.sqrt(filter.length));
  let halfFilterWidth = Math.floor(filterWidth / 2);
  let factor = 1.0;
  let bias = 0;

  return {
    draw: draw
  }

  function draw(previewContext) {
    play.draw(previewContext, previewContext.videos);

    let context = previewContext.canvasContext;
    let canvas = previewContext.canvasContext.canvas;
    let imgWidth = canvas.width;
    let imgHeight = canvas.height;

    let src = context.getImageData(0, 0, canvas.width, canvas.height).data;

    let tmpCanvas = document.createElement('canvas');
    let tmpCtx = tmpCanvas.getContext('2d');
    let output = tmpCtx.createImageData(imgWidth, imgHeight);
    let destination = output.data;

    // I've pulled this option from internet
    let opaque = true;
    let alphaFac = opaque ? 1 : 0;

    for (let y = 0; y < imgHeight; y++) {
      for (let x = 0; x < imgWidth; x++) {
        let pixelIndex = (y * imgWidth + x) * 4;
        let red = 0, green = 0, blue = 0, alpha = 0;

        for (let filterY = 0; filterY < filterWidth; filterY++) {
          for (let filterX = 0; filterX < filterWidth; filterX++) {
            let scy = y + filterY - halfFilterWidth;
            let scx = x + filterX - halfFilterWidth;
            if (scy >= 0 && scy < imgHeight && scx >= 0 && scx < imgWidth) {
              let srcImageIndex = (scy * imgWidth + scx) * 4;
              let wt = filter[filterY * filterWidth + filterX];
              red += src[srcImageIndex] * wt;
              green += src[srcImageIndex + 1] * wt;
              blue += src[srcImageIndex + 2] * wt;
              alpha += src[srcImageIndex + 3] * wt;
            }
          }
        }

        destination[pixelIndex] = factor * red + bias;
        destination[pixelIndex + 1] = factor * green + bias;
        destination[pixelIndex + 2] = factor * blue + bias;
        destination[pixelIndex + 3] = alpha + alphaFac * (255 - alpha);
      }
    }

    context.putImageData(output, 0, 0);
  }
}