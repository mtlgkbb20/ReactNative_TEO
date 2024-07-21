import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Alert } from 'react-native';
import CustomButton from './CustomButton';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';
import FAIcon from 'react-native-vector-icons/FontAwesome';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const { db } = useContext(DBContext);
    const { setUser } = useContext(UserContext);
    const isFocused = useIsFocused();
    const [userNode, setUserNode] = useState(null);

    useEffect(() => {
        setUsername('');
        setPassword('');
        setUser(userNode);
    }, [isFocused]);

    const handleLogin = () => {
        if (username === '' || password === '') {
            Alert.alert('Please fill all fields');
            return;
        }
        
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Login WHERE username = ? AND password = ?;',
                [username, password],
                (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        setUserNode(_array[0]); // Assuming single user record for simplicity
                        navigation.navigate('Home');
                    } else if (username === 'admin' && password === 'admin') {
                        navigation.navigate('AdminPanel');
                    }
                    else {
                        Alert.alert('Invalid credentials');
                    }
                },
                (_, error) => {
                    console.error('Error fetching data: ', error);
                    Alert.alert('Error', 'An error occurred while logging in.');
                }
            );
        });
    };

    return (
        <ScrollView style={styles.loginForm} keyboardDismissMode='on-drag'>
            <Text style={styles.formHeading}>Please Login to App!</Text>
            <View style={styles.formBody}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FAIcon name="user" size={18} style={{marginLeft: 10, position:"absolute", zIndex:1}}/>
            <TextInput
                value={username}
                onChangeText={text => setUsername(text)}
                style={styles.loginInput}
                placeholder='Phone number or email'
            />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', }}>
            <FAIcon name="lock" size={20} style={{marginLeft: 10, position:"absolute", zIndex:1}}/>
            <TextInput
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.loginInput}
                placeholder='Password'
                secureTextEntry={true}
            />
            </View>
            </View>
            <View style = {styles.buttons}>
                <CustomButton title='Login' onPress={handleLogin} style={styles.button} />
                <CustomButton
                    title='Register'
                    onPress={() => navigation.navigate('Register')}
                    style={styles.button}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loginForm: {
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
    loginInput: {
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        width: '100%',
        paddingLeft: 30,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 60,
        backgroundColor: '#fff',
        borderRadius: 15,
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: -45,
    },
});

