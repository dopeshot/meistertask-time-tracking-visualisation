import React from 'react';
import { randomColor } from '../logic/helper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
function getMaxValue(data) {
  const lastEntry = Object.values(data.at(-1)).slice(1)
  const entryIntegers = lastEntry.map(e => Math.round(parseFloat(e)))
  console.log(entryIntegers);
  const max = Math.max(...entryIntegers)
  console.log(parseInt(max));
  return max + 1
}
export const TimeLineChart = ({ data }) => {

  return (
    <LineChart
      width={1280}
      height={400}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="Date" />
      <YAxis type="number" domain={[0, getMaxValue(data)]} />
      <Tooltip />
      <Legend />
      {Object.keys(data[0]).slice(1).map((entry) =>
        <Line strokeWidth={4} dot={-0} type="monotone" dataKey={entry} stroke={`#${randomColor()}`} activeDot={{ r: 7 }} tickCount={1} />
      )}
    </LineChart>
  )

}
