<template>
    <div class="timer">
        <div class="timer-countdown">{{countdown}}</div>
        <div class="timer-progress" :style="{width: `${progress}%`}"></div>
    </div>
</template>

<script lang="ts">
    import { Game } from "@/game/Game";
    import {defineComponent, computed, inject, Ref, ref} from "vue";
    
    export default defineComponent({
        setup() {
            const game = inject("game") as Ref<Game>;
            const remainingMilliseconds = ref(game.value.remainingMilliseconds);
            const timeoutMilliseconds = computed(() => game.value.timeoutMilliseconds);
            const progress = computed(() => remainingMilliseconds.value/timeoutMilliseconds.value*100);
            const countdown = computed(() => (remainingMilliseconds.value/1000).toFixed(2));

            const updateTime = () => {
                remainingMilliseconds.value = game.value.remainingMilliseconds;
                
                if (remainingMilliseconds.value > 0) {
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
