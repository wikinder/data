export default function handleColor(input: string): any {
  if (!isValid(input)) {
    return null;
  }

  let code: string;

  if (input === '') {
    code = '';

    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 16).toString(16);
    }
  } else {
    code = input;
  }

  return {
    title: `#${code}`,
    heading: `#${code} Hex Color`,
    category: 'Hex Color',
    style: `

      body {
        background-color: #${code};
      }`,
  };
}

function isValid(input: string): boolean {
  if (input === '') {
    return true;
  }

  return /^[0-9a-f]{6}$/.test(input);
}
