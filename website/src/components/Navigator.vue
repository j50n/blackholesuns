<template>
  <div class="hello">
    <h1>DARC Web Navigator</h1>

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
      Visit the
      <a
        href="https://www.reddit.com/r/NMSBlackHoleSuns/"
        target="_blank"
        rel="noopener"
      >NMSBlackHoleSuns on Reddit</a>.
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
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a>
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a>
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a>
      </li>
      <li>
        <a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a>
      </li>
    </ul>
    <h3>Ecosystem</h3>
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
