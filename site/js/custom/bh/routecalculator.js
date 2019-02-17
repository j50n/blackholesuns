define(["require", "exports", "immutable"], function (require, exports, immutable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RouteCalculator {
        constructor(galacticHops, maxJumpRange = 2809, jumpEfficiency = 0.8) {
            this.galacticHops = galacticHops;
            this.maxJumpRange = maxJumpRange;
            this.jumpEfficiency = jumpEfficiency;
            this.waypointPenalty = 4;
            this.adjacentPenalty = 1;
            this.routesConsideredCounter = 0;
        }
        get routesConsidered() {
            return this.routesConsideredCounter;
        }
        closestByExit(target) {
            const hs = this.galacticHops.map(h => [target.dist2(h.exit.coords), h]);
            return hs.sort((a, b) => a[0] - b[0]).map(a => a[1]);
        }
        isSameRegion(a, b) {
            return a.x === b.x && a.y === b.y && a.z === b.z;
        }
        isSameStar(a, b) {
            return this.isSameRegion(a, b) && a.system === b.system;
        }
        isAdjacentRegion(a, b) {
            return (Math.abs(a.x - b.x) <= 1 &&
                Math.abs(a.y - b.y) <= 1 &&
                Math.abs(a.z - b.z) <= 1);
        }
        convertHopsToRoutes(start, destination, hops) {
            const exits = immutable_1.List(hops.map(hop => hop.exit.coords)).unshift(start);
            const bhs = immutable_1.List(hops.map(hop => hop.blackhole.coords)).push(destination);
            return exits.zip(bhs);
        }
        calcExpectedJumps(a, b) {
            const result = Math.ceil((a.dist2(b) * 400) / (this.jumpEfficiency * this.maxJumpRange));
            if (result === 0) {
                if (this.isSameStar(a, b)) {
                    return 0;
                }
                else {
                    return 1;
                }
            }
            else {
                return result;
            }
        }
        calculateScore(start, destination, hops) {
            const scores = this.convertHopsToRoutes(start, destination, hops).map(jump => {
                const [a, b] = jump;
                if (this.isSameStar(a, b)) {
                    return 0;
                }
                else if (this.isSameRegion(a, b) && b.system === 0x79) {
                    return 1;
                }
                else if (this.isAdjacentRegion(a, b) && b.system === 0x79) {
                    return 1 + this.adjacentPenalty;
                }
                else {
                    return this.calcExpectedJumps(a, b) + this.waypointPenalty;
                }
            });
            return scores.reduce((a, b) => a + b, 0) + hops.size;
        }
        calculateRunningScore(destination, hops) {
            let start = destination;
            if (!hops.isEmpty()) {
                start = hops.first().blackhole.coords;
            }
            return this.calculateScore(start, destination, hops);
        }
        findRoute(start, destination) {
            this.routesConsideredCounter = 0;
            return this.recFindRoute(start, destination, immutable_1.List(), 99999);
        }
        recFindRoute(start, destination, hops, bestScore) {
            this.routesConsideredCounter += 1;
            const current = {
                destination,
                hops,
                score: this.calculateScore(start, destination, hops),
                start
            };
            let bs = Math.min(bestScore, current.score);
            if (this.calculateRunningScore(destination, hops) < bs) {
                const closest = (() => {
                    let dest = destination;
                    if (!hops.isEmpty()) {
                        dest = hops.first().blackhole.coords;
                    }
                    return this.closestByExit(dest).slice(0, 20);
                })();
                const potentialRoutes = closest.map(hop => {
                    const result = this.recFindRoute(start, destination, hops.unshift(hop), bs);
                    bs = Math.min(bs, result.score);
                    return result;
                });
                return immutable_1.List(potentialRoutes)
                    .push(current)
                    .minBy(r => r.score);
            }
            else {
                return current;
            }
        }
    }
    exports.RouteCalculator = RouteCalculator;
});
//# sourceMappingURL=routecalculator.js.map