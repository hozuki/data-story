"use strict";

/**
 * @class
 */
const DsCsvReader = (function () {
    /**
     * @constructor
     */
    function DsCsvReader() {
    }

    /**
     * @static
     * @memberOf {DsCsvReader}
     * @param callback {function (err: *, data: *[]):void}
     */
    DsCsvReader.prototype.read = function (callback) {
        d3
            .csv(DsCsvReader.CSV_PATH)
            .row(function (dataObject) {
                const r = Object.create(null);
                const keys = Object.keys(dataObject);
                for (var i = 0; i < keys.length; ++i) {
                    const key = keys[i];
                    const mappedIndex = DsCsvReader.RowHeaderMap.indexOf(key);
                    if (dataObject[key].length > 0) {
                        const numericValue = +dataObject[key];
                        if (Number.isNaN(numericValue)) {
                            r[mappedIndex] = dataObject[key];
                        } else {
                            r[mappedIndex] = numericValue;
                        }
                    } else {
                        r[mappedIndex] = null;
                    }
                }
                return r;
            })
            .get(callback);
    };

    /**
     * @readonly
     * @type {[*]}
     */
    DsCsvReader.RowHeaderMap = [
        "country",
        "code",
        "Mean of crude est. all genders BMI > 25, year 2010",
        "Mean of crude est. all genders BMI > 30, year 2010",
        "Mean of crude est. all genders insufficient physical activity, year 2010",
        "Value of alcohol consumption, all types, year 2010, in litres of pure alcohol",
        "Mean of crude est. male smoking prevalence, year 2010",
        "Mean of crude est. female smoking prevalence, year 2010",
        "Density per 1M population: health posts, year 2010",
        "Density per 1M population: health centres, year 2010",
        "Density per 1M population: district/rural hospitals, year 2010",
        "Density per 1M population: provincial hospitals, year 2010",
        "Density per 1M population: specialized hospitals, year 2010"
    ];

    /**
     * @const
     * @type {String}
     */
    DsCsvReader.CSV_PATH = "../datasheets-essence-nov29.csv";

    return DsCsvReader;
})();
