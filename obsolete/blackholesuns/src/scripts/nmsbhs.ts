import commander from "commander";
import { List } from "immutable";
import { coordinates, Coordinates, Platform } from "./bh/coordinates";
import { RouteCalculator } from "./bh/routecalculator";
import { TripAdvisor } from "./bh/tripadvisor";
import { validHops } from "./bh/utils";

interface IRouteOptions {
    start: Coordinates[];
    destination: Coordinates;
}

interface IJumpsOptions {
    start: Coordinates;
    destination: Coordinates;
}

const platform = Platform.PC;
const galaxy = "10 Eissentam";

console.log(`PLATFORM: ${platform}`);
console.log(`GALAXY: ${galaxy}`);

const allHops = validHops()
    .filter(hop => hop.platform === platform)
    .filter(hop => hop.galaxy === galaxy);

console.log(`MATCHED HOPS: ${allHops.length}`);

commander
    .command("jumps")
    .option("-s, --start [value]", "start coordinates", coordinates)
    .option("-d, --destination [value]", "destination coordinates", coordinates)
    .action((options: IJumpsOptions) => {
        const rc = new RouteCalculator(allHops);
        console.log(`jumps is ${rc.calcExpectedJumps(options.start, options.destination)}`);
        console.log(`distance is ${Math.floor(options.start.dist2(options.destination) * 400)} LY`);
    });

commander
    .command("route")
    .option("-s, --start <items>", "start coordinates", args => args.split(",").map(coordinates))
    .option("-d, --destination [value]", "destination coordinates", coordinates)
    .action((options: IRouteOptions) => {
        const best: TripAdvisor = List(options.start)
            .map((start, index) => {
                return new TripAdvisor(
                    new RouteCalculator(allHops),
                    { label: `START[${index + 1}]`, coords: start },
                    { label: "DESTINATION", coords: options.destination }
                );
            })
            .minBy(ta => {
                return ta.route().score;
            })!;

        best.explain();
    });

commander.parse(process.argv);
