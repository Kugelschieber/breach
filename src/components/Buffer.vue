<template>
    <div class="buffer">
        <h2>Buffer</h2>
        <div class="buffer-slots">
            <div class="buffer-slots-slot buffer-slots-border" v-for="(slot, i) in maxBufferLength" :key="i">
                <span v-if="buffer.length > i">{{buffer[i].value}}</span>
            </div>
        </div>
        <Sequences />
    </div>
</template>

<script lang="ts">
    import { Game } from "@/game/Game";
    import {defineComponent, inject, Ref, computed} from "vue";
    import Sequences from "./Sequences.vue";
    
    export default defineComponent({
        components: {
            Sequences
        },
        setup() {
            const game = inject("game") as Ref<Game>;
            const maxBufferLength = computed(() => game.value.maxBufferLength);
            const buffer = computed(() => game.value.buffer);

            return {
                maxBufferLength,
                buffer
            }
        }
    });
</script>
