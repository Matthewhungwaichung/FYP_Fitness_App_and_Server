import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from './screens/CameraScreen'
import HomeScreen from './screens/HomeScreen'
import ChooseReportScreen from './screens/ChooseReportScreen';
import ReportScreen from './screens/ReportScreen';
import LoginScreen from './screens/LogInScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import ChooseDateScreen from './screens/ChooseDateScreen';



const Stack = createNativeStackNavigator();

export default function App() {

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
            headerShown: false
            }}>
                <Stack.Screen options={{ gestureEnabled: false }} name="Login" component={LoginScreen} />
                <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
                <Stack.Screen options={{ gestureEnabled: false }} name="Home" component={HomeScreen} />
                <Stack.Screen name="Camera" component={CameraScreen} />
                <Stack.Screen name="ChooseReport" component={ChooseReportScreen} />
                <Stack.Screen name="ChooseDate" component={ChooseDateScreen} />
                <Stack.Screen name="Report" component={ReportScreen} />
            </Stack.Navigator> 
        </NavigationContainer>
    );
}
