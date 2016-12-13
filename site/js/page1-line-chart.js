"use strict";

class Page1LineChart {

    /**
     * @constructor
     * @param data {Page1Data}
     */
    constructor(data) {
        /**
         * @memberOf {Page1LineChart}
         * @type {Page1Data}
         * @private
         */
        this.data = data;
        /**
         * @memberOf {Page1LineChart}
         * @type {jQuery}
         * @private
         */
        this._container = $("#div-line-chart-container");
        /**
         * @memberOf {Page1LineChart}
         * @type {jQuery}
         * @private
         */
        this._overlay = $("#overlay");
        /**
         * @type {*}
         * @memberOf {Page1LineChart}
         */
        this.svg = d3.select("#div-line-chart")
            .append("svg")
            .attr("id", "svg-line-chart")
            .attr("class", "expand-all absolute")
            .attr("width", 480)
            .attr("height", 360);
        /**
         * @memberOf {Page1LineChart}
         * @type {jQuery}
         * @private
         */
        this._jqSvg = $(this.svg._groups[0]);
    }

    show(code) {
        this.jqSvg.html("");
        this.overlay.show(); // required for clientWidth/clientHeight
        this.__build(code);
    }

    __build(code) {
        const svg = this.svg;
        const codeMap = this.data.countryCodeMap;
        const div = document.querySelector("#div-line-chart");
        const country = Page1Map.findKeyOfValue(codeMap, code);
        document.querySelector("#span-country").textContent = country;

        const yearStart = Page1LineChart.yearStart, yearEnd = Page1LineChart.yearEnd;
        const obesityDataSet = makeDataSet(this.data.worldObesity, country, yearStart, yearEnd);
        const smokerDataSet = makeDataSet(this.data.smokers, country, yearStart, yearEnd);
        const policyYear = this.data.tobaccoPolicy[code].year;

        const width = div.clientWidth, height = div.clientHeight;
        const g = svg.append("g")
            .attr("transform", "translate(60,15)");
        const valueDomain = [0.1, 0.3];

        const xScale = d3.scaleTime()
            .rangeRound([0, width])
            .domain([parseTime(yearStart - 5), parseTime(yearEnd + 5)]);
        const yScale = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain(valueDomain);

        makeChart(g, obesityDataSet, "d3-line-obesity", valueDomain);
        makeChart(g, smokerDataSet, "d3-line-smoker", valueDomain);
        makePolicy(g, policyYear, valueDomain);

        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5);
        const yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5)
            .tickFormat(d3.format("0.0%"));

        g.append("g")
            .attr("class", "x_axis")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);
        g.append("g")
            .attr("class", "y_axis")
            .call(yAxis);

        g.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${xScale(parseTime(policyYear))},${height + 35})`)
            .text(policyYear)
            .style("fill", "green");

        g.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(-40,${height / 2}) rotate(-90)`)
            .text("Value");

        g.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${width / 2},${height + 30})`)
            .text("Year");

        function makeDataSet(massData, country, yearStart, yearEnd) {
            const list = [];
            for (let i = yearStart; i <= yearEnd; ++i) {
                if (!massData[i]) {
                    continue;
                }
                const item = massData[i].find(d => d.country === country);
                if (!item || !item.value) {
                    continue;
                }
                const o = {year: item.year, value: item.value};
                list.push(o);
            }
            return list;
        }

        function makeChart(g, dataSet, className) {
            const lineData = d3.line()
                .x(d => xScale(parseTime(d.year)))
                .y(d => yScale(d.value / 100));

            g.append("g")
                .append("path")
                .datum(dataSet)
                .attr("class", className)
                .attr("d", lineData);
        }

        function makePolicy(g, year, domain) {
            console.log(year);
            const policyDataSet = [
                {year: year, value: domain[0] * 100},
                {year: year, value: domain[1] * 100}
            ];
            const lineData = d3.line()
                .x(d => xScale(parseTime(d.year)))
                .y(d => yScale(d.value / 100));

            g.append("g")
                .append("path")
                .datum(policyDataSet)
                .attr("class", "d3-line-policy")
                .attr("d", lineData);
        }

        function parseTime(year) {
            return new Date(Date.parse(String(year)));
        }
    }

    hide() {
        this.overlay.hide();
    }

    /**
     *
     * @return {jQuery}
     */
    get container() {
        return this._container;
    }

    /**
     * @return {jQuery}
     */
    get overlay() {
        return this._overlay;
    }

    /**
     * @memberOf {Page1Data}
     * @return {jQuery}
     */
    get jqSvg() {
        return this._jqSvg;
    }

    /**
     * @return {number}
     */
    static get yearStart() {
        return 1990;
    }

    /**
     * @return {number}
     */
    static get yearEnd() {
        return 2014;
    }

}
