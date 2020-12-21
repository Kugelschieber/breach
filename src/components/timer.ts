import { Game } from '@/game/Game';
import { Ref } from 'vue';

interface Timer {
    updateCountdown(game: Game, remainingMilliseconds: Ref<number>): void
}

export function useTimer(): Timer {
    function updateCountdown(game: Game, remainingMilliseconds: Ref<number>) {
        const updateTime = () => {
            remainingMilliseconds.value = game.remainingMilliseconds;
            
            if (remainingMilliseconds.value > 0) {
                requestAnimationFrame(() => {
                    updateTime();
                });
            }
        }

        requestAnimationFrame(() => {
            updateTime();
        });
    }

    return {
        updateCountdown
    }
}
