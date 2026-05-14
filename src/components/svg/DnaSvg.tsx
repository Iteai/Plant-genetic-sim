import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

export const DnaSvg: React.FC<{ width?: number; height?: number; color?: string }> = ({ 
  width = 40, height = 40, color = '#18FFFF' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 100">
      <G stroke={color} strokeWidth="4" fill="none" strokeLinecap="round">
        {/* Left Strand */}
        <Path d="M 30 10 Q 10 30 30 50 T 30 90" />
        {/* Right Strand */}
        <Path d="M 70 10 Q 90 30 70 50 T 70 90" />
        {/* Base Pairs */}
        <Path d="M 35 20 L 65 20" opacity="0.6" />
        <Path d="M 22 35 L 78 35" opacity="0.6" />
        <Path d="M 35 50 L 65 50" opacity="0.6" />
        <Path d="M 22 65 L 78 65" opacity="0.6" />
        <Path d="M 35 80 L 65 80" opacity="0.6" />
        
        {/* Glowing Nodes */}
        <Circle cx="35" cy="20" r="3" fill={color} />
        <Circle cx="65" cy="20" r="3" fill={color} />
        <Circle cx="22" cy="35" r="3" fill={color} />
        <Circle cx="78" cy="35" r="3" fill={color} />
        <Circle cx="35" cy="50" r="3" fill={color} />
        <Circle cx="65" cy="50" r="3" fill={color} />
      </G>
    </Svg>
  );
};
