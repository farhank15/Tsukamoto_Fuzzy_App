import React, { useMemo } from "react";

interface FuzzyMembership {
  high: number;
  medium: number;
  low: number;
}

interface PerformanceData {
  category: string;
  fuzzy_membership: Record<string, FuzzyMembership>;
  inference_output: Record<string, number>;
  inputs: Record<string, number>;
  user_id: number;
}

interface Props {
  data: PerformanceData;
}

const PerformanceResult: React.FC<Props> = ({ data }) => {
  // Memoize keys for rendering
  const variableKeys = useMemo(
    () => Object.keys(data.fuzzy_membership),
    [data]
  );
  const inferenceKeys = useMemo(
    () => Object.keys(data.inference_output),
    [data]
  );

  return (
    <div>
      <h2>Category: {data.category}</h2>
      <h3>Inputs</h3>
      <ul>
        {Object.entries(data.inputs).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
      <h3>Fuzzy Membership</h3>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Low</th>
            <th>Medium</th>
            <th>High</th>
          </tr>
        </thead>
        <tbody>
          {variableKeys.map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{data.fuzzy_membership[key].low}</td>
              <td>{data.fuzzy_membership[key].medium}</td>
              <td>{data.fuzzy_membership[key].high}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Inference Output</h3>
      <ul>
        {inferenceKeys.map((key) => (
          <li key={key}>
            {key}: {data.inference_output[key]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PerformanceResult;
