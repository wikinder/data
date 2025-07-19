/**
 * JSX component for the data pages
 */

import { css } from 'hono/css';

import { Base } from './Base';

export const Data = ({
  isIndex,
  categoryLabel,
  indexPageTitle = `${categoryLabel} Data`,
  pageName,
  siteName = (
    new RegExp(categoryLabel, 'i').test(pageName) ? 'Data' : indexPageTitle
  ),
  style = '',
  heading = pageName,
  data,
  ...props
}) => (
  <Base
    title={isIndex ? indexPageTitle : `${pageName} | ${siteName}`}
    style={css`
      #data td,
      #data th {
        text-align: left;
      }

      ${style}
    `}
    heading={heading}
    {...props}
  >
    <table id="data">
      {data && Object.entries(data).map(([key, value]) => (
        <tbody>
          <tr>
            <th scope="rowgroup">{key}</th>
          </tr>
          <tr>
            <td>{value}</td>
          </tr>
        </tbody>
      ))}
    </table>
  </Base>
);
