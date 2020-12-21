import "jest"
import { saveGameKey, saveGame, loadGame } from './SaveGame';

describe("SaveGame", () => {
    const state = {
        level: 42,
    };

    beforeEach(() => {
        localStorage.clear();
    });

    test("save game", () => {
        saveGame(state);
        const inStore = localStorage.getItem(saveGameKey);
        expect(inStore).not.toBeNull();
        const loaded = JSON.parse(inStore as string);
        expect(loaded).toEqual(state);
    });

    test("save game not exists", () => {
        const loaded = loadGame();
        expect(loaded).toBeNull();
    });
    
    test("load game", () => {
        saveGame(state);
        const loaded = loadGame();
        expect(loaded).toEqual(state);
    });
});
