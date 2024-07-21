import React, { useEffect, useContext, useState } from "react";
import { View, Text, FlatList } from 'react-native';
import { DBContext } from "./DBContext";

const Item = ({ content, name, date }) => (
    <View style={styles.MenuItemsScroll}>
        {content && <><Text style={styles.MenuItemsText}>Content: {content} </Text><Text style={styles.MenuItemsText}>Sender: {name} </Text></>}
        {date && 
        <><Text style={styles.MenuItemsText}>Date: {date} </Text><Text style={styles.MenuItemsText}>{name} tarafından oluşturuldu.</Text></>}
    </View>
);

const Header = () => (
    <View style={styles.HeadingContainer}>
        <Text style={styles.MenuHeader}>Bildirimler</Text>
    </View>
);

export default function MenuItems() {
    const { db } = useContext(DBContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        let messages = [];
        let sessions = [];

        db.transaction(tx => {
            tx.executeSql(
                'SELECT u.name, m.content, m.id FROM User u INNER JOIN Messages m ON m.therapistId=u.id;',
                [],
                (_, { rows }) => {
                    messages = rows._array;
                    if (sessions.length > 0) {
                        setNotifications([...messages, ...sessions]);
                    }
                },
                (_, error) => {
                    console.error('Error fetching messages: ', error);
                }
            );
            tx.executeSql(
                'SELECT u.name, s.date, s.id FROM User u INNER JOIN Sessions s ON s.therapistId=u.id;',
                [],
                (_, { rows }) => {
                    sessions = rows._array;
                    if (messages.length > 0) {
                        setNotifications([...messages, ...sessions]);
                    }
                },
                (_, error) => {
                    console.error('Error fetching sessions: ', error);
                }
            );
        });
    }, [db]);

    const renderItem = ({ item }) => <Item content={item.content} name={item.name} date={item.date} />;

    return (
        <View style={styles.MenuItems}>
            <FlatList 
                data={notifications} 
                renderItem={renderItem} 
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={Header}
            />
        </View>
    );
}

const styles = {
    MenuItems: {
        flex: 0.88,
        backgroundColor: '#b0e2ff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 50,
    },
    MenuItemsScroll: {
        flex: 1,
        padding: 20,
        backgroundColor: '#009acd',
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    MenuItemsText: {
        fontSize: 25,
        color: '#b0e2ff',
    },
    MenuHeader: {
        marginTop:30,
        marginBottom: 30,
        fontSize: 40,
        fontWeight: 'bold',
        color: '#009acd',
    },
    HeadingContainer:{
        alignItems: 'center',
        justifyContent: 'center',
    }
};
