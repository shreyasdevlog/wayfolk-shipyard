import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ListRenderItem,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { ChatBubble, Message } from '@/components/chat/ChatBubble';
import { MessageInput } from '@/components/chat/MessageInput';
import { ContextBar } from '@/components/chat/ContextBar';
import { DateSeparator } from '@/components/chat/DateSeparator';
import { RigIcon, RigType } from '@/components/chat/RigIcon';

// Extended message type with date info for grouping
interface MessageWithDate extends Message {
  dateGroup: string;
}

// Mock user data - in production, this would come from your API/database
interface ChatUser {
  id: string;
  name: string;
  rigType: RigType;
  sharedDestination?: string;
}

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const flatListRef = useRef<FlatList>(null);

  // Mock chat user data - replace with real data from API
  const [chatUser] = useState<ChatUser>({
    id: id || '1',
    name: 'Sky',
    rigType: 'sprinter',
    sharedDestination: 'Yellowstone NP',
  });

  // Mock messages - replace with real data from API/database
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! I saw you're also heading to Yellowstone. Have you been there before?",
      sender: 'recipient',
      timestamp: new Date(Date.now() - 86400000), // Yesterday
    },
    {
      id: '2',
      text: "Yes! It's amazing this time of year. The wildlife viewing is incredible.",
      sender: 'user',
      timestamp: new Date(Date.now() - 86300000),
    },
    {
      id: '3',
      text: 'That sounds awesome! Any spot recommendations for parking overnight?',
      sender: 'recipient',
      timestamp: new Date(Date.now() - 86200000),
    },
    {
      id: '4',
      text: "I usually stay at the north entrance area. There's a great dispersed camping spot with amazing views.",
      sender: 'user',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: '5',
      text: 'Perfect! Would love to meet up when we get there. Maybe we can explore together?',
      sender: 'recipient',
      timestamp: new Date(Date.now() - 1800000), // 30 min ago
    },
  ]);

  // Group messages by date
  const messagesWithDates: MessageWithDate[] = messages.map((msg) => ({
    ...msg,
    dateGroup: msg.timestamp.toDateString(),
  }));

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // TODO: Send message to backend/AI service
    // This is where you would integrate Newell AI for smart replies or image analysis
  };

  const handleMediaPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Share Media',
      'Choose what to share',
      [
        { text: 'Photo Library', onPress: () => console.log('Photo Library') },
        { text: 'Camera', onPress: () => console.log('Camera') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
    // TODO: Implement image picker and sharing
    // Future: Use Newell AI for image analysis of van builds or locations
  };

  const handleViewProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to user profile
    Alert.alert('View Profile', `Navigate to ${chatUser.name}'s profile`);
  };

  const renderItem: ListRenderItem<MessageWithDate> = ({ item, index }) => {
    const prevMessage = index > 0 ? messagesWithDates[index - 1] : null;
    const showDateSeparator = !prevMessage || prevMessage.dateGroup !== item.dateGroup;

    return (
      <View>
        {showDateSeparator && <DateSeparator date={item.timestamp} />}
        <ChatBubble message={item} />
      </View>
    );
  };

  // Auto-scroll to bottom on mount
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1B2B21',
          },
          headerShadowVisible: false,
          headerTintColor: '#D9C5B2',
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <RigIcon type={chatUser.rigType} size={20} color="#FF7043" />
              <Text style={styles.headerTitle}>{chatUser.name}</Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleViewProfile}
              style={styles.viewProfileButton}
              activeOpacity={0.7}
            >
              <Text style={styles.viewProfileText}>View Profile</Text>
              <Ionicons name="person-circle-outline" size={20} color="#FF7043" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Shared Destination Context Bar */}
      {chatUser.sharedDestination && (
        <ContextBar destination={chatUser.sharedDestination} />
      )}

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messagesWithDates}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Message Input */}
      <MessageInput onSend={handleSendMessage} onMediaPress={handleMediaPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2B21',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D9C5B2',
    letterSpacing: 0.3,
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 112, 67, 0.1)',
    borderRadius: 16,
    marginRight: 8,
  },
  viewProfileText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF7043',
  },
  messageList: {
    paddingTop: 12,
    paddingBottom: 20,
  },
});
