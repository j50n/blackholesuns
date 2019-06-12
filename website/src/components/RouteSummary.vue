

<template>
  <div class="pure-u-1 route-summary">
    <template v-if="expl != null">
      <table class="pure-table no-border" style=" width: 100%;">
        <thead>
          <tr>
            <th colspan="2">Route Summary</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="key-cell">Direct&nbsp;Route</td>
            <td class="value-cell">
              {{ expl.directDistanceLY().toLocaleString() }}&nbsp;LY, {{ expl.directJumps().toLocaleString() }}&nbsp;jumps
              <span
                v-if="est !== null"
              >in&nbsp;{{ directTimeFormatted }}&nbsp;minutes</span>
            </td>
          </tr>
          <tr>
            <td class="key-cell">Using&nbsp;DaRC</td>
            <td class="value-cell">
              {{ expl.journeyJumps().toLocaleString() }}&nbsp;jumps
              <span
                v-if="est !== null"
              >in&nbsp;{{ routeTimeFormatted }}&nbsp;minutes</span>
            </td>
          </tr>
          <tr>
            <td class="key-cell">Reduction</td>
            <td class="value-cell">
              {{(expl.hyperjumpReduction() * 100).toFixed(2)}}%&nbsp;fewer&nbsp;jumps,
              <span>{{(timeReduction * 100).toFixed(2)}}%&nbsp;less&nbsp;time</span>
            </td>
          </tr>
          <tr>
            <td class="key-cell">Cornell&nbsp;Index</td>
            <td
              class="value-cell"
            >{{ expl.journeyBlackHoles().toLocaleString() }}&nbsp;Black&nbsp;Holes</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Explanation } from "../utility/explanation";

export interface ITimeEstimate {
    route: number;
    direct: number;
}

export default Vue.extend({
    name: "route-summary",
    props: ["explanation", "estimate"],
    data(): {} {
        return {};
    },
    computed: {
        expl(): null | Explanation {
            return this.explanation;
        },

        est(): null | ITimeEstimate {
            return this.estimate;
        },

        routeTimeFormatted(): string {
            return Math.round((this.est || { route: 0, direct: 0 }).route).toLocaleString();
        },

        directTimeFormatted(): string {
            return Math.round((this.est || { route: 0, direct: 0 }).direct).toLocaleString();
        },

        timeReduction(): number {
            return 1 - this.est!.route / this.est!.direct;
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