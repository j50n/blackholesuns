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

/*
 * First two searches together take about 30 seconds if there is not an okay solution to be found.
 * If there is not an okay solution, then the best solution is almost certainly going to be a bad
 * solution in any case.
 *
 * If we find an "okay" solution in the first two, then that will limit the search space of the
 * remaining bounds so that we can attempt what look like enormous searches without taking too much
 * time.
 *
 * Bottom line: If we find an okay solution early, we can find the best solution. If we don't find
 * an okay solution early, we can't find the best solution - but the best solution is going to be
 * a very bad solution regardless.
 *
 * Why? Black hole travel takes you 6,200LY toward center on average, but this takes 2 jumps. So
 * really you are getting 3,100LY per jump if you are chaining black holes. The best hyperdrives can
 * get you 2,900LY per jump. Moving toward or away from center is about the same cost whether you
 * user hyperdrive or black holes. Going *around* center can be much more efficient using black
 * holes - if you know which ones to take.
 *
 * This is why start needs to be near (just outside of) the destination for these trips. That is
 * what makes for a path that can be optimized.
 */
const DefaultBounds: ISearchBounds[] = [
    searchBounds(10, 6), // 100,000
    searchBounds(4, 10), // about 100,000
    searchBounds(8, 10, 70), // progress to 10 billion - limit 100
    searchBounds(10, 8, 70), // 20 ^^ 30 - limit 75
    //searchBounds(20, 20, ), // 40 ^^ 50 - wider with limit of 50
];

function hops4Route(route: IRoute): List<IEndPoint> {
    return route.hops.flatMap(hop => [hop.blackhole, hop.exit]) as List<IEndPoint>;
}

function journey(start: IEndPoint, dest: IEndPoint, hops: List<IEndPoint>): List<[IEndPoint, IEndPoint]> {
    const systems: List<IEndPoint> = hops.unshift(start).push(dest);

    const left = systems.filter((v, i) => {
        return i % 2 === 0;
    });

    const right = systems.filter((v, i) => {
        return i % 2 === 1;
    });

    return left.zip(right);
}

function logJourney(jumps: List<[IEndPoint, IEndPoint]>, rc: RouteCalculator) {
    function desc(endpoint: IEndPoint): string {
        if (endpoint.coords.system === 0x79) {
            return `[BH] ${endpoint.label} (${endpoint.coords})`;
        } else {
            return `${endpoint.label} (${endpoint.coords})`;
        }
    }

    jumps.forEach((jump, i) => {
        const a = jump[0];
        const b = jump[1];

        if (rc.isSameStar(a.coords, b.coords)) {
            console.log(`${i}. ${desc(a)} and ${desc(b)} are the same star!`);
        } else if (rc.isSameRegion(a.coords, b.coords)) {
            console.log(`${i}. ${desc(a)} -> ${desc(b)} Same region.`);
        } else if (rc.isAdjacentRegion(a.coords, b.coords)) {
            if (b.coords.y - a.coords.y > 0) {
                console.log(`${i}. ${desc(a)} -> ${desc(b)} Adjacent region, above current location.`);
            } else if (b.coords.y - a.coords.y < 0) {
                console.log(`${i}. ${desc(a)} -> ${desc(b)} Adjacent region, below current location.`);
            } else {
                console.log(`${i}. ${desc(a)} -> ${desc(b)} Adjacent region, same level as current location.`);
            }
        } else {
            const distance = Math.floor(a.coords.dist2(b.coords) * 400);
            const expectedJumps = rc.calcExpectedJumps(a.coords, b.coords);
            console.log(`${i}. ${desc(a)} -> ${desc(b)} About ${distance} LY, or ${expectedJumps} jumps, away.`);
        }
    });
}

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

        const jumps = journey(this.start, this.destination, hops4Route(await this.route()));

        logJourney(jumps, this.rc(this.status, searchBounds(0, 0)));
    }

    public async explanation(): Promise<Explanation> {
        return new Explanation(
            this.rc({ cancelled: false, tries: 0 }, searchBounds(0, 0)),
            journey(this.start, this.destination, hops4Route(await this.route()))
        );
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
                    description: `About ${distance.toLocaleString()} LY, or ${expectedJumps} jumps, away.`,
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

export { TripAdvisor, IEndPoint, Explanation, ILegOfJourney, logJourney, journey, hops4Route };
