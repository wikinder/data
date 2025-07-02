import handleDate from './categories/date.ts';

const HANDLERS: any = {
  date: handleDate,
};

const NOT_FOUND: Response = new Response(null, { status: 404 });

export default {
  async fetch(request: Request): Promise<Response> {
    // Parse the URL
    const url: URL = new URL(request.url);

    const match: RegExpMatchArray | null = (
      url.pathname.match(/^\/([a-z]+)\/(.+)$/)
    );

    if (!match) {
      return NOT_FOUND;
    }

    const [, category, input]: string[] = match;

    if (!(category in HANDLERS)) {
      return NOT_FOUND;
    }

    // Get the output
    const output: any = HANDLERS[category](input);

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

    const capitalizedCategory: string = (
      category[0].toUpperCase() + category.slice(1)
    );

    const html: string = `<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="color-scheme" content="light dark">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${output.title} | ${capitalizedCategory} Data</title>
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
