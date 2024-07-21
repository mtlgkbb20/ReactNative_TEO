import React from "react";
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext';


const menuItemsToDisplayToPatient = [
    { name: "Ev Egzersizim", id: "B", path: "HomeExercise" },
    { name: "Fizyoterapistime yaz", id: "C", path: "WriteToPhysio" },
    { name: "Geçmişim", id: "D", path: "History" },
    { name: "Profilim", id: "E", path: "Profile" },
    //{ name: "Ayarlar", id: "F", path: "Settings" },
    { name: "Çıkış", id: "G", path: "Login" },
];

const menuItemsToDisplayToPhysio = [
    { name: "Hasta Listem", id: "A", path: "PatientList" },
    { name: "Bildirimler", id: "B", path: "Notifications" },
    { name: "Session Ekle", id: "C", path: "AddSession" },
    { name: "Profilim", id: "D", path: "Profile" },
    { name: "Ayarlar", id: "E", path: "Settings" },
    { name: "Çıkış", id: "F", path: "Login" },
];

const Item = ({ name }) => (
    <View style={styles.MenuItemsScroll}>
        <Text style={styles.MenuItemsText}>{name}</Text>
    </View>
);

const Header = () => (
    <View style={styles.HeadingContainer}>
        <Text style={styles.MenuHeader}>Menü</Text>
    </View>
);

export default function MenuItems() {
    const navigation = useNavigation();
    const {user} = React.useContext(UserContext); 

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate(item.path)}>
            <Item name={item.name} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.MenuItems}>
            {user?.logType==='patient' && <FlatList 
                data={menuItemsToDisplayToPatient} 
                renderItem={renderItem} 
                keyExtractor={item => item.id}
                ListHeaderComponent={Header}
            />}
            {user?.logType==='physio' && <FlatList 
                data={menuItemsToDisplayToPhysio} 
                renderItem={renderItem} 
                keyExtractor={item => item.id}
                ListHeaderComponent={Header}
            />}
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
