"use strict";

const BASE_FILL = "#217FC2";
const HOVER_FILL = "#E94E1B";

function buildMap() {
    const mapJsonObject = G.mapData;
    const div = document.querySelector("#flex-table tr:nth-child(1) td:nth-child(2)");
    const width = div.clientWidth, height = div.clientHeight;
    const projection = d3.geoMercator().scale(400).translate([width / 2, 0]).center([5, 70]);
    const path = d3.geoPath().projection(projection);
    const svg = G.europe = d3.select("#d3-map-cont").append("svg").attr("class", "d3-map");
    svg.attr("width", width).attr("height", height);

    const g = svg.append("g");
    const countriesData = topojson.feature(mapJsonObject, mapJsonObject.objects.europe).features;
    g.selectAll(".country")
        .data(countriesData)
        .enter()
        .append("path")
        .attr("class", function (d) {
            var r = "country";
            const code = findKeyOfValue(G.codeMap, d.properties.name);
            if (code) {
                r += " region-code-" + code;
            } else {
                console.warn("Unknown country: " + d.properties.name);
            }
            return r;
        })
        .style("fill", function (d) {
            var code = findKeyOfValue(G.codeMap, d.properties.name);
            if (!code) {
                return "#DD0";
            } else {
                //return BASE_FILL;
                return "url(#pattern-fill-" + code + ")";
            }
        })
        .on("mouseenter", function (d) {
            var code = findKeyOfValue(G.codeMap, d.properties.name);
            if (code) {
                d3.selectAll(".code-" + code).style("fill", HOVER_FILL);
            }
        })
        .on("mouseout", function (d) {
            var code = findKeyOfValue(G.codeMap, d.properties.name);
            if (code) {
                d3.selectAll(".code-" + code).style("fill", BASE_FILL);
            }
        })
        .on("click", onMapCountryClick)
        .attr("d", path);
    const boundaryMesh = topojson.mesh(mapJsonObject, mapJsonObject.objects.europe, function (a, b) {
        return a !== b;
    });
    g.append("path")
        .datum(boundaryMesh)
        .attr("class", "boundary")
        .attr("d", path);

    addFillDefs(document.querySelector(".d3-map"));

    function addFillDefs(svgElem) {
        svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElem.setAttribute("version", "1.1");
        svgElem.setAttributeNS("xmlns", "xlink", "http://www.w3.org/1999/xlink");
        const bmi30Object = G.bmiData;
        const defs = document.createElement("defs");
        for (var i = 0; i < bmi30Object.length; ++i) {
            const code = bmi30Object[i].code;
            const pattern = document.createElement("pattern");
            pattern.id = "pattern-fill-" + code;
            //const size = bmi30Object[i].values["2014"];
            const patternSize = 5;
            pattern.setAttribute("width", patternSize.toString());
            pattern.setAttribute("height", patternSize.toString());
            pattern.setAttribute("patternUnits", "userSpaceOnUse");
            const circle = document.createElement("circle");
            const radius = 2;
            circle.setAttribute("r", radius.toString());
            const offset = (patternSize / 2 - radius);
            // circle.setAttribute("cx", offset.toString());
            // circle.setAttribute("cy", offset.toString());
            pattern.appendChild(circle);
            circle.setAttribute("class", "code-" + code);
            circle.style.fill = "white";
            defs.appendChild(pattern);
        }
        svgElem.insertBefore(defs, svgElem.childNodes[0]);
    }
}

function buildStaticBarGraph() {
    const data = G.bmiData
        .filter(function (v, i) {
            const TOP_COUNT = 10;
            return i < TOP_COUNT;
        })
        .reverse();

    const div = document.querySelector("#flex-table tr:nth-child(1) td:nth-child(1)");
    const width = div.clientWidth, height = div.clientHeight;
    const svg = G.bar = d3.select("#d3-bar-graph-cont").append("svg").attr("class", "d3-bar");
    var k = 0;
    const scaleX = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return +d.values["2014"];
        })])
        .range([height, 0]);
    const scaleY = d3.scaleBand()
    //.rangeRound([0, width], 0.01)
        .rangeRound([width, 0], 0.01)
        .domain(data.map(function (d) {
            return d.code;
        }));
    var g = svg.append("g")
        .selectAll(".bmi-bar")
        .data(data)
        .enter();
    g.append("rect")
        .style("fill", BASE_FILL)
        .attr("class", function (d) {
            var r = "bmi-bar";
            r += " code-" + d.code;
            return r;
        })
        .attr("transform", function (d) {
            return "translate(0," + scaleY(d.code) + ")";
        })
        .attr("x", function (d) {
            //return scaleX(+d.values["2014"]);
            return 0;
        })
        .attr("width", function (d) {
            return width - scaleX(+d.values["2014"]);
        })
        .attr("height", height / (data.length + 5))
        .on("mouseenter", function (d) {
            d3.selectAll(".code-" + d.code).style("fill", HOVER_FILL);
        })
        .on("mouseout", function (d) {
            d3.selectAll(".code-" + d.code).style("fill", BASE_FILL);
        })
        .on("click", onBarCountryClick);
}

function findKeyOfValue(obj, value) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; ++i) {
        if (obj[keys[i]] === value) {
            return keys[i];
        }
    }
    return null;
}

function main() {
    init();
    buildMap();
    buildStaticBarGraph();

    function init() {
        const o = G.codeMap = Object.create(null);
        const countryCodeText = sessionStorage.getItem("country-code");
        const countryCodeObject = Papa.parse(countryCodeText).data;
        for (var i = 1; i < countryCodeObject.length; ++i) {
            const code = countryCodeObject[i][1];
            if (code) {
                o[code] = countryCodeObject[i][0];
            }
        }

        const bmi30Text = sessionStorage.getItem("bmi30");
        const bmi30Object = Papa.parse(bmi30Text).data;
        const mapJsonText = sessionStorage.getItem("europe-map");
        const mapJsonObject = G.mapData = JSON.parse(mapJsonText);
        const countriesData = topojson.feature(mapJsonObject, mapJsonObject.objects.europe).features;
        const data = G.bmiData = [];
        for (var k = 0; k < countriesData.length; ++k) {
            const code = findKeyOfValue(G.codeMap, countriesData[k].properties.name);
            if (!code) {
                continue;
            }
            var filtered = bmi30Object
                .filter(function (v, i) {
                    if (i < 1) {
                        return false;
                    }
                    return v[1] === code;
                })
                .map(function (v) {
                    var o = Object.create(null);
                    o.year = v[2];
                    o.mean = v[3];
                    return o;
                });
            if (!filtered || filtered.length === 0) {
                continue;
            }
            var values = Object.create(null);
            for (var j = 0; j < filtered.length; ++j) {
                values[filtered[j].year] = filtered[j].mean;
            }
            // country, code, year, mean
            data.push({code: code, name: G.codeMap[code], values: values});
        }
        data.sort(function (d1, d2) {
            return +d1.values["2014"] - +d2.values["2014"];
        });
    }
}

function rebuildLineGraph(code) {

}

/**
 *
 * @type {{europe: *, bar: *, codeMap: *, mapData: *, bmiData: {code: String, name: String, values: {year: Number, mean: Number}[]}}}
 */
const G = Object.create(null);
main();

function onMapCountryClick(d) {
    var code = findKeyOfValue(G.codeMap, d.properties.name);
    if (!code) {
        return;
    }
    var countryName = G.codeMap[code];
    rebuildLineGraph(code);
}

function onBarCountryClick(d) {
    const code = d.code;
    rebuildLineGraph(code);
    console.log(d.values["2014"]);
}

window.addEventListener("keydown",
    /**
     * @param ev {KeyboardEvent}
     */
    function (ev) {
        var code = ev.keyCode;
        switch (code) {
            case 37: // L
            case 38: // U
                location.assign("page1.html");
                break;
            default:
                break;
        }
    });
