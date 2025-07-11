/**
 * Base JSX component for all pages
 */

import { css, Style } from 'hono/css';

export const Base = ({
  title,
  canonicalUrl,
  style,
  heading = title,
  children,
}) => (
  <html lang="en-US">
    <head>
      <meta charset="utf-8" />
      <meta name="color-scheme" content="light dark" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <link rel="canonical" href={canonicalUrl} />
      <link rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/" />
      {style && <Style>{css`${style}`}</Style>}
    </head>
    <body>
      <h1 dangerouslySetInnerHTML={{ __html: heading }} />

      {children}
    </body>
  </html>
);
