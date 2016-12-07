"use strict";

//const BASE_FILL = "#217FC2";
const BASE_FILL = "#FFF";
const HOVER_FILL = "#E94E1B";
const FILL_CLASS_PREFIX = "code-";
const FILL_PATTERN_ID_PREFIX = "pattern-fill-";
const DATA_YEAR = 2014;

(function () {
    const aCsvText = sessionStorage.getItem("bmi-cont");
    const aCsvData = Papa.parse(aCsvText).data;
    const tiles = [];
    for (var i = 1; i < aCsvData.length; ++i) {
        if (!aCsvData[i][1] || aCsvData[i][3] !== "Europe") {
            continue;
        }
        var text = '<pattern id="' + FILL_PATTERN_ID_PREFIX + aCsvData[i][1] + '" ';
        const size = 25 / Math.sqrt(+aCsvData[i][2]);
        text += 'width="' + size + '" height="' + size + '" patternUnits="userSpaceOnUse">\n';
        //text += '    <circle class="' + FILL_CLASS_PREFIX + aCsvData[i][1] + '" fill="' + BASE_FILL + '" r="1" cx="1.5" cy="1.5"></circle>\n';
        const radius = (-2.5 + Math.log(+aCsvData[i][2])) * 1.25;
        text += '    <circle class="' + FILL_CLASS_PREFIX + aCsvData[i][1] + ' pattern-code" r="' + radius + '" cx="1.5" cy="1.5"></circle>\n';
        text += "</pattern>";
        tiles.push(text);
    }
    console.log(tiles.join("\n"));
})();

function buildMap() {
    const mapJsonObject = G.mapData;
    const div = document.querySelector("#flex-table tr:nth-child(1) td:nth-child(2)");
    const width = div.clientWidth, height = div.clientHeight;
    const projection = d3.geoMercator().scale(400).translate([width / 2, 0]).center([5, 70]);
    const path = d3.geoPath().projection(projection);
    const svg = G.europe = d3.select("#d3-map");
    svg.attr("width", width).attr("height", height);

    //addFillDefs(document.querySelector(".d3-map"));
    //addFillDefs(document.querySelector("#pa"));
    //addFillDefs(null, document.getElementById("defs"));

    const g = svg.append("g");
    const countriesData = topojson.feature(mapJsonObject, mapJsonObject.objects.europe).features;
    const tooltipContent = $("#map-tooltip-content");
    const tooltipContentName = $("#map-tooltip-content-name");
    const tooltipContentNumber = $("#map-tooltip-content-number");
    g.selectAll(".country")
        .data(countriesData)
        .enter()
        .append("path")
        .attr("class", function (d) {
            var r = "country";
            const code = findKeyOfValue(G.codeMap, d.properties.name);
            if (code) {
                //r += " " + FILL_CLASS_INDEX + code;
            } else {
                console.warn("Unknown country: " + d.properties.name);
            }
            return r;
        })
        .style("fill", function (d) {
            const code = findKeyOfValue(G.codeMap, d.properties.name);
            if (!code) {
                //return "#DD0";
                return "none";
            } else {
                //return BASE_FILL;
                return "url(#" + FILL_PATTERN_ID_PREFIX + code + ")";
                //return "url(#dupig)";
            }
        })
        .on("mouseenter", function (d) {
            const code = findKeyOfValue(G.codeMap, d.properties.name);
            if (code) {
                d3.selectAll("." + FILL_CLASS_PREFIX + code).style("fill", HOVER_FILL);
            }
        })
        .on("mousemove", function (d) {
            const code = findKeyOfValue(G.codeMap, d.properties.name);
            if (!code) {
                return;
            }
            tooltipContent.show();
            const coords = d3.mouse(document.body);
            tooltipContent
                .css("left", (coords[0] + 10) + "px")
                .css("top", (coords[1] + 10) + "px");
            const item = G.bmiData.find(function (v) {
                return v.code === code;
            });
            if (!item) {
                return;
            }
            tooltipContentName.text(d.properties.name);
            tooltipContentNumber.text(item.values[DATA_YEAR]);
        })
        .on("mouseout", function (d) {
            tooltipContent.hide();
            const code = findKeyOfValue(G.codeMap, d.properties.name);
            if (code) {
                d3.selectAll("." + FILL_CLASS_PREFIX + code).style("fill", BASE_FILL);
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

    function addFillDefs(svgElem, defsElem) {
        if (svgElem) {
            svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svgElem.setAttribute("version", "1.1");
            svgElem.setAttributeNS("http://www.w3.org/2000/svg", "xlink", "http://www.w3.org/1999/xlink");
        }
        const bmi30Object = G.bmiData;
        const defs = defsElem ? defsElem : document.createElement("defs");
        for (var i = 0; i < bmi30Object.length; ++i) {
            const code = bmi30Object[i].code;
            const pattern = document.createElement("pattern");
            pattern.id = FILL_CLASS_PREFIX + code;
            //const size = bmi30Object[i].values[DATA_YEAR];
            const patternSize = 5;
            pattern.setAttribute("width", patternSize.toString());
            pattern.setAttribute("height", patternSize.toString());
            pattern.setAttribute("patternUnits", "userSpaceOnUse");
            const circle = document.createElement("circle");
            const radius = 2;
            // circle.setAttribute("r", radius.toString());
            // //const offset = (patternSize / 2 - radius);
            // const offset = 4;
            // circle.setAttribute("cx", offset.toString());
            // circle.setAttribute("cy", offset.toString());
            // pattern.appendChild(circle);
            // circle.setAttribute("class", "code-" + code);
            // circle.style.fill = "white";
            circle.setAttribute("fill", "#FEF");
            circle.setAttribute("r", "2");
            circle.setAttribute("cx", "1.5");
            circle.setAttribute("cy", "1.5");
            pattern.appendChild(circle);
            defs.appendChild(pattern);
        }
        if (svgElem) {
            svgElem.insertBefore(defs, svgElem.childNodes[0]);
        }
    }
}

function buildStaticBarGraph() {
    const data = G.bmiData.reverse()
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
            return +d.values[DATA_YEAR];
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
            r += " " + FILL_CLASS_PREFIX + d.code;
            return r;
        })
        .attr("transform", function (d) {
            return "translate(0," + scaleY(d.code) + ")";
        })
        .attr("x", function (d) {
            //return scaleX(+d.values[DATA_YEAR]);
            return 0;
        })
        .attr("width", function (d) {
            return width - scaleX(+d.values[DATA_YEAR]);
        })
        .attr("height", height / (data.length + 5))
        .on("mouseenter", function (d) {
            d3.selectAll("." + FILL_CLASS_PREFIX + d.code).style("fill", HOVER_FILL);
        })
        .on("mouseout", function (d) {
            d3.selectAll("." + FILL_CLASS_PREFIX + d.code).style("fill", BASE_FILL);
        })
        .on("click", onBarCountryClick);
    g.append("text")
        .text(function (d) {
            return d.name;
        })
        .attr("x", 0)
        .attr("transform", function (d) {
            return "translate (0," + ((+scaleY(d.code)) + 21).toString() + ")";
        })
        .attr("font-size", "10")
        .style("pointer-events", "none");
    g.append("text")
        .text(function (d) {
            var val = +d.values[DATA_YEAR];
            val = ((val * 100) | 0) / 100;
            return String(val);
        })
        .attr("x", function (d) {
            return width - scaleX(+d.values[DATA_YEAR]) + 1;
        })
        .attr("transform", function (d) {
            return "translate (0," + ((+scaleY(d.code)) + 21).toString() + ")";
        })
        .attr("font-size", "10")
        .style("pointer-events", "none")
        .style("fill", BASE_FILL);
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
            return +d1.values[DATA_YEAR] - +d2.values[DATA_YEAR];
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
    console.log(d.values[DATA_YEAR]);
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
