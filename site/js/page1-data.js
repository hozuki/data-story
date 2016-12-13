"use strict";

class Page1Data {

    constructor() {
        this.__computeWorldMapData();
        this.__computeTobaccoPolicyData();
        this.__computeSmokerData();
        this.__computeObesityData();
        this.__computeWorldObesityData();
        this.__computeCountryCodeData();
    }

    /**
     * @memberOf {Page1Data}
     * @private
     */
    __computeWorldMapData() {
        const mapJsonText = sessionStorage.getItem(SessionKeys.worldGeoMap);
        const mapObject = this.mapObject = JSON.parse(mapJsonText);
        /**
         * @memberOf {Page1Data}
         * @type {*}
         */
        this.countryFeatures = topojson.feature(mapObject, mapObject.objects.countries).features;
        /**
         * @memberOf {Page1Data}
         * @type {*}
         */
        this.boundaryMesh = topojson.mesh(mapObject, mapObject.objects.countries, (a, b) => a !== b);
    }

    /**
     * @memberOf {Page1Data}
     * @private
     */
    __computeTobaccoPolicyData() {
        const json = sessionStorage.getItem(SessionKeys.tobaccoPolicy);
        /**
         * @memberOf {Page1Data}
         * @type {{[countryCode]: {env: number, warning: number, media: number, ads: number, tax: number, year: number}}}
         */
        this.tobaccoPolicy = JSON.parse(json);
    }

    /**
     * @memberOf {Page1Data}
     * @private
     */
    __computeSmokerData() {
        const csvText = sessionStorage.getItem(SessionKeys.smoker);
        const dataObject = Papa.parse(csvText).data;
        const yearStart = 1964, yearEnd = 2015, yearCount = yearEnd - yearStart + 1;
        const rowStart = 1, columnStart = 1;

        /**
         * @memberOf {Page1Data}
         * @type {{[year]: Array<{year: number, country: number, value: number}>}}
         */
        const list = this.smokers = Object.create(null);
        for (let i = yearStart; i <= yearEnd; ++i) {
            list[i] = [];
        }

        const COUNTRY_COUNT = 4;
        for (let i = rowStart; i < rowStart + COUNTRY_COUNT; ++i) {
            const country = dataObject[i][0];
            for (let j = columnStart; j < columnStart + yearCount; ++j) {
                if (dataObject[i][j].length <= 0) {
                    continue;
                }
                const val = Number(dataObject[i][j]);
                /**
                 * @type {{year: number, country: number, value: number}}
                 */
                const o = Object.create(null);
                o.country = country;
                o.year = j - columnStart + yearStart;
                o.value = val;
                list[o.year].push(o);
            }
        }
    }

    /**
     * @memberOf {Page1Data}
     * @private
     */
    __computeObesityData() {
        const obesityText = sessionStorage.getItem(SessionKeys.europeObesity);
        const obesityObject = Papa.parse(obesityText).data;
        const yearStart = 1979, yearEnd = 2015, yearCount = yearEnd - yearStart + 1;
        const rowStart = 1, columnStart = 1;

        /**
         * @memberOf {Page1Data}
         * @type {{[year]: Array<{country: string, year: number, value: number}>}}
         */
        const list = this.europeObesity = Object.create(null);
        for (let i = yearStart; i <= yearEnd; ++i) {
            list[i] = [];
        }
        for (let i = rowStart; i < obesityObject.length - 1; ++i) {
            const o = obesityObject[i];
            const country = o[0];
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
     * @memberOf {Page1Data}
     * @private
     */
    __computeCountryCodeData() {
        const countryCodeText = sessionStorage.getItem(SessionKeys.countryCode);
        const countryCodeObject = Papa.parse(countryCodeText).data;
        /**
         * {Country: Code}
         * @memberOf {Page1Data}
         * @type {{[countryName]: string}}
         */
        const map = this.countryCodeMap = Object.create(null);
        for (let i = 1; i < countryCodeObject.length - 1; ++i) {
            const o = countryCodeObject[i];
            map[o[0]] = o[1];
        }
    }

    /**
     * @memberOf {Page1Data}
     * @private
     */
    __computeWorldObesityData() {
        const obesityText = sessionStorage.getItem(SessionKeys.ourObesity);
        const obesityObject = Papa.parse(obesityText).data;
        const yearStart = 1995, yearEnd = 2014, yearCount = yearEnd - yearStart + 1;
        const rowStart = 1, columnStart = 1;

        /**
         * @memberOf {Page1Data}
         * @type {{[year]: Array<{country: string, year: number, value: number}>}}
         */
        const list = this.worldObesity = Object.create(null);
        for (let i = yearStart; i <= yearEnd; ++i) {
            list[i] = [];
        }
        for (let i = rowStart; i < obesityObject.length - 1; ++i) {
            const o = obesityObject[i];
            const country = o[0];
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

}
