"use strict";

/**
 * @class
 */
class Page2BPChart {

    /**
     * @constructor
     * @param data {Page2Data}
     */
    constructor(data) {
        /**
         * @type {Page2Data}
         * @memberOf {Page2BPChart}
         */
        this.data = data;
        /**
         * @type {*}
         * @memberOf {Page2BPChart}
         */
        this.svg = d3.select("#div-bp-chart")
            .append("svg")
            .attr("id", "svg-bp-chart")
            .attr("class", "expand-all absolute");
        /**
         * @memberOf {Page2BPChart}
         * @type {{Fat: string, Calories: string, Protein: string, Sugar: string, Vegetables: string, Fruit: string}}
         */
        this.colorTable = {
            Fat: "#3366CC",
            Calories: "#DC3912",
            Protein: "#FF9900",
            Sugar: "#109618",
            Vegetables: "#990099",
            Fruits: "#0099C6"
        };
        /**
         * @memberOf {Page2BPChart}
         * @type {*}
         */
        this.bpChart = null;
        /**
         * @memberOf {Page2BPChart}
         * @type {*}
         */
        this.bpGroup = null;
        /**
         * @memberOf {Page2BPChart}
         * @type {jQuery}
         * @private
         */
        this._jqSvg = $(this.svg._groups[0]);
    }

    /**
     * @memberOf {Page2BPChart}
     * @param [year] {number}
     */
    rebuild(year) {
        if (year === void(0)) {
            year = Page2BPChart.yearEnd;
        }
        this.__removeEventHandlers();
        this.jqSvg.html("");
        const svg = this.svg;
        svg.append("text").attr("x", 210).attr("y", 50)
            .attr("class", "header").text(`Food! [${year}]`);

        const group = this.bpGroup = svg.append("g").attr("transform", "translate(100,100)");
        const bpChart = this.bpChart = viz.bP()
            .data(this.data.intakeBPData[year])
            .min(12)
            .pad(1)
            .height(500)
            .width(200)
            .barSize(35)
            .fill(d => this.colorTable[d.primary]);

        group.call(bpChart);

        group.append("text").attr("x", -50).attr("y", -8).style("text-anchor", "middle").text("Nutrient");
        group.append("text").attr("x", 250).attr("y", -8).style("text-anchor", "middle").text("Country");

        group.append("line").attr("x1", -80).attr("x2", 0);
        group.append("line").attr("x1", 200).attr("x2", 280);

        group.append("line").attr("y1", 610).attr("y2", 610).attr("x1", -100).attr("x2", 0);
        group.append("line").attr("y1", 610).attr("y2", 610).attr("x1", 200).attr("x2", 300);

        group.selectAll(".mainBars")
            .on("mouseenter", this.$onMouseEnter.bind(this))
            .on("mouseout", this.$onMouseOut.bind(this));

        group.selectAll(".mainBars").append("text").attr("class", "label")
            .attr("x", d => (d.part === "primary" ? -25 : 25))
            .attr("y", d => +6)
            .text(d => d.key)
            .attr("text-anchor", d => (d.part === "primary" ? "end" : "start"));

        group.selectAll(".mainBars").append("text").attr("class", "perc")
            .attr("x", d => (d.part === "primary" ? -70 : 120))
            .attr("y", d => +6)
            .text(d => d3.format("0.1%")(d.percent))
            .attr("text-anchor", d => (d.part === "primary" ? "end" : "start"));
    }

    __removeEventHandlers() {
        if (!this.bpGroup) {
            return;
        }
        this.bpGroup.selectAll(".mainBars")
            .on("mouseenter", null)
            .on("mouseout", null);
    }

    $onMouseEnter(d) {
        this.bpChart.mouseover(d);
        this.bpGroup.selectAll(".mainBars")
            .select(".perc")
            .text(d => d3.format("0.1%")(d.percent));
    }

    $onMouseOut(d) {
        this.bpChart.mouseout(d);
        this.bpGroup.selectAll(".mainBars").select(".perc")
            .text(d => d3.format("0.1%")(d.percent));
    }

    /**
     * @memberOf {Page2BPChart}
     * @return {jQuery}
     */
    get jqSvg() {
        return this._jqSvg;
    }

    static get yearStart() {
        return 1961;
    }

    static get yearEnd() {
        return 2011;
    }

}
