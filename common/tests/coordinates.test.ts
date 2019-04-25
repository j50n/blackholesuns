import deepEqual from "deep-equal";
import test from "tape";
import { coordinates, Coordinates, reCoordInput } from "../src/coordinates";

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
    t.true(Math.abs(coordinates("0FFF:007F:0FFF:0079").dist2Center() - 2896.3) < 1, "calculates the correct distance from center");
    t.end();
});

test("equality", t => {
    t.true(deepEqual(coordinates("0FFF:007F:0FFF:0079"), coordinates("0FFF:007F:0FFF:0079")), "correctly detect these coordinates are the same");
    t.false(deepEqual(coordinates("0FFF:007F:0FFF:0078"), coordinates("0FFF:007F:0FFF:0079")), "correctly detect these coordinates are different");
    t.end();
});

test("galactic coordinates", t => {
    console.log(coordinates("0FFF:007F:0FFF:0079").galacticCoordinates(0));
    t.equal(coordinates("0FFF:00FF:0FFF:0079").galacticCoordinates(0), "007980800800", "max coordinates are the same");
    t.equal(coordinates("0000:0000:0000:0001").galacticCoordinates(0), "000181801801", "min coordinates are the same");
    t.equal(coordinates("07FF:007F:07FF:0100").galacticCoordinates(0), "010000000000", "mid coordinates are the same");

    t.end();
});

test("coordinates with spaces", t => {
    console.log(reCoordInput);

    t.equal(coordinates("FFF FF FFF 79").toString(), "0FFF:00FF:0FFF:0079", "correctly reads 4-part with spaces");
    t.equal(coordinates("FFF FF FFF").toString(), "0FFF:00FF:0FFF:0000", "correctly reads 3-part with spaces");

    t.end();
});
