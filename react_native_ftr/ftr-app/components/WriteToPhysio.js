import { Button, FlatList, View } from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "./CustomButton";
import * as React from "react";
import { TouchableOpacity, Text, TextInput } from "react-native";
import { DBContext } from "./DBContext";
import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function WriteToPhysio() {
    const navigation = useNavigation();
    const data = ["kadriye şen", "ahmet yılmaz"];
    const [selectedPhysio, setSelectedPhysio] = React.useState(null); // Track selected physio by name or ID
    const [message, setMessage] = React.useState(''); // State to hold the message
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext); // Assuming user contains therapistId

    const handleSendMessage = () => {
        // Implement sending message logic here
        console.log('Sending message:', message);
        // Add logic to send message to selected physio
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => setSelectedPhysio(item)} style={styles.patientItem}>
            <Text>{item}</Text>
            {selectedPhysio === item && (
                <>
                    <TextInput
                        placeholder='Enter message'
                        value={message}
                        onChangeText={setMessage}
                        style={styles.textInput}
                    />
                    <Button
                        title="Gönder"
                        onPress={handleSendMessage}
                        style={styles.sendButton}
                    />
                </>
            )}
        </TouchableOpacity>
    );

    const showMessages = () => {
        // Implement logic to fetch messages from the database
        console.log('Fetching messages for:', selectedPhysio);
        db.transaction(tx => {
            tx.executeSql(
                'SELECT content FROM Messages WHERE patientId = ?;',
                [1],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        console.log('Messages for', selectedPhysio, ':', rows._array);
                    } else {
                        console.error('No messages found for', selectedPhysio);
                    }
                },
                (_, error) => {
                    console.error('Error fetching messages: ', error);
                }
            );
        });
    }

    return (
        <View style={styles.container}>
            <CustomButton title="Geri" onPress={() => navigation.goBack()} style={{ marginTop: 50 }} />
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <CustomButton title="Mesajları göster" onPress={() => showMessages()} textStyle={{fontSize:50}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#AAA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    patientItem: {
        backgroundColor: '#b0e2ff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    textInput: {
        width: '80%',
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    sendButton: {
        marginTop: 10,
    },
});
