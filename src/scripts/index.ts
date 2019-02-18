import { List } from "immutable";
import { coordinates, Platform } from "./bh/coordinates";
import { RouteCalculator } from "./bh/routecalculator";
import { TripAdvisor } from "./bh/tripadvisor";
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

            const best: TripAdvisor = List([start])
                .map((start, index) => {
                    return new TripAdvisor(
                        new RouteCalculator(allHops),
                        { label: `START[${index + 1}]`, coords: start },
                        { label: "DESTINATION", coords: dest }
                    );
                })
                .minBy(ta => {
                    return ta.route().score;
                })!;

            best.explain();

            return true;
        }
    );
});
