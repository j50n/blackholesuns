<template>
  <div class="outer-div" style="text-align: center;">
    <div style="display: inline-block;">
      <form
        class="pure-form pure-form-stacked"
        style="text-align: left;"
        @submit.prevent="submitForm"
      >
        <div class="pure-g">
          <fieldset class="pure-u-1-3">
            <div class="pure-control-group">
              <label for="starting-coordinates">Start</label>
              <input
                id="starting-coordinates"
                class="pure-input-rounded"
                type="text"
                v-model.trim="formData.startVal"
                :pattern="coordPattern"
                required
                placeholder="07FF:007F:07FF:017F"
                @blur="formatCoordinates"
              >
            </div>
            <div class="pure-control-group">
              <label for="destination-coordinates">Destination</label>
              <input
                id="destination-coordinates"
                type="text"
                class="pure-input-rounded"
                v-model.trim="formData.destVal"
                :pattern="coordPattern"
                required
                placeholder="07FF:007F:07FF:017F"
                @blur="formatCoordinates"
              >
            </div>
          </fieldset>
          <fieldset class="pure-u-1-3">
            <div class="pure-controls" style="display: inline-block;">
              <label for="platform">Platform</label>
              <select id="platform" required v-model="formData.platform">
                <option value="ps4">PS4</option>
                <option value="xbox">PC / XBox</option>
              </select>
            </div>
            <div class="pure-controls" style="display: inline-block;">
              <label for="galaxy">Galaxy</label>
              <select id="galaxy" required v-model="formData.galaxy">
                <option v-for="g of galaxies" :key="g[0]" :value="g[1]">{{ g[1] }}</option>
              </select>
            </div>
            <div class="pure-control-group">
              <label for="maximum-jump-range">Jump Range</label>
              <input
                id="maximum-jump-range"
                type="number"
                v-model.trim="formData.maxJump"
                required
                min="200"
                max="3000"
                placeholder="Jump Range"
              >
            </div>
            <div class="pure-control-group">
              <label for="optimize-time" class="pure-radio">
                <input
                  id="optimize-time"
                  type="radio"
                  name="options-optimization"
                  value="time"
                  v-model="formData.optimization"
                  required
                >
                Time
              </label>

              <label for="optimize-fuel" class="pure-radio">
                <input
                  id="optimize-fuel"
                  type="radio"
                  name="options-optimization"
                  value="fuel"
                  v-model="formData.optimization"
                  required
                >
                Fuel
              </label>
            </div>
          </fieldset>
          <transition name="fade" mode="out-in" appear>
            <div class="pure-u-1-3" style="min-width: 250px;" :key="graphCount">
              <galaxy-map :blackholes="bhs" :exits="exs" :explanation="journey"/>
            </div>
          </transition>
        </div>
        <div class="pure-g">
          <fieldset class="pure-u-1-2">
            <div class="pure-controls" style="text-align: right">
              <button button="pure-button-primary pure-button ">Go!</button>
            </div>
          </fieldset>
          <fieldset class="pure-u-1-2">&nbsp;</fieldset>
        </div>
      </form>
    </div>
    <!-- BEGINNING OF RESULTS TABLE -->
    <template>
      <div class="pure-g">
        <div
          v-for="message of messages"
          :key="message.key"
          :class="[message.type, 'message', 'pure-u-1-1']"
        >{{message.text}}</div>
      </div>
      <br>
      <div v-if="journey === null" class="pure-g">
        <div class="pure-u-1">&nbsp;</div>
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
                    <th>Custom Waypoint</th>
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
                              <big>
                                <span
                                  class="galactic-coordinates-mobile"
                                >{{leg.dest.coords.galacticCoordinates(0).toUpperCase().slice(0,4)}} {{leg.dest.coords.galacticCoordinates(0).toUpperCase().slice(4,8)}} {{leg.dest.coords.galacticCoordinates(0).toUpperCase().slice(8,12)}}</span>
                              </big>
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
                        <td class="key-cell">Route</td>
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
                        <td class="key-cell">Custom Waypoint</td>
                        <td class="value-cell">
                          <template v-if="showCoordinates">{{ leg.dest.coords }}</template>
                          <template v-else>
                            <span
                              class="galactic-coordinates-mobile"
                            >{{leg.dest.coords.galacticCoordinates(0).toUpperCase().slice(0,4)}} {{leg.dest.coords.galacticCoordinates(0).toUpperCase().slice(4,8)}} {{leg.dest.coords.galacticCoordinates(0).toUpperCase().slice(8,12)}}</span>
                          </template>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </template>
          <route-summary :explanation="journey"></route-summary>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { coordinates, Coordinates, reCoordInput, galaxies, Hop, Platform, dijkstraCalculator, DijkstraCalculator } from "common";
import { List } from "immutable";
import { blackholes } from "../utility/blackholes";
import { inputGalaxies, GalaxyTuple } from "../utility/generated";
import GalaxyMap from "./GalaxyMap.vue";
import RouteSummary from "./RouteSummary.vue";
import { Explanation, toJourney, IEndPoint } from "../utility/explanation";

interface IFormData {
    startVal: string;
    destVal: string;
    galaxy: string;
    platform: string;
    maxJump: string;
    optimization: string;
}

interface IRouteSubmit {
    platform: string;
    galaxy: string;
    maxJump: number;
    optimization: string;
    start: Coordinates;
    dest: Coordinates;
}

interface IMessage {
    key: number;
    type: string;
    text: string;
}

export default Vue.extend({
    components: { GalaxyMap, RouteSummary },

    data(): {
        graphCount: number;
        coordPattern: string;
        galaxies: GalaxyTuple[];
        bhs: Coordinates[];
        exs: Coordinates[];
        formData: any;
        route: IRouteSubmit | null;
        journey: Explanation | null;
        showCoordinates: Boolean;
        messages: IMessage[];
        messageKey: number;
        windowWidth: number;
    } {
        return {
            graphCount: 0,
            coordPattern: reCoordInput,
            galaxies: inputGalaxies,
            bhs: [] as Coordinates[],
            exs: [] as Coordinates[],
            formData: {
                startVal: "",
                destVal: "",
                galaxy: "01 Euclid",
                platform: "ps4",
                maxJump: "2000",
                optimization: "time",
            },
            route: null,
            journey: null,
            showCoordinates: false,
            messages: [],
            messageKey: 0,
            windowWidth: -1,
        };
    },

    watch: {
        formData: {
            handler() {
                const prev = this.getFormData();

                window.localStorage.setItem("TravelRequestForm_FormData", JSON.stringify(this.formData));

                if (prev !== null) {
                    if (prev!.galaxy !== this.formData.galaxy || prev!.platform !== this.formData.platform) {
                        this.updateHopData();
                        this.journey = null;
                        this.messages = [];
                    }
                }
            },
            deep: true,
        },

        route() {
            if (this.route !== null) {
                this.calculateTrip(this.route);
            }
        },
    },

    beforeDestroy() {
        window.removeEventListener("resize", this.windowResizeEvent);
    },

    mounted() {
        console.log("TravelRequestForm mounted");

        this.windowWidth = window.innerWidth;
        window.addEventListener("resize", this.windowResizeEvent);

        const formData = this.getFormData();
        if (formData) {
            this.formData = formData;
        }

        this.updateHopData();
    },

    methods: {
        toggleShowCoordinates() {
            this.showCoordinates = !this.showCoordinates;
        },

        isOdd(v: number): boolean {
            return v % 2 !== 0;
        },

        getFormData(): IFormData | null {
            if (window.localStorage.getItem("TravelRequestForm_FormData")) {
                return JSON.parse(window.localStorage.getItem("TravelRequestForm_FormData")!);
            } else {
                return null;
            }
        },

        updateHopData(): void {
            const formData = this.getFormData();
            if (formData !== null) {
                if (formData! && formData!.galaxy.trim().length > 0 && formData.platform.trim().length > 0) {
                    const localHops = blackholes().then(bhs =>
                        bhs
                            .filter(hop => {
                                return hop.galaxy === formData!.galaxy;
                            })
                            .filter(hop => {
                                function tranlateHopPlatform(): number {
                                    if (hop.platform === "PC") {
                                        return 1;
                                    } else if (hop.platform === "PS4") {
                                        return 2;
                                    } else {
                                        throw new RangeError(hop.platform);
                                    }
                                }

                                function translateInputPlatform(): number {
                                    if (formData!.platform === "xbox") {
                                        return 1;
                                    } else if (formData!.platform === "ps4") {
                                        return 2;
                                    } else {
                                        throw new RangeError(formData!.platform);
                                    }
                                }

                                return tranlateHopPlatform() === translateInputPlatform();
                            })
                    );
                    localHops.then(hops => {
                        this.bhs = hops.map(h => h.blackhole.coords).toArray();
                        this.exs = hops.map(h => h.exit.coords).toArray();
                        this.graphCount += 1;
                    });
                }
            }
        },

        formatCoordinates() {
            function fc(coor: string): string | null {
                try {
                    const c = coordinates(coor);
                    return c.toString();
                } catch (e) {
                    return null;
                }
            }

            this.formData.startVal = fc(this.formData.startVal) || this.formData.startVal;
            this.formData.destVal = fc(this.formData.destVal) || this.formData.destVal;
        },

        submitForm() {
            this.graphCount += 1;

            this.formatCoordinates();
            this.messages = [];

            this.route = {
                platform: this.formData.platform,
                galaxy: this.formData.galaxy,
                maxJump: parseInt(this.formData.maxJump, 10),
                optimization: this.formData.optimization,
                start: coordinates(this.formData.startVal),
                dest: coordinates(this.formData.destVal),
            };
        },

        async calculateTrip(route: IRouteSubmit) {
            this.journey = null;

            if (route.start.dist2Center() * 400 < 3000) {
                this.messages.unshift({
                    key: this.messageKey++,
                    type: "warning",
                    text: "Start appears to be invalid. That point is in the void at the center of the galaxy.",
                });
                return;
            }

            if (route.dest.dist2Center() * 400 < 3000) {
                this.messages.unshift({
                    key: this.messageKey++,
                    type: "warning",
                    text: "Destination appears to be invalid. That point is in the void at the center of the galaxy.",
                });
                return;
            }

            const startDist = Math.floor(route.start.dist2Center() * 400);
            const destDist = Math.floor(route.dest.dist2Center() * 400);
            const delta = Math.abs(startDist - (destDist + 20000));

            if (delta >= 30000) {
                this.messages.unshift({
                    key: this.messageKey++,
                    type: "warning",
                    text:
                        `Start is ${startDist.toLocaleString()} LY from center. ` +
                        `Destination is ${destDist.toLocaleString()} LY from center. ` +
                        `For best results, find a start location that is ` +
                        `just a little further away from center than the destination.`,
                });
            }

            const platformFilter: (hop: Hop) => boolean = (function() {
                if (route.platform == "ps4") {
                    return (hop: Hop) => {
                        return hop.platform === Platform.PS4;
                    };
                } else {
                    return (hop: Hop) => {
                        return hop.platform === Platform.PC;
                    };
                }
            })();

            const allHops: Hop[] = (await blackholes())
                .filter(platformFilter)
                .filter(hop => hop.galaxy === route.galaxy)
                .toArray();

            const shortest = dijkstraCalculator(allHops, route.maxJump, route.optimization).findRoute([{ label: "start", coords: route.start }], {
                label: "destination",
                coords: route.dest,
            })[0];

            this.journey = new Explanation(route.maxJump, toJourney(List(shortest.route)));
            console.log(this.journey);

            for (const leg of this.journey.legs()) {
                console.log(leg.description);
            }

            const direct = dijkstraCalculator([], route.maxJump, route.optimization).findRoute([{ label: "start", coords: route.start }], {
                label: "destination",
                coords: route.dest,
            })[0];
            if (route.optimization === "fuel") {
                this.messages.unshift({
                    key: this.messageKey++,
                    type: "information",
                    text: `Estimate: This route uses ${shortest.score} fuel. The direct route would use ${direct.score} fuel.`,
                });
            } else {
                const MinutesPerPoint = 62 / 38;

                this.messages.unshift({
                    key: this.messageKey++,
                    type: "information",
                    text:
                        `Estimate: ` +
                        `This route will take ${Math.round(MinutesPerPoint * shortest.score).toLocaleString()} minutes. ` +
                        `The direct route would take ${Math.round(MinutesPerPoint * direct.score).toLocaleString()} minutes.`,
                });
            }
        },

        windowResizeEvent(ev: UIEvent) {
            this.windowWidth = window.innerWidth;
        },
    },
});
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

div.outer-div {
    margin-top: 30px;
    padding: 10px;
}

button.button-secondary {
    background: rgb(66, 184, 221) !important; /* this is a light blue */
}

div.outer-div {
    margin-top: 30px;
    text-align: center;
    padding: 10px;
}

span.galactic-coordinates {
    font-family: "nms-glyph";
    font-size: large;
}

span.galactic-coordinates-mobile {
    font-family: "nms-glyph";
    font-size: xx-large;
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
    text-align: right;
    border-style: none;
    vertical-align: text-top;
}

td.value-cell {
    text-align: left;
    border-style: none;
    vertical-align: text-top;
}
</style>
