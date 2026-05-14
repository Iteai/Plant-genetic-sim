import React from 'react';
import Svg, { Path, Circle, G, Defs, RadialGradient, LinearGradient, Stop, Ellipse } from 'react-native-svg';
import { GrowthStage, Species, Variety } from '../../types';

interface PlantSpriteProps {
  stage: GrowthStage;
  species: Species;
  variety: Variety;
  health: number;
  width?: number;
  height?: number;
}

export const PlantSprite: React.FC<PlantSpriteProps> = ({ 
  stage, species, variety, health, width = 140, height = 140 
}) => {
  const isDead = stage === 'Dead' || health === 0;
  
  // Dynamic Colors based on Variety and Health
  const stemColor = isDead ? '#5D4037' : 
    (variety === 'Thai' || variety === 'Purple' ? '#6A1B9A' : 
     variety === 'Lemon' ? '#7CB342' : '#2E7D32');
     
  const leafColor = isDead ? '#8D6E63' : 
    (variety === 'Purple' ? '#4A148C' : 
     variety === 'Lemon' ? '#AED581' : 
     variety === 'Poblano' ? '#1B5E20' : 
     variety === 'Heirloom' ? '#388E3C' : '#4CAF50');

  const leafHighlight = isDead ? '#A1887F' :
    (variety === 'Purple' ? '#7B1FA2' : 
     variety === 'Lemon' ? '#C5E1A5' : '#81C784');

  // --- LEAF GENERATOR ---
  const renderLeaf = (x: number, y: number, rotation: number, scale: number) => {
    let path = "";
    if (species === 'Tomato') {
      // Jagged, compound-like leaf
      path = `M 0 0 C 10 -15 25 -10 30 -5 C 25 0 35 5 25 10 C 15 15 5 5 0 0`;
    } else if (species === 'Basil') {
      // Cupped, smooth oval leaf
      path = `M 0 0 C 10 -20 30 -15 35 0 C 30 15 10 20 0 0`;
    } else if (species === 'Chili') {
      // Pointed, sleek leaf
      path = `M 0 0 C 15 -10 30 -5 40 0 C 30 5 15 10 0 0`;
    } else {
      // Radish: Lobed leaf
      path = `M 0 0 C 5 -15 15 -20 20 -10 C 25 -20 35 -15 30 0 C 35 15 25 20 20 10 C 15 20 5 15 0 0`;
    }

    return (
      <G x={x} y={y} rotation={rotation} scale={scale}>
        <Path d={path} fill={leafColor} />
        {/* Leaf Vein / Highlight */}
        <Path d={`M 0 0 L ${species === 'Chili' ? '35' : '25'} 0`} stroke={leafHighlight} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </G>
    );
  };

  // --- FLOWER GENERATOR ---
  const renderFlower = (x: number, y: number, scale: number) => {
    if (isDead) return null;
    const petalColor = species === 'Tomato' ? '#FFEE58' : 
                       species === 'Chili' ? '#FFFFFF' : 
                       variety === 'Thai' || variety === 'Purple' ? '#CE93D8' : '#FCE4EC';
    const centerColor = species === 'Tomato' ? '#F57F17' : '#FFF59D';

    return (
      <G x={x} y={y} scale={scale}>
        <Circle cx="0" cy="-5" r="4" fill={petalColor} />
        <Circle cx="5" cy="-1" r="4" fill={petalColor} />
        <Circle cx="3" cy="5" r="4" fill={petalColor} />
        <Circle cx="-3" cy="5" r="4" fill={petalColor} />
        <Circle cx="-5" cy="-1" r="4" fill={petalColor} />
        <Circle cx="0" cy="0" r="3" fill={centerColor} />
      </G>
    );
  };

  // --- FRUIT / ROOT GENERATOR ---
  const renderFruit = (x: number, y: number, scale: number) => {
    if (isDead || species === 'Basil') return null; // Basil is harvested for leaves

    return (
      <G x={x} y={y} scale={scale}>
        {/* TOMATOES */}
        {variety === 'Cherry' && (
          <G>
            <Circle cx="-4" cy="0" r="5" fill="url(#cherryGrad)" />
            <Circle cx="4" cy="4" r="5" fill="url(#cherryGrad)" />
            <Circle cx="0" cy="-5" r="5" fill="url(#cherryGrad)" />
          </G>
        )}
        {variety === 'Roma' && <Ellipse cx="0" cy="0" rx="6" ry="10" fill="url(#romaGrad)" />}
        {variety === 'Beefsteak' && <Path d="M -10 0 C -10 -10, -4 -12, 0 -8 C 4 -12, 10 -10, 10 0 C 10 10, 4 12, 0 8 C -4 12, -10 10, -10 0" fill="url(#beefGrad)" />}
        {variety === 'Heirloom' && <Path d="M -12 0 C -12 -8, -5 -10, 0 -6 C 5 -10, 12 -8, 12 0 C 12 8, 5 10, 0 6 C -5 10, -12 8, -12 0" fill="url(#heirloomGrad)" />}
        {variety === 'San Marzano' && <Ellipse cx="0" cy="0" rx="5" ry="14" fill="url(#romaGrad)" />}

        {/* CHILIES */}
        {variety === 'Jalapeno' && <Path d="M -4 0 Q 0 18 4 0 Z" fill="url(#jalapenoGrad)" />}
        {variety === 'Habanero' && <Path d="M -6 0 C -10 10, 10 10, 6 0 C 4 -5, -4 -5, -6 0" fill="url(#habaneroGrad)" />}
        {variety === 'Cayenne' && <Path d="M -2 0 Q 8 20 -2 30 Q -6 20 -2 0" fill="url(#cayenneGrad)" />}
        {variety === 'Poblano' && <Path d="M -8 0 Q 0 20 8 0 Q 10 -5 -8 0" fill="url(#poblanoGrad)" />}
        {variety === 'Ghost Pepper' && <Path d="M -5 0 Q 6 12 -3 22 Q -10 12 -5 0" fill="url(#ghostGrad)" />}

        {/* RADISHES (Drawn at the base) */}
        {variety === 'Cherry Belle' && <Circle cx="0" cy="0" r="14" fill="url(#cherryBelleGrad)" />}
        {variety === 'French Breakfast' && <Path d="M -9 -5 L 9 -5 L 7 18 L -7 18 Z" fill="url(#frenchGrad)" />}
        {variety === 'Daikon' && <Path d="M -7 -5 L 7 -5 L 3 35 L -3 35 Z" fill="url(#daikonGrad)" stroke="#E0E0E0" strokeWidth="0.5" />}
        {variety === 'Black Spanish' && <Circle cx="0" cy="0" r="16" fill="url(#blackRadishGrad)" />}
        {variety === 'Watermelon' && <Circle cx="0" cy="0" r="15" fill="url(#watermelonGrad)" stroke="#E91E63" strokeWidth="2" />}
        
        {/* Stem connection for fruits */}
        {species !== 'Radish' && <Path d="M 0 -8 L 0 0" stroke={stemColor} strokeWidth="2" />}
      </G>
    );
  };

  const renderPlant = () => {
    if (stage === 'Seed') return <Ellipse cx="70" cy="130" rx="4" ry="2.5" fill="#D7CCC8" />;
    if (stage === 'Germination') {
      return (
        <G>
          <Path d="M 70 130 Q 65 115 70 110" stroke={stemColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {renderLeaf(70, 110, -30, 0.4)}
          {renderLeaf(70, 110, 210, 0.4)}
        </G>
      );
    }

    const isRadish = species === 'Radish';
    const stemHeight = isRadish ? 110 : (stage === 'Seedling' ? 80 : 40);
    const fruitScale = stage === 'HarvestReady' ? 1.3 : 0.8;

    return (
      <G>
        <Defs>
          {/* Fruit Gradients for 3D effect */}
          <RadialGradient id="cherryGrad" cx="30%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#FF8A80" />
            <Stop offset="100%" stopColor="#D32F2F" />
          </RadialGradient>
          <RadialGradient id="romaGrad" cx="30%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#FF5252" />
            <Stop offset="100%" stopColor="#B71C1C" />
          </RadialGradient>
          <RadialGradient id="beefGrad" cx="30%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#FF5252" />
            <Stop offset="100%" stopColor="#C62828" />
          </RadialGradient>
          <RadialGradient id="heirloomGrad" cx="30%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#AB47BC" />
            <Stop offset="100%" stopColor="#4A148C" />
          </RadialGradient>
          
          <LinearGradient id="jalapenoGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#4CAF50" />
            <Stop offset="100%" stopColor="#1B5E20" />
          </LinearGradient>
          <RadialGradient id="habaneroGrad" cx="30%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#FFB74D" />
            <Stop offset="100%" stopColor="#E65100" />
          </RadialGradient>
          <LinearGradient id="cayenneGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FF5252" />
            <Stop offset="100%" stopColor="#B71C1C" />
          </LinearGradient>
          <LinearGradient id="poblanoGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#2E7D32" />
            <Stop offset="100%" stopColor="#000000" />
          </LinearGradient>
          <RadialGradient id="ghostGrad" cx="30%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#FF1744" />
            <Stop offset="100%" stopColor="#880E4F" />
          </RadialGradient>

          <RadialGradient id="cherryBelleGrad" cx="30%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#FF4081" />
            <Stop offset="100%" stopColor="#C2185B" />
          </RadialGradient>
          <LinearGradient id="frenchGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#E91E63" />
            <Stop offset="60%" stopColor="#E91E63" />
            <Stop offset="100%" stopColor="#FFFFFF" />
          </LinearGradient>
          <LinearGradient id="daikonGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F5F5F5" />
          </LinearGradient>
          <RadialGradient id="blackRadishGrad" cx="30%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#757575" />
            <Stop offset="100%" stopColor="#212121" />
          </RadialGradient>
          <RadialGradient id="watermelonGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#AED581" />
            <Stop offset="100%" stopColor="#7CB342" />
          </RadialGradient>
        </Defs>

        {/* Main Stem */}
        {!isRadish && <Path d={`M 70 130 Q 75 80 70 ${stemHeight}`} stroke={stemColor} strokeWidth="5" fill="none" strokeLinecap="round" />}
        {isRadish && <Path d={`M 70 130 L 70 110`} stroke={stemColor} strokeWidth="4" fill="none" />}

        {/* Leaves */}
        {stage !== 'Seedling' && !isRadish && (
          <G>
            {renderLeaf(70, 100, -25, 0.8)}
            {renderLeaf(70, 85, 205, 0.9)}
            {renderLeaf(72, 65, -15, 1.1)}
            {renderLeaf(68, 50, 195, 1.0)}
            {stage !== 'Vegetative' && renderLeaf(70, 40, -45, 0.7)}
            {stage !== 'Vegetative' && renderLeaf(70, 40, 225, 0.7)}
          </G>
        )}
        {stage !== 'Seedling' && isRadish && (
          <G>
            {renderLeaf(70, 115, -50, 1.2)}
            {renderLeaf(70, 115, 230, 1.2)}
            {renderLeaf(70, 110, -90, 1.4)}
            {renderLeaf(70, 110, 270, 1.0)}
          </G>
        )}

        {/* Flowers */}
        {stage === 'Flowering' && !isRadish && (
          <G>
            {renderFlower(50, 75, 1)}
            {renderFlower(90, 60, 1)}
            {renderFlower(65, 40, 1)}
          </G>
        )}

        {/* Fruits / Roots */}
        {(stage === 'Fruiting' || stage === 'HarvestReady') && (
          <G>
            {isRadish ? (
              renderFruit(70, 125, fruitScale)
            ) : species !== 'Basil' ? (
              <G>
                {renderFruit(45, 80, fruitScale)}
                {renderFruit(95, 65, fruitScale)}
                {renderFruit(60, 45, fruitScale)}
              </G>
            ) : null}
          </G>
        )}
      </G>
    );
  };

  return (
    <Svg width={width} height={height} viewBox="0 0 140 140">
      {renderPlant()}
    </Svg>
  );
};
