import React, { useEffect } from 'react';
import Svg, { Path, Circle, G, Defs, RadialGradient, LinearGradient, Stop, Ellipse } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { GrowthStage, Species, Variety } from '../../types';

const AnimatedG = Animated.createAnimatedComponent(G);

interface PlantSpriteProps {
  stage: GrowthStage;
  species: Species;
  variety: Variety;
  health: number;
  width?: number;
  height?: number;
}

export const PlantSprite: React.FC<PlantSpriteProps> = ({ 
  stage, species, variety, health, width = 160, height = 160 
}) => {
  const isDead = stage === 'Dead' || health === 0;
  
  // Organic Wind Animation
  const sway = useSharedValue(0);
  const breathe = useSharedValue(1);

  useEffect(() => {
    if (!isDead) {
      sway.value = withRepeat(
        withSequence(
          withTiming(2, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          withTiming(-2, { duration: 3000, easing: Easing.inOut(Easing.sin) })
        ), -1, true
      );
      breathe.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.98, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ), -1, true
      );
    }
  }, [isDead]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: `${sway.value}deg` },
      { scaleY: breathe.value },
      { scaleX: breathe.value }
    ],
  }));

  // Premium Color Palettes
  const stemColor = isDead ? '#4E342E' : (variety === 'Thai' || variety === 'Purple' ? '#4A148C' : variety === 'Lemon' ? '#558B2F' : '#1B5E20');
  const leafBase = isDead ? '#6D4C41' : (variety === 'Purple' ? '#311B92' : variety === 'Lemon' ? '#8BC34A' : variety === 'Poblano' ? '#004D40' : '#2E7D32');
  const leafHighlight = isDead ? '#8D6E63' : (variety === 'Purple' ? '#512DA8' : variety === 'Lemon' ? '#AED581' : '#4CAF50');
  const leafShadow = isDead ? '#3E2723' : (variety === 'Purple' ? '#1A237E' : '#1B5E20');

  // --- PREMIUM LEAF GENERATOR ---
  const renderLeaf = (x: number, y: number, rotation: number, scale: number) => {
    let path = "";
    let veinPath = "";
    
    if (species === 'Tomato') {
      // Complex lobed leaf
      path = `M 0 0 C 15 -20 35 -15 40 -5 C 35 5 45 15 30 20 C 15 25 5 10 0 0`;
      veinPath = `M 0 0 Q 20 0 38 -2 M 10 0 Q 15 -8 20 -12 M 15 2 Q 20 10 25 14`;
    } else if (species === 'Basil') {
      // Cupped, elegant oval
      path = `M 0 0 C 15 -25 40 -20 45 0 C 40 20 15 25 0 0`;
      veinPath = `M 0 0 Q 25 0 42 0 M 10 0 Q 15 -10 25 -12 M 10 0 Q 15 10 25 12 M 20 0 Q 25 -8 32 -10 M 20 0 Q 25 8 32 10`;
    } else if (species === 'Chili') {
      // Sleek, lanceolate leaf
      path = `M 0 0 C 20 -15 40 -5 50 0 C 40 5 20 15 0 0`;
      veinPath = `M 0 0 Q 25 0 48 0 M 15 0 Q 25 -5 35 -5 M 15 0 Q 25 5 35 5`;
    } else {
      // Radish: Lyrate leaf
      path = `M 0 0 C 5 -20 20 -25 25 -10 C 35 -25 50 -15 45 5 C 50 25 35 30 25 15 C 20 30 5 25 0 0`;
      veinPath = `M 0 0 Q 25 5 42 5 M 15 2 Q 20 -10 30 -15 M 15 4 Q 20 15 30 20`;
    }

    return (
      <G x={x} y={y} rotation={rotation} scale={scale}>
        {/* Drop Shadow */}
        <Path d={path} fill="rgba(0,0,0,0.2)" transform="translate(2, 4)" />
        {/* Base Leaf */}
        <Path d={path} fill={leafBase} />
        {/* Inner Highlight for 3D Cupping */}
        <Path d={path} fill={leafHighlight} transform="scale(0.85) translate(2, 0)" opacity="0.8" />
        {/* Veins */}
        <Path d={veinPath} stroke={leafShadow} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      </G>
    );
  };

  // --- PREMIUM FRUIT GENERATOR ---
  const renderFruit = (x: number, y: number, scale: number) => {
    if (isDead || species === 'Basil') return null;

    return (
      <G x={x} y={y} scale={scale}>
        {/* Drop Shadow */}
        <Ellipse cx="0" cy="15" rx="10" ry="4" fill="rgba(0,0,0,0.3)" />

        {/* TOMATOES */}
        {variety === 'Cherry' && (
          <G>
            <Circle cx="-6" cy="0" r="7" fill="url(#cherryGrad)" />
            <Circle cx="6" cy="5" r="7" fill="url(#cherryGrad)" />
            <Circle cx="0" cy="-7" r="7" fill="url(#cherryGrad)" />
            {/* Specular Highlights */}
            <Circle cx="-8" cy="-2" r="2" fill="#FFFFFF" opacity="0.6" />
            <Circle cx="4" cy="3" r="2" fill="#FFFFFF" opacity="0.6" />
            <Circle cx="-2" cy="-9" r="2" fill="#FFFFFF" opacity="0.6" />
          </G>
        )}
        {variety === 'Roma' && (
          <G>
            <Ellipse cx="0" cy="0" rx="8" ry="14" fill="url(#romaGrad)" />
            <Ellipse cx="-3" cy="-4" rx="2" ry="4" fill="#FFFFFF" opacity="0.5" transform="rotate(-15)" />
          </G>
        )}
        {variety === 'Beefsteak' && (
          <G>
            <Path d="M -14 0 C -14 -12, -6 -16, 0 -10 C 6 -16, 14 -12, 14 0 C 14 12, 6 16, 0 10 C -6 16, -14 12, -14 0" fill="url(#beefGrad)" />
            <Path d="M -8 -4 C -6 -8, -2 -8, 0 -4" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
          </G>
        )}

        {/* CHILIES */}
        {variety === 'Jalapeno' && (
          <G>
            <Path d="M -5 0 Q 0 22 5 0 Z" fill="url(#jalapenoGrad)" />
            <Path d="M -2 2 Q 0 15 1 18" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
          </G>
        )}
        {variety === 'Habanero' && (
          <G>
            <Path d="M -8 0 C -12 12, 12 12, 8 0 C 5 -6, -5 -6, -8 0" fill="url(#habaneroGrad)" />
            <Circle cx="-3" cy="2" r="2" fill="#FFFFFF" opacity="0.6" />
          </G>
        )}

        {/* RADISHES */}
        {variety === 'Cherry Belle' && (
          <G>
            <Circle cx="0" cy="0" r="18" fill="url(#cherryBelleGrad)" />
            <Circle cx="-6" cy="-6" r="4" fill="#FFFFFF" opacity="0.4" />
          </G>
        )}
        
        {/* Stem connection */}
        {species !== 'Radish' && <Path d="M 0 -12 L 0 0" stroke={stemColor} strokeWidth="2.5" strokeLinecap="round" />}
        {/* Calyx (Little green leaves on top of fruit) */}
        {species !== 'Radish' && <Path d="M -4 -2 L 0 -6 L 4 -2 L 0 0 Z" fill={leafBase} />}
      </G>
    );
  };

  const renderPlant = () => {
    if (stage === 'Seed') return <Ellipse cx="80" cy="145" rx="5" ry="3" fill="#8D6E63" />;
    
    const isRadish = species === 'Radish';
    const stemHeight = isRadish ? 120 : (stage === 'Seedling' ? 90 : 40);
    const fruitScale = stage === 'HarvestReady' ? 1.4 : 0.9;

    return (
      <AnimatedG style={animatedStyle} originX={80} originY={150}>
        <Defs>
          {/* Premium 3D Gradients with offset focal points for realism */}
          <RadialGradient id="cherryGrad" cx="30%" cy="30%" r="70%" fx="20%" fy="20%">
            <Stop offset="0%" stopColor="#FF8A80" />
            <Stop offset="70%" stopColor="#D32F2F" />
            <Stop offset="100%" stopColor="#880E4F" />
          </RadialGradient>
          <RadialGradient id="romaGrad" cx="35%" cy="30%" r="70%" fx="25%" fy="25%">
            <Stop offset="0%" stopColor="#FF5252" />
            <Stop offset="80%" stopColor="#B71C1C" />
            <Stop offset="100%" stopColor="#4A0404" />
          </RadialGradient>
          <RadialGradient id="beefGrad" cx="30%" cy="20%" r="80%" fx="30%" fy="20%">
            <Stop offset="0%" stopColor="#FF5252" />
            <Stop offset="60%" stopColor="#C62828" />
            <Stop offset="100%" stopColor="#3E0000" />
          </RadialGradient>
          
          <LinearGradient id="jalapenoGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#81C784" />
            <Stop offset="40%" stopColor="#2E7D32" />
            <Stop offset="100%" stopColor="#1B5E20" />
          </LinearGradient>
          <RadialGradient id="habaneroGrad" cx="30%" cy="30%" r="70%" fx="20%" fy="20%">
            <Stop offset="0%" stopColor="#FFE082" />
            <Stop offset="50%" stopColor="#FF8F00" />
            <Stop offset="100%" stopColor="#E65100" />
          </RadialGradient>

          <RadialGradient id="cherryBelleGrad" cx="30%" cy="30%" r="70%" fx="25%" fy="25%">
            <Stop offset="0%" stopColor="#FF80AB" />
            <Stop offset="60%" stopColor="#D81B60" />
            <Stop offset="100%" stopColor="#880E4F" />
          </RadialGradient>
        </Defs>

        {/* Main Stem with 3D shading */}
        {!isRadish && (
          <G>
            <Path d={`M 80 150 Q 85 90 80 ${stemHeight}`} stroke="#1B5E20" strokeWidth="7" fill="none" strokeLinecap="round" />
            <Path d={`M 80 150 Q 85 90 80 ${stemHeight}`} stroke={stemColor} strokeWidth="5" fill="none" strokeLinecap="round" />
          </G>
        )}
        {isRadish && <Path d={`M 80 150 L 80 120`} stroke={stemColor} strokeWidth="6" fill="none" strokeLinecap="round" />}

        {/* Leaves */}
        {stage !== 'Seedling' && !isRadish && (
          <G>
            {renderLeaf(80, 110, -20, 0.9)}
            {renderLeaf(80, 95, 200, 1.0)}
            {renderLeaf(82, 75, -10, 1.2)}
            {renderLeaf(78, 60, 190, 1.1)}
            {stage !== 'Vegetative' && renderLeaf(80, 45, -35, 0.8)}
            {stage !== 'Vegetative' && renderLeaf(80, 45, 215, 0.8)}
          </G>
        )}
        {stage !== 'Seedling' && isRadish && (
          <G>
            {renderLeaf(80, 125, -45, 1.3)}
            {renderLeaf(80, 125, 225, 1.3)}
            {renderLeaf(80, 120, -85, 1.5)}
            {renderLeaf(80, 120, 265, 1.1)}
          </G>
        )}

        {/* Fruits / Roots */}
        {(stage === 'Fruiting' || stage === 'HarvestReady') && (
          <G>
            {isRadish ? (
              renderFruit(80, 135, fruitScale)
            ) : species !== 'Basil' ? (
              <G>
                {renderFruit(50, 90, fruitScale)}
                {renderFruit(110, 75, fruitScale)}
                {renderFruit(70, 50, fruitScale)}
              </G>
            ) : null}
          </G>
        )}
      </AnimatedG>
    );
  };

  return (
    <Svg width={width} height={height} viewBox="0 0 160 160">
      {renderPlant()}
    </Svg>
  );
};
