import { PRIME_BITMAP, loadPrimeBitmap } from './prime-bitmap';

const NUMBER_LIMIT = 2n ** 40n;

/**
 * Handles integers >= 0
 */
export async function handleNumber(input: string = getRandom(), env) {
  if (!isValid(input)) {
    return null;
  }

  const num = BigInt(input);
  const output = {
    pageName: `Number ${num}`,
    data: {
      'Prime factorization': null,
      'Property': [],
    },
  };

  // Prime or not
  if (num > 1n) {
    await loadPrimeBitmap(env);

    if (isSmallPrime(num)) {
      output.pageName = `Prime number ${num}`;
    } else {
      // Prime factorization
      const { primeFactors, isPrime } = factor(num);

      if (isPrime) {
        output.pageName = `Prime number ${num}`;
      } else {
        output.data['Prime factorization'] = (
          Object.entries(primeFactors)
            .map(([p, exponent]) => (
              exponent === 1n ? `${p}` : `${p}^${exponent}`
            ))
            .join(' × ')
        );
      }
    }
  }

  // Even or odd
  const isEven = num % 2n === 0n;
  output.data['Property'].push(`${num} is an ${isEven ? 'even' : 'odd'} number.`);

  output.data['Property'] = output.data['Property'].join(<br />);

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
 * Checks if a number is a prime number within the prime bitmap
 */
function isSmallPrime(num: bigint) {
  if (num < 5n) {
    return num === 2n || num === 3n;
  }

  if (!(num % 6n === 5n || num % 6n === 1n)) {
    return false;
  }

  const i = (num - (num % 6n === 5n ? 5n : 4n)) / 3n;
  const byteIndex = Number(i / 8n);
  const bitIndex = Number(i % 8n);
  return (PRIME_BITMAP[byteIndex] & (0b1000_0000 >> bitIndex)) !== 0;
}

/**
 * Performs prime factorization of a number
 */
function factor(num: bigint) {
  let rest = num;
  const primeFactors = {};

  // Helper function
  const factorOut = (divisor: bigint) => {
    while (rest % divisor === 0n) {
      primeFactors[`${divisor}`] ??= 0n;
      primeFactors[`${divisor}`]++;
      rest /= divisor;
    }
  };

  factorOut(2n);
  factorOut(3n);

  // Factor out known primes
  LOOP: for (const [byteIndex, byte] of PRIME_BITMAP.entries()) {
    for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
      if ((byte & (0b1000_0000 >> bitIndex)) !== 0) {
        const i = 8 * byteIndex + bitIndex;
        const p = 3n * BigInt(i) + (i % 2 === 0 ? 5n : 4n);

        if (p * p > rest) {
          break LOOP;
        }

        factorOut(p);
      }
    }
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

  return { primeFactors, isPrime: false };
}
