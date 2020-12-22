import GameConfiguration from "./GameConfiguration";

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

export function matchState<T>(h: StateSpecificHandler<T>): (a: State) => T {
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

export function matchSelectionState<T>(h: SelectionStateSpecificHandler<T>): (a: SelectionState) => T {
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

interface Buffer {
    value: string
    positionInMatrixRow: number
    positionInMatrixColumn: number
}

interface Cell {
    value: string
    isUsed: boolean
}

export class Game {
    state: State = {selectionMode: SelectionMode.FreePick}
    public readonly size: number
    public readonly buffer: Buffer[] = []
    private readonly timeoutInterval: ReturnType<typeof setTimeout>
    private readonly startTimeTimeStamp: number
    private endTimestamp: number | null = null

    constructor(private readonly config: GameConfiguration) {
        this.size = Math.sqrt(config.matrix.length)
        this.timeoutInterval = setTimeout(() => {
            this.state = EndState.Lost
            this.stopClock()
        }, this.config.timeoutMilliseconds)
        this.startTimeTimeStamp = Date.now()
    }

    get remainingMilliseconds(): number {
        if (this.endTimestamp) {
            return this.config.timeoutMilliseconds - (this.endTimestamp - this.startTimeTimeStamp)
        }
        return this.config.timeoutMilliseconds - (Date.now() - this.startTimeTimeStamp)
    }

    getCell(row: number, column: number): Cell {
        return {
            value: this.config.matrix[row + column * this.size],
            isUsed: this.buffer.some(x =>
                x.positionInMatrixRow == row &&
                x.positionInMatrixColumn == column
            ),
        }
    }

    getSequences(): Sequence[] {
        return this.config.sequences.map(sequence => {
            let longestPrefixLength = 0
            for (let i = 0; i < this.buffer.length; ++i) {
                let prefixLength = 0;
                for (let j = 0; j < Math.min(sequence.length, this.buffer.length - i); ++j) {
                    if (this.buffer[i + j].value != sequence[j]) {
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

    private stopClock(): void {
        clearTimeout(this.timeoutInterval)
        this.endTimestamp = Date.now()
    }

    private checkEndGame(): void {
        const isSequenceFulfilled = (sequence: Sequence) => sequence.sequence.length === sequence.numberOfFulfilled
        if (this.getSequences().every(isSequenceFulfilled)) {
            this.stopClock()
            this.state = EndState.Won
        } else if (this.buffer.length >= this.config.maxBufferLength) {
            this.stopClock()
            this.state = EndState.Lost
        }
    }

    pick(row: number, column: number): State {
        if (row < 0 || column < 0 || row >= this.size || column >= this.size) {
            throw new IllegalMoveError()
        }

        matchState({
            Won: () => {throw new IllegalMoveError()},
            Lost: () => {throw new IllegalMoveError()},
            InProgress: (selectionMode) => {
                const cell = this.getCell(row, column)

                if (cell.isUsed) {
                    throw new IllegalMoveError();
                }

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

                this.buffer.push({
                    value: cell.value,
                    positionInMatrixRow: row,
                    positionInMatrixColumn: column,
                })
            }
        })(this.state)

        this.checkEndGame();
        return this.state;
    }

    get maxBufferLength(): number {
        return this.config.maxBufferLength
    }

    get sequences(): string[][] {
        return this.config.sequences
    }

    get matrix(): string[] {
        return this.config.matrix
    }

    get timeoutMilliseconds(): number {
        return this.config.timeoutMilliseconds
    }
}
