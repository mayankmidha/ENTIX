'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { formatInr } from '@/lib/utils';

export function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="h-[400px] w-full mt-10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#666', fontFamily: 'monospace' }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#666', fontFamily: 'monospace' }} 
            tickFormatter={(val) => `₹${val/1000}k`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontFamily: 'monospace', fontSize: '12px' }}
            formatter={(val: number) => [formatInr(val), 'Revenue']}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#000000" 
            strokeWidth={2} 
            dot={{ r: 4, fill: '#000000', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#A69664' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const COLORS = ['#000000', '#A69664', '#766B48', '#111111'];

export function CategoryPie({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontFamily: 'monospace', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
