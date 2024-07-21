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
    const [userId, setUserId] = useState(null);

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

                    tx.executeSql(
                        'INSERT INTO User (username, name, surname, age, phone, mail) VALUES (?, ?, ?, ?, ?, ?);',
                        [username, '', '', '', '', ''],
                        (_, result) => {
                            console.log('User profile initialized successfully: ', result);
                            setUser({ username, password, logType }); // Update user context
                            Alert.alert('Success', 'User registered successfully');
                            navigation.navigate('Profile');
                        },
                        (_, error) => {
                            console.error('Error initializing user profile: ', error);
                            Alert.alert('Error', 'An error occurred while initializing user profile.');
                        }
                    );
                    tx.executeSql(
                        'Select id from User where username = ?;',
                        [username],
                        (_, { rows }) => {
                            setUserId(rows.item(0).id);
                            if (logType === 'physio') {
                                tx.executeSql(
                                    'CREATE TRIGGER IF NOT EXISTS createPhysio AFTER INSERT ON User BEGIN Insert Into Physios(id, patientId) Values(?, ?); END;',
                                    [userId, ],
                                    () => console.log('Trigger created successfully'),
                                    (_, error) => console.error('Error creating Trigger: ', error)
                                );
                            } else if (logType === 'patient')
                            tx.executeSql(
                                'CREATE TRIGGER IF NOT EXISTS createPatient AFTER INSERT ON User BEGIN Insert Into Patients(id, therapistId) Values(?, ?); END;',
                                [userId, ],
                                () => console.log('Trigger created successfully'),
                                (_, error) => console.error('Error creating Trigger: ', error)
                            );
                        },
                        (_, error) => {
                            console.error('Error fetching user id: ', error);
                        }
                    );
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
            <Text style={styles.formHeading}>Please Register to App!</Text>
            <View style={styles.formBody}>
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
            </View>
            <View style={styles.buttons}>
                <CustomButton title='Register' onPress={handleRegister} style={styles.registerButton} />
                <CustomButton title="Back" onPress={() => navigation.navigate("Login")} style={styles.backButton} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    registerForm: {
        flex: 1,
        backgroundColor: '#b0e2ff',
        padding: 40,
    },
    formHeading: {
        fontSize: 20,
        color: '#009acd',
        textAlign: 'center',
        marginTop: 100,
        marginBottom: 20,
    },
    formBody: {
        marginTop: '50%',
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
        backgroundColor: "#fff"
    },
    registerButton: {
        alignSelf: 'flex-start',
        marginBottom: 20,
        marginLeft:0,
        backgroundColor: "#fff"
    },
    buttons: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
