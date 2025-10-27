import React from 'react';
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

function LineChart({ data, xKey, series, title, height = 300 }) {
  return (
    <Card>
      {title && <Typography variant="h6" sx={{ p: 2 }}>{title}</Typography>}
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={String(xKey)} />
              <YAxis />
              <Tooltip />
              <Legend />
              {series.map((s) => (
                <Line 
                  key={s.dataKey} 
                  type="monotone" 
                  dataKey={s.dataKey} 
                  name={s.name} 
                  stroke={s.color || '#8884d8'} 
                  strokeWidth={2} 
                  dot={{ r: 2 }} 
                />
              ))}
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default LineChart;
