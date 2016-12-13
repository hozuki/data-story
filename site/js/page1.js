"use strict";

registerNavigation("index.html", "page2.html");

const G = {
    /**
     * @type {Page1Map}
     */
    map: null,
    /**
     * @type {Page1LineChart}
     */
    lineChart: null
};

function main() {
    const data = new Page1Data();
    G.map = new Page1Map(data);
    G.lineChart = new Page1LineChart(data);
    G.map.build();
    G.lineChart.hide();
    G.lineChart.container.draggable();
    $("#overlay-click").on("click", () => G.lineChart.hide());
}

document.body.onload = main;
