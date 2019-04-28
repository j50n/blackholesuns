"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0NBQW9DO0FBQ3BDLHdIQUF3SDtBQUV4SCxLQUFLO0FBQ0wsdUZBQXVGO0FBQ3ZGLE1BQU07QUFFTixpRUFBaUU7QUFDakUsMERBQTBEO0FBRTFELDJDQUEyQztBQUMzQyw4RUFBOEU7QUFDOUUscUZBQXFGO0FBQ3JGLGtGQUFrRjtBQUNsRixxRkFBcUY7QUFDckYsUUFBUTtBQUNSLHNEQUFzRDtBQUN0RCxnREFBZ0Q7QUFDaEQsU0FBUztBQUNULFFBQVE7QUFDUixzREFBc0Q7QUFDdEQsMENBQTBDO0FBQzFDLFNBQVM7QUFDVCxvRkFBb0Y7QUFDcEYsTUFBTTtBQUVOLGlDQUFpQztBQUNqQyxrREFBa0Q7QUFDbEQsMkJBQTJCO0FBQzNCLEtBQUs7QUFFTCwyQ0FBMkM7QUFDM0Msa0RBQWtEO0FBQ2xELHlDQUF5QztBQUN6QyxLQUFLO0FBRUwsbUNBQW1DO0FBQ25DLGtEQUFrRDtBQUNsRCxpQ0FBaUM7QUFDakMsS0FBSztBQUVMLG1DQUFtQztBQUNuQyw4QkFBOEI7QUFFOUIscUNBQXFDO0FBQ3JDLHFGQUFxRjtBQUNyRiw2Q0FBNkM7QUFFN0MseUNBQXlDO0FBQ3pDLG1DQUFtQztBQUNuQyw0RkFBNEY7QUFDNUYsOEZBQThGO0FBRTlGLHdCQUF3QjtBQUN4Qix5REFBeUQ7QUFDekQsa0NBQWtDO0FBQ2xDLFlBQVk7QUFDWiwwQ0FBMEM7QUFDMUMscUJBQXFCO0FBQ3JCLHNEQUFzRDtBQUN0RCwrQkFBK0I7QUFDL0IsU0FBUztBQUVULGtFQUFrRTtBQUVsRSxxR0FBcUc7QUFFckcsa0NBQWtDO0FBRWxDLDRCQUE0QjtBQUM1Qiw0QkFBNEI7QUFDNUIsa0NBQWtDO0FBQ2xDLHFDQUFxQztBQUVyQywwQkFBMEI7QUFDMUIsSUFBSTtBQUVKLDBCQUEwQjtBQUMxQixpQ0FBaUM7QUFDakMsdUJBQXVCO0FBQ3ZCLE1BQU07QUFFTiw4Q0FBOEM7QUFDOUMseUJBQXlCO0FBQ3pCLHVGQUF1RjtBQUN2RixhQUFhO0FBRWIsNEVBQTRFO0FBQzVFLGtFQUFrRTtBQUNsRSw0REFBNEQ7QUFDNUQseUJBQXlCO0FBQ3pCLG1DQUFtQztBQUNuQyxpQkFBaUI7QUFFakIscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHsgTGlzdCB9IGZyb20gXCJpbW11dGFibGVcIjtcbi8vIGltcG9ydCB7IGNvb3JkaW5hdGVzLCBQbGF0Zm9ybSwgcm91dGVDYWxjdWxhdG9yLCBJRW5kUG9pbnQsIElUcmlwU3RhdHVzLCBUcmlwQWR2aXNvciwgdmFsaWRIb3BzLCBIb3AgfSBmcm9tIFwiY29tbW9uXCI7XG5cbi8vIC8qXG4vLyAgKiBEZW1vbnN0cmF0ZXMgZmluZGluZyBiZXN0IHJvdXRlIHdoZW4gdGhlcmUgYXJlIG11bHRpcGxlIHBvc3NpYmxlIHN0YXJ0aW5nIHBvaW50cy5cbi8vICAqL1xuXG4vLyAvL2NvbnN0IFBPSUx1YmVybmRQbG95Z2kgPSBjb29yZGluYXRlcyhcIjBBRDU6MDA3QzowM0FCOjAwNjVcIik7XG4vLyAvL2NvbnN0IFBPSUh1c2tlciA9IGNvb3JkaW5hdGVzKFwiMDg3MjowMDdDOjAxMDg6MDFGMVwiKTtcblxuLy8gY29uc3QgYWxsQmFzZXM6IExpc3Q8SUVuZFBvaW50PiA9IExpc3QoW1xuLy8gICAgIHsgbGFiZWw6IFwiSGVybWl0J3MgSG9tZVwiLCBjb29yZHM6IGNvb3JkaW5hdGVzKFwiMDE2NDowMDdFOjA1OTY6MDAyMVwiKSB9LFxuLy8gICAgIHsgbGFiZWw6IFwiSGVybWl0J3MgTG9zdCBEaXBsb3NcIiwgY29vcmRzOiBjb29yZGluYXRlcyhcIjAxNjM6MDA3RTowNTk1OjAxREVcIikgfSxcbi8vICAgICB7IGxhYmVsOiBcIkdlayBTaHJpbmUgWzcwMEtdXCIsIGNvb3JkczogY29vcmRpbmF0ZXMoXCIwQjM5OjAwN0M6MDFGRDowMDc5XCIpIH0sXG4vLyAgICAgeyBsYWJlbDogXCJWeWtlZW4gU2hyaW5lIFs4MDBrXVwiLCBjb29yZHM6IGNvb3JkaW5hdGVzKFwiMERDRDowMDgyOjBEMTg6MDAxMFwiKSB9LFxuLy8gICAgIHtcbi8vICAgICAgICAgY29vcmRzOiBjb29yZGluYXRlcyhcIjA0MkY6MDA3ODowRDU1OjAwM0NcIiksXG4vLyAgICAgICAgIGxhYmVsOiBcIkhlcm1pdCdzIEhhdWxlcnMgYXQgdGhlIEh1YlwiLFxuLy8gICAgIH0sXG4vLyAgICAge1xuLy8gICAgICAgICBjb29yZHM6IGNvb3JkaW5hdGVzKFwiMDQ3NjowMDgwOjBENDI6MDFFQlwiKSxcbi8vICAgICAgICAgbGFiZWw6IFwiSGVybWl0J3MgQmlnIEJveSBCYXNlXCIsXG4vLyAgICAgfSxcbi8vICAgICB7IGxhYmVsOiBcIkdsaXRjaGluZyBNb29uIE1pbmVcIiwgY29vcmRzOiBjb29yZGluYXRlcyhcIjAwQTI6MDA4MDowNTUwOjAwRkRcIikgfSxcbi8vIF0pO1xuXG4vLyBjb25zdCBuZXdMZW5ub246IElFbmRQb2ludCA9IHtcbi8vICAgICBjb29yZHM6IGNvb3JkaW5hdGVzKFwiMDQyRjowMDc5OjBENTU6MDA2QVwiKSxcbi8vICAgICBsYWJlbDogXCJOZXcgTGVubm9uXCIsXG4vLyB9O1xuXG4vLyBjb25zdCBkb3BlTG9yZENvbmZlZGVyYWN5OiBJRW5kUG9pbnQgPSB7XG4vLyAgICAgY29vcmRzOiBjb29yZGluYXRlcyhcIjA4MDQ6MDA3QjowODA0OjAwOEJcIiksXG4vLyAgICAgbGFiZWw6IFwiVGhlIERvcGVsb3JkIENvbmZlZGVyYWN5XCIsXG4vLyB9O1xuXG4vLyBjb25zdCBwaWxncmltU3RhcjogSUVuZFBvaW50ID0ge1xuLy8gICAgIGNvb3JkczogY29vcmRpbmF0ZXMoXCIwNjRBOjAwODI6MDFCOTowMDlBXCIpLFxuLy8gICAgIGxhYmVsOiBcIlRoZSBQaWxncmltIFN0YXJcIixcbi8vIH07XG5cbi8vIC8vIGNvbnN0IHBsYXRmb3JtID0gUGxhdGZvcm0uUEM7XG4vLyBjb25zdCBnYWxheHkgPSBcIjAxIEV1Y2xpZFwiO1xuXG4vLyBjb25zdCBhbGxIb3BzOiBIb3BbXSA9IHZhbGlkSG9wcygpXG4vLyAgICAgLmZpbHRlcihob3AgPT4gaG9wLnBsYXRmb3JtID09PSBQbGF0Zm9ybS5QQyB8fCBob3AucGxhdGZvcm0gPT09IFBsYXRmb3JtLlhCT1gpXG4vLyAgICAgLmZpbHRlcihob3AgPT4gaG9wLmdhbGF4eSA9PT0gZ2FsYXh5KTtcblxuLy8gYXN5bmMgZnVuY3Rpb24gbWFpbigpOiBQcm9taXNlPHZvaWQ+IHtcbi8vICAgICAvL2NvbnN0IHN0YXJ0ID0gcGlsZ3JpbVN0YXI7XG4vLyAgICAgY29uc3Qgc3RhcnQgPSB7IGxhYmVsOiBcImFuIGV4aXQgcG9pbnRcIiwgY29vcmRzOiBjb29yZGluYXRlcyhcIjA5M0U6MDA3RDowOTY2OjAwNkRcIikgfTtcbi8vICAgICAvL2NvbnN0IHN0YXJ0ID0geyBsYWJlbDogXCJIZXJtaXQncyBIb21lXCIsIGNvb3JkczogY29vcmRpbmF0ZXMoXCIwMTY0OjAwN0U6MDU5NjowMDIxXCIpIH07XG5cbi8vICAgICAvLyBjb25zdCBkZXN0ID0ge1xuLy8gICAgIC8vICAgICBjb29yZHM6IGNvb3JkaW5hdGVzKFwiMDQyRjowMDc5OjBENTU6MDA2QVwiKSxcbi8vICAgICAvLyAgICAgbGFiZWw6IFwiTmV3IExlbm5vblwiLFxuLy8gICAgIC8vIH07XG4vLyAgICAgLy9jb25zdCBkZXN0ID0gZG9wZUxvcmRDb25mZWRlcmFjeTtcbi8vICAgICBjb25zdCBkZXN0ID0ge1xuLy8gICAgICAgICBjb29yZHM6IGNvb3JkaW5hdGVzKFwiMDY0MzowMDgxOjAxQTE6MDA3OVwiKSxcbi8vICAgICAgICAgbGFiZWw6IFwiRHVycyBTaWdtYVwiLFxuLy8gICAgIH07XG5cbi8vICAgICBjb25zdCBzdGF0dXM6IElUcmlwU3RhdHVzID0geyBjYW5jZWxsZWQ6IGZhbHNlLCB0cmllczogMCB9O1xuXG4vLyAgICAgY29uc3QgdGEgPSBuZXcgVHJpcEFkdmlzb3Iocm91dGVDYWxjdWxhdG9yKGFsbEhvcHMsIDIwMDAsIFwidGltZVwiLCAwLjkzKSwgc3RhcnQsIGRlc3QsIHN0YXR1cyk7XG5cbi8vICAgICBjb25zdCByID0gYXdhaXQgdGEucm91dGUoKTtcblxuLy8gICAgIGNvbnNvbGUubG9nKHIuc3RhcnQpO1xuLy8gICAgIGNvbnNvbGUubG9nKHIuc2NvcmUpO1xuLy8gICAgIGNvbnNvbGUubG9nKHIuZGVzdGluYXRpb24pO1xuLy8gICAgIGNvbnNvbGUubG9nKHIuaG9wcy50b0FycmF5KCkpO1xuXG4vLyAgICAgYXdhaXQgdGEuZXhwbGFpbigpO1xuLy8gfVxuXG4vLyBtYWluKCkuY2F0Y2goZXJyb3IgPT4ge1xuLy8gICAgIGNvbnNvbGUuZXJyb3IoYCR7ZXJyb3J9YCk7XG4vLyAgICAgcHJvY2Vzcy5leGl0KDEpO1xuLy8gfSk7XG5cbi8vIC8vIGNvbnN0IGJlc3Q6IExpc3Q8VHJpcEFkdmlzb3I+ID0gYWxsQmFzZXNcbi8vIC8vICAgICAubWFwKHN0YXJ0ID0+IHtcbi8vIC8vICAgICAgICAgcmV0dXJuIG5ldyBUcmlwQWR2aXNvcihuZXcgUm91dGVDYWxjdWxhdG9yKGFsbEhvcHMpLCBzdGFydCwgZGVzdGluYXRpb24pO1xuLy8gLy8gICAgIH0pO1xuXG4vLyAvLyAgICAgY29uc3QgeCA9IFByb21pc2UuYWxsKGJlc3QubWFwKHRhID0+IHRhLnJvdXRlKCkpKS50aGVuKHJvdXRlcyA9PiB7XG4vLyAvLyAgICAgICAgY29uc3QgdGEgPSAgTGlzdChyb3V0ZXMpLm1pbkJ5KHJvdXRlID0+IHJvdXRlLnNjb3JlKTtcbi8vIC8vICAgICB9KS5jYXRjaChlcnJvciA9PiBjb25zb2xlLmxvZyhgRVJST1I6ICR7ZXJyb3J9YCkpO1xuLy8gLy8gICAgIC8vIC5tYXAodGEgPT4ge1xuLy8gLy8gICAgIC8vICAgICByZXR1cm4gdGEucm91dGUoKTtcbi8vIC8vICAgICAvLyB9KSE7XG5cbi8vIC8vIGJlc3QuZXhwbGFpbigpO1xuIl19