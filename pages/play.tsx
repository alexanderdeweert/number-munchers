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
  decrementLives,
  pushMessage,
  popMessaage,
  setAnswersRemaining,
  decrementAnswersRemaining,
  incrementLevel,
  setLevel,
  generatePrimesAsync,
  generatePrimeFactorsAsync,
  generateIndexCombinationsAsync,
  generateFactorsAnswersAsync,
  generateBoardWithAnswersAsync,
  setLevelAsync,
  generateMultiplesAnswersAsync,
  setGameTypeAsync,
  generatePrimesAnswersAsync,
} from "../redux/board";
import { AppState, AppDispatch } from "../store";
import { isPrime } from "../redux/util/util";
import { GameType } from "../redux/util/enums";

export default function Play() {
  const router = useRouter();
  const { name, gameTypeQueryParam, cheating } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const timer = interval(1000);
  const sub = new Subscription();
  const [activeCellClass, setActiveCellClass] = useState("purple-cell");
  const [tileWidth, setTileWidth] = useState(100);
  const [tileHeight, setTileHeight] = useState(100);
  const [won, setWon] = useState(0);

  const board = useSelector((state: AppState) => state.board.board);
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
  const gameTypeSelector = useSelector(
    (state: AppState) => state.board.gameType
  );
  const numRows = useSelector((state: AppState) => state.board.numRows);
  const numCols = useSelector((state: AppState) => state.board.numCols);
  const primes = useSelector((state: AppState) => state.board.primes);
  const primeFactors = useSelector(
    (state: AppState) => state.board.primeFactors
  );
  const primeIndexCombinations = useSelector(
    (state: AppState) => state.board.primeIndexCombinations
  );

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
    console.log("---###--- board init: useEffect " + cheating);
    if (typeof gameTypeQueryParam == "string") {
      if (gameTypeQueryParam === GameType.Multiples) {
        initializeMultiplesBoard();
      } else if (gameTypeQueryParam === GameType.Factors) {
        console.log("~~~ game type was factors");
        initializeFactorsBoard();
      } else if (gameTypeQueryParam === GameType.Primes) {
        console.log("~~~ game type was primes");
        initializePrimesBoard();
      }
    }
  }, [won]);

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
            //dispatch(incrementLevel());
            setWon(won + 1);
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
          handleSpacebarPressed();
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

  async function initializeFactorsBoard() {
    //First init (state is initialized to -1)
    await dispatch(setGameTypeAsync(GameType.Factors));

    if (level < 4) {
      await dispatch(setLevelAsync(4));
    }
    //Increment level when regenerating
    else {
      let curLevel = level + 1;
      while (isPrime(curLevel)) {
        curLevel++;
      }
      await dispatch(setLevelAsync(curLevel));
    }
    if (!primes.length) {
      await dispatch(generatePrimesAsync());
    }
    await dispatch(generatePrimeFactorsAsync());
    await dispatch(generateIndexCombinationsAsync());
    await dispatch(generateFactorsAnswersAsync());
    await dispatch(generateBoardWithAnswersAsync());
  }

  async function initializeMultiplesBoard() {
    await dispatch(setGameTypeAsync(GameType.Multiples));
    if (level < 2) {
      await dispatch(setLevelAsync(2));
    } else {
      await dispatch(setLevelAsync(level + 1));
    }
    await dispatch(generateMultiplesAnswersAsync());
    await dispatch(generateBoardWithAnswersAsync());
  }

  async function initializePrimesBoard() {
    await dispatch(setGameTypeAsync(GameType.Primes));
    if (level < 2) {
      await dispatch(setLevelAsync(2));
    } else {
      await dispatch(setLevelAsync(level + 1));
    }
    if (!primes.length) {
      await dispatch(generatePrimesAsync());
    }
    await dispatch(generatePrimesAnswersAsync());
    await dispatch(generateBoardWithAnswersAsync());
  }

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
    if (typeof element == "number" && cheating == "true") {
      //If multiples
      if (gameTypeSelector == GameType.Multiples && element % level === 0) {
        return true;
      } else if (
        gameTypeSelector === GameType.Factors &&
        (level / element) % 1 === 0
      ) {
        return true;
      } else if (
        gameTypeSelector === GameType.Primes &&
        primes.includes(element)
      ) {
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
            // className={`cell ${setStylingIfActive(i, j)}`}
            className={`cell ${setStylingIfActive(i, j)} ${
              highlightIfCheating(element) ? "cheating" : "not-cheating"
            }`}
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
        if (gameType === GameType.Primes) {
          return `${gameType[0]
            .toUpperCase()
            .concat(gameType.substring(1))} - Level ${level}`;
        }
        return `${gameType[0]
          .toUpperCase()
          .concat(gameType.substring(1))} of ${level}`;
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

  function handleSpacebarPressed() {
    if (cellValueIsValidAnswer()) {
      //console.log(`MUNCHED ${cellValue}, a multiple of: ${level}`);
      clearActiveCell();
      if (answersRemaining === 1) {
        dispatch(pushMessage({ message: "Noice" }));
      }
      dispatch(decrementAnswersRemaining());
    } else if (typeof cellValue !== "undefined") {
      dispatch(
        pushMessage({
          message: `${cellValue} is not ${gameTypeSingular()}`,
        })
      );
      dispatch(decrementLives());
      clearActiveCell();
    }
  }

  function cellValueIsValidAnswer(): boolean {
    if (typeof cellValue == "number") {
      switch (gameTypeSelector) {
        case GameType.Multiples:
          return cellValue % level == 0;
        case GameType.Factors:
          return (level / cellValue) % 1 === 0;
        case GameType.Primes:
          return primes.includes(cellValue);
        default:
          return false;
      }
    }
    return false;
  }

  function gameTypeSingular() {
    switch (gameTypeSelector) {
      case GameType.Multiples:
        return `a multiple of ${level}`;
      case GameType.Factors:
        return `a factor of ${level}`;
      case GameType.Primes:
        return `prime`;
      default:
        return `an answer for ${level}`;
    }
  }

  function clearActiveCell() {
    dispatch(
      updateBoardValue({
        row: activeCellY,
        column: activeCellX,
        value: undefined,
      })
    );
  }

  return (
    <div className="play-container flex flex-col items-center">
      <h1 className="text-center text-3xl mb-2 font-bold text-cyan-500 mt-10">
        {getFormattedGameTypeTitle(gameTypeSelector)}
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
