import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Pot, Seed, HarvestedItem, Plant } from '../types';
import { calculateOfflineProgress } from '../utils/timeUtils';
import { SHOP_ITEMS } from '../constants/plants';

interface GameActions {
  plantSeed: (potId: string, seedId: string) => void;
  waterPlant: (potId: string) => void;
  harvestPlant: (potId: string) => void;
  clearDeadPlant: (potId: string) => void;
  buySeed: (shopItemId: string) => void;
  sellHarvest: (harvestId: string) => void;
  processOfflineTime: () => void;
  updateGameLoop: (deltaMs: number) => void;
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
  money: 50, // Start with 50 coins to buy first seeds
  xp: 0,
  level: 1,
  lastSavedAt: Date.now(),
  encyclopedia: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      buySeed: (shopItemId) => set((state) => {
        const item = SHOP_ITEMS.find(i => i.id === shopItemId);
        if (!item || state.money < item.price) return state;

        const newSeed: Seed = {
          id: `seed_${Date.now()}_${Math.random()}`,
          species: item.species,
          variety: item.variety,
          name: `${item.name} Seed`,
          genetics: item.baseGenetics,
          quantity: 1
        };

        const existingSeedIndex = state.seeds.findIndex(
          s => s.variety === item.variety && s.genetics.generation === 1
        );

        const newSeeds = [...state.seeds];
        if (existingSeedIndex >= 0) {
          newSeeds[existingSeedIndex].quantity += 1;
        } else {
          newSeeds.push(newSeed);
        }

        return { money: state.money - item.price, seeds: newSeeds, lastSavedAt: Date.now() };
      }),

      sellHarvest: (harvestId) => set((state) => {
        const itemIndex = state.inventory.findIndex(i => i.id === harvestId);
        if (itemIndex === -1) return state;
        
        const item = state.inventory[itemIndex];
        const newInventory = [...state.inventory];
        newInventory.splice(itemIndex, 1);

        return { 
          inventory: newInventory, 
          money: state.money + item.value,
          lastSavedAt: Date.now() 
        };
      }),

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
          variety: seed.variety,
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
            return { ...pot, plant: { ...pot.plant, waterLevel: 100, lastWateredAt: Date.now() } };
          }
          return pot;
        });
        return { pots: newPots, lastSavedAt: Date.now() };
      }),

      harvestPlant: (potId) => set((state) => {
        const pot = state.pots.find(p => p.id === potId);
        if (!pot || !pot.plant || pot.plant.stage !== 'HarvestReady') return state;

        const plant = pot.plant;
        
        // Base value depends on variety rarity
        const baseValues: Record<string, number> = {
          'Cherry': 15, 'Roma': 20, 'Beefsteak': 35, 'Heirloom': 60, 'San Marzano': 45,
          'Jalapeno': 18, 'Habanero': 30, 'Cayenne': 25, 'Poblano': 35, 'Ghost Pepper': 80,
          'Sweet': 12, 'Thai': 20, 'Lemon': 25, 'Purple': 40, 'Holy': 50,
          'Cherry Belle': 8, 'French Breakfast': 15, 'Daikon': 25, 'Black Spanish': 30, 'Watermelon': 55
        };

        const baseValue = baseValues[plant.variety] || 10;

        const harvestedItem: HarvestedItem = {
          id: `harvest_${Date.now()}`,
          species: plant.species,
          variety: plant.variety,
          quality: plant.health,
          quantity: plant.yieldAmount,
          value: Math.floor((plant.health / 100) * baseValue * plant.yieldAmount)
        };

        const newPots = state.pots.map(p => p.id === potId ? { ...p, plant: null } : p);

        return {
          pots: newPots,
          inventory: [...state.inventory, harvestedItem],
          xp: state.xp + 50,
          lastSavedAt: Date.now()
        };
      }),

      clearDeadPlant: (potId) => set((state) => {
        const newPots = state.pots.map(p => p.id === potId ? { ...p, plant: null } : p);
        return { pots: newPots, lastSavedAt: Date.now() };
      }),

      processOfflineTime: () => set((state) => {
        const now = Date.now();
        const timeDeltaMs = now - state.lastSavedAt;
        if (timeDeltaMs < 1000) return state;

        const updatedPots = state.pots.map(pot => {
          if (!pot.plant) return pot;
          return { ...pot, plant: calculateOfflineProgress(pot.plant, timeDeltaMs) };
        });

        return { pots: updatedPots, lastSavedAt: now };
      }),

      updateGameLoop: (deltaMs) => set((state) => {
        const updatedPots = state.pots.map(pot => {
          if (!pot.plant) return pot;
          return { ...pot, plant: calculateOfflineProgress(pot.plant, deltaMs) };
        });
        return { pots: updatedPots, lastSavedAt: Date.now() };
      })
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
