import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper";

export interface BoardState {
    value: number,
    buttonPressed: boolean,
}

const initialState: BoardState = {
    value: 3,
    buttonPressed: false,
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
        }
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

export const { increment, decrement, setButtonPressed, setButtonReleased } = boardSlice.actions
export default boardSlice.reducer