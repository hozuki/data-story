"use strict";

class Page2Map {

    /**
     * @constructor
     * @param data {Page2Data}
     */
    constructor(data) {
        this.data = data;
        /**
         * @type {*}
         * @memberOf {Page2Map}
         */
        this.svg = d3.select("#svg-europe-map");
        /**
         * @memberOf {Page2Map}
         * @type {jQuery}
         * @private
         */
        this._jqSvg = $(this.svg._groups[0]);
        /**
         * @type {*}
         * @memberOf {Page2Map}
         */
        this._g = null;
    }

    rebuild(year) {
        if (year === void(0)) {
            year = Page2BPChart.yearEnd;
        }
        this.jqSvg.html("");
        this.__clearEventHandlers();
        this.__rebuildNormalizedPatterns(year);

        const svg = this.svg;
        const div = document.querySelector("#div-map");
        const tooltipContent = $("#map-tooltip-content"),
            tooltipContentName = $("#map-tooltip-content-name"),
            tooltipContentNumber = $("#map-tooltip-content-number");
        const width = div.clientWidth, height = div.clientHeight;
        const g = this._g = svg.append("g");
        {
            const sx = 0.94, sy = 0.94, tx = 0, ty = 40;
            g.attr("transform", `scale(${sx},${sy}) translate(${tx},${ty})`);
        }

        const obesityData = this.data.obesityData[year];
        const countryFeatures = this.data.countryFeatures;
        const codeMap = this.data.countryCodeMap;
        const projection = d3.geoMercator().scale(400).translate([width / 2, 0]).center([5, 70]);
        const path = d3.geoPath().projection(projection);
        g.selectAll(".country")
            .data(countryFeatures)
            .enter()
            .append("path")
            .attr("class", d => {
                let r = "country";
                const code = codeMap[d.properties.name];
                if (!code) {
                    console.warn(`Unknown country: ${d.properties.name}`);
                } else {
                    //r += " " + Page2Map.fillClassPrefix + code;
                }
                return r;
            })
            .attr("fill", d => {
                const code = codeMap[d.properties.name];
                if (!code) {
                    //return "#DD0";
                    return "rgba(255,127,255,0.4)";
                } else {
                    const entry = obesityData.find(data => data.country === d.properties.name);
                    if (entry && entry.value) {
                        return `url(#${Page2Map.patternIDPrefix}${code})`;
                    } else {
                        //return "rgba(255,127,255,0.4)";
                        return "rgba(0, 0, 0, 0.3)";
                        //return "hsla(228,75%,15%,0.4)";
                    }
                }
            })
            .on("mouseenter", d => {
                const code = codeMap[d.properties.name];
                if (!code) {
                    return;
                }
                const intakeData = G.bpChart.bpChart.bars().mainBars.find(bar => bar.key === d.properties.name);
                if (intakeData) {
                    G.bpChart.$onMouseEnter(intakeData);
                }
                const strokeSelector = `.${Page2Map.fillClassPrefix}${code}`;
                d3.selectAll(strokeSelector)
                    .style("stroke", Page2Map.hoverFill)
                    .style("fill", Page2Map.hoverFill);

                {
                    const item = obesityData.find(v => v.country === d.properties.name);
                    const country = d.properties.name;
                    let numberHtml;
                    if (item && item.value) {
                        numberHtml = `<span class="highlight">${item.value}%</span> of total population<br/>are overweight`;
                    } else {
                        numberHtml = `<span class="missing">Value of year ${year} is missing</span>`;
                    }
                    tooltipContentName.text(country);
                    tooltipContentNumber.html(numberHtml);
                    tooltipContent.show();
                }
                G.lineChart.show(d.properties.name);
            })
            .on("mousemove", d => {
                const code = codeMap[d.properties.name];
                if (!code) {
                    return;
                }
                tooltipContent.show();
                const coordinates = d3.mouse(document.body);
                tooltipContent
                    .css("left", (coordinates[0] + 10) + "px")
                    .css("top", (coordinates[1] + 10) + "px");
            })
            .on("mouseout", d => {
                tooltipContent.hide();
                const code = codeMap[d.properties.name];
                if (!code) {
                    return;
                }
                const intakeData = G.bpChart.bpChart.bars().mainBars.find(bar => bar.key === d.properties.name);
                if (intakeData) {
                    G.bpChart.$onMouseOut(intakeData);
                }
                const strokeSelector = `.${Page2Map.fillClassPrefix}${code}`;
                let a = d3.selectAll(strokeSelector)
                    .style("stroke", Page2Map.baseFill)
                    .style("fill", Page2Map.baseFill);
                G.lineChart.hide();
            })
            .attr("d", path);
        const boundaryMesh = this.data.boundaryMesh;
        g.append("path")
            .datum(boundaryMesh)
            .attr("class", "boundary")
            .attr("d", path);
    }

    /**
     * @param year {number}
     * @private
     */
    __rebuildPatterns(year) {
        const svg = this.svg;
        const defs = svg.append("defs");
        const obesityData = this.data.obesityData[year];
        const codeMap = this.data.countryCodeMap;
        for (let i = 0; i < obesityData.length; ++i) {
            const entry = obesityData[i];
            const code = codeMap[entry.country];
            if (!code) {
                continue;
            }
            if (!entry.value) {
                continue;
            }
            const w = 25 / Math.sqrt(entry.value), h = w;
            const cx = w / 2.5, cy = h / 2.5;
            // const r = (-2.5 + Math.log(entry.value)) * 1.25;
            const r = 1;
            const pathData = `M${cx - r},${cy} A${r},${r},0 1 1 ${cx + r},${cy} A${r},${r},0 1 1 ${cx - r},${cy} Z`;
            //const pathData = `M${cx},0 L0,${cy} M${w},0 L0,${h} M${w},${cy} L${cx},${h}`;
            defs.append("pattern")
                .attr("id", Page2Map.patternIDPrefix + code)
                .attr("patternUnits", "userSpaceOnUse")
                .attr("width", w)
                .attr("height", h)
                .append("path")
                .attr("class", `pattern ${Page2Map.fillClassPrefix}${code}`)
                .attr("d", pathData)
                .attr("stroke", Page2Map.baseFill)
                .attr("fill", Page2Map.baseFill)
                .attr("stroke-width", 1);
        }
    }

    /**
     * @param year {number}
     * @private
     */
    __rebuildNormalizedPatterns(year) {
        const svg = this.svg;
        const defs = svg.append("defs");
        const obesityData = this.data.obesityData[year];
        const codeMap = this.data.countryCodeMap;
        const extent = [Number.MAX_VALUE, Number.MIN_VALUE];
        for (let i = 0; i < obesityData.length; ++i) {
            const entry = obesityData[i];
            const code = codeMap[entry.country];
            if (!code) {
                continue;
            }
            if (!entry.value) {
                continue;
            }
            if (entry.value < extent[0]) {
                extent[0] = entry.value;
            }
            if (entry.value > extent[1]) {
                extent[1] = entry.value;
            }
        }
        const rangeLength = extent[1] - extent[0];
        let w, h;
        if (rangeLength <= 0) {
            w = 30 / Math.sqrt(extent[0]);
            h = w;
        }
        for (let i = 0; i < obesityData.length; ++i) {
            const entry = obesityData[i];
            const code = codeMap[entry.country];
            if (!code) {
                continue;
            }
            if (!entry.value) {
                continue;
            }
            if (rangeLength > 0) {
                w = 4 * rangeLength / (entry.value - extent[0]);
                h = w;
            }

            // dots
            const cx = w / 2.5, cy = h / 2.5;
            const r = 1;
            const pathData = `M${cx - r},${cy} A${r},${r},0 1 1 ${cx + r},${cy} A${r},${r},0 1 1 ${cx - r},${cy} Z`;
            // hatches
            //const cx = w / 2, cy = h / 2;
            //const pathData = entry.value > extent[0] ? `M${cx},0 L0,${cy} M${w},0 L0,${h} M${w},${cy} L${cx},${h}` : "";
            defs.append("pattern")
                .attr("id", Page2Map.patternIDPrefix + code)
                .attr("patternUnits", "userSpaceOnUse")
                .attr("width", w)
                .attr("height", h)
                .append("path")
                .attr("class", `pattern ${Page2Map.fillClassPrefix}${code}`)
                .attr("d", pathData)
                .attr("stroke", Page2Map.baseFill)
                .attr("stroke-width", 1);
        }
    }

    /**
     * @private
     */
    __clearEventHandlers() {
        if (!this._g) {
            return;
        }
        this._g.selectAll(".country")
            .on("mouseenter", null)
            .on("mousemove", null)
            .on("mouseout", null);
    }

    static get yearStart() {
        return 1979;
    }

    static get yearEnd() {
        return 2011;
    }

    /**
     * @memberOf {Page2Map}
     * @return {jQuery}
     */
    get jqSvg() {
        return this._jqSvg;
    }

    /**
     *
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

    /**
     * @static
     * @return {string}
     */
    static get hoverFill() {
        return "#E94E1B";
    }

    /**
     * @static
     * @return {string}
     */
    static get baseFill() {
        return "#EE0";
    }

}
