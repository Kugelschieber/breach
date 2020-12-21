<template>
    <h2>Sequences</h2>
    <div class="buffer-codes" v-for="(sequence, i) in sequences" :key="i">
        <div class="buffer-slots">
            <div class="buffer-slots-slot" v-for="(digit, j) in sequence" :key="j">
                {{digit}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Game } from "@/game/Game";
    import {computed, defineComponent, inject, Ref} from "vue";
    
    export default defineComponent({
        setup() {
            const game = inject("game") as Ref<Game>;
            const sequences = computed(() => game.value.sequences);

            return {
                sequences
            }
        }
    });
</script>
