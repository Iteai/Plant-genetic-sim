import { PlantGenetics, PhenotypeTraits, Species, Variety } from '../types';

const clampScore = (value: number): number => {
  return Math.max(1, Math.min(5, value));
};

const scoreAlleles = (allele1: string, allele2: string): number => {
  const isDom1 = allele1 === allele1.toUpperCase();
  const isDom2 = allele2 === allele2.toUpperCase();

  if (isDom1 && isDom2) return 5;
  if (isDom1 || isDom2) return 3;
  return 1;
};

export const calculatePhenotype = (
  genetics: PlantGenetics,
  _species: Species
): PhenotypeTraits => {
  const colorScore = clampScore(scoreAlleles(genetics.color.allele1, genetics.color.allele2));
  const sizeScore = clampScore(scoreAlleles(genetics.size.allele1, genetics.size.allele2));
  const shapeScore = clampScore(scoreAlleles(genetics.shape.allele1, genetics.shape.allele2));
  const textureScore = clampScore(scoreAlleles(genetics.texture.allele1, genetics.texture.allele2));
  const growthSpeed = clampScore(
    scoreAlleles(genetics.growthRate.allele1, genetics.growthRate.allele2)
  );
  const yieldAmount = clampScore(scoreAlleles(genetics.yield.allele1, genetics.yield.allele2));

  return {
    colorScore,
    sizeScore,
    shapeScore,
    textureScore,
    growthSpeed,
    yieldAmount,
  };
};

export const getColorFromScore = (
  species: Species,
  variety: Variety,
  colorScore: number
): string => {
  const score = clampScore(colorScore);

  switch (species) {
    case 'Chili': {
      const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#8B0000'];
      return colors[score - 1];
    }

    case 'Tomato': {
      const colors = ['#FFD700', '#FFB347', '#FF8C69', '#DC143C', '#8B0000'];
      return colors[score - 1];
    }

    case 'Basil': {
      if (variety === 'Purple' || variety === 'Thai' || variety === 'Holy') {
        const colors = ['#7CB342', '#558B2F', '#33691E', '#6A1B9A', '#311B92'];
        return colors[score - 1];
      }

      const colors = ['#C8E6C9', '#81C784', '#4CAF50', '#2E7D32', '#1B5E20'];
      return colors[score - 1];
    }

    case 'Radish': {
      const colors = ['#FFCDD2', '#F48FB1', '#EC407A', '#C2185B', '#880E4F'];
      return colors[score - 1];
    }

    default:
      return '#4CAF50';
  }
};

export const getSizeMultiplier = (sizeScore: number): number => {
  const multipliers = [0.7, 0.85, 1.0, 1.2, 1.5];
  return multipliers[clampScore(sizeScore) - 1];
};

export const getShapeRatio = (
  shapeScore: number
): { widthRatio: number; heightRatio: number } => {
  const ratios = [
    { widthRatio: 1.0, heightRatio: 1.0 },
    { widthRatio: 0.9, heightRatio: 1.1 },
    { widthRatio: 0.8, heightRatio: 1.3 },
    { widthRatio: 0.7, heightRatio: 1.6 },
    { widthRatio: 0.6, heightRatio: 2.0 },
  ];

  return ratios[clampScore(shapeScore) - 1];
};

export const getTextureDetails = (
  textureScore: number
): { roughness: number; wrinkles: boolean; ribs: boolean } => {
  const textures = [
    { roughness: 0, wrinkles: false, ribs: false },
    { roughness: 1, wrinkles: false, ribs: false },
    { roughness: 2, wrinkles: true, ribs: false },
    { roughness: 3, wrinkles: true, ribs: true },
    { roughness: 4, wrinkles: true, ribs: true },
  ];

  return textures[clampScore(textureScore) - 1];
};
