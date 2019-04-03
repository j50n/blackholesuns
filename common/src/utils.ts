import { blackHoleData } from "./blackholes";
import { Hop } from "./coordinates";
import { extractHop, isValidHop } from "./hopextractor";

function validHops(): Hop[] {
    return blackHoleData.map(extractHop).filter(isValidHop);
}

function lazily<T>(f: () => T): () => T {
    let t: T;

    return () => {
        if (typeof t === "undefined") {
            t = f();
        }
        return t;
    };
}

export { validHops, lazily };
