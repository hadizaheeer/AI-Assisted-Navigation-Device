import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const GOLD = "#FCA311";
const DARK_BG = "#0D1B2A";
const LIGHT_TEXT = "#E0E1DD";
const DARK_GRAY = "#333";

export default function ProfileScreen() {
  const router = useRouter();
  
  // Placeholder user info - can be replaced with actual auth later
  const userName = 'Hadi Zaheer';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Profile</Text>

        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={GOLD} />
          </View>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* Settings Navigation */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/system-settings')}
          accessibilityLabel="Navigate to System Settings"
          accessibilityRole="button"
        >
          <View style={styles.settingsButtonContent}>
            <Text style={styles.settingsButtonText}>System Settings</Text>
            <Ionicons name="chevron-forward" size={24} color={GOLD} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: LIGHT_TEXT,
  },
  userSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: DARK_GRAY,
    borderWidth: 2,
    borderColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: LIGHT_TEXT,
  },
  settingsButton: {
    backgroundColor: DARK_GRAY,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: GOLD,
  },
  settingsButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: LIGHT_TEXT,
  },
});

