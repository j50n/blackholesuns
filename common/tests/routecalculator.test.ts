import { List } from "immutable";
import test from "tape";
import { coordinates, Hop, Platform } from "../src/coordinates";
import { RouteCalculator } from "../src/routecalculator";
import { validHops } from "../src/utils";

const allHops = validHops()
    .filter(hop => hop.platform === Platform.PS4)
    .filter(hop => hop.galaxy === "01 Euclid");

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
