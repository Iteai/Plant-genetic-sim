import { PlantGenetics, GenePair, Allele, Species } from '../types';

const MUTATION_CHANCE = 0.05;

const getInheritedAllele = (pair: GenePair): Allele => {
  return Math.random() > 0.5 ? pair.allele1 : pair.allele2;
};

const mutateAllele = (allele: Allele): Allele => {
  if (Math.random() > MUTATION_CHANCE) return allele;

  const isUpperCase = allele === allele.toUpperCase();
  return (isUpperCase ? allele.toLowerCase() : allele.toUpperCase()) as Allele;
};

const combineGenes = (parentA: GenePair, parentB: GenePair): GenePair => {
  let a1 = mutateAllele(getInheritedAllele(parentA));
  let a2 = mutateAllele(getInheritedAllele(parentB));

  if (a1 === a1.toLowerCase() && a2 === a2.toUpperCase()) {
    const temp = a1;
    a1 = a2;
    a2 = temp;
  }

  return { allele1: a1, allele2: a2 };
};

export const crossbreed = (
  parentA: PlantGenetics,
  parentB: PlantGenetics
): PlantGenetics => {
  const baseMutations = Math.max(parentA.mutationCount, parentB.mutationCount);

  const newGenetics: PlantGenetics = {
    color: combineGenes(parentA.color, parentB.color),
    size: combineGenes(parentA.size, parentB.size),
    growthRate: combineGenes(parentA.growthRate, parentB.growthRate),
    yield: combineGenes(parentA.yield, parentB.yield),
    shape: combineGenes(parentA.shape, parentB.shape),
    texture: combineGenes(parentA.texture, parentB.texture),
    generation: Math.max(parentA.generation, parentB.generation) + 1,
    mutationCount: baseMutations,
  };

  const parentColorA = JSON.stringify(parentA.color);
  const parentColorB = JSON.stringify(parentB.color);
  const childColor = JSON.stringify(newGenetics.color);

  const isMutated = childColor !== parentColorA && childColor !== parentColorB;

  if (isMutated) {
    newGenetics.mutationCount += 1;
  }

  return newGenetics;
};

export const getPhenotypeColor = (species: Species, colorGene: GenePair): string => {
  const isDominant = colorGene.allele1 === 'A' || colorGene.allele2 === 'A';

  switch (species) {
    case 'Chili':
      return isDominant ? '#e63946' : '#ffb703';
    case 'Tomato':
      return isDominant ? '#d62828' : '#8338ec';
    case 'Basil':
      return isDominant ? '#2a9d8f' : '#52b788';
    case 'Radish':
      return isDominant ? '#e01e37' : '#ffffff';
    default:
      return '#4caf50';
  }
};
