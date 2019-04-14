<template>
  <div>
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
                <th colspan="2">Directions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="leg of journey.legs()" :class="{'pure-table-odd': isOdd(leg.index) }">
                <td>{{ leg.index }}</td>
                <td>{{ journey.desc(leg.start) }}</td>
                <td>{{ journey.desc(leg.dest) }}</td>
                <td>{{ leg.description }}</td>
                <td style="text-align: center;">
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
        <!-- </div>
        <div class="pure-g">-->
      </div>
    </template>
    <div class="pure-g">
      <div
        v-for="message of messages"
        :class="[message.type, 'message', 'pure-u-1-1']"
      >{{message.text}}</div>
    </div>
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
    data(): { route: IRouteSubmit | null; ta: TripAdvisor | null; journey: Explanation | null; showCoordinates: Boolean; messages: IMessage[] } {
        return {
            route: null,
            ta: null,
            journey: null,
            showCoordinates: false,
            messages: [
                /* { type: "warning", text: "This is dynamically generated." }*/
            ],
        };
    },
    methods: {
        toggleShowCoordinates() {
            this.showCoordinates = !this.showCoordinates;
        },
        onRouteSubmit(event: IRouteSubmit) {
            this.route = event;
        },

        isOdd(v: number): boolean {
            return v % 2 !== 0;
        },

        async calculateTrip(route: IRouteSubmit) {
            try {
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
            } catch (e) {
                if (!(e instanceof CancelledError)) {
                    console.log(e);
                }
            }
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
</style>
