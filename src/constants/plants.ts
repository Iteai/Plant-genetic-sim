import { Species, Variety, PlantGenetics, Rarity } from '../types';

export interface ShopItem {
  id: string;
  species: Species;
  variety: Variety;
  name: string;
  price: number;
  baseGenetics: PlantGenetics;
  description: string;
  rarity: Rarity;
}

const createBaseGenetics = (
  color: 'A'|'a', 
  size: 'B'|'b', 
  speed: 'C'|'c', 
  yieldG: 'D'|'d',
  shape: 'E'|'e',
  texture: 'F'|'f'
): PlantGenetics => ({
  color: { allele1: color, allele2: color },
  size: { allele1: size, allele2: size },
  growthRate: { allele1: speed, allele2: speed },
  yield: { allele1: yieldG, allele2: yieldG },
  shape: { allele1: shape, allele2: shape },
  texture: { allele1: texture, allele2: texture },
  generation: 1,
  mutationCount: 0,
});

export const SHOP_ITEMS: ShopItem[] = [
  // TOMATOES
  { 
    id: 'shop_tom_cherry', 
    species: 'Tomato', 
    variety: 'Cherry', 
    name: 'Cherry Tomato', 
    price: 10, 
    rarity: 'Common', 
    description: 'Fast growing, small clusters of sweet fruits.', 
    baseGenetics: createBaseGenetics('A', 'b', 'C', 'b', 'E', 'F') // Rosso, piccolo, veloce, pochi, rotondo, liscio
  },
  { 
    id: 'shop_tom_roma', 
    species: 'Tomato', 
    variety: 'Roma', 
    name: 'Roma Tomato', 
    price: 15, 
    rarity: 'Common', 
    description: 'Classic oval paste tomato. Great yield.', 
    baseGenetics: createBaseGenetics('A', 'B', 'C', 'D', 'e', 'f') // Rosso, medio, veloce, molti, ovale, leggermente ruvido
  },
  { 
    id: 'shop_tom_sanmarzano', 
    species: 'Tomato', 
    variety: 'San Marzano', 
    name: 'San Marzano', 
    price: 30, 
    rarity: 'Rare', 
    description: 'Elongated, highly prized for sauces.', 
    baseGenetics: createBaseGenetics('A', 'B', 'b', 'D', 'ee', 'f') // Rosso, medio, lento, molti, molto allungato, ruvido
  },
  { 
    id: 'shop_tom_beef', 
    species: 'Tomato', 
    variety: 'Beefsteak', 
    name: 'Beefsteak Tomato', 
    price: 45, 
    rarity: 'Epic', 
    description: 'Huge, ribbed fruits. Slow but valuable.', 
    baseGenetics: createBaseGenetics('A', 'BB', 'b', 'd', 'E', 'ff') // Rosso, gigante, lentissimo, pochissimi, rotondo, molto ruvido/corrugato
  },
  { 
    id: 'shop_tom_heirloom', 
    species: 'Tomato', 
    variety: 'Heirloom', 
    name: 'Heirloom Tomato', 
    price: 80, 
    rarity: 'Legendary', 
    description: 'Rare, high value, unique dark colors.', 
    baseGenetics: createBaseGenetics('aa', 'B', 'b', 'D', 'E', 'ff') // Scuro/Marrone, medio, lento, molti, rotondo, molto ruvido
  },

  // CHILIES
  { 
    id: 'shop_chi_jalapeno', 
    species: 'Chili', 
    variety: 'Jalapeno', 
    name: 'Jalapeno', 
    price: 12, 
    rarity: 'Common', 
    description: 'Standard spicy green pepper. Reliable.', 
    baseGenetics: createBaseGenetics('a', 'B', 'C', 'C', 'Ee', 'F') // Giallo/Verde, medio, veloce, medio-alto, moderatamente allungato, liscio
  },
  { 
    id: 'shop_chi_cayenne', 
    species: 'Chili', 
    variety: 'Cayenne', 
    name: 'Cayenne', 
    price: 18, 
    rarity: 'Common', 
    description: 'Long, thin, and fiery red.', 
    baseGenetics: createBaseGenetics('A', 'b', 'C', 'D', 'ee', 'F') // Rosso, piccolo, veloce, molti, molto allungato, liscio
  },
  { 
    id: 'shop_chi_poblano', 
    species: 'Chili', 
    variety: 'Poblano', 
    name: 'Poblano', 
    price: 25, 
    rarity: 'Rare', 
    description: 'Large, dark green, mild heat.', 
    baseGenetics: createBaseGenetics('a', 'BB', 'b', 'C', 'E', 'Ff') // Verde scuro, grande, lento, medio, rotondo, leggermente ruvido
  },
  { 
    id: 'shop_chi_habanero', 
    species: 'Chili', 
    variety: 'Habanero', 
    name: 'Habanero', 
    price: 40, 
    rarity: 'Epic', 
    description: 'Very hot, orange lantern shape.', 
    baseGenetics: createBaseGenetics('AAa', 'B', 'C', 'D', 'E', 'ff') // Arancio, medio, veloce, molti, rotondo, corrugato
  },
  { 
    id: 'shop_chi_ghost', 
    species: 'Chili', 
    variety: 'Ghost Pepper', 
    name: 'Ghost Pepper', 
    price: 100, 
    rarity: 'Legendary', 
    description: 'Extremely hot, wrinkled, high value.', 
    baseGenetics: createBaseGenetics('A', 'B', 'b', 'd', 'E', 'ff') // Rosso scuro, medio, lento, pochissimi, rotondo, estremamente corrugato
  },

  // BASIL
  { 
    id: 'shop_bas_sweet', 
    species: 'Basil', 
    variety: 'Sweet', 
    name: 'Sweet Basil', 
    price: 8, 
    rarity: 'Common', 
    description: 'Classic culinary basil with cupped leaves.', 
    baseGenetics: createBaseGenetics('A', 'B', 'C', 'C', 'E', 'F') // Verde, medio, veloce, medio-alto, foglie normali, liscio
  },
  { 
    id: 'shop_bas_lemon', 
    species: 'Basil', 
    variety: 'Lemon', 
    name: 'Lemon Basil', 
    price: 14, 
    rarity: 'Common', 
    description: 'Light green, citrus scent.', 
    baseGenetics: createBaseGenetics('a', 'B', 'C', 'C', 'E', 'F') // Verde chiaro, medio, veloce, medio-alto, foglie normali, liscio
  },
  { 
    id: 'shop_bas_thai', 
    species: 'Basil', 
    variety: 'Thai', 
    name: 'Thai Basil', 
    price: 22, 
    rarity: 'Rare', 
    description: 'Purple stems, narrow leaves, licorice flavor.', 
    baseGenetics: createBaseGenetics('AA', 'b', 'C', 'D', 'Ee', 'F') // Viola scuro, piccolo, veloce, molti, foglie strette, liscio
  },
  { 
    id: 'shop_bas_purple', 
    species: 'Basil', 
    variety: 'Purple', 
    name: 'Purple Basil', 
    price: 35, 
    rarity: 'Epic', 
    description: 'Striking dark purple leaves.', 
    baseGenetics: createBaseGenetics('aa', 'B', 'b', 'D', 'E', 'Ff') // Viola, medio, lento, molti, foglie normali, leggermente ruvido
  },
  { 
    id: 'shop_bas_holy', 
    species: 'Basil', 
    variety: 'Holy', 
    name: 'Holy Basil', 
    price: 60, 
    rarity: 'Legendary', 
    description: 'Sacred herb with jagged leaves.', 
    baseGenetics: createBaseGenetics('AA', 'B', 'b', 'D', 'ee', 'ff') // Viola scurissimo, medio, lento, molti, foglie frastagliate, corrugato
  },

  // RADISHES
  { 
    id: 'shop_rad_cherry', 
    species: 'Radish', 
    variety: 'Cherry Belle', 
    name: 'Cherry Belle', 
    price: 5, 
    rarity: 'Common', 
    description: 'Fastest growing, round red root.', 
    baseGenetics: createBaseGenetics('A', 'b', 'CC', 'D', 'E', 'F') // Rosso, piccolissimo, velocissimo, molti, rotondo, liscio
  },
  { 
    id: 'shop_rad_french', 
    species: 'Radish', 
    variety: 'French Breakfast', 
    name: 'French Breakfast', 
    price: 12, 
    rarity: 'Common', 
    description: 'Oblong, red with white tip.', 
    baseGenetics: createBaseGenetics('A', 'b', 'C', 'D', 'Ee', 'F') // Rosso, piccolissimo, veloce, molti, moderatamente allungato, liscio
  },
  { 
    id: 'shop_rad_daikon', 
    species: 'Radish', 
    variety: 'Daikon', 
    name: 'Daikon', 
    price: 20, 
    rarity: 'Rare', 
    description: 'Massive long white root.', 
    baseGenetics: createBaseGenetics('a', 'BB', 'b', 'D', 'ee', 'F') // Bianco, gigante, lento, molti, molto allungato, liscio
  },
  { 
    id: 'shop_rad_black', 
    species: 'Radish', 
    variety: 'Black Spanish', 
    name: 'Black Spanish', 
    price: 35, 
    rarity: 'Epic', 
    description: 'Round with rough black skin.', 
    baseGenetics: createBaseGenetics('aa', 'B', 'b', 'C', 'E', 'ff') // Nero, medio, lento, medio, rotondo, molto corrugato
  },
  { 
    id: 'shop_rad_watermelon', 
    species: 'Radish', 
    variety: 'Watermelon', 
    name: 'Watermelon Radish', 
    price: 75, 
    rarity: 'Legendary', 
    description: 'Green outside, bright pink inside.', 
    baseGenetics: createBaseGenetics('AAa', 'B', 'b', 'D', 'E', 'Ff') // Rosa/Magenta, medio, lento, molti, rotondo, leggermente ruvido
  },
];
