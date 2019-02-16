import { List } from "immutable";
import { Coordinates, Hop } from "./coordinates";
declare type Route = [Coordinates, Coordinates];
interface IRoute {
    start: Coordinates;
    destination: Coordinates;
    score: number;
    hops: List<Hop>;
}
declare class RouteCalculator {
    readonly galacticHops: Hop[];
    readonly maxJumpRange: number;
    readonly jumpEfficiency: number;
    protected readonly waypointPenalty = 4;
    protected readonly adjacentPenalty = 1;
    protected routesConsideredCounter: number;
    constructor(galacticHops: Hop[], maxJumpRange?: number, jumpEfficiency?: number);
    readonly routesConsidered: number;
    closestByExit(target: Coordinates): Hop[];
    isSameRegion(a: Coordinates, b: Coordinates): boolean;
    isSameStar(a: Coordinates, b: Coordinates): boolean;
    isAdjacentRegion(a: Coordinates, b: Coordinates): boolean;
    convertHopsToRoutes(start: Coordinates, destination: Coordinates, hops: List<Hop>): List<Route>;
    calcExpectedJumps(a: Coordinates, b: Coordinates): number;
    calculateScore(start: Coordinates, destination: Coordinates, hops: List<Hop>): number;
    calculateRunningScore(destination: Coordinates, hops: List<Hop>): number;
    findRoute(start: Coordinates, destination: Coordinates): IRoute;
    protected recFindRoute(start: Coordinates, destination: Coordinates, hops: List<Hop>, bestScore: number): IRoute;
}
export { RouteCalculator, Route, IRoute };
//# sourceMappingURL=routecalculator.d.ts.map