import Head from "next/head";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";

export enum GameType {
  Multiples = "multiples",
  Factors = "factors",
  Primes = "primes",
  Equality = "equality",
  Inequality = "inequality",
}

export default function Home() {
  const [name, setName] = useState("");
  const [gameType, setGameType] = useState(GameType.Multiples);
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

  function handleStartClick() {
    return () => {
      let params: ParsedUrlQueryInput = {
        name: name,
        gameType: gameType,
      };
      router.push(
        {
          pathname: "play",
          query: params,
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
          <label className="text-white pr-2 mr-10">Nickname:</label>
          <input
            className="indent-2"
            placeholder="Enter nickname"
            value={name}
            onChange={handleNameInputChange}
          ></input>
        </div>

        {/* Game Type Selection */}
        <div className="flex justify-left pt-2 mb-4">
          <label className="text-white pr-2 mr-10">Game Type:</label>
          <select value={gameType} onChange={handleSelectGameTypeChange}>
            <option value={GameType.Multiples}>
              {getCapitalizedFirstCharString(GameType.Multiples)}
            </option>
            <option value={GameType.Factors}>
              {getCapitalizedFirstCharString(GameType.Factors)}
            </option>
            <option value={GameType.Primes}>
              {getCapitalizedFirstCharString(GameType.Primes)}
            </option>
            <option value={GameType.Equality}>
              {getCapitalizedFirstCharString(GameType.Equality)}
            </option>
            <option value={GameType.Inequality}>
              {getCapitalizedFirstCharString(GameType.Inequality)}
            </option>
          </select>
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
