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
