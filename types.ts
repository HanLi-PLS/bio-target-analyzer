export interface Domain {
  name: string;
  description: string;
}

export interface BiologicalOverview {
  structuralDomains: Domain[];
  mechanisticInsights: string[]; // Key steps/bullet points
  humanValidation: string;
  speciesConservation: string;
  mechanismImage?: string; // Base64 encoded image
}

export interface TherapeuticRationale {
  pathwayPositioning: string;
  specificityVsBreadth: string;
  modalityComparison: string; // Degradation vs inhibition
}

export interface GeneticEvidence {
  variant: string;
  significance: string;
}

export interface AnimalModel {
  model: string;
  outcome: string;
}

export interface PreClinicalEvidence {
  humanGenetics: GeneticEvidence[];
  animalModels: AnimalModel[];
}

export interface Competitor {
  company: string;
  moleculeName: string;
  phase: string;
  mechanism: string;
}

export interface DrugTrialLandscape {
  summary: string;
  competitors: Competitor[];
  phaseCount: {
    preclinical: number;
    phase1: number;
    phase2: number;
    phase3: number;
    approved: number;
  };
}

export interface PatentFiling {
  assignee: string;
  year: string;
  focus: string;
}

export interface PatentIP {
  recentFilings: PatentFiling[];
  strategy: string;
}

export interface Differentiation {
  analysis: string;
  advantages: string[];
  disadvantages: string[];
}

export interface UnmetNeeds {
  responseRates: string;
  resistance: string;
  safetyLimitations: string;
}

export interface Risks {
  clinical: number; // 0-100
  safety: number; // 0-100
  competitive: number; // 0-100
  technical: number; // 0-100
  riskAnalysis: string;
}

export interface BDActivity {
  company: string;
  description: string;
}

export interface IndicationPotential {
  score: number; // 0-10
  reasoning: string;
}

export interface ReportData {
  target: string;
  indication: string;
  biologicalOverview: BiologicalOverview;
  therapeuticRationale: TherapeuticRationale;
  preClinicalEvidence: PreClinicalEvidence;
  drugTrialLandscape: DrugTrialLandscape;
  patentIP: PatentIP;
  indicationPotential: IndicationPotential;
  differentiation: Differentiation;
  unmetNeeds: UnmetNeeds;
  indicationSpecificAnalysis: string;
  risks: Risks;
  biomarkerStrategy: string;
  bdPotentials: {
    activities: BDActivity[];
    interestedParties: string[];
  };
}
