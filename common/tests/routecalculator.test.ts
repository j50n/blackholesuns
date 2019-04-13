import { List } from "immutable";
import test from "tape";
import { logJourney, journey, hops4Route } from "../src/tripadvisor";
import { coordinates, Hop, Platform } from "../src/coordinates";
import { FuelOptimizedRouteCalculator, IRoute } from "../src/routecalculator";
import { validHops } from "../src/utils";

function f(c: string): Hop {
    const result = allHops.find(hop => {
        return hop.blackhole.coords.toString() === c;
    });
    if (result == null) {
        throw new Error(`did not find ${c}`);
    } else {
        return result!;
    }
}

const allHops = validHops()
    .filter(hop => hop.platform === Platform.PS4)
    .filter(hop => hop.galaxy === "01 Euclid");

const rc = new FuelOptimizedRouteCalculator(allHops, { cancelled: false, tries: 0 }, 2000, 1.0);

test("score Pahefu's route", t => {
    const start = coordinates("0E40:0083:04E8:001C");
    const dest = coordinates("064A:0082:01B9:009A");

    const hops = List([
        f("0E3F:0083:04E7:0079"),
        f("0C6C:007E:0D4C:0079"),
        f("0D7F:007E:0C11:0079"),
        f("07B4:0080:0EC2:0079"),
        f("050A:007D:0DFF:0079"),
        f("0693:007D:0E7C:0079"),
        f("0BC6:0082:029A:0079"),
        f("0E0E:0081:058E:0079"),
        f("0CEF:0080:03D0:0079"),
    ])!;
    const score = rc.calculateScore(start, dest, hops);

    const route: IRoute = {
        start,
        destination: dest,
        score,
        hops,
    };

    logJourney(journey({ label: "start", coords: start }, { label: "destination", coords: dest }, hops4Route(route)), rc);

    console.info(`Pahefu's route score: ${score}`);

    t.end();
});

test("score Hermit's route", t => {
    const start = coordinates("0E40:0083:04E8:001C");
    const dest = coordinates("064A:0082:01B9:009A");

    const hops = List([f("0E40:0083:04E6:0079"), f("01F3:0081:0B5C:0079"), f("0E0A:007C:0B3E:0079"), f("024E:0082:0449:0079")])!;
    const score = rc.calculateScore(start, dest, hops);

    const route: IRoute = {
        start,
        destination: dest,
        score,
        hops,
    };

    logJourney(journey({ label: "start", coords: start }, { label: "destination", coords: dest }, hops4Route(route)), rc);

    console.info(`Hermit's route score: ${score}`);

    t.end();
});

// test("score one", t => {
//   const POIVykeenShrine800K = coordinates("0DCD:0082:0D18:0010");

//   const rc = new RouteCalculator(allHops);

//   const hop1: Hop = allHops.find(hop => {
//     return rc.isSameStar(POIVykeenShrine800K, hop.exit.coords);
//   })!;

//   const start = hop1.blackhole.coords;
//   const destination = hop1.exit.coords;

//   t.equal(
//     rc.calculateScore(start, destination, List([hop1])),
//     1,
//     "single bh jump"
//   );

//   t.end();
// });

// test("score two in chain", t => {
//   const POIVykeenShrine800K = coordinates("0DCD:0082:0D18:0010");

//   const rc = new RouteCalculator(allHops);

//   const hop1: Hop = allHops.find(hop => {
//     return rc.isSameStar(POIVykeenShrine800K, hop.exit.coords);
//   })!;

//   const hop2: Hop = allHops.find(hop => {
//     return rc.isSameRegion(POIVykeenShrine800K, hop.blackhole.coords);
//   })!;

//   const start = hop1.blackhole.coords;
//   const destination = hop2.exit.coords;

//   t.equal(
//     rc.calculateScore(start, destination, List([hop1, hop2])),
//     3,
//     "bh1, short jump, bh2"
//   );

//   console.log(`::: ${hop1.blackhole.region}:${hop1.exit.region}`);
//   console.log(`::: ${hop2.blackhole.region}:${hop2.exit.region}`);

//   t.end();
// });

// test("find simple route", t => {
//   const POIVykeenShrine800K = coordinates("0DCD:0082:0D18:0010");

//   const rc = new RouteCalculator(allHops);

//   const hop1: Hop = allHops.find(hop => {
//     return rc.isSameStar(POIVykeenShrine800K, hop.exit.coords);
//   })!;

//   const hop2: Hop = allHops.find(hop => {
//     return rc.isSameRegion(POIVykeenShrine800K, hop.blackhole.coords);
//   })!;

//   const start = hop1.blackhole.coords;
//   const destination2 = hop2.exit.coords;

//   const bestRoute = rc.findRoute(start, destination2);

//   console.log(`null path score: ${bestRoute.score}`);
//   console.log(`null path hops: ${bestRoute.hops.size}`);

//   bestRoute.hops.forEach(hop => {
//     console.log(JSON.stringify(hop));
//   });

//   console.log(`::: ${hop1.blackhole.region}:${hop1.exit.region}`);
//   console.log(`::: ${hop2.blackhole.region}:${hop2.exit.region}`);

//   t.equal(bestRoute.score, 3, "find blackhole chain");

//   t.end();
// });

// test("find complex chain route", t => {
//   const POIVykeenShrine800K = coordinates("0DCD:0082:0D18:0010");
//   const POIGekShrine700K = coordinates("0B39:007C:01FD:0079");

//   const POIBlah = coordinates("0F1C:007F:05D1:003F");

//   const rc = new RouteCalculator(allHops);

//   const bestRoute = rc.findRoute(POIVykeenShrine800K, POIGekShrine700K);

//   console.log(`chain path score: ${bestRoute.score}`);
//   console.log(`chain path hops: ${bestRoute.hops.size}`);

//   bestRoute.hops.forEach(hop => {
//     console.log(JSON.stringify(hop));
//   });

//   t.equal(bestRoute.score, 33, "find blackhole chain");

//   t.end();
// });
