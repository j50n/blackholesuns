import TinyQueue from "tinyqueue";
import { Coordinates, Hop, GalacticCenter } from "./coordinates";
import { segmentIntersectsSphere } from "./intersection";

interface IEdge {
    node: number;
    weight: number;
}

interface IPath {
    node: number;
    weight: number;
}

/**
 * Implementation of Dijkstra's Shortest Path algorithm.
 *
 * Nodes are numbered from 0 to n-1.
 *
 * Adapted from https://medium.com/@adriennetjohnson/a-walkthrough-of-dijkstras-algorithm-in-javascript-e94b74192026
 * This has been made more lightweight by treating nodes as an index rather than a string (name). We use `tinyqueue`
 * as our priority queue. All map-likes have been eliminated, but there are still object references in here, so
 * not as fast as possible, but should be fast enough and not too heavy on memory.
 */
class DijkstraShortestPathSolver {
    public adjacencyList: IEdge[][];

    constructor(public nodes: number) {
        this.adjacencyList = new Array(nodes).fill(null).map(v => new Array(0));
    }

    addEdge(fromNode: number, toNode: number, weight: number): void {
        if (weight < 0) {
            throw new RangeError("weight must be >= 0");
        }
        this.adjacencyList[fromNode].push({ node: toNode, weight });
    }

    addBidirEdge(fromNode: number, toNode: number, weight: number): void {
        if (weight < 0) {
            throw new RangeError("weight must be >= 0");
        }
        this.adjacencyList[fromNode].push({ node: toNode, weight });
        this.adjacencyList[toNode].push({ node: fromNode, weight });
    }

    setEdges(node: number, edges: IEdge[]): void {
        this.adjacencyList[node] = edges;
    }

    /**
     * Calculate shortest paths for all nodes for the given start node.
     * @param startNode The start node.
     */
    calculateFor(startNode: number): ShortestPaths {
        const weights: number[] = new Array(this.nodes).fill(Infinity);
        weights[startNode] = 0;

        const pq = new TinyQueue<IPath>([{ node: startNode, weight: 0 }], (a, b) => a.weight - b.weight);

        const backtrace: number[] = new Array(this.nodes).fill(-1);

        while (pq.length !== 0) {
            const shortestStep = pq.pop();
            const currentNode = shortestStep!.node;

            this.adjacencyList[currentNode].forEach(neighbor => {
                const weight = weights[currentNode] + neighbor.weight;

                if (weight < weights[neighbor.node]) {
                    weights[neighbor.node] = weight;
                    backtrace[neighbor.node] = currentNode;
                    pq.push({ node: neighbor.node, weight: weight });
                }
            });
        }

        return new ShortestPaths(startNode, backtrace, weights);
    }
}

class ShortestPaths {
    constructor(public startNode: number, public backtrace: number[], public weights: number[]) {}

    /**
     * Find the shortest path to the given end node.
     * @param endNode The end node.
     */
    shortestPathTo(endNode: number): number[] {
        let path = [endNode];
        let lastStep = endNode;

        while (lastStep != this.startNode) {
            path.unshift(this.backtrace[lastStep]);
            lastStep = this.backtrace[lastStep];
        }

        return path;
    }

    /**
     * Total weight of the path from the start node to the given end node.
     * @param endNode The end node.
     */
    totalWeight(endNode: number): number {
        return this.weights[endNode];
    }
}

interface IRoute {
    start: Coordinates;
    destination: Coordinates;
    score: number;
}

class Route implements IRoute {
    constructor(public readonly score: number, public readonly route: ISystem[]) {}

    public get start(): Coordinates {
        return this.route[0].coords;
    }

    public get destination(): Coordinates {
        return this.route[this.route.length - 1].coords;
    }
}

function isSameRegion(a: Coordinates, b: Coordinates): boolean {
    return a.x === b.x && a.y === b.y && a.z === b.z;
}

function isSameStar(a: Coordinates, b: Coordinates): boolean {
    return isSameRegion(a, b) && a.system === b.system;
}

function isAdjacentRegion(a: Coordinates, b: Coordinates): boolean {
    return Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1 && Math.abs(a.z - b.z) <= 1;
}

/**
 * Number of jumps to get from point A to point B.
 * @param a First point.
 * @param b Second point.
 * @returns Integral number of jumps, rounded up.
 */
function calcExpectedJumps(maxJumpRange: number, a: Coordinates, b: Coordinates): number {
    const result = Math.ceil((a.dist2(b) * 400) / maxJumpRange);

    if (result === 0) {
        if (isSameStar(a, b)) {
            return 0;
        } else {
            return 1;
        }
    } else {
        return result;
    }
}

function dijkstraCalculator(galacticHops: Hop[], maxJumpRange: number, optimization: string): DijkstraCalculator {
    if (optimization === "fuel") {
        return new DijkstraCalculator4Fuel(galacticHops, maxJumpRange);
    } else if (optimization === "time") {
        return new DijkstraCalculator4Time(galacticHops, maxJumpRange);
    } else {
        throw new Error(`unknown optimization value: ${optimization}`);
    }
}

interface ISystem {
    label: string;
    coords: Coordinates;
}

interface ISystemIndex {
    system: ISystem;
    index: number;
    edges: IEdge[];
}

abstract class DijkstraCalculator {
    constructor(public galacticHops: Hop[], public maxJumpRange: number) {}

    abstract blackHoleWeight(): number;

    abstract sameRegionWeight(): number;

    abstract adjacentRegionWeight(): number;

    abstract waypointWeight(): number;

    routeWeight(a: Coordinates, b: Coordinates): number {
        if (isSameStar(a, b)) {
            return 0;
        } else if (isSameRegion(a, b)) {
            return this.sameRegionWeight();
        } else if (isAdjacentRegion(a, b)) {
            return Math.max(this.adjacentRegionWeight(), calcExpectedJumps(this.maxJumpRange, a, b));
        } else {
            return this.waypointWeight() + calcExpectedJumps(this.maxJumpRange, a, b);
        }
    }

    findRoute(starts: ISystem[], destination: ISystem): Route[] {
        /* All nodes; this is the indexed array. */
        const nodes: ISystemIndex[] = [];

        /* Just the black holes. */
        const bhs: ISystemIndex[] = [];
        /* Just the exits. */
        const exits: ISystemIndex[] = [];
        /* Starts/bases. */
        const sts: ISystemIndex[] = [];

        /* Destination. */
        const dest: ISystemIndex = { index: -1, system: destination, edges: [] };

        nodes.push(dest);

        for (const start of starts) {
            const st = { index: -1, system: start, edges: [] };
            nodes.push(st);
            sts.push(st);
        }

        for (const hop of this.galacticHops) {
            const bh = { index: -1, system: hop.blackhole, edges: [] };
            nodes.push(bh);
            bhs.push(bh);
            const bhIndex = nodes.length - 1;

            const ex = { index: -1, system: hop.exit, edges: [{ node: bhIndex, weight: this.blackHoleWeight() }] };
            nodes.push(ex);
            exits.push(ex);
        }

        for (const [i, node] of nodes.entries()) {
            node.index = i;

            /*
             * Edges have minimal non-zero weight.
             * This prevents ties between shorter and longer paths when edge weights can be 0.
             */
            node.edges.forEach(e => {
                if (e.weight == 0) {
                    e.weight += 0.000001;
                }
            });
        }

        for (const bh of bhs) {
            const exitEdges = this.closest(bh.system.coords, exits).map(s => {
                return { node: s.index, weight: this.routeWeight(bh.system.coords, s.system.coords) };
            });

            const stEdges = sts
                .filter(s => !segmentIntersectsSphere(s.system.coords, bh.system.coords, GalacticCenter, 7))
                .map(s => {
                    return { node: s.index, weight: this.routeWeight(bh.system.coords, s.system.coords) };
                });

            bh.edges = exitEdges.concat(stEdges);
        }

        /* Intentional. Edges for starts to dest may pass through center. Avoids a no-answer scenario. */
        dest.edges = exits
            .filter(s => !segmentIntersectsSphere(s.system.coords, dest.system.coords, GalacticCenter, 7))
            .concat(sts)
            .map(s => {
                return { node: s.index, weight: this.routeWeight(dest.system.coords, s.system.coords) };
            });

        const g = new DijkstraShortestPathSolver(nodes.length);
        for (const node of nodes) {
            g.setEdges(node.index, node.edges);
        }

        const shortest = g.calculateFor(dest.index);

        for (const st of sts) {
            console.log(`${JSON.stringify(st.system)} scored ${shortest.totalWeight(st.index)}; ${shortest.shortestPathTo(st.index)}`);
        }

        return sts.map(st => {
            return new Route(
                Math.round(shortest.totalWeight(st.index)),
                shortest
                    .shortestPathTo(st.index)
                    .map(node => nodes[node])
                    .map(node => node.system)
                    .reverse()
            );
        });
    }

    protected maxTravelRangeLY() {
        return 200000;
    }

    protected maxClosest() {
        return 100;
    }

    protected closest(target: Coordinates, systems: ISystemIndex[]): ISystemIndex[] {
        const range = this.maxTravelRangeLY() / 400;

        const syss = systems
            .filter(s => Math.abs(target.x - s.system.coords.x) <= range && Math.abs(target.z - s.system.coords.z) <= range)
            .filter(s => !segmentIntersectsSphere(s.system.coords, target, GalacticCenter, 7))
            .map(s => {
                return {
                    system: s,
                    dist: target.dist2Sq(s.system.coords),
                };
            });

        return syss
            .sort((a, b) => a.dist - b.dist)
            .map(a => a.system)
            .slice(0, this.maxClosest());
    }

    /**
     * Find the closest stars to the target system, limiting the search to 200,000 ly.
     * @param target The target system.
     */
    // protected closestByExit(target: Coordinates): Hop[] {
    //     type DistTuple = [number, Hop];
    //     const hs: DistTuple[] = this.galacticHops
    //         .filter(h => Math.abs(target.x - h.exit.coords.x) < 200000 / 400 && Math.abs(target.z - h.exit.coords.z) < 100000 / 400)
    //         .map(h => [target.dist2Sq(h.exit.coords), h] as DistTuple);
    //     return hs.sort((a, b) => a[0] - b[0]).map(a => a[1]);
    // }
}

class DijkstraCalculator4Time extends DijkstraCalculator {
    constructor(public galacticHops: Hop[], public maxJumpRange: number) {
        super(galacticHops, maxJumpRange);
    }

    blackHoleWeight(): number {
        return 1;
    }

    sameRegionWeight(): number {
        return 1;
    }

    adjacentRegionWeight(): number {
        return 2;
    }

    waypointWeight(): number {
        return 4;
    }
}

class DijkstraCalculator4Fuel extends DijkstraCalculator {
    constructor(public galacticHops: Hop[], public maxJumpRange: number) {
        super(galacticHops, maxJumpRange);
    }

    blackHoleWeight(): number {
        return 0;
    }

    sameRegionWeight(): number {
        return 1;
    }

    adjacentRegionWeight(): number {
        return 1;
    }

    waypointWeight(): number {
        return 0;
    }
}

export { IEdge, ISystem, DijkstraCalculator, dijkstraCalculator, DijkstraShortestPathSolver, isSameRegion, isSameStar, isAdjacentRegion, calcExpectedJumps };
