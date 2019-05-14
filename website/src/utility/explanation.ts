import { List } from "immutable";
import { isSameRegion, isSameStar, isAdjacentRegion, calcExpectedJumps, Coordinates } from "common";

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

function toJourney(list: List<IEndPoint>): List<[IEndPoint, IEndPoint]> {
    if (list.size % 2 === 1) {
        throw new RangeError("list must have an even number of end points");
    }

    const exits = list.filter((_v, k) => k % 2 === 0);
    const bhs = list.filter((_v, k) => k % 2 === 1);

    return exits.zip(bhs);
}

class Explanation {
    constructor(public readonly maxJumpRange: number, public readonly journey: List<[IEndPoint, IEndPoint]>) {}

    public legs(): List<ILegOfJourney> {
        return this.journey.map((leg, i) => {
            const [a, b] = leg;

            if (isSameStar(a.coords, b.coords)) {
                return { index: i, start: a, dest: b, description: `Same system!` };
            } else if (isSameRegion(a.coords, b.coords)) {
                return { index: i, start: a, dest: b, description: `Same region.` };
            } else if (isAdjacentRegion(a.coords, b.coords)) {
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
                const expectedJumps = calcExpectedJumps(this.maxJumpRange, a.coords, b.coords);
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

export { Explanation, toJourney, IEndPoint, ILegOfJourney };
