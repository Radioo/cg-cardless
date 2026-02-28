import { StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const CARD_STORAGE_KEY = 'saved_card';

export default function SettingsScreen() {
  const router = useRouter();
  const [card, setCard] = useState('');
  const [savedCard, setSavedCard] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(CARD_STORAGE_KEY).then((value) => {
      if (value !== null) {
        setCard(value);
        setSavedCard(value);
      }
    });
  }, []);

  async function saveCard() {
    const trimmed = card.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Card cannot be empty.');
      return;
    }
    await AsyncStorage.setItem(CARD_STORAGE_KEY, trimmed);
    setSavedCard(trimmed);
    Alert.alert('Saved', 'Card saved successfully.');
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Settings</ThemedText>

      <ThemedView style={styles.cardSection}>
        <ThemedText type="subtitle">Card</ThemedText>
        <TextInput
          style={styles.input}
          value={card}
          onChangeText={setCard}
          placeholder="Enter your card"
          placeholderTextColor="#888"
        />
        <Pressable style={styles.button} onPress={saveCard}>
          <ThemedText style={styles.buttonText}>Save Card</ThemedText>
        </Pressable>
        {savedCard && (
          <ThemedText style={styles.savedLabel}>
            Saved: {savedCard}
          </ThemedText>
        )}
      </ThemedView>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ThemedText style={styles.buttonText}>Back to Welcome</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 24,
  },
  cardSection: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: '#666',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  savedLabel: {
    marginTop: 4,
    opacity: 0.7,
  },
});
