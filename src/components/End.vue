<template>
    <div class="overlay">
        <div>
            <div>You lost!</div>
            <div class="countdown">Level: {{level}}</div>
            <button v-on:click="$emit('restart')">Play again</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from "vue";
    
    export default defineComponent({
        props: {
            level: {type: Number, required: true}
        }
    });
</script>
