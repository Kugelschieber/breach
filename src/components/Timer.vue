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
            const remainingMilliseconds = inject("remainingMilliseconds") as Ref<number>;
            const timeoutMilliseconds = inject("timeoutMilliseconds") as Ref<number>;
            const progress = computed(() => remainingMilliseconds.value/timeoutMilliseconds.value*100);
            const countdown = computed(() => (remainingMilliseconds.value/1000).toFixed(2));

            return {
                countdown,
                progress
            };
        }
    });
</script>
