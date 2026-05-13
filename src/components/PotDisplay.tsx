import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Pot } from '../types';
import { PotSvg } from './svg/PotSvg';
import { PlantSprite } from './svg/PlantSprite';
import { Droplets, Scissors, Trash2 } from 'lucide-react-native';

interface PotDisplayProps {
  pot: Pot;
  onWater: () => void;
  onHarvest: () => void;
  onClear: () => void;
  onPlant: () => void;
}

export const PotDisplay: React.FC<PotDisplayProps> = ({ 
  pot, 
  onWater, 
  onHarvest, 
  onClear, 
  onPlant 
}) => {
  const { plant } = pot;

  return (
    <View style={styles.container}>
      <View style={styles.graphicsContainer}>
        {plant && (
          <View style={styles.plantWrapper}>
            <PlantSprite 
              stage={plant.stage} 
              species={plant.species} 
              genetics={plant.genetics}
              health={plant.health}
              width={120} 
              height={120} 
            />
          </View>
        )}
        <View style={styles.potWrapper}>
          <PotSvg width={100} height={100} waterLevel={plant ? plant.waterLevel : 0} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        {plant ? (
          <>
            <Text style={styles.plantName}>{plant.name}</Text>
            <Text style={styles.stageText}>{plant.stage}</Text>
            
            {/* Progress Bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${plant.growthProgress}%` }]} />
            </View>

            {/* Water Bar */}
            <View style={styles.waterTrack}>
              <View style={[styles.waterFill, { width: `${plant.waterLevel}%` }]} />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton} onPress={onWater}>
                <Droplets color="#4fc3f7" size={20} />
              </TouchableOpacity>
              
              {plant.stage === 'HarvestReady' && (
                <TouchableOpacity style={[styles.actionButton, styles.harvestButton]} onPress={onHarvest}>
                  <Scissors color="#fff" size={20} />
                </TouchableOpacity>
              )}

              {plant.stage === 'Dead' && (
                <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={onClear}>
                  <Trash2 color="#fff" size={20} />
                </TouchableOpacity>
              )}
            </View>
          </>
        ) : (
          <TouchableOpacity style={styles.plantButton} onPress={onPlant}>
            <Text style={styles.plantButtonText}>Plant Seed</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '45%',
    backgroundColor: '#2c3e2c',
    borderRadius: 12,
    padding: 10,
    margin: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a6b4a',
  },
  graphicsContainer: {
    width: 120,
    height: 160,
    position: 'relative',
    alignItems: 'center',
  },
  plantWrapper: {
    position: 'absolute',
    bottom: 40,
    zIndex: 2,
  },
  potWrapper: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  plantName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stageText: {
    color: '#a5d6a7',
    fontSize: 12,
    marginBottom: 5,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#1b261b',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#81c784',
    borderRadius: 2,
  },
  waterTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#1b261b',
    borderRadius: 2,
    marginBottom: 10,
  },
  waterFill: {
    height: '100%',
    backgroundColor: '#4fc3f7',
    borderRadius: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#1b261b',
    borderRadius: 8,
  },
  harvestButton: {
    backgroundColor: '#f57c00',
  },
  clearButton: {
    backgroundColor: '#d32f2f',
  },
  plantButton: {
    backgroundColor: '#388e3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  plantButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
