<template>
  <div class="hello">
    <h1 style="margin-bottom: 0px; padding-bottom: 0px;">Black&nbsp;Hole&nbsp;Suns DaRC&nbsp;Web</h1>
    <div style="text-align: center;">
      <sub>Distance and Route Calculator</sub>
    </div>
    <!-- <form class="pure-form pure-form-aligned">
      <div>
        <input type="text">
      </div>
      <div>
        <input type="text">
      </div>
      <button button="pure-button pure-button-primary">Find Route</button>
    </form>-->

    <travel-request-form/>
    <route-finder/>

    <p style="text-align: center;">
      <a
        href="https://github.com/j50n/blackholesuns/"
        target="_blank"
        rel="noopener"
      >Project on Github</a>
    </p>
    <!-- <h3>Installed CLI Plugins</h3>
    <ul>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
          target="_blank"
          rel="noopener"
        >babel</a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript"
          target="_blank"
          rel="noopener"
        >typescript</a>
      </li>
    </ul>-->
    <div style="text-align: center;">
      <h3>NMS Black Hole Suns</h3>
      <ul>
        <li>
          <a
            href="https://www.reddit.com/r/NMSBlackHoleSuns/"
            target="_blank"
            rel="noopener"
          >Read on Reddit</a>
        </li>
        <li>
          <a
            href="https://discord.blackholesuns.com"
            target="_blank"
            rel="noopener"
          >Discuss on Discord</a>
        </li>
      </ul>
    </div>
    <!-- <h3>Ecosystem</h3>
    <ul>
      <li>
        <a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a>
      </li>
      <li>
        <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-devtools#vue-devtools"
          target="_blank"
          rel="noopener"
        >vue-devtools</a>
      </li>
      <li>
        <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a>
      </li>
      <li>
        <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a>
      </li>
    </ul>-->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { coordinates } from "common";
import TravelRequestForm from "./TravelRequestForm.vue";
import RouteFinder from "./RouteFinder.vue";

export default Vue.extend({
    //name: "HelloWorld",
    props: {
        msg: String,
    },
    data() {
        return {
            //someplace: coordinates("0123:0080:0246:0079")
        };
    },
    components: {
        TravelRequestForm,
        RouteFinder,
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
    text-align: center;
}
h4 {
    text-align: center;
}
h5 {
    text-align: center;
}
h3 {
    margin: 40px 0 0;
    text-align: center;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
