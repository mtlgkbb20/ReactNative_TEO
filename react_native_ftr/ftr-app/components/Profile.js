import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "./UserContext";
import { DBContext } from "./DBContext";
import CustomButton from "./CustomButton";
import { Card } from 'react-native-paper';

export default function Profile() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [mail, setMail] = useState('');
    const { user, setUser } = useContext(UserContext);
    const { db } = useContext(DBContext);
    const [userProfile, setUserProfile] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        if (db && user?.username) {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM User WHERE username = ?;',
                    [user.username],
                    (_, { rows: { _array } }) => {
                        if (_array.length > 0) {
                            const profile = _array[0];
                            setUserProfile(profile);
                            setName(profile.name);
                            setSurname(profile.surname);
                            setAge(profile.age);
                            setPhone(profile.phone);
                            setMail(profile.mail);
                        }
                    },
                    (_, error) => {
                        console.error('Error fetching user profile: ', error);
                    }
                );
            });
        }
    };

    const handleSave = () => {
        fetchUserData();
        console.log('Saving profile: ', { name, surname, age, phone, mail });
        if (!name || !surname || !age || !phone || !mail) {
            Alert.alert('Please fill all fields');
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                'UPDATE User SET name = ?, surname = ?, age = ?, phone = ?, mail = ? WHERE username = ?;',
                [name, surname, age, phone, mail, user.username],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        Alert.alert('Success', 'Profile updated successfully');
                        setUserProfile({ name, surname, age, phone, mail });
                        setEditing(false);
                    } else {
                        Alert.alert('Error', 'Failed to update profile');
                    }
                },
                (_, error) => {
                    console.error('Error updating user profile: ', error);
                    Alert.alert('Error', 'An error occurred while updating profile.');
                }
            );
        });
    };

    const toggleEdit = () => {
        setEditing(!editing);
    };

    return (
        <ScrollView style={styles.container}>
            <CustomButton 
                title={"Geri"} 
                onPress={() => {
                    if (editing) {
                        toggleEdit();
                    } else {
                        navigation.navigate("Home");
                    }
                }} 
                style={styles.backButton} 
            />
            {editing ? (
                <>
                    <Card style={styles.profileScreen}>
                        <Card.Content>
                            <Card.Title title="Profil" titleStyle={styles.heading} />
                        </Card.Content>
                        <Card.Content style={styles.row}>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                style={styles.registerInput}
                                placeholder='Name'
                            />
                        </Card.Content>
                        <Card.Content style={styles.row}>
                            <TextInput
                                value={surname}
                                onChangeText={setSurname}
                                style={styles.registerInput}
                                placeholder='Surname'
                            />
                        </Card.Content>
                        <Card.Content style={styles.row}>
                            <TextInput
                                value={age}
                                onChangeText={setAge}
                                style={styles.registerInput}
                                placeholder='Age'
                            />
                        </Card.Content>
                        <Card.Content style={styles.row}>
                            <TextInput
                                value={phone}
                                onChangeText={setPhone}
                                style={styles.registerInput}
                                placeholder='Phone (5XX XXX XX XX)'
                            />
                        </Card.Content>
                        <Card.Content style={styles.row}>
                            <TextInput
                                value={mail}
                                onChangeText={setMail}
                                style={styles.registerInput}
                                placeholder='Mail'
                            />
                        </Card.Content>
                        <CustomButton title="Kaydet" onPress={handleSave} style={{backgroundColor: '#E0E6ED', marginRight:225,borderRadius: 18}} textStyle={{color: '#5F9EA0'}}/>
                    </Card>
                </>
            ) : (
                <>
                    <Card style={styles.profileScreen}>
                        <Card.Content>
                            <Card.Title title="Profil" titleStyle={styles.heading} />
                        </Card.Content>
                        <Card.Content style={styles.row}>
                            <Text style={styles.profileText}>İsim:</Text>
                            <Text style={styles.varContent}>{userProfile?.name}</Text>
                        </Card.Content>
                        <Card.Content style={styles.row}>
                            <Text style={styles.profileText}>Soyisim:</Text>
                            <Text style={styles.varContent}>{userProfile?.surname}</Text>
                        </Card.Content>
                        <Card.Content style={styles.row}>
                            <Text style={styles.profileText}>Yaş:</Text>
                            <Text style={styles.varContent}>{userProfile?.age}</Text>
                        </Card.Content>
                        <Card.Content style={styles.row}>
                            <Text style={styles.profileText}>Telefon:</Text>
                            <Text style={styles.varContent}>{userProfile?.phone}</Text>
                        </Card.Content>
                        <Card.Content style={styles.row}>
                            <Text style={styles.profileText}>Mail:</Text>
                            <Text style={styles.varContent}>{userProfile?.mail}</Text>
                        </Card.Content>
                        <Card.Actions>
                            <CustomButton title='Düzenle' onPress={toggleEdit} style={{backgroundColor: '#E0E6ED', marginRight:225}} textStyle={{color: '#5F9EA0'}}/>
                        </Card.Actions>
                    </Card>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4682b4',
    },
    backButton: {
        position: 'absolute',
        marginTop: 50,
        marginLeft: 25,
        width: 60,
        height: 35,
        padding: 7,
        backgroundColor: '#fff',
    },
    heading: {
        marginVertical: 10,
        marginBottom: 40,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#B8D1F9',
        textAlign: 'center',
        marginTop: 80,
    },
    registerInput: {
        borderWidth: 0.6,
        borderRadius: 12,
        padding: 10,
        marginLeft: 12,
        backgroundColor: '#fff',
        width: '80%',
        alignSelf: 'center',
    },
    profileText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileScreen: {
        flex: 1,
        marginTop: 150,
        height: 600,
        backgroundColor: '#4f94cd',
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginVertical: 20,
        marginHorizontal: 20,
        borderRadius: 30,
        alignItems: 'center',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
        marginTop: 10,
        paddingHorizontal: 40,
    },
    varContent: {
        fontSize: 20,
        color: '#B8D1F9',
    },
});
