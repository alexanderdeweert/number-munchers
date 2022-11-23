import { useRouter } from "next/router";
import { Key, useEffect, useState } from "react";
import { interval, Subscription } from "rxjs";
// import styles from "../styles/Home.module.css";

export default function Play() {
  // const timer = interval(128);
  const timer = interval(1000);
  const sub = new Subscription();
  const [cell0Class, setCell0Class] = useState('blue-cell')
  const [keyPressed, setKeyPressed] = useState(false)
  const [keyReleased, setKeyRelease] = useState(true)
  const [activeCell, setActiveCell] = useState([0,0])


  let handleKeyPressed = (event: any) => {
    if(event.key) {
      event.preventDefault();
      if(!keyPressed) {
        console.log(`~~ PRESSED ${event.key}, keyPressed: ${keyPressed}`)
        // console.log(`active cell WAS ${activeCell}`)
        if(event.key === 'w') {
          console.log('UP')
          // setActiveCell([activeCell[0], activeCell[1]++])
          setKeyPressed(true)
        }
        else if(event.key === 'a') {
          console.log('LEFT')
          setKeyPressed(true)
        }
        else if(event.key === 's') {
          console.log('DOWN')
          setKeyPressed(true)
        }
        else if(event.key === 'd') {
          console.log('RIGHT')
          setKeyPressed(true)
        }
        console.log(`~~ keyPressed: ${keyPressed}`)
        // console.log(`active cell IS ${activeCell}`)
      }
    }
  }

  let handleKeyRelease = (event: any) => {
    if(event.key) {
      event.preventDefault();
      console.log(`~~ RELEASED`)
      if(event.key === 'w') {
        setKeyPressed(false)
      }
      else if(event.key === 'a') {
        setKeyPressed(false)
      }
      else if(event.key === 's') {
        setKeyPressed(false)
      }
      else if(event.key === 'd') {
        setKeyPressed(false)
      }
    }
  }

  //Crude gameloop.
  //7.5 fps is 128ms interval
  useEffect(() => {
    console.log("triggered")
    sub.add(
      timer.subscribe((i) => {
        console.log(`~~~ tick: ${i} cell0Class: ${cell0Class}`);
        setCell0Class( i % 2 == 0 ? 'red-cell' : 'blue-cell')
      })
    );

    if(undefined !== document) {
      document.addEventListener('keyup', handleKeyRelease)
      document.addEventListener('keydown', handleKeyPressed)
    }

    return () => {
      sub.unsubscribe();
      document.removeEventListener('keyup', handleKeyRelease);
      document.removeEventListener('keydown', handleKeyPressed);
    };
  }, []);
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
      <div className="cell1 cell red-cell">cell1</div>
      <div className="cell2 cell blue-cell">cell2</div>
      <div className="cell3 cell red-cell">cell3</div>
      <div className="cell4 cell blue-cell">cell4</div>
      <div className="cell5 cell red-cell">cell5</div>
      <div className="cell6 cell blue-cell">cell6</div>
      <div className="cell7 cell red-cell">cell7</div>
      <div className="cell8 cell blue-cell">cell8</div>
    </div>
  );
}
