import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export type RigType = 'sprinter' | 'skoolie' | 'truck' | 'van';

interface RigIconProps {
  type: RigType;
  size?: number;
  color?: string;
}

export function RigIcon({ type, size = 24, color = '#D9C5B2' }: RigIconProps) {
  const getIconName = (): React.ComponentProps<typeof Ionicons>['name'] => {
    switch (type) {
      case 'sprinter':
        return 'car-sport';
      case 'skoolie':
        return 'bus';
      case 'truck':
        return 'car';
      case 'van':
      default:
        return 'car-outline';
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name={getIconName()} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
