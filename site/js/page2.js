"use strict";

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
    yearEnd: Math.min(...[Page2BPChart.yearEnd, Page2Map.yearEnd, Page2LineChart.yearEnd])
};

function main() {
    G.currentYear = G.yearEnd;
    let data = new Page2Data();
    G.bpChart = new Page2BPChart(window, data);
    G.map = new Page2Map(window, data);
    G.lineChart = new Page2LineChart(window, data);
    G.bpChart.rebuild(G.currentYear);
    G.map.rebuild(G.currentYear);
}

document.body.onload = main;

window.addEventListener("keydown", ev => {
    let keyCode = ev.keyCode;
    switch (keyCode) {
        case "A".charCodeAt(0):
            G.currentYear = clamp(--G.currentYear, G.yearStart, G.yearEnd);
            G.bpChart.rebuild(G.currentYear);
            G.map.rebuild(G.currentYear);
            break;
        case "D".charCodeAt(0):
            G.currentYear = clamp(++G.currentYear, G.yearStart, G.yearEnd);
            G.bpChart.rebuild(G.currentYear);
            G.map.rebuild(G.currentYear);
            break;
    }
    function clamp(x, min, max) {
        return x < min ? min : (x > max ? max : x);
    }
});
