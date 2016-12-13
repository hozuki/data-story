$(".overlay-continue").on("click", () => navigateTo("page1.html"));

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
    asyncLoad("csv-country_code.csv"),
    asyncLoad("world-geo-map.json"),
    asyncLoad("json-tobacco-policy.json"),
    asyncLoad("csv-smoker.csv"),
    asyncLoad("csv-our-obesity.csv")
], (err, results) => {
    if (err) {
        displayError("An error occurred.");
        return;
    }
    sessionStorage.setItem(SessionKeys.europeGeoMap, results[0]);
    sessionStorage.setItem(SessionKeys.foodIntakeTable, results[1]);
    sessionStorage.setItem(SessionKeys.europeObesity, results[2]);
    sessionStorage.setItem(SessionKeys.countryCode, results[3]);
    sessionStorage.setItem(SessionKeys.worldGeoMap, results[4]);
    sessionStorage.setItem(SessionKeys.tobaccoPolicy, results[5]);
    sessionStorage.setItem(SessionKeys.smoker, results[6]);
    sessionStorage.setItem(SessionKeys.ourObesity, results[7]);
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