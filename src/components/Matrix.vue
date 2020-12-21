<template>
    <div class="matrix">
        <h2>Code-Matrix</h2>
        <div class="matrix-row" v-for="i in size" :key="i">
            <div class="matrix-column" v-for="j in size" :key="j" v-on:click="select(i, j)">
                {{matrix[(j - 1)*size + (i - 1)]}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Game } from "@/game/Game";
    import {defineComponent, inject, computed, Ref} from "vue";
    
    export default defineComponent({
        setup() {
            const game = inject("game") as Ref<Game>;
            const size = computed(() => game.value.size);
            const matrix = computed(() => game.value.matrix);

            function select(row: number, column: number) {
                try {
                    game.value.pick(row-1, column-1);
                } catch (e) {
                    console.log("nö!");
                }
            }

            return {
                size,
                matrix,
                select
            }
        }
    });
</script>
