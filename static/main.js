function pageLoad() {
  window.myplayer = new previewPlayer(
    document.getElementById("slider"),
    document.getElementById("c1"),
    {
      videos: [
        {
          start: 0,
          duration: 4,
          url: "video2.mp4"
        },
        {
          start: 2,
          duration: 6,
          url: "video1.mp4"
        }
      ],
      transitions: [
        {
          start: 0,
          duration: 2,
          effect: new fade({
            kind: 'out',
            start: 0,
            duration: 2
          })
        },
        {
          start: 6,
          duration: 2,
          effect: new fade({
            kind: 'in',
            start: 6,
            duration: 2
          })
        },
        {
          start: 2,
          duration: 2,
          effect: new merge({
            start: 2,
            duration: 2
          })
        },
        {
          start: 0,
          duration:3,
          effect: new svgOverlay({
            svgImage: document.getElementById("svg")
          })
        }
      ]
    },
    [
      document.getElementById("video"),
      document.getElementById("video2")
    ]);
}

function togglePlay() {
  if (!myplayer.playing) {
    myplayer.play();
    // startSvgMapping();
  }
  else {
    myplayer.pause();
  }
}

function startSvgMapping() {
  let canvas = document.getElementById("c3");
  let context = canvas.getContext("2d");
  let svg = document.getElementById("svg");
  let img = new Image();

  var xml = new XMLSerializer().serializeToString(svg);
  var svg64 = btoa(xml);
  var b64Start = 'data:image/svg+xml;base64,';
  var image64 = b64Start + svg64;
  img.src = image64;

  let mapSvg = function () {
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (myplayer.playing) {
      setTimeout(mapSvg, 30); 
    }
  }

  mapSvg();
}

let processor = {
  timerCallback: function() {
    if ((this.video1.paused || this.video1.ended)
      && this.video2.paused || this.video2.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
    setTimeout(function () {
        self.timerCallback();
      }, 0);
  },

  doLoad: function() {
    this.video1 = document.getElementById("video");
    // this.video1.onloadedmetadata = function (args) {
    //   console.log('load meta');
    // }
    this.video2 = document.getElementById("video2");
    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d");

    this.c2 = document.getElementById("c2");
    this.ctx2 = this.c2.getContext("2d");

    this.c3 = document.getElementById("c3");
    this.ctx3 = this.c3.getContext("2d");
    let self = this;
    this.video1.addEventListener("play", function() {
        self.width = self.video1.videoWidth / 4;
        self.height = self.video1.videoHeight / 4;
        self.timerCallback();
      }, false);
  },

  prevTime: null,
  redrawSkippedTimes: 0,
  effectAlpha: 0,
  effectTimeThreshold: 300,
  alphaMaxValue: 1,
  prevAlphaTime: null,

  computeFrame: function() {
    var currentTime = new Date();
    if (this.prevTime && (currentTime - this.prevTime) < 40) {
      // console.log(`skip redrawing ${++this.redrawSkippedTimes}`);
      return;
    }
    this.prevTime = currentTime;

    if (this.video1.currentTime <= 1.5) {
      new fade({
        kind: 'in',
        start: 0,
        duration: 1.5
      })
      .draw(this.ctx1, [this.video1]);
    }
    else if ((this.video1.duration - this.video1.currentTime) <= 3) {
      if (this.video2.paused) {
        this.video2.play();
      }
      new merge({
        duration: 2
      })
      .draw(this.ctx1, [this.video1, this.video2]);
    }
    else {
      if (!this.video1.paused) {
        new purePlay().draw(this.ctx1, [this.video1]);
      }
      else {
        new purePlay().draw(this.ctx1, [this.video2])
      }
    }
    
    return;
  }
};