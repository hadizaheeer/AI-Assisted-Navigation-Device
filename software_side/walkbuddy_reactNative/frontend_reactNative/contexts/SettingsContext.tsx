import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Settings interface matching the requirements
// These settings are used throughout the app for accessibility features
export interface Settings {
  // Assistive Features
  voiceAssistEnabled: boolean; // Checked before processing STT (Speech-to-Text) commands
  visionAssistEnabled: boolean; // Controls camera/ML vision processing for obstacle detection
  spokenGuidanceEnabled: boolean; // Checked before triggering TTS (Text-to-Speech) announcements
  vibrationAlertsEnabled: boolean; // Controls haptic feedback via expo-haptics
  largeTextEnabled: boolean; // Used to adjust text sizes across UI components
  
  // Preferences
  guidanceDetail: 'Minimal' | 'Standard' | 'Detailed'; // Used by ML reasoning to determine response verbosity
  feedbackFrequency: 'Low' | 'Medium' | 'High'; // Controls how often navigation updates are provided
}

// Default settings
const defaultSettings: Settings = {
  voiceAssistEnabled: true,
  visionAssistEnabled: true,
  spokenGuidanceEnabled: true,
  vibrationAlertsEnabled: true,
  largeTextEnabled: false,
  guidanceDetail: 'Standard',
  feedbackFrequency: 'Medium',
};

// Storage key
const SETTINGS_STORAGE_KEY = '@walkbuddy_settings';

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const mergedSettings = { ...settings, ...newSettings };
    setSettings(mergedSettings);
    await saveSettings(mergedSettings);
  };

  const resetSettings = async () => {
    setSettings(defaultSettings);
    await saveSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

