import { DateTime } from 'luxon';

export default function handleDate(input: string): any {
  if (!isValid(input)) {
    return null;
  }

  const date: DateTime = DateTime.fromISO(input, {
    locale: 'en-US',
    zone: 'utc',
  });

  if (!date.isValid) {
    return null;
  }

  // "Thursday, January 1, 1970"
  const title: string = date.toLocaleString(DateTime.DATE_HUGE);

  // "1970-01-01T00:00:00Z"
  const isoDatetime: string = date.toISO({ suppressMilliseconds: true });

  const heading: string = `
      <time datetime="${isoDatetime}">${title}</time>
    `;

  return {
    title,
    heading,
    data: {
      'ISO 8601': date.toISODate(),
      'Unix time': date.toUnixInteger(),
    },
  };
}

function isValid(input: string): boolean {
  const match: RegExpMatchArray | null = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return false;
  }

  const [year, month, day] = match.slice(1).map((part: string) => parseInt(part, 10));

  return (
    1583 <= year && year <= 9999
    && 1 <= month && month <= 12
    && 1 <= day && day <= 31
  );
}
