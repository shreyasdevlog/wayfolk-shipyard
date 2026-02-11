import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

interface MessageInputProps {
  onSend: (text: string) => void;
  onMediaPress?: () => void;
}

export function MessageInput({ onSend, onMediaPress }: MessageInputProps) {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    if (text.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSend(text.trim());
      setText('');
    }
  };

  const handleMediaPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onMediaPress?.();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom || 8 }]}>
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={handleMediaPress}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={32} color="#D9C5B2" />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="rgba(217, 197, 178, 0.4)"
            multiline
            maxLength={1000}
            returnKeyType="default"
            blurOnSubmit={false}
          />
        </View>

        {text.trim() ? (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            activeOpacity={0.7}
          >
            <Ionicons name="send" size={24} color="#FF7043" />
          </TouchableOpacity>
        ) : (
          <View style={styles.sendButtonPlaceholder} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: '#1B2B21',
    borderTopWidth: 1,
    borderTopColor: 'rgba(217, 197, 178, 0.15)',
    gap: 8,
  },
  mediaButton: {
    marginBottom: 4,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#253A2E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    maxHeight: 120,
  },
  input: {
    fontSize: 16,
    color: '#D9C5B2',
    lineHeight: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 112, 67, 0.1)',
  },
  sendButtonPlaceholder: {
    width: 44,
    height: 44,
  },
});
