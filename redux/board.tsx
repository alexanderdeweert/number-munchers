import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

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
  level: 2,
  messages: [],
  answersRemaining: 0,
  boardInitialized: false,
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
  },
});

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
} = boardSlice.actions;
export default boardSlice.reducer;
