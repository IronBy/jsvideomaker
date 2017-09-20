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

  function draw(previewContext) {
    play.draw(previewContext);

    if (!show) {
      show = true;
      // TODO: Current Time should be calculated correctly depending on overal current time
      options.svgImage.setCurrentTime(0);
    }
    
    if (options.svgImage.animationsPaused()) {
      options.svgImage.unpauseAnimations();
    }
    
    img.src = image64;
    let canvas = previewContext.canvasContext.canvas;

    previewContext.canvasContext.globalAlpha = 1;
    previewContext.canvasContext.drawImage(img, 0, 130);//, canvas.width, canvas.height);
  }

  function stopDisplaying() {
    show = false;
    options.svgImage.pauseAnimations();
    options.svgImage.setCurrentTime(0);
  }
}