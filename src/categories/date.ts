import { Duration, formatDuration, intervalToDuration } from 'date-fns';

export default function handleDate(input: string): any {
  if (!isValid(input)) {
    return null;
  }

  const today: Date = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let isoDate: string;

  if (input === '') {
    isoDate = [
      today.getUTCFullYear(),
      `${today.getUTCMonth() + 1}`.padStart(2, '0'),
      `${today.getUTCDate()}`.padStart(2, '0'),
    ].join('-');
  } else {
    isoDate = input;
  }

  const isoDatetime: string = `${isoDate}T00:00:00Z`;
  const date: Date = new Date(isoDatetime);

  // "Thursday, January 1, 1970"
  const dateWithWeekday: string = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // "55 years, 6 months, and 1 day ago"
  const difference: string = getDifference(date, today);

  return {
    title: dateWithWeekday,
    heading: `<time datetime="${isoDatetime}">${dateWithWeekday}</time>`,
    data: {
      'How long ago': difference,
      'ISO 8601': isoDate,
      'Unix time': Math.floor(date.getTime() / 1000),
    },
  };
}

/**
 * Validate an input
 */
function isValid(input: string): boolean {
  if (input === '') {
    return true;
  }

  const match: RegExpMatchArray | null = (
    input.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  );

  if (!match) {
    return false;
  }

  const [year, month, day]: number[] = (
    match.slice(1).map((part: string) => parseInt(part, 10))
  );

  if (
    !(
      (1583 <= year && year <= 9999)
      && (1 <= month && month <= 12)
      && (1 <= day && day <= 31)
    )
  ) {
    return false;
  }

  const date: Date = new Date(`${input}T00:00:00Z`);

  if (
    !(
      date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1
      && date.getUTCDate() === day
    )
  ) {
    return false;
  }

  return true;
}

/**
 * Calculate the difference between a given date and today (00:00:00 UTC)
 */
function getDifference(date: Date, today: Date): string {
  if (date.getTime() === today.getTime()) {
    return 'Today';
  }

  const isPast: boolean = date < today;

  const [start, end]: Date[] = isPast ? [date, today] : [today, date];
  const duration: Duration = intervalToDuration({ start, end });

  const parts: string[] = formatDuration(duration, {
    format: ['years', 'months', 'days'],
    delimiter: ', ',
  }).split(', ');

  if (parts.length > 1) {
    parts.splice(-1, 1, `and ${parts.at(-1)}`);
  }

  const joinedParts: string = parts.join(parts.length === 2 ? ' ' : ', ');
  return `${joinedParts} ${isPast ? 'ago' : 'from now'}`;
}
