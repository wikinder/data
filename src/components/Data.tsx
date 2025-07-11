/**
 * JSX component for the data pages
 */

import { css } from 'hono/css';

import { Base } from './Base';

export const Data = ({
  title,
  category,
  style = '',
  heading = title,
  data,
  isIndex,
  ...props
}) => (
  <Base
    title={`${isIndex ? '' : `${title} | `}${category} Data`}
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
