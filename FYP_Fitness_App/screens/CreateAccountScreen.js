import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function CreateAccount({ navigation }){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleCreateAccount(){
        if (username!=="" && password!==""){
            fetch('http://13.239.35.133/api/newaccount', {
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
                'Fail to create account',
                'Please enter a username and password',
                [
                  {
                    text: 'Ok',
                    style: 'cancel'
                  }
                ]
              );
        }
        
    }
    function handleOutPut(result){
        if (result.success) {
            navigation.navigate('Login');
        }
        else{
            Alert.alert(
                'Fail to create account',
                'Username found',
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
        title="Create Account"
        onPress={handleCreateAccount}
        />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});