<template>
    <div class="matrix">
        <h2>Code-Matrix</h2>
        <div class="matrix-row" v-for="i in size" :key="i">
            <div class="matrix-column" v-for="j in size" :key="j">
                {{matrix[(i - 1)*size + (j - 1)]}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent, inject} from "vue";
    
    export default defineComponent({
        setup() {
            const size = inject("size");
            const matrix = inject("matrix");

            return {
                size,
                matrix
            }
        }
    });
</script>
