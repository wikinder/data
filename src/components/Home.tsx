/**
 * JSX component for the home page
 */

import { Base } from './Base';

export const Home = ({ categories, ...props }) => (
  <Base title="Data" {...props}>
    <ul>
      {Object.entries(categories).map(([url, label]) => (
        <li>
          <a href={url}>{label}</a>
        </li>
      ))}
    </ul>
  </Base>
);
