import React from "react";
import { View, Text, FlatList } from 'react-native';

const notifications = [
    { name: "notification1", id: "n1" },
    { name: "notification2", id: "n2" },
    { name: "notification3", id: "n3" },
    { name: "notification4", id: "n4" },
    { name: "notification5", id: "n5" },
    { name: "notification6", id: "n6" },
    { name: "notification7", id: "n7" },
    { name: "notification8", id: "n8" },
    { name: "notification9", id: "n9" },
    { name: "notification10", id: "n10" },
];

const Item = ({ name }) => (
    <View style={styles.MenuItemsScroll}>
        <Text style={styles.MenuItemsText}>{name}</Text>
    </View>
);
const Header = () => (
    <View style={styles.HeadingContainer}>
        <Text style={styles.MenuHeader}>Bildirimler</Text>
    </View>
);

export default function MenuItems() {
    const renderItem = ({ item }) => <Item name={item.name} />;
    return (
        <View style={styles.MenuItems}>
            <FlatList 
                data={notifications} 
                renderItem={renderItem} 
                keyExtractor={item => item.id}
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
