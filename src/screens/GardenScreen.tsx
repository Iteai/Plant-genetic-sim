import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../store/useGameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { PotDisplay } from '../components/PotDisplay';
import { Seed } from '../types';

export const GardenScreen: React.FC = () => {
  // Initialize the real-time game loop
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
    if (selectedPotId) {
      plantSeed(selectedPotId, seedId);
    }
    setModalVisible(false);
    setSelectedPotId(null);
  };

  const renderSeedItem = ({ item }: { item: Seed }) => (
    <TouchableOpacity style={styles.seedItem} onPress={() => handlePlantSeed(item.id)}>
      <Text style={styles.seedName}>{item.name}</Text>
      <Text style={styles.seedDetails}>
        Gen: {item.genetics.generation} | Qty: {item.quantity}
      </Text>
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

      {/* Seed Selection Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Seed</Text>
            {seeds.length === 0 ? (
              <Text style={styles.emptyText}>No seeds in inventory.</Text>
            ) : (
              <FlatList
                data={seeds}
                keyExtractor={(item) => item.id}
                renderItem={renderSeedItem}
                style={styles.seedList}
              />
            )}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2e1a',
  },
  header: {
    padding: 20,
    backgroundColor: '#112211',
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e2c',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContent: {
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2c3e2c',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  seedList: {
    marginBottom: 15,
  },
  seedItem: {
    backgroundColor: '#1b261b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4a6b4a',
  },
  seedName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  seedDetails: {
    color: '#a5d6a7',
    fontSize: 14,
    marginTop: 5,
  },
  closeButton: {
    backgroundColor: '#d32f2f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    color: '#a5d6a7',
    textAlign: 'center',
    marginVertical: 20,
  }
});
