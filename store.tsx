import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import boardReducer from "./redux/board";

export function makeStore() {
  return configureStore({
    reducer: { board: boardReducer },
    devTools: process.env.NODE_ENV !== "production",
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
