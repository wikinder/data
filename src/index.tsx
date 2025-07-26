/**
 * Data - A web service that provides data in various categories
 */

import { Hono } from 'hono';
import { jsxRenderer } from 'hono/jsx-renderer';
import { appendTrailingSlash, trimTrailingSlash } from 'hono/trailing-slash';

// Import JSX components
import { Home } from './components/Home';
import { Data } from './components/Data';

// Import functions to handle data for each category
import { DATA_HANDLERS } from './routes';

// Canonical URL of the home page
const SITE_URL = new URL('https://data.wikinder.org/');

const app = new Hono();
app.notFound((c) => c.text('', 404));
app.get('*', jsxRenderer());

// Route the home page
app.get('/', (c) => {
  const categories = Object.fromEntries(
    Object.keys(DATA_HANDLERS).map((key) => [`${key}/`, capitalize(key)])
  );

  return c.render(<Home categories={categories} canonicalUrl={SITE_URL} />);
});

// Route the data pages (like "/date/1970-01-01" or "/date/")
app.get('/:categoryKey', appendTrailingSlash());
app.get('/:categoryKey/:input/', trimTrailingSlash());
app.on('GET', ['/:categoryKey/', '/:categoryKey/:input'], async (c) => {
  const { categoryKey, input } = c.req.param();

  if (!Object.hasOwn(DATA_HANDLERS, categoryKey)) {
    return c.notFound();
  }

  // Get the output
  const output = await DATA_HANDLERS[categoryKey](input, c.env);

  if (output == null) {
    return c.notFound();
  }

  output.categoryLabel ??= capitalize(categoryKey);

  return c.render(
    <Data
      isIndex={input == null}
      canonicalUrl={new URL(c.req.path, SITE_URL)}
      {...output}
    />
  );
});

function capitalize(str: string): string {
  return str.replace(/^./, (first) => first.toUpperCase());
}

export default app;
