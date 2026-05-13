import React from 'react';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface PotSvgProps {
  width?: number;
  height?: number;
  waterLevel: number; // 0 to 100
}

export const PotSvg: React.FC<PotSvgProps> = ({ width = 100, height = 100, waterLevel }) => {
  const soilColor = waterLevel > 50 ? '#3e2723' : waterLevel > 20 ? '#5d4037' : '#8d6e63';

  return (
    <Svg width={width} height={height} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#d84315" stopOpacity="1" />
          <Stop offset="1" stopColor="#bf360c" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      
      {/* Back lip of the pot */}
      <Path d="M 15 30 Q 50 40 85 30 L 80 35 Q 50 45 20 35 Z" fill="#8a2809" />
      
      {/* Soil */}
      <Path d="M 18 32 Q 50 42 82 32 Q 50 22 18 32 Z" fill={soilColor} />
      
      {/* Main Pot Body */}
      <Path d="M 15 30 L 25 90 Q 50 95 75 90 L 85 30 Q 50 45 15 30 Z" fill="url(#potGrad)" />
      
      {/* Front lip of the pot */}
      <Path d="M 10 25 L 90 25 L 85 35 L 15 35 Z" fill="#e64a19" />
    </Svg>
  );
};
