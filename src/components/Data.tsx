import { Base } from './Base';

export const Data = ({
  title,
  category,
  style = '',
  heading = title,
  data,
  ...properties
}) => (
  <Base
    title={`${title} | ${category} Data`}
    style={`
#data td,
#data th {
  text-align: left;
}
${style}`}
    heading={heading}
    {...properties}
  >
    <table id="data">
      {Object.entries(data).map(([key, value]) => (
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
