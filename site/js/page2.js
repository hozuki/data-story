"use strict";

const BASE_FILL = "#217FC2";
const HOVER_FILL = "#E94E1B";

function buildMap() {
    const mapJsonText = sessionStorage.getItem("europe-map");
    const mapJsonObject = JSON.parse(mapJsonText);
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
            var code = findKeyOfValue(G.codeMap, d.properties.name);
            if (code) {
                r += " code-" + code;
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
                return BASE_FILL;
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
}

function buildStaticBarGraph() {
    const bmi30Text = sessionStorage.getItem("bmi30");
    const bmi30Object = Papa.parse(bmi30Text).data;
    const mapJsonText = sessionStorage.getItem("europe-map");
    const mapJsonObject = JSON.parse(mapJsonText);
    const countriesData = topojson.feature(mapJsonObject, mapJsonObject.objects.europe).features;
    var data = [];
    for (var i = 0; i < countriesData.length; ++i) {
        const code = findKeyOfValue(G.codeMap, countriesData[i].properties.name);
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
        return d1.values["2014"] - d2.values["2014"];
    });
    G.bmiData = data = data.filter(function (v, i) {
        const TOP_COUNT = 6;
        return i < TOP_COUNT;
    });

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
        .rangeRound([0, width], 0.01)
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
            return scaleX(+d.values["2014"]);
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
    }
}

function rebuildLineGraph(code) {

}

/**
 *
 * @type {{europe: *, bar: *, codeMap: *, bmiData: {code: String, name: String, values: {year: Number, mean: Number}[]}}}
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
}
