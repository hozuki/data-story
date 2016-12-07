"use strict";

function main() {
    var video = document.getElementById('video');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: true})
            .then(setupVideo);
    } else if (navigator.getUserMedia) { // Standard
        navigator.getUserMedia({video: true}, setupVideo, errBack);
    } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia({video: true}, setupVideo, errBack);
    } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
        navigator.mozGetUserMedia({video: true}, setupVideo, errBack);
    }

    function setupVideo(stream) {
        video.src = (window.webkitURL || window.URL).createObjectURL(stream);
        video.play();

    }
}

main();
