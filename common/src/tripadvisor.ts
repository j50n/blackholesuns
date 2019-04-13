import { RouteCalculator, IRoute, ISearchBounds, searchBounds } from "./routecalculator";
import { Coordinates } from "./coordinates";
import { ITripStatus, CancelledError } from "./tripstatus";
import { lazily } from "./utils";
import { List } from "immutable";

interface IEndPoint {
    label: string;
    coords: Coordinates;
}

interface ILegOfJourney {
    index: number;
    start: IEndPoint;
    dest: IEndPoint;
    description: string;
}

const DefaultBounds: ISearchBounds[] = [searchBounds(10, 6), searchBounds(4, 12), searchBounds(64, 3), searchBounds(40, 75, 75)];

class TripAdvisor {
    constructor(
        public readonly rc: (status: ITripStatus, bounds: ISearchBounds) => RouteCalculator,
        public readonly start: IEndPoint,
        public readonly destination: IEndPoint,
        public readonly status: ITripStatus,
        public readonly bounds: ISearchBounds[] = DefaultBounds
    ) {}

    /**
     * True if this trip-advisor has a resolved route.
     */
    public hasRoute: boolean = false;

    /**
     * The best route. This can take a long time to complete, but it will not block the browser.
     */
    public route: () => Promise<IRoute> = lazily(async () => {
        try {
            let bestRoute = await this.rc(this.status, searchBounds(0, 0)).findRoute(this.start.coords, this.destination.coords, 9999999);

            for (const bound of this.bounds) {
                if (bound.ifScore === null || bound.ifScore > bestRoute.score) {
                    console.log(`calculating route with bounds width=${bound.width} and depth=${bound.depth}; best so far is ${bestRoute.score}.`);
                    const route = await this.rc(this.status, bound).findRoute(this.start.coords, this.destination.coords, bestRoute.score);
                    if (route.score < bestRoute.score) {
                        bestRoute = route;
                    }
                }
            }
            return bestRoute;
        } finally {
            this.hasRoute = true;
        }
    });

    public async getScore(): Promise<number> {
        return (await this.route()).score;
    }

    public desc(endpoint: IEndPoint): string {
        if (endpoint.coords.system === 0x79) {
            return `[BH] ${endpoint.label} (${endpoint.coords})`;
        } else {
            return `${endpoint.label} (${endpoint.coords})`;
        }
    }

    public async explain(): Promise<void> {
        if (this.status.cancelled === true) {
            throw new CancelledError("operation cancelled 2");
        }

        const radialDist = Math.floor(Math.abs(this.start.coords.dist - this.destination.coords.dist) * 400);

        if (radialDist > 20000) {
            const startDist = Math.floor(this.start.coords.dist * 400);
            const destDist = Math.floor(this.destination.coords.dist * 400);

            console.log(
                `Start is ${startDist} LY from center. Destination is ${destDist} from center.` +
                    `For best results, start and destination should be about the same distance from center.`
            );
        }

        console.log(`Difficulty is ${(await this.route()).score}.`);

        if ((await this.route()).score > 120) {
            console.log(`WARNING! High difficulty. You may want to explore other starting points or use another strategy.`);
        }

        console.log();

        // const systems: List<IEndPoint> = ((await this.route()).hops.flatMap(hop => [hop.blackhole, hop.exit]) as List<IEndPoint>)
        //     .unshift(this.start)
        //     .push(this.destination);

        // const left = systems.filter((v, i) => {
        //     return i % 2 === 0;
        // });

        // const right = systems.filter((v, i) => {
        //     return i % 2 === 1;
        // });

        const jumps = await this.journey();

        jumps.forEach((jump, i) => {
            const a = jump[0];
            const b = jump[1];

            const rc = this.rc(this.status, searchBounds(0, 0));

            if (rc.isSameStar(a.coords, b.coords)) {
                console.log(`${i}. ${this.desc(a)} and ${this.desc(b)} are the same star!`);
            } else if (rc.isSameRegion(a.coords, b.coords)) {
                console.log(`${i}. ${this.desc(a)} -> ${this.desc(b)} Same region.`);
            } else if (rc.isAdjacentRegion(a.coords, b.coords)) {
                if (b.coords.y - a.coords.y > 0) {
                    console.log(`${i}. ${this.desc(a)} -> ${this.desc(b)} Adjacent region, above current location.`);
                } else if (b.coords.y - a.coords.y < 0) {
                    console.log(`${i}. ${this.desc(a)} -> ${this.desc(b)} Adjacent region, below current location.`);
                } else {
                    console.log(`${i}. ${this.desc(a)} -> ${this.desc(b)} Adjacent region, same level as current location.`);
                }
            } else {
                const distance = Math.floor(a.coords.dist2(b.coords) * 400);
                const expectedJumps = rc.calcExpectedJumps(a.coords, b.coords);
                console.log(`${i}. ${this.desc(a)} -> ${this.desc(b)} About ${distance} LY, or ${expectedJumps} jumps, away.`);
            }
        });
    }

    private async journey(): Promise<List<[IEndPoint, IEndPoint]>> {
        const systems: List<IEndPoint> = ((await this.route()).hops.flatMap(hop => [hop.blackhole, hop.exit]) as List<IEndPoint>)
            .unshift(this.start)
            .push(this.destination);

        const left = systems.filter((v, i) => {
            return i % 2 === 0;
        });

        const right = systems.filter((v, i) => {
            return i % 2 === 1;
        });

        return left.zip(right);
    }

    public async explanation(): Promise<Explanation> {
        return new Explanation(this.rc({ cancelled: false, tries: 0 }, searchBounds(0, 0)), await this.journey());
    }
}

class Explanation {
    constructor(public readonly rc: RouteCalculator, public readonly journey: List<[IEndPoint, IEndPoint]>) {}

    public legs(): List<ILegOfJourney> {
        return this.journey.map((leg, i) => {
            const [a, b] = leg;

            if (this.rc.isSameStar(a.coords, b.coords)) {
                return { index: i, start: a, dest: b, description: `Same star!` };
            } else if (this.rc.isSameRegion(a.coords, b.coords)) {
                return { index: i, start: a, dest: b, description: `Same region.` };
            } else if (this.rc.isAdjacentRegion(a.coords, b.coords)) {
                if (b.coords.y - a.coords.y > 0) {
                    return { index: i, start: a, dest: b, description: `Adjacent region, above current location.` };
                } else if (b.coords.y - a.coords.y < 0) {
                    return { index: i, start: a, dest: b, description: `Adjacent region, below current location.` };
                } else {
                    return {
                        index: i,
                        start: a,
                        dest: b,
                        description: `Adjacent region, same level as current location.`,
                    };
                }
            } else {
                const distance = Math.floor(a.coords.dist2(b.coords) * 400);
                const expectedJumps = this.rc.calcExpectedJumps(a.coords, b.coords);
                return {
                    index: i,
                    start: a,
                    dest: b,
                    description: `About ${distance} LY, or ${expectedJumps} jumps, away.`,
                };
            }
        });
    }

    public desc(endpoint: IEndPoint): string {
        if (endpoint.coords.system === 0x79) {
            return `${endpoint.label}`; // (${endpoint.coords})`;
        } else {
            return `${endpoint.label}`; // (${endpoint.coords})`;
        }
    }
}

export { TripAdvisor, IEndPoint, Explanation, ILegOfJourney };
