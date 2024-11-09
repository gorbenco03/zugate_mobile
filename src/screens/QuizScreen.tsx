// src/screens/QuizScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;

type Props = {
  route: QuizScreenRouteProp;
  navigation: QuizScreenNavigationProp;
};

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

const quizQuestions: Question[] = [
  {
    id: '1',
    question: 'Care este capitala României?',
    options: ['București', 'Cluj-Napoca', 'Iași', 'Timișoara'],
    answer: 'București',
  },
  // Adaugă mai multe întrebări după necesitate
];

const QuizScreen: React.FC<Props> = ({ route }) => {
  const { subjectId, subjectName } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleOptionPress = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
    }
    setSelectedOption(null);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished
      alert(`Scorul tău este ${score + 1}/${quizQuestions.length}`);
      // Reset quiz or navigate back
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subjectName}>{subjectName} - Quiz</Text>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>
      {currentQuestion.options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            selectedOption === option ? styles.selectedOption : null,
          ]}
          onPress={() => handleOptionPress(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedOption && { backgroundColor: '#ccc' },
        ]}
        onPress={handleNextQuestion}
        disabled={!selectedOption}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestionIndex < quizQuestions.length - 1
            ? 'Următoarea Întrebare'
            : 'Finalizare Quiz'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuizScreen;

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
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#2c3e50',
  },
  optionButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  selectedOption: {
    borderColor: '#34c759',
  },
  optionText: {
    fontSize: 16,
    color: '#34495e',
  },
  nextButton: {
    backgroundColor: '#34c759',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});