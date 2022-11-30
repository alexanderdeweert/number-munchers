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
  decrementLives,
  pushMessage,
  popMessaage,
  setAnswersRemaining,
  decrementAnswersRemaining,
  incrementLevel,
} from "../redux/board";
import { AppState } from "../store";
import { GameType } from ".";
import { stringify } from "querystring";

export default function Play() {
  const router = useRouter();
  const { name, gameType } = router.query;
  const board = useSelector((state: AppState) => state.board.board);
  const dispatch = useDispatch();
  const timer = interval(1000);
  const sub = new Subscription();
  const [activeCellClass, setActiveCellClass] = useState("purple-cell");
  const [tileWidth, setTileWidth] = useState(100);
  const [tileHeight, setTileHeight] = useState(100);
  const [won, setWon] = useState(false);
  //TODO: maybe resolve from state instead?
  //Especially if state can be re-hydrated from localstorage
  const [resolvedGameType, setResolvedGameType] = useState(
    gameType ?? "multiples"
  );
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
  const cellValue = useSelector(
    (state: AppState) =>
      state.board.board[state.board.activeCell[1]][state.board.activeCell[0]]
  );
  const numLives = useSelector((state: AppState) => state.board.lives);
  const level = useSelector((state: AppState) => state.board.level);
  const numMessages = useSelector(
    (state: AppState) => state.board.messages.length
  );
  const peekMessages = useSelector(
    (state: AppState) => state.board.messages[0]
  );
  const answersRemaining = useSelector(
    (state: AppState) => state.board.answersRemaining
  );
  const boardInitialized = useSelector(
    (state: AppState) => state.board.boardInitialized
  );
  const numRows = useSelector((state: AppState) => state.board.numRows);
  const numCols = useSelector((state: AppState) => state.board.numCols);

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
      //If there are messages, space dismisses it and pops a message
      //TODO: If there are messages we should pause game logic (ie; the ticker)
      if (numMessages) {
        if (event.keyCode === 32 && !spaceButtonPressed) {
          //If we're here and there aren't any answers left, reset the board and
          //advance the level?
          dispatch(popMessaage());
          if (answersRemaining === 0) {
            //TODO: Maybe set a boolean in the useEffect dependency array for the board reset state
            //So here we increment the level, etc, and then re-roll the board
            console.log("you win, would reset level");
            dispatch(incrementLevel());
            setWon(true);
          }
        }
        return;
      }
      //No messages
      else {
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
          if (resolvedGameType === "multiples") {
            if (typeof cellValue == "number" && cellValue % level == 0) {
              console.log(`MUNCHED ${cellValue}, a multiple of: ${level}`);
              dispatch(
                updateBoardValue({
                  row: activeCellY,
                  column: activeCellX,
                  value: undefined,
                })
              );
              if (answersRemaining === 1) {
                dispatch(pushMessage({ message: "Noice" }));
              }
              dispatch(decrementAnswersRemaining());
            } else if (typeof cellValue !== "undefined") {
              dispatch(
                pushMessage({
                  message: `${cellValue} is not a multiple of ${level}`,
                })
              );
              dispatch(decrementLives());
            }
          }
        }
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
    if (undefined !== window) {
      window.addEventListener("keydown", keyPressedEventHandler);
      window.addEventListener("keyup", keyReleasedEventHandler);
    }

    return () => {
      window.removeEventListener("keydown", keyPressedEventHandler);
      window.removeEventListener("keyup", keyReleasedEventHandler);
    };
  });

  //Board generation with query params
  useEffect(() => {
    /**
     * numRows and numCols were passed in from game config page (index)
     * If we didnt click to get here from homepage (ie; refreshed or direct link)
     * then the board defaults to 3x3 and the state is reset.
     *
     * One possible way to mitigate this is to store and re-hydrate the state.
     */
    //Or we just set to the default board dims, 3x3 (have to do this until we
    //figure out how to store the redux state to localstorage to mitigate refresh
    //or direct link)
    let board: Array<Array<number | String>> = [];
    let numAnswers = 0;
    //Generate at least 5 answers associated to a random row and col.

    let answerMap: Map<String, number> | undefined;
    //Multiples (TODO: do this for other game modes)
    if (resolvedGameType == GameType.Multiples) {
      answerMap = generateAnswersAtRandomLocations();
    }

    for (let i = 0; i < numRows; i++) {
      let row: Array<number | String> = [];
      for (let j = 0; j < numCols; j++) {
        //If we've already designated this row & col to have a valid answer
        //We populate that spot with the answer from a map
        let key = `${i}#${j}`;
        if (answerMap && answerMap.has(key)) {
          console.log(`answer map had ${key} for ${answerMap.get(key)}`);
          row.push(answerMap.get(key)!);
          numAnswers++;
        } else {
          //Else just make anything
          let generatedValue = Math.floor(
            1 + Math.random() * 100 + (level * 2 - 1)
          );
          //If multiples
          if (
            resolvedGameType === GameType.Multiples &&
            generatedValue % level === 0
          ) {
            numAnswers++;
          }
          //If primes etc
          row.push(generatedValue);
        }
      }
      board.push(row);
    }
    dispatch(setAnswersRemaining({ remaining: numAnswers }));
    dispatch(setBoard({ board: board }));

    console.log("---###--- board init: useEffect");
  }, [level]);

  function setStylingIfActive(row: number, column: number): String | undefined {
    if (activeCellX == column && activeCellY == row) {
      return activeCellClass;
    }
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

  function highlightIfCheating(element: number | String | undefined) {
    if (typeof element == "number") {
      //If multiples
      if (resolvedGameType == GameType.Multiples && element % level === 0) {
        return true;
      }
    }
    return false;
  }

  function getBoardElements() {
    let results = [];
    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      for (let j = 0; j < row.length; j++) {
        let element = row[j];
        results.push(
          <div
            className={`cell ${setStylingIfActive(i, j)}`}
            // className={`cell ${setStylingIfActive(i, j)} ${
            //   highlightIfCheating(element) ? "cheating" : "not-cheating"
            // }`}
            style={{
              gridRow: `${i + 1}/${i + 2}`,
              gridColumn: `${j + 1}/${j + 2}`,
              borderLeft: j == 0 ? 4 : 2,
              borderTop: i == 0 ? 4 : 2,
              borderRight: j == row.length - 1 ? 4 : 2,
              borderBottom: i == board.length - 1 ? 4 : 2,
              borderStyle: "solid",
              borderColor: "magenta",
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

  function getFormattedGameTypeTitle(gameType: string | string[] | undefined) {
    switch (typeof gameType) {
      case "string":
        return gameType[0].toUpperCase().concat(gameType.substring(1));
      case "object":
        return gameType.join(" ");
      default:
        return "Game";
    }
    if (typeof gameType === "string") {
      return;
    }
  }

  function getNumLivesElements() {
    let elements: Array<JSX.Element> = [];
    for (let i = 0; i < numLives; i++) {
      elements.push(
        <h2
          className={`text-center text-2xl mb-5 font-bold text-cyan-500 mt-10 ${
            i === numLives - 1 ? "mr-0" : "mr-5"
          }`}
          key={i}
        >
          {"(◡‿◡✿)"}
        </h2>
      );
    }
    return elements;
  }

  function renderNextMessageElement() {
    return [
      <h1
        className="text-center text-2xl font-bold text-cyan-500"
        key="messageElement"
      >
        {peekMessages}
      </h1>,
      <h2 key="pressSpaceElementKey">Press space to continue</h2>,
    ];
  }

  //This only works for
  function generateAnswersAtRandomLocations() {
    //Need to do this for larger levels > 10
    //The multiplier in Math.random()*multiplier <--below
    //must be one magnitude larger than numCols or numRows
    let colMultiplierMod = Math.floor(numCols / 10) + 1;
    let rowMultiplierMod = Math.floor(numRows / 10) + 1;
    //We will make a map of <row#col : value>
    let minAnswers = new Map<String, number>();
    let cur = -1;
    for (let i = 0; i < 4; i++) {
      //TODO: Have to do this for other game modes
      while (cur % level !== 0) {
        cur = Math.floor(1 + Math.random() * 100 + (level * 2 - 1));
      }
      //random row and col key
      let randColumn =
        Math.floor(Math.random() * Math.pow(10, colMultiplierMod)) % numCols;
      let randRow =
        Math.floor(Math.random() * Math.pow(10, rowMultiplierMod)) % numRows;
      let key = `${randRow}#${randColumn}`;
      console.log(`key generated ${key} for answer ${cur}`);
      //Repeating answers is fine
      //Repeating keys is fine, it just means we won't get as many
      //randomized pre-set answers - but this is an acceptable bug
      minAnswers.set(key, cur);
      cur = -1;
    }
    return minAnswers;
  }

  return (
    <div className="play-container flex flex-col items-center">
      <h1 className="text-center text-3xl mb-2 font-bold text-cyan-500 mt-10">
        {getFormattedGameTypeTitle(resolvedGameType)} of {level}
      </h1>
      <h3 className="text-center mb-5 font-bold text-cyan-500">
        {name?.length ? name : "Muncher"}&apos;s Game
      </h3>
      <div className="relative" style={getParentStyle()}>
        {getBoardElements()}
        {numMessages > 0 && (
          <div className="message flex flex-col items-center justify-center">
            {renderNextMessageElement()}
          </div>
        )}
      </div>
      <div className="play-container flex flex-row items-center">
        {getNumLivesElements()}
      </div>
    </div>
  );
}
