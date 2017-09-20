function oldFilm(opts) {
  let play = new purePlay();
  let images = [];
  let currentImageIdx = 0;

  initImages();

  return {
    draw: draw
  };

  function initImages() {
    for (var i = 0; i < opts.scratches.length; i++) {
      let img = new Image();
      img.src = opts.scratches[i];
      images.push(img);
    }
  }

  function draw(previewContext) {
    play.draw(previewContext, previewContext.videos);
    
    let context = previewContext.canvasContext;
    let canvas = previewContext.canvasContext.canvas;
    let imgWidth = canvas.width;
    let imgHeight = canvas.height;

    // Move a scratches picture around randomly
    let biasX = Math.floor(Math.random() * 1000);
    let biasY = Math.floor(Math.random() * 1000);
    context.drawImage(images[currentImageIdx], -biasX, -biasY, imgWidth + biasX, imgHeight + biasY);
    ++currentImageIdx;
    if (currentImageIdx >= images.length) {
      currentImageIdx = 0;
    }
  }
}