<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <navigator msg="Get Me There!"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Navigator from "./components/Navigator.vue";

export default Vue.extend({
    name: "app",
    components: {
        Navigator,
    },
});
</script>

<style lang="scss">
#app {
    //font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    //text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    margin-bottom: 60px;
    margin-left: 40px;
    margin-right: 40px;
}
</style>
