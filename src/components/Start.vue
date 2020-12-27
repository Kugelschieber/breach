<template>
    <div class="overlay" v-if="countdown > 0">
        <div>
            <div class="countdown">{{countdown}}</div>
            <button v-on:click="start" v-if="interval === 0">Start</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent, ref, watch} from "vue";
    
    export default defineComponent({
        props: {
            level: {type: Number, required: true}
        },
        setup(props, {emit}) {
            const countdown = ref(3);
            const interval = ref(0);

            watch(() => props.level, () => {
                countdown.value = 3;
                interval.value = 0;
            });

            watch(countdown, value => {
                if(value <= 0) {
                    clearInterval(interval.value);
                    emit("start");
                }
            });

            function start() {
                interval.value = setInterval(() => {
                    countdown.value--;
                }, 1000) as unknown as number;
            }

            return {
                countdown,
                interval,
                start
            }
        }
    });
</script>
