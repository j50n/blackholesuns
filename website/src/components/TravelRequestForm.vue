<template>
  <div class="outer-div" style="text-align: center;">
    <div style="display: inline-block;">
      <form
        class="pure-form pure-form-stacked"
        style="text-align: left;"
        @submit.prevent="submitForm"
      >
        <fieldset>
          <div class="pure-controls" style="display: inline-block; margin-right: 10px;">
            <label for="platform">Platform</label>
            <select id="platform" required v-model="formData.platform">
              <option value="ps4">PS4</option>
              <option value="xbox">PC / XBox</option>
            </select>
          </div>
          <div class="pure-controls" style="display: inline-block;">
            <label for="galaxy">Galaxy</label>
            <select id="galaxy" required v-model="formData.galaxy">
              <option v-for="g of allGalaxies()" v-bind:value="g">{{ g }}</option>
            </select>
          </div>
        </fieldset>
        <fieldset>
          <div class="pure-control-group">
            <label for="starting-coordinates">Start</label>
            <input
              id="starting-coordinates"
              type="text"
              v-model.trim="formData.startVal"
              :pattern="coordPattern"
              required
              placeholder="Start"
            >
            <!-- <span class="pure-form-message-inline">This is a required field. BLAH</span> -->
          </div>
          <div class="pure-control-group">
            <label for="destination-coordinates">Destination</label>
            <input
              id="destination-coordinates"
              type="text"
              v-model.trim="formData.destVal"
              :pattern="coordPattern"
              required
              placeholder="Destination"
            >
          </div>
        </fieldset>
        <div class="pure-controls">
          <button button="pure-button pure-button-primary">Go!</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { coordinates, Platform, validHops } from "common";
import { routeEvents } from "../bus/RouteEvents";
import { List } from "immutable";

export default Vue.extend({
    data() {
        return {
            coordPattern: "0?[0-9a-fA-F]{1,3}:0?0?[0-9a-fA-F]{1,2}:0?[0-9a-fA-F]{1,3}:0?[0-2]?0?[0-9a-fA-F]{1,3}",
            formData: {
                startVal: "",
                destVal: "",
                galaxy: "",
                platform: "",
            },
        };
    },

    watch: {
        formData: {
            handler() {
                window.localStorage.setItem("TravelRequestForm_FormData", JSON.stringify(this.formData));
            },
            deep: true,
        },
    },

    mounted() {
        if (window.localStorage.getItem("TravelRequestForm_FormData")) {
            this.formData = JSON.parse(window.localStorage.getItem("TravelRequestForm_FormData")!);
        }
    },

    methods: {
        submitForm() {
            routeEvents.raiseRouteSubmit({
                platform: this.formData.platform,
                galaxy: this.formData.galaxy,
                start: coordinates(this.formData.startVal),
                dest: coordinates(this.formData.destVal),
            });
        },
        allGalaxies(): List<String> {
            return List(validHops().map(hop => hop.galaxy))
                .toSet()
                .toList()
                .sort();
        },
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div.outer-div {
    margin-top: 30px;
    //text-align: left;
    padding: 10px;
    //border: 1px solid #ccc;
    //box-shadow: 0px 3px 6px #ccc;
}
</style>
