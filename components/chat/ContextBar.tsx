import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ContextBarProps {
  destination: string;
}

export function ContextBar({ destination }: ContextBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="location" size={14} color="#FF7043" />
      <Text style={styles.text}>Both heading toward: {destination}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 58, 46, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(217, 197, 178, 0.15)',
    gap: 8,
  },
  text: {
    fontSize: 13,
    color: '#D9C5B2',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
