import Head from "next/head";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function Home() {
  enum GameType {
    Sum = "sum",
    Multiples = "multiples",
    Multiply = "multiply",
    Divide = "divide",
  }
  const [name, setName] = useState("");
  const [gameType, setGameType] = useState(GameType.Sum);
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(10);
  const router = useRouter();

  function handleNameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    return setName(e.target.value);
  }
  function handleSelectGameTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    return setGameType(e.target.value as GameType);
  }
  function getCapitalizedFirstCharString(s: String): String {
    return s[0].toUpperCase().concat(s.substring(1));
  }
  function handleRangeFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValidRangeNumber(setRangeFrom, e);
  }
  function handleRangeToChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValidRangeNumber(setRangeTo, e);
  }
  function setValidRangeNumber(
    stateSetter: (value: SetStateAction<number>) => void,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = e.target.value;
    if (isNaN(parseInt(value))) {
      return stateSetter(0);
    }
    return stateSetter(parseInt(value));
  }

  function handleStartClick() {
    return () => {
      console.log(`~~~ start clicked: ${[name, gameType, rangeFrom, rangeTo]}`);
      router.push(
        {
          pathname: "play",
          query: { a: "foo", b: "bar" },
        },
        "play"
      );
    };
  }
  return (
    <div className="home-container border-dashed border-2 rounded-md ml-[auto] mr-[auto] w-3/4 px-5 py-5 mt-16 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-center text-3xl mb-5 font-bold text-indigo-500">
        Number Munchers
      </h1>

      {/* Form Body */}
      <div className="w-80">
        {/* Name Input */}
        <div className="name-input-container flex justify-left pt-2 mb-4">
          <label className="text-white pr-2 mr-10">Name:</label>
          <input
            className="indent-2"
            placeholder="Enter name"
            value={name}
            onChange={handleNameInputChange}
          ></input>
        </div>

        {/* Game Type Selection */}
        <div className="flex justify-left pt-2 mb-4">
          <label className="text-white pr-2 mr-10">Game Type:</label>
          <select value={gameType} onChange={handleSelectGameTypeChange}>
            <option value={GameType.Sum}>
              {getCapitalizedFirstCharString(GameType.Sum)}
            </option>
            <option value={GameType.Multiples}>
              {getCapitalizedFirstCharString(GameType.Multiples)}
            </option>
            <option value={GameType.Multiply}>
              {getCapitalizedFirstCharString(GameType.Multiply)}
            </option>
            <option value={GameType.Divide}>
              {getCapitalizedFirstCharString(GameType.Divide)}
            </option>
          </select>
        </div>

        {/* Range */}
        <div className="flex justify-left pt-2 mb-4">
          <label className="text-white pr-2 mr-10">Range:</label>
          <input
            className="w-14 text-center"
            value={rangeFrom}
            onChange={handleRangeFromChange}
          ></input>
          <label className="text-white m-2">to</label>
          <input
            className="w-14 text-center"
            value={rangeTo}
            onChange={handleRangeToChange}
          ></input>
        </div>

        {/* Start Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleStartClick()}
            className="bg-indigo-600 text-white text-center font-bold border-2 rounded-lg w-40 h-12"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
