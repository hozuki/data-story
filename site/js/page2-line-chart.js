"use strict";

/**
 * @class
 */
class Page2LineChart {

    /**
     * @constructor
     * @param data {Page2Data}
     */
    constructor(data) {
        this.data = data;
        /**
         * @type {*}
         * @memberOf {Page2LineChart}
         */
        this.svg = d3.select("#div-line-chart")
            .append("svg")
            .attr("id", "svg-line-chart")
            .attr("class", "expand-all absolute");
        /**
         * @memberOf {Page2LineChart}
         * @type {jQuery}
         * @private
         */
        this._jqSvg = $(this.svg._groups[0]);
    }

    /**
     * @memberOf {Page2LineChart}
     * @param country {string} The country name.
     */
    show(country) {
        if (!country) {
            console.warn("Expected: country name.");
            return;
        }
        const svg = this.svg;
        const div = document.querySelector("#div-line-chart");

        const yearStart = Page2LineChart.yearStart, yearEnd = Page2LineChart.yearEnd;
        // Convert the data from the way we stored to the way it will be used. (This kind of sentence is silly, but they
        // make me add it.)
        const obesityDataSet = [];
        for (let i = yearStart; i <= yearEnd; ++i) {
            const item = this.data.europeObesity[i].find(d => d.country === country);
            if (!item || !item.value) {
                continue;
            }
            const o = {year: item.year, value: item.value};
            obesityDataSet.push(o);
        }

        const width = div.clientWidth, height = div.clientHeight;
        const xScale = d3.scaleTime()
            .rangeRound([0, width])
            .domain([parseTime(yearStart - 5), parseTime(yearEnd + 5)]);
        const yScale = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, 0.25]);
        /**
         * @type {string}
         */
        const lineData = d3.line()
            .x(d => xScale(parseTime(d.year)))
            .y(d => yScale(d.value / 100));

        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5);
        const yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5)
            .tickFormat(d3.format("0.0%"));
        const g = svg.append("g")
            .attr("transform", "translate(60,15)");
        g.append("g")
            .append("path")
            .datum(obesityDataSet)
            .attr("class", "d3-line-obesity")
            .attr("d", lineData);
        // Axes and other text.
        g.append("g")
            .attr("class", "x_axis")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);
        g.append("g")
            .attr("class", "y_axis")
            .call(yAxis);

        g.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(-40,${height / 2}) rotate(-90)`)
            .text("Obesity ratio");

        g.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${width / 2},${height + 30})`)
            .text("Year");

        this.jqSvg.show();

        function parseTime(year) {
            return new Date(Date.parse(String(year)));
        }
    }

    hide() {
        this.jqSvg.hide();
        this.jqSvg.html("");
    }

    /**
     * @memberOf {Page2Map}
     * @return {jQuery}
     */
    get jqSvg() {
        return this._jqSvg;
    }

    static get yearStart() {
        return 1979;
    }

    static get yearEnd() {
        return 2015;
    }

}
