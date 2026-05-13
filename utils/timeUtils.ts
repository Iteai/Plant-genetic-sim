import { Plant, GrowthStage } from '../types';

export const STAGE_DURATIONS_MS: Record<GrowthStage, number> = {
  Seed: 1000 * 60 * 5, // 5 mins
  Germination: 1000 * 60 * 15, // 15 mins
  Seedling: 1000 * 60 * 30, // 30 mins
  Vegetative: 1000 * 60 * 60, // 1 hour
  Flowering: 1000 * 60 * 60 * 2, // 2 hours
  Fruiting: 1000 * 60 * 60 * 3, // 3 hours
  HarvestReady: 1000 * 60 * 60 * 24, // Stays ready for 24 hours before dying
  Dead: 0,
};

export const calculateOfflineProgress = (plant: Plant, timeDeltaMs: number): Plant => {
  if (plant.stage === 'Dead' || plant.stage === 'HarvestReady') {
    return plant;
  }

  let remainingDelta = timeDeltaMs;
  let currentPlant = { ...plant };

  // Apply genetic modifiers to growth speed
  // C is dominant fast growth, c is recessive slow growth
  const hasFastGene = currentPlant.genetics.growthRate.allele1 === 'C' || currentPlant.genetics.growthRate.allele2 === 'C';
  const speedMultiplier = hasFastGene ? 1.5 : 1.0;

  while (remainingDelta > 0 && currentPlant.stage !== 'HarvestReady' && currentPlant.stage !== 'Dead') {
    const stageDuration = STAGE_DURATIONS_MS[currentPlant.stage] / speedMultiplier;
    const progressMs = (currentPlant.growthProgress / 100) * stageDuration;
    const timeToNextStage = stageDuration - progressMs;

    if (remainingDelta >= timeToNextStage) {
      // Advance to next stage
      remainingDelta -= timeToNextStage;
      currentPlant.stage = getNextStage(currentPlant.stage);
      currentPlant.growthProgress = 0;
      
      if (currentPlant.stage === 'HarvestReady') {
        // Calculate yield based on genetics and health
        const hasHighYieldGene = currentPlant.genetics.yield.allele1 === 'D' || currentPlant.genetics.yield.allele2 === 'D';
        const baseYield = hasHighYieldGene ? 5 : 2;
        currentPlant.yieldAmount = Math.max(1, Math.floor(baseYield * (currentPlant.health / 100)));
      }
    } else {
      // Add progress to current stage
      const addedProgress = (remainingDelta / stageDuration) * 100;
      currentPlant.growthProgress = Math.min(100, currentPlant.growthProgress + addedProgress);
      remainingDelta = 0;
    }
  }

  // Calculate water depletion (offline)
  // Depletes at 5% per hour
  const hoursOffline = timeDeltaMs / (1000 * 60 * 60);
  currentPlant.waterLevel = Math.max(0, currentPlant.waterLevel - (hoursOffline * 5));

  // Health penalty if water is 0
  if (currentPlant.waterLevel === 0) {
    currentPlant.health = Math.max(0, currentPlant.health - (hoursOffline * 10));
    if (currentPlant.health === 0) {
      currentPlant.stage = 'Dead';
    }
  }

  return currentPlant;
};

const getNextStage = (current: GrowthStage): GrowthStage => {
  const stages: GrowthStage[] = [
    'Seed', 'Germination', 'Seedling', 'Vegetative', 
    'Flowering', 'Fruiting', 'HarvestReady', 'Dead'
  ];
  const idx = stages.indexOf(current);
  return idx < stages.length - 1 ? stages[idx + 1] : current;
};
