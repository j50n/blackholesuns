<template>
  <div>
    <div class="pure-g">
      <div
        v-for="message of messages"
        :key="`${message.text}:${message.type}`"
        :class="[message.type, 'message', 'pure-u-1-1']"
      >{{message.text}}</div>
    </div>
    <br>
    <div v-if="ta === null" class="pure-g">
      <div class="pure-u-1">&nbsp;</div>
    </div>
    <div v-else-if="!ta.hasRoute" class="pure-g">
      <div class="pure-u-1">
        <h4 style="text-align: center;">...thinking...</h4>
      </div>
    </div>
    <template v-else>
      <div class="pure-g">
        <div class="pure-u-1" style="text-align: right;">
          <button @click="toggleShowCoordinates" class="pure-button">
            <template v-if="showCoordinates">Show Glyphs</template>
            <template v-else>Show Coordinates</template>
          </button>
        </div>
        <template v-if="this.windowWidth >= 639">
          <div class="pure-u-1">
            <table
              class="pure-table pure-table-horizontal"
              style="margin-left:auto; margin-right:auto; width: 100%;"
            >
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th>Start / Exit</th>
                  <th>Black Hole / Destination</th>
                  <th>Directions</th>
                  <th>Waypoint</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="leg of journey.legs()"
                  :key="leg.index"
                  :class="{'pure-table-odd': isOdd(leg.index) }"
                >
                  <td>{{ leg.index + 1 }}</td>
                  <td class="notranslate">{{ journey.desc(leg.start) }}</td>
                  <td class="notranslate">{{ journey.desc(leg.dest) }}</td>
                  <td>{{ leg.description }}</td>
                  <td>
                    <template v-if="showCoordinates">{{ leg.dest.coords }}</template>
                    <template v-else>
                      <span class="galactic-coordinates">
                        <big>
                          <big>
                            <big>{{leg.dest.coords.galacticCoordinates(0).toUpperCase()}}</big>
                          </big>
                        </big>
                      </span>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template v-else>
          <div class="pure-u-1">
            <table class="pure-table no-border" style=" width: 100%;">
              <tr
                v-for="leg of journey.legs()"
                :key="leg.index"
                :class="{'pure-table-odd': isOdd(leg.index) }"
              >
                <td class="no-padding no-border">
                  <table class="pure-table no-border">
                    <tr>
                      <td class="key-cell">Flight</td>
                      <td class="value-cell">{{ leg.index + 1 }}</td>
                    </tr>
                    <tr>
                      <td class="key-cell">
                        <template v-if="leg.index === 0">Start</template>
                        <template v-else>Exit</template>
                      </td>
                      <td class="value-cell notranslate">{{ journey.desc(leg.start) }}</td>
                    </tr>
                    <tr>
                      <td class="key-cell">
                        <template v-if="leg.index >= journey.legs().last().index">Destination</template>
                        <template v-else>Black&nbsp;Hole</template>
                      </td>
                      <td class="value-cell notranslate">{{ journey.desc(leg.dest) }}</td>
                    </tr>
                    <tr>
                      <td class="key-cell">Directions</td>
                      <td class="value-cell">{{ leg.description }}</td>
                    </tr>

                    <tr>
                      <td class="key-cell">Waypoint</td>
                      <td class="value-cell">
                        <template v-if="showCoordinates">{{ leg.dest.coords }}</template>
                        <template v-else>
                          <span
                            class="galactic-coordinates-mobile"
                          >{{leg.dest.coords.galacticCoordinates(0).toUpperCase().slice(0,6)}}</span>
                          <br>
                          <span
                            class="galactic-coordinates-mobile"
                          >{{leg.dest.coords.galacticCoordinates(0).toUpperCase().slice(6,12)}}</span>
                        </template>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </template>
        <!-- </div>
        <div class="pure-g">-->
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { routeEvents, IRouteSubmit } from "../bus/RouteEvents";
import {
    coordinates,
    Coordinates,
    TripAdvisor,
    ITripStatus,
    routeCalculator,
    Hop,
    validHops,
    Platform,
    CancelledError,
    Explanation,
    ILegOfJourney,
} from "common";

interface IMessage {
    type: string;
    text: string;
}

export default Vue.extend({
    data(): {
        route: IRouteSubmit | null;
        ta: TripAdvisor | null;
        journey: Explanation | null;
        showCoordinates: Boolean;
        messages: IMessage[];
        windowWidth: number;
    } {
        return {
            route: null,
            ta: null,
            journey: null,
            showCoordinates: false,
            messages: [
                /* { type: "warning", text: "This is dynamically generated." }*/
            ],
            windowWidth: -1,
        };
    },
    methods: {
        toggleShowCoordinates() {
            this.showCoordinates = !this.showCoordinates;
        },
        onRouteSubmit(event: IRouteSubmit) {
            this.route = event;
            this.messages = [];
        },

        isOdd(v: number): boolean {
            return v % 2 !== 0;
        },

        async calculateTrip(route: IRouteSubmit) {
            try {
                const startDist = Math.floor(route.start.dist * 400);
                const destDist = Math.floor(route.dest.dist * 400);
                const delta = Math.abs(startDist - (destDist + 20000));

                if (delta >= 30000) {
                    this.messages.unshift({
                        type: "warning",
                        text:
                            `Start is ${startDist.toLocaleString()} LY from center. ` +
                            `Destination is ${destDist.toLocaleString()} LY from center. ` +
                            `For best results, find a start location that is about ${(destDist + 20000).toLocaleString()} LY from center, ` +
                            `plus or minus about ${(20000).toLocaleString()} LY.`,
                    });
                }

                if (this.ta !== null) {
                    if (!this.ta.hasRoute) {
                        this.ta!.status.cancelled = true;
                    }
                    this.ta = null;
                    this.$forceUpdate();
                }

                const platformFilter: (hop: Hop) => boolean = (function() {
                    if (route.platform == "ps4") {
                        return (hop: Hop) => {
                            return hop.platform === Platform.PS4;
                        };
                    } else {
                        return (hop: Hop) => {
                            return hop.platform === Platform.PC || hop.platform === Platform.XBOX;
                        };
                    }
                })();

                const allHops: Hop[] = validHops()
                    .filter(platformFilter)
                    .filter(hop => hop.galaxy === route.galaxy);

                const status: ITripStatus = { cancelled: false, tries: 0 };
                this.ta = new TripAdvisor(
                    routeCalculator(allHops, route.maxJump, route.optimization, 1.0),
                    { label: "start", coords: route.start },
                    { label: "destination", coords: route.dest },
                    status
                );

                const r = await this.ta!.route();
                this.journey = await this.ta.explanation();

                for (const leg of this.journey.legs()) {
                    console.log(leg.description);
                }

                const fuelCalc = routeCalculator(allHops, route.maxJump, "fuel", 1.0);
                const timeCalc = routeCalculator(allHops, route.maxJump, "time", 1.0);

                const hyperjumps = fuelCalc(status, { width: 0, depth: 0, ifScore: null }).calculateScore(r.start, r.destination, r.hops);
                const timeCost = timeCalc(status, { width: 0, depth: 0, ifScore: null }).calculateScore(r.start, r.destination, r.hops);

                this.messages.unshift({
                    type: "information",
                    text: `Estimated ${hyperjumps.toLocaleString()} hyperspace jumps in ${Math.ceil((62 / 38) * timeCost).toLocaleString()} minutes.`,
                });
            } catch (e) {
                if (!(e instanceof CancelledError)) {
                    console.log(e);
                }
            }
        },

        windowResizeEvent(ev: UIEvent) {
            this.windowWidth = window.innerWidth;
        },
    },
    watch: {
        route() {
            if (this.route !== null) {
                this.calculateTrip(this.route);
            }
        },
    },
    mounted() {
        console.log("MOUNTED");
        routeEvents.listenRouteSubmit(this.onRouteSubmit);

        this.windowWidth = window.innerWidth;
        window.addEventListener("resize", this.windowResizeEvent);
    },

    beforeDestroy() {
        window.removeEventListener("resize", this.windowResizeEvent);
    },
});
</script>

<style scoped lang="scss">
div.outer-div {
    margin-top: 30px;
    text-align: center;
    padding: 10px;
    //border: 1px solid #ccc;
    //box-shadow: 0px 3px 6px #ccc;
}

@font-face {
    font-family: "nms-glyph";
    src: url("/blackholesuns/NMS-Glyphs-Mono.ttf") format("truetype");
}

span.galactic-coordinates {
    font-family: "nms-glyph";
    font-size: large;
}

span.galactic-coordinates-mobile {
    font-family: "nms-glyph";
    font-size: x-large;
}

.message {
    text-align: center;
    padding: 10px;
}
.information {
    color: blue;
    background-color: #e4e8ff;
}

.warning {
    color: red;
    background-color: #ffc0c1;
}

.no-padding {
    padding: 0px;
}

.no-border {
    border-style: none;
}

td.key-cell {
    font-weight: bold;
    //text-transform: uppercase;
    text-align: right;
    border-style: none;
    vertical-align: text-top;
}

td.value-cell {
    text-align: left;
    border-style: none;
    vertical-align: text-top;
}

// @media screen and (max-width: 12000px) {
//     table {
//         border: 0;
//     }

//     table thead {
//         display: none;
//     }

//     table tr {
//         border-bottom: 3px solid #ddd;
//         display: block;
//         margin-bottom: 0.625em;
//     }

//     table td {
//         border-bottom: 1px solid #ddd;
//         display: block;
//         font-size: 0.8em;
//         text-align: right;
//     }

//     table td:before {
//         content: attr(data-label);
//         float: left;
//         font-weight: bold;
//         text-transform: uppercase;
//     }
//     table td:last-child {
//         border-bottom: 0;
//     }
// }
</style>
