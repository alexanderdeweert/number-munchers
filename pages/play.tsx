import { useRouter } from "next/router";
import { Key, useCallback, useEffect, useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { interval, Subscription } from "rxjs";
import {
  setUpButtonPressed,
  setUpButtonReleased,
  setDownButtonReleased,
  setDownButtonPressed,
  setRightButtonPressed,
  setRightButtonReleased,
  setLeftButtonPressed,
  setLeftButtonReleased,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  updateBoardValue,
  setSpaceButtonPressed,
  setSpaceButtonReleased,
  setBoard,
} from "../redux/board";
import { AppState } from "../store";

export default function Play() {
  const router = useRouter();
  const { name, gameType, numCols, numRows } = router.query;
  const board = useSelector((state: AppState) => state.board.board);
  const dispatch = useDispatch();
  const timer = interval(1000);
  const sub = new Subscription();
  const [activeCellClass, setActiveCellClass] = useState("purple-cell");
  const [tileWidth, setTileWidth] = useState(100);
  const [tileHeight, setTileHeight] = useState(100);
  const upButtonPressed = useSelector(
    (state: AppState) => state.board.upButtonPressed
  );
  const downButtonPressed = useSelector(
    (state: AppState) => state.board.downButtonPressed
  );
  const leftButtonPressed = useSelector(
    (state: AppState) => state.board.leftButtonPressed
  );
  const rightButtonPressed = useSelector(
    (state: AppState) => state.board.rightButtonPressed
  );
  const spaceButtonPressed = useSelector(
    (state: AppState) => state.board.spaceButtonPressed
  );
  const activeCellX = useSelector(
    (state: AppState) => state.board.activeCell[0]
  );
  const activeCellY = useSelector(
    (state: AppState) => state.board.activeCell[1]
  );
  const validInputKeys = useSelector(
    (state: AppState) => state.board.validInputKeys
  );

  let keyPressedEventHandler = (event: any) => {
    if (event.key) {
      if (
        !(
          validInputKeys.includes(event.key) ||
          validInputKeys.includes(event.keyCode)
        )
      ) {
        return;
      }
      event.preventDefault();
      if (event.key === "w" && !upButtonPressed) {
        dispatch(setUpButtonPressed());
        dispatch(moveUp());
      } else if (event.key === "s" && !downButtonPressed) {
        dispatch(setDownButtonPressed());
        dispatch(moveDown());
      } else if (event.key === "a" && !leftButtonPressed) {
        dispatch(setLeftButtonPressed());
        dispatch(moveLeft());
      } else if (event.key === "d" && !rightButtonPressed) {
        dispatch(setRightButtonPressed());
        dispatch(moveRight());
      } else if (event.keyCode === 32 && !spaceButtonPressed) {
        dispatch(setSpaceButtonPressed());
        let row = activeCellY;
        let col = activeCellX;
        dispatch(updateBoardValue({ row: row, column: col, value: 1 }));
      }
    }
  };

  let keyReleasedEventHandler = (event: any) => {
    if (event.key) {
      if (
        !(
          validInputKeys.includes(event.key) ||
          validInputKeys.includes(event.keyCode)
        )
      ) {
        return;
      }
      if (event.key === "w") {
        dispatch(setUpButtonReleased());
      } else if (event.key === "s") {
        dispatch(setDownButtonReleased());
      } else if (event.key === "a") {
        dispatch(setLeftButtonReleased());
      } else if (event.key === "d") {
        dispatch(setRightButtonReleased());
      } else if (event.keyCode === 32) {
        dispatch(setSpaceButtonReleased());
      }
    }
  };

  //Input listeners
  useEffect(() => {
    console.log("~~~ input listeners: useEffect triggered");

    if (undefined !== window) {
      window.addEventListener("keydown", keyPressedEventHandler);
      window.addEventListener("keyup", keyReleasedEventHandler);
    }

    return () => {
      console.log("~~~ input listeners: cleanup");
      window.removeEventListener("keydown", keyPressedEventHandler);
      window.removeEventListener("keyup", keyReleasedEventHandler);
    };
  });

  //Board init
  useEffect(() => {
    /**
     * numRows and numCols were passed in from game config page (index)
     * If we didnt click to get here from homepage (ie; refreshed or direct link)
     * then the board defaults to 3x3 and the state is reset.
     *
     * One possible way to mitigate this is to store and re-hydrate the state.
     */
    let parsedRows: number | undefined;
    let parsedCols: number | undefined;
    //These types will be strings if they're passed in from query params
    if (typeof numRows === "string" && typeof numCols === "string") {
      parsedRows = parseInt(numRows);
      parsedCols = parseInt(numCols);
    }
    //Or we just set to the default board dims, 3x3 (have to do this until we
    //figure out how to store the redux state to localstorage to mitigate refresh
    //or direct link)
    let board: Array<Array<number | String>> = [];
    for (let i = 0; i < (parsedRows ?? 3); i++) {
      let row: Array<number | String> = [];
      for (let j = 0; j < (parsedCols ?? 3); j++) {
        row.push(Math.floor(1 + Math.random() * 10));
      }
      board.push(row);
    }
    console.log(board);
    dispatch(setBoard({ board: board }));

    //Otherwise we initialize a defualt board (maybe remove)
    // dispatch(
    //   setBoard({
    //     board: [
    //       [0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0],
    //       [0, 0, 0, 0, 0, 0],
    //     ],
    //   })
    // );

    sub.add(
      timer.subscribe((i) => {
        console.log(`~~~ tick: ${i}`);
      })
    );
    console.log("---###--- board init: useEffect");

    return () => {
      console.log("---###--- board init: cleanup");
      sub.unsubscribe();
    };
  }, []);

  function setStylingIfActive(
    row: number,
    column: number,
    defaultClass: string
  ) {
    return activeCellX == column && activeCellY == row
      ? activeCellClass
      : defaultClass;
  }

  function getParentStyle(): React.CSSProperties {
    let cssProperties: React.CSSProperties = {};
    cssProperties.display = "grid";
    cssProperties.gridTemplateRows = board
      .map((_e) => {
        return `${tileHeight}px`;
      })
      .join(" ");
    cssProperties.gridTemplateColumns = board[0]
      .map((_e) => {
        return `${tileWidth}px`;
      })
      .join(" ");
    return cssProperties;
  }

  function getBoardElements() {
    let results = [];
    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      for (let j = 0; j < row.length; j++) {
        let element = row[j];
        results.push(
          <div
            className={`cell ${setStylingIfActive(
              i,
              j,
              (i + j + 1) % 2 == 0 ? "blue-cell" : "green-cell"
            )}`}
            style={{
              gridRow: `${i + 1}/${i + 2}`,
              gridColumn: `${j + 1}/${j + 2}`,
            }}
            key={`${i}#${j}`}
            id={`${i}#${j}`}
          >
            {element}
          </div>
        );
      }
    }
    return results;
  }

  /**
   * I need to render a game board via state (not going into redux for this - maybe next project)
   * We can maybe store the state in just a regular old JSON object :think:
   *
   * We need
   * -An X and Y coordinate for each square
   * -A display value
   * -An eaten state (boolean)
   * -Player occupied
   * -Troggle occupied
   * -A running game loop that maybe repeats at quarter second intervals (could also experiment with 30fps)
   * -
   */

  //<h1>{router.query.a}</h1>
  return <div style={getParentStyle()}>{getBoardElements()}</div>;
}
