import { Duration, formatDuration, intervalToDuration } from 'date-fns';

export default function handleDate(input: string): any {
  const { isValid, date, isoDatetime } = validate(input);

  if (!isValid) {
    return null;
  }

  // "Thursday, January 1, 1970"
  const dateWithWeekday: string = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // "55 years, 6 months, and 1 day ago"
  const difference: string = getDifference(date);

  return {
    title: dateWithWeekday,
    heading: `<time datetime="${isoDatetime}">${dateWithWeekday}</time>`,
    data: {
      'Time difference': difference,
      'ISO 8601': input,
      'Unix time': Math.floor(date.getTime() / 1000),
    },
  };
}

function validate(input: string): any {
  const match: RegExpMatchArray | null = (
    input.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  );

  if (!match) {
    return { isValid: false };
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
    return { isValid: false };
  }

  const isoDatetime: string = `${input}T00:00:00Z`;
  const date: Date = new Date(isoDatetime);

  if (
    !(
      date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1
      && date.getUTCDate() === day
    )
  ) {
    return { isValid: false };
  }

  return { isValid: true, date, isoDatetime };
}

function getDifference(date: Date): string {
  const today: Date = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return 'Today';
  }

  const isPast: boolean = date < today;

  const duration: Duration = intervalToDuration(
    isPast ? { start: date, end: today } : { start: today, end: date }
  );

  const parts: string[] = formatDuration(duration, {
    format: ['years', 'months', 'days'],
    delimiter: ', ',
  }).split(', ');

  if (parts.length > 1) {
    parts.splice(-1, 1, `and ${parts.at(-1)}`);
  }

  return `${parts.join(parts.length === 2 ? ' ' : ', ')} ${isPast ? 'ago' : 'from now'}`;
}
