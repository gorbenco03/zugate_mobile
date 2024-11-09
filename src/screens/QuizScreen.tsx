// src/screens/QuizScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../api/apiConfig';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;

type Props = {
  route: QuizScreenRouteProp;
  navigation: QuizScreenNavigationProp;
};

type Option = {
  _id: string;
  text: string;
};

type Question = {
  _id: string;
  questionText: string;
  options: Option[];
  correctAnswer: string;
};

type Quiz = {
  _id: string;
  lesson: string;
  questions: Question[];
};

const QuizScreen: React.FC<Props> = ({ route, navigation }) => {
  const { subjectId } = route.params;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.replace('Login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/student/quizzes/${subjectId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error fetching quiz:', errorData);
          Alert.alert('Error', errorData.message || 'Unable to fetch the quiz.');
          return;
        }

        const data = await response.json();
        console.log('Quiz received:', data);

        // Correctly set the quiz state
        setQuiz(data.quiz);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        Alert.alert('Error', 'An error occurred while connecting to the server. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [subjectId, navigation]);

  useEffect(() => {
    if (quiz && quiz.questions) {
      setSelectedOptions(Array(quiz.questions.length).fill(undefined));
    }
  }, [quiz]);

  const handleOptionSelect = (optionIndex: number) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[currentQuestionIndex] = optionIndex;
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleNextQuestion = () => {
    if (!quiz || !quiz.questions) {
      return;
    }

    if (selectedOptions[currentQuestionIndex] === undefined) {
      Alert.alert('Attention', 'Please select an option before proceeding.');
      return;
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || !quiz.questions) {
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }
  
      // Construiește array-ul de răspunsuri
      const answers = quiz.questions.map((question, index) => {
        const selectedOptionIndex = selectedOptions[index];
        const selectedOption = selectedOptionIndex !== undefined 
          ? question.options[selectedOptionIndex].text 
          : null;
        return {
          questionId: question._id,
          selectedOption: selectedOption,
          // isCorrect va fi calculat pe backend
        };
      });
  
      // Trimite doar 'answers'; backend-ul va calcula 'score'
      const response = await fetch(`${API_BASE_URL}/student/quizzes/${quiz.lesson}/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error submitting quiz:', errorData);
        Alert.alert('Error', errorData.message || 'Unable to submit the quiz.');
        return;
      }
  
      const data = await response.json();
      console.log('Quiz results:', data);
  
      // Afișează scorul primit de la backend
      Alert.alert('Quiz Completed', `Your score: ${data.score}/${quiz.questions.length}`);
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Alert.alert('Error', 'An error occurred while connecting to the server. Please check your internet connection.');
    }
  };

  if (loading || !quiz || !quiz.questions) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quiz</Text>
      <Text style={styles.questionText}>
        {currentQuestionIndex + 1}. {currentQuestion.questionText}
      </Text>

      {currentQuestion.options.map((option: Option, index: number) => (
        <TouchableOpacity
          key={option._id}
          style={[
            styles.optionButton,
            selectedOptions[currentQuestionIndex] === index ? styles.selectedOption : null,
          ]}
          onPress={() => handleOptionSelect(index)}
        >
          <Text style={styles.optionText}>{option.text}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
        <Text style={styles.nextButtonText}>
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#3498db',
  },
  optionText: {
    fontSize: 18,
    color: '#2c3e50',
  },
  nextButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});