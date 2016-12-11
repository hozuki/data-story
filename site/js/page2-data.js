"use strict";

/**
 * @class
 */
class Page2Data {

    /**
     * @constructor
     */
    constructor() {
        this.__computeFoodIntakeData();
        this.__computeObesityData();
        this.__computeEuropeMapData();
        this.__computeCountryCodeData();
    }

    /**
     * @memberOf {Page2Data}
     * @private
     */
    __computeFoodIntakeData() {
        /**
         * @memberOf {Page2Data}
         * @type {Array<{variable: string, measure: string, country: string, value: number}>}
         */
        let myAllData = this.intakeData = [];
        /**
         * @memberOf {Page2Data}
         * @type {{[number]: Array<number>}}
         */
        let myBPData = this.intakeBPData = Object.create(null);
        let csv = sessionStorage.getItem(SessionKeys.foodIntakeTable);
        /**
         * @type {Array}
         */
        let csvData = Papa.parse(csv).data;
        const yearStart = 1961, yearEnd = 2011;
        const columnCount = yearEnd - yearStart + 1;
        const rowStart = 2, columnStart = 3;
        for (let year = yearStart; year <= yearEnd; ++year) {
            myBPData[year] = [];
        }

        const selectedTypes = ["Fat", "Protein", "Sugar"];
        const conversions = {
            "Fat": v => v,
            "Protein": v => v,
            "Sugar": v => v * 1000 / 365
        };

        /**
         * @type {string}
         */
        let variable, measure;
        for (let rowIndex = rowStart; rowIndex < csvData.length - 1; ++rowIndex) {
            let csvItem = csvData[rowIndex];
            let country = (csvItem[2] || "").trim();
            let newVariable = csvItem[0];
            if (newVariable) {
                variable = (csvItem[0] || "").trim();
                measure = (csvItem[1] || "").trim();
            }
            if (selectedTypes.indexOf(variable) < 0) {
                continue;
            }
            for (let columnIndex = columnStart; columnIndex < columnStart + columnCount; ++columnIndex) {
                /**
                 * @type {{variable: string, measure: string, country: string, value: number}}
                 */
                const dataItem = Object.create(null);
                dataItem.variable = variable;
                dataItem.measure = measure;
                dataItem.country = country;
                const value = Number(csvItem[columnIndex]);
                dataItem.value = conversions[dataItem.variable](value);
                myAllData.push(dataItem);
                const bpDataItem = [];
                bpDataItem.push(variable);
                bpDataItem.push(country);
                bpDataItem.push(dataItem.value);
                bpDataItem.push(dataItem.value);
                const year = yearStart + (columnIndex - columnStart);
                myBPData[year].push(bpDataItem);
            }
        }
    }

    /**
     * @memberOf {Page2Data}
     * @private
     */
    __computeObesityData() {
        const obesityText = sessionStorage.getItem(SessionKeys.europeObesity);
        const obesityObject = Papa.parse(obesityText).data;
        const yearStart = 1979, yearEnd = 2015, yearCount = yearEnd - yearStart + 1;
        const rowStart = 1, columnStart = 1;

        /**
         * @memberOf {Page2Data}
         * @type {{[key]: Array<{country: string, year: number, value: number}>}}
         */
        let list = this.obesityData = Object.create(null);
        for (let i = yearStart; i <= yearEnd; ++i) {
            list[i] = [];
        }
        for (let i = rowStart; i < obesityObject.length - 1; ++i) {
            let o = obesityObject[i];
            let country = o[0];
            for (let j = columnStart; j < columnStart + yearCount; ++j) {
                /**
                 * @type {{country: string, year: number, value: number}}
                 */
                let item = Object.create(null);
                item.year = j - columnStart + yearStart;
                item.country = country;
                /**
                 * @type {number|null}
                 */
                let value;
                if (!o[j]) {
                    value = null;
                } else {
                    value = Number(o[j]);
                }
                item.value = value;
                list[item.year].push(item);
            }
        }
    }

    /**
     * @memberOf {Page2Data}
     * @private
     */
    __computeEuropeMapData() {
        const mapJsonText = sessionStorage.getItem(SessionKeys.europeGeoMap);
        const mapObject = this.mapObject = JSON.parse(mapJsonText);
        /**
         * @memberOf {Page2Data}
         * @type {*}
         */
        this.countryFeatures = topojson.feature(mapObject, mapObject.objects.europe).features;
        /**
         * @memberOf {Page2Data}
         * @type {*}
         */
        this.boundaryMesh = topojson.mesh(mapObject, mapObject.objects.europe, (a, b) => a !== b);
    }

    /**
     * @memberOf {Page2Data}
     * @private
     */
    __computeCountryCodeData() {
        const countryCodeText = sessionStorage.getItem(SessionKeys.countryCode);
        const countryCodeObject = Papa.parse(countryCodeText).data;
        /**
         * {Country: Code}
         * @memberOf {Page2Data}
         * @type {{[key]: string}}
         */
        const map = this.countryCodeMap = Object.create(null);
        for (let i = 1; i < countryCodeObject.length - 1; ++i) {
            let o = countryCodeObject[i];
            map[o[0]] = o[1];
        }
    }

}
