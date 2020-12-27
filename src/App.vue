<template>
    <main>
        <Level :level="level" />
        <Timer />
        <Buffer />
        <Matrix v-on:won="level++" v-on:lost="lost = true" />
        <Start :level="level" v-on:start="nextLevel" />
    </main>
</template>

<script lang="ts">
    import {defineComponent, provide, ref} from "vue";
    import Level from "./components/Level.vue";
    import Timer from "./components/Timer.vue";
    import Buffer from "./components/Buffer.vue";
    import Matrix from "./components/Matrix.vue";
    import Start from "./components/Start.vue";
    import { Game } from "./game/Game";

    export default defineComponent({
        components: {
            Level,
            Timer,
            Buffer,
            Matrix,
            Start
        },
        setup() {
            const game = ref(new Game({
                matrix: [
                    "AA", "BB", "CC",
                    "DD", "AA", "BB",
                    "CC", "DD", "DD",
                ],
                sequences: [
                    ["AA", "CC", "DD"],
                ],
                maxBufferLength: 3,
                timeoutMilliseconds: 60_000,
            }));
            provide("game", game);
            const level = ref(0);
            const lost = ref(false);

            function nextLevel() {
                game.value = new Game({
                    matrix: [
                        "AA", "BB", "CC",
                        "DD", "AA", "BB",
                        "CC", "DD", "DD",
                    ],
                    sequences: [
                        ["DD", "CC", "AA"],
                    ],
                    maxBufferLength: 3,
                    timeoutMilliseconds: 60_000,
                });
            }

            return {
                level,
                lost,
                nextLevel
            }
        }
    });
</script>

<style lang="scss">
    @import "@/sass/main.scss";
</style>
