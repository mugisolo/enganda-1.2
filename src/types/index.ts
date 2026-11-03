export type Language = 'en' | 'lg';

export interface YouthGroup {
  id: string;
  name: string;
  division: string;
  location: string;
  memberCount: number;
  womenPercentage: number;
  trade: string;
  stage: 'Formalized & Banked' | 'In Incubation' | 'Skilling Phase';
  bankAccount: string;
  treesPlanted: number;
  leaderName: string;
  leaderPhone: string;
}

export interface PaymentTransaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  provider: 'MTN' | 'AIRTEL';
  phoneNumber: string;
  donorName: string;
  purpose: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  createdAt: string;
  treesSponsored?: number;
  relworxBatchId: string;
}

export interface Founder {
  name: string;
  role: string;
  title: string;
  bioEn: string;
  bioLg: string;
  focus: string[];
  image: string;
  quote: string;
}

export interface InstitutionalPartner {
  name: string;
  role: string;
  descriptionEn: string;
  descriptionLg: string;
  badge: string;
  deliverables: string[];
}
