import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import CustomButton from './CustomButton';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button } from 'react-native-paper';
import { DBContext } from './DBContext';
import { useContext } from 'react';
import { UserContext } from './UserContext'; // Assuming you have a UserContext

export default function PatientList() {
    const navigation = useNavigation();
    const patients = ['tolga akbaba', 'Ali Yılmaz'];
    const [selectedPatient, setSelectedPatient] = React.useState(null);
    const [message, setMessage] = React.useState('');
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext); // Assuming user contains therapistId
    const [patientId, setPatientId] = React.useState(null);

    const handlePatientClick = (patient) => {
        setSelectedPatient(selectedPatient === patient ? null : patient);
    };

    const handleSendMessage = () => {
        console.log('Sending message to: ', selectedPatient);
        if (!message) {
            Alert.alert('Lütfen bir mesaj giriniz.');
            return;
        }

        const [name, surname] = selectedPatient.split(' ');
        console.log('Patient name: ', name, 'Patient surname: ', surname);
        db.transaction(tx => {
            tx.executeSql(
                'SELECT id FROM User WHERE name = ? AND surname = ?;',
                [name, surname],
                (_, { rows }) => {
                    console.log('Rows: ', rows);
                    if (rows.length > 0) {
                        const patientId = rows.item(0).id;
                        console.log('Patient found in the database: ', patientId);
                        console.log('Sending message: ', message);
                        console.log('Current physio id: ', user.id);
                        // Now insert the message
                        const currentDate = new Date().toISOString();
                        console.log('Current date: ', currentDate);
                        tx.executeSql(
                            'INSERT INTO Messages (patientId, therapistId, content, messageDate, sender, receiver) VALUES (?, ?, ?, ?, ?, ?);',
                            [patientId, 1, message, currentDate, "therapist", "patient"],
                            () => {
                                Alert.alert('Başarılı', 'Mesaj başarıyla gönderildi.');
                                setMessage(''); // Clear the message input
                            },
                            (_, error) => {
                                console.error('Error sending message: ', error);
                                Alert.alert('Hata', 'Mesaj gönderilirken bir hata oluştu.');
                            }
                        );
                    } else {
                        console.error('Patient not found in the database.');
                        Alert.alert('Hata', 'Hasta veritabanında bulunamadı.');
                    }
                },
                (_, error) => {
                    console.error('Error fetching patient: ', error);
                    Alert.alert('Hata', 'Hasta bilgileri alınırken bir hata oluştu.');
                }
            );
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handlePatientClick(item)} style={styles.patientItem}>
            <Text style={styles.patientText}>{item}</Text>
            {selectedPatient === item && (
                <>
                    <TextInput
                        placeholder='Enter message'
                        value={message}
                        onChangeText={setMessage}
                        style={styles.textInput}
                        mode="outlined"
                    />
                    <Button
                        mode="contained"
                        onPress={handleSendMessage}
                        style={styles.sendButton}
                    >
                        Gönder
                    </Button>
                </>
            )}
        </TouchableOpacity>
    );

    const showMessages = () => {
        console.log('Fetching messages for:', selectedPatient);
        db.transaction(tx => {
            tx.executeSql(
                'Select id from User where name = ? and surname = ?;',
                [selectedPatient.split(' ')[0], selectedPatient.split(' ')[1]],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        console.log('Patient found in the database: ', patientId);
                        setPatientId(patientId);
                    } else {
                        console.error('Patient not found in the database.');
                    }
                },
                (_, error) => {
                    console.error('Error fetching patient: ', error);
                }
            );
            tx.executeSql(
                'SELECT content, sender FROM Messages WHERE therapistId = ?;',
                [patientId],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        console.log('Messages for', selectedPatient, ':', rows._array);
                    } else {
                        console.error('No messages found for', selectedPatient);
                    }
                },
                (_, error) => {
                    console.error('Error fetching messages: ', error);
                }
            );
        });    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CustomButton title="Geri" onPress={() => navigation.navigate("Home")} style={styles.backButton} />
                <Text style={styles.headerText}>Hasta Listesi</Text>
            </View>
            <FlatList
                data={patients}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />
            <CustomButton title="Mesajları göster" onPress={() => showMessages()} style={{marginLeft:0, borderRadius:20, width:200, marginBottom:50}} textStyle={{fontSize:20}} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00b2ee',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 20,
        marginTop: 50,
        marginLeft: -110,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        width: 60,
    },
    list: {
        width: '100%',
        paddingHorizontal: 20,
    },
    patientItem: {
        backgroundColor: '#b0e2ff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    patientText: {
        fontSize: 18,
        color: '#009acd',
    },
    textInput: {
        width: '100%',
        marginTop: 10,
    },
    sendButton: {
        marginTop: 10,
    },
});
