"use strict";

/**
 * @class
 */
const DsUtils = (function () {
    /**
     * @constructor
     */
    function DsUtils() {
    }

    /**
     * @static
     * @param value {Number}
     * @param minBoundary {Number}
     * @param maxBoundary {Number}
     * @returns {Number}
     */
    DsUtils.limit = function (value, minBoundary, maxBoundary) {
        if (value < minBoundary) {
            return minBoundary;
        } else if (value > maxBoundary) {
            return maxBoundary;
        } else {
            return value;
        }
    };

    /**
     * @static
     * @param fromColor
     * @param toColor
     * @param percent
     */
    DsUtils.alphaBlend = function (fromColor, toColor, percent) {
        const c1 = DsUtils.decomposeRgb(fromColor);
        const c2 = DsUtils.decomposeRgb(toColor);
        const r = (1 - percent) * c1.r + percent * c2.r;
        const g = (1 - percent) * c1.g + percent * c2.g;
        const b = (1 - percent) * c1.b + percent * c2.b;
        return DsUtils.composeRgb(r, g, b);
    };

    /**
     * @static
     * @param r
     * @param g
     * @param b
     * @returns {Number}
     */
    DsUtils.composeRgb = function (r, g, b) {
        return (r << 16) | (g << 8) | (b | 0);
    };

    /**
     *
     * @param color {Number}
     * @returns {{r: Number, g: Number, b: Number}}
     */
    DsUtils.decomposeRgb = function (color) {
        const r = (color >> 16) & 0xff, g = (color >> 8) & 0xff, b = (color >> 0) & 0xff;
        return {r: r, g: g, b: b};
    };

    return DsUtils;
})();
