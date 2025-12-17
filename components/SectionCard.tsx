import React from 'react';

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, id }) => {
  return (
    <div id={id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 scroll-mt-24 transition-all hover:shadow-md">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
        {icon && <span className="text-blue-600">{icon}</span>}
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="p-6 text-slate-600 leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  );
};

export const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-4 last:mb-0">
    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">{title}</h4>
    <div className="text-slate-600">{children}</div>
  </div>
);
