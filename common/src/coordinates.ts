type Coords = [number, number, number, number];
const reCoord = /^([0-9a-f]{1,4}):([0-9a-f]{1,4}):([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;

function coordinates(text: string): Coordinates {
    const parts = reCoord.exec(text);
    if (parts == null) {
        throw new SyntaxError(`not valid galactic coordinates: '${text}'`);
    } else {
        const args = parts.slice(1, 5).map(i => parseInt(i, 16)) as Coords;
        return new Coordinates(...args);
    }
}

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

    /** Distance to center. */
    public get dist(): number {
        return Math.sqrt((this.x - 0x7ff) ** 2 + (this.y - 0x7ff) ** 2 + (this.z - 0x7ff) ** 2);
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

enum Platform {
    PS4 = "PS4",
    PC = "PC",
    XBOX = "XBox",
}

enum Wealth {
    Low = 1,
    Middle = 2,
    High = 3,
}

class System {
    constructor(public readonly region: string, public readonly system: string, public readonly coords: Coordinates, public readonly economy: Wealth) {}

    public get label(): string {
        return `${this.system}@${this.region}`;
    }
}

class Hop {
    constructor(public readonly platform: Platform, public readonly galaxy: string, public readonly blackhole: System, public readonly exit: System) {}

    /**
     * Absolute distance moved toward the center from the black-hole to the exit.
     */
    public get radialDist(): number {
        const bd = this.blackhole.coords.dist;
        const ed = this.exit.coords.dist;

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

export { coordinates, Coordinates, Hop, System, Wealth, Platform };
