let vid = null;

window.onload = function () {
  if(Hls.isSupported()) {
    var video = document.getElementById('video');
    vid = video;
    var hls = new Hls();
    hls.loadSource('myvid/stream.m3u8'); // https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED,function() {
      video.play();
      requestAnimationFrame(drawFrame);
    });
  }
}

function drawFrame() {
  let canvas = document.getElementById("c1");
  let context = canvas.getContext('2d');
  context.drawImage(vid, 0, 0, canvas.width, canvas.height);
  requestAnimationFrame(drawFrame);
}