<template>
    <div class="hello">
        <h1 style="margin-bottom: 0px; padding-bottom: 0px;">Black&nbsp;Hole&nbsp;Suns DaRC&nbsp;Web</h1>
        <div style="text-align: center;">
            <sub>Distance and Route Calculator</sub>
        </div>

        <travel-request-form />
        <!-- <route-finder/> -->

        <!-- <p style="text-align: center;">
      <a href="https://guide.blackholesuns.com/" target="_blank" rel="noopener">Travel Guide</a>
        </p>-->
        <div style="text-align: center;">
            <!-- <h3>NMS Black Hole Suns</h3> -->
            <ul>
                <li>
                    <a href="https://guide.blackholesuns.com/" target="_blank" rel="noopener">Guide</a>
                </li>
                <li>
                    <a
                        href="https://www.reddit.com/r/NMSBlackHoleSuns/"
                        target="_blank"
                        rel="noopener"
                    >Reddit</a>
                </li>
                <li>
                    <a
                        href="https://discord.blackholesuns.com"
                        target="_blank"
                        rel="noopener"
                    >Discord</a>
                </li>
                <li>
                    <a
                        href="https://data.blackholesuns.com"
                        target="_blank"
                        rel="noopener"
                    >Contribute</a>
                </li>
            </ul>
        </div>
        <div style="text-align: center;">
            <ul>
                <li>
                    <a
                        href="https://github.com/j50n/blackholesuns/"
                        target="_blank"
                        rel="noopener"
                    >Project</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { coordinates } from "common";
import TravelRequestForm from "./TravelRequestForm.vue";
// import RouteFinder from "./RouteFinder.vue";

export default Vue.extend({
    // name: "HelloWorld",
    props: {
        msg: String,
    },
    data() {
        return {
            // someplace: coordinates("0123:0080:0246:0079")
        };
    },
    components: {
        TravelRequestForm,
        // RouteFinder,
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
