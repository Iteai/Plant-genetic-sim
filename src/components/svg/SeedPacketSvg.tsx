import React from 'react';
import Svg, { Path, Rect, Defs, LinearGradient, Stop, Text as SvgText, G } from 'react-native-svg';
import { Species, Rarity } from '../../types';
import { Theme } from '../../theme/colors';

interface SeedPacketProps {
  species: Species;
  rarity: Rarity;
  width?: number;
  height?: number;
}

export const SeedPacketSvg: React.FC<SeedPacketProps> = ({ species, rarity, width = 60, height = 80 }) => {
  const rarityColor = Theme.rarity[rarity];
  
  const getSpeciesColor = () => {
    switch(species) {
      case 'Tomato': return '#E53935';
      case 'Chili': return '#FB8C00';
      case 'Basil': return '#43A047';
      case 'Radish': return '#D81B60';
      default: return '#757575';
    }
  };

  const speciesColor = getSpeciesColor();

  return (
    <Svg width={width} height={height} viewBox="0 0 60 80">
      <Defs>
        <LinearGradient id="packetBg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#F5F5F5" stopOpacity="1" />
          <Stop offset="1" stopColor="#E0E0E0" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="topFold" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="1" stopColor="#D6D6D6" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Main Packet Body */}
      <Rect x="5" y="10" width="50" height="65" rx="4" fill="url(#packetBg)" stroke="#BDBDBD" strokeWidth="1" />
      
      {/* Top Fold (Sealed part) */}
      <Path d="M 5 14 L 5 8 C 5 6, 7 4, 9 4 L 51 4 C 53 4, 55 6, 55 8 L 55 14 Z" fill="url(#topFold)" stroke="#BDBDBD" strokeWidth="1" />
      <Path d="M 5 14 L 55 14" stroke="#9E9E9E" strokeWidth="1" strokeDasharray="2,2" />

      {/* Species Color Banner */}
      <Rect x="5" y="45" width="50" height="30" rx="4" fill={speciesColor} opacity="0.8" />
      <Rect x="5" y="45" width="50" height="5" fill={speciesColor} />

      {/* Rarity Indicator (Diamond) */}
      <Path d="M 30 18 L 35 23 L 30 28 L 25 23 Z" fill={rarityColor} />

      {/* Graphic Placeholder based on species */}
      <G transform="translate(30, 35)">
        {species === 'Tomato' && <circle cx="0" cy="0" r="6" fill="#D32F2F" />}
        {species === 'Chili' && <Path d="M -3 -5 Q 5 5 -3 10 Q -6 5 -3 -5" fill="#E65100" />}
        {species === 'Basil' && <Path d="M 0 -6 C 6 -6, 8 2, 0 6 C -8 2, -6 -6, 0 -6" fill="#2E7D32" />}
        {species === 'Radish' && <circle cx="0" cy="0" r="5" fill="#C2185B" />}
      </G>
    </Svg>
  );
};
