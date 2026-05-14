import { PlantGenetics, PhenotypeTraits, Species } from '../types';

/**
 * Calcola i tratti fenotipici (1-5) basati sulla genetica
 * Ogni gene ha 2 alleli: maiuscolo=dominante, minuscolo=recessivo
 */

const scoreAlleles = (allele1: string, allele2: string): number => {
  // Dominanti (maiuscoli) = score più alto
  const isDom1 = allele1 === allele1.toUpperCase();
  const isDom2 = allele2 === allele2.toUpperCase();
  
  if (isDom1 && isDom2) return 5;      // AA
  if (isDom1 || isDom2) return 3;      // Aa
  return 1;                             // aa
};

export const calculatePhenotype = (genetics: PlantGenetics, species: Species): PhenotypeTraits => {
  // Color (A/a): determina la tonalità cromatica
  const colorScore = scoreAlleles(genetics.color.allele1, genetics.color.allele2);
  
  // Size (B/b): determina dimensione frutti e foglie
  const sizeScore = scoreAlleles(genetics.size.allele1, genetics.size.allele2);
  
  // Shape (E/e): forma frutti (rotondo vs allungato)
  const shapeScore = scoreAlleles(genetics.shape.allele1, genetics.shape.allele2);
  
  // Texture (F/f): texture superfice (liscio vs ruvido/corrugato)
  const textureScore = scoreAlleles(genetics.texture.allele1, genetics.texture.allele2);
  
  // Growth Rate (C/c): velocità di crescita
  const growthSpeed = scoreAlleles(genetics.growthRate.allele1, genetics.growthRate.allele2);
  
  // Yield (D/d): quantità frutti
  const yieldAmount = scoreAlleles(genetics.yield.allele1, genetics.yield.allele2);

  return {
    colorScore,
    sizeScore,
    shapeScore,
    textureScore,
    growthSpeed,
    yieldAmount,
  };
};

/**
 * Genera colori specifici basati su species, variety e colorScore
 */
export const getColorFromScore = (species: Species, variety: string, colorScore: number): string => {
  switch (species) {
    case 'Chili': {
      // 1=Giallo, 3=Arancio, 5=Rosso scuro
      const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#8B0000'];
      return colors[colorScore - 1];
    }
    case 'Tomato': {
      // 1=Giallo, 3=Arancio, 5=Rosso scuro
      const colors = ['#FFD700', '#FF8C00', '#FF6347', '#DC143C', '#8B0000'];
      return colors[colorScore - 1];
    }
    case 'Basil': {
      // 1=Verde chiaro, 3=Verde medio, 5=Viola/Scuro
      if (variety === 'Purple' || variety === 'Thai') {
        const colors = ['#7CB342', '#558B2F', '#33691E', '#4A148C', '#1A237E'];
        return colors[colorScore - 1];
      }
      const colors = ['#C8E6C9', '#81C784', '#4CAF50', '#2E7D32', '#1B5E20'];
      return colors[colorScore - 1];
    }
    case 'Radish': {
      // 1=Rosa, 3=Rosso medio, 5=Nero/Scuro
      const colors = ['#FF80AB', '#F06292', '#EC407A', '#C2185B', '#880E4F'];
      return colors[colorScore - 1];
    }
    default:
      return '#4CAF50';
  }
};

/**
 * Ottiene le dimensioni relative in base a sizeScore
 * 1=0.7x, 3=1.0x, 5=1.5x
 */
export const getSizeMultiplier = (sizeScore: number): number => {
  const multipliers = [0.7, 0.85, 1.0, 1.2, 1.5];
  return multipliers[sizeScore - 1];
};

/**
 * Calcola larghezza/altezza frutti in base a shapeScore
 * 1=rotondo (rapporto 1.0), 5=allungato (rapporto 2.5+)
 */
export const getShapeRatio = (shapeScore: number): { widthRatio: number; heightRatio: number } => {
  const ratios = [
    { widthRatio: 1.0, heightRatio: 1.0 },   // 1: perfettamente rotondo
    { widthRatio: 0.9, heightRatio: 1.1 },   // 2: leggermente ovale
    { widthRatio: 0.8, heightRatio: 1.3 },   // 3: moderatamente allungato
    { widthRatio: 0.7, heightRatio: 1.6 },   // 4: molto allungato
    { widthRatio: 0.6, heightRatio: 2.0 },   // 5: estremamente allungato
  ];
  return ratios[shapeScore - 1];
};

/**
 * Texture della superficie frutto
 * 1=liscio, 5=molto ruvido/corrugato
 */
export const getTextureDetails = (textureScore: number): { roughness: number; wrinkles: boolean; ribs: boolean } => {
  const textures = [
    { roughness: 0, wrinkles: false, ribs: false },     // 1: perfettamente liscio
    { roughness: 1, wrinkles: false, ribs: false },     // 2: leggermente ruvido
    { roughness: 2, wrinkles: true, ribs: false },      // 3: leggermente corrugato
    { roughness: 3, wrinkles: true, ribs: true },       // 4: molto corrugato con costole
    { roughness: 4, wrinkles: true, ribs: true },       // 5: estremamente ruvido
  ];
  return textures[textureScore - 1];
};
