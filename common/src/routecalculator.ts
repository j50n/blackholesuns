import { List } from "immutable";
import { Coordinates, Hop } from "./coordinates";
import { mapSeries } from "p-iteration";
import { ITripStatus, CancelledError } from "./tripstatus";

type Route = [Coordinates, Coordinates];

interface IRoute {
    start: Coordinates;
    destination: Coordinates;
    score: number;
    hops: List<Hop>;
}

interface ISearchBounds {
    width: number;
    depth: number;
}

class Decoupler {
    private lastTime: number = new Date().getTime();

    public decouple<T>(fn: () => T): Promise<T> {
        const now = new Date().getTime();

        if (now >= this.lastTime + 60) {
            this.lastTime = now;
            return new Promise(function(resolve, reject) {
                setTimeout(() => {
                    try {
                        resolve(fn());
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            });
        } else {
            try {
                return Promise.resolve(fn());
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
}

function routeCalculator(
    galacticHops: Hop[],
    maxJumpRange: number,
    jumpEfficiency: number = 0.95
): (status: ITripStatus, bounds: ISearchBounds) => RouteCalculator {
    return function(status: ITripStatus, bounds: ISearchBounds) {
        return new RouteCalculator(galacticHops, status, maxJumpRange, jumpEfficiency, bounds);
    };
}

/**
 * Calculate best route using black-holes based on lowest trip difficulty.
 */
class RouteCalculator {
    protected readonly waypointPenalty = 4;

    protected readonly adjacentPenalty = 1;

    protected routesConsideredCounter = 0;

    protected readonly decoupler = new Decoupler();

    constructor(
        public readonly galacticHops: Hop[],
        public readonly status: ITripStatus,
        public readonly maxJumpRange: number = 2000,
        public readonly jumpEfficiency: number = 0.95,
        public readonly search: ISearchBounds = { width: 10, depth: 10 }
    ) {}

    public get routesConsidered(): number {
        return this.routesConsideredCounter;
    }

    /**
     * Find the closest stars to the target system, limiting the search to 200,000 ly.
     * @param target The target system.
     */
    public closestByExit(target: Coordinates): Hop[] {
        type DistTuple = [number, Hop];
        const hs: DistTuple[] = this.galacticHops
            .filter(h => Math.abs(target.x - h.exit.coords.x) < 200000 / 400 && Math.abs(target.z - h.exit.coords.z) < 200000 / 400)
            .map(h => [target.dist2Sq(h.exit.coords), h] as DistTuple);
        return hs.sort((a, b) => a[0] - b[0]).map(a => a[1]);
    }

    public isSameRegion(a: Coordinates, b: Coordinates): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }

    public isSameStar(a: Coordinates, b: Coordinates): boolean {
        return this.isSameRegion(a, b) && a.system === b.system;
    }

    public isAdjacentRegion(a: Coordinates, b: Coordinates): boolean {
        return Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1 && Math.abs(a.z - b.z) <= 1;
    }

    public convertHopsToRoutes(start: Coordinates, destination: Coordinates, hops: List<Hop>): List<Route> {
        const exits = List(hops.map(hop => hop.exit.coords)).unshift(start);
        const bhs = List(hops.map(hop => hop.blackhole.coords)).push(destination);

        return exits.zip(bhs);
    }

    /**
     * Number of jumps to get from point A to point B.
     * @param a First point.
     * @param b Second point.
     * @returns Integral number of jumps, rounded up.
     */
    public calcExpectedJumps(a: Coordinates, b: Coordinates): number {
        const result = Math.ceil((a.dist2(b) * 400) / (this.jumpEfficiency * this.maxJumpRange));

        if (result === 0) {
            if (this.isSameStar(a, b)) {
                return 0;
            } else {
                return 1;
            }
        } else {
            return result;
        }
    }

    public calculateScore(start: Coordinates, destination: Coordinates, hops: List<Hop>): number {
        const scores = this.convertHopsToRoutes(start, destination, hops).map(jump => {
            const [a, b] = jump;
            if (this.isSameStar(a, b)) {
                return 0;
            } else if (this.isSameRegion(a, b) && b.system === 0x79) {
                return 1;
            } else if (this.isAdjacentRegion(a, b) && b.system === 0x79) {
                return 1 + this.adjacentPenalty;
            } else {
                return this.calcExpectedJumps(a, b) + this.waypointPenalty;
            }
        });

        return scores.reduce((a, b) => a + b, 0) + hops.size;
    }

    public calculateRunningScore(destination: Coordinates, hops: List<Hop>): number {
        let start: Coordinates = destination;
        if (!hops.isEmpty()) {
            start = (hops.first() as Hop).blackhole.coords;
        }

        return this.calculateScore(start, destination, hops);
    }

    public async findRoute(start: Coordinates, destination: Coordinates, bestScore: number = 99999): Promise<IRoute> {
        this.routesConsideredCounter = 0;

        return await this.decoupler.decouple(() => {
            return this.recFindRoute(start, destination, List<Hop>(), bestScore);
        });
    }

    protected async recFindRoute(start: Coordinates, destination: Coordinates, hops: List<Hop>, bestScore: number): Promise<IRoute> {
        this.status.tries += 1;
        if (this.status.cancelled === true) {
            throw new CancelledError("operation cancelled 1");
        }

        this.routesConsideredCounter += 1;

        const current: IRoute = {
            destination,
            hops,
            score: this.calculateScore(start, destination, hops),
            start,
        };

        let bs = Math.min(bestScore, current.score);

        if (hops.size < this.search.depth && this.calculateRunningScore(destination, hops) < bs) {
            const closest: Hop[] = (() => {
                let dest = destination;
                if (!hops.isEmpty()) {
                    dest = (hops.first() as Hop).blackhole.coords;
                }
                return this.closestByExit(dest).slice(0, this.search.width);
            })();

            const potentialRoutes: IRoute[] = await mapSeries(
                closest,
                async (hop: Hop): Promise<IRoute> => {
                    const result: IRoute = await this.decoupler.decouple(() => {
                        return this.recFindRoute(start, destination, hops.unshift(hop), bs);
                    });
                    bs = Math.min(bs, result.score);
                    return result;
                }
            );

            return List(potentialRoutes)
                .push(current)
                .minBy(r => r.score)!;
        } else {
            return current;
        }
    }
}

export { routeCalculator, RouteCalculator, Route, IRoute, ISearchBounds };
