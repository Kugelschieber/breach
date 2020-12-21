export const saveGameKey = "save_game";

export interface SaveGame {
    level: number
}

export function saveGame(saveGame: SaveGame): void {
    localStorage.setItem(saveGameKey, JSON.stringify(saveGame));
}

export function loadGame(): SaveGame | null {
    const saveGame = localStorage.getItem(saveGameKey);

    if(saveGame) {
        return JSON.parse(saveGame);
    }

    return null;
}
