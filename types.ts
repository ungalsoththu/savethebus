
export type Language = 'en' | 'ta';

export enum ObjectionTone {
  FIRM = 'Firm & Formal',
  POLITE = 'Polite & Concerned',
  EXPERT = 'Policy-Focused',
  CITIZEN = 'Daily Commuter Perspective'
}

export enum GenerationMode {
  AUTO = 'Auto-Draft',
  MANUAL = 'Write My Own'
}

export interface ObjectionData {
  name: string;
  location: string;
  tone: ObjectionTone;
  concerns: string[];
  language: Language;
  mode: GenerationMode;
  customText?: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  isOptimized?: boolean;
}
