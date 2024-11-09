// App.tsx

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import your screens
import LoginScreen from './src/screens/LoginScreen';
import MainScreen from './src/screens/MainScreen';
import DayScheduleScreen from './src/screens/DayScheduleScreen';
import SubjectDetailScreen from './src/screens/SubjectDetailScreen';
import QuizScreen from './src/screens/QuizScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import ToolsScreen from './src/screens/ToolsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Define the types for your navigation parameters
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined; // Add this to handle the tabs navigation
  Main: undefined;
  DaySchedule: { day: string };
  SubjectDetail: { subjectId: string; subjectName: string; grade?: string };
  Quiz: { subjectId: string; subjectName: string };
  Feedback: { subjectId: string; subjectName: string };
  Tools: undefined;
  Profile: undefined;
};

// Define types for bottom tabs
type TabParamList = {
  HomeStack: undefined;
  ToolsStack: undefined;
  ProfileStack: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Navigator for the Home tab
function HomeStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
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
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ title: 'Quiz' }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{ title: 'Feedback' }}
      />
    </Stack.Navigator>
  );
}

function ToolsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Tools">
      <Stack.Screen
        name="Tools"
        component={ToolsScreen}
        options={{ title: 'Tools' }}
      />
    </Stack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ToolsStack') {
            // Using 'wrench' icons instead of 'tools'
            iconName = focused ? 'wrench' : 'wrench-outline';
            // Alternative options:
            // iconName = focused ? 'cog' : 'cog-outline';
            // iconName = focused ? 'toolbox' : 'toolbox-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'account' : 'account-outline';
          } else {
            iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 5,
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Acasa', headerShown: false }}
      />
      <Tab.Screen
        name="ToolsStack"
        component={ToolsStackNavigator}
        options={{ tabBarLabel: 'Tools', headerShown: false }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: 'Profil', headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}