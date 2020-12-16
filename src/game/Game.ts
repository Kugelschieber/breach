export enum EndState {
    Won,
    Lost,
}

export enum SelectionMode {
    FreePick,
    RowPick,
    ColumnPick,
}

type FreeSelection = {
    selectionMode: SelectionMode.FreePick,
}

type RowSelection = {
    selectionMode: SelectionMode.RowPick,
    column: number;
}

type ColumnSelection = {
    selectionMode: SelectionMode.ColumnPick,
    row: number;
}

type SelectionState = FreeSelection | RowSelection | ColumnSelection;

type State = SelectionState | EndState.Won | EndState.Lost;

interface StateSpecificHandler<T> {
    Won(): T
    Lost(): T
    InProgress(selectionState: SelectionState): T
}

function matchState<T>(h: StateSpecificHandler<T>): (a: State) => T {
    return (a: State) => {
        switch (a) {
            case EndState.Won:
                return h.Won();
            case EndState.Lost:
                return h.Lost();
            default:
                return h.InProgress(a);
        }
    }
}

interface SelectionStateSpecificHandler<T> {
    Free(): T;
    Row(row: number): T;
    Column(column: number): T;
}

function matchSelectionState<T>(h: SelectionStateSpecificHandler<T>): (a: SelectionState) => T {
    return (a: SelectionState) => {
        switch (a.selectionMode) {
            case SelectionMode.FreePick:
                return h.Free();
            case SelectionMode.RowPick:
                return h.Row(a.column);
            case SelectionMode.ColumnPick:
                return h.Column(a.row);
        }
    }
}

class IllegalMoveError extends Error {
    constructor() {
        super("Illegal move!")
    }
}

interface Sequence {
    sequence: string[]
    numberOfFulfilled: number
}

export class Game {
    state: State = {selectionMode: SelectionMode.FreePick}
    public readonly size: number
    public readonly buffer: string[] = []

    constructor(public readonly matrix: string[], private readonly sequences: string[][]) {
        this.size = Math.sqrt(matrix.length)
    }

    getCell(row: number, column: number) {
        return this.matrix[row + column * this.size]
    }

    getSequences(): Sequence[] {
        return this.sequences.map(sequence => {
            let longestPrefixLength = 0
            for (let i = 0; i < this.buffer.length; ++i) {
                let prefixLength = 0;
                for (let j = 0; j < Math.min(sequence.length, this.buffer.length - i); ++j) {
                    if (this.buffer[i + j] != sequence[j]) {
                        // abort sequence
                        prefixLength = 0
                        break;
                    }
                    ++prefixLength;
                }
                longestPrefixLength = Math.max(longestPrefixLength, prefixLength);
            }

            return {
                sequence: sequence,
                numberOfFulfilled: longestPrefixLength,
            }
        })
    }

    pick(row: number, column: number): void {
        if (row < 0 || column < 0 || row >= this.size || column >= this.size) {
            throw new IllegalMoveError()
        }

        matchState({
            Won: () => {throw new IllegalMoveError()},
            Lost: () => {throw new IllegalMoveError()},
            InProgress: (selectionMode) => {
                this.buffer.push(this.getCell(row, column))

                matchSelectionState({
                    Free: () => {
                        this.state = {
                            selectionMode: SelectionMode.RowPick,
                            column: column,
                        };
                    },
                    Column: (r) => {
                        if (r === row) {
                            this.state = {
                                selectionMode: SelectionMode.RowPick,
                                column: column,
                            }
                        } else {
                            throw new IllegalMoveError()
                        }
                    },
                    Row: (c) => {
                        if (c === column) {
                            this.state = {
                                selectionMode: SelectionMode.ColumnPick,
                                row: row,
                            }
                        } else {
                            throw new IllegalMoveError()
                        }
                    },
                })(selectionMode)
            }
        })(this.state)
    }
}
