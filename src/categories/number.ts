export default function handleNumber(input: string): any {
  if (!isValid(input)) {
    return null;
  }

  let num: number;

  if (input === '') {
    num = Math.floor(Math.random() * 2**32);
  } else {
    num = parseInt(input, 10);
  }

  return {
    title: num,
    data: {
      'Property': `${num} is ${num % 2 === 0 ? 'an even' : 'an odd'} number.`,
    },
  };
}

function isValid(input: string): boolean {
  if (input === '') {
    return true;
  }

  const match: RegExpMatchArray | null = input.match(/^(0|[1-9][0-9]{0,9})$/);

  if (!match) {
    return false;
  }

  const num: number = parseInt(match[1], 10);
  return 0 <= num && num <= 4294967295;
}
