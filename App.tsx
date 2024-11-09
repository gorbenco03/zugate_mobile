// App.tsx
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// App.tsx

import LoginScreen from './src/screens/LoginScreen';
import MainScreen from './src/screens/MainScreen';
import DayScheduleScreen from './src/screens/DayScheduleScreen';

import QuizScreen from './src/screens/QuizScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
// App.tsx


export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  DaySchedule: { day: string };
  SubjectDetail: { subjectId: string; subjectName: string };
  Quiz: { subjectId: string; subjectName: string };
  Feedback: { subjectId: string; subjectName: string };
  Notes: { subjectId: string; subjectName: string }; // Add this line
};

// Adaugă importul pentru SubjectDetailScreen
import SubjectDetailScreen from './src/screens/SubjectDetailScreen';

// Adaugă ecranul în navigator


const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
          options={{ title: 'Acasa' }} 
        />
        <Stack.Screen 
          name="DaySchedule" 
          component={DayScheduleScreen} 
          options={({ route }) => ({ title: route.params.day })} 
        />
        <Stack.Screen 
           name="SubjectDetail" 
            component={SubjectDetailScreen} 
            options={({ route }) => ({ title: route.params.subjectName })} 
/>
<Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
<Stack.Screen name="Feedback" component={FeedbackScreen} options={{ title: 'Feedback' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}