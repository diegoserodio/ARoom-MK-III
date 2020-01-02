import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import {Relay} from './Components/Relay';
import {LedStrip} from './Components/LedStrip';

export default function App() {
  return (
    <View style={styles.container}>
      <Relay />
      <LedStrip />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
