import Vue from "vue";
const routeEvents = new Vue({
    methods: {
        raiseRouteSubmit(event) {
            this.$emit("route-submit", event);
        },
        listenRouteSubmit(listener) {
            this.$on("route-submit", listener);
        },
        unlistenRouteSubmit(listener) {
            this.$off("route-submit", listener);
        },
    },
});
export { routeEvents };
//# sourceMappingURL=RouteEvents.js.map