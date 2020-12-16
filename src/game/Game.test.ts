import "jest"
import {Game, SelectionMode} from "./Game"

describe("GameState", () => {
    const threeByThreeMatrix = [
        "00", "10", "20",
        "01", "11", "21",
        "02", "12", "22",
    ]

    test("getting size works", () => {
        expect((new Game([], [])).size).toEqual(0)
        expect((new Game(["00"], [])).size).toEqual(1)
        expect((new Game([
                            "00", "01",
                            "10", "11",
                         ], [])).size).toEqual(2)
    });

    test("getting cell works", () => {
        const game = new Game(threeByThreeMatrix, []);
        expect(game.getCell(0, 2)).toEqual("02")
    });

    describe("picking", () => {
        test("starts with free pick", () => {
            const game = new Game([], []);
            expect(game.state).toEqual({selectionMode: SelectionMode.FreePick})
        });

        test("picking cells works", () => {
            const game = new Game(threeByThreeMatrix, []);
            game.pick(0, 0);
            expect(game.state).toEqual({selectionMode: SelectionMode.RowPick, column: 0});
            expect(() => game.pick(0, 2)).toThrow();
            game.pick(2, 0);
            expect(game.state).toEqual({selectionMode: SelectionMode.ColumnPick, row: 2});
        });

        test("picking outside of range fails", () => {
            const game = new Game(threeByThreeMatrix, []);
            expect(() => game.pick(-1, 0)).toThrow();
            expect(() => game.pick(0, -1)).toThrow();
            expect(() => game.pick(3, 0)).toThrow();
            expect(() => game.pick(0, 3)).toThrow();
        });

        test("picking fills buffer, fulfills sequence", () => {
            const simpleSequence = ["00", "10", "20"]
            const game = new Game(threeByThreeMatrix, [simpleSequence]);
            expect(game.getSequences()).toEqual([{sequence: simpleSequence, numberOfFulfilled: 0}])
            game.pick(0, 0);
            expect(game.buffer).toEqual(["00"]);
            expect(game.getSequences()).toEqual([{sequence: simpleSequence, numberOfFulfilled: 1}])
        });

        test("picking fulfills second sequence occurence", () => {
            const sequence = ["AA", "BB", "CC"]
            const game = new Game([
                    "AA", "AA", "BB",
                    "BB", "CC", "AA",
                    "CC", "CC", "CC",
                ], [sequence]);
            expect(game.getSequences()).toEqual([{sequence: sequence, numberOfFulfilled: 0}])
            game.pick(0, 0);
            expect(game.getSequences()).toEqual([{sequence: sequence, numberOfFulfilled: 1}])
            game.pick(2, 0);
            expect(game.getSequences()).toEqual([{sequence: sequence, numberOfFulfilled: 2}])
            game.pick(2, 1);
            expect(game.getSequences()).toEqual([{sequence: sequence, numberOfFulfilled: 1}])
            game.pick(0, 1);
            expect(game.getSequences()).toEqual([{sequence: sequence, numberOfFulfilled: 2}])
            game.pick(0, 2);
            expect(game.getSequences()).toEqual([{sequence: sequence, numberOfFulfilled: 3}])
        });
    });
});
