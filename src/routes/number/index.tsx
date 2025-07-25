import { getPrimeTable } from './prime-table';
const NUMBER_LIMIT = 2n ** 40n;

/**
 * Handles natural numbers
 */
export async function handleNumber(input: string = getRandom(), env) {
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
    const PRIME_TABLE = await getPrimeTable(env);
    const { isPrime, primeFactors } = factor(num, PRIME_TABLE);

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
  return 0n <= num && num < NUMBER_LIMIT;
}

/**
 * Returns a random number
 */
function getRandom(): string {
  return `${Math.floor(Math.random() * Number(NUMBER_LIMIT))}`;
}

/**
 * Performs prime factorization
 */
function factor(num: bigint, PRIME_TABLE) {
  // If the number is a known prime
  if (PRIME_TABLE.has(num)) {
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
  for (const p of PRIME_TABLE) {
    if (p * p > rest) {
      break;
    }

    factorOut(p);
  }

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
