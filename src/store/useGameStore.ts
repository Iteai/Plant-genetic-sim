import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Pot, Seed, HarvestedItem, Plant, Consumable, DiscoveredStrain, PlantGenetics } from '../types';
import { calculateOfflineProgress } from '../utils/timeUtils';
import { SHOP_ITEMS } from '../constants/plants';
import { SHOP_CONSUMABLES } from '../constants/items';
import { calculatePhenotype } from '../genetics/phenotype';

interface GameActions {
  plantSeed: (potId: string, seedId: string) => void;
  waterPlant: (potId: string) => void;
  harvestPlant: (potId: string) => void;
  clearDeadPlant: (potId: string) => void;
  buySeed: (shopItemId: string) => void;
  buyConsumable: (consumableId: string) => void;
  useFertilizer: (potId: string, consumableId: string) => void;
  sellHarvest: (harvestId: string) => void;
  processOfflineTime: () => void;
  updateGameLoop: (deltaMs: number) => void;
  registerDiscovery: (seed: Seed) => void;
}

type GameStore = GameState & GameActions;

const INITIAL_STATE: GameState = {
  pots: [
    { id: 'pot_1', plant: null, size: 'Small', soilQuality: 100 },
    { id: 'pot_2', plant: null, size: 'Small', soilQuality: 100 },
    { id: 'pot_3', plant: null, size: 'Small', soilQuality: 100 },
    { id: 'pot_4', plant: null, size: 'Small', soilQuality: 100 },
  ],
  seeds: [],
  inventory: [],
  consumables: [],
  encyclopedia: {},
  money: 200,
  xp: 0,
  level: 1,
  lastSavedAt: Date.now(),
};

const getPhenotypeId = (species: string, variety: string, genetics: PlantGenetics) => {
  const isColorDom = genetics.color.allele1 === 'A' || genetics.color.allele2 === 'A';
  const isSizeDom = genetics.size.allele1 === 'B' || genetics.size.allele2 === 'B';
  return `${species}-${variety}-C${isColorDom ? 'D' : 'R'}-S${isSizeDom ? 'D' : 'R'}`;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      registerDiscovery: (seed) => set((state) => {
        const phenotypeId = getPhenotypeId(seed.species, seed.variety, seed.genetics);
        if (!state.encyclopedia[phenotypeId]) {
          const newDiscovery: DiscoveredStrain = {
            id: phenotypeId,
            species: seed.species,
            variety: seed.variety,
            name: seed.name,
            discoveredAt: Date.now(),
            rarity: seed.rarity,
            generation: seed.genetics.generation,
          };
          return { encyclopedia: { ...state.encyclopedia, [phenotypeId]: newDiscovery } };
        }
        return state;
      }),

      buySeed: (shopItemId) => set((state) => {
        const item = SHOP_ITEMS.find(i => i.id === shopItemId);
        if (!item || state.money < item.price) return state;

        const newSeed: Seed = {
          id: `seed_${Date.now()}_${Math.random()}`,
          species: item.species,
          variety: item.variety,
          name: `${item.name} Seed`,
          genetics: item.baseGenetics,
          phenotype: calculatePhenotype(item.baseGenetics, item.species),
          quantity: 1,
          rarity: item.rarity,
        };

        get().registerDiscovery(newSeed);

        const existingSeedIndex = state.seeds.findIndex(s => s.variety === item.variety && s.genetics.generation === 1);
        const newSeeds = [...state.seeds];
        if (existingSeedIndex >= 0) newSeeds[existingSeedIndex].quantity += 1;
        else newSeeds.push(newSeed);

        return { money: state.money - item.price, seeds: newSeeds, lastSavedAt: Date.now() };
      }),

      buyConsumable: (consumableId) => set((state) => {
        const item = SHOP_CONSUMABLES.find(i => i.id === consumableId);
        if (!item || state.money < item.price) return state;

        const existingIndex = state.consumables.findIndex(c => c.id === consumableId);
        const newConsumables = [...state.consumables];

        if (existingIndex >= 0) newConsumables[existingIndex].quantity += 1;
        else newConsumables.push({ ...item, quantity: 1 });

        return { money: state.money - item.price, consumables: newConsumables, lastSavedAt: Date.now() };
      }),

      useFertilizer: (potId, consumableId) => set((state) => {
        const consumableIndex = state.consumables.findIndex(c => c.id === consumableId);
        if (consumableIndex === -1 || state.consumables[consumableIndex].quantity <= 0) return state;

        const consumable = state.consumables[consumableIndex];
        const newConsumables = [...state.consumables];
        newConsumables[consumableIndex].quantity -= 1;
        if (newConsumables[consumableIndex].quantity === 0) newConsumables.splice(consumableIndex, 1);

        const newPots = state.pots.map(pot => {
          if (pot.id === potId && pot.plant) {
            if (consumable.type === 'Growth') {
              const updatedPlant = calculateOfflineProgress(pot.plant, 14400000);
              return { ...pot, plant: updatedPlant };
            } else if (consumable.type === 'Mutation') {
              return { ...pot, activeFertilizer: 'Mutation' };
            }
          }
          return pot;
        });

        return { consumables: newConsumables, pots: newPots, lastSavedAt: Date.now() };
      }),

      sellHarvest: (harvestId) => set((state) => {
        const itemIndex = state.inventory.findIndex(i => i.id === harvestId);
        if (itemIndex === -1) return state;
        const item = state.inventory[itemIndex];
        const newInventory = [...state.inventory];
        newInventory.splice(itemIndex, 1);
        return { inventory: newInventory, money: state.money + item.value, lastSavedAt: Date.now() };
      }),

      plantSeed: (potId, seedId) => set((state) => {
        const seedIndex = state.seeds.findIndex(s => s.id === seedId);
        if (seedIndex === -1) return state;

        const seed = state.seeds[seedIndex];
        const newSeeds = [...state.seeds];
        if (seed.quantity > 1) newSeeds[seedIndex] = { ...seed, quantity: seed.quantity - 1 };
        else newSeeds.splice(seedIndex, 1);

        const newPlant: Plant = {
          id: `plant_${Date.now()}`,
          species: seed.species,
          variety: seed.variety,
          name: seed.name.replace(' Seed', ''),
          genetics: seed.genetics,
          phenotype: seed.phenotype,
          stage: 'Seed',
          plantedAt: Date.now(),
          lastWateredAt: Date.now(),
          waterLevel: 100,
          health: 100,
          growthProgress: 0,
          yieldAmount: 0,
          isHybrid: seed.genetics.generation > 1,
        };

        const newPots = state.pots.map(pot => pot.id === potId ? { ...pot, plant: newPlant, activeFertilizer: undefined } : pot);
        return { pots: newPots, seeds: newSeeds, lastSavedAt: Date.now() };
      }),

      waterPlant: (potId) => set((state) => {
        const newPots = state.pots.map(pot =>
          pot.id === potId && pot.plant
            ? { ...pot, plant: { ...pot.plant, waterLevel: 100, lastWateredAt: Date.now() } }
            : pot
        );
        return { pots: newPots, lastSavedAt: Date.now() };
      }),

      harvestPlant: (potId) => set((state) => {
        const pot = state.pots.find(p => p.id === potId);
        if (!pot || !pot.plant || pot.plant.stage !== 'HarvestReady') return state;

        const plant = pot.plant;
        const shopRef = SHOP_ITEMS.find(i => i.variety === plant.variety);
        const baseValue = shopRef ? Math.floor(shopRef.price * 1.5) : 15;

        const harvestedItem: HarvestedItem = {
          id: `harvest_${Date.now()}`,
          species: plant.species,
          variety: plant.variety,
          quality: plant.health,
          quantity: plant.yieldAmount,
          value: Math.floor((plant.health / 100) * baseValue * plant.yieldAmount),
          rarity: shopRef?.rarity || 'Common',
        };

        const newSeeds = [...state.seeds];
        if (pot.activeFertilizer === 'Mutation') {
          const mutatedGenetics = { ...plant.genetics, mutationCount: plant.genetics.mutationCount + 1 };
          const bonusSeed: Seed = {
            id: `seed_mut_${Date.now()}`,
            species: plant.species,
            variety: plant.variety,
            name: `Mutated ${plant.name} Seed`,
            genetics: mutatedGenetics,
            phenotype: calculatePhenotype(mutatedGenetics, plant.species),
            quantity: 1,
            rarity: 'Epic',
          };
          newSeeds.push(bonusSeed);
          get().registerDiscovery(bonusSeed);
        }

        const newPots = state.pots.map(p => p.id === potId ? { ...p, plant: null, activeFertilizer: undefined } : p);
        return { pots: newPots, inventory: [...state.inventory, harvestedItem], seeds: newSeeds, xp: state.xp + 50, lastSavedAt: Date.now() };
      }),

      clearDeadPlant: (potId) => set((state) => {
        const newPots = state.pots.map(p => p.id === potId ? { ...p, plant: null, activeFertilizer: undefined } : p);
        return { pots: newPots, lastSavedAt: Date.now() };
      }),

      processOfflineTime: () => set((state) => {
        const now = Date.now();
        const timeDeltaMs = now - state.lastSavedAt;
        if (timeDeltaMs < 1000) return state;
        const updatedPots = state.pots.map(pot => pot.plant ? { ...pot, plant: calculateOfflineProgress(pot.plant, timeDeltaMs) } : pot);
        return { pots: updatedPots, lastSavedAt: now };
      }),

      updateGameLoop: (deltaMs) => set((state) => {
        const updatedPots = state.pots.map(pot => pot.plant ? { ...pot, plant: calculateOfflineProgress(pot.plant, deltaMs) } : pot);
        return { pots: updatedPots, lastSavedAt: Date.now() };
      }),
    }),
    {
      name: 'mendels-garden-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.processOfflineTime();
      },
    }
  )
);
