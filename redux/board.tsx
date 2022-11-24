import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper";

export interface BoardState {
    value: number,
    buttonPressed: boolean,
    activeCell: [number, number],
    numRows: number,
    numCols: number,
}

const initialState: BoardState = {
    value: 3,
    buttonPressed: false,
    activeCell: [0,0],
    numRows: 3,
    numCols: 3,
}

export const boardSlice = createSlice({
    name: 'boardCounter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        setButtonPressed: (state) => {
            state.buttonPressed = true
        },
        setButtonReleased: (state) => {
            state.buttonPressed = false
        },
        moveUp: (state) => {
            let newYPositionValue = state.activeCell[1]-1
            let newYPosition = newYPositionValue >= 0 ? newYPositionValue : state.activeCell[1]
            state.activeCell = [state.activeCell[0], newYPosition]
        },
        moveDown: (state) => {
            let newYPositionValue = state.activeCell[1]+1
            let newYPosition = newYPositionValue < state.numRows ? newYPositionValue : state.activeCell[1]
            state.activeCell = [state.activeCell[0], newYPosition]
        },
        moveLeft: (state) => {
            let newXPositionValue = state.activeCell[0]-1
            let newXPosition = newXPositionValue >= 0 ? newXPositionValue : state.activeCell[0]
            state.activeCell = [newXPosition, state.activeCell[1]]
        },
        moveRight: (state) => {
            let newXPositionValue = state.activeCell[0]+1
            let newXPosition = newXPositionValue < state.numCols ? newXPositionValue : state.activeCell[0]
            state.activeCell = [newXPosition, state.activeCell[1]]
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.auth,
            };
        },
    },
})

export const { increment, decrement, setButtonPressed, setButtonReleased, moveUp, moveDown, moveLeft, moveRight } = boardSlice.actions
export default boardSlice.reducer