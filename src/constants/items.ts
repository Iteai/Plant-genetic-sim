import { Consumable } from '../types';

export const SHOP_CONSUMABLES: Omit<Consumable, 'quantity'>[] = [
  {
    id: 'cons_growth_1',
    name: 'Chrono-Fertilizer',
    type: 'Growth',
    description: 'Accelerates plant growth by 4 hours instantly.',
    price: 25,
  },
  {
    id: 'cons_mut_1',
    name: 'Mutagenic Serum',
    type: 'Mutation',
    description: 'Apply to a pot. Guarantees +1 genetic mutation upon harvest.',
    price: 150,
  }
];
