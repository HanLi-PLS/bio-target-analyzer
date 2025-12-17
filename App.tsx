import React, { useState } from 'react';
import { generateResearchReport } from './services/geminiService';
import { ReportData } from './types';
import { SectionCard, SubSection } from './components/SectionCard';
import { RiskRadar, PhaseBarChart } from './components/Charts';
import { 
  DomainVisualizer, ExpandableText, StepList, SimpleTable, ScoreGauge 
} from './components/Visualizations';
import { 
  Dna, Activity, FlaskConical, Gavel, Target, 
  TrendingUp, AlertTriangle, Microscope, Search, 
  Briefcase, ImageIcon
} from 'lucide-react';

const App: React.FC = () => {
  const [target, setTarget] = useState('RIPK2');
  const [indication, setIndication] = useState('Ulcerative Colitis');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target || !indication) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateResearchReport(target, indication);
      setData(result);
    } catch (err) {
      setError("Failed to generate report. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'bio', label: 'Biological Overview', icon: <Dna size={18} /> },
    { id: 'rationale', label: 'Therapeutic Rationale', icon: <Target size={18} /> },
    { id: 'preclinical', label: 'Pre-clinical Evidence', icon: <FlaskConical size={18} /> },
    { id: 'landscape', label: 'Drug/Trial Landscape', icon: <Activity size={18} /> },
    { id: 'ip', label: 'Patent & IP', icon: <Gavel size={18} /> },
    { id: 'differentiation', label: 'Differentiation', icon: <Microscope size={18} /> },
    { id: 'needs', label: 'Unmet Needs', icon: <TrendingUp size={18} /> },
    { id: 'risks', label: 'Risk Analysis', icon: <AlertTriangle size={18} /> },
    { id: 'bd', label: 'Business Development', icon: <Briefcase size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Microscope size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">PharmaScout</span>
          </div>
          {!data && !loading && (
             <div className="text-sm text-slate-500 hidden sm:block">AI-Powered Target Intelligence</div>
          )}
          {data && (
            <button 
              onClick={() => setData(null)}
              className="text-sm text-blue-600 font-medium hover:text-blue-800"
            >
              New Analysis
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {!data && !loading ? (
          <div className="max-w-3xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                Accelerate Your Drug Discovery Research
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Generate comprehensive deep-dive reports on any drug target and indication pair in seconds using advanced AI.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Target Molecule</label>
                    <input
                      type="text"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="e.g. RIPK2, JAK1"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Indication / Disease</label>
                    <input
                      type="text"
                      value={indication}
                      onChange={(e) => setIndication(e.target.value)}
                      placeholder="e.g. Ulcerative Colitis"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
                >
                  <Search size={20} />
                  Start Deep Analysis
                </button>
              </form>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { label: 'Competitive Landscape', desc: 'Real-time trial data & competitors' },
                { label: 'Risk Assessment', desc: 'Clinical, technical & safety scoring' },
                { label: 'Strategic Insights', desc: 'Differentiation & unmet needs' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="font-semibold text-slate-900">{item.label}</h3>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-slate-50">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Target Potential</h2>
            <p className="text-slate-500 animate-pulse">Scouring databases for {target} in {indication}...</p>
            <div className="mt-8 flex gap-2 text-sm text-slate-400">
               <span>Clinical Trials</span> • <span>Patents</span> • <span>Biological Mechanisms</span>
            </div>
          </div>
        ) : error ? (
           <div className="max-w-2xl mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
             <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-red-800 mb-2">Analysis Failed</h3>
             <p className="text-red-600 mb-6">{error}</p>
             <button 
                onClick={() => setError(null)}
                className="px-6 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
             >
               Try Again
             </button>
           </div>
        ) : (
          <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Report Sections</h3>
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors group"
                      >
                        <span className="text-slate-400 group-hover:text-blue-500 transition-colors">{item.icon}</span>
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Report Content */}
            <div className="flex-grow min-w-0">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {data!.target} <span className="text-slate-400 font-light">for</span> {data!.indication}
                </h1>
                <p className="text-slate-600">Generated Analysis Report</p>
              </div>

              {/* Biological Overview */}
              <SectionCard id="bio" title="1. Biological Overview" icon={<Dna />}>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Domain Architecture</h4>
                    <DomainVisualizer domains={data!.biologicalOverview.structuralDomains} />
                  </div>

                  <div>
                     <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Mechanism of Action</h4>
                     <div className="grid md:grid-cols-2 gap-8 items-start">
                        <StepList steps={data!.biologicalOverview.mechanisticInsights} />
                        {data!.biologicalOverview.mechanismImage ? (
                            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                <img 
                                  src={data!.biologicalOverview.mechanismImage} 
                                  alt="Mechanism of Action Diagram" 
                                  className="w-full h-auto rounded-lg object-contain bg-white" 
                                />
                                <div className="p-2 flex items-center justify-center gap-2 text-xs text-slate-400">
                                   <ImageIcon size={12} />
                                   <span>AI-generated schematic</span>
                                </div>
                            </div>
                        ) : (
                           <div className="bg-slate-50 rounded-xl border border-slate-200 border-dashed h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
                              <ImageIcon size={24} className="opacity-50" />
                              <span>Diagram not available</span>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
                     <div>
                       <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Human Validation</h4>
                       <ExpandableText content={data!.biologicalOverview.humanValidation} />
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Species Conservation</h4>
                       <ExpandableText content={data!.biologicalOverview.speciesConservation} />
                     </div>
                  </div>
                </div>
              </SectionCard>

              {/* Therapeutic Rationale */}
              <SectionCard id="rationale" title="2. Therapeutic Rationale" icon={<Target />}>
                 <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-2">Pathway Positioning</h4>
                      <p className="text-sm text-blue-800">{data!.therapeuticRationale.pathwayPositioning}</p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                      <h4 className="font-bold text-indigo-900 mb-2">Specificity vs Breadth</h4>
                      <p className="text-sm text-indigo-800">{data!.therapeuticRationale.specificityVsBreadth}</p>
                    </div>
                    <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
                      <h4 className="font-bold text-violet-900 mb-2">Degradation vs Inhibition</h4>
                      <p className="text-sm text-violet-800">{data!.therapeuticRationale.modalityComparison}</p>
                    </div>
                 </div>
              </SectionCard>

              {/* Pre-clinical */}
              <SectionCard id="preclinical" title="3. Pre-clinical Evidence" icon={<FlaskConical />}>
                 <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Human Genetic Evidence</h4>
                    <SimpleTable 
                      headers={['Variant', 'Clinical Significance']}
                      rows={data!.preClinicalEvidence.humanGenetics.map(g => [g.variant, g.significance])}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Animal Models</h4>
                    <SimpleTable 
                      headers={['Model', 'Outcome']}
                      rows={data!.preClinicalEvidence.animalModels.map(a => [a.model, a.outcome])}
                    />
                  </div>
                 </div>
              </SectionCard>

              {/* Landscape */}
              <SectionCard id="landscape" title="4. Drug/Trial Landscape" icon={<Activity />}>
                <div className="grid lg:grid-cols-3 gap-8 mb-6">
                  <div className="lg:col-span-2">
                    <SubSection title="Market Summary">
                      <ExpandableText content={data!.drugTrialLandscape.summary} />
                    </SubSection>
                    <div className="mt-6">
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Key Competitive Assets</h4>
                      <SimpleTable 
                        headers={['Company', 'Molecule', 'Phase', 'Mechanism']}
                        rows={data!.drugTrialLandscape.competitors.map(c => [
                          c.company,
                          c.moleculeName,
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            c.phase.includes('3') ? 'bg-green-100 text-green-800' :
                            c.phase.includes('2') ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>{c.phase}</span>,
                          c.mechanism
                        ])}
                      />
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center justify-center">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 text-center">Pipeline Distribution</h4>
                    <PhaseBarChart data={data!.drugTrialLandscape.phaseCount} />
                  </div>
                </div>
              </SectionCard>

              {/* IP & Patent */}
               <SectionCard id="ip" title="5. Patent & IP Landscape" icon={<Gavel />}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Recent Filings</h4>
                    <SimpleTable 
                      headers={['Assignee', 'Year', 'Focus']}
                      rows={data!.patentIP.recentFilings.map(p => [p.assignee, p.year, p.focus])}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Strategy</h4>
                    <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 border border-slate-100">
                       {data!.patentIP.strategy}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Indication Potential */}
              <SectionCard id="indication" title="6. Indication Potential" icon={<TrendingUp />}>
                 <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                    <ScoreGauge data={data!.indicationPotential} />
                    <div className="prose prose-slate prose-sm max-w-none flex-1">
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">Market & Strategic Fit</h4>
                      {data!.indicationSpecificAnalysis}
                    </div>
                 </div>
              </SectionCard>

              {/* Differentiation */}
              <SectionCard id="differentiation" title="7. Key Differentiation" icon={<Microscope />}>
                <p className="mb-6 text-slate-600">{data!.differentiation.analysis}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h4 className="text-green-800 font-bold mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-green-700">+</div> Advantages
                    </h4>
                    <ul className="space-y-2">
                      {data!.differentiation.advantages.map((adv, i) => (
                        <li key={i} className="text-sm text-green-900 flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                          {adv}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <h4 className="text-red-800 font-bold mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-red-700">-</div> Challenges
                    </h4>
                     <ul className="space-y-2">
                      {data!.differentiation.disadvantages.map((dis, i) => (
                        <li key={i} className="text-sm text-red-900 flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                          {dis}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SectionCard>

               {/* Unmet Needs */}
               <SectionCard id="needs" title="8. Unmet Medical Needs" icon={<TrendingUp />}>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                        <Activity size={16} className="text-blue-500" /> Response Rates
                      </h4>
                      <p className="text-sm text-slate-600">{data!.unmetNeeds.responseRates}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-500" /> Resistance
                      </h4>
                      <p className="text-sm text-slate-600">{data!.unmetNeeds.resistance}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                        <Gavel size={16} className="text-red-500" /> Safety
                      </h4>
                      <p className="text-sm text-slate-600">{data!.unmetNeeds.safetyLimitations}</p>
                    </div>
                  </div>
              </SectionCard>

               {/* Risks */}
               <SectionCard id="risks" title="10. Risk Assessment" icon={<AlertTriangle />}>
                 <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                       <div className="mb-6">
                         <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Assessment Summary</h4>
                         <ExpandableText content={data!.risks.riskAnalysis} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-100">
                          <div className="text-xs text-slate-500 uppercase mb-1">Technical Risk</div>
                          <div className={`text-2xl font-bold ${data!.risks.technical > 50 ? 'text-red-500' : 'text-green-500'}`}>{data!.risks.technical}</div>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-100">
                          <div className="text-xs text-slate-500 uppercase mb-1">Clinical Risk</div>
                          <div className={`text-2xl font-bold ${data!.risks.clinical > 50 ? 'text-red-500' : 'text-green-500'}`}>{data!.risks.clinical}</div>
                        </div>
                       </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-center">
                        <RiskRadar data={data!.risks} />
                    </div>
                 </div>
              </SectionCard>

              {/* Biomarkers */}
              <SectionCard id="biomarkers" title="11. Biomarker Strategy" icon={<Dna />}>
                 <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-blue-500">
                    <ExpandableText content={data!.biomarkerStrategy} limit={300} />
                 </div>
              </SectionCard>

               {/* BD */}
               <SectionCard id="bd" title="12. Business Development & Investment" icon={<Briefcase />}>
                 <div className="grid md:grid-cols-2 gap-8">
                   <div>
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Recent Activities</h4>
                      <div className="space-y-4">
                        {data!.bdPotentials.activities.map((act, i) => (
                          <div key={i} className="flex gap-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                              {act.company.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-slate-900">{act.company}</h5>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{act.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Interested Parties</h4>
                      <div className="flex flex-wrap gap-2">
                        {data!.bdPotentials.interestedParties.map((party, i) => (
                          <span key={i} className="px-3 py-1 bg-white text-slate-700 rounded-full text-sm font-medium border border-slate-200 shadow-sm hover:border-blue-300 hover:text-blue-600 transition-colors">
                            {party}
                          </span>
                        ))}
                      </div>
                   </div>
                 </div>
              </SectionCard>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
