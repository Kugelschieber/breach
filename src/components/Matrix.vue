<template>
    <div class="matrix">
        <h2>Code-Matrix</h2>
        <div class="matrix-row" v-for="i in size" :key="i">
            <div :class="{'matrix-column': true, active: active.row === j || active.column === i, used: game.getCell(j-1, i-1).isUsed, error: error.row === j && error.column === i}"
                 v-for="j in size" :key="j"
                 v-on:click="select(j, i)">
                {{game.getCell(j-1, i-1).value}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Game, matchState, matchSelectionState } from "@/game/Game";
    import {defineComponent, inject, computed, Ref, ref} from "vue";
    
    export default defineComponent({
        setup(props, {emit}) {
            const game = inject("game") as Ref<Game>;
            const size = computed(() => game.value.size);
            const matrix = computed(() => game.value.matrix);
            const state = computed(() => game.value.state);
            const active = ref({row: -1, column: -1});
            const error = ref({row: -1, column: -1});
            let errorTimeout: number;

            function select(row: number, column: number) {
                try {
                    const newState = game.value.pick(row-1, column-1);
                    
                    matchState({
                        Won: () => {
                            reset();
                            emit("won");
                        },
                        Lost: () => {
                            reset();
                            emit("lost");
                        },
                        InProgress: state => {
                            matchSelectionState({
                                Free: () => {/**/},
                                Row: () => {
                                    active.value = {
                                        row: -1,
                                        column,
                                    };
                                },
                                Column: () => {
                                    active.value = {
                                        row,
                                        column: -1,
                                    };
                                },
                            })(state);
                        },
                    })(newState);
                } catch (e) {
                    error.value = {
                        row,
                        column,
                    };

                    if(errorTimeout) {
                        clearTimeout(errorTimeout);
                    }

                    errorTimeout = setTimeout(() => {
                        error.value = {
                            row: -1,
                            column: -1,
                        };
                    }, 500) as unknown as number;
                }
            }

            function reset() {
                active.value ={row: -1, column: -1};
                error.value = {row: -1, column: -1};
                
                if(errorTimeout) {
                    clearTimeout(errorTimeout);
                }
            }

            return {
                game,
                size,
                matrix,
                state,
                active,
                error,
                select
            }
        }
    });
</script>
