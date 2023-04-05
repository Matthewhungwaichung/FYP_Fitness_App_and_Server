import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
          <View style={styles.containerRow}>
            <View style={styles.card}>
              <Image style={styles.image} source={require('../assets/images/shoulderPressIcon.png')} />
              <Text style={styles.title}>Shoulder Press</Text>
              <Button title="Start!" onPress={() => navigation.navigate('Camera', {workoutName:"shoulderPress"})} />
            </View>
            <View style={styles.card}>
              <Image style={styles.image} source={require('../assets/images/bicepsCurlIcon.png')} />
              <Text style={styles.title}>Biceps Curl</Text>
              <Button title="Start!" onPress={() =>  navigation.navigate('Camera', {workoutName:"bicepsCurl"})} />
            </View>
          </View>
          <View style={styles.containerRow}>
            <View style={styles.card}>
              <Image style={styles.image} source={require('../assets/images/squatIcon.png')} />
              <Text style={styles.title}>Squat</Text>
              <Button title="Start!" onPress={() => navigation.navigate('Camera', {workoutName:"squat"})} />
            </View>
            <View style={styles.card}>
              <Image style={styles.image} source={require('../assets/images/report.png')} />
              <Text style={styles.title}>Report</Text>
              <Button title="Go!" onPress={() => navigation.navigate('ChooseReport')} />
            </View>
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
    containerRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
      marginBottom: 20,
    },
    card: {
      backgroundColor: '#ffffff',
      alignItems: 'center',
      borderRadius: 10,
      padding: 10,
      shadowColor: '#000',
      width: "40%",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
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
  