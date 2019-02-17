define(["require", "exports", "../blackholedata", "./hopextractor"], function (require, exports, blackholedata_1, hopextractor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function validHops() {
        return blackholedata_1.blackHoleData.map(hopextractor_1.extractHop).filter(hopextractor_1.isValidHop);
    }
    exports.validHops = validHops;
    function lazily(f) {
        let t;
        return () => {
            if (typeof t === "undefined") {
                t = f();
            }
            return t;
        };
    }
    exports.lazily = lazily;
});
//# sourceMappingURL=utils.js.map