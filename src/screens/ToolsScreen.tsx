// src/screens/ToolsScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ToolsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unelte pentru Studenți</Text>

      <View style={styles.actionsContainer}>
        {/* Playlist pentru concentrare */}
        <TouchableOpacity style={[styles.squareButton, styles.quizButton]}>
          <Text style={styles.buttonText}>Playlist pentru concentrare</Text>
        </TouchableOpacity>

        {/* Feed de noutăți educative */}
        <TouchableOpacity style={[styles.squareButton, styles.attendanceButton]}>
          <Text style={styles.buttonText}>Feed de noutăți educative</Text>
        </TouchableOpacity>

        {/* Tips & Tricks pentru studiu */}
        <TouchableOpacity style={[styles.squareButton, styles.feedbackButton]}>
          <Text style={styles.buttonText}>Tips & Tricks pentru studiu</Text>
        </TouchableOpacity>

        {/* Calendar de activități */}
        <TouchableOpacity style={[styles.squareButton, styles.usefulLinkButton]}>
          <Text style={styles.buttonText}>Calendar de activități</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ToolsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7', // Fundal neutru modern
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  squareButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,    
    elevation: 3,
  },
  quizButton: {
    backgroundColor: 'rgba(155, 89, 182, 0.8)',
  },
  attendanceButton: {
    backgroundColor: 'rgba(241, 196, 15, 0.8)',
  },
  feedbackButton: {
    backgroundColor: 'rgba(26, 188, 156, 0.8)',
  },
  usefulLinkButton: {
    backgroundColor: 'rgba(230, 126, 34, 0.8)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
});