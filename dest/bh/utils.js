import { blackHoleData } from "../blackholedata";
import { extractHop, isValidHop } from "./hopextractor";
function validHops() {
    return blackHoleData.map(extractHop).filter(isValidHop);
}
function lazily(f) {
    let t;
    return () => {
        if (typeof t === "undefined") {
            t = f();
        }
        return t;
    };
}
export { validHops, lazily };
//# sourceMappingURL=utils.js.map