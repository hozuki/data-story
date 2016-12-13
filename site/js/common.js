"use strict";

const SessionKeys = {
    europeGeoMap: "europeGeoMap",
    foodIntakeTable: "foodIntakeTable",
    europeObesity: "europeObesity",
    countryCode: "countryCode",
    worldGeoMap: "worldGeoMap",
    tobaccoPolicy: "tobaccoPolicy",
    smoker: "smoker",
    ourObesity: "ourObesity"
};

/**
 *
 * @param [prevUrl] {string}
 * @param [nextUrl] {string}
 */
function registerNavigation(prevUrl, nextUrl) {
    if (!prevUrl && !nextUrl) {
        return;
    }

    window.addEventListener("keydown", ev => {
        switch (ev.keyCode) {
            case 37: // L
            case 38: // U
                if (prevUrl) {
                    window.location.assign(prevUrl);
                }
                break;
            case 32:
            case 39: // R
            case 40:
                if (nextUrl) {
                    window.location.assign(nextUrl);
                }
                break;
            default:
                break;
        }
    });
}
