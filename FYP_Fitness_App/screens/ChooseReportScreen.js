import React from 'react';
import { View, Image, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChooseReportScreen({ navigation }) {

  async function handleViewFunction(workoutName){
    var username = await AsyncStorage.getItem("username");
    fetch(`http://13.239.35.133/api/workout?username=${username}&workoutName=${workoutName}`)
      .then(response => response.json())
      .then(data => navigation.navigate('ChooseDate', {result:data}))
      .catch(error => console.error(error));
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image style={styles.image} source={require('../assets/images/shoulderPressIcon.png')} />
        <Text style={styles.title}>Shoulder Press</Text>
        <Button title="View!" onPress={() => handleViewFunction("shoulderPress")} />
      </View>
      <View style={styles.card}>
        <Image style={styles.image} source={require('../assets/images/bicepsCurlIcon.png')} />
        <Text style={styles.title}>Biceps Curl</Text>
        <Button title="View!" onPress={() =>  handleViewFunction("bicepsCurl")} />
      </View>
      <View style={styles.card}>
        <Image style={styles.image} source={require('../assets/images/squatIcon.png')} />
        <Text style={styles.title}>Squat</Text>
        <Button title="View!" onPress={() => handleViewFunction("squat")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    width: "80%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});