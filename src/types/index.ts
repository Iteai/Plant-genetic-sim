export type Species = 'Chili' | 'Tomato' | 'Basil' | 'Radish';

export type Variety = 
  | 'Cherry' | 'Roma' | 'Beefsteak' | 'Heirloom' | 'San Marzano'
  | 'Jalapeno' | 'Habanero' | 'Cayenne' | 'Poblano' | 'Ghost Pepper'
  | 'Sweet' | 'Thai' | 'Lemon' | 'Purple' | 'Holy'
  | 'Cherry Belle' | 'French Breakfast' | 'Daikon' | 'Black Spanish' | 'Watermelon';

export type GrowthStage = 
  | 'Seed' | 'Germination' | 'Seedling' | 'Vegetative' 
  | 'Flowering' | 'Fruiting' | 'HarvestReady' | 'Dead';

export type Allele = 'A' | 'a' | 'B' | 'b' | 'C' | 'c' | 'D' | 'd';
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface GenePair {
  allele1: Allele;
  allele2: Allele;
}

export interface PlantGenetics {
  color: GenePair;       
  size: GenePair;        
  growthRate: GenePair;  
  yield: GenePair;       
  generation: number;
  mutationCount: number;
}

export interface Plant {
  id: string;
  species: Species;
  variety: Variety;
  name: string;
  genetics: PlantGenetics;
  stage: GrowthStage;
  plantedAt: number; 
  lastWateredAt: number; 
  waterLevel: number; 
  health: number; 
  growthProgress: number; 
  yieldAmount: number;
  isHybrid: boolean;
}

export interface Seed {
  id: string;
  species: Species;
  variety: Variety;
  genetics: PlantGenetics;
  name: string;
  quantity: number;
  rarity: Rarity;
}

export interface HarvestedItem {
  id: string;
  species: Species;
  variety: Variety;
  quality: number; 
  quantity: number;
  value: number;
  rarity: Rarity;
}

export interface Pot {
  id: string;
  plant: Plant | null;
  size: 'Small' | 'Medium' | 'Large';
  soilQuality: number; 
}

export interface GameState {
  pots: Pot[];
  seeds: Seed[];
  inventory: HarvestedItem[];
  money: number;
  xp: number;
  level: number;
  lastSavedAt: number;
  encyclopedia: string[]; 
}
