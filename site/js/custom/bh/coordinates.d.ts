declare function coordinates(text: string): Coordinates;
declare class Coordinates {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly system: number;
    constructor(x: number, y: number, z: number, system: number);
    toString(): string;
    readonly dist: number;
    dist2(other: Coordinates): number;
    readonly radial: number;
}
declare enum Platform {
    PS4 = "PS4",
    PC = "PC",
    XBOX = "XBOX"
}
declare enum Wealth {
    Low = 1,
    Middle = 2,
    High = 3
}
declare class System {
    readonly region: string;
    readonly system: string;
    readonly coords: Coordinates;
    readonly economy: Wealth;
    constructor(region: string, system: string, coords: Coordinates, economy: Wealth);
    readonly label: string;
}
declare class Hop {
    readonly platform: Platform;
    readonly galaxy: string;
    readonly blackhole: System;
    readonly exit: System;
    constructor(platform: Platform, galaxy: string, blackhole: System, exit: System);
    readonly radialDist: number;
    readonly axialDist: number;
}
export { coordinates, Coordinates, Hop, System, Wealth, Platform };
