import Head from "next/head";
import Image from "next/image";
import React, { SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import { GameType } from "../redux/util/enums";

export default function Home() {
  const [name, setName] = useState("");
  const [gameType, setGameType] = useState(GameType.Multiples);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  function handleCheatingChanged() {
    return setChecked(!checked);
  }
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
        gameTypeQueryParam: gameType,
        cheating: checked,
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
    <div className="pl-10 pr-10">
      <div className="home-container border-dashed border-2 rounded-md ml-[auto] mr-[auto] min-w-fit max-w-xl px-5 py-5 mt-16 flex flex-col items-center">
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

          <div className="flex justify-left items-center pt-2 mb-4">
            <label
              className="text-white flex justify-left items-center"
              htmlFor="cheatingcheckbox"
            >
              Cheat Mode Active:
              <input
                className="w-4 h-4 ml-2"
                type="checkbox"
                id="cheatingcheckbox"
                value="cheating"
                checked={checked}
                onChange={handleCheatingChanged}
              />
            </label>
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
    </div>
  );
}
