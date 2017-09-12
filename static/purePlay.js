function purePlay() {
  return {
    draw: draw
  };

  /**
   * Draw current video frame
   * @param {Object} previewContext
   */
  function draw(previewContext) {
    // We assume we use it for one video only at a time
    let video = previewContext.videos[0];
    previewContext.canvasContext.globalAlpha = 1;
    let canvas = previewContext.canvasContext.canvas;
    previewContext.canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
  }
}

// * @param {CanvasRenderingContext2D} canvasContext Context of a canvas
// * @param {HTMLVideoElement[]} videos Videos to be shown