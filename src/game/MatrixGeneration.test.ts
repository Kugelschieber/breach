import "jest"
import seedrandom from "seedrandom";
import {generateGameConfig} from "./MatrixGeneration";
import GameConfiguration from "./GameConfiguration";

describe("MatrixGen", () => {

    test("random generator works", () => {
        const seededRNG = seedrandom("Testseed");
        expect(seededRNG()).toEqual(0.026130760816951273);
        expect(seededRNG()).toEqual(0.24232428305919648);
    });

    test("basic game config creation", () =>{
        const gameConfig : GameConfiguration = generateGameConfig(1, "Testseed");
        expect(gameConfig).not.toBeNull;
        expect(gameConfig.matrix).not.toBeNull;
        console.log(gameConfig.matrix);
        expect(gameConfig.maxBufferLength).not.toBeNull;
        expect(gameConfig.sequences).not.toBeNull;
        console.log(gameConfig.sequences);
        expect(gameConfig.timeoutMilliseconds).not.toBeNull;
    });
});
