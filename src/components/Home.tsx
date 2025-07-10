import { Base } from './Base';

export const Home = ({ categories, ...properties }) => (
  <Base title="Data" {...properties}>
    <ul>
      {Object.entries(categories).map(([url, name]) => (
        <li>
          <a href={url}>{name}</a>
        </li>
      ))}
    </ul>
  </Base>
);
