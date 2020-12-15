<template>
    <div class="timer">
        <div class="timer-countdown">{{countdown}}</div>
        <div class="timer-progress" :style="{width: `${progress}%`}"></div>
    </div>
</template>

<script lang="ts">
    import {defineComponent, ref} from "vue";
    
    export default defineComponent({
        props: {
            time: {type: Object, required: true}
        },
        setup(props) {
            const countdown = ref("60.00");
            const progress = ref(100);

            setInterval(() => {
                const remaining = (props.time.getTime()-new Date().getTime())/1000;

                if(remaining > 0) {
                    countdown.value = remaining.toFixed(2);
                    progress.value = remaining/60*100;
                } else {
                    countdown.value = "0.00";
                    progress.value = 0;
                }
            }, 100);

            return {
                countdown,
                progress
            };
        }
    });
</script>
