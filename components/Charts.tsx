import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import { Risks, DrugTrialLandscape } from '../types';

interface RiskRadarProps {
  data: Risks;
}

export const RiskRadar: React.FC<RiskRadarProps> = ({ data }) => {
  const chartData = [
    { subject: 'Clinical', A: data.clinical, fullMark: 100 },
    { subject: 'Safety', A: data.safety, fullMark: 100 },
    { subject: 'Competitive', A: data.competitive, fullMark: 100 },
    { subject: 'Technical', A: data.technical, fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Risk Profile"
            dataKey="A"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#ef4444' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PhaseBarChartProps {
  data: DrugTrialLandscape['phaseCount'];
}

export const PhaseBarChart: React.FC<PhaseBarChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Preclinical', count: data.preclinical },
    { name: 'Phase I', count: data.phase1 },
    { name: 'Phase II', count: data.phase2 },
    { name: 'Phase III', count: data.phase3 },
    { name: 'Approved', count: data.approved },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={['#94a3b8', '#60a5fa', '#3b82f6', '#2563eb', '#16a34a'][index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
