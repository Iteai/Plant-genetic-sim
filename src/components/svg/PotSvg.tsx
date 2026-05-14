import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';

interface PotSvgProps {
  width?: number;
  height?: number;
  waterLevel: number;
}

export const PotSvg: React.FC<PotSvgProps> = ({ width = 100, height = 100, waterLevel }) => {
  const soilColor = waterLevel > 50 ? '#2d1a11' : waterLevel > 20 ? '#4a3022' : '#704f3d';

  return (
    <Svg width={width} height={height} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="potBody" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#b03a1e" stopOpacity="1" />
          <Stop offset="0.8" stopColor="#d85a38" stopOpacity="1" />
          <Stop offset="1" stopColor="#8a2810" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="potRim" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#c94b2a" stopOpacity="1" />
          <Stop offset="1" stopColor="#9e3015" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      
      {/* Saucer */}
      <Ellipse cx="50" cy="92" rx="35" ry="8" fill="#7a220d" />
      <Ellipse cx="50" cy="90" rx="33" ry="6" fill="#521506" />

      {/* Back inner rim */}
      <Ellipse cx="50" cy="35" rx="40" ry="12" fill="#6b1d0a" />
      
      {/* Soil */}
      <Ellipse cx="50" cy="36" rx="36" ry="10" fill={soilColor} />
      
      {/* Main Pot Body */}
      <Path d="M 10 35 C 10 35, 25 90, 30 90 L 70 90 C 75 90, 90 35, 90 35 Z" fill="url(#potBody)" />
      
      {/* Front Rim */}
      <Path d="M 5 35 C 5 25, 95 25, 95 35 C 95 45, 5 45, 5 35 Z" fill="url(#potRim)" />
    </Svg>
  );
};
