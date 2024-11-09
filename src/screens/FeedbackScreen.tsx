// src/screens/FeedbackScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../api/apiConfig';

type FeedbackScreenRouteProp = RouteProp<RootStackParamList, 'Feedback'>;
type FeedbackScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Feedback'>;

type Props = {
  route: FeedbackScreenRouteProp;
  navigation: FeedbackScreenNavigationProp;
};

const FeedbackScreen: React.FC<Props> = ({ route, navigation }) => {
  const { subjectId, subjectName } = route.params;
  const [rating, setRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    // Validări înainte de trimitere
    if (rating < 1 || rating > 5) {
      Alert.alert('Eroare', 'Rating-ul trebuie să fie între 1 și 5.');
      return;
    }

    if (feedbackText.trim() === '') {
      Alert.alert('Eroare', 'Te rugăm să introduci feedback-ul.');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Eroare', 'Token de autentificare lipsă. Te rugăm să te autentifici din nou.');
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/student/lessons/${subjectId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          feedbackText,
          rating,
          isAnonymous,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Eroare', errorData.message || 'A apărut o problemă la trimiterea feedback-ului.');
        return;
      }

      const data = await response.json();
      Alert.alert('Mulțumim!', data.message);

      // Resetare formular
      setRating(0);
      setFeedbackText('');
      setIsAnonymous(false);

      // Navigare înapoi sau altă acțiune
      navigation.goBack();
    } catch (error: any) {
      console.error('Eroare la trimiterea feedback-ului:', error);
      Alert.alert('Eroare', 'A apărut o eroare la trimiterea feedback-ului. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subjectName}>{subjectName} - Feedback</Text>

      {/* Rating */}
      <Text style={styles.label}>Notează Profesorul (1 - 5):</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.ratingCircle,
              rating >= num ? styles.selectedRating : null,
            ]}
            onPress={() => setRating(num)}
          >
            <Text style={styles.ratingText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback Text */}
      <Text style={styles.label}>Feedback:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Scrie feedback-ul tău aici..."
        multiline
        value={feedbackText}
        onChangeText={setFeedbackText}
      />

      {/* Anonymous Switch */}
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Trimite anonim:</Text>
        <Switch
          value={isAnonymous}
          onValueChange={setIsAnonymous}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={submitFeedback}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Trimite Feedback</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20,
    backgroundColor: '#f0f5ff',
  },
  subjectName: {
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: '#34495e',
  },
  label: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  ratingCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedRating: {
    backgroundColor: '#34c759',
    borderColor: '#34c759',
  },
  ratingText: {
    color: '#34495e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: '#34c759',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});