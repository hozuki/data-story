"use strict";

/**
 * @class
 */
class Page1Map {

    /**
     * @constructor
     * @param data {Page1Data}
     */
    constructor(data) {
        /**
         * @memberOf {Page1Map}
         * @type {Page1Data}
         */
        this.data = data;
        /**
         * @type {*}
         * @memberOf {Page1Map}
         */
        this.svg = d3.select("#div-map")
            .append("svg")
            .attr("id", "svg-map")
            .attr("class", "absolute expand-all");
        /**
         * @memberOf {Page1Map}
         * @type {jQuery}
         * @private
         */
        this._jqSvg = $(this.svg._groups[0]);
    }

    /**
     * @memberOf {Page1Map}
     */
    build() {
        const div = document.querySelector("#div-map");
        const width = div.clientWidth, height = div.clientHeight;
        const svg = this.svg;
        this.__buildPatterns();
        const g = svg.append("g");
        {
            const sx = 1, sy = 1, tx = -20, ty = 380;
            g.attr("transform", `scale(${sx},${sy}) translate(${tx},${ty})`);
        }
        const countryFeatures = this.data.countryFeatures;
        const projection = d3.geoCylindricalStereographic().scale(150).translate([width / 2, 0]).center([0, 0]);
        const path = d3.geoPath().projection(projection);
        const ourRegions = Page1Map.ourRegionIDs;
        g.selectAll(".country")
            .data(countryFeatures)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("id", d => Page1Map.regionIDPrefix + d.id)
            .style("fill", d => {
                const regionID = d.id;
                const code = Page1Map.findKeyOfValue(ourRegions, regionID);
                if (!code) {
                    return null;
                }
                return Page1Map.getFillPatternValue(code);
            })
            .attr("d", path)
            .style("cursor", d => {
                const regionID = d.id;
                const code = Page1Map.findKeyOfValue(ourRegions, regionID);
                return code ? "pointer" : null;
            })
            .on("click", d => {
                // Show line chart of selected country.
                const regionID = d.id;
                const code = Page1Map.findKeyOfValue(ourRegions, regionID);
                if (!code) {
                    return;
                }
                G.lineChart.show(code);
            });
    }

    __buildPatterns() {
        const svg = this.svg;
        const defs = svg.append("defs");
        const obesityYear = 2010, smokerYear = 2013;
        const obesityData = this.data.europeObesity[obesityYear];
        //console.log(this.data.europeObesity); // WTF
        const smokerData = this.data.smokers[smokerYear];
        const codeMap = this.data.countryCodeMap;
        const ourCodes = Object.keys(Page1Map.ourRegionIDs);
        for (let i = 0; i < ourCodes.length; ++i) {
            const code = ourCodes[i];
            const country = Page1Map.findKeyOfValue(codeMap, code);
            const obesityEntry = obesityData.find(d => d.country === country);
            const smokerEntry = smokerData.find(d => d.country === country);
            if (!obesityEntry || !obesityEntry.value) {
                continue;
            }
            if (!smokerEntry || !smokerEntry.value) {
                continue;
            }
            // Create filled circles in different sizes.
            const w1 = wc(obesityEntry.value), h1 = w1;
            const cx = w1 / 2.5, cy = h1 / 2.5;
            const r1 = 2;
            const pathData1 = `M${cx - r1},${cy} A${r1},${r1},0 1 1 ${cx + r1},${cy} A${r1},${r1},0 1 1 ${cx - r1},${cy} Z`;
            const w2 = wc(smokerEntry.value), h2 = w2;
            //const r2 = r1 * Math.sqrt(w2 / w1);
            const r2 = r1;
            const pathData2 = `M${cx - r2},${cy} A${r2},${r2},0 1 1 ${cx + r2},${cy} A${r2},${r2},0 1 1 ${cx - r2},${cy} Z`;
            const pattern = defs.append("pattern")
                .attr("id", Page1Map.patternIDPrefix + code)
                .attr("patternUnits", "userSpaceOnUse")
                .attr("width", Math.max(w1, w2))
                .attr("height", Math.max(h1, h2));
            pattern.append("path")
                .attr("d", pathData1)
                .attr("stroke", "none")
                .attr("fill", Page1Map.paletteColor1);
            pattern.append("path")
                .attr("d", pathData2)
                .attr("stroke", "none")
                .attr("fill", Page1Map.paletteColor2)
                .attr("transform", `translate(${w2 / 2},${h2 / 2})`);
        }

        function wc(v) {
            return 60 / Math.sqrt(v);
        }
    }

    /**
     * @memberOf {Page1Map}
     * @return {jQuery}
     */
    get jqSvg() {
        return this._jqSvg;
    }

    /**
     * @static
     * @param obj {*}
     * @param value {*}
     * @return {*}
     */
    static findKeyOfValue(obj, value) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; ++i) {
            if (obj[keys[i]] === value) {
                return keys[i];
            }
        }
        return null;
    }

    /**
     * @static
     * @return {string}
     */
    static get patternIDPrefix() {
        return "pat-fill-";
    }

    /**
     * @static
     * @return {string}
     */
    static get fillClassPrefix() {
        return "code-";
    }

    static get regionIDPrefix() {
        return "region-";
    }

    static get ourRegionIDs() {
        return {
            "us": "840",
            "de": "276",
            "au": "036",
            "nz": "554"
        };
    }

    static getFillPatternValue(code) {
        return `url(#${Page1Map.patternIDPrefix + code})`;
    }

    /**
     * @static
     * @returns {string}
     */
    static get paletteColor1() {
        return "#E94E1B";
    }

    /**
     * @static
     * @returns {string}
     */
    static get paletteColor2() {
        return "#237FC3";
    }

}
