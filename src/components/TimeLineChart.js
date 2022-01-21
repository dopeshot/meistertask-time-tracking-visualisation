import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Hours" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
    )

}
