// src/screens/DayScheduleScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type DayScheduleScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DaySchedule'>;
type DayScheduleScreenRouteProp = RouteProp<RootStackParamList, 'DaySchedule'>;

type Props = {
  navigation: DayScheduleScreenNavigationProp;
  route: DayScheduleScreenRouteProp;
};

type Subject = {
  id: string;
  name: string;
  time: string;
};

const scheduleData: { [key: string]: Subject[] } = {
  Luni: [
    { id: '1', name: 'Matematică', time: '08:00 - 09:30' },
    { id: '2', name: 'Biologie', time: '10:00 - 11:30' },
  ],
  // Adaugă date pentru celelalte zile
};

const DayScheduleScreen: React.FC<Props> = ({ route, navigation }) => {
  const { day } = route.params;
  const schedule = scheduleData[day] || [];

  const renderItem = ({ item }: { item: Subject }) => (
    <TouchableOpacity
      style={styles.subjectContainer}
     // În renderItem din DayScheduleScreen
onPress={() => {
  navigation.navigate('SubjectDetail', { subjectId: item.id, subjectName: item.name });
}}
      
    >
      <Text style={styles.subjectName}>{item.name}</Text>
      <Text style={styles.subjectTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={schedule}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
};

export default DayScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subjectContainer: {
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#ccc',
  },
  subjectName: {
    fontSize: 18, 
    fontWeight: 'bold',
  },
  subjectTime: {
    fontSize: 14, 
    color: '#555',
  },
});