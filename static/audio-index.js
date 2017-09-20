/**
 * This script expects that there are two mp3 files audio1.mp3 and audio2.mp3 near this file
 */
let TIMER_INTERVAL = 20; // ms
let ONE_SECOND = 1000; // ms
let effects = null;
let playStartedAt = null;
let timePlayed = 0;
var playing = false;

window.onload = function () {
  this.audio1 = document.getElementById('audio1');
  this.audio2 = document.getElementById('audio2');

  this.audio1.src = "audio1.mp3";
  this.audio2.src = "audio2.mp3";

  effects = [
    {
      start: 0,
      duration: 6,
      effect: new togglePlayEffect({
        kind: 'play',
        audio: this.audio2,
        startTime: 0
      })
    },
    {
      start: 0,
      duration: 3,
      effect: new fade({
        kind: 'out',
        audio: this.audio2
      })
    },
    {
      start: 3,
      duration: 3,
      effect: new fade({
        kind: 'in',
        audio: this.audio2
      })
    },
    {
      start: 6,
      duration: 3,
      effect: new togglePlayEffect({
        kind: 'play',
        audio: this.audio1,
        startTime: 54
      })
    },
    {
      start: 6,
      duration: 3,
      effect: new fade({
        kind: 'out',
        audio: this.audio1
      })
    },
    {
      start: 9,
      duration: 3,
      effect: new fade({
        kind: 'in',
        audio: this.audio1
      })
    },
    {
      start: 12,
      duration: 3,
      effect: new togglePlayEffect({
        kind: 'pause',
        audio: this.audio1
      })
    },
    {
      start: 12,
      duration: 3,
      effect: new togglePlayEffect({
        kind: 'pause',
        audio: this.audio2
      })
    }
  ]
}

function reset() {
  audio1.pause();
  audio1.currentTime = 0;
  audio2.pause();
  audio2.currentTime = 0;
  playing = false;
  playStartedAt = null;
  timePlayed = 0;
}

function togglePlay() {
  (playing ? pause : play)();
}

function play() {
  if (!playing && !playStartedAt) {
    playStartedAt = new Date().getTime();
  }
  playing = true;
  applyAudioFilters();
}

function pause() {
  timePlayed += new Date().getTime() - playStartedAt;
  playStartedAt = null;
  playing = false;
  pauseEffects();
}

function applyAudioFilters() {
  if (!playing) {
    return;
  }

  let currentTime = getCurrentTime();
  getCurrentEffects(currentTime).forEach(function(effect) {
    effect.effect.apply({
      currentTime: currentTime,
      start: effect.start,
      duration: effect.duration
    });
  }, this);

  scheduleNextTick();
}

function getCurrentEffects(currentTime) {
  return effects
    .filter(function (effect) {
      return effect.start <= currentTime && currentTime <= (effect.start + effect.duration)
    });
}

function scheduleNextTick() {
  setTimeout(applyAudioFilters, TIMER_INTERVAL); 
}

function pauseEffects() {
  getCurrentEffects(getCurrentTime()).forEach(function(effect) {
    if (effect.effect.pause) {
      effect.effect.pause();
    }
  }, this);
}

function getCurrentTime() {
  return (playing
    ? timePlayed + new Date().getTime() - playStartedAt
    : timePlayed) / ONE_SECOND
}

function fade(opts) {
  return {
    apply: apply
  };

  function apply(context) {
    let newVolumeLevel = Math.min(1, (context.currentTime - context.start) / context.duration);
    opts.audio.volume = opts.kind == 'out'
      ? newVolumeLevel
      : 1 - newVolumeLevel;
    
    // Termination of effect must be handled by a distinct handler
    // Since we don't have it in demo we do workaround...
    // ...for finish fade in...
    if (opts.audio.volume * 100 < 1) {
      opts.audio.volume = 0;
    }
    // ...and for finish fade out
    if (opts.audio.volume * 100 > 99) {
      opts.audio.volume = 1;
    }
  }
}

function togglePlayEffect(opts) {
  return {
    apply: apply,
    pause: pause
  };

  function apply(context) {
    (opts.kind == 'play' && playing ? play : pause)(context);
  }

  function play(context) {
    if (opts.audio.paused) {
      opts.audio.currentTime = Math.max(opts.startTime, context.currentTime - opts.startTime);
      opts.audio.play();
    }
  }

  function pause(context) {
    if (!opts.audio.paused) {
      opts.audio.pause();
    }
  }
}