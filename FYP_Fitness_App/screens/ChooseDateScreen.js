import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';

export default function ChooseDateScreen({ navigation, route }) {
  const { result } = route.params;
  const success = result.success;
  const data = result.result;
  function generateDate(){
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const date = new Date(data[i].date);
      let datInList = date.toLocaleString('en-US', options).split('/');
      datInList.unshift(datInList.pop());
      datInList = datInList.join('-');
      result.push({ date: datInList, count: 1 });
      
    }
    return result
  }
  
  function today(){
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    const date = new Date();
    let datInList = date.toLocaleString('en-US', options).split('/');
    datInList.unshift(datInList.pop());
    datInList = datInList.join('-');
    return datInList
  }
  
  function renderItem({ item }) {
    const options = {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return (
      <TouchableOpacity style={styles.datePickerButton} onPress={() => navigation.navigate('Report', { data: item.data })}>
        <Text style={styles.datePickerButtonText}>{new Date(item.date).toLocaleString('en-US', options)}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      

      {success && data.length > 0? (
        <>
        <View style={styles.chartContainer}>
          <ContributionGraph
            values={generateDate()}
            endDate={today()}
            numDays={80}
            width={Dimensions.get('window').width *0.9}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
          />
        </View>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />
        </>
        
      ) : (
        <View style={styles.noRecordContainer}>
          <Text style={styles.noRecordText}>No record yet. Start your gym!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  chartContainer: {
    marginHorizontal: 8,
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    justifyContent:"center",
    alignItems: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  datePickerButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  datePickerButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
  },
  noRecordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecordText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
  },
});