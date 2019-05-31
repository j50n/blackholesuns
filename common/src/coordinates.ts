import { lazily } from "./utils";

type Coords = [number, number, number, number];

class Coordinates {
    constructor(public readonly x: number, public readonly y: number, public readonly z: number, public readonly system: number) {
        if (!Number.isInteger(x)) {
            throw new RangeError(`x must be an integer value: ${x}`);
        }
        if (!Number.isInteger(y)) {
            throw new RangeError(`y must be an integer value: ${y}`);
        }
        if (!Number.isInteger(z)) {
            throw new RangeError(`z must be an integer value: ${z}`);
        }
        if (!Number.isInteger(system)) {
            throw new RangeError(`system must be an integer value: ${system}`);
        }

        if (x < 0 || x > 0xfff) {
            throw new RangeError(`x must be in range 0x0 to 0xFFF: 0x${x.toString(16)}`);
        }
        if (y < 0 || y > 0xff) {
            throw new RangeError(`y must be in range 0x0 to 0xFF: 0x${y.toString(16)}`);
        }
        if (z < 0 || z > 0xfff) {
            throw new RangeError(`z must be in range 0x0 to 0xFFF: 0x${z.toString(16)}`);
        }
        if (system < 0 || system > 0x2ff) {
            throw new RangeError(`system must be in range 0x0 to 0x2FF: 0x${system.toString(16)}`);
        }
    }

    public toString() {
        function f(v: number): string {
            let n = v.toString(16).toUpperCase();
            while (n.length < 4) {
                n = `0${n}`;
            }
            return n;
        }

        return `${f(this.x)}:${f(this.y)}:${f(this.z)}:${f(this.system)}`;
    }

    //[P][SSS][YY][ZZZ][XXX] – (P = Planet Index / S = Star System Index / Y = Height / Z = Width / X = Length)
    public galacticCoordinates(planet: number): string {
        if (planet < 0 || planet > 0x0f) {
            throw new RangeError(`illegal planet code: ${planet.toString(16)}`);
        }

        function pad(text: string, len: number): string {
            if (text.length >= len) {
                return text;
            } else {
                return pad(`0${text}`, len);
            }
        }

        function trunc(text: string, len: number): string {
            if (text.length <= len) {
                return pad(text, len);
            } else {
                return trunc(text.substring(1), len);
            }
        }

        const p = planet.toString(16);
        const s = trunc(this.system.toString(16), 3);
        const y = trunc((this.y + 0x81).toString(16), 2);
        const z = trunc((this.z + 0x801).toString(16), 3);
        const x = trunc((this.x + 0x801).toString(16), 3);

        return `${p}${s}${y}${z}${x}`;
    }

    /** Distance to center (regions). */
    dist2Center(): number {
        return this.dist2(GalacticCenter);
    }

    /**
     * Distance between two coordinates.
     * @param other The other coordinates.
     */
    public dist2(other: Coordinates): number {
        return Math.sqrt(this.dist2Sq(other));
    }

    /**
     * Distance squared between two coordinates.
     * @param other The other coordinates.
     */
    public dist2Sq(other: Coordinates): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;

        return dx * dx + dy * dy + dz * dz;
    }

    public get radial(): number {
        let r = Math.atan2(-1 * (this.z - 0x7ff), this.x - 0x7ff);
        if (r < 0) {
            r = r + 2 * Math.PI;
        }
        return (r * 180) / Math.PI;
    }
}

const reCoord3Pattern = `([0-9a-f]{1,4})[:\\s]([0-9a-f]{1,4})[:\\s]([0-9a-f]{1,4})`;
const reCoord4Pattern = `([0-9a-f]{1,4})[:\\s]([0-9a-f]{1,4})[:\\s]([0-9a-f]{1,4})[:\\s]([0-9a-f]{1,4})`;
const reCoordFlat3Pattern = `([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})`;
const reCoordFlat4Pattern = `([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})`;

const reCoord3 = new RegExp(`^${reCoord3Pattern}$`, "i"); ///^([0-9a-f]{1,4})[\:\s]([0-9a-f]{1,4})[\:\s]([0-9a-f]{1,4})$/i;
const reCoord4 = new RegExp(`^${reCoord4Pattern}$`, "i"); ///^([0-9a-f]{1,4})[\:\s]([0-9a-f]{1,4})[\:\s]([0-9a-f]{1,4})[\:\s]([0-9a-f]{1,4})$/i;
const reCoordFlat3 = new RegExp(`^${reCoordFlat3Pattern}$`, "i"); ///^([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})$/i;
const reCoordFlat4 = new RegExp(`^${reCoordFlat4Pattern}$`, "i"); ///^([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})$/i;

const reCoordInput = `^(${reCoord3Pattern})|(${reCoord4Pattern})|(${reCoordFlat3Pattern})|(${reCoordFlat4Pattern})$`.replace(/a-f/g, "a-fA-F");

function coordinates(text: string): Coordinates {
    function interpret(parts: string[] | null): Coords | null {
        if (parts === null) {
            return null;
        } else {
            let ps = parts.slice(1, 5).map(i => parseInt(i, 16));
            if (ps.length === 3) {
                ps.push(0x0000);
            }
            return ps as Coords;
        }
    }

    const t = text.trim();

    let parts = interpret(reCoord3.exec(t));
    if (parts == null) {
        parts = interpret(reCoord4.exec(t));
    }
    if (parts == null) {
        parts = interpret(reCoordFlat3.exec(t));
    }
    if (parts == null) {
        parts = interpret(reCoordFlat4.exec(t));
    }

    if (parts == null) {
        throw new SyntaxError(`not valid galactic coordinates: '${t}'`);
    } else {
        return new Coordinates(...parts);
    }
}

const GalacticCenter = coordinates("07FF:007F:07FF:0000");

enum Platform {
    PS4 = "PS4",
    PC = "PC",
}

class System {
    constructor(public readonly region: string, public readonly system: string, public readonly coords: Coordinates) {}

    public get label(): string {
        console.log(`${this.region}:${this.system}:${this.coords}`);
        return `[${this.region.replace(/ /g, "\xA0")}] ${this.system.replace(/-/g, "‑").replace(/ /g, "\xA0")}`;
    }
}

class Hop {
    constructor(public readonly platform: Platform, public readonly galaxy: string, public readonly blackhole: System, public readonly exit: System) {}

    /**
     * Absolute distance moved toward the center from the black-hole to the exit.
     */
    public get radialDist(): number {
        const bd = this.blackhole.coords.dist2Center();
        const ed = this.exit.coords.dist2Center();

        return Math.abs(bd - ed);
    }

    /**
     * Calculate the axial distance travelled in degrees from the black-hole to the
     * exit. This will be -180 to +180 degrees.
     */
    public get axialDist(): number {
        const br = this.blackhole.coords.radial;
        const er = this.exit.coords.radial;

        let r = br - er;
        while (r < 0) {
            r = r + 180;
        }
        while (r > 180) {
            r = r - 180;
        }

        if (br < 180) {
            if (er > br && er < br + 180) {
                r = r;
            } else {
                r = -r;
            }
        } else {
            if (er < br && er > br - 180) {
                r = -r;
            } else {
                r = r;
            }
        }

        return r;
    }
}

export { coordinates, Coordinates, Hop, System, Platform, reCoordInput, GalacticCenter };
