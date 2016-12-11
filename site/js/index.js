$(".overlay-continue").on("click", () => {
    navigateTo("page2.html");
});

function asyncLoad(file) {
    file = "data/" + file;
    return function (callback) {
        d3.request(file, (err, request) => {
            if (err) {
                callback(err, null);
                return;
            }
            let responseText = request.responseText;
            callback(null, responseText);
        });
    }
}

async.parallel([
    asyncLoad("europe-geo-map.json"),
    asyncLoad("csv-food-intake.csv"),
    asyncLoad("csv-europe-obesity.csv"),
    asyncLoad("csv-country_code.csv")
], (err, results) => {
    if (err) {
        displayError("An error occurred.");
        return;
    }
    sessionStorage.setItem(SessionKeys.europeGeoMap, results[0]);
    sessionStorage.setItem(SessionKeys.foodIntakeTable, results[1]);
    sessionStorage.setItem(SessionKeys.europeObesity, results[2]);
    sessionStorage.setItem(SessionKeys.countryCode, results[3]);
    enableContinue();
});

function enableContinue() {
    $(".overlay-prompt").hide();
    $(".overlay-continue").show();
}

function displayError(err) {
    $(".overlay-prompt").text(err)
        .css("color", "#EFEFEF")
        .css("animation-iteration-count", 1);
}