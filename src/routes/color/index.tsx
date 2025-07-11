/**
 * Handles hex colors like "ffc0cb"
 */
export function handleColor(input: string = getRandom()) {
  if (!isValid(input)) {
    return null;
  }

  return {
    title: `#${input}`,
    style: `
      body {
        background-color: #${input};
      }
    `,
  };
}

/**
 * Validates an input
 */
function isValid(input: string): boolean {
  return /^[0-9a-f]{6}$/.test(input);
}

/**
 * Returns a random color
 */
function getRandom(): string {
  return (
    Math.floor(Math.random() * (0xffffff + 1))
      .toString(16)
      .padStart(6, '0')
  );
}
