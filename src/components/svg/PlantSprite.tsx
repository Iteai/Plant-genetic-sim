import React, { useEffect, useMemo } from 'react';
import Svg, { Path, Circle, G, Defs, RadialGradient, LinearGradient, Stop, Ellipse, Rect } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { GrowthStage, Species, Variety, PhenotypeTraits } from '../../types';
import { calculatePhenotype } from '../../genetics/phenotype';
import { PlantGenetics } from '../../types';
import { getColorFromScore, getSizeMultiplier, getShapeRatio, getTextureDetails } from '../../genetics/phenotype';

const AnimatedG = Animated.createAnimatedComponent(G);

interface PlantSpriteProps {
  stage: GrowthStage;
  species: Species;
  variety: Variety;
  genetics: PlantGenetics;
  health: number;
  width?: number;
  height?: number;
}

export const PlantSprite: React.FC<PlantSpriteProps> = ({ 
  stage, species, variety, genetics, health, width = 160, height = 160 
}) => {
  const isDead = stage === 'Dead' || health === 0;
  
  // Calcola i tratti fenotipici dalla genetica
  const phenotype = useMemo(() => calculatePhenotype(genetics, species), [genetics, species]);
  
  // Animazione breathing
  const breathe = useSharedValue(1);

  useEffect(() => {
    if (!isDead) {
      breathe.value = withRepeat(
        withTiming(1.03, { 
          duration: 2500, 
          easing: Easing.inOut(Easing.ease) 
        }),
        -1, 
        true
      );
    }
  }, [isDead]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: breathe.value },
      { scaleX: breathe.value }
    ],
  }));

  // Colori derivati dal phenotype
  const leafColor = isDead ? '#6D4C41' : getColorFromScore(species, variety, phenotype.colorScore);
  const leafHighlight = isDead ? '#8D6E63' : (phenotype.colorScore > 3 ? '#FFE082' : '#A5D6A7');
  const stemColor = isDead ? '#4E342E' : (phenotype.colorScore > 3 ? '#8B4513' : '#1B5E20');
  
  // Dimensioni basate su sizeScore
  const sizeMultiplier = isDead ? 1 : getSizeMultiplier(phenotype.sizeScore);
  const shapeRatio = isDead ? { widthRatio: 1, heightRatio: 1 } : getShapeRatio(phenotype.shapeScore);
  const textureInfo = getTextureDetails(phenotype.textureScore);

  // --- GENERATORE DI FOGLIE CON VARIABILITÀ ---
  const renderLeaf = (x: number, y: number, rotation: number, scale: number) => {
    let basePath = "";
    let veinPath = "";
    
    if (species === 'Tomato') {
      basePath = `M 0 0 C 15 -20 35 -15 40 -5 C 35 5 45 15 30 20 C 15 25 5 10 0 0`;
      veinPath = `M 0 0 Q 20 0 38 -2 M 10 0 Q 15 -8 20 -12 M 15 2 Q 20 10 25 14`;
    } else if (species === 'Basil') {
      // Foglie più strette se Thai (shapeScore alto)
      const leafWidth = phenotype.shapeScore > 3 ? 35 : 45;
      basePath = `M 0 0 C 15 -25 ${leafWidth} -20 ${leafWidth} 0 C ${leafWidth - 5} 20 15 25 0 0`;
      veinPath = `M 0 0 Q 25 0 ${leafWidth - 3} 0 M 10 0 Q 15 -10 25 -12 M 10 0 Q 15 10 25 12`;
    } else if (species === 'Chili') {
      basePath = `M 0 0 C 20 -15 40 -5 50 0 C 40 5 20 15 0 0`;
      veinPath = `M 0 0 Q 25 0 48 0 M 15 0 Q 25 -5 35 -5 M 15 0 Q 25 5 35 5`;
    } else {
      // Radish: foglie frastagliate se texture alta
      if (textureInfo.wrinkles) {
        basePath = `M 0 0 C 5 -20 15 -25 20 -12 C 30 -25 45 -18 40 5 C 45 25 30 30 20 15 C 18 30 5 25 0 0 C -3 15 -10 10 0 0`;
      } else {
        basePath = `M 0 0 C 5 -20 20 -25 25 -10 C 35 -25 50 -15 45 5 C 50 25 35 30 25 15 C 20 30 5 25 0 0`;
      }
      veinPath = `M 0 0 Q 25 5 42 5 M 15 2 Q 20 -10 30 -15 M 15 4 Q 20 15 30 20`;
    }

    return (
      <G x={x} y={y} rotation={rotation} scale={scale * sizeMultiplier}>
        {/* Drop Shadow */}
        <Path d={basePath} fill="rgba(0,0,0,0.2)" transform="translate(2, 4)" />
        {/* Base Leaf */}
        <Path d={basePath} fill={leafColor} />
        {/* Inner Highlight */}
        <Path d={basePath} fill={leafHighlight} transform="scale(0.85) translate(2, 0)" opacity="0.7" />
        {/* Veins */}
        <Path d={veinPath} stroke={stemColor} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
      </G>
    );
  };

  // --- GENERATORE DI FRUTTI CON GENETICA VISIVA ---
  const renderFruit = (x: number, y: number, baseScale: number) => {
    if (isDead || species === 'Basil') return null;

    const scale = baseScale * sizeMultiplier;
    const fruitColor = getColorFromScore(species, variety, phenotype.colorScore);
    const w = shapeRatio.widthRatio;
    const h = shapeRatio.heightRatio;

    // Genera SVG del frutto basato su species e phenotype
    if (variety === 'Cherry' && species === 'Tomato') {
      return (
        <G x={x} y={y} scale={scale}>
          <Ellipse cx="0" cy="0" rx={8 * w} ry={8 * h} fill={fruitColor} opacity="0.9" />
          {textureInfo.roughness > 0 && (
            <>
              <Circle cx="-3" cy="-2" r="1" fill="rgba(0,0,0,0.3)" opacity={textureInfo.roughness * 0.2} />
              <Circle cx="3" cy="2" r="1" fill="rgba(0,0,0,0.3)" opacity={textureInfo.roughness * 0.2} />
            </>
          )}
          <Circle cx="-3" cy="-2" r="2" fill="#FFFFFF" opacity="0.5" />
          <Path d="M -2 -6 L 0 -8 L 2 -6 L 0 -4 Z" fill={stemColor} />
        </G>
      );
    }

    if (variety === 'Roma' && species === 'Tomato') {
      return (
        <G x={x} y={y} scale={scale}>
          <Ellipse cx="0" cy="0" rx={8 * w} ry={14 * h} fill={fruitColor} opacity="0.9" />
          {textureInfo.ribs && (
            <>
              <Path d="M -6 -5 Q 0 -8 6 -5" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" fill="none" />
              <Path d="M -6 5 Q 0 8 6 5" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" fill="none" />
            </>
          )}
          <Circle cx="-2" cy="-4" r="1.5" fill="#FFFFFF" opacity="0.4" />
          <Path d="M 0 -10 L 1 -12 L -1 -10 Z" fill={stemColor} />
        </G>
      );
    }

    if (variety === 'Jalapeno' && species === 'Chili') {
      const length = 22 * h;
      return (
        <G x={x} y={y} scale={scale}>
          <Path d={`M ${-5 * w} 0 Q 0 ${length} ${5 * w} 0 Z`} fill={fruitColor} opacity="0.9" />
          {textureInfo.roughness > 2 && (
            <>
              <Circle cx="-2" cy="5" r="0.5" fill="rgba(0,0,0,0.2)" />
              <Circle cx="2" cy="10" r="0.5" fill="rgba(0,0,0,0.2)" />
            </>
          )}
          <Path d={`M ${-2 * w} 2 Q 0 ${length - 5} ${1 * w} ${length - 2}`} stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.4" />
          <Path d="M 0 -8 L 1 -10 L -1 -8 Z" fill={stemColor} />
        </G>
      );
    }

    if (variety === 'Habanero' && species === 'Chili') {
      const width = 16 * w;
      const height = 12 * h;
      return (
        <G x={x} y={y} scale={scale}>
          <Path d={`M ${-width * 0.5} 0 C ${-width * 0.75} ${height * 0.75}, ${width * 0.75} ${height * 0.75}, ${width * 0.5} 0 C ${width * 0.31} ${-height * 0.5}, ${-width * 0.31} ${-height * 0.5}, ${-width * 0.5} 0`} fill={fruitColor} opacity="0.9" />
          {textureInfo.roughness > 2 && (
            <Circle cx="0" cy="3" r="1" fill="rgba(0,0,0,0.2)" />
          )}
          <Circle cx="-3" cy="1" r="1.5" fill="#FFFFFF" opacity="0.5" />
          <Path d="M 0 -10 L 1 -12 L -1 -10 Z" fill={stemColor} />
        </G>
      );
    }

    if (variety === 'Cherry Belle' && species === 'Radish') {
      return (
        <G x={x} y={y} scale={scale}>
          <Circle cx="0" cy="0" r={18 * w} fill={fruitColor} opacity="0.9" />
          {textureInfo.ribs && (
            <>
              <Path d="M -12 -8 Q 0 -15 12 -8" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
              <Path d="M -12 8 Q 0 15 12 8" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
            </>
          )}
          <Circle cx="-6" cy="-6" r="3" fill="#FFFFFF" opacity="0.4" />
        </G>
      );
    }

    // Default fruit render
    return (
      <G x={x} y={y} scale={scale}>
        <Ellipse cx="0" cy="0" rx={10 * w} ry={10 * h} fill={fruitColor} opacity="0.9" />
        <Circle cx="-3" cy="-3" r="2" fill="#FFFFFF" opacity="0.4" />
        <Path d="M 0 -8 L 0.5 -10 L -0.5 -8 Z" fill={stemColor} />
      </G>
    );
  };

  const renderPlant = () => {
    if (stage === 'Seed') return <Ellipse cx="80" cy="145" rx="5" ry="3" fill="#8D6E63" />;
    
    const isRadish = species === 'Radish';
    const stemHeight = 
      stage === 'Germination' ? 110 : 
      stage === 'Seedling' ? 100 : 
      isRadish ? 120 : 
      40;
    
    const fruitScale = stage === 'HarvestReady' ? 1.4 : 0.9;

    return (
      <AnimatedG style={animatedStyle} originX={80} originY={150}>
        <Defs>
          {/* Dynamic gradients based on phenotype */}
          <RadialGradient id="fruitGrad" cx="30%" cy="30%" r="70%">
            <Stop offset="0%" stopColor={getColorFromScore(species, variety, phenotype.colorScore)} stopOpacity="0.9" />
            <Stop offset="70%" stopColor={getColorFromScore(species, variety, Math.max(1, phenotype.colorScore - 1))} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={getColorFromScore(species, variety, Math.max(1, phenotype.colorScore - 2))} stopOpacity="0.7" />
          </RadialGradient>
        </Defs>

        {/* Main Stem */}
        {!isRadish && (
          <G>
            <Path d={`M 80 150 Q 85 90 80 ${stemHeight}`} stroke="#1B5E20" strokeWidth={7 * (phenotype.sizeScore / 3)} fill="none" strokeLinecap="round" />
            <Path d={`M 80 150 Q 85 90 80 ${stemHeight}`} stroke={stemColor} strokeWidth={5 * (phenotype.sizeScore / 3)} fill="none" strokeLinecap="round" />
          </G>
        )}
        {isRadish && <Path d={`M 80 150 L 80 120`} stroke={stemColor} strokeWidth={6 * (phenotype.sizeScore / 3)} fill="none" strokeLinecap="round" />}

        {/* Leaves */}
        {stage === 'Germination' && (
          <G>
            {renderLeaf(80, 125, -20, 0.5)}
            {renderLeaf(80, 125, 200, 0.5)}
          </G>
        )}
        {stage !== 'Seedling' && stage !== 'Germination' && !isRadish && (
          <G>
            {renderLeaf(80, 110, -20, 0.9)}
            {renderLeaf(80, 95, 200, 1.0)}
            {renderLeaf(82, 75, -10, 1.2)}
            {renderLeaf(78, 60, 190, 1.1)}
            {stage !== 'Vegetative' && renderLeaf(80, 45, -35, 0.8)}
            {stage !== 'Vegetative' && renderLeaf(80, 45, 215, 0.8)}
          </G>
        )}
        {stage === 'Seedling' && !isRadish && (
          <G>
            {renderLeaf(80, 110, -20, 0.6)}
            {renderLeaf(80, 110, 200, 0.6)}
          </G>
        )}
        {stage !== 'Seedling' && stage !== 'Germination' && isRadish && (
          <G>
            {renderLeaf(80, 125, -45, 1.3)}
            {renderLeaf(80, 125, 225, 1.3)}
            {renderLeaf(80, 120, -85, 1.5)}
            {renderLeaf(80, 120, 265, 1.1)}
          </G>
        )}

        {/* Fruits */}
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
