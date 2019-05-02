import test from "tape";
import { dijkstraCalculator, DijkstraShortestPathSolver } from "../src/dijkstra";
//import { validHops } from "../src/utils";
import { Platform, coordinates } from "../src/coordinates";

const Starbucks = 1;
const InsomniaCookies = 2;
const CafeGrumpy = 3;
const DigInn = 4;
const FullStack = 5;
const Dubliner = 0;

function testGraph(): DijkstraShortestPathSolver {
    const g = new DijkstraShortestPathSolver(6);

    g.addBidirEdge(DigInn, FullStack, 7);
    g.addBidirEdge(DigInn, CafeGrumpy, 9);
    g.addBidirEdge(DigInn, Dubliner, 4);
    g.addBidirEdge(FullStack, Dubliner, 2);
    g.addBidirEdge(FullStack, Starbucks, 6);
    g.addBidirEdge(Dubliner, InsomniaCookies, 7);
    g.addBidirEdge(Dubliner, Starbucks, 3);
    g.addBidirEdge(Starbucks, InsomniaCookies, 6);
    g.addBidirEdge(CafeGrumpy, InsomniaCookies, 5);

    return g;
}

test("DirectedEdge toString", t => {
    // console.log(`${new DirectedEdge(1, 2, 3.456)}`);
    const g = testGraph();
    console.log(g.calculateFor(FullStack).shortestPathTo(CafeGrumpy));
    t.end();
});

// test("Dijkstra Multipath", t => {
//     const allHops = validHops()
//         .filter(hop => hop.platform === Platform.PS4)
//         .filter(hop => hop.galaxy === "01 Euclid");

//     const starts = [
//         { label: "Hermit's Home", coords: coordinates("0164:007E:0596:0021") },
//         { label: "Hermit's Lost Diplos", coords: coordinates("0163:007E:0595:01DE") },
//         { label: "Gek Shrine [700K]", coords: coordinates("0B39:007C:01FD:0079") },
//         { label: "Vykeen Shrine [800k]", coords: coordinates("0DCD:0082:0D18:0010") },
//     ];

//     const dest = {
//         coords: coordinates("042F:0079:0D55:006A"),
//         label: "New Lennon",
//     };

//     //for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
//     const t0 = Date.now();
//     dijkstraCalculator(allHops, 2000, "time")
//         .findRoute(starts, dest)
//         .forEach(rt => {
//             console.log(JSON.stringify(rt));
//         });
//     const t1 = Date.now();

//     console.log(`${t1 - t0} milliseconds`);
//     //}

//     t.end();
// });

// test("Dijkstra Multipath", t => {
//     const allHops = validHops()
//         .filter(hop => hop.platform === Platform.PS4)
//         .filter(hop => hop.galaxy === "01 Euclid");

//     const starts = [{ label: "Xenu's Start", coords: coordinates("038C:007E:039E:0079") }];

//     const dest = {
//         coords: coordinates("05A6:007D:034E:0079"),
//         label: "Xenu's Dest",
//     };

//     const t0 = Date.now();
//     dijkstraCalculator(allHops, 2000, "time")
//         .findRoute(starts, dest)
//         .forEach(rt => {
//             console.log(JSON.stringify(rt));
//         });
//     const t1 = Date.now();

//     console.log(`${t1 - t0} milliseconds`);

//     t.end();
// });
