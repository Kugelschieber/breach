<template>
    <main>
        <Level :level="level" />
        <Timer :time="time" />
        <Buffer :slots="slots" :codes="codes" />
        <Matrix :size="size" :matrix="matrix" />
    </main>
</template>

<script lang="ts">
    import {defineComponent} from "vue";
    import Level from "./components/Level.vue";
    import Timer from "./components/Timer.vue";
    import Buffer from "./components/Buffer.vue";
    import Matrix from "./components/Matrix.vue";

    export default defineComponent({
        components: {
            Level,
            Timer,
            Buffer,
            Matrix
        },
        setup() {
            const time = new Date();
            time.setSeconds(time.getSeconds()+60);

            return {
                level: 5,
                time,
                slots: ["99", "E7", "AD", ""],
                codes: [
                    {
                        code: ["", "E7", "AD", "BD"],
                        points: 100
                    },
                    {
                        code: ["99", "E7", "AD"],
                        points: 50
                    }
                ],
                size: 5,
                matrix: [
                    "99", "E7", "AD", "99", "BD",
                    "99", "BD", "99", "E7", "AD",
                    "AD", "E7", "BD", "AD", "99",
                    "99", "99", "BD", "E7", "AD",
                    "E7", "AD", "99", "BD", "99"
                ]
            }
        }
    });
</script>

<style lang="scss">
    @import "@/sass/main.scss";
</style>
