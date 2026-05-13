import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Pot, Seed, HarvestedItem, Plant } from '../types';
import { calculateOfflineProgress } from '../utils/timeUtils';

interface GameActions {
  plantSeed: (potId: string, seedId: string) => void;
  waterPlant: (potId: string) => void;
  harvestPlant: (potId: string) => void;
  clearDeadPlant: (potId: string) => void;
  processOfflineTime: () => void;
  updateGameLoop: (deltaMs: number) => void;
}

type GameStore = GameState & GameActions;

const INITIAL_STATE: GameState = {
  pots: [
    { id: 'pot_1', plant: null, size: 'Small', soilQuality: 100 },
    { id: 'pot_2', plant: null, size: 'Small', soilQuality: 100 },
    { id: 'pot_3', plant: null, size: 'Small', soilQuality: 100 },
  ],
  seeds:[
    {
      id: 'seed_starter_tomato',
      species: 'Tomato',
      name: 'Basic Tomato Seed',
      quantity: 5,
      genetics: {
        color: { allele1: 'A', allele2: 'A' },
        size: { allele1: 'b', allele2: 'b' },
        growthRate: { allele1: 'c', allele2: 'c' },
        yield: { allele1: 'd', allele2: 'd' },
        generation: 1,
        mutationCount: 0
      }
    },
    {
      id: 'seed_starter_chili',
      species: 'Chili',
      name: 'Basic Chili Seed',
      quantity: 5,
      genetics: {
        color: { allele1: 'A', allele2: 'A' },
        size: { allele1: 'b', allele2: 'b' },
        growthRate: { allele1: 'c', allele2: 'c' },
        yield: { allele1: 'd', allele2: 'd' },
        generation: 1,
        mutationCount: 0
      }
    }
  ],
  inventory:[],
  money: 100,
  xp: 0,
  level: 1,
  lastSavedAt: Date.now(),
  encyclopedia:[],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      plantSeed: (potId, seedId) => set((state) => {
        const seedIndex = state.seeds.findIndex(s => s.id === seedId);
        if (seedIndex === -1) return state;

        const seed = state.seeds[seedIndex];
        const newSeeds = [...state.seeds];
        
        if (seed.quantity > 1) {
          newSeeds[seedIndex] = { ...seed, quantity: seed.quantity - 1 };
        } else {
          newSeeds.splice(seedIndex, 1);
        }

        const newPlant: Plant = {
          id: `plant_${Date.now()}`,
          species: seed.species,
          name: seed.name.replace(' Seed', ''),
          genetics: seed.genetics,
          stage: 'Seed',
          plantedAt: Date.now(),
          lastWateredAt: Date.now(),
          waterLevel: 100,
          health: 100,
          growthProgress: 0,
          yieldAmount: 0,
          isHybrid: seed.genetics.generation > 1
        };

        const newPots = state.pots.map(pot => 
          pot.id === potId ? { ...pot, plant: newPlant } : pot
        );

        return { pots: newPots, seeds: newSeeds, lastSavedAt: Date.now() };
      }),

      waterPlant: (potId) => set((state) => {
        const newPots = state.pots.map(pot => {
          if (pot.id === potId && pot.plant) {
            return {
              ...pot,
              plant: {
                ...pot.plant,
                waterLevel: 100,
                lastWateredAt: Date.now()
              }
            };
          }
          return pot;
        });
        return { pots: newPots, lastSavedAt: Date.now() };
      }),

      harvestPlant: (potId) => set((state) => {
        const pot = state.pots.find(p => p.id === potId);
        if (!pot || !pot.plant || pot.plant.stage !== 'HarvestReady') return state;

        const plant = pot.plant;
        const harvestedItem: HarvestedItem = {
          id: `harvest_${Date.now()}`,
          species: plant.species,
          quality: plant.health,
          quantity: plant.yieldAmount,
          value: Math.floor((plant.health / 100) * 10 * plant.yieldAmount)
        };

        // Generate seeds from harvest based on genetics
        const newSeed: Seed = {
          id: `seed_${Date.now()}`,
          species: plant.species,
          name: `${plant.name} Seed`,
          genetics: plant.genetics,
          quantity: Math.max(1, Math.floor(plant.yieldAmount / 2))
        };

        // Check if seed exists to stack
        const existingSeedIndex = state.seeds.findIndex(
          s => JSON.stringify(s.genetics) === JSON.stringify(newSeed.genetics) && s.species === newSeed.species
        );

        const newSeeds = [...state.seeds];
        if (existingSeedIndex >= 0) {
          newSeeds[existingSeedIndex].quantity += newSeed.quantity;
        } else {
          newSeeds.push(newSeed);
        }

        const newPots = state.pots.map(p => 
          p.id === potId ? { ...p, plant: null } : p
        );

        return {
          pots: newPots,
          inventory: [...state.inventory, harvestedItem],
          seeds: newSeeds,
          xp: state.xp + 50,
          lastSavedAt: Date.now()
        };
      }),

      clearDeadPlant: (potId) => set((state) => {
        const newPots = state.pots.map(p => 
          p.id === potId ? { ...p, plant: null } : p
        );
        return { pots: newPots, lastSavedAt: Date.now() };
      }),

      processOfflineTime: () => set((state) => {
        const now = Date.now();
        const timeDeltaMs = now - state.lastSavedAt;
        
        // Prevent processing if time delta is negative (clock changed) or too small
        if (timeDeltaMs < 1000) return state;

        const updatedPots = state.pots.map(pot => {
          if (!pot.plant) return pot;
          return {
            ...pot,
            plant: calculateOfflineProgress(pot.plant, timeDeltaMs)
          };
        });

        return { pots: updatedPots, lastSavedAt: now };
      }),

      updateGameLoop: (deltaMs) => set((state) => {
        const updatedPots = state.pots.map(pot => {
          if (!pot.plant) return pot;
          return {
            ...pot,
            plant: calculateOfflineProgress(pot.plant, deltaMs)
          };
        });
        return { pots: updatedPots, lastSavedAt: Date.now() };
      })
    }),
    {
      name: 'mendels-garden-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Automatically process offline time when the store loads
          state.processOfflineTime();
        }
      },
    }
  )
);
