function svgOverlay(options) {
  let play = new purePlay();
  let show = false;
  stopDisplaying();
  
  let img = new Image();
  var xml = new XMLSerializer().serializeToString(options.svgImage);
  var svg64 = btoa(xml);
  var b64Start = 'data:image/svg+xml;base64,';
  var image64 = b64Start + svg64;

  return {
    draw: draw,
    onEnd: stopDisplaying
  };

  /**
   * Draw current video frame
   * @param {CanvasRenderingContext2D} canvasContext Context of a canvas
   * @param {HTMLVideoElement[]} videos Videos to be shown
   */
  function draw(previewContext) {
    play.draw(previewContext);

    if (!show) {
      show = true;
      options.svgImage.setCurrentTime(0);
      // options.svgImage.style.display = '';
    }
    
    
    img.src = image64;
    let canvas = previewContext.canvasContext.canvas;

    previewContext.canvasContext.globalAlpha = 0.5;
    previewContext.canvasContext.drawImage(img, 0, 0);//, canvas.width, canvas.height);

    if (options.svgImage.animationsPaused()) {
      options.svgImage.unpauseAnimations();
    }
  }

  function stopDisplaying() {
    return;
    show = false;
    if (options.svgImage.pauseAnimation) {
      options.svgImage.pauseAnimation();
    }
    options.svgImage.setCurrentTime(0);
    // options.svgImage.style.display = 'none';
  }
}