function pageLoad() {
  // new convolutedFilter().draw();

  let v = document.getElementById("video");
  document.getElementById("video").volume = 0;
  document.getElementById("video2").volume = 0;

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
        },
        // {
        //   start: 0,
        //   duration: 8,
        //   url: "old-film-look.mp4"
        // }
      ],
      transitions: [
        // ------------ Old Movie filter ------------
        // {
        //   start: 0,
        //   duration: 8,
        //   effect: new oldFilm({
        //     scratches: [
        //       "scratch2.png",
        //     ]
        //   })
        // }
        // ------------ Fade in/out and Merge transitions ------------
        // {
        //   start: 0,
        //   duration: 2,
        //   effect: new fade({
        //     kind: 'out',
        //     start: 0,
        //     duration: 2
        //   })
        // },
        // {
        //   start: 6,
        //   duration: 2,
        //   effect: new fade({
        //     kind: 'in',
        //     start: 6,
        //     duration: 2
        //   })
        // },
        // {
        //   start: 2,
        //   duration: 2,
        //   effect: new merge({
        //     start: 2,
        //     duration: 2
        //   })
        // },
        // ------------ Black and White filter ------------
        // {
        //   start: 0,
        //   duration: 8,
        //   effect: new blackAndWhite()
        // },
        // ------------ Convoluted filter ------------
        // {
        //   start: 0,
        //   duration: 8,
        //   effect: new convolutedFilter()
        // },
        // ------------ SVG overlay ------------
        {
          start: 0,
          duration:8,
          effect: new svgOverlay({
            svgImage: document.getElementById("svg")
          })
        }
      ]
    },
    [
      document.getElementById("video"),
      document.getElementById("video2"),
      // document.getElementById("video3")
    ]);
    // v.defaultPlaybackRate = 0.5;
    // v.playbackRate = 0.5;
}

function togglePlay() {
  if (!myplayer.playing) {
    myplayer.play();
  }
  else {
    myplayer.pause();
  }
}