/**
 * Handles natural numbers
 */
export function handleNumber(input: string = getRandom()) {
  if (!isValid(input)) {
    return null;
  }

  const num = BigInt(input);
  const outputData = {};

  // Prime factorization
  if (2n <= num && num <= 4294967295n) {
    outputData['Prime factorization'] = factor(num);
  }

  // Even or odd
  const isEven = num % 2n === 0n;
  outputData['Property'] = `${num} is an ${isEven ? 'even' : 'odd'} number.`;

  return {
    pageName: `Number ${num}`,
    data: outputData,
  };
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
  return 0n <= num && num <= 18446744073709551615n;
}

/**
 * Returns a random number
 */
function getRandom(): string {
  return `${Math.floor(Math.random() * 65536)}`;
}

/**
 * Performs prime factorization
 */
function factor(num: bigint): string {
  let rest = num;
  const factors = {};

  // Helper function to factor out a given number
  const factorOut = (i: bigint) => {
    while (rest % i === 0n) {
      factors[`${i}`] ??= 0n;
      factors[`${i}`]++;
      rest /= i;
    }
  };

  // Factor out small primes
  factorOut(2n);
  factorOut(3n);

  // Factor out numbers of the form $6n \pm 1$
  let step = 2n;
  for (let i = 5n; i * i <= rest; i += step, step = 6n - step) {
    factorOut(i);
  }

  // If the number is prime
  if (rest === num) {
    return `${num} (prime number)`;
  }

  // Add any remaining prime factor
  if (rest !== 1n) {
    factors[`${rest}`] ??= 0n;
    factors[`${rest}`]++;
  }

  return Object.entries(factors)
    .map(([p, exponent]) => exponent === 1n ? `${p}` : `${p}^${exponent}`)
    .join(' * ');
}
