import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { generatePrimeFactors, getOneHundredPrimes } from "./util/util";

export interface BoardState {
  upButtonPressed: boolean;
  downButtonPressed: boolean;
  leftButtonPressed: boolean;
  rightButtonPressed: boolean;
  spaceButtonPressed: boolean;
  activeCell: [number, number];
  validInputKeys: Array<String | number>;
  lives: number;
  level: number;
  messages: Array<String>;
  answersRemaining: number;
  boardInitialized: boolean;
  numRows: number;
  numCols: number;
  primes: Array<number>;
  primeFactors: Array<number>;
  board: Array<Array<number | String | undefined>>;
}

const initialState: BoardState = {
  upButtonPressed: false,
  downButtonPressed: false,
  leftButtonPressed: false,
  rightButtonPressed: false,
  spaceButtonPressed: false,
  activeCell: [0, 0],
  validInputKeys: ["w", "a", "s", "d", 32],
  lives: 5,
  level: 4,
  messages: [],
  answersRemaining: 0,
  boardInitialized: false,
  numRows: 5,
  numCols: 6,
  primes: [],
  primeFactors: [],
  board: [[]],
};

export const boardSlice = createSlice({
  name: "boardCounter",
  initialState,
  reducers: {
    moveUp: (state) => {
      let newYPositionValue = state.activeCell[1] - 1;
      let newYPosition =
        newYPositionValue >= 0 ? newYPositionValue : state.activeCell[1];
      state.activeCell = [state.activeCell[0], newYPosition];
    },
    moveDown: (state) => {
      let newYPositionValue = state.activeCell[1] + 1;
      let newYPosition =
        newYPositionValue < state.board.length
          ? newYPositionValue
          : state.activeCell[1];
      state.activeCell = [state.activeCell[0], newYPosition];
    },
    moveLeft: (state) => {
      let newXPositionValue = state.activeCell[0] - 1;
      let newXPosition =
        newXPositionValue >= 0 ? newXPositionValue : state.activeCell[0];
      state.activeCell = [newXPosition, state.activeCell[1]];
    },
    moveRight: (state) => {
      let newXPositionValue = state.activeCell[0] + 1;
      let newXPosition =
        newXPositionValue < state.board[0].length
          ? newXPositionValue
          : state.activeCell[0];
      state.activeCell = [newXPosition, state.activeCell[1]];
    },
    setUpButtonPressed: (state) => {
      state.upButtonPressed = true;
    },
    setUpButtonReleased: (state) => {
      state.upButtonPressed = false;
    },
    setDownButtonPressed: (state) => {
      state.downButtonPressed = true;
    },
    setDownButtonReleased: (state) => {
      state.downButtonPressed = false;
    },
    setLeftButtonPressed: (state) => {
      state.leftButtonPressed = true;
    },
    setLeftButtonReleased: (state) => {
      state.leftButtonPressed = false;
    },
    setRightButtonPressed: (state) => {
      state.rightButtonPressed = true;
    },
    setRightButtonReleased: (state) => {
      state.rightButtonPressed = false;
    },
    setSpaceButtonPressed: (state) => {
      state.spaceButtonPressed = true;
    },
    setSpaceButtonReleased: (state) => {
      state.spaceButtonPressed = false;
    },
    updateBoardValue: (
      state,
      action: PayloadAction<{
        row: number;
        column: number;
        value: number | string | undefined;
      }>
    ) => {
      state.board[action.payload.row][action.payload.column] =
        action.payload.value;
    },
    setBoard: (
      state,
      action: PayloadAction<{
        board: Array<Array<number | String | undefined>>;
      }>
    ) => {
      state.board = action.payload.board;
      state.boardInitialized = true;
    },
    decrementLives: (state) => {
      state.lives -= 1;
    },
    incrementLevel: (state) => {
      state.level += 1;
    },
    setLevel: (state, action: PayloadAction<{ level: number }>) => {
      state.level = action.payload.level;
    },
    pushMessage: (state, action: PayloadAction<{ message: String }>) => {
      state.messages.push(action.payload.message);
    },
    popMessaage: (state) => {
      state.messages.pop();
    },
    setAnswersRemaining: (
      state,
      action: PayloadAction<{ remaining: number }>
    ) => {
      state.answersRemaining = action.payload.remaining;
    },
    decrementAnswersRemaining: (state) => {
      state.answersRemaining -= 1;
    },
    incrementAnswersRemaining: (state) => {
      state.answersRemaining += 1;
    },
    setNumRows: (state, action: PayloadAction<{ rows: number }>) => {
      state.numRows = action.payload.rows;
    },
    setNumCols: (state, action: PayloadAction<{ cols: number }>) => {
      state.numCols = action.payload.cols;
    },
    setPrimeFactors: (
      state,
      action: PayloadAction<{ primeFactors: Array<number> }>
    ) => {
      state.primeFactors = action.payload.primeFactors;
    },
  },
  extraReducers(builder) {
    builder.addCase(generatePrimesAsync.fulfilled, (state, action) => {
      state.primes = action.payload.primes;
    });
    builder.addCase(generatePrimeFactorsAsync.fulfilled, (state, action) => {
      state.primeFactors = action.payload.primeFactors;
    });
  },
});

export const generatePrimesAsync = createAsyncThunk(
  "boardCounter/generatePrimesAsync",
  async (_, { getState }) => {
    let primes = getOneHundredPrimes();
    return { primes: primes };
  }
);

export const generatePrimeFactorsAsync = createAsyncThunk(
  "boardCounter/generatePrimeFactorsAsync",
  async (_, thunkAPI) => {
    const { board } = thunkAPI.getState() as any;
    const boardState = board as BoardState;
    let primeFactors = generatePrimeFactors(board.level, board.primes);
    return { primeFactors: primeFactors };
  }
);

export const {
  setUpButtonPressed,
  setUpButtonReleased,
  setDownButtonPressed,
  setDownButtonReleased,
  setLeftButtonPressed,
  setLeftButtonReleased,
  setRightButtonPressed,
  setRightButtonReleased,
  setSpaceButtonPressed,
  setSpaceButtonReleased,
  updateBoardValue,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  setBoard,
  decrementLives,
  pushMessage,
  popMessaage,
  setAnswersRemaining,
  incrementAnswersRemaining,
  decrementAnswersRemaining,
  incrementLevel,
  setLevel,
  setPrimeFactors,
} = boardSlice.actions;
export default boardSlice.reducer;
