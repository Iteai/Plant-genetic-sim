export type Species = 'Chili' | 'Tomato' | 'Basil' | 'Radish';

export type Variety = 
  | 'Cherry' | 'Roma' | 'Beefsteak' | 'Heirloom' | 'San Marzano'
  | 'Jalapeno' | 'Habanero' | 'Cayenne' | 'Poblano' | 'Ghost Pepper'
  | 'Sweet' | 'Thai' | 'Lemon' | 'Purple' | 'Holy'
  | 'Cherry Belle' | 'French Breakfast' | 'Daikon' | 'Black Spanish' | 'Watermelon';

export type GrowthStage = 
  | 'Seed' | 'Germination' | 'Seedling' | 'Vegetative' 
  | 'Flowering' | 'Fruiting' | 'HarvestReady' | 'Dead';

export type Allele = 'A' | 'a' | 'B' | 'b' | 'C' | 'c' | 'D' | 'd' | 'E' | 'e' | 'F' | 'f';
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface GenePair {
  allele1: Allele;
  allele2: Allele;
}

export interface PlantGenetics {
  color: GenePair;          // A/a: 1-5 colore (rosso -> giallo -> viola -> arancio -> marrone)
  size: GenePair;           // B/b: 1-5 dimensione frutti/foglie (piccolissimo -> gigante)
  growthRate: GenePair;     // C/c: velocità crescita
  yield: GenePair;          // D/d: quantità frutti
  shape: GenePair;          // E/e: 1-5 forma (rotondo -> allungato)
  texture: GenePair;        // F/f: 1-5 texture (liscio -> ruvido/corrugato)
  generation: number;
  mutationCount: number;
}

export interface PhenotypeTraits {
  // Punteggi da 1 a 5
  colorScore: number;       // Determina colore base
  sizeScore: number;        // Dimensione frutti/foglie
  shapeScore: number;       // Forma frutti (1=rotondo, 5=allungato)
  textureScore: number;     // Texture (1=liscio, 5=corrugato)
  growthSpeed: number;      // Velocità (1=lenta, 5=velocissima)
  yieldAmount: number;      // Quantità (1=pochi, 5=tantissimi)
}

export interface Plant {
  id: string;
  species: Species;
  variety: Variety;
  name: string;
  genetics: PlantGenetics;
  phenotype: PhenotypeTraits;  // Calcolato dalla genetica
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
  phenotype: PhenotypeTraits;  // Calcolato dalla genetica
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

export type ConsumableType = 'Growth' | 'Mutation';

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
