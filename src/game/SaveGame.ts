export const saveGameKey = "save_game";

export interface SaveGame {
    Level: number
    Score: number
}

export function saveGame(saveGame: SaveGame) {
    localStorage.setItem(saveGameKey, JSON.stringify(saveGame));
}

export function loadGame(): SaveGame | null {
    const saveGame = localStorage.getItem(saveGameKey);

    if(saveGame) {
        return JSON.parse(saveGame);
    }

    return null;
}
