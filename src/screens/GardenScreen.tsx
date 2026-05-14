import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../store/useGameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { PotDisplay } from '../components/PotDisplay';
import { Seed } from '../types';
import { Theme } from '../theme/colors';
import { SeedPacketSvg } from '../components/svg/SeedPacketSvg';

export const GardenScreen: React.FC = () => {
  useGameLoop();

  const pots = useGameStore((state) => state.pots);
  const seeds = useGameStore((state) => state.seeds);
  const plantSeed = useGameStore((state) => state.plantSeed);
  const waterPlant = useGameStore((state) => state.waterPlant);
  const harvestPlant = useGameStore((state) => state.harvestPlant);
  const clearDeadPlant = useGameStore((state) => state.clearDeadPlant);

  const [selectedPotId, setSelectedPotId] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenPlantModal = (potId: string) => {
    setSelectedPotId(potId);
    setModalVisible(true);
  };

  const handlePlantSeed = (seedId: string) => {
    if (selectedPotId) plantSeed(selectedPotId, seedId);
    setModalVisible(false);
    setSelectedPotId(null);
  };

  const renderSeedItem = ({ item }: { item: Seed }) => (
    <TouchableOpacity style={styles.seedItem} onPress={() => handlePlantSeed(item.id)}>
      <SeedPacketSvg species={item.species} rarity={item.rarity} width={40} height={55} />
      <View style={styles.seedInfo}>
        <Text style={styles.seedName}>{item.name}</Text>
        <Text style={styles.seedDetails}>Gen: {item.genetics.generation} | Qty: {item.quantity}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Garden</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {pots.map((pot) => (
            <PotDisplay
              key={pot.id}
              pot={pot}
              onWater={() => waterPlant(pot.id)}
              onHarvest={() => harvestPlant(pot.id)}
              onClear={() => clearDeadPlant(pot.id)}
              onPlant={() => handleOpenPlantModal(pot.id)}
            />
          ))}
        </View>
      </ScrollView>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Seed to Plant</Text>
            {seeds.length === 0 ? (
              <Text style={styles.emptyText}>No seeds in inventory. Visit the Shop!</Text>
            ) : (
              <FlatList
                data={seeds}
                keyExtractor={(item) => item.id}
                renderItem={renderSeedItem}
                style={styles.seedList}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.background },
  header: { padding: 20, backgroundColor: Theme.surface, borderBottomWidth: 1, borderBottomColor: Theme.surfaceLight },
  title: { fontSize: 24, fontWeight: 'bold', color: Theme.text },
  scrollContent: { padding: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Theme.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Theme.text, marginBottom: 20, textAlign: 'center' },
  seedList: { marginBottom: 20 },
  seedItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.surfaceLight, padding: 12, borderRadius: 12, marginBottom: 10, gap: 16 },
  seedInfo: { flex: 1 },
  seedName: { color: Theme.text, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  seedDetails: { color: Theme.textMuted, fontSize: 14 },
  closeButton: { backgroundColor: Theme.surfaceLight, padding: 16, borderRadius: 12, alignItems: 'center' },
  closeButtonText: { color: Theme.text, fontWeight: 'bold', fontSize: 16 },
  emptyText: { color: Theme.textMuted, textAlign: 'center', marginVertical: 30, fontSize: 16 }
});
