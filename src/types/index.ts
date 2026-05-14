export type Species = 'Chili' | 'Tomato' | 'Basil' | 'Radish';

export type Variety =
  | 'Cherry'
  | 'Roma'
  | 'Beefsteak'
  | 'Heirloom'
  | 'San Marzano'
  | 'Jalapeno'
  | 'Habanero'
  | 'Cayenne'
  | 'Poblano'
  | 'Ghost Pepper'
  | 'Sweet'
  | 'Thai'
  | 'Lemon'
  | 'Purple'
  | 'Holy'
  | 'Cherry Belle'
  | 'French Breakfast'
  | 'Daikon'
  | 'Black Spanish'
  | 'Watermelon';

export type GrowthStage =
  | 'Seed'
  | 'Germination'
  | 'Seedling'
  | 'Vegetative'
  | 'Flowering'
  | 'Fruiting'
  | 'HarvestReady'
  | 'Dead';

export type Allele = 'A' | 'a' | 'B' | 'b' | 'C' | 'c' | 'D' | 'd' | 'E' | 'e' | 'F' | 'f';
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type ConsumableType = 'Growth' | 'Mutation';

export interface GenePair {
  allele1: Allele;
  allele2: Allele;
}

export interface PlantGenetics {
  color: GenePair;
  size: GenePair;
  growthRate: GenePair;
  yield: GenePair;
  shape: GenePair;
  texture: GenePair;
  generation: number;
  mutationCount: number;
}

export interface PhenotypeTraits {
  colorScore: number;
  sizeScore: number;
  shapeScore: number;
  textureScore: number;
  growthSpeed: number;
  yieldAmount: number;
}

export interface Plant {
  id: string;
  species: Species;
  variety: Variety;
  name: string;
  genetics: PlantGenetics;
  phenotype: PhenotypeTraits;
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
  phenotype: PhenotypeTraits;
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

export interface Consumable {
  id: string;
  name: string;
  type: ConsumableType;
  description: string;
  price: number;
  quantity: number;
}

export interface Pot {
  id: string;
  plant: Plant | null;
  size: 'Small' | 'Medium' | 'Large';
  soilQuality: number;
  activeFertilizer?: ConsumableType;
}

export interface DiscoveredStrain {
  id: string;
  species: Species;
  variety: Variety;
  name: string;
  discoveredAt: number;
  rarity: Rarity;
  generation: number;
}

export interface GameState {
  pots: Pot[];
  seeds: Seed[];
  inventory: HarvestedItem[];
  consumables: Consumable[];
  encyclopedia: Record<string, DiscoveredStrain>;
  money: number;
  xp: number;
  level: number;
  lastSavedAt: number;
}
