import * as React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { DBContext } from './DBContext';
import CustomButton from './CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Information() {
    const { db } = React.useContext(DBContext);
    const [user, setUser] = React.useState(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { name, surname } = route.params;

    React.useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM User WHERE name = ? AND surname = ?;',
                [name, surname],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        setUser(rows.item(0));
                    } else {
                        Alert.alert('Error', 'Patient not found in the database.');
                    }
                },
                (_, error) => {
                    console.error('Error fetching patient: ', error);
                    Alert.alert('Error', 'An error occurred while fetching the patient.');
                }
            );
        });
    }, [name, surname, db]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CustomButton title="Geri" onPress={() => navigation.pop()} style={styles.backButton} />
                <Text style={styles.headerText}>Information</Text>
            </View>
            <View style={styles.content}>
                {user ? (
                    <>
                        <Text style={styles.text}>Name: {user.name}</Text>
                        <Text style={styles.text}>Surname: {user.surname}</Text>
                        <Text style={styles.text}>Age: {user.age}</Text>
                        <Text style={styles.text}>Phone: {user.phone}</Text>
                        <Text style={styles.text}>Mail: {user.mail}</Text>
                    </>
                ) : (
                    <Text style={styles.text}>Loading...</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00b2ee',
        width: '100%',
    },
    backButton: {
        position: 'absolute',
        left: -35,
        top: 25,
        width: 75,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flex: 0.12,
        marginTop: 25,
        backgroundColor: '#00b2ee',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    headerText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#b0e2ff',
    },
    content: {
        flex: 0.88,
        backgroundColor: '#b0e2ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
    },
});
