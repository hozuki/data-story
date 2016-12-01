"use strict";

(function main() {
    var csvReader = new DsCsvReader();
    var mapBuilder = new DsMapBuilder();
    csvReader.read(mapBuilder.buildMap.bind(mapBuilder));
})();
