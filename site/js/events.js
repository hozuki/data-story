"use strict";

/**
 * @class
 * @constructor
 */
function EventHandlers() {
}

EventHandlers.registerAll = function () {
    const europe = d3.selectAll(".cont-europe");
    const zoom = d3.behavior.zoom();
    europe.call(zoom);
    zoom.on("zoom", function (d) {
        const svg = main.mapBuilder.svg;
        console.log(svg);
        /**
         * @type {Number}
         */
        const scale = d3.event.scale;
        /**
         * @type {Number[]}
         */
        const translation = d3.event.translate;
        const newTransform = "translate(" + translation + ") scale(" + scale + ")";
        svg.attr("transform", newTransform);
        console.log(newTransform);
    });
};

EventHandlers.onZoomButtonClicked = function (ev) {
};

EventHandlers.onEuropeZoomed = function () {

};
