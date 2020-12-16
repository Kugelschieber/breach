<template>
    <div class="buffer">
        <h2>Buffer</h2>
        <div class="buffer-slots">
            <div class="buffer-slots-slot buffer-slots-border" v-for="(slot, i) in slots" :key="i">
                {{slot}}
            </div>
        </div>
        <h2>Sequences</h2>
        <div class="buffer-codes" v-for="(code, i) in codes" :key="i">
            <div class="buffer-slots">
                <div class="buffer-slots-slot" v-for="(digit, j) in code.code" :key="j">
                    {{digit}}
                </div>
            </div>
            <div class="buffer-points">
                {{code.points}} Pts
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from "vue";
    
    export default defineComponent({
        props: {
            slots: {type: Array, required: true},
            codes: {type: Array, required: true}
        }
    });
</script>
