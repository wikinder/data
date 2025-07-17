/**
 * Handles natural numbers (including 0)
 */
export function handleNumber(input: string = getRandom()) {
  if (!isValid(input)) {
    return null;
  }

  const num = BigInt(input);
  const isEven = num % 2n === 0n;

  return {
    title: String(num),
    data: {
      'Properties': `${num} is ${isEven ? 'an even' : 'an odd'} number.`,
    },
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
  return String(Math.floor(Math.random() * 4294967296));
}
