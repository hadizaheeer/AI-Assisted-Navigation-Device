import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useSettings } from '../contexts/SettingsContext';
import { Ionicons } from '@expo/vector-icons';

const GOLD = "#FCA311";
const DARK_BG = "#0D1B2A";
const LIGHT_TEXT = "#E0E1DD";
const DARK_GRAY = "#333";
const SECONDARY_TEXT = "#9BA1A6";

export default function SystemSettingsScreen() {
  const router = useRouter();
  const { settings, updateSetting } = useSettings();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color={GOLD} />
          </TouchableOpacity>
          <Text style={styles.title}>System Settings</Text>
        </View>

        {/* Assistive Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assistive Features</Text>

          {/* Voice Assist Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Voice Assist</Text>
              <Text style={styles.settingDescription}>
                Enables voice commands and voice feedback for navigation
              </Text>
            </View>
            <Switch
              value={settings.voiceAssistEnabled}
              onValueChange={(value) => updateSetting('voiceAssistEnabled', value)}
              accessibilityLabel="Voice Assist toggle"
              accessibilityHint="Turns voice commands and feedback on or off"
              trackColor={{ false: DARK_GRAY, true: GOLD }}
              thumbColor={settings.voiceAssistEnabled ? '#fff' : '#f4f3f4'}
              // Future: Check settings.voiceAssistEnabled before processing STT input
            />
          </View>

          {/* Vision Assist Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Vision Assist</Text>
              <Text style={styles.settingDescription}>
                Uses camera and AI to detect obstacles and provide visual guidance
              </Text>
            </View>
            <Switch
              value={settings.visionAssistEnabled}
              onValueChange={(value) => updateSetting('visionAssistEnabled', value)}
              accessibilityLabel="Vision Assist toggle"
              accessibilityHint="Turns camera-based obstacle detection on or off"
              trackColor={{ false: DARK_GRAY, true: GOLD }}
              thumbColor={settings.visionAssistEnabled ? '#fff' : '#f4f3f4'}
              // Future: Check settings.visionAssistEnabled before running YOLO/ML vision models
            />
          </View>

          {/* Spoken Guidance Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Spoken Guidance</Text>
              <Text style={styles.settingDescription}>
                Provides audio directions and announcements during navigation
              </Text>
            </View>
            <Switch
              value={settings.spokenGuidanceEnabled}
              onValueChange={(value) => updateSetting('spokenGuidanceEnabled', value)}
              accessibilityLabel="Spoken Guidance toggle"
              accessibilityHint="Turns audio navigation directions on or off"
              trackColor={{ false: DARK_GRAY, true: GOLD }}
              thumbColor={settings.spokenGuidanceEnabled ? '#fff' : '#f4f3f4'}
              // Future: Check settings.spokenGuidanceEnabled before triggering TTS (expo-speech)
            />
          </View>

          {/* Vibration Alerts Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Vibration Alerts</Text>
              <Text style={styles.settingDescription}>
                Provides haptic feedback for important navigation cues
              </Text>
            </View>
            <Switch
              value={settings.vibrationAlertsEnabled}
              onValueChange={(value) => updateSetting('vibrationAlertsEnabled', value)}
              accessibilityLabel="Vibration Alerts toggle"
              accessibilityHint="Turns haptic feedback on or off"
              trackColor={{ false: DARK_GRAY, true: GOLD }}
              thumbColor={settings.vibrationAlertsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          {/* Large Text Mode Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Large Text Mode</Text>
              <Text style={styles.settingDescription}>
                Increases text size throughout the app for better readability
              </Text>
            </View>
            <Switch
              value={settings.largeTextEnabled}
              onValueChange={(value) => updateSetting('largeTextEnabled', value)}
              accessibilityLabel="Large Text Mode toggle"
              accessibilityHint="Turns large text mode on or off"
              trackColor={{ false: DARK_GRAY, true: GOLD }}
              thumbColor={settings.largeTextEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          {/* Guidance Detail Picker */}
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Guidance Detail</Text>
              <Text style={styles.settingDescription}>
                Controls how much information is provided in navigation instructions
              </Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={settings.guidanceDetail}
                onValueChange={(value) => updateSetting('guidanceDetail', value)}
                style={styles.picker}
                accessibilityLabel="Guidance Detail picker"
                dropdownIconColor={GOLD}
                itemStyle={{ color: LIGHT_TEXT }}
              >
                <Picker.Item label="Minimal" value="Minimal" color={LIGHT_TEXT} />
                <Picker.Item label="Standard" value="Standard" color={LIGHT_TEXT} />
                <Picker.Item label="Detailed" value="Detailed" color={LIGHT_TEXT} />
              </Picker>
            </View>
          </View>

          {/* Feedback Frequency Picker */}
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Feedback Frequency</Text>
              <Text style={styles.settingDescription}>
                How often you receive navigation updates and alerts
              </Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={settings.feedbackFrequency}
                onValueChange={(value) => updateSetting('feedbackFrequency', value)}
                style={styles.picker}
                accessibilityLabel="Feedback Frequency picker"
                dropdownIconColor={GOLD}
                itemStyle={{ color: LIGHT_TEXT }}
              >
                <Picker.Item label="Low" value="Low" color={LIGHT_TEXT} />
                <Picker.Item label="Medium" value="Medium" color={LIGHT_TEXT} />
                <Picker.Item label="High" value="High" color={LIGHT_TEXT} />
              </Picker>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: LIGHT_TEXT,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: LIGHT_TEXT,
  },
  settingItem: {
    backgroundColor: DARK_GRAY,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: GOLD,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: LIGHT_TEXT,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: SECONDARY_TEXT,
    lineHeight: 20,
  },
  pickerContainer: {
    minWidth: 120,
    backgroundColor: DARK_BG,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GOLD,
  },
  picker: {
    height: 50,
    color: LIGHT_TEXT,
  },
});

