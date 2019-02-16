import { RouteCalculator, IRoute } from "./routecalculator";
import { Coordinates } from "./coordinates";
interface IEndPoint {
    label: string;
    coords: Coordinates;
}
declare class TripAdvisor {
    rc: RouteCalculator;
    start: IEndPoint;
    destination: IEndPoint;
    route: () => IRoute;
    constructor(rc: RouteCalculator, start: IEndPoint, destination: IEndPoint);
    readonly score: number;
    desc(endpoint: IEndPoint): string;
    explain(): void;
}
export { TripAdvisor, IEndPoint };
//# sourceMappingURL=tripadvisor.d.ts.map