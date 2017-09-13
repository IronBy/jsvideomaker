function pageLoad() {
  // new convolutedFilter().draw();

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
        {
          start: 0,
          duration: 4,
          effect: new oldFilm({
            scratches: [
              // "scratch1.jpg",
              "scratch2.png",
              // "scratch-and-vignette.jpg"
            ]
          })
        }
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
        // {
        //   start: 2,
        //   duration: 3,
        //   effect: new blackAndWhite()
        // },
        // {
        //   start: 0,
        //   duration: 8,
        //   effect: new convolutedFilter()
        // },
        // {
        //   start: 0,
        //   duration:3,
        //   effect: new svgOverlay({
        //     svgImage: document.getElementById("svg")
        //   })
        // }
      ]
    },
    [
      document.getElementById("video"),
      document.getElementById("video2"),
      // document.getElementById("video3")
    ]);
}

function togglePlay() {
  if (!myplayer.playing) {
    myplayer.play();
  }
  else {
    myplayer.pause();
  }
}