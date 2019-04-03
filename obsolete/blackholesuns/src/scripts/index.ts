import { List } from "immutable";
import { coordinates, Platform } from "./bh/coordinates";
import { RouteCalculator } from "./bh/routecalculator";
import { TripAdvisor, IEndPoint } from "./bh/tripadvisor";
import { validHops } from "./bh/utils";

console.log("--------------------------- GOT HERE -----------------------------------------------");
console.log(`LIST WORKS! ${List([1, 2, 3])}`);

const platform = Platform.PC;
const galaxy = "10 Eissentam";

const allHops = validHops()
    .filter(hop => hop.platform === platform)
    .filter(hop => hop.galaxy === galaxy);

document.addEventListener("DOMContentLoaded", () => {
    console.log("CONTENT LOADED");

    const routeButton = document.getElementById("find-route") as HTMLButtonElement;

    routeButton.addEventListener(
        "click",
        (ev: MouseEvent): boolean => {
            console.log("CLICK!!!2");
            const startInput = document.getElementById("start") as HTMLInputElement;
            const destInput = document.getElementById("destination") as HTMLInputElement;

            const start = coordinates(startInput.value);
            const dest = coordinates(destInput.value);

            console.log(`${start}, ${dest}`);

            const rc = new RouteCalculator(allHops);

            const best: TripAdvisor = List([start])
                .map((start, index) => {
                    return new TripAdvisor(rc, { label: `START[${index + 1}]`, coords: start }, { label: "DESTINATION", coords: dest });
                })
                .minBy(ta => {
                    return ta.route().score;
                })!;

            function message(a: IEndPoint, b: IEndPoint): string {
                if (rc.isSameStar(a.coords, b.coords)) {
                    return "These are the same star!";
                } else if (rc.isSameRegion(a.coords, b.coords)) {
                    return "Stars are in the same region.";
                } else if (rc.isAdjacentRegion(a.coords, b.coords)) {
                    if (b.coords.y - a.coords.y > 0) {
                        return `Adjacent region, above current location.`;
                    } else if (b.coords.y - a.coords.y < 0) {
                        return `Adjacent region, below current location.`;
                    } else {
                        return `Adjacent region, same level as current location.`;
                    }
                } else {
                    const distance = Math.floor(a.coords.dist2(b.coords) * 400);
                    const expectedJumps = rc.calcExpectedJumps(a.coords, b.coords);

                    return `About ${distance} LY, or ${expectedJumps} jumps, away.`;
                }
            }

            const journeys = best
                .journeys()
                .map((journey, i) => {
                    return `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${journey.start.label}</td><td>${journey.start.coords.toString()}</td>
                        <td>${journey.end.label}</td><td>${journey.end.coords.toString()}</td>
                        <td>${message(journey.start, journey.end)}</td>
                    </tr>
                    `;
                })
                .join("\n");

            const markup = `
                <table class="pure-table">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th colspan=2>Beginning/Exit</th>
                            <th colspan=2>Black&nbsp;Hole</th>
                            <th>Directions</th>
                        </tr>
                        <tr>
                            <th>&nbsp</th>
                            <th>Name</th><th>Coordinates</th>
                            <th>Name</th><th>Coordinates</th>
                            <th>&nbsp</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${journeys}
                    </tbody>
                </table>
            `;

            (document.getElementById("results") as HTMLDivElement).innerHTML = markup;

            best.explain();

            return true;
        }
    );
});
