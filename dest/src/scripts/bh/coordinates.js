"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reCoord = /^([0-9a-f]{1,4}):([0-9a-f]{1,4}):([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
function coordinates(text) {
    const parts = reCoord.exec(text);
    if (parts == null) {
        throw new SyntaxError(`not valid galactic coordinates: '${text}'`);
    }
    else {
        const args = parts.slice(1, 5).map(i => parseInt(i, 16));
        return new Coordinates(...args);
    }
}
exports.coordinates = coordinates;
class Coordinates {
    constructor(x, y, z, system) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.system = system;
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
    toString() {
        function f(v) {
            let n = v.toString(16).toUpperCase();
            while (n.length < 4) {
                n = `0${n}`;
            }
            return n;
        }
        return `${f(this.x)}:${f(this.y)}:${f(this.z)}:${f(this.system)}`;
    }
    get dist() {
        return Math.sqrt(Math.pow((this.x - 0x7ff), 2) + Math.pow((this.z - 0x7ff), 2));
    }
    dist2(other) {
        return Math.sqrt(Math.pow((this.x - other.x), 2) + Math.pow((this.z - other.z), 2));
    }
    get radial() {
        let r = Math.atan2(-1 * (this.z - 0x7ff), this.x - 0x7ff);
        if (r < 0) {
            r = r + 2 * Math.PI;
        }
        return (r * 180) / Math.PI;
    }
}
exports.Coordinates = Coordinates;
var Platform;
(function (Platform) {
    Platform["PS4"] = "PS4";
    Platform["PC"] = "PC";
    Platform["XBOX"] = "XBOX";
})(Platform || (Platform = {}));
exports.Platform = Platform;
var Wealth;
(function (Wealth) {
    Wealth[Wealth["Low"] = 1] = "Low";
    Wealth[Wealth["Middle"] = 2] = "Middle";
    Wealth[Wealth["High"] = 3] = "High";
})(Wealth || (Wealth = {}));
exports.Wealth = Wealth;
class System {
    constructor(region, system, coords, economy) {
        this.region = region;
        this.system = system;
        this.coords = coords;
        this.economy = economy;
    }
    get label() {
        return `${this.system}@${this.region}`;
    }
}
exports.System = System;
class Hop {
    constructor(platform, galaxy, blackhole, exit) {
        this.platform = platform;
        this.galaxy = galaxy;
        this.blackhole = blackhole;
        this.exit = exit;
    }
    get radialDist() {
        const bd = this.blackhole.coords.dist;
        const ed = this.exit.coords.dist;
        return Math.abs(bd - ed);
    }
    get axialDist() {
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
            }
            else {
                r = -r;
            }
        }
        else {
            if (er < br && er > br - 180) {
                r = -r;
            }
            else {
                r = r;
            }
        }
        return r;
    }
}
exports.Hop = Hop;
//# sourceMappingURL=coordinates.js.map