"use strict";

/**
 * @param code {String}
 * @param [position] {Number[]}
 */
function showGraph(code, position) {
    $("#tt-d3-graph").html("");
    createGraph();
    prepareOther();
    $(".overlay").show();

    function createGraph() {
        const svgContainer = d3.select("#tt-d3-graph");
        const svg = svgContainer.append("svg");
        svg.attr("width", "400").attr("height", "150");
        const width = svg.attr("width");
        const height = svg.attr("height");
        const margins = {top: 20, right: 20, bottom: 30, left: 50};
        svg.attr("transform", "translate(" + margins.left + "," + margins.top + ")");
        setBmiData(svg, width, height);
        setTobaccoData(svg, width, height);
    }

    /**
     *
     * @param svg {Selection}
     * @param width {Number}
     * @param height {Number}
     */
    function setBmiData(svg, width, height) {
        // BMI > 30
        const csvText = sessionStorage.getItem("bmi30");
        const csv = parseCsv(csvText, code);
        const xScale = d3.scaleTime()
            .rangeRound([0, width])
            .domain(d3.extent(csv, function (d) {
                return parseTime(d.year);
            }));
        const yScale = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, 100]);
        const line = d3.line()
            .x(function (d) {
                return xScale(parseTime(d.year));
            }).y(function (d) {
                return yScale(d.mean);
            });

        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5);
        const yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5);
        const g = svg.append("g");
        g.append("path")
            .datum(csv)
            .attr("class", "d3-line-bmi")
            .attr("d", line);
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    }

    /**
     *
     * @param svg {Selection}
     * @param width {Number}
     * @param height {Number}
     */
    function setTobaccoData(svg, width, height) {
        const csvText = sessionStorage.getItem("t15");
        const csvFemale = parseCsv(csvText, code, function (d) {
            return Number(d[2]) === 1;
        });
        const csvMale = parseCsv(csvText, code, function (d) {
            return Number(d[2]) === 2;
        });
        wtf(csvFemale, "d3-line-tobacco line-female");
        wtf(csvMale, "d3-line-tobacco line-male");

        function wtf(csv, clazz) {
            const xScale = d3.scaleTime()
                .rangeRound([0, width])
                .domain(d3.extent(csv, function (d) {
                    return parseTime(d.year);
                }));
            const yScale = d3.scaleLinear()
                .rangeRound([height, 0])
                .domain([0, 100]);
            const line = d3.line()
                .x(function (d) {
                    return xScale(parseTime(d.year));
                }).y(function (d) {
                    return yScale(d.mean);
                });

            const xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(5);
            const yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);
            const g = svg.append("g");
            g.append("path")
                .datum(csv)
                .attr("class", clazz)
                .attr("d", line);
        }
    }

    function parseTime(input) {
        return new Date(Date.parse(input));
    }

    function prepareOther() {
        if (position) {
            var container = $("#tt-container");
            container.css("left", position[0] + "px").css("top", position[1] + "px");
        }
        var countryName = countryText[code];
        if (countryName) {
            var countryElem = document.getElementById("tt-country");
            countryElem.textContent = countryName;
        }
        var policy = policies[code];
        var policyList = document.getElementById("tt-policies");
        while (policyList.childNodes.length > 0) {
            policyList.removeChild(policyList.childNodes[0]);
        }
        if (policy) {
            var keys = ["env", "warning", "media", "ads", "tax"];
            for (var i = 0; i < keys.length; ++i) {
                var val = policy[keys[i]];
                if (val >= 0) {
                    var desc = policyText[keys[i]].desc;
                    var readableText = policyText[keys[i]][val];
                    var li = document.createElement("li");
                    li.innerHTML = '<span class="tt-policy-description">' + desc + '</span>: <span class="tt-policy-readable">' + readableText + "</span>";
                    policyList.appendChild(li);
                }
            }
        }
    }

    /**
     *
     * @param csvText {String}
     * @param [code] {String}
     * @param [predicate] {function(*): Boolean}
     * @return {*[]}
     */
    function parseCsv(csvText, code, predicate) {
        var csv = Papa.parse(csvText);
        var csvData = csv.data;
        var rowHeaders = csvData[0];
        var result = [];
        for (var i = 1; i < csvData.length; ++i) {
            if (!csvData[i][0]) {
                continue;
            }
            if (code && csvData[i][1] !== code) {
                continue;
            }
            if (!!predicate && !predicate(csvData[i])) {
                continue;
            }
            var item = Object.create(null);
            for (var j = 0; j < rowHeaders.length; ++j) {
                var data = csvData[i][j];
                var possibleNumber = +data;
                if (Number.isNaN(possibleNumber)) {
                    item[rowHeaders[j]] = data;
                } else {
                    item[rowHeaders[j]] = possibleNumber;
                }
            }
            result.push(item);
        }
        return result;
    }
}

function hideGraph() {
    $(".overlay").hide();
}

function main() {
    hideGraph();
    var svgElem = document.getElementById("world-svg");
    svgElem.contentWindow.addEventListener("click", function () {
        const countryCodeList = ["de", "cn", "us", "nz", "ae", "gb"];
        const n = d3.randomUniform(countryCodeList.length)() | 0;
        console.log(n);
        showGraph(countryCodeList[n]);
    });
    $("#overlay-click").on("click", hideGraph);
    $("#tt-container").draggable();
}

const policies = JSON.parse(sessionStorage.getItem("tobacco-policy"));
const policyText = {
    env: {
        desc: "Health warnings on cigarette packages",
        0: "0-2",
        1: "3-5",
        2: "6-7",
        3: "All"
    },
    warning: {
        desc: "Health warnings on cigarette packages",
        0: "No warnings",
        1: "Medium size warnings missing some appropiate characteristics",
        2: "Medium size warnings",
        3: "Large warnings"
    },
    media: {
        desc: "Mass media anti-tobacco campaigns",
        0: "No campaign",
        1: "National campaign"
    },
    ads: {
        desc: "Bans on advertising and promotion",
        0: "No ban",
        1: "Ban on national TV, radio and print media",
        2: "Ban on all forms of direct and indirect advertising"
    },
    tax: {
        desc: "Share of total taxes in the price of most sold brand of cigarettes",
        0: "<25%",
        1: "26-50%",
        2: "51-75%",
        3: ">75%"
    }
};

const countryText = {
    "de": "Germany",
    "cn": "China",
    "us": "USA",
    "nz": "New Zealand",
    "ae": "United Arab Emirates",
    "gb": "UK"
};

document.body.onload = main;

window.addEventListener("keydown",
    /**
     * @param ev {KeyboardEvent}
     */
    function (ev) {
        var code = ev.keyCode;
        switch (code) {
            case 37: // L
            case 38: // U
                location.assign("index.html");
                break;
            case 32:
            case 39: // R
            case 40:
                location.assign("page2.html");
                break;
            default:
                break;
        }
    });
