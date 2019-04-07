<template>
  <div class="outer-div">
    <div v-if="ta === null">&nbsp;</div>
    <div v-else-if="!ta.hasRoute">
      <!-- <p>{{ start }}</p>
      <p>{{ dest }}</p>-->
      <h4 style="text-align: center;">...thinking...</h4>
    </div>
    <div v-else>
      <table class="pure-table pure-table-horizontal" style="margin-left:auto; margin-right:auto;">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Start</th>
            <th>Destination</th>
            <th>Directions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="leg of journey.legs()" :class="{'pure-table-odd': isOdd(leg.index) }">
            <td>{{ leg.index }}</td>
            <td>{{ journey.desc(leg.start) }}</td>
            <td>{{ journey.desc(leg.dest) }}</td>
            <td>{{ leg.description }}</td>
          </tr>
        </tbody>
      </table>
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

export default Vue.extend({
    data(): { route: IRouteSubmit | null; ta: TripAdvisor | null; journey: Explanation | null } {
        console.log("getting DATA!!!!!!!!!!!");
        return {
            route: null,
            ta: null,
            journey: null,
        };
    },
    methods: {
        onRouteSubmit(event: IRouteSubmit) {
            console.log("on route submit");
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
                    routeCalculator(allHops, 2000, 0.93),
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
</style>
