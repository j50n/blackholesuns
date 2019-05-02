//import { blackHoleData } from "./blackholes";
import { Hop } from "./coordinates";
import { /* extractHop, */ isValidHop } from "./hopextractor";

// function validHops(): Hop[] {
//     return blackHoleData
//         .map(extractHop)
//         .filter(hop => hop !== null)
//         .map(hop => hop as Hop)
//         .filter((hop: Hop) => isValidHop(hop));
// }

function lazily<T>(f: () => T): () => T {
    let t: T;

    return () => {
        if (typeof t === "undefined") {
            t = f();
        }
        return t;
    };
}

export { /* validHops, */ lazily };
