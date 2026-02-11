import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'recipient';
  timestamp: Date;
}

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.recipientContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.recipientBubble]}>
        {/* Bubble tail */}
        <View style={[
          styles.tail,
          isUser ? styles.userTail : styles.recipientTail
        ]} />
        <Text style={[styles.text, isUser ? styles.userText : styles.recipientText]}>
          {message.text}
        </Text>
        <Text style={[styles.time, isUser ? styles.userTime : styles.recipientTime]}>
          {message.timestamp.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  recipientContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: 'relative',
  },
  userBubble: {
    backgroundColor: '#FF7043',
  },
  recipientBubble: {
    backgroundColor: '#D9C5B2',
  },
  tail: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  userTail: {
    right: -6,
    bottom: 8,
    borderLeftWidth: 8,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 0,
    borderLeftColor: '#FF7043',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  recipientTail: {
    left: -6,
    bottom: 8,
    borderLeftWidth: 0,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderBottomWidth: 0,
    borderLeftColor: 'transparent',
    borderRightColor: '#D9C5B2',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  userText: {
    color: '#FFFFFF',
  },
  recipientText: {
    color: '#1B2B21',
  },
  time: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '400',
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  recipientTime: {
    color: 'rgba(27, 43, 33, 0.6)',
  },
});
