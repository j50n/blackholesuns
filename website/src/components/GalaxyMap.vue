<template>
  <svg
    x="0"
    y="0"
    height="99%"
    viewBox="-20 -20 4126 4126"
    preserveAspectRatio="xMidYMid meet"
    style="max-height: 300px; min-width: 250px;"
  >
    <title>Reality</title>
    <rect x="0" y="0" width="4095" height="4095" fill="none" stroke="lightgrey" stroke-width="7"></rect>
    <circle cx="2047" cy="2047" r="2047" fill="none" stroke="lightgrey" stroke-width="7"></circle>
    <template v-for="bh of bhs">
      <circle :cx="bh.x" :cy="bh.z" r="15" fill="blue" :key="bh.toString()" opacity="0.5"></circle>
    </template>
    <template v-for="ex of exs">
      <circle :cx="ex.x" :cy="ex.z" r="15" fill="darkorange" :key="ex.toString()" opacity="0.5"></circle>
    </template>
  </svg>
</template>

<script lang="ts">
import Vue from "vue";
import { Coordinates } from "common";
import { List, OrderedMap } from "immutable";

export default Vue.extend({
    name: "galaxy-map",

    props: ["blackholes", "exits"],

    methods: {},

    computed: {
        bhs(): Coordinates[] {
            const bhs: Coordinates[] = this.blackholes;

            let last = "";
            return List(bhs)
                .sortBy(it => it.toString())
                .filter(it => {
                    const result = it.toString() !== last;
                    last = it.toString();
                    return result;
                })
                .toArray();
        },

        exs(): Coordinates[] {
            const exs: Coordinates[] = this.exits;

            let last = "";
            return List(exs)
                .sortBy(it => it.toString())
                .filter(it => {
                    const result = it.toString() !== last;
                    last = it.toString();
                    return result;
                })
                .toArray();
        },
    },
});
</script>

<style scoped lang="scss">
</style>
