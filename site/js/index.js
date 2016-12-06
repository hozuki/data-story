"use strict";

$(".overlay-continue").on("click", function () {
    location.assign("page1.html");
});

function asyncLoad(file) {
    return function (callback) {
        d3.request(file, function (err, request) {
            if (err) {
                callback(err, null);
                return;
            }
            var responseText = request.responseText;
            callback(null, responseText);
        });
    }
}

async.parallel([
    asyncLoad("data/tobacco-policy.json"),
    asyncLoad("data/t15.csv"),
    asyncLoad("data/bmi30.csv"),
    asyncLoad("data/europe-map.json"),
    asyncLoad("data/country_code.csv")
], function (err, results) {
    if (err) {
        displayError("An error occurred.");
    } else {
        sessionStorage.setItem("tobacco-policy", results[0]);
        sessionStorage.setItem("t15", results[1]);
        sessionStorage.setItem("bmi30", results[2]);
        sessionStorage.setItem("europe-map", results[3]);
        sessionStorage.setItem("country-code", results[4]);
        enableContinue();
    }
});

function enableContinue() {
    $(".overlay-prompt").hide();
    $(".overlay-continue").show();
}

function displayError(err) {
    $(".overlay-prompt").text(err).css("color", "#EFEFEF").css("animation-iteration-count", 1);
}
