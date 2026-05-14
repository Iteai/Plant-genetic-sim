import React from 'react';
import Svg, { Path, Defs, LinearGradient, RadialGradient, Stop, Ellipse, G } from 'react-native-svg';

interface PotSvgProps {
  width?: number;
  height?: number;
  waterLevel: number;
}

export const PotSvg: React.FC<PotSvgProps> = ({ width = 120, height = 120, waterLevel }) => {
  // Soil gets darker when wet
  const soilCenter = waterLevel > 50 ? '#1A0F0A' : waterLevel > 20 ? '#2D1A11' : '#4A3022';
  const soilEdge = waterLevel > 50 ? '#0D0705' : waterLevel > 20 ? '#1A0F0A' : '#2D1A11';

  return (
    <Svg width={width} height={height} viewBox="0 0 100 100">
      <Defs>
        {/* 3D Terracotta Body Gradient */}
        <LinearGradient id="potBody" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#8A2810" stopOpacity="1" />
          <Stop offset="0.15" stopColor="#B03A1E" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#D85A38" stopOpacity="1" />
          <Stop offset="0.85" stopColor="#B03A1E" stopOpacity="1" />
          <Stop offset="1" stopColor="#5C1A0A" stopOpacity="1" />
        </LinearGradient>
        
        {/* Rim Gradient with Highlight */}
        <LinearGradient id="potRim" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#9E3015" stopOpacity="1" />
          <Stop offset="0.2" stopColor="#C94B2A" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#E66A45" stopOpacity="1" />
          <Stop offset="0.8" stopColor="#C94B2A" stopOpacity="1" />
          <Stop offset="1" stopColor="#6B1D0A" stopOpacity="1" />
        </LinearGradient>

        {/* Soil Depth Gradient */}
        <RadialGradient id="soilGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <Stop offset="0%" stopColor={soilCenter} stopOpacity="1" />
          <Stop offset="100%" stopColor={soilEdge} stopOpacity="1" />
        </RadialGradient>

        {/* Drop Shadow for Rim */}
        <LinearGradient id="rimShadow" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#3A0F04" stopOpacity="0.6" />
          <Stop offset="1" stopColor="#3A0F04" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      
      <G transform="translate(0, 5)">
        {/* Saucer Base */}
        <Ellipse cx="50" cy="88" rx="38" ry="10" fill="#4A1408" />
        <Ellipse cx="50" cy="86" rx="36" ry="8" fill="#7A220D" />
        <Ellipse cx="50" cy="85" rx="34" ry="7" fill="#3A0F04" />

        {/* Back inner rim (Inside the pot) */}
        <Ellipse cx="50" cy="30" rx="42" ry="14" fill="#4A1408" />
        
        {/* Soil Surface */}
        <Ellipse cx="50" cy="32" rx="38" ry="11" fill="url(#soilGrad)" />
        
        {/* Main Pot Body */}
        <Path d="M 8 30 C 8 30, 22 85, 28 85 L 72 85 C 78 85, 92 30, 92 30 Z" fill="url(#potBody)" />
        
        {/* Rim Shadow on Body */}
        <Path d="M 8 30 C 8 30, 22 45, 50 45 C 78 45, 92 30, 92 30 L 90 35 C 90 35, 75 50, 50 50 C 25 50, 10 35, 10 35 Z" fill="url(#rimShadow)" />

        {/* Front Rim (Thick 3D lip) */}
        <Path d="M 4 30 C 4 18, 96 18, 96 30 C 96 42, 4 42, 4 30 Z" fill="url(#potRim)" />
        
        {/* Inner Rim Shadow to give depth to the lip */}
        <Path d="M 8 30 C 8 20, 92 20, 92 30 C 92 32, 8 32, 8 30 Z" fill="#000000" opacity="0.15" />
      </G>
    </Svg>
  );
};
