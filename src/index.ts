/**
 * data.wikinder.org - A web service that provides information about various
 * categories of data
 */

// Import the functions that handle data for each category
import handleColor from './categories/color';
import handleDate from './categories/date';
import handleNumber from './categories/number';

const DATA_HANDLERS: any = {
  color: handleColor,
  date: handleDate,
  number: handleNumber,
};

const NOT_FOUND: Response = new Response(null, { status: 404 });

export default {
  async fetch(request: Request): Promise<Response> {
    const url: URL = new URL(request.url);
    const path: string = url.pathname;

    let title: string;
    let style: string | undefined;
    let heading: string | undefined;
    let content: string;

    if (path === '/') {
      title = 'Data';

      content = `<ul>`;

      for (const category of Object.keys(DATA_HANDLERS)) {
        content += `
      <li>
        <a href="${category}/">${capitalize(category)}</a>
      </li>`;
      }

      content += `
    </ul>`;
    } else {
      // Parse URL path in the format "/[category]/[input]", where:
      // - [category]: the category that the data falls into (e.g., "date")
      // - [input]: the data value (e.g., "1970-01-01")
      const match: RegExpMatchArray | null = path.match(/^\/([a-z]+)\/(.*)$/);

      if (!match) {
        return NOT_FOUND;
      }

      const [category, input]: string[] = match.slice(1);

      if (!(category in DATA_HANDLERS)) {
        return NOT_FOUND;
      }

      // Get the output
      const output: any = DATA_HANDLERS[category](input);

      if (!output) {
        return NOT_FOUND;
      }

      title = `${output.title} | ${output.category ?? capitalize(category)} Data`;

      style = `
    <style>
      #data th {
        text-align: left;
      }${output.style ?? ''}
    </style>`;

      heading = output.heading ?? output.title;

      // Convert the output to HTML
      content = `<table id="data">`;

      if (output.data) {
        for (const [key, value] of Object.entries(output.data)) {
          content += `
      <tr>
        <th scope="row">${key}</th>
        <td>${value}</td>
      </tr>`;
        }

        content += `
    `;
      }

      content += `</table>`;
    }

    const html: string = `<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="color-scheme" content="light dark">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <link rel="canonical" href="https://data.wikinder.org${path}">
    <link rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/">${style ?? ''}
  </head>
  <body>
    <h1>${heading ?? title}</h1>

    ${content}
  </body>
</html>
`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};

function capitalize(str: string): string {
  return str.replace(/^./, (first: string) => first.toUpperCase());
}
