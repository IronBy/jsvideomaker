function fade(options) {
  let play = new purePlay();

  return {
    draw: draw
  };

  function draw(previewContext) {
    // We assume this effect applies for one video only
    let video = previewContext.videos[0];
    let canvas = previewContext.canvasContext.canvas;

    play.draw(previewContext);
    previewContext.canvasContext.globalAlpha = getAlpha(previewContext);
    previewContext.canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  }

  function getAlpha(previewContext) {
    return options.kind == 'out'
      ? 1 - getTransitionLastsPercent(previewContext)
      : getTransitionLastsPercent(previewContext);
  }

  function getTransitionLastsPercent(previewContext) {
    let transitionLastsTime = Math.max(0, previewContext.currentTime - options.start);
    return Math.min(1, transitionLastsTime / options.duration);
  }
}