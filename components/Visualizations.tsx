import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, CheckCircle } from 'lucide-react';
import { Domain, IndicationPotential } from '../types';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

// --- Interactive Domain Visualizer ---
interface DomainVisualizerProps {
  domains: Domain[];
}

export const DomainVisualizer: React.FC<DomainVisualizerProps> = ({ domains }) => {
  const [activeDomain, setActiveDomain] = useState<number | null>(null);

  // Scientific palette
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500'
  ];

  return (
    <div className="space-y-4">
      {/* Container - Increased top padding to accommodate tooltips */}
      <div className="relative pt-24 pb-16 px-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto select-none min-h-[220px] flex items-center">
        
        {/* N-term / C-term Labels */}
        <div className="absolute top-[calc(50%-4px)] left-3 text-xs font-bold text-slate-400 font-mono -translate-y-1/2">NH₂</div>
        <div className="absolute top-[calc(50%-4px)] right-3 text-xs font-bold text-slate-400 font-mono -translate-y-1/2">COOH</div>

        {/* The Protein Backbone (Line) */}
        <div className="absolute top-[calc(50%-10px)] left-10 right-10 h-1.5 bg-slate-200 rounded-full" />

        {/* The Domains Wrapper */}
        <div className="relative flex justify-between items-center gap-8 z-10 mx-10 min-w-[600px] w-full">
          {domains.map((domain, index) => {
            const colorClass = colors[index % colors.length];
            const isActive = activeDomain === index;
            
            return (
              <div
                key={index}
                className="flex flex-col items-center group relative flex-1"
                onMouseEnter={() => setActiveDomain(index)}
                onMouseLeave={() => setActiveDomain(null)}
              >
                 {/* Tooltip - Show when active */}
                 <div 
                    className={`
                      absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 
                      w-56 p-4 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 
                      transition-all duration-200 pointer-events-none
                      ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                    `}
                  >
                    <div className="font-bold mb-2 text-blue-200 text-sm border-b border-slate-700 pb-1">{domain.name}</div>
                    <div className="text-slate-300 leading-relaxed">{domain.description}</div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent border-t-slate-800"></div>
                 </div>

                {/* The Domain Block (The Structure) */}
                <div 
                  className={`
                    h-14 w-full min-w-[90px] rounded-lg relative
                    ${colorClass} bg-gradient-to-br from-white/20 to-black/5
                    shadow-sm border border-white/40
                    cursor-pointer transition-all duration-300
                    ${isActive ? 'scale-110 shadow-lg ring-4 ring-blue-500/20 z-20' : 'hover:scale-105'}
                  `}
                >
                    {/* Glossy highlight */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-lg"></div>
                    
                    {/* Domain Label inside the block if it fits, or centered */}
                    <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md truncate px-1">
                             {domain.name.length > 12 ? domain.name.substring(0, 10) + '..' : domain.name}
                         </span>
                    </div>
                </div>

                {/* Connector Tick */}
                <div className={`mt-2 h-4 w-px bg-slate-300 transition-all ${isActive ? 'h-6 bg-blue-400' : ''}`}></div>

                {/* Full Name Label (Below) */}
                <div className={`
                   text-center transition-all duration-300 px-2 absolute top-full mt-6 w-40
                   ${isActive ? 'opacity-100 transform translate-y-0' : 'opacity-60'}
                `}>
                    <div className={`text-xs font-semibold text-slate-600 leading-tight ${isActive ? 'text-blue-700' : ''}`}>
                        {domain.name}
                    </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Expandable Text Block ---
interface ExpandableTextProps {
  content: string;
  limit?: number;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({ content, limit = 150 }) => {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = content.length > limit;

  return (
    <div>
      <p className={`text-slate-600 leading-relaxed ${!expanded && shouldTruncate ? 'line-clamp-3' : ''}`}>
        {content}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1"
        >
          {expanded ? (
            <>Show Less <ChevronUp size={14} /></>
          ) : (
            <>Read More <ChevronDown size={14} /></>
          )}
        </button>
      )}
    </div>
  );
};

// --- Step List for Mechanisms ---
interface StepListProps {
  steps: string[];
}

export const StepList: React.FC<StepListProps> = ({ steps }) => (
  <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 py-2">
    {steps.map((step, idx) => (
      <div key={idx} className="relative pl-6 group">
        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500 group-hover:bg-blue-50 transition-colors"></div>
        <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
      </div>
    ))}
  </div>
);

// --- Simple Table for Evidence/Patents ---
interface SimpleTableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}

export const SimpleTable: React.FC<SimpleTableProps> = ({ headers, rows }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
    <table className="w-full text-sm text-left">
      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
        <tr>
          {headers.map((h, i) => <th key={i} className="px-4 py-3 whitespace-nowrap">{h}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {rows.map((row, i) => (
          <tr key={i} className="hover:bg-slate-50 transition-colors">
            {row.map((cell, j) => <td key={j} className="px-4 py-3 text-slate-600">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- Strategic Fit Card (Redesigned ScoreGauge) ---
export const ScoreGauge: React.FC<{ data: IndicationPotential }> = ({ data }) => {
  const score = data.score; // 0-10
  
  // Determine color and label
  const getColor = (s: number) => {
      if (s >= 8) return { bg: 'bg-green-500', text: 'text-green-600', label: 'High Potential' };
      if (s >= 5) return { bg: 'bg-blue-500', text: 'text-blue-600', label: 'Moderate Potential' };
      return { bg: 'bg-amber-500', text: 'text-amber-600', label: 'Low Potential' };
  };

  const { bg, text, label } = getColor(score);

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Score Section */}
        <div className="p-6 md:w-64 flex flex-col items-center justify-center bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
             <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Fit Score</div>
             <div className="relative flex items-center justify-center mb-2">
                 <span className={`text-6xl font-black ${text}`}>{score}</span>
                 <span className="text-2xl font-bold text-slate-300 ml-1">/10</span>
             </div>
             <div className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide ${bg}`}>
                 {label}
             </div>
        </div>

        {/* Meter and Logic Section */}
        <div className="p-6 flex-1">
             {/* Progress Bar */}
             <div className="mb-6">
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Low Fit</span>
                    <span>High Fit</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                        className={`h-full ${bg} transition-all duration-1000 ease-out`} 
                        style={{ width: `${score * 10}%` }}
                    />
                </div>
             </div>
             
             {/* Reasoning */}
             <div>
                 <h5 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                     <CheckCircle size={16} className={text} />
                     Strategic Rationale
                 </h5>
                 <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                     {data.reasoning}
                 </p>
             </div>
        </div>
    </div>
  );
};
