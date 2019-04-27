import test from "tape";
import { dijkstraCalculator, DijkstraCalculator, DijkstraSP } from "../src/dijkstra";
import { validHops } from "../src/utils";
import { Hop, Platform, coordinates } from "../src/coordinates";

import { perpPt, IPoint3D } from "../src/intersection";

test("Check Perp", t => {
    const a = { x: 1, y: 1, z: 1 };
    const b = { x: 2, y: 2, z: 2 };
    const q = { x: 1, y: 1, z: 2 };

    console.log(`sdkfjsldfjslkfjslfjsld ${JSON.stringify(perpPt(a, b, q))}`);

    t.end();
});

test("Check Perp", t => {
    const a = { x: 2, y: 2, z: 0 };
    const b = { x: 0, y: 0, z: 0 };
    const q = { x: 0, y: 2, z: 0 };

    console.log(`sdkfjsldfjslkfjslfjsld ${JSON.stringify(perpPt(a, b, q))}`);

    t.end();
});
