import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../store/useGameStore';
import { crossbreed } from '../genetics/engine';
import { Seed } from '../types';

export const LabScreen: React.FC = () => {
  const seeds = useGameStore((state) => state.seeds);
  const [parentAId, setParentAId] = useState<string | null>(null);
  const [parentBId, setParentBId] = useState<string | null>(null);

  const handleCrossbreed = () => {
    if (!parentAId || !parentBId) return;

    const parentA = seeds.find(s => s.id === parentAId);
    const parentB = seeds.find(s => s.id === parentBId);

    if (!parentA || !parentB) return;

    // Generate new genetics
    const newGenetics = crossbreed(parentA.genetics, parentB.genetics);
    
    // Determine species (50/50 chance if different)
    const newSpecies = Math.random() > 0.5 ? parentA.species : parentB.species;
    
    const newSeed: Seed = {
      id: `hybrid_${Date.now()}`,
      species: newSpecies,
      name: `Hybrid ${newSpecies} Seed`,
      genetics: newGenetics,
      quantity: 1
    };

    // Update store directly using Zustand's setState
    useGameStore.setState((state) => {
      const newSeeds = [...state.seeds];
      
      // Deduct parent A
      const idxA = newSeeds.findIndex(s => s.id === parentAId);
      if (newSeeds[idxA].quantity > 1) newSeeds[idxA].quantity -= 1;
      else newSeeds.splice(idxA, 1);

      // Deduct parent B (need to re-find index in case splice shifted it)
      const idxB = newSeeds.findIndex(s => s.id === parentBId);
      if (idxB !== -1) {
        if (newSeeds[idxB].quantity > 1) newSeeds[idxB].quantity -= 1;
        else newSeeds.splice(idxB, 1);
      }

      // Add new seed
      newSeeds.push(newSeed);

      return { seeds: newSeeds, lastSavedAt: Date.now() };
    });

    Alert.alert(
      "Success!", 
      `You created a Generation ${newGenetics.generation} ${newSpecies} seed with ${newGenetics.mutationCount} mutations!`
    );
    
    setParentAId(null);
    setParentBId(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Genetics Lab</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instructions}>Select two seeds to crossbreed. This will consume one of each and produce a new hybrid seed.</Text>

        <View style={styles.parentsContainer}>
          <View style={styles.parentSlot}>
            <Text style={styles.slotTitle}>Parent A</Text>
            {seeds.map(seed => (
              <TouchableOpacity 
                key={`A_${seed.id}`}
                style={[styles.seedSelect, parentAId === seed.id && styles.selectedSeed]}
                onPress={() => setParentAId(seed.id)}
              >
                <Text style={styles.seedSelectText}>{seed.name} (Gen {seed.genetics.generation})</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.parentSlot}>
            <Text style={styles.slotTitle}>Parent B</Text>
            {seeds.map(seed => (
              <TouchableOpacity 
                key={`B_${seed.id}`}
                style={[styles.seedSelect, parentBId === seed.id && styles.selectedSeed]}
                onPress={() => setParentBId(seed.id)}
              >
                <Text style={styles.seedSelectText}>{seed.name} (Gen {seed.genetics.generation})</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.breedButton, (!parentAId || !parentBId) && styles.breedButtonDisabled]}
          disabled={!parentAId || !parentBId}
          onPress={handleCrossbreed}
        >
          <Text style={styles.breedButtonText}>Crossbreed Seeds</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a2e1a' },
  header: {
    padding: 20,
    backgroundColor: '#112211',
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e2c',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  content: { padding: 15 },
  instructions: { color: '#a5d6a7', marginBottom: 20, fontSize: 14, lineHeight: 20 },
  parentsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  parentSlot: { width: '48%' },
  slotTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  seedSelect: {
    backgroundColor: '#2c3e2c',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#4a6b4a',
  },
  selectedSeed: { borderColor: '#81c784', backgroundColor: '#388e3c' },
  seedSelectText: { color: '#fff', fontSize: 12 },
  breedButton: {
    backgroundColor: '#f57c00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  breedButtonDisabled: { backgroundColor: '#5d4037' },
  breedButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});
