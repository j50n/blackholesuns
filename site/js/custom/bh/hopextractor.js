define(["require", "exports", "./coordinates"], function (require, exports, coordinates_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const idxPlatform = 0;
    const idxGalaxy = 1;
    const blackHoleIdxs = {
        idxCoords: 6,
        idxEconomy: 3,
        idxRegion: 4,
        idxSystem: 5,
    };
    const exitIdxs = {
        idxCoords: 19,
        idxEconomy: 16,
        idxRegion: 17,
        idxSystem: 18,
    };
    class SystemDef {
        constructor(indexes, row) {
            this.indexes = indexes;
            this.row = row;
        }
        get regionName() {
            return this.row[this.indexes.idxRegion].trim();
        }
        get systemName() {
            return this.row[this.indexes.idxSystem].trim();
        }
        get coordinates() {
            return coordinates_1.coordinates(this.row[this.indexes.idxCoords]);
        }
        get economy() {
            return parseInt(this.row[this.indexes.idxEconomy], 10);
        }
        get system() {
            return new coordinates_1.System(this.regionName, this.systemName, this.coordinates, this.economy);
        }
    }
    function extractHop(row) {
        const platform = row[idxPlatform];
        const galaxy = row[idxGalaxy];
        const blackHole = new SystemDef(blackHoleIdxs, row).system;
        const exit = new SystemDef(exitIdxs, row).system;
        return new coordinates_1.Hop(platform, galaxy, blackHole, exit);
    }
    exports.extractHop = extractHop;
    function isValidHop(hop) {
        const movesTowardCenter = hop.blackhole.coords.dist > hop.exit.coords.dist;
        const isInsideGalacticCircle = hop.blackhole.coords.dist <= 0x7ff;
        const traveledANormalDistance = hop.radialDist * 400 <= 16000;
        return movesTowardCenter && (isInsideGalacticCircle ? traveledANormalDistance : true);
    }
    exports.isValidHop = isValidHop;
});
//# sourceMappingURL=hopextractor.js.map