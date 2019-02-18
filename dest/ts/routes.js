"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const coordinates_1 = require("./bh/coordinates");
const routecalculator_1 = require("./bh/routecalculator");
const tripadvisor_1 = require("./bh/tripadvisor");
const utils_1 = require("./bh/utils");
const allBases = immutable_1.List([
    { label: "Hermit's Home", coords: coordinates_1.coordinates("0164:007E:0596:0021") },
    { label: "Hermit's Lost Diplos", coords: coordinates_1.coordinates("0163:007E:0595:01DE") },
    { label: "Gek Shrine [700K]", coords: coordinates_1.coordinates("0B39:007C:01FD:0079") },
    { label: "Vykeen Shrine [800k]", coords: coordinates_1.coordinates("0DCD:0082:0D18:0010") },
    {
        coords: coordinates_1.coordinates("042F:0078:0D55:003C"),
        label: "Hermit's Haulers at the Hub"
    },
    {
        coords: coordinates_1.coordinates("0476:0080:0D42:01EB"),
        label: "Hermit's Big Boy Base"
    },
    { label: "Glitching Moon Mine", coords: coordinates_1.coordinates("00A2:0080:0550:00FD") }
]);
const newLennon = {
    coords: coordinates_1.coordinates("042F:0079:0D55:006A"),
    label: "New Lennon"
};
const dopeLordConfederacy = {
    coords: coordinates_1.coordinates("0804:007B:0804:008B"),
    label: "The Dopelord Confederacy"
};
const platform = coordinates_1.Platform.PS4;
const galaxy = "01 Euclid";
const allHops = utils_1.validHops()
    .filter(hop => hop.platform === platform)
    .filter(hop => hop.galaxy === galaxy);
const destination = dopeLordConfederacy;
const best = allBases
    .map(start => {
    return new tripadvisor_1.TripAdvisor(new routecalculator_1.RouteCalculator(allHops), start, destination);
})
    .minBy(ta => {
    return ta.route().score;
});
best.explain();
//# sourceMappingURL=routes.js.map