import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Alert } from 'react-native';
import CustomButton from './CustomButton';
import { useNavigation } from "@react-navigation/native";
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [logType, setLogType] = useState('');
    const navigation = useNavigation();
    const { db } = useContext(DBContext);
    const { setUser } = useContext(UserContext);

    const handleRegister = () => {
        if (username === '' || password === '' || logType === '') {
            Alert.alert('Please fill all fields');
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Login (username, password, logType) VALUES (?, ?, ?);',
                [username, password, logType],
                (_, result) => {
                    console.log('User registered successfully: ', result);
                    Alert.alert('Success', 'User registered successfully');

                    tx.executeSql(
                        'INSERT INTO User (username, name, surname, age, phone, mail) VALUES (?, ?, ?, ?, ?, ?);',
                        [username, '', '', '', '', ''],
                        (_, result) => {
                            console.log('User profile initialized successfully: ', result);
                            setUser({ username, password, logType }); // Update user context
                            navigation.navigate('Profile');
                        },
                        (_, error) => {
                            console.error('Error initializing user profile: ', error);
                            Alert.alert('Error', 'An error occurred while initializing user profile.');
                        }
                    );
                    setUser({ username, password, logType }); // Update user context
                    
                    navigation.navigate('Profile'); // Ensure 'Profile' route exists in navigation
                },
                (_, error) => {
                    console.error('Error registering user: ', error);
                    Alert.alert('Error', 'An error occurred while registering the user.');
                }
            );
        });
    };

    return (
        <ScrollView style={styles.registerForm} keyboardDismissMode='on-drag'>
            <View>
                <CustomButton title="Back" onPress={() => navigation.navigate("Login")} style={styles.backButton} />
            </View>
            <Text style={styles.formHeading}>Please Register to App!</Text>
            <TextInput
                value={username}
                onChangeText={text => setUsername(text)}
                style={styles.registerInput}
                placeholder='Phone number or email'
            />
            <TextInput
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.registerInput}
                placeholder='Password'
                secureTextEntry={true}
            />
            <TextInput
                value={logType}
                onChangeText={text => setLogType(text)}
                style={styles.registerInput}
                placeholder='Patient/Physio'
            />
            <CustomButton title='Register' onPress={handleRegister} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    registerForm: {
        flex: 1,
        backgroundColor: '#b0e2ff',
        padding: 20,
    },
    formHeading: {
        fontSize: 20,
        color: '#009acd',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 20,
    },
    registerInput: {
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#fff',
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
});
