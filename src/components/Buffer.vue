<template>
    <div class="buffer">
        <h2>Buffer</h2>
        <div class="buffer-slots">
            <div class="buffer-slots-slot buffer-slots-border" v-for="(slot, i) in maxBufferLength" :key="i">
                <span v-if="buffer.length > i">{{buffer[i]}}</span>
            </div>
        </div>
        <Sequences />
    </div>
</template>

<script lang="ts">
    import {defineComponent, inject} from "vue";
    import Sequences from "./Sequences.vue";
    
    export default defineComponent({
        components: {
            Sequences
        },
        setup() {
            const maxBufferLength = inject("maxBufferLength");
            const buffer = inject("buffer");

            return {
                maxBufferLength,
                buffer
            }
        }
    });
</script>
