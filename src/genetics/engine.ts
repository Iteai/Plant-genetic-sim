import { PlantGenetics, GenePair, Allele, Species } from '../types';

const MUTATION_CHANCE = 0.05; // 5% chance per allele

// Helper to randomly pick one allele from a gene pair
const getInheritedAllele = (pair: GenePair): Allele => {
  return Math.random() > 0.5 ? pair.allele1 : pair.allele2;
};

// Helper to mutate an allele (flip dominant/recessive)
const mutateAllele = (allele: Allele): Allele => {
  if (Math.random() > MUTATION_CHANCE) return allele;
  
  const isUpperCase = allele === allele.toUpperCase();
  return (isUpperCase ? allele.toLowerCase() : allele.toUpperCase()) as Allele;
};

// Combine two gene pairs to create a new one
const combineGenes = (parentA: GenePair, parentB: GenePair): GenePair => {
  let a1 = mutateAllele(getInheritedAllele(parentA));
  let a2 = mutateAllele(getInheritedAllele(parentB));

  // Convention: Dominant (uppercase) always comes first if mixed
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
  // Calculate total mutations inherited + new
  const baseMutations = Math.max(parentA.mutationCount, parentB.mutationCount);
  
  const newGenetics: PlantGenetics = {
    color: combineGenes(parentA.color, parentB.color),
    size: combineGenes(parentA.size, parentB.size),
    growthRate: combineGenes(parentA.growthRate, parentB.growthRate),
    yield: combineGenes(parentA.yield, parentB.yield),
    generation: Math.max(parentA.generation, parentB.generation) + 1,
    mutationCount: baseMutations // Will increment if we detect a new mutation below
  };

  // Simple mutation counter check (comparing to parents)
  const isMutated = 
    JSON.stringify(newGenetics.color) !== JSON.stringify(parentA.color) &&
    JSON.stringify(newGenetics.color) !== JSON.stringify(parentB.color);
    
  if (isMutated) {
    newGenetics.mutationCount += 1;
  }

  return newGenetics;
};

// Helper to determine phenotype colors based on genetics
export const getPhenotypeColor = (species: Species, colorGene: GenePair): string => {
  const isDominant = colorGene.allele1 === 'A' || colorGene.allele2 === 'A';
  
  switch (species) {
    case 'Chili':
      return isDominant ? '#e63946' : '#ffb703'; // Red vs Yellow
    case 'Tomato':
      return isDominant ? '#d62828' : '#8338ec'; // Red vs Purple (Mutant)
    case 'Basil':
      return isDominant ? '#2a9d8f' : '#52b788'; // Dark Green vs Light Green
    case 'Radish':
      return isDominant ? '#e01e37' : '#ffffff'; // Red vs White
    default:
      return '#4caf50';
  }
};
