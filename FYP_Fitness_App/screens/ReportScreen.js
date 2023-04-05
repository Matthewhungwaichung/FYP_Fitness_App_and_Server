import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, SafeAreaView, Platform } from 'react-native';
import { LineChart, ProgressChart } from 'react-native-chart-kit';

export default function ReportScreen({ navigation, route }) {
  const {data} = route.params;
  const workoutData = data.data;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {workoutData.map((item, index) => (
          <View key={index} style={styles.chartContainer}>
            <Text style={styles.index}>Set {index + 1}</Text>
            <Text style={styles.index2}>Progress: {item.duration} second</Text>
            <LineChart
              data={{
                labels: Array.from({length: Math.ceil(item.duration / 5)}, (_, i) => i * 5),
                datasets: [
                  {
                    data: item.data.map(value => value * 100),
                  },
                ],
              }}
              width={Dimensions.get('window').width * 0.85}
              height={220}
              yAxisSuffix="%"
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 2,
                color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                
              }}
              bezier
              withDots={false}
              style={{
                borderRadius: 16,
                marginBottom: 10,
              }}
            />
            <Text style={styles.index2}>Workout accuracy:</Text>
            <ProgressChart
              data={[item.correctPersentage]}
              width={Dimensions.get('window').width * 0.85}
              height={220}
              strokeWidth={16}
              radius={60}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 2,
                color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                borderRadius: 16,
              }}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chartContainer: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: Dimensions.get('window').width - 32,
  },
  index: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  index2: {
    fontSize: 20,
    marginBottom: 8,
  },
});