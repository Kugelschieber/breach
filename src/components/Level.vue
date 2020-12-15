<template>
    <div class="level">
        <h1>Breach</h1>
        <div class="level-display">Level <span>{{level}}</span></div>
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
