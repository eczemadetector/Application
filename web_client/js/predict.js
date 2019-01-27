var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d")
var video = document.getElementById("video")
var audio = document.getElementById("audio")

$('#canvas').hide()
$('#submit').hide()

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream;
        video.play();
    });
}

$('#snap').click(() => {
    audio.play()
    context.drawImage(video, 0, 0, 640, 480)
    $('#video').hide()
    $('#overlay').hide()
    $('#canvas').show()
    $('#snap').hide()
    $('#submit').show()
    $('#image').val(canvas.toDataURL())
});

$('#reset').click(() => {
    $('#canvas').hide()
    $('#overlay').show()
    $('#video').show()
    $('#submit').hide()
    $('#snap').show()
});
