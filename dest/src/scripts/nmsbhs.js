"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const immutable_1 = require("immutable");
const coordinates_1 = require("./bh/coordinates");
const routecalculator_1 = require("./bh/routecalculator");
const tripadvisor_1 = require("./bh/tripadvisor");
const utils_1 = require("./bh/utils");
const platform = coordinates_1.Platform.PC;
const galaxy = "10 Eissentam";
console.log(`PLATFORM: ${platform}`);
console.log(`GALAXY: ${galaxy}`);
const allHops = utils_1.validHops()
    .filter(hop => hop.platform === platform)
    .filter(hop => hop.galaxy === galaxy);
console.log(`MATCHED HOPS: ${allHops.length}`);
commander_1.default
    .command("jumps")
    .option("-s, --start [value]", "start coordinates", coordinates_1.coordinates)
    .option("-d, --destination [value]", "destination coordinates", coordinates_1.coordinates)
    .action((options) => {
    const rc = new routecalculator_1.RouteCalculator(allHops);
    console.log(`jumps is ${rc.calcExpectedJumps(options.start, options.destination)}`);
    console.log(`distance is ${Math.floor(options.start.dist2(options.destination) * 400)} LY`);
});
commander_1.default
    .command("route")
    .option("-s, --start <items>", "start coordinates", args => args.split(",").map(coordinates_1.coordinates))
    .option("-d, --destination [value]", "destination coordinates", coordinates_1.coordinates)
    .action((options) => {
    const best = immutable_1.List(options.start)
        .map((start, index) => {
        return new tripadvisor_1.TripAdvisor(new routecalculator_1.RouteCalculator(allHops), { label: `START[${index + 1}]`, coords: start }, { label: "DESTINATION", coords: options.destination });
    })
        .minBy(ta => {
        return ta.route().score;
    });
    best.explain();
});
commander_1.default.parse(process.argv);
//# sourceMappingURL=nmsbhs.js.map