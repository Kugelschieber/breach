<template>
    <div class="timer">
        <div class="timer-countdown">{{countdown}}</div>
        <div class="timer-progress" :style="{width: `${progress}%`}"></div>
    </div>
</template>

<script lang="ts">
    import {defineComponent, computed, inject, Ref} from "vue";
    
    export default defineComponent({
        setup() {
            const remainingTime = inject("remainingMilliseconds") as Ref<number>;
            const timeoutMilliseconds = inject("timeoutMilliseconds") as Ref<number>;
            const progress = computed(() => remainingTime.value/timeoutMilliseconds.value*100);
            const countdown = computed(() => (remainingTime.value/1000).toFixed(2));

            /*const updateTime = () => {
                remainingTime.value = Math.max(0, (props.time.getTime() - new Date().getTime()) / 1000);
                if (remainingTime.value > 0) {
                    requestAnimationFrame(() => {
                        updateTime();
                    });
                }
            }

            requestAnimationFrame(() => {
                updateTime();
            });*/

            return {
                countdown,
                progress
            };
        }
    });
</script>
