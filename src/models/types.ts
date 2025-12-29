// Time of Day enum for filtering
export enum TimeOfDay {
  Morning = "morning",
  Afternoon = "afternoon",
  Evening = "evening"
}

// Slang Entry Model
export interface SlangEntry {
  term: string;
  meaning: string;
  usage: string;
  category: "kannada" | "tech" | "general";
  examples?: string[];
}

// Food Entry Model
export interface FoodEntry {
  name: string;
  description: string;
  spots: string[];
  priceRange: string;
  bestTimes: TimeOfDay[];
  category: string;
  tags?: string[];
}

// Traffic Route Model
export interface TrafficRoute {
  name: string;
  from: string;
  to: string;
  baseTime: number; // in minutes
  peakTimeMultiplier: number;
  description?: string;
}

// Culture Entry Model
export interface CultureEntry {
  title: string;
  category: "neighborhood" | "startup" | "festival" | "coffee" | "living";
  description: string;
  details: string[];
  tags?: string[];
}

// Parsed Data from Knowledge Base
export interface ParsedData {
  slang: SlangEntry[];
  food: FoodEntry[];
  traffic: TrafficRoute[];
  culture: CultureEntry[];
}

// Validation Result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Search Result with score and matches
export interface SearchResult<T> {
  item: T;
  score: number;
  matches?: FieldMatch[];
}

// Field Match for highlighting
export interface FieldMatch {
  field: string;
  matchedText: string;
}

// Filter Criteria
export interface FilterCriteria {
  timeOfDay?: TimeOfDay;
  category?: string;
  tags?: string[];
}

// Module Types
export type ModuleType = "slang" | "food" | "traffic" | "culture";

// App State
export interface AppState {
  data: ParsedData | null;
  loading: boolean;
  error: string | null;
  activeModule: ModuleType;
}
