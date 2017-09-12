function animationContext(previewScript, canvasContext, time) {
  let self = this;
  let previewCanvasContext = canvasContext;
  let currentVideos = [];
  let currentVideoElements = [];
  let currentTransitions = [];

  Object.defineProperty(this, 'currentTime', {
    get: function () {
      return time;
    }
  });

  Object.defineProperty(this, 'currentVideoAction', {
    get: function () {
      let endedAction = null;

      for (var i = 0; i < currentVideoElements.length; i++) {
        var videoElement = currentVideoElements[i];
        if (!videoElement.ended) {
          return currentVideos[i];
        }

        endedAction = currentVideos[i];
      };

      // If all video actions were ended, return latest as current
      return endedAction;
    }
  });

  Object.defineProperty(this, 'videos', {
    get: function () {
      return currentVideoElements;
    }
  });
  
  Object.defineProperty(this, 'videoActions', {
    get: function () {
      // TODO: If empty videos consider returning collection with one stubbed action which does nothing
      return currentVideos;
    }
  });

  Object.defineProperty(this, 'canvasContext', {
    get: function () {
      return previewCanvasContext;
    }
  });

  Object.defineProperty(this, 'transitions', {
    get: function () {
      return currentTransitions;
    }
  });

  initContext();

  function initContext() {
    if (!previewScript) {
      return;
    }

    for (let i = 0; i < previewScript.actions.length; i++) {
      let action = previewScript.actions[i];
      if (time >= action.start && time <= (action.start + action.duration)) {
        if (action.kind === 'transition') {
          currentTransitions.push(action);
        }

        if (action.kind === 'video') {
          currentVideos.push(action);
          currentVideoElements.push(action.element);
        }
      }
    }
  }
}