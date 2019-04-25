<template>
  <div class="outer-div" style="text-align: center;">
    <div style="display: inline-block;">
      <form
        class="pure-form pure-form-stacked"
        style="text-align: left;"
        @submit.prevent="submitForm"
      >
        <div class="pure-g">
          <fieldset class="pure-u-1-2">
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
              <!-- <span class="pure-form-message-inline">This is a required field. BLAH</span> -->
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
          <fieldset class="pure-u-1-2">
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
                <option v-for="g of allGalaxies()" :key="g" :value="g">{{ g }}</option>
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { coordinates, Platform, validHops, reCoordInput } from "common";
import { routeEvents } from "../bus/RouteEvents";
import { List } from "immutable";

export default Vue.extend({
    data() {
        return {
            coordPattern: reCoordInput,
            formData: {
                startVal: "",
                destVal: "",
                galaxy: "01 Euclid",
                platform: "ps4",
                maxJump: "2000",
                optimization: "time",
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
            this.formatCoordinates();

            routeEvents.raiseRouteSubmit({
                platform: this.formData.platform,
                galaxy: this.formData.galaxy,
                maxJump: parseInt(this.formData.maxJump, 10),
                optimization: this.formData.optimization,
                start: coordinates(this.formData.startVal),
                dest: coordinates(this.formData.destVal),
            });
        },
        allGalaxies(): List<string> {
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

button.button-secondary {
    background: rgb(66, 184, 221) !important; /* this is a light blue */
}
</style>
