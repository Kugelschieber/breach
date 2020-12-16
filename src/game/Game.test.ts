import "jest"
import {EndState, Game, SelectionMode} from "./Game"

describe("GameState", () => {
    const threeByThreeMatrix = [
        "00", "10", "20",
        "01", "11", "21",
        "02", "12", "22",
    ]

    const unrestrictedBuffer = 999
    const unlimitedTime = 999 * 1000

    test("getting size works", () => {
        expect((new Game(["00"], [["AA"]], unrestrictedBuffer, unlimitedTime)).size).toEqual(1)
        expect((new Game([
                            "00", "01",
                            "10", "11",
                         ], [], unrestrictedBuffer, unlimitedTime)).size).toEqual(2)
    });

    test("getting cell works", () => {
        const game = new Game(threeByThreeMatrix, [["AA"]], unrestrictedBuffer, unlimitedTime);
        expect(game.getCell(0, 2)).toEqual("02")
    });

    describe("picking", () => {
        test("starts with free pick", () => {
            const game = new Game([], [["AA"]], 1, unlimitedTime);
            expect(game.state).toEqual({selectionMode: SelectionMode.FreePick})
        });

        test("picking cells works", () => {
            const game = new Game(threeByThreeMatrix, [["AA"]], unrestrictedBuffer, unlimitedTime);
            game.pick(0, 0);
            expect(game.state).toEqual({selectionMode: SelectionMode.RowPick, column: 0});
            expect(() => game.pick(0, 2)).toThrow();
            game.pick(2, 0);
            expect(game.state).toEqual({selectionMode: SelectionMode.ColumnPick, row: 2});
        });

        test("picking outside of range fails", () => {
            const game = new Game(threeByThreeMatrix, [], unrestrictedBuffer, unlimitedTime);
            expect(() => game.pick(-1, 0)).toThrow();
            expect(() => game.pick(0, -1)).toThrow();
            expect(() => game.pick(3, 0)).toThrow();
            expect(() => game.pick(0, 3)).toThrow();
        });

        test("picking fills buffer, fulfills sequence", () => {
            const simpleSequence = ["00", "10", "20"]
            const game = new Game(threeByThreeMatrix, [simpleSequence], unrestrictedBuffer, unlimitedTime);
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
                ], [sequence], unrestrictedBuffer, unlimitedTime);
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

    describe("game end conditions", () => {
        test("game won", () => {
            const game = new Game([
                    "AA", "AA", "BB",
                    "BB", "CC", "AA",
                    "CC", "CC", "CC",
                ], [["AA", "BB", "CC"]], 3, unlimitedTime)
            game.pick(0, 0)
            game.pick(2, 0)
            game.pick(2, 2)
            expect(game.state).toEqual(EndState.Won)
            expect(() => game.pick(0, 2)).toThrow();
        })

        test("game loose", () => {
            const game = new Game([
                    "AA", "AA", "BB",
                    "BB", "CC", "AA",
                    "CC", "CC", "CC",
                ], [["AA", "BB", "CC"]], 3, unlimitedTime)
            game.pick(0, 0)
            game.pick(1, 0)
            game.pick(1, 2)
            expect(game.state).toEqual(EndState.Lost)
            expect(() => game.pick(2, 2)).toThrow();
        })
    });

    describe("time management", () => {
        let currentTimeProgress: number

        beforeEach(() => {
            jest.useFakeTimers()
            currentTimeProgress = 0
            Date.now = jest.fn(() => {
                return currentTimeProgress
            })
        })

        function fakeTimeProgress(ms: number) {
            currentTimeProgress += ms
            jest.advanceTimersByTime(ms)
        }

        test("loosing through timeout works", () => {
            const game = new Game([
                "AA", "AA", "BB",
                "BB", "CC", "AA",
                "CC", "CC", "CC",
            ], [["AA"]], 3, 10_000)
            fakeTimeProgress(1_000)
            expect(game.remainingMilliseconds).toEqual(9_000)
            fakeTimeProgress(1_000)
            expect(game.remainingMilliseconds).toEqual(8_000)
            fakeTimeProgress(8_000)
            expect(game.state).toEqual(EndState.Lost)
            expect(game.remainingMilliseconds).toEqual(0)
            fakeTimeProgress(1_000)
            expect(game.remainingMilliseconds).toEqual(0)
        })

        test("clock stops when game is won", () => {
            const game = new Game([
                "AA", "AA", "BB",
                "BB", "CC", "AA",
                "CC", "CC", "CC",
            ], [["AA"]], 3, 10_000)
            fakeTimeProgress(1_000)
            game.pick(0, 0)
            expect(game.remainingMilliseconds).toEqual(9_000)
            fakeTimeProgress(1_000)
            expect(game.remainingMilliseconds).toEqual(9_000)
        })
    })
});
