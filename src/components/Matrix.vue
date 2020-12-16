<template>
    <div class="matrix">
        <h2>Code-Matrix</h2>
        <div class="matrix-row" v-for="i in size" :key="i">
            <div class="matrix-column" v-for="j in size" :key="j">
                {{matrix[(i - 1)*5 + (j - 1)]}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from "vue";
    
    export default defineComponent({
        props: {
            size: {type: Number, required: true},
            matrix: {type: Array, required: true},
        }
    });
</script>
