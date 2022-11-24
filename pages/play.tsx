import { useRouter } from "next/router";
import { Key, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { interval, Subscription } from "rxjs";
import { increment, setButtonPressed, setButtonReleased, moveUp, moveDown, moveLeft, moveRight } from "../redux/board";
import { AppState } from "../store";
// import styles from "../styles/Home.module.css";

export default function Play() {

  console.log("~~ new function")
  // const boardCount = useSelector((state: AppState) => state.board.value)
  const boardButtonPressed = useSelector((state: AppState) => state.board.buttonPressed)
  const activeCellX = useSelector((state: AppState)=> state.board.activeCell[0])
  const activeCellY = useSelector((state: AppState)=> state.board.activeCell[1])
  const dispatch = useDispatch();

  // const timer = interval(128);
  const timer = interval(1000);
  const sub = new Subscription();
  const [activeCellClass, setActiveCellClass] = useState('purple-cell')
  // const [keyPressed, setKeyPressed] = useState({pressed: false})
  // const [keyReleased, setKeyRelease] = useState(true)
  const [activeCell, setActiveCell] = useState([0,0])


  let keyPressedEventHandler = (event: any) => {
    if(event.key) {
      event.preventDefault();
      if(!boardButtonPressed) {
        if(event.key === 'w') {
          dispatch(setButtonPressed())
          dispatch(moveUp())
          console.log(`UP`)
        }
        else if(event.key === 's') {
          dispatch(setButtonPressed())
          dispatch(moveDown())
          console.log(`DOWN`)
        }
        else if(event.key === 'a') {
          dispatch(setButtonPressed())
          dispatch(moveLeft())
          console.log(`LEFT`)
        }
        else if(event.key === 'd') {
          dispatch(setButtonPressed())
          dispatch(moveRight())
          console.log(`RIGHT`)
        }
      }
    }
  }

  let keyReleasedEventHandler = (event: any) => {
    if(event.key) {
      event.preventDefault();
      if(event.key === 'w') {
        console.log(`~~ w RELEASED`)
        dispatch(setButtonReleased())
      }
      else if(event.key === 's') {
        console.log(`~~ s RELEASED`)
        dispatch(setButtonReleased())
      }
      else if(event.key === 'a') {
        console.log(`~~ a RELEASED`)
        dispatch(setButtonReleased())
      }
      else if(event.key === 'd') {
        console.log(`~~ d RELEASED`)
        dispatch(setButtonReleased())
      }
    }
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
  function setStylingIfActive(row: number, column: number, defaultClass: string) {
    return activeCellX == column && activeCellY == row ? activeCellClass : defaultClass
  }
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
      <div className={`cell0 cell ${setStylingIfActive(0, 0, 'blue-cell')}`}>cell0</div>
      <div className={`cell1 cell ${setStylingIfActive(0, 1, 'red-cell')}`}>cell1</div>
      <div className={`cell2 cell ${setStylingIfActive(0, 2, 'blue-cell')}`}>cell2</div>
      <div className={`cell3 cell ${setStylingIfActive(1, 0, 'red-cell')}`}>cell3</div>
      <div className={`cell4 cell ${setStylingIfActive(1, 1, 'blue-cell')}`}>cell4</div>
      <div className={`cell5 cell ${setStylingIfActive(1, 2, 'red-cell')}`}>cell5</div>
      <div className={`cell6 cell ${setStylingIfActive(2, 0, 'blue-cell')}`}>cell6</div>
      <div className={`cell7 cell ${setStylingIfActive(2, 1, 'red-cell')}`}>cell7</div>
      <div className={`cell8 cell ${setStylingIfActive(2, 2, 'blue-cell')}`}>cell8</div>
    </div>
  );
}
