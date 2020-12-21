import GameConfiguration from "./GameConfiguration";

import seedrandom from "seedrandom";

const minMatrixSize = 3;
const maxMatrixSize = 8;

const minNumberSequences = 2;
const maxNumberSequences = 7;
const minSequenceLength = 2;

const minBufferSize = 4;
const maxBufferSize = 8;

const stepsUntilMatrixSizeIncreased = 10;
const stepsUntilSequenceNumberIncreased = 3;

const defaultTimeout = 60_000;

//TODO see how many different values are there
//TODO see how the possible values are defined
const numberDifferentMatrixValues = 5;
const matrixValues = ["A0", "E9", "4C", "8B", "6F"];
const emptyMatrixValue = "  ";

/**
 * Generates a game configuration for the current level given the seed which is used
 * for the PRNG.
 * 
 * The generated game configuration, see {@link GameConfiguration}, contains
 * a matrix with random values with a size which corresponds to the current level,
 * the sequences which are generated randomly and have to be found in the matrix,
 * the length of the buffer which contains the chosen values from the matrix,
 * the timeout which is the time a user has to solve the current level.
 * 
 * @param level The current game level (corresponds directly to the difficulty)
 * @param seed  The seed used to compute the random values of the marix and sequences
 */
export function generateGameConfig(level: number, seed: string): GameConfiguration {
    if (level < 1) {
        throw new RangeError("The level has to be at least 1.");
    }
    //the levels probably start at 1, however starting with 0 makes things smoother here
    level--;

    const seededRNG = seedrandom(seed);
    const matrixSize: number = getMatrixSize(level);
    const numberOfSequences: number = getNumberOfSequences(level);

    const matrix: string[] = generateRandomMatrix(matrixSize, seededRNG);
    const maxBufferLength: number = computeMaxBufferLength(level);
    const sequences: string[][] = generateSequences(matrix, numberOfSequences, maxBufferLength, seededRNG);
    const result: GameConfiguration = {
        matrix: matrix,
        sequences: sequences,
        maxBufferLength: maxBufferLength,
        timeout: defaultTimeout
    };

    return result;
}

function computeMaxBufferLength(level: number): number {
    //TODO not sure what might be a good idea
    //see getNumberOfSequences: every time the number of sequences is increased,
    //the buffer size is set to the minimum
    //if the number of sequences is not increased, the buffer length is increased
    let result: number = minBufferSize;

    if (matrixSizeWasIncreased(level)) {
        //currently it was still possible to increase the matrix size every x level
        const intervalLevel: number = level % stepsUntilMatrixSizeIncreased;
        result += intervalLevel % stepsUntilSequenceNumberIncreased;
        result = Math.min(result, maxBufferSize);
    }
    else {
        //the matrix size could not be increased anymore, therefore the number of
        //the maximum buffer length has to be changed differently
        result = maxBufferSize;
    }

    return result;
}

function generateSequences(matrix: string[], numberOfSequences: number, maxBufferLength: number, seededRNG: seedrandom.prng): string[][] {
    const result: string[][] = new Array(numberOfSequences);
    for (let i = 0; i < numberOfSequences; i++) {
        const currentSequenceLength: number = getRandomInt(minSequenceLength, maxBufferLength, seededRNG);
        result[i] = new Array(currentSequenceLength);
        fillSequence(result[i], matrix, seededRNG);
    }
    return result;
}

function fillSequence(sequence: string[], matrix: string[], seededRNG: seedrandom.prng): void {
    const matrixSize = Math.sqrt(matrix.length);
    const matrixCopy: string[] = Object.assign([], matrix);
    const sequenceLength = sequence.length;

    let currentLineNumber = 0;
    let currentColumnNumber = 0;
    let searchInLine = true;
    //always start in the first line
    for (let i = 0; i < sequenceLength; i++) {
        let matrixIndex = -1;
        if (searchInLine) {
            while (matrixIndex == -1) {
                currentColumnNumber = getRandomInt(0, matrixSize - 1, seededRNG);
                matrixIndex = getMatrixIndex(matrixSize, currentLineNumber, currentColumnNumber);
                if (matrixCopy[matrixIndex] == emptyMatrixValue) {
                    matrixIndex = -1;
                }

                if (i < sequenceLength - 1 && numberValuesLeftColumn(matrixCopy, currentColumnNumber) < 2) {
                    //there needs to be 2 values left in the chosen column
                    //one for the current sequence value and one for the next
                    matrixIndex = -1;
                }
            }
            searchInLine = false;
        }
        else {
            while (matrixIndex == -1) {
                currentLineNumber = getRandomInt(0, matrixSize - 1, seededRNG);

                matrixIndex = getMatrixIndex(matrixSize, currentLineNumber, currentColumnNumber);
                if (matrixCopy[matrixIndex] == emptyMatrixValue) {
                    matrixIndex = -1;
                }

                //ensure the chosen column has values left which can be selected
                if (i < sequenceLength - 1 && numberValuesLeftLine(matrixCopy, currentLineNumber) < 2) {
                    //there needs to be 2 values left in the chosen line
                    //one for the current sequence value and one for the next
                    matrixIndex = -1;
                }

            }
            searchInLine = true;
        }

        matrixIndex = getMatrixIndex(matrixSize, currentLineNumber, currentColumnNumber);
        sequence[i] = matrix[matrixIndex];
        matrixCopy[matrixIndex] = emptyMatrixValue;
    }
}

function numberValuesLeftColumn(matrixCopy: string[], columnNumber: number): number {
    const matrixSize = Math.sqrt(matrixCopy.length);
    let valuesLeft = 0;
    for (let i = 0; i < matrixSize; i++) {
        const matrixIndex = getMatrixIndex(matrixSize, i, columnNumber);
        if (matrixCopy[matrixIndex] != emptyMatrixValue) {
            valuesLeft++;
        }
    }

    return valuesLeft;
}

function numberValuesLeftLine(matrixCopy: string[], lineNumber: number): number {
    const matrixSize = Math.sqrt(matrixCopy.length);
    let valuesLeft = 0;
    for (let i = 0; i < matrixSize; i++) {
        const matrixIndex = getMatrixIndex(matrixSize, lineNumber, i);
        if (matrixCopy[matrixIndex] != emptyMatrixValue) {
            valuesLeft++;
        }
    }

    return valuesLeft;
}

function getMatrixIndex(matrixSize: number, lineNumber: number, columnNumber: number): number {
    return (lineNumber * matrixSize) + columnNumber;
}

function generateRandomMatrix(matrixSize: number, seededRNG: seedrandom.prng): string[] {
    const result: string[] = new Array(matrixSize * matrixSize);

    for (let i = 0; i < (matrixSize * matrixSize); i++) {
        result[i] = randomValue(seededRNG);
    }

    return result;
}

/**
 * Returns a random integer in the given interval. Both interval limits are inclusive
 * 
 * @param min The minimum number to be returned (inclusive)
 * @param max The maximum number to be returned (inclusive)
 * @param seededRNG The PRNG given by seedrandom
 */
function getRandomInt(min: number, max: number, seededRNG: seedrandom.prng): number {
    //taken from https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(seededRNG() * (max - min + 1)) + min;
}

function randomValue(seededRNG: seedrandom.prng): string {
    return matrixValues[getRandomInt(0, numberDifferentMatrixValues - 1, seededRNG)];
}

/**
 * Increase the matrix size every x levels up to a maximum size
 * 
 * x is defined in StepsUntilMatrixSizeIncreased
 * 
 * @param level The current game level (corresponds directly to the difficulty)
 */
//TODO see if this is a clever way to increase the matrix size
function getMatrixSize(level: number): number {
    const size: number = minMatrixSize + Math.floor(level / stepsUntilMatrixSizeIncreased);
    return Math.min(size, maxMatrixSize);
}

/**
 * Computes the number of sequences for the given level.
 * 
 * @param level The current game level (corresponds directly to the difficulty)
 */
//TODO It would suffice to give the level as param, as the matrix size can be computed
//What is the best practice in this context?
function getNumberOfSequences(level: number): number {
    //TODO not sure what might be a good idea
    let result: number = minNumberSequences;

    if (matrixSizeWasIncreased(level)) {
        //currently it was still possible to increase the matrix size every x level
        const intervalLevel: number = level % stepsUntilMatrixSizeIncreased;
        result += Math.floor(intervalLevel / stepsUntilSequenceNumberIncreased);
        result = Math.min(result, maxNumberSequences);
    }
    else {
        //the matrix size could not be increased anymore, therefore the number of
        //sequences has to be changed differently
        result = maxNumberSequences;
    }

    return result;
}

/**
 * Currently it was still possible to increase the matrix size every x level
 *  
 * @param level The current game level (corresponds directly to the difficulty)
 */
function matrixSizeWasIncreased(level: number): boolean {
    return level < maxMatrixSize * (stepsUntilMatrixSizeIncreased + 1);
}
