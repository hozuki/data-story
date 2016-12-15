"use strict";

registerNavigation("page1.html", "page3.html");

const G = {
    /**
     * @type {Page2BPChart}
     */
    bpChart: null,
    /**
     * @type {Page2Map}
     */
    map: null,
    /**
     * @type {Page2LineChart}
     */
    lineChart: null,
    yearStart: Math.max(...[Page2BPChart.yearStart, Page2Map.yearStart, Page2LineChart.yearStart]),
    yearEnd: Math.min(...[Page2BPChart.yearEnd, Page2Map.yearEnd, Page2LineChart.yearEnd]),

    clamp: (x, min, max) => {
        return x < min ? min : (x > max ? max : x);
    },

    goNext: () => {
        G.currentYear = G.clamp(++G.currentYear, G.yearStart, G.yearEnd);
        G.bpChart.rebuild(G.currentYear);
        G.map.rebuild(G.currentYear);
    },

    goPrev: () => {
        G.currentYear = G.clamp(--G.currentYear, G.yearStart, G.yearEnd);
        G.bpChart.rebuild(G.currentYear);
        G.map.rebuild(G.currentYear);
    }
};

function main() {
    G.currentYear = G.yearEnd;
    const data = new Page2Data();
    G.bpChart = new Page2BPChart(data);
    G.map = new Page2Map(data);
    G.lineChart = new Page2LineChart(data);
    G.bpChart.rebuild(G.currentYear);
    G.map.rebuild(G.currentYear);

    $("#btn-next-year").on("click", G.goNext);
    $("#btn-prev-year").on("click", G.goPrev);
}

document.body.onload = main;

// Browse data of different years. Hey it changes! :)
window.addEventListener("keydown", ev => {
    let keyCode = ev.keyCode;
    switch (keyCode) {
        case "A".charCodeAt(0):
            G.goPrev();
            break;
        case "D".charCodeAt(0):
            G.goNext();
            break;
    }
});
