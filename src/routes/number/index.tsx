import { PRIMES } from './primes';

/**
 * Handles natural numbers
 */
export function handleNumber(input: string = getRandom()) {
  if (!isValid(input)) {
    return null;
  }

  const num = BigInt(input);
  const output = {
    pageName: `Number ${num}`,
    data: {},
  };

  // Prime factorization
  if (num > 1n) {
    const { isPrime, primeFactors } = factor(num);

    if (isPrime) {
      output.pageName = `Prime number ${num}`;
    } else {
      output.data['Prime factorization'] = (
        Object.entries(primeFactors)
          .map(([p, exponent]) => exponent === 1n ? `${p}` : `${p}^${exponent}`)
          .join(' × ')
      );
    }
  }

  // Even or odd
  const isEven = num % 2n === 0n;
  output.data['Property'] = `${num} is an ${isEven ? 'even' : 'odd'} number.`;

  return output;
}

/**
 * Validates an input
 */
function isValid(input: string): boolean {
  const match = input.match(/^(0|[1-9][0-9]*)$/);

  if (!match) {
    return false;
  }

  const num = BigInt(match[1]);
  return 0n <= num && num < 2n**32n;
}

/**
 * Returns a random number
 */
function getRandom(): string {
  return `${Math.floor(Math.random() * (2**32))}`;
}

/**
 * Performs prime factorization
 */
function factor(num: bigint) {
  // If the number is a known prime
  if (PRIMES.has(num)) {
    return { isPrime: true };
  }

  let rest = num;
  const primeFactors = {};

  // Helper function
  const factorOut = (i: bigint) => {
    while (rest % i === 0n) {
      primeFactors[`${i}`] ??= 0n;
      primeFactors[`${i}`]++;
      rest /= i;
    }
  };

  // Factor out known primes
  for (const p of PRIMES) {
    if (p * p > rest) {
      break;
    }

    factorOut(p);
  }

  // Factor out numbers of the form $6k \pm 1$
  // if (MAX_PRIME * MAX_PRIME < rest) {
  //   let step = MAX_PRIME % 6n === 1n ? 4n : 2n;
  //   let i = MAX_PRIME + step;
  //
  //   while (i * i <= rest) {
  //     factorOut(i);
  //     step = 6n - step;
  //     i += step;
  //   }
  // }

  // If the number is prime
  if (rest === num) {
    return { isPrime: true };
  }

  // Add any remaining prime factor
  if (rest > 1n) {
    primeFactors[`${rest}`] ??= 0n;
    primeFactors[`${rest}`]++;
  }

  return { primeFactors };
}
