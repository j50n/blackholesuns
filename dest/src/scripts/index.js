"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const coordinates_1 = require("./bh/coordinates");
const routecalculator_1 = require("./bh/routecalculator");
const tripadvisor_1 = require("./bh/tripadvisor");
const utils_1 = require("./bh/utils");
console.log("--------------------------- GOT HERE -----------------------------------------------");
console.log(`LIST WORKS! ${immutable_1.List([1, 2, 3])}`);
const platform = coordinates_1.Platform.PC;
const galaxy = "10 Eissentam";
const allHops = utils_1.validHops()
    .filter(hop => hop.platform === platform)
    .filter(hop => hop.galaxy === galaxy);
document.addEventListener("DOMContentLoaded", () => {
    console.log("CONTENT LOADED");
    const routeButton = document.getElementById("find-route");
    routeButton.addEventListener("click", (ev) => {
        console.log("CLICK!!!2");
        const startInput = document.getElementById("start");
        const destInput = document.getElementById("destination");
        const start = coordinates_1.coordinates(startInput.value);
        const dest = coordinates_1.coordinates(destInput.value);
        console.log(`${start}, ${dest}`);
        const best = immutable_1.List([start])
            .map((start, index) => {
            return new tripadvisor_1.TripAdvisor(new routecalculator_1.RouteCalculator(allHops), { label: `START[${index + 1}]`, coords: start }, { label: "DESTINATION", coords: dest });
        })
            .minBy(ta => {
            return ta.route().score;
        });
        const journeys = best
            .journeys()
            .map((journey, i) => {
            return `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${journey.start.label}</td>
                        <td>${journey.end.label}</td>
                        <td>&nbsp;</td>
                    </tr>
                    `;
        })
            .join("\n");
        const markup = `
                <table class="pure-table">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Black&nbsp;Hole</th>
                            <th>Exit</th>
                            <th>Directions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${journeys}
                    </tbody>
                </table>
            `;
        document.getElementById("results").innerHTML = markup;
        best.explain();
        return true;
    });
});
//# sourceMappingURL=index.js.map