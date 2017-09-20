function merge(options) {
  let play = new purePlay();

  return {
    draw: draw
  };

  function draw(previewContext) {
    // We assume this effect applies for two videos only
    let video1 = previewContext.videos[0];
    let video2 = previewContext.videos[1];
    let canvasContext = previewContext.canvasContext;
    
    // The two 'if's below are just 'in case' verifications.
    // Ideally there should be no cases when we don't have one of the videos
    if (video1) {
      play.draw(previewContext);
    }

    if (video2) {
      canvasContext.globalAlpha = getAlpha(previewContext);
      let canvas = previewContext.canvasContext.canvas;
      canvasContext.drawImage(video2, 0, 0, canvas.width, canvas.height);
    }
  }

  function getAlpha(previewContext) {
    return getTransitionLastsPercent(previewContext);
  }

  function getTransitionLastsPercent(previewContext) {
    let transitionLastsTime = Math.max(0, previewContext.currentTime - options.start);
    return Math.min(1, transitionLastsTime / options.duration);
  }
}