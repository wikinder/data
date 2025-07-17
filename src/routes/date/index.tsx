/**
 * Handles dates in ISO 8601 format (YYYY-MM-DD)
 */
export function handleDate(input: string = getToday()) {
  if (!isValid(input)) {
    return null;
  }

  const isoDatetime = `${input}T00:00:00Z`;
  const date = new Date(isoDatetime);

  // "Thursday, January 1, 1970"
  const dateWithWeekday = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    title: dateWithWeekday,
    data: {
      'ISO 8601': input,
      'Unix time': String(Math.floor(date.getTime() / 1000)),
    },
  };
}

/**
 * Validates an input
 */
function isValid(input: string): boolean {
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return false;
  }

  const [year, month, day] = match.slice(1).map((str) => parseInt(str, 10));

  if (
    !(1583 <= year && year <= 9999
      && 1 <= month && month <= 12
      && 1 <= day && day <= 31)
  ) {
    return false;
  }

  const date = new Date(`${input}T00:00:00Z`);

  return (
    date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
  );
}

/**
 * Returns the current date in UTC
 */
function getToday(): string {
  const now = new Date();

  return [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
  ].join('-');
}
