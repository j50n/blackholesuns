import { Coordinates } from "common";
import Vue from "vue";

interface IRouteSubmit {
    platform: string;
    galaxy: string;
    start: Coordinates;
    dest: Coordinates;
}

const routeEvents = new Vue({
    methods: {
        raiseRouteSubmit(event: IRouteSubmit): void {
            this.$emit("route-submit", event);
        },

        listenRouteSubmit(listener: (event: IRouteSubmit) => void): void {
            this.$on("route-submit", listener);
        },

        unlistenRouteSubmit(listener: (event: IRouteSubmit) => void): void {
            this.$off("route-submit", listener);
        },
    },
});

export { IRouteSubmit, routeEvents };
