// import { List } from "immutable";
// import { coordinates, Platform, routeCalculator, IEndPoint, ITripStatus, TripAdvisor, validHops, Hop } from "common";

// /*
//  * Demonstrates finding best route when there are multiple possible starting points.
//  */

// //const POILuberndPloygi = coordinates("0AD5:007C:03AB:0065");
// //const POIHusker = coordinates("0872:007C:0108:01F1");

// const allBases: List<IEndPoint> = List([
//     { label: "Hermit's Home", coords: coordinates("0164:007E:0596:0021") },
//     { label: "Hermit's Lost Diplos", coords: coordinates("0163:007E:0595:01DE") },
//     { label: "Gek Shrine [700K]", coords: coordinates("0B39:007C:01FD:0079") },
//     { label: "Vykeen Shrine [800k]", coords: coordinates("0DCD:0082:0D18:0010") },
//     {
//         coords: coordinates("042F:0078:0D55:003C"),
//         label: "Hermit's Haulers at the Hub",
//     },
//     {
//         coords: coordinates("0476:0080:0D42:01EB"),
//         label: "Hermit's Big Boy Base",
//     },
//     { label: "Glitching Moon Mine", coords: coordinates("00A2:0080:0550:00FD") },
// ]);

// const newLennon: IEndPoint = {
//     coords: coordinates("042F:0079:0D55:006A"),
//     label: "New Lennon",
// };

// const dopeLordConfederacy: IEndPoint = {
//     coords: coordinates("0804:007B:0804:008B"),
//     label: "The Dopelord Confederacy",
// };

// const pilgrimStar: IEndPoint = {
//     coords: coordinates("064A:0082:01B9:009A"),
//     label: "The Pilgrim Star",
// };

// // const platform = Platform.PC;
// const galaxy = "01 Euclid";

// const allHops: Hop[] = validHops()
//     .filter(hop => hop.platform === Platform.PC || hop.platform === Platform.XBOX)
//     .filter(hop => hop.galaxy === galaxy);

// async function main(): Promise<void> {
//     //const start = pilgrimStar;
//     const start = { label: "an exit point", coords: coordinates("093E:007D:0966:006D") };
//     //const start = { label: "Hermit's Home", coords: coordinates("0164:007E:0596:0021") };

//     // const dest = {
//     //     coords: coordinates("042F:0079:0D55:006A"),
//     //     label: "New Lennon",
//     // };
//     //const dest = dopeLordConfederacy;
//     const dest = {
//         coords: coordinates("0643:0081:01A1:0079"),
//         label: "Durs Sigma",
//     };

//     const status: ITripStatus = { cancelled: false, tries: 0 };

//     const ta = new TripAdvisor(routeCalculator(allHops, 2000, "time", 0.93), start, dest, status);

//     const r = await ta.route();

//     console.log(r.start);
//     console.log(r.score);
//     console.log(r.destination);
//     console.log(r.hops.toArray());

//     await ta.explain();
// }

// main().catch(error => {
//     console.error(`${error}`);
//     process.exit(1);
// });

// // const best: List<TripAdvisor> = allBases
// //     .map(start => {
// //         return new TripAdvisor(new RouteCalculator(allHops), start, destination);
// //     });

// //     const x = Promise.all(best.map(ta => ta.route())).then(routes => {
// //        const ta =  List(routes).minBy(route => route.score);
// //     }).catch(error => console.log(`ERROR: ${error}`));
// //     // .map(ta => {
// //     //     return ta.route();
// //     // })!;

// // best.explain();
