import { Species, Variety, PlantGenetics, Rarity, GenePair } from '../types';

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

const pair = <T extends GenePair['allele1']>(allele1: T, allele2: T): GenePair => ({
  allele1,
  allele2,
});

const createBaseGenetics = (
  color: GenePair,
  size: GenePair,
  speed: GenePair,
  yieldG: GenePair,
  shape: GenePair,
  texture: GenePair
): PlantGenetics => ({
  color,
  size,
  growthRate: speed,
  yield: yieldG,
  shape,
  texture,
  generation: 1,
  mutationCount: 0,
});

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'shop_tom_cherry',
    species: 'Tomato',
    variety: 'Cherry',
    name: 'Cherry Tomato',
    price: 10,
    rarity: 'Common',
    description: 'Fast growing, small clusters of sweet fruits.',
    baseGenetics: createBaseGenetics(
      pair('A', 'A'),
      pair('b', 'b'),
      pair('C', 'C'),
      pair('d', 'd'),
      pair('E', 'E'),
      pair('F', 'F')
    ),
  },
  {
    id: 'shop_tom_roma',
    species: 'Tomato',
    variety: 'Roma',
    name: 'Roma Tomato',
    price: 15,
    rarity: 'Common',
    description: 'Classic oval paste tomato. Great yield.',
    baseGenetics: createBaseGenetics(
      pair('A', 'A'),
      pair('B', 'b'),
      pair('C', 'C'),
      pair('D', 'D'),
      pair('e', 'e'),
      pair('f', 'f')
    ),
  },
  {
    id: 'shop_tom_sanmarzano',
    species: 'Tomato',
    variety: 'San Marzano',
    name: 'San Marzano',
    price: 30,
    rarity: 'Rare',
    description: 'Elongated, highly prized for sauces.',
    baseGenetics: createBaseGenetics(
      pair('A', 'A'),
      pair('B', 'B'),
      pair('b', 'b'),
      pair('D', 'D'),
      pair('e', 'e'),
      pair('f', 'f')
    ),
  },
  {
    id: 'shop_tom_beef',
    species: 'Tomato',
    variety: 'Beefsteak',
    name: 'Beefsteak Tomato',
    price: 45,
    rarity: 'Epic',
    description: 'Huge, ribbed fruits. Slow but valuable.',
    baseGenetics: createBaseGenetics(
      pair('A', 'A'),
      pair('B', 'B'),
      pair('c', 'c'),
      pair('d', 'd'),
      pair('E', 'E'),
      pair('f', 'f')
    ),
  },
  {
    id: 'shop_tom_heirloom',
    species: 'Tomato',
    variety: 'Heirloom',
    name: 'Heirloom Tomato',
    price: 80,
    rarity: 'Legendary',
    description: 'Rare, high value, unique dark colors.',
    baseGenetics: createBaseGenetics(
      pair('a', 'a'),
      pair('B', 'b'),
      pair('c', 'c'),
      pair('D', 'D'),
      pair('E', 'E'),
      pair('f', 'f')
    ),
  },

  {
    id: 'shop_chi_jalapeno',
    species: 'Chili',
    variety: 'Jalapeno',
    name: 'Jalapeno',
    price: 12,
    rarity: 'Common',
    description: 'Standard spicy green pepper. Reliable.',
    baseGenetics: createBaseGenetics(
      pair('a', 'a'),
      pair('B', 'b'),
      pair('C', 'C'),
      pair('D', 'd'),
      pair('E', 'e'),
      pair('F', 'F')
    ),
  },
  {
    id: 'shop_chi_cayenne',
    species: 'Chili',
    variety: 'Cayenne',
    name: 'Cayenne',
    price: 18,
    rarity: 'Common',
    description: 'Long, thin, and fiery red.',
    baseGenetics: createBaseGenetics(
      pair('A', 'A'),
      pair('b', 'b'),
      pair('C', 'C'),
      pair('D', 'D'),
      pair('e', 'e'),
      pair('F', 'F')
    ),
  },
  {
    id: 'shop_chi_poblano',
    species: 'Chili',
    variety: 'Poblano',
    name: 'Poblano',
    price: 25,
    rarity: 'Rare',
    description: 'Large, dark green, mild heat.',
    baseGenetics: createBaseGenetics(
      pair('a', 'a'),
      pair('B', 'B'),
      pair('c', 'c'),
      pair('D', 'd'),
      pair('E', 'E'),
      pair('F', 'f')
    ),
  },
  {
    id: 'shop_chi_habanero',
    species: 'Chili',
    variety: 'Habanero',
    name: 'Habanero',
    price: 40,
    rarity: 'Epic',
    description: 'Very hot, orange lantern shape.',
    baseGenetics: createBaseGenetics(
      pair('A', 'a'),
      pair('B', 'b'),
      pair('C', 'C'),
      pair('D', 'D'),
      pair('E', 'E'),
      pair('f', 'f')
    ),
  },
  {
    id: 'shop_chi_ghost',
    species: 'Chili',
    variety: 'Ghost Pepper',
    name: 'Ghost Pepper',
    price: 100,
    rarity: 'Legendary',
    description: 'Extremely hot, wrinkled, high value.',
    baseGenetics: createBaseGenetics(
      pair('A', 'A'),
      pair('B', 'b'),
      pair('c', 'c'),
      pair('d', 'd'),
      pair('E', 'E'),
      pair('f', 'f')
    ),
  },

  {
    id: 'shop_bas_sweet',
    species: 'Basil',
    variety: 'Sweet',
    name: 'Sweet Basil',
    price: 8,
    rarity: 'Common',
    description: 'Classic culinary basil with cupped leaves.',
    baseGenetics: createBaseGenetics(
      pair('A', 'A'),
      pair('B', 'b'),
      pair('C', 'C'),
      pair('D', 'd'),
      pair('E', 'E'),
      pair('F', 'F')
    ),
  },
  {
    id: 'shop_bas_lemon',
    species: 'Basil',
    variety: 'Lemon',
    name: 'Lemon Basil',
    price: 14,
    rarity: 'Common',
    description: 'Light green, citrus scent.',
    baseGenetics: createBaseGenetics(
      pair('a', 'a'),
      pair('B', 'b'),
      pair('C', 'C'),
      pair('D', 'd'),
      pair('E', 'E'),
      pair('F', 'F')
    ),
  },
  {
    id: 'shop_bas_thai',
    species: 'Basil',
    variety: 'Thai',
    name: 'Thai Basil',
    price: 22,
    rarity: 'Rare',
    description: 'Purple stems, narrow leaves, licorice flavor.',
    baseGenetics: createBaseGenetics(
      pair('A', 'A'),
      pair('b', 'b'),
      pair('C', 'C'),
      pair('D', 'D'),
      pair('E', 'e'),
      pair('F', 'F')
    ),
  },
  {
    id: 'shop_bas_purple',
    species: 'Basil',
    variety: 'Purple',
    name: 'Purple Basil',
    price: 35,
    rarity: 'Epic',
    description: 'Striking dark purple leaves.',
    baseGenetics: createBaseGenetics(
      pair('a', 'a'),
      pair('B', 'b'),
      pair('c', 'c'),
      pair('D', 'D'),
      pair('E', 'E'),
      pair('F', 'f')
    ),
  },
  {
    id: 'shop_bas_holy',
    species: 'Basil',
    variety: 'Holy',
    name: 'Holy Basil',
    price: 60,
    rarity: 'Legendary',
    description: 'Sacred herb with jagged leaves.',
    baseGenetics: createBaseGenetics(
      pair('A', 'A'),
      pair('B', 'b'),
      pair('c', 'c'),
      pair('D', 'D'),
      pair('e', 'e'),
      pair('f', 'f')
    ),
  },

  {
    id: 'shop_rad_cherry',
    species: 'Radish',
    variety: 'Cherry Belle',
    name: 'Cherry Belle',
    price: 5,
    rarity: 'Common',
    description: 'Fastest growing, round red root.',
    baseGenetics: createBaseGenetics(
      pair('A', 'A'),
      pair('b', 'b'),
      pair('C', 'C'),
      pair('D', 'D'),
      pair('E', 'E'),
      pair('F', 'F')
    ),
  },
  {
    id: 'shop_rad_french',
    species: 'Radish',
    variety: 'French Breakfast',
    name: 'French Breakfast',
    price: 12,
    rarity: 'Common',
    description: 'Oblong, red with white tip.',
    baseGenetics: createBaseGenetics(
      pair('A', 'A'),
      pair('b', 'b'),
      pair('C', 'c'),
      pair('D', 'D'),
      pair('E', 'e'),
      pair('F', 'F')
    ),
  },
  {
    id: 'shop_rad_daikon',
    species: 'Radish',
    variety: 'Daikon',
    name: 'Daikon',
    price: 20,
    rarity: 'Rare',
    description: 'Massive long white root.',
    baseGenetics: createBaseGenetics(
      pair('a', 'a'),
      pair('B', 'B'),
      pair('c', 'c'),
      pair('D', 'D'),
      pair('e', 'e'),
      pair('F', 'F')
    ),
  },
  {
    id: 'shop_rad_black',
    species: 'Radish',
    variety: 'Black Spanish',
    name: 'Black Spanish',
    price: 35,
    rarity: 'Epic',
    description: 'Round with rough black skin.',
    baseGenetics: createBaseGenetics(
      pair('a', 'a'),
      pair('B', 'b'),
      pair('c', 'c'),
      pair('D', 'd'),
      pair('E', 'E'),
      pair('f', 'f')
    ),
  },
  {
    id: 'shop_rad_watermelon',
    species: 'Radish',
    variety: 'Watermelon',
    name: 'Watermelon Radish',
    price: 75,
    rarity: 'Legendary',
    description: 'Green outside, bright pink inside.',
    baseGenetics: createBaseGenetics(
      pair('A', 'a'),
      pair('B', 'b'),
      pair('c', 'c'),
      pair('D', 'D'),
      pair('E', 'E'),
      pair('F', 'f')
    ),
  },
];
