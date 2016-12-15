# Data Story

Challenge 1 of DBM120 Beautiful Data. (Group 4)

## Prerequisites

There are 2 options to use this project:

1. A browser integrated with NodeJS, e.g. [NW.js](http://nwjs.io/) or [Electron](http://electron.atom.io/);
2. A server where the files are deployed.

**Please don't naively launch the pages by double clicking them.** That does not work. (a little detail:
`file:` protocol, file system security and same-origin policy)

Additionally, the browser must support ECMAScript 2015 in Strict Mode. If you don't know how to choose a
browser that meets this requirement, use Chrome 55 or later. Why? I'm too lazy to write "class-like"
functions in ES5 so I skip to ES2015.

And, if you want to see something from your webcam in Page 3, you have to use a local browser
(listed in option 1) and a server **with HTTPS** (due to origin safety check).

## Project Structure

- `site`: main website
  - `*.html`: pages
  - `js/`: JavaScript source code
    - `common.js`: common script
    - `index.js`, `page1.js`, `page2.js`, `page3.js`: main controller for each page
    - `page1-*.js`, `page2-*.js`: various components
  - `css/`: stylesheets
  - `data/`: datasets
    - `DataSet.xml`: main dataset for the challenge (different from WHO data) with data
                     split into multiple files that can be read more easily

I think the code is quite self-explained.

## Acknowledgements

- [d3.js](https://d3js.org/) for data processing
- [jQuery](http://jquery.com/) (yeah everybody knows this) and [jQuery UI](http://jqueryui.com/) (everybody knows this too)
- [PapaParse](https://github.com/mholt/PapaParse) for CSV parser
- [TopoJSON](https://github.com/topojson/topojson) for converting geographic data (GeoJSON)
- [async](https://github.com/caolan/async) for amazing async function execution
- [bP](http://bl.ocks.org/NPashaP/cd80ab54c52f80c4d84cad0ba9da72c2) (with [Viz](https://github.com/NPashaP/Viz))
  for bP chart

# License

"DESIGNERS" PLEASE READ THIS!

This project can be distributed in [MIT License](LICENSE.md).
