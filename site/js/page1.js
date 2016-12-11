"use strict";

const G = {
    /**
     * @type {Page1Map}
     */
    map: null
};

function main() {
    const data = new Page1Data();
    G.map = new Page1Map(data);
    G.map.build();
}

document.body.onload = main;
