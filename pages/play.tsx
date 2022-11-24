import { useRouter } from "next/router";
import { Key, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { interval, Subscription } from "rxjs";
import { increment, setButtonPressed, setButtonReleased } from "../redux/board";
import { AppState } from "../store";
// import styles from "../styles/Home.module.css";

export default function Play() {

  console.log("~~ new function")
  const boardCount = useSelector((state: AppState) => state.board.value)
  const boardButtonPressed = useSelector((state: AppState) => state.board.buttonPressed)
  const dispatch = useDispatch();

  // const timer = interval(128);
  const timer = interval(1000);
  const sub = new Subscription();
  const [cell0Class, setCell0Class] = useState('blue-cell')
  // const [keyPressed, setKeyPressed] = useState({pressed: false})
  // const [keyReleased, setKeyRelease] = useState(true)
  const [activeCell, setActiveCell] = useState([0,0])


  let keyPressedEventHandler = (event: any) => {
    if(event.key) {
      event.preventDefault();
      if(event.key === 'w') {
        if(!boardButtonPressed) {
          console.log(`~~~ doin this`)
          console.log(boardButtonPressed)
          dispatch(setButtonPressed())
          dispatch(increment())
          // setActiveCell([activeCell[0], activeCell[1]++])
          console.log(`UP: ${boardCount}`)
        }
      }
    }
  }

  let keyReleasedEventHandler = (event: any) => {
    if(event.key) {
      event.preventDefault();
      if(event.key === 'w') {
        console.log(`~~ RELEASED`)
        dispatch(setButtonReleased())
      }
    }
  }

  let handleCellClick = () => {
    dispatch(increment())
    console.log(`~~~ cellClick - increment: ${boardCount}`)
  }

  //Crude gameloop.
  //7.5 fps is 128ms interval
  useEffect(() => {
    console.log("useEffect triggered")
    // sub.add(
    //   timer.subscribe((i) => {
    //     console.log(`~~~ tick: ${i} cell0Class: ${cell0Class}`);
    //     setCell0Class( i % 2 == 0 ? 'red-cell' : 'blue-cell')
    //   })
    // );
    if(undefined !== window) {
      window.addEventListener('keydown', keyPressedEventHandler)
      window.addEventListener('keyup', keyReleasedEventHandler)
    }

    return () => {
      console.log("~~~ cleanup")
      // sub.unsubscribe();
      window.removeEventListener('keydown', keyPressedEventHandler);
      window.removeEventListener('keyup', keyReleasedEventHandler);
    };
  });
  // useEffect(() => {
  //   console.log("~~~ unsubscribe");

  // });
  const router = useRouter();
  const { name, gameType } = router.query;
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
  return (
    <div className="parent">
      <div className={`cell0 cell ${cell0Class}`}>cell0</div>
      <div className="cell1 cell red-cell">cell1 {boardCount}</div>
      <div className="cell2 cell blue-cell" onClick={() => handleCellClick()}>cell2 : {boardCount}</div>
      <div className="cell3 cell red-cell">cell3</div>
      <div className="cell4 cell blue-cell">cell4</div>
      <div className="cell5 cell red-cell">cell5</div>
      <div className="cell6 cell blue-cell">cell6</div>
      <div className="cell7 cell red-cell">cell7</div>
      <div className="cell8 cell blue-cell">cell8</div>
    </div>
  );
}
