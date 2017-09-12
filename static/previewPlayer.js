/**
 * 
 * @param {HTMLInputElement} sliderElement 
 * @param {Object} previewData 
 * @param {HTMLVideoElement[]} videoElements
 */
function previewPlayer(sliderElement, canvas, previewData, videoElements) {
  let playing = false;
  const TIMER_INTERVAL = 20; // ms
  const SLIDER_MAX = 10000; // sec
  let canvasContext = canvas.getContext("2d");
  let previewScript = null;
  let mapVideo = new purePlay();
  let currentAnimationContext = null;

  setupSlider();
  setupVideoElements();
  initPreviewScript();

  function initPreviewScript() {
    previewScript = {
      totalTime: 0,
      actions: []
    };

    // Add videos first
    for (let i = 0; i < previewData.videos.length; i++) {
      let video = previewData.videos[i];
      addPlayVideoAction(video, videoElements[i]);
      previewScript.totalTime = video.start + video.duration;
    }

    // Now add transitions
    for (var i = 0; i < previewData.transitions.length; i++) {
      var transition = previewData.transitions[i];
      addTransitionAction(transition);
    }
  }

  function addPlayVideoAction(video, videoElement) {
    let actionData = {
      kind: 'video',
      start: video.start,
      duration: video.duration,
      element: videoElement,
      action: mapVideo.draw
    };
    previewScript.actions.push(actionData);
    actionData.action = createPlayVideoAction(actionData);
  }

  function createPlayVideoAction(actionData) {
    return function (previewContext) {
      if (playing && !actionData.element.playing && !actionData.element.ended) {
        actionData.element.play();
      }
      mapVideo.draw(previewContext);
    }
  }

  function addTransitionAction(transition) {
    previewScript.actions.push({
      kind: 'transition',
      start: transition.start,
      duration: transition.duration,
      action: transition.effect.draw,
      effect: transition.effect
    });
  }

  function play() {
    playing = true;
    doAnimationRound();
    scheduleNextTick();
  }

  function pause() {
    playing = false;
    if (currentAnimationContext && currentAnimationContext.videos) {
      currentAnimationContext.videos.forEach(function(videoElement) {
        if (!videoElement.ended) {
          videoElement.pause();
        }
      }, this);
    }
  }

  function setupSlider() {
    sliderElement.min = 0;
    sliderElement.max = SLIDER_MAX;
    sliderElement.value = 0;
    sliderElement.oninput = doAnimationRound;
  }

  function onTimerTick() {
    // Do nothing if player paused
    if (!playing) {
      return;
    }

    setNewSliderValue();
    doAnimationRound();
    scheduleNextTick();
  }

  function setNewSliderValue() {
    // Here we have bug when merge two videos.
    // It happens due to lag between time when we want to start next video and when it actually starts
    // The bug looks like slider goes a bit back
    sliderElement.value = getCurrentTime() / previewScript.totalTime * sliderElement.max;
  }

  function getCurrentTime() {
    let time = currentAnimationContext && currentAnimationContext.currentVideoAction
      ? currentAnimationContext.currentVideoAction.start + currentAnimationContext.currentVideoAction.element.currentTime
      : 0;
      return time;
  }

  function scheduleNextTick() {
    if (sliderElement.value === sliderElement.max) {
      pause();
      sliderElement.value = 0;
    }

    if (playing) {
      setTimeout(onTimerTick, TIMER_INTERVAL); 
    }
  }

  function setupVideoElements() {
    for (var i = 0; i < videoElements.length; i++) {
      // Prevent immediate video playing
      videoElements[i].autoplay = false;
      // Preload video metadata
      if (i < previewData.videos.length) {
        videoElements[i].src = previewData.videos[i].url;
      }
    }
  }
  
  function doAnimationRound() {
    if (!playing) {
      return;
    }

    currentAnimationContext = getNewAnimationContext();

    toggleVideosIfRequired();

    // Transitions draw video and an effect.
    // So we should not draw video explicitly if there is transition
    if (currentAnimationContext.transitions.length > 0) {
      for (var i = 0; i < currentAnimationContext.transitions.length; i++) {
        var transition = currentAnimationContext.transitions[i];
        transition.action(currentAnimationContext);
      }
    }
    else {
      if (currentAnimationContext.currentVideoAction) {
        currentAnimationContext.currentVideoAction.action(currentAnimationContext);
      }
    };
  }

  function getNewAnimationContext() {
    let newContext = new animationContext(previewScript, canvasContext, getCurrentTime());
    if (currentAnimationContext) {
      // Notify all transitions which ended this animation round
      if (currentAnimationContext.transitions.length) {
        for (let i = 0; i < currentAnimationContext.transitions.length; i++) {
          let oldTransition = currentAnimationContext.transitions[i];
          let transitionFound = false;

          for (var j = 0; j < newContext.transitions.length; j++) {
            if (oldTransition == newContext.transitions[j]) {
              transitionFound = true;
              break;
            }
          }

          if (!transitionFound && oldTransition.effect.onEnd) {
            oldTransition.effect.onEnd();
          }
        }
      }
    }
    return newContext;
  }

  function toggleVideosIfRequired() {
    if (!currentAnimationContext || !currentAnimationContext.videos.length) {
      return;
    }

    for (var i = 0; i < currentAnimationContext.videos.length; i++) {
      var videoElement = currentAnimationContext.videos[i];
      if (playing && (videoElement.paused && !videoElement.ended)) {
        videoElement.play();
      }
      if (!playing && (!videoElement.paused || !videoElement.ended)) {
        videoElement.pause();
      }
    }
  }

  return {
    get playing() {
      return playing;
    },
    get currentTime() {
      return getCurrentTime();
    },
    play: play,
    pause: pause
  };
}