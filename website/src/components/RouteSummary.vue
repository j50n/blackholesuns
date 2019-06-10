

<template>
  <div class="pure-u-1 route-summary">
    <template v-if="expl != null">
      <table class="pure-table no-border" style=" width: 100%;">
        <tr>
          <th colspan="2">ROUTE SUMMARY</th>
        </tr>

        <!-- <tr>
          <th colspan="2">{{ JSON.stringify(expl.first) }} {{ JSON.stringify(expl.last) }}</th>
        </tr>-->
        <tr>
          <td class="key-cell">Direct</td>
          <td
            class="value-cell"
          >{{ expl.directDistanceLY().toLocaleString() }}&nbsp;LY, or {{ expl.directJumps().toLocaleString() }}&nbsp;jumps</td>
        </tr>
        <tr>
          <td class="key-cell">Using&nbsp;DaRC</td>
          <td class="value-cell">{{ expl.journeyJumps().toLocaleString() }}&nbsp;jumps</td>
        </tr>
        <!-- <template v-if="!isNaN(expl.speedup())">
          <tr>
            <td class="key-cell">Speedup</td>
            <td
              class="value-cell"
            >{{Math.floor(expl.speedup() * 100).toLocaleString()}}%&nbsp;faster</td>
          </tr>
        </template>-->
        <tr>
          <td class="key-cell">Jump&nbsp;Reduction</td>
          <td class="value-cell">{{(expl.hyperjumpReduction() * 100).toFixed(2)}}%</td>
        </tr>
        <tr>
          <td class="key-cell">Cornell Index</td>
          <td
            class="value-cell"
          >{{ expl.journeyBlackHoles().toLocaleString() }}&nbsp;Black&nbsp;Holes</td>
        </tr>

        <!-- <tr>
          <td class="key-cell">CORNELL INDEX (Number of Black Holes used for route)</td>
          <td class="value-cell">5</td>
        </tr>-->

        <!-- <tr
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
        </tr>-->
      </table>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Explanation } from "../utility/explanation";

export default Vue.extend({
    name: "route-summary",
    props: ["explanation"],
    data(): {} {
        return {};
    },
    computed: {
        expl(): null | Explanation {
            return this.explanation;
        },
    },
});
</script>

<style scoped lang="scss">
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

@media screen and (min-width: 700px) {
    td.key-cell {
        width: 50%;
    }
}
</style>