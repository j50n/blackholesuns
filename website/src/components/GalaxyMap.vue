<template>
    <svg
        x="0"
        y="0"
        height="99%"
        viewBox="-100 -100 4296 4296"
        preserveAspectRatio="xMidYMid meet"
        style="max-height: 300px; min-width: 250px;"
    >
        <title>Reality</title>
        <!-- <rect x="0" y="0" width="4095" height="4095" fill="none" stroke="lightgrey" stroke-width="7"></rect> -->
        <circle cx="2047" cy="2047" r="2047" fill="none" stroke="lightgrey" stroke-width="7" />

        <template v-for="[legA, legB] of explLegs.zip(explLegs.slice(1))">
            <line
                :key="`JUMP|${legA.dest.coords.toString()}|${legB.start.coords.toString()}`"
                :x1="legA.dest.coords.x"
                :y1="legA.dest.coords.z"
                :x2="legB.start.coords.x"
                :y2="legB.start.coords.z"
                stroke="black"
                stroke-width="40"
                stroke-linecap="round"
                opacity="0.3"
            />
        </template>
        <template v-for="leg of explLegs">
            <line
                :key="`HYPERSPACE|${leg.start.coords.toString()}|${leg.dest.coords.toString()}`"
                :x1="leg.start.coords.x"
                :y1="leg.start.coords.z"
                :x2="leg.dest.coords.x"
                :y2="leg.dest.coords.z"
                stroke="darkred"
                stroke-width="40"
                stroke-linecap="round"
                opacity="0.3"
            />
        </template>
        <template v-if="!explLegs.isEmpty()">
            <circle
                :cx="explLegs.first().start.coords.x"
                :cy="explLegs.first().start.coords.z"
                r="80"
                fill="none"
                stroke="green"
                stroke-width="20"
            />
        </template>
        <template v-if="!explLegs.isEmpty()">
            <circle
                :cx="explLegs.last().dest.coords.x"
                :cy="explLegs.last().dest.coords.z"
                r="80"
                fill="none"
                stroke="red"
                stroke-width="20"
            />
        </template>
        <template v-for="bh of bhs">
            <circle :cx="bh.x" :cy="bh.z" r="15" fill="blue" :key="bh.toString()" opacity="0.5" />
        </template>
        <template v-for="ex of exs">
            <circle
                :cx="ex.x"
                :cy="ex.z"
                r="15"
                fill="darkorange"
                :key="ex.toString()"
                opacity="0.5"
            />
        </template>
    </svg>
</template>

<script lang="ts">
import Vue from "vue";
import { Coordinates } from "common";
import { List, OrderedMap } from "immutable";
import { Explanation, ILegOfJourney } from "../utility/explanation";

export default Vue.extend({
    name: "galaxy-map",

    props: ["blackholes", "exits", "explanation"],

    methods: {},

    computed: {
        explLegs(): List<ILegOfJourney> {
            if (!this.explanation) {
                return List([]);
            } else {
                return (this.explanation as Explanation).legs();
            }
        },

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
