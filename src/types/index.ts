export type Species = 'Chili' | 'Tomato' | 'Basil' | 'Radish';

export type GrowthStage = 
  | 'Seed' 
  | 'Germination' 
  | 'Seedling' 
  | 'Vegetative' 
  | 'Flowering' 
  | 'Fruiting' 
  | 'HarvestReady' 
  | 'Dead';

// Mendelian Genetics System
export type Allele = 'A' | 'a' | 'B' | 'b' | 'C' | 'c' | 'D' | 'd';

export interface GenePair {
  allele1: Allele;
  allele2: Allele;
}

export interface PlantGenetics {
  color: GenePair;       // e.g., AA = Red, aa = Yellow
  size: GenePair;        // e.g., BB = Large, bb = Small
  growthRate: GenePair;  // e.g., CC = Fast, cc = Slow
  yield: GenePair;       // e.g., DD = High, dd = Low
  generation: number;
  mutationCount: number;
}

export interface Plant {
  id: string;
  species: Species;
  name: string;
  genetics: PlantGenetics;
  stage: GrowthStage;
  plantedAt: number; // Timestamp
  lastWateredAt: number; // Timestamp
  waterLevel: number; // 0 to 100
  health: number; // 0 to 100
  growthProgress: number; // 0 to 100 per stage
  yieldAmount: number;
  isHybrid: boolean;
}

export interface Seed {
  id: string;
  species: Species;
  genetics: PlantGenetics;
  name: string;
  quantity: number;
}

export interface HarvestedItem {
  id: string;
  species: Species;
  quality: number; // 1-100 based on health and genetics
  quantity: number;
  value: number;
}

export interface Pot {
  id: string;
  plant: Plant | null;
  size: 'Small' | 'Medium' | 'Large';
  soilQuality: number; // 0 to 100
}

export interface GameState {
  pots: Pot[];
  seeds: Seed[];
  inventory: HarvestedItem[];
  money: number;
  xp: number;
  level: number;
  lastSavedAt: number;
  encyclopedia: string[]; // Array of discovered hybrid IDs
}
