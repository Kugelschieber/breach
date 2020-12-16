<template>
    <div class="timer">
        <div class="timer-countdown">{{countdown}}</div>
        <div class="timer-progress" :style="{width: `${progress}%`}"></div>
    </div>
</template>

<script lang="ts">
    import {defineComponent, ref, computed} from "vue";
    
    export default defineComponent({
        props: {
            time: {type: Object, required: true}
        },
        setup(props) {
            const remainingTime = ref(60)
            const progress = computed(() => remainingTime.value/60*100);
            const countdown = computed(() => remainingTime.value.toFixed(2));

            const updateTime = () => {
                remainingTime.value = Math.max(0, (props.time.getTime() - new Date().getTime()) / 1000);
                if (remainingTime.value > 0) {
                    requestAnimationFrame(() => {
                        updateTime();
                    });
                }
            }

            requestAnimationFrame(() => {
                updateTime();
            });

            return {
                countdown,
                progress
            };
        }
    });
</script>
