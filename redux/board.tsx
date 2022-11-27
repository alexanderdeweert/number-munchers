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
  board: Array<Array<number | String | undefined>>;
  lives: number;
}

const initialState: BoardState = {
  upButtonPressed: false,
  downButtonPressed: false,
  leftButtonPressed: false,
  rightButtonPressed: false,
  spaceButtonPressed: false,
  activeCell: [0, 0],
  validInputKeys: ["w", "a", "s", "d", 32],
  board: [[]],
  lives: 5,
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
    },
    decrementLives: (state) => {
      state.lives -= 1;
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
} = boardSlice.actions;
export default boardSlice.reducer;
