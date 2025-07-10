export function handleColor(input: string = getRandomColor()) {
  if (!isValid(input)) {
    return null;
  }

  return {
    title: `#${input}`,
    heading: `#${input} Hex Color`,
    category: 'Hex Color',
    style: `
body {
  background-color: #${input};
}
`,
    data: {},
  };
}

function isValid(input: string): boolean {
  return /^[0-9a-f]{6}$/.test(input);
}

function getRandomColor(): string {
  let color = '';

  for (let i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 16).toString(16);
  }

  return color;
}
