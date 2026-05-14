import { Consumable } from '../types';

export const SHOP_CONSUMABLES: Omit<Consumable, 'quantity'>[] = [
  // FIX: Omit<Consumable, 'quantity'> con parametri generici corretti
  // FIX: graffa di apertura { aggiunta al primo oggetto
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
  }, // FIX: graffa di chiusura } aggiunta al secondo oggetto
];
