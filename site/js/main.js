"use strict";

/**
 * @class
 */
const Main = (function () {
    /**
     * @constructor
     */
    function Main() {
        /**
         * @type {DsCsvReader}
         * @instance
         * @memberOf {Main}
         */
        this.csvReader = new DsCsvReader();
        /**
         * @type {DsMapBuilder}
         * @instance
         * @memberOf {Main}
         */
        this.mapBuilder = new DsMapBuilder();
    }

    Main.prototype.init = function () {
        const thiz = this;
        var promise = new Promise(function (resolve, reject) {
            thiz.csvReader.read(function (err, data) {
                thiz.mapBuilder.prepareMap.call(thiz.mapBuilder, err, data);
                thiz.mapBuilder.buildMap();
            });
            resolve();
        });
        promise.then(function () {
            console.log("Registering event handlers");
            EventHandlers.registerAll();
        });
    };

    return Main;
})();

const main = new Main();
main.init();
