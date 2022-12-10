import { GameType } from "../../pages";

//UTIL (TODO: move util fns to their own file)
export function isPrime(num: number) {
  if (num < 2) return false;
  let rootFloor = Math.floor(Math.sqrt(num));
  for (let i = 2; i <= rootFloor; i++) {
    if (num % i == 0) return false;
  }
  return true;
}
export function getOneHundredPrimes() {
  let result = [];
  for (let i = 2; i <= 100; i++) {
    if (isPrime(i)) {
      result.push(i);
    }
  }
  return result;
}
export function generatePrimeFactors(num: number, primes: Array<number>) {
  console.log("generating prime factors for: " + num);
  console.log("primes length: " + primes.length);
  if (isPrime(num)) return [num];
  let primeFactors = new Array<number>();
  let divisor = primes[0];
  let dividend = num;
  let quotient = dividend / divisor;
  let primeLimit = Math.ceil(num / 2);
  let primeIndex = 0;
  while (primes[primeIndex] <= primeLimit && primeIndex < primes.length) {
    quotient = dividend / divisor;
    if (quotient % 1 === 0) {
      primeFactors.push(divisor);
      dividend = quotient;
    } else {
      primeIndex++;
      divisor = primes[primeIndex];
    }
  }
  return primeFactors;
}

//Lets choose from 1 to level
export function nIndicesChooseK(arr: Array<number>) {
  let result = new Array<Array<number>>();

  let aux = (i: number, remain: number, acc: Array<number>) => {
    if (remain > 0) {
      for (let m = i + 1; m < arr.length; m++) {
        aux(m, remain - 1, [...acc, m]);
      }
    } else {
      result.push(acc);
    }
  };

  //Altering this so that k passed in is the upper bound
  //and we generate all nChooseK s.t. K is an integer in range [1..k]
  for (let i = 1; i <= arr.length; i++) {
    aux(-1, i, []);
  }

  return result;
}

export function generateFactorsAnswers(
  numCols: number,
  numRows: number,
  primeFactors: Array<number>,
  primeIndexCombinations: Array<Array<number>>
) {
  //let minAnswers = new Map<String, number>();
  let minAnswers: { [key: string]: number } = {};
  let answersSet = new Set<number>();
  let colMultiplierMod = Math.floor(numCols / 10) + 1;
  let rowMultiplierMod = Math.floor(numRows / 10) + 1;
  let largest = Number.MIN_SAFE_INTEGER;

  /**
   * use nChooseK to get all combinations of factors indices
   *
   * Get all from 1 -> (n-1)
   *
   * For now we'll do just 2
   */
  console.log(`!! index combos ${primeIndexCombinations}`);

  //For each index combination array, create the product sum of each index of primeFactors[i] * primeFactors[i-1]
  for (let i = 0; i < primeIndexCombinations.length; i++) {
    let curSum = 1;
    for (let j = 0; j < primeIndexCombinations[i].length; j++) {
      curSum *= primeFactors[primeIndexCombinations[i][j]];
    }
    answersSet.add(curSum);
  }

  let answers = Array.from(answersSet);

  for (let i = 0; i < answers.length; i++) {
    let cur = answers[i];

    let randColumn =
      Math.floor(Math.random() * Math.pow(10, colMultiplierMod)) % numCols;
    let randRow =
      Math.floor(Math.random() * Math.pow(10, rowMultiplierMod)) % numRows;
    let key = `${randRow}#${randColumn}`;

    //keep generating key until we dont have it

    // while (Object.keys(minAnswers).includes(key)) {
    randColumn =
      Math.floor(Math.random() * Math.pow(10, colMultiplierMod)) % numCols;
    randRow =
      Math.floor(Math.random() * Math.pow(10, rowMultiplierMod)) % numRows;
    key = `${randRow}#${randColumn}`;
    // }

    //minAnswers.set(key, cur);
    largest = Math.max(largest, cur);
    minAnswers[key] = cur;
  }
  return { minAnswers: minAnswers, largest: largest };
}

export function generatePrimesAnswers(
  numCols: number,
  numRows: number,
  level: number,
  primes: Array<number>
) {
  let minAnswers: { [key: string]: number } = {};
  let answersSet = new Set<number>();
  let colMultiplierMod = Math.floor(numCols / 10) + 1;
  let rowMultiplierMod = Math.floor(numRows / 10) + 1;
  let largest = Number.MIN_SAFE_INTEGER;

  //range is
  // 0-level when level < 5
  // 0-Math.ceil(level/5)
  let lowerIndexBound = 0;
  //at level 2 the range would be [0,0]
  //at level 3, [0,1] ... level5 [0,3]
  //At level 6+ [0, 4]
  //level 10 [0,5]
  //level 11
  let upperIndexBound = level - 2;
  if (level > 5) {
    // level 5 is 1
    upperIndexBound = 2 + Math.ceil((level + 1) / 5);
    console.log(
      `~~~ level is ${level} and the bounds are [${lowerIndexBound}, ${upperIndexBound}]`
    );
  }

  //We now have a bounds range from which to choose an answer from the primes list
  //Generate num answers in 5-15
  let randomNumAnswers = 5 + Math.floor(Math.random() * 11);

  //We now have the required number of answers, the range from which to choose
  //Now generate random row and col, with a key
  for (let i = 0; i < randomNumAnswers; i++) {
    let randColumn =
      Math.floor(Math.random() * Math.pow(10, colMultiplierMod)) % numCols;
    let randRow =
      Math.floor(Math.random() * Math.pow(10, rowMultiplierMod)) % numRows;
    let key = `${randRow}#${randColumn}`;

    //Using the upper bound range, get a random index
    let randomIndex = Math.floor(Math.random() * upperIndexBound);

    //Map the answer to the answers list
    if (randomIndex < primes.length) {
      largest = Math.max(largest, primes[randomIndex]);
      minAnswers[key] = primes[randomIndex];
    }
  }
  return { minAnswers: minAnswers, largestAnswer: largest };
}

export function generateMultiplesAnswers(
  numCols: number,
  numRows: number,
  level: number
) {
  let minAnswers: { [key: string]: number } = {};
  let colMultiplierMod = Math.floor(numCols / 10) + 1;
  let rowMultiplierMod = Math.floor(numRows / 10) + 1;
  let largest = Number.MIN_SAFE_INTEGER;
  let cur = -1;
  for (let i = 0; i < 4; i++) {
    while (cur % level !== 0) {
      cur = Math.floor(1 + Math.random() * 100 + (level * 2 - 1));
    }
    let randColumn =
      Math.floor(Math.random() * Math.pow(10, colMultiplierMod)) % numCols;
    let randRow =
      Math.floor(Math.random() * Math.pow(10, rowMultiplierMod)) % numRows;
    let key = `${randRow}#${randColumn}`;
    largest = Math.max(largest, cur);
    minAnswers[key] = cur;
    cur = -1;
  }
  console.log("generated: " + minAnswers);
  return { minAnswers: minAnswers, largest: largest };
}

//Next: Since this is dependent on the answerMap (in state)
//this generation function will also need to be moved into an async thunk
export function generateBoardWithAnswers(
  resolvedGameType: GameType,
  numRows: number,
  numCols: number,
  level: number,
  primes: Array<number>,
  answerMap: { [key: string]: number },
  largestAnswer: number
) {
  let board = new Array<Array<number | String>>();
  let numAnswers = 0;

  for (let i = 0; i < numRows; i++) {
    let row: Array<number | String> = [];
    for (let j = 0; j < numCols; j++) {
      //If we've already designated this row & col to have a valid answer
      //We populate that spot with the answer from a map
      let key = `${i}#${j}`;
      if (Object.keys(answerMap).includes(key)) {
        console.log(`answer map had ${key} for ${answerMap[key]}`);
        row.push(answerMap[key]);
        numAnswers++;
      } else {
        //Multiples
        if (resolvedGameType === GameType.Multiples) {
          let generatedValue = generateRandomValueInRange(1, largestAnswer + 5);
          if (generatedValue % level === 0) {
            numAnswers++;
          }
          row.push(generatedValue);
        }
        //Factors
        else if (resolvedGameType === GameType.Factors) {
          let generatedValue = generateRandomValueInRange(1, largestAnswer + 5);
          if ((level / generatedValue) % 1 === 0) {
            numAnswers++;
          }
          row.push(generatedValue);
        }
        //Primes
        else if (resolvedGameType === GameType.Primes) {
          let generatedValue = generateRandomValueInRange(1, largestAnswer + 5);
          while (isPrime(generatedValue)) {
            generatedValue++;
          }
          row.push(generatedValue);
        }
      }
    }
    board.push(row);
  }
  return { numAnswers, generatedBoard: board };
}

function generateRandomValueInRange(lo: number, hi: number) {
  let result;
  result = lo + Math.floor(Math.random() * hi);
  return result ?? 0;
}
