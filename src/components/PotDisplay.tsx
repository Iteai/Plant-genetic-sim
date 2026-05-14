import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Pot } from '../types';
import { PotSvg } from './svg/PotSvg';
import { PlantSprite } from './svg/PlantSprite';
import { Droplets, Scissors, Trash2, Plus } from 'lucide-react-native';
import { Theme } from '../theme/colors';

interface PotDisplayProps {
  pot: Pot;
  onWater: () => void;
  onHarvest: () => void;
  onClear: () => void;
  onPlant: () => void;
}

export const PotDisplay: React.FC<PotDisplayProps> = ({ 
  pot, onWater, onHarvest, onClear, onPlant 
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
              variety={plant.variety}
              health={plant.health}
              width={140} 
              height={140} 
            />
          </View>
        )}
        <View style={styles.potWrapper}>
          <PotSvg width={110} height={110} waterLevel={plant ? plant.waterLevel : 0} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        {plant ? (
          <>
            <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
            <Text style={styles.stageText}>{plant.stage}</Text>
            
            {/* Growth Progress Bar */}
            <View style={styles.barTrack}>
              <View style={[styles.growthFill, { width: `${plant.growthProgress}%` }]} />
            </View>

            {/* Water Level Bar */}
            <View style={styles.barTrack}>
              <View style={[styles.waterFill, { width: `${plant.waterLevel}%` }]} />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionButton, styles.waterBtn]} onPress={onWater}>
                <Droplets color="#FFF" size={18} />
              </TouchableOpacity>
              
              {plant.stage === 'HarvestReady' && (
                <TouchableOpacity style={[styles.actionButton, styles.harvestBtn]} onPress={onHarvest}>
                  <Scissors color="#FFF" size={18} />
                </TouchableOpacity>
              )}

              {plant.stage === 'Dead' && (
                <TouchableOpacity style={[styles.actionButton, styles.clearBtn]} onPress={onClear}>
                  <Trash2 color="#FFF" size={18} />
                </TouchableOpacity>
              )}
            </View>
          </>
        ) : (
          <TouchableOpacity style={styles.emptyPotButton} onPress={onPlant}>
            <Plus color={Theme.primary} size={24} />
            <Text style={styles.emptyPotText}>Plant Seed</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '47%',
    backgroundColor: Theme.surface,
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.surfaceLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  graphicsContainer: {
    width: 140,
    height: 180,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  plantWrapper: {
    position: 'absolute',
    bottom: 45,
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
    marginTop: 12,
  },
  plantName: {
    color: Theme.text,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  stageText: {
    color: Theme.textMuted,
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  barTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Theme.background,
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  growthFill: {
    height: '100%',
    backgroundColor: Theme.primary,
    borderRadius: 3,
  },
  waterFill: {
    height: '100%',
    backgroundColor: '#29B6F6',
    borderRadius: 3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    marginTop: 8,
  },
  actionButton: {
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterBtn: { backgroundColor: '#0288D1' },
  harvestBtn: { backgroundColor: Theme.secondary },
  clearBtn: { backgroundColor: Theme.danger },
  emptyPotButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  emptyPotText: {
    color: Theme.primary,
    fontWeight: 'bold',
    fontSize: 14,
  }
});
