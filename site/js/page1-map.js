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
        this.svg = d3.select("#div-world-map")
            .append("svg")
            .attr("id", "svg-world-map")
            .attr("class", "expand-all absolute");
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
    }

    /**
     * @memberOf {Page1Map}
     * @param countryCode
     */
    toggleCountry(countryCode) {

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

}
