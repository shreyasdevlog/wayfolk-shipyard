import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { RigIcon, RigType } from '@/components/chat/RigIcon';

interface Conversation {
  id: string;
  name: string;
  rigType: RigType;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

// Mock conversations - replace with real data from API
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Sky',
    rigType: 'sprinter',
    lastMessage: 'Perfect! Would love to meet up when we get there.',
    timestamp: new Date(Date.now() - 1800000),
    unread: true,
  },
  {
    id: '2',
    name: 'River',
    rigType: 'skoolie',
    lastMessage: 'Thanks for the tip! That campsite was amazing.',
    timestamp: new Date(Date.now() - 86400000),
    unread: false,
  },
  {
    id: '3',
    name: 'Atlas',
    rigType: 'truck',
    lastMessage: "I'll be in the area next week. Let's grab coffee!",
    timestamp: new Date(Date.now() - 172800000),
    unread: false,
  },
];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleConversationPress = (conversationId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/chat/${conversationId}`);
  };

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderConversation: ListRenderItem<Conversation> = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <RigIcon type={item.rigType} size={24} color="#FF7043" />
        {item.unread && <View style={styles.unreadBadge} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={[styles.name, item.unread && styles.nameUnread]}>
            {item.name}
          </Text>
          <Text style={[styles.timestamp, item.unread && styles.timestampUnread]}>
            {getTimeAgo(item.timestamp)}
          </Text>
        </View>
        <Text
          style={[styles.lastMessage, item.unread && styles.lastMessageUnread]}
          numberOfLines={2}
        >
          {item.lastMessage}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={item.unread ? '#D9C5B2' : 'rgba(217, 197, 178, 0.4)'}
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.iconContainer}>
        <Ionicons name="chatbubbles-outline" size={56} color="#D9C5B2" />
      </View>
      <Text style={styles.emptyTitle}>No Messages Yet</Text>
      <Text style={styles.emptySubtitle}>
        Connect with nearby nomads to start a conversation
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newMessageButton} activeOpacity={0.7}>
          <Ionicons name="create-outline" size={24} color="#FF7043" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_CONVERSATIONS}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          MOCK_CONVERSATIONS.length === 0
            ? styles.emptyContainer
            : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2B21',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#D9C5B2',
    letterSpacing: 0.5,
  },
  newMessageButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 112, 67, 0.1)',
  },
  listContainer: {
    paddingBottom: 90,
  },
  emptyContainer: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(217, 197, 178, 0.1)',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#253A2E',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF7043',
    borderWidth: 2,
    borderColor: '#1B2B21',
  },
  conversationContent: {
    flex: 1,
    gap: 4,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D9C5B2',
    letterSpacing: 0.2,
  },
  nameUnread: {
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(217, 197, 178, 0.5)',
  },
  timestampUnread: {
    color: '#FF7043',
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(217, 197, 178, 0.6)',
    lineHeight: 18,
  },
  lastMessageUnread: {
    fontWeight: '500',
    color: 'rgba(217, 197, 178, 0.8)',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#253A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#D9C5B2',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(217, 197, 178, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
