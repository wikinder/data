/**
 * data.wikinder.org - A web service that provides information about various
 * categories of data
 */

// Import the functions that handle data for each category
import handleDate from './categories/date';

const DATA_HANDLERS: any = {
  date: handleDate,
};

const NOT_FOUND: Response = new Response(null, { status: 404 });

export default {
  async fetch(request: Request): Promise<Response> {
    // Parse URL path in the format "/[category]/[input]", where:
    // - [category]: the category that the data falls into (e.g., "date")
    // - [input]: the data value (e.g., "1970-01-01")
    const url: URL = new URL(request.url);
    const path: string = url.pathname;
    const match: RegExpMatchArray | null = path.match(/^\/([a-z]+)\/(.+)$/);

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

    // Convert the output to HTML
    let rowsHtml: string = '';

    for (const [key, value] of Object.entries(output.data)) {
      rowsHtml += `
      <tr>
        <th scope="row">${key}</th>
        <td>${value}</td>
      </tr>`;
    }

    // Capitalize the category name for display purposes
    const capitalizedCategory: string = (
      category.replace(/^./, (first: string) => first.toUpperCase())
    );

    const html: string = `<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="color-scheme" content="light dark">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${output.title} | ${capitalizedCategory} Data</title>
    <link rel="canonical" href="https://data.wikinder.org${path}">
    <link rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/">
    <style>
      #data th {
        text-align: left;
      }
    </style>
  </head>
  <body>
    <h1>${output.heading}</h1>

    <table id="data">${rowsHtml}
    </table>
  </body>
</html>
`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
