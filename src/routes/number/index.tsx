/**
 * Handles natural numbers (including 0)
 */
export function handleNumber(input: string = getRandom()) {
  if (!isValid(input)) {
    return null;
  }

  const num = parseInt(input, 10);

  return {
    title: num,
    data: {
      'Properties': `${num} is ${num % 2 === 0 ? 'an even' : 'an odd'} number.`,
    },
  };
}

/**
 * Validates an input
 */
function isValid(input: string): boolean {
  const match = input.match(/^(0|[1-9]\d*)$/);

  if (!match) {
    return false;
  }

  const num = parseInt(match[1], 10);
  return 0 <= num && num <= 4294967295;
}

/**
 * Returns a random number
 */
function getRandom(): string {
  return String(Math.floor(Math.random() * 4294967296));
}
