import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip
  } from "recharts";
  
  export function RevenueChart({ data }: any) {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area dataKey="value" stroke="#3b82f6" fill="#3b82f6" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }