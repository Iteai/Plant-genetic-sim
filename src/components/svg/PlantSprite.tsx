import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { GrowthStage, Species, PlantGenetics } from '../../types';
import { getPhenotypeColor } from '../../genetics/engine';

interface PlantSpriteProps {
  stage: GrowthStage;
  species: Species;
  genetics: PlantGenetics;
  health: number;
  width?: number;
  height?: number;
}

export const PlantSprite: React.FC<PlantSpriteProps> = ({ 
  stage, 
  species, 
  genetics, 
  health,
  width = 100, 
  height = 100 
}) => {
  const fruitColor = getPhenotypeColor(species, genetics.color);
  const isDead = stage === 'Dead' || health === 0;
  const stemColor = isDead ? '#8d6e63' : '#2e7d32';
  const leafColor = isDead ? '#a1887f' : '#4caf50';

  const renderStage = () => {
    switch (stage) {
      case 'Seed':
        return <Circle cx="50" cy="90" r="3" fill="#5d4037" />;
      
      case 'Germination':
        return (
          <G>
            <Path d="M 50 90 Q 45 80 50 75" stroke={stemColor} strokeWidth="2" fill="none" />
            <Circle cx="50" cy="75" r="2" fill={leafColor} />
          </G>
        );
      
      case 'Seedling':
        return (
          <G>
            <Path d="M 50 90 L 50 60" stroke={stemColor} strokeWidth="3" fill="none" />
            <Path d="M 50 75 Q 35 70 40 60 Q 45 65 50 75" fill={leafColor} />
            <Path d="M 50 70 Q 65 65 60 55 Q 55 60 50 70" fill={leafColor} />
          </G>
        );
      
      case 'Vegetative':
      case 'Flowering':
        return (
          <G>
            <Path d="M 50 90 L 50 30" stroke={stemColor} strokeWidth="4" fill="none" />
            {/* Leaves */}
            <Path d="M 50 70 Q 20 60 30 40 Q 40 50 50 70" fill={leafColor} />
            <Path d="M 50 60 Q 80 50 70 30 Q 60 40 50 60" fill={leafColor} />
            <Path d="M 50 45 Q 25 35 35 20 Q 45 30 50 45" fill={leafColor} />
            
            {/* Flowers */}
            {stage === 'Flowering' && !isDead && (
              <G>
                <Circle cx="35" cy="45" r="4" fill="#fff9c4" />
                <Circle cx="65" cy="35" r="4" fill="#fff9c4" />
                <Circle cx="50" cy="25" r="4" fill="#fff9c4" />
              </G>
            )}
          </G>
        );
      
      case 'Fruiting':
      case 'HarvestReady':
        return (
          <G>
            <Path d="M 50 90 L 50 30" stroke={stemColor} strokeWidth="4" fill="none" />
            <Path d="M 50 70 Q 20 60 30 40 Q 40 50 50 70" fill={leafColor} />
            <Path d="M 50 60 Q 80 50 70 30 Q 60 40 50 60" fill={leafColor} />
            
            {/* Fruits */}
            {!isDead && (
              <G>
                <Circle cx="35" cy="45" r={stage === 'HarvestReady' ? 8 : 4} fill={fruitColor} />
                <Circle cx="65" cy="35" r={stage === 'HarvestReady' ? 8 : 4} fill={fruitColor} />
                <Circle cx="50" cy="25" r={stage === 'HarvestReady' ? 8 : 4} fill={fruitColor} />
              </G>
            )}
          </G>
        );
        
      case 'Dead':
        return (
          <G>
            <Path d="M 50 90 L 45 60 L 55 40" stroke={stemColor} strokeWidth="3" fill="none" />
            <Path d="M 45 60 Q 30 65 35 75" stroke={stemColor} strokeWidth="2" fill="none" />
          </G>
        );
        
      default:
        return null;
    }
  };

  return (
    <Svg width={width} height={height} viewBox="0 0 100 100">
      {renderStage()}
    </Svg>
  );
};
