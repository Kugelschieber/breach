<template>
    <main>
        <Level :level="level" />
        <Timer />
        <Buffer />
        <Matrix />
    </main>
</template>

<script lang="ts">
    import {defineComponent, provide, ref, readonly} from "vue";
    import Level from "./components/Level.vue";
    import Timer from "./components/Timer.vue";
    import Buffer from "./components/Buffer.vue";
    import Matrix from "./components/Matrix.vue";
    import { Game } from "./game/Game";

    export default defineComponent({
        components: {
            Level,
            Timer,
            Buffer,
            Matrix
        },
        setup() {
            const game = new Game({
                matrix: [
                    "AA", "BB", "CC",
                    "DD", "AA", "BB",
                    "CC", "DD", "AA",
                ],
                sequences: [
                    ["AA", "CC", "DD"],
                ],
                maxBufferLength: 3,
                timeoutMilliseconds: 60_000,
            });
            const level = ref(1);
            const remainingMilliseconds = ref(game.remainingMilliseconds);
            const timeoutMilliseconds = ref(game.timeoutMilliseconds);
            const maxBufferLength = ref(game.maxBufferLength);
            const buffer = ref(game.buffer);
            const sequences = ref(game.sequences);
            const size = ref(game.size);
            const matrix = ref(game.matrix);
            provide("remainingMilliseconds", readonly(remainingMilliseconds));
            provide("timeoutMilliseconds", readonly(timeoutMilliseconds));
            provide("maxBufferLength", readonly(maxBufferLength));
            provide("buffer", readonly(buffer));
            provide("sequences", readonly(sequences));
            provide("size", readonly(size));
            provide("matrix", readonly(matrix));

            return {
                level
            }
        }
    });
</script>

<style lang="scss">
    @import "@/sass/main.scss";
</style>
