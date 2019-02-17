import { RouteCalculator, IRoute } from "./routecalculator";
import { Coordinates } from "./coordinates";
import { lazily } from "./utils";
import { runInContext } from "vm";
import { List } from "immutable";

interface IEndPoint {
  label: string;
  coords: Coordinates;
}

class TripAdvisor {
  public route: () => IRoute = lazily(() =>
    this.rc.findRoute(this.start.coords, this.destination.coords)
  );

  constructor(
    public rc: RouteCalculator,
    public start: IEndPoint,
    public destination: IEndPoint
  ) {}

  public get score(): number {
    return this.route().score;
  }

  public desc(endpoint: IEndPoint): string {
    if (endpoint.coords.system === 0x79) {
      return `[BH] ${endpoint.label} (${endpoint.coords})`;
    } else {
      return `${endpoint.label} (${endpoint.coords})`;
    }
  }

  public explain(): void {
    const radialDist = Math.floor(
      Math.abs(this.start.coords.dist - this.destination.coords.dist) * 400
    );

    if (radialDist > 20000) {
      const startDist = Math.floor(this.start.coords.dist * 400);
      const destDist = Math.floor(this.destination.coords.dist * 400);

      console.log(
        `Start is ${startDist} LY from center. Destination is ${destDist} from center.` +
          `For best results, start and destination should be about the same distance from center.`
      );
    }

    console.log(`Difficulty is ${this.route().score}.`);

    if (this.route().score > 120) {
      console.log(
        `WARNING! High difficulty. You may want to explore other starting points or use another strategy.`
      );
    }

    console.log();

    const systems: List<IEndPoint> = (this.route().hops.flatMap(hop => [
      hop.blackhole,
      hop.exit
    ]) as List<IEndPoint>)
      .unshift(this.start)
      .push(this.destination);

    const left = systems.filter((v, i) => {
      return i % 2 === 0;
    });

    const right = systems.filter((v, i) => {
      return i % 2 === 1;
    });

    const jumps = left.zip(right);

    jumps.forEach((jump, i) => {
      const a = jump[0];
      const b = jump[1];

      if (this.rc.isSameStar(a.coords, b.coords)) {
        console.log(
          `${i}. ${this.desc(a)} and ${this.desc(b)} are the same star!`
        );
      } else if (this.rc.isSameRegion(a.coords, b.coords)) {
        console.log(`${i}. ${this.desc(a)} -> ${this.desc(b)} Same region.`);
      } else if (this.rc.isAdjacentRegion(a.coords, b.coords)) {
        if (b.coords.y - a.coords.y > 0) {
          console.log(
            `${i}. ${this.desc(a)} -> ${this.desc(
              b
            )} Adjacent region, above current location.`
          );
        } else if (b.coords.y - a.coords.y < 0) {
          console.log(
            `${i}. ${this.desc(a)} -> ${this.desc(
              b
            )} Adjacent region, below current location.`
          );
        } else {
          console.log(
            `${i}. ${this.desc(a)} -> ${this.desc(
              b
            )} Adjacent region, same level as current location.`
          );
        }
      } else {
        const distance = Math.floor(a.coords.dist2(b.coords) * 400);
        const expectedJumps = this.rc.calcExpectedJumps(a.coords, b.coords);
        console.log(
          `${i}. ${this.desc(a)} -> ${this.desc(
            b
          )} About ${distance} LY, or ${expectedJumps} jumps, away.`
        );
      }
    });
  }
}

export { TripAdvisor, IEndPoint };
