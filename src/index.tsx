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
import { ROUTES } from './routes';

// Canonical URL of the home page
const SITE_URL = new URL('https://data.wikinder.org/');

const app = new Hono();
app.get('*', jsxRenderer());

// Route the home page
app.get('/', (c) => {
  const categories = Object.fromEntries(
    Object.keys(ROUTES)
      .map((category) => [`${category}/`, capitalize(category)])
  );

  return c.render(<Home categories={categories} canonicalUrl={SITE_URL} />);
});

// Route the data pages (like "/date/1970-01-01" or "/date/")
app.get('/:category', appendTrailingSlash());
app.get('/:category/:input/', trimTrailingSlash());
app.on('GET', ['/:category/', '/:category/:input'], (c) => {
  const { category, input } = c.req.param();

  if (!Object.hasOwn(ROUTES, category)) {
    return c.notFound();
  }

  // Get the output
  const output = ROUTES[category](input);

  if (!output) {
    return c.notFound();
  }

  return c.render(
    <Data
      category={output.category ?? capitalize(category)}
      isIndex={input == null}
      canonicalUrl={new URL(c.req.path, SITE_URL)}
      {...output}
    />
  );
});

function capitalize(str: string) {
  return str.replace(/^./, (first) => first.toUpperCase());
}

export default app;
