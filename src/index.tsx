/**
 * Data - A web service that provides various categories of data
 */

import { Hono } from 'hono';
import { jsxRenderer } from 'hono/jsx-renderer';

// Import JSX components
import { Home } from './components/Home';
import { Data } from './components/Data';

// Import functions that handle each category of data
import { ROUTES } from './routes';

const SITE_URL = new URL('https://data.wikinder.org/');

const app = new Hono();

app.get('*', jsxRenderer());

// Home page
app.get('/', (context) => {
  const slugs = Object.keys(ROUTES);
  const categories = Object.fromEntries(
    slugs.map((slug) => [`${slug}/`, capitalize(slug)])
  );

  return context.render(
    <Home categories={categories} canonicalUrl={SITE_URL} />
  );
});

// Data page
app.get('/:category{[a-z]+}/:input', handler);
app.get('/:category{[a-z]+}/*', handler);

function handler(context) {
  const { category, input } = context.req.param();

  // Get the output
  const output = ROUTES?.[category](input);

  if (!output) {
    return context.notFound();
  }

  let path = context.req.path;

  if (input == null && !path.endsWith('/')) {
    path += '/';
  }

  return context.render(
    <Data
      category={output.category ?? capitalize(category)}
      canonicalUrl={new URL(path, SITE_URL)}
      {...output}
    />
  );
}

function capitalize(str: string) {
  return str.replace(/^./, (first) => first.toUpperCase());
}

export default app;
