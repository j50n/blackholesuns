import { List } from "immutable";
import { coordinates, Platform } from "./bh/coordinates";
import { RouteCalculator } from "./bh/routecalculator";
import { TripAdvisor } from "./bh/tripadvisor";
import { validHops } from "./bh/utils";
const allBases = List([
    { label: "Hermit's Home", coords: coordinates("0164:007E:0596:0021") },
    { label: "Hermit's Lost Diplos", coords: coordinates("0163:007E:0595:01DE") },
    { label: "Gek Shrine [700K]", coords: coordinates("0B39:007C:01FD:0079") },
    { label: "Vykeen Shrine [800k]", coords: coordinates("0DCD:0082:0D18:0010") },
    {
        coords: coordinates("042F:0078:0D55:003C"),
        label: "Hermit's Haulers at the Hub"
    },
    {
        coords: coordinates("0476:0080:0D42:01EB"),
        label: "Hermit's Big Boy Base"
    },
    { label: "Glitching Moon Mine", coords: coordinates("00A2:0080:0550:00FD") }
]);
const newLennon = {
    coords: coordinates("042F:0079:0D55:006A"),
    label: "New Lennon"
};
const dopeLordConfederacy = {
    coords: coordinates("0804:007B:0804:008B"),
    label: "The Dopelord Confederacy"
};
const platform = Platform.PS4;
const galaxy = "01 Euclid";
const allHops = validHops()
    .filter(hop => hop.platform === platform)
    .filter(hop => hop.galaxy === galaxy);
const destination = dopeLordConfederacy;
const best = allBases
    .map(start => {
    return new TripAdvisor(new RouteCalculator(allHops), start, destination);
})
    .minBy(ta => {
    return ta.route().score;
});
best.explain();
//# sourceMappingURL=routes.js.map