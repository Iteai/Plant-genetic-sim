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
              width={160} 
              height={160} 
            />
          </View>
        )}
        <View style={styles.potWrapper}>
          <PotSvg width={130} height={130} waterLevel={plant ? plant.waterLevel : 0} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        {plant ? (
          <>
            <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
            <Text style={styles.stageText}>{plant.stage}</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>GROWTH</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.growthFill, { width: `${plant.growthProgress}%` }]} />
                </View>
              </View>
              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>WATER</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.waterFill, { width: `${plant.waterLevel}%` }]} />
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionButton, styles.waterBtn]} onPress={onWater}>
                <Droplets color="#FFF" size={20} />
              </TouchableOpacity>
              
              {plant.stage === 'HarvestReady' && (
                <TouchableOpacity style={[styles.actionButton, styles.harvestBtn]} onPress={onHarvest}>
                  <Scissors color="#FFF" size={20} />
                </TouchableOpacity>
              )}

              {plant.stage === 'Dead' && (
                <TouchableOpacity style={[styles.actionButton, styles.clearBtn]} onPress={onClear}>
                  <Trash2 color="#FFF" size={20} />
                </TouchableOpacity>
              )}
            </View>
          </>
        ) : (
          <TouchableOpacity style={styles.emptyPotButton} onPress={onPlant}>
            <View style={styles.emptyIconWrapper}>
              <Plus color={Theme.primary} size={28} />
            </View>
            <Text style={styles.emptyPotText}>Plant Seed</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: '#111D16', // Deep premium dark green
    borderRadius: 24,
    padding: 16,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  graphicsContainer: {
    width: 160,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  plantWrapper: {
    position: 'absolute',
    bottom: 55,
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
    marginTop: 16,
  },
  plantName: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  stageText: {
    color: Theme.primary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  statColumn: {
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 1,
  },
  barTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  growthFill: {
    height: '100%',
    backgroundColor: Theme.primary,
    borderRadius: 3,
  },
  waterFill: {
    height: '100%',
    backgroundColor: '#00B0FF',
    borderRadius: 3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  waterBtn: { backgroundColor: '#0288D1' },
  harvestBtn: { backgroundColor: Theme.secondary },
  clearBtn: { backgroundColor: Theme.danger },
  emptyPotButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  emptyIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  emptyPotText: {
    color: Theme.primary,
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  }
});
