"use strict";

function main() {
    var video = document.getElementById("video");
    var mediaConfig = {video: true};
    var errBack = function (e) {
        console.log("An error occurred.", e)
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(mediaConfig).then(function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        });
    } else if (navigator.getUserMedia) {
        navigator.getUserMedia(mediaConfig, function (stream) {
            video.src = stream;
            video.play();
        }, errBack);
    } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia(mediaConfig, function (stream) {
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
        }, errBack);
    } else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia(mediaConfig, function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        }, errBack);
    }

    $(".click-responder").on("click", function() {
        window.alert("Ask a real human please :)")
    });
}

document.body.onload = main;