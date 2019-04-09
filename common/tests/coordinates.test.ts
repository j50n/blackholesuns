import deepEqual from "deep-equal";
import test from "tape";
import { coordinates, Coordinates } from "../src/coordinates";

test("coordinates parse", t => {
    t.equal(coordinates("07FF:007F:07FE:0079").x, 0x07ff, "parses x");
    t.equal(coordinates("07FF:007F:07FE:0079").y, 0x007f, "parses y");
    t.equal(coordinates("07FF:007F:07FE:0079").z, 0x07fe, "parses z");
    t.equal(coordinates("07FF:007F:07FE:0079").system, 0x0079, "parses system");
    t.end();
});

test("radial", t => {
    t.true(Math.abs(coordinates("0FFF:007F:0FFF:0079").radial - 315) < 0.1, "finds the correct radial");
    t.end();
});

test("distance", t => {
    t.true(Math.abs(coordinates("0FFF:007F:0FFF:0079").dist - 2896.3) < 1, "calculates the correct distance from center");
    t.end();
});

test("equality", t => {
    t.true(deepEqual(coordinates("0FFF:007F:0FFF:0079"), coordinates("0FFF:007F:0FFF:0079")), "correctly detect these coordinates are the same");
    t.false(deepEqual(coordinates("0FFF:007F:0FFF:0078"), coordinates("0FFF:007F:0FFF:0079")), "correctly detect these coordinates are different");
    t.end();
});
