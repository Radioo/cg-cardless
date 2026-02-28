import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function WelcomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome</ThemedText>
      <ThemedText style={styles.body}>
        Thanks for using our app. We're glad you're here.
      </ThemedText>
      <Link href="/settings" style={styles.link}>
        <ThemedText type="link">Go to Settings</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  body: {
    marginTop: 12,
    textAlign: 'center',
  },
  link: {
    marginTop: 24,
    paddingVertical: 15,
  },
});
