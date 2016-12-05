"use strict";

/**
 * @class
 */
const DsMapBuilder = (function () {
    /**
     * @constructor
     */
    function DsMapBuilder() {
        /**
         * @type {Selection}
         */
        this.svg = null;
        /**
         * @type {*[]}
         * @private
         */
        this._dataRows = null;
        /**
         * @type {Path}
         * @private
         */
        this._geoPath = null;
        /**
         * @type {Graticule}
         * @private
         */
        this._graticule = null;
        /**
         * @type {{width: Number, height: Number}}
         * @private
         */
        this._config = Object.create(null);
    }

    /**
     * @const
     * @type {Number}
     */
    DsMapBuilder.BASE_COLOR = 0xff0000;
    /**
     * @const
     * @type {String}
     */
    DsMapBuilder.MAP_JSON_URL = "../data/world-topo-min.json";
    /**
     * @const
     * @type {String}
     */
    DsMapBuilder.TOOLTIP_CONTAINER_ID_SELECTOR = "#tooltip-container";
    /**
     * @const
     * @type {String}
     */
    DsMapBuilder.CHOROPLETH_CLASS_SELECTOR = ".choropleth";
    /**
     * @const
     * @type {String}
     */
    DsMapBuilder.SVG_CONTAINER_ID_SELECTOR = "#canvas-svg";
    /**
     * @const
     * @type {String}
     */
    DsMapBuilder.CONTINENT_CLASS_PREFIX = "cont-";
    /**
     * @readonly
     * @static
     * @type {{color: Number, pos: Number}[]}
     */
    DsMapBuilder.ColorSteps = [
        {color: 0xF6E824, pos: 0},
        {color: 0xEB5B5A, pos: 0.33},
        {color: 0x75235F, pos: 0.67},
        {color: 0x242651, pos: 1}
    ];

    /**
     * @static
     * @private
     * @param value {Number}
     * @param min {Number}
     * @param max {Number}
     * @returns {String}
     */
    DsMapBuilder.__makeRegionColor = function (value, min, max) {
        // const baseColor = DsMapBuilder.BASE_COLOR;
        // value = DsUtils.limit(value, min, max);
        // value = (value - min) / (max - min);
        // var r = (baseColor >> 16) & 0xff, g = (baseColor >> 8) & 0xff, b = (baseColor >> 0) & 0xff;
        // return "rgba(" + r + "," + g + "," + b + "," + value + ")";
        const percent = (value - min) / (max - min);
        const steps = DsMapBuilder.ColorSteps;
        if (percent === 1) {
            return "#" + steps[steps.length - 1].color.toString(16);
        }
        for (var i = steps.length - 2; i >= 0; --i) {
            if (percent >= steps[i].pos) {
                const periodLength = steps[i + 1].pos - steps[i].pos;
                const ratio = (percent - steps[i].pos) / periodLength;
                const mixed = DsUtils.alphaBlend(steps[i].color, steps[i + 1].color, ratio);
                return "#" + mixed.toString(16);
            }
        }
        throw new RangeError();
    };

    /**
     *
     * @param errInfo
     * @param dataRows
     * @memberOf {DsMapBuilder}
     */
    DsMapBuilder.prototype.prepareMap = function (errInfo, dataRows) {
        this._dataRows = dataRows;
        /**
         * @type {d3.Selection<SVGElement>}
         */
        const svg = d3.select(DsMapBuilder.SVG_CONTAINER_ID_SELECTOR).append("svg");
        this.svg = svg;
        const width = this._config.width = 1200, height = this._config.height = 900;
        svg.attr("width", width + "px").attr("height", height + "px");

        // https://vida.io/gists/TWNbJrHvRcR3DeAZq
        // Prepare world data
        const projection = d3.geo.orthographic()
            .scale((width + 1) / 2 / Math.PI)
            .translate([width / 2, height / 2])
            .precision(0.1);
        const geoPath = d3.geo.path()
            .projection(projection);
        this._geoPath = geoPath;
        const graticule = d3.geo.graticule();
        this._graticule = graticule;
        svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", geoPath);
    };

    DsMapBuilder.prototype.buildMap = function () {
        // Build a world map!
        d3.json(DsMapBuilder.MAP_JSON_URL, this.__buildGeoElements.bind(this));
    };

    /**
     * @param err
     * @param world
     * @private
     * @static
     */
    DsMapBuilder.prototype.__buildGeoElements = function (err, world) {
        const svg = this.svg;
        const dataRows = this._dataRows;
        const geoPath = this._geoPath;
        const graticule = this._graticule;

        const countries = topojson.feature(world, world.objects.countries).features;
        svg
            .append("path")
            .datum(graticule)
            .attr("class", "choropleth")
            .attr("d", geoPath);

        const landGroup = svg.append("g");
        landGroup
            .append("path")
            .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
            .attr("class", "equator")
            .attr("d", geoPath);

        const countryElements = landGroup.selectAll(".country").data(countries);

        const tooltipContainer = $(DsMapBuilder.TOOLTIP_CONTAINER_ID_SELECTOR);
        const choropleth = $(DsMapBuilder.CHOROPLETH_CLASS_SELECTOR)[0];
        countryElements
            .enter()
            .insert("path")
            .attr("class", function (d) {
                const classes = ["country"];
                const rowIndex = dataRows.findIndex(function (item) {
                    return item[0] === d.properties.name;
                });
                if (rowIndex >= 0) {
                    const row = dataRows[rowIndex];
                    const continent = String(row[13]);
                    const continentClass = DsMapBuilder.CONTINENT_CLASS_PREFIX + continent.toLowerCase().replace(" ", "-");
                    classes.push(continentClass);
                }
                return classes.join(" ");
            })
            .attr("d", geoPath)
            .attr("id", function (d, i) {
                return d.id;
            })
            .attr("title", function (d) {
                return d.properties.name;
            })
            .on("mousemove", function (d) {
                var html = d.properties.name;

                var rowIndex = dataRows.findIndex(function (item) {
                    return item[0] === d.properties.name;
                });
                if (rowIndex < 0) {
                    html += " (Not Found)";
                } else {
                    var row = dataRows[rowIndex];
                    // const hospitalCols = [8, 9, 10, 11, 12];
                    const hospitalCols = [2];
                    var skip = false;
                    for (var j = 0; j < hospitalCols.length; ++j) {
                        if (row[hospitalCols[j]] === null) {
                            html += " (Data Missing)";
                            skip = true;
                            break;
                        }
                    }
                    if (!skip) {
                        const headers = ["posts", "center", "rural", "provincial", "specialized"];
                        var total = 0;
                        for (var j = 0; j < hospitalCols.length; ++j) {
                            const value = (((row[hospitalCols[j]] * 100) | 0) / 100);
                            html += " " + value.toString() + "(" + headers[j] + ")";
                            total += value;
                        }
                        html += " " + (((total * 100) | 0) / 100).toString() + "(total)";
                    }
                }

                tooltipContainer.html(html);
                $(this).attr("fill-opacity", "0.8");
                tooltipContainer.show();

                const mapWidth = choropleth.getBoundingClientRect().width;
                if (d3.event.pageX < mapWidth / 2) {
                    d3.select(DsMapBuilder.SVG_CONTAINER_ID_SELECTOR)
                        .style("top", (d3.event.layerY + 15) + "px")
                        .style("left", (d3.event.layerX + 15) + "px");
                } else {
                    const tooltipWidth = tooltipContainer.width();
                    d3.select(DsMapBuilder.SVG_CONTAINER_ID_SELECTOR)
                        .style("top", (d3.event.layerY + 15) + "px")
                        .style("left", (d3.event.layerX - tooltipWidth - 30) + "px");
                }
            })
            .on("mouseout", function () {
                $(this).attr("fill-opacity", "1.0");
                tooltipContainer.hide();
            });

        const countryHospitals = [];
        //const hospitalCols = [8, 9, 10, 11, 12];
        const hospitalCols = [2];
        for (var i = 0; i < dataRows.length; ++i) {
            const row = dataRows[i];
            var skip = false;
            for (var j = 0; j < hospitalCols.length; ++j) {
                if (row[hospitalCols[j]] === null) {
                    skip = true;
                    break;
                }
            }
            if (skip) {
                continue;
            }
            const obj = Object.create(null);
            obj.value = 0;
            for (var j = 0; j < hospitalCols.length; ++j) {
                obj.value += row[hospitalCols[j]] === null ? 0 : row[hospitalCols[j]];
            }
            // Country
            obj.key = row[0];
            countryHospitals.push(obj);
        }
        var hospitalMin = Number.MAX_VALUE;
        var hospitalMax = Number.MIN_VALUE;
        for (var i = 0; i < countryHospitals.length; ++i) {
            if (hospitalMin > countryHospitals[i].value) {
                hospitalMin = countryHospitals[i].value;
            }
            if (hospitalMax < countryHospitals[i].value) {
                hospitalMax = countryHospitals[i].value;
            }
        }

        countryElements
            .style("fill", function (d) {
                var rowIndex = dataRows.findIndex(function (item) {
                    return item[0] === d.properties.name;
                });
                if (rowIndex < 0) {
                    return "lightblue";
                }
                var row = dataRows[rowIndex];
                // const hospitalCols = [8, 9, 10, 11, 12];
                const hospitalCols = [2];
                for (var j = 0; j < hospitalCols.length; ++j) {
                    if (row[hospitalCols[j]] === null) {
                        return "#ccc";
                    }
                }
                var value = 0;
                for (var j = 0; j < hospitalCols.length; ++j) {
                    value += row[hospitalCols[j]] === null ? 0 : row[hospitalCols[j]];
                }
                return DsMapBuilder.__makeRegionColor(value, hospitalMin, hospitalMax);
            });

        var pathMesh = topojson.mesh(world, world.objects.countries, function (a, b) {
            return a !== b;
        });
        landGroup
            .append("path")
            .datum(pathMesh)
            .attr("class", "boundary")
            .attr("d", geoPath);

        svg.attr("height", this._config.height * 2.2 / 3);
    };

    return DsMapBuilder;
})();