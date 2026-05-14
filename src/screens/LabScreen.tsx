import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { useGameStore } from '../store/useGameStore';
import { crossbreed } from '../genetics/engine';
import { Seed } from '../types';
import { GlassPanel } from '../components/ui/GlassPanel';
import { DnaSvg } from '../components/svg/DnaSvg';
import { SeedPacketSvg } from '../components/svg/SeedPacketSvg';
import { FlaskConical, Fingerprint, Zap, X } from 'lucide-react-native';
import { Theme } from '../theme/colors';

export const LabScreen: React.FC = () => {
  const seeds = useGameStore((state) => state.seeds);
  const [parentAId, setParentAId] = useState<string | null>(null);
  const [parentBId, setParentBId] = useState<string | null>(null);
  
  const [isSelectingFor, setIsSelectingFor] = useState<'A' | 'B' | null>(null);
  const [isBreeding, setIsBreeding] = useState(false);
  const [resultSeed, setResultSeed] = useState<Seed | null>(null);

  // Animations
  const scanLineY = useSharedValue(0);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    scanLineY.value = withRepeat(
      withTiming(150, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
    pulseOpacity.value = withRepeat(
      withTiming(0.4, { duration: 1000 }),
      -1, true
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const parentA = seeds.find(s => s.id === parentAId);
  const parentB = seeds.find(s => s.id === parentBId);

  const handleCrossbreed = () => {
    if (!parentA || !parentB) return;
    setIsBreeding(true);

    setTimeout(() => {
      const newGenetics = crossbreed(parentA.genetics, parentB.genetics);
      const newSpecies = Math.random() > 0.5 ? parentA.species : parentB.species;
      
      const newSeed: Seed = {
        id: `hybrid_${Date.now()}`,
        species: newSpecies,
        variety: Math.random() > 0.5 ? parentA.variety : parentB.variety,
        name: `Hybrid ${newSpecies}`,
        genetics: newGenetics,
        quantity: 1,
        rarity: newGenetics.mutationCount > 2 ? 'Legendary' : newGenetics.mutationCount > 0 ? 'Epic' : 'Rare'
      };

      useGameStore.setState((state) => {
        const newSeeds = [...state.seeds];
        const idxA = newSeeds.findIndex(s => s.id === parentAId);
        if (newSeeds[idxA].quantity > 1) newSeeds[idxA].quantity -= 1;
        else newSeeds.splice(idxA, 1);

        const idxB = newSeeds.findIndex(s => s.id === parentBId);
        if (idxB !== -1) {
          if (newSeeds[idxB].quantity > 1) newSeeds[idxB].quantity -= 1;
          else newSeeds.splice(idxB, 1);
        }

        newSeeds.push(newSeed);
        return { seeds: newSeeds, lastSavedAt: Date.now() };
      });

      setResultSeed(newSeed);
      setIsBreeding(false);
      setParentAId(null);
      setParentBId(null);
    }, 2500); // 2.5s animation delay
  };

  const renderGene = (label: string, gene: any) => {
    const isMutated = gene.allele1 !== gene.allele1.toUpperCase() && gene.allele2 !== gene.allele2.toUpperCase();
    return (
      <View style={styles.geneRow}>
        <Text style={styles.geneLabel}>{label}</Text>
        <Text style={[styles.geneValue, isMutated && styles.geneMutated]}>
          {gene.allele1}{gene.allele2}
        </Text>
      </View>
    );
  };

  const renderParentSlot = (parent: Seed | undefined, slot: 'A' | 'B') => (
    <TouchableOpacity style={styles.parentSlot} onPress={() => setIsSelectingFor(slot)}>
      <GlassPanel intensity={parent ? 'high' : 'low'} style={styles.slotPanel}>
        {parent ? (
          <View style={styles.slotContent}>
            <SeedPacketSvg species={parent.species} rarity={parent.rarity} width={45} height={65} />
            <Text style={styles.slotName} numberOfLines={1}>{parent.name}</Text>
            <View style={styles.geneMiniGrid}>
              {renderGene('CLR', parent.genetics.color)}
              {renderGene('SIZ', parent.genetics.size)}
              {renderGene('GRO', parent.genetics.growthRate)}
              {renderGene('YLD', parent.genetics.yield)}
            </View>
          </View>
        ) : (
          <View style={styles.emptySlot}>
            <Fingerprint color="rgba(24, 255, 255, 0.5)" size={40} />
            <Text style={styles.emptySlotText}>Select Sample {slot}</Text>
          </View>
        )}
        {/* Holographic Scan Line */}
        {parent && (
          <Animated.View style={[styles.scanLine, scanLineStyle]} />
        )}
      </GlassPanel>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FlaskConical color="#18FFFF" size={28} />
        <Text style={styles.title}>Genetics Laboratory</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instructions}>
          Insert two genetic samples into the synthesis chambers to sequence a new hybrid strain.
        </Text>

        <View style={styles.chambersContainer}>
          {renderParentSlot(parentA, 'A')}
          
          <View style={styles.dnaCenter}>
            <Animated.View style={isBreeding ? pulseStyle : {}}>
              <DnaSvg color={isBreeding ? '#00E676' : '#18FFFF'} />
            </Animated.View>
          </View>

          {renderParentSlot(parentB, 'B')}
        </View>

        <View style={styles.analysisPanel}>
          <Text style={styles.analysisTitle}>Synthesis Probability</Text>
          <View style={styles.probRow}>
            <Text style={styles.probLabel}>Mutation Chance:</Text>
            <Text style={styles.probValue}>High</Text>
          </View>
          <View style={styles.probRow}>
            <Text style={styles.probLabel}>Compatibility:</Text>
            <Text style={styles.probValue}>{parentA && parentB ? (parentA.species === parentB.species ? 'Optimal (98%)' : 'Experimental (45%)') : '---'}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.breedButton, (!parentA || !parentB || isBreeding) && styles.breedButtonDisabled]}
          disabled={!parentA || !parentB || isBreeding}
          onPress={handleCrossbreed}
        >
          <Zap color={isBreeding ? '#00E676' : '#050B08'} size={20} />
          <Text style={styles.breedButtonText}>
            {isBreeding ? 'Sequencing DNA...' : 'Initiate Synthesis'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Seed Selection Modal */}
      <Modal visible={isSelectingFor !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassPanel intensity="high" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Sample {isSelectingFor}</Text>
              <TouchableOpacity onPress={() => setIsSelectingFor(null)}>
                <X color="#18FFFF" size={24} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={seeds}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.seedSelectItem}
                  onPress={() => {
                    if (isSelectingFor === 'A') setParentAId(item.id);
                    else setParentBId(item.id);
                    setIsSelectingFor(null);
                  }}
                >
                  <SeedPacketSvg species={item.species} rarity={item.rarity} width={30} height={45} />
                  <View style={styles.seedSelectInfo}>
                    <Text style={styles.seedSelectName}>{item.name}</Text>
                    <Text style={styles.seedSelectGen}>Gen {item.genetics.generation} | Qty: {item.quantity}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </GlassPanel>
        </View>
      </Modal>

      {/* Result Modal */}
      <Modal visible={resultSeed !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassPanel intensity="high" style={styles.resultContent}>
            <Text style={styles.resultHeader}>Synthesis Complete</Text>
            {resultSeed && (
              <View style={styles.resultBody}>
                <Animated.View style={pulseStyle}>
                  <SeedPacketSvg species={resultSeed.species} rarity={resultSeed.rarity} width={80} height={110} />
                </Animated.View>
                <Text style={styles.resultName}>{resultSeed.name}</Text>
                <Text style={[styles.resultRarity, { color: Theme.rarity[resultSeed.rarity] }]}>
                  {resultSeed.rarity} Strain
                </Text>
                
                <View style={styles.resultStats}>
                  <Text style={styles.resultStatText}>Generation: <Text style={{color: '#18FFFF'}}>{resultSeed.genetics.generation}</Text></Text>
                  <Text style={styles.resultStatText}>Mutations: <Text style={{color: '#00E676'}}>{resultSeed.genetics.mutationCount}</Text></Text>
                </View>
              </View>
            )}
            <TouchableOpacity style={styles.collectButton} onPress={() => setResultSeed(null)}>
              <Text style={styles.collectButtonText}>Extract to Archive</Text>
            </TouchableOpacity>
          </GlassPanel>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050B08' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, backgroundColor: 'rgba(21, 41, 30, 0.8)', borderBottomWidth: 1, borderBottomColor: 'rgba(24, 255, 255, 0.2)' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#E0F7FA', letterSpacing: 1 },
  content: { padding: 16 },
  instructions: { color: '#80CBC4', marginBottom: 24, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  chambersContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  parentSlot: { width: '42%', height: 200 },
  slotPanel: { flex: 1, padding: 10 },
  slotContent: { alignItems: 'center', flex: 1 },
  slotName: { color: '#E0F7FA', fontSize: 12, fontWeight: 'bold', marginVertical: 8, textAlign: 'center' },
  geneMiniGrid: { width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', padding: 6, borderRadius: 8 },
  geneRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  geneLabel: { color: '#80CBC4', fontSize: 9 },
  geneValue: { color: '#18FFFF', fontSize: 10, fontWeight: 'bold' },
  geneMutated: { color: '#00E676' },
  emptySlot: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptySlotText: { color: 'rgba(24, 255, 255, 0.5)', fontSize: 12, textAlign: 'center' },
  scanLine: { position: 'absolute', left: 0, right: 0, top: 0, height: 2, backgroundColor: '#18FFFF', shadowColor: '#18FFFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 5, elevation: 5 },
  dnaCenter: { width: '16%', alignItems: 'center' },
  analysisPanel: { backgroundColor: 'rgba(21, 41, 30, 0.5)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(24, 255, 255, 0.2)', marginBottom: 30 },
  analysisTitle: { color: '#18FFFF', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
  probRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  probLabel: { color: '#80CBC4', fontSize: 14 },
  probValue: { color: '#E0F7FA', fontSize: 14, fontWeight: 'bold' },
  breedButton: { flexDirection: 'row', backgroundColor: '#18FFFF', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: '#18FFFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8 },
  breedButtonDisabled: { backgroundColor: 'rgba(24, 255, 255, 0.2)', shadowOpacity: 0 },
  breedButtonText: { color: '#050B08', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(5, 11, 8, 0.9)', justifyContent: 'center', padding: 20 },
  modalContent: { maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { color: '#18FFFF', fontSize: 18, fontWeight: 'bold' },
  seedSelectItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(24, 255, 255, 0.1)', gap: 12 },
  seedSelectInfo: { flex: 1 },
  seedSelectName: { color: '#E0F7FA', fontSize: 16, fontWeight: 'bold' },
  seedSelectGen: { color: '#80CBC4', fontSize: 12, marginTop: 4 },
  resultContent: { alignItems: 'center', padding: 24 },
  resultHeader: { color: '#00E676', fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24 },
  resultBody: { alignItems: 'center', marginBottom: 30 },
  resultName: { color: '#E0F7FA', fontSize: 20, fontWeight: 'bold', marginTop: 16 },
  resultRarity: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 4 },
  resultStats: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 12, marginTop: 16, width: '100%', alignItems: 'center' },
  resultStatText: { color: '#80CBC4', fontSize: 14, marginBottom: 4 },
  collectButton: { backgroundColor: '#18FFFF', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, width: '100%', alignItems: 'center' },
  collectButtonText: { color: '#050B08', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' }
});
