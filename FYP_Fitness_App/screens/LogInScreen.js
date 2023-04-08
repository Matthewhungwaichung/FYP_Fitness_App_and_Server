import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin(){
        if (username!=="" && password!==""){
            fetch('http://13.239.35.133/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => handleOutPut(data))
        }
        else{
            Alert.alert(
                'Login Fail',
                'Please enter a username and password',
                [
                  {
                    text: 'Ok',
                    style: 'cancel'
                  }
                ]
              );
        }
        
    //navigation.navigate('Home');
    }
    async function handleOutPut(result){
        if (result.success) {
            await AsyncStorage.setItem("username", username)
            navigation.navigate('Home');
        }
        else{
            Alert.alert(
                'Login Fail',
                'Wrong password or unknown user',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  }
                ]
              );
        }
    }
    return (
        <View style={styles.container}>
            <Image
            style={styles.logo}
            source={require('../assets/images/loginIcon.png')}
            />
            <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => setUsername(text)}
            value={username}
            />
            <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            />
            <Button
            title="Login"
            onPress={handleLogin}
            />
            <Button
            title="Create Account"
            onPress={()=>navigation.navigate('CreateAccount')}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 50,
    },
    input: {
        width: '80%',
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});