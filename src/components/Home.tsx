/**
 * JSX component for the home page
 */

import { Base } from './Base';

export const Home = ({ categories, ...props }) => (
  <Base title="Data" {...props}>
    <ul>
      {Object.entries(categories).map(([url, name]) => (
        <li>
          <a href={url}>{name}</a>
        </li>
      ))}
    </ul>
  </Base>
);
