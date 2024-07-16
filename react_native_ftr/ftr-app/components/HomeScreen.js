import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MenuItems from './MenuItems';
import NotificationMenu from './NotificationMenu';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext';


export default function HomeScreen() {
    const [PatientMenu, setPatientMenu] = React.useState(false);
    const [PhysioMenu, setPhysioMenu] = React.useState(false);
    const { user } = React.useContext(UserContext);

    const showPatientMenuList = () => {
        setPatientMenu(!PatientMenu);
    };

    const showPhysioMenuList = () => {
        setPhysioMenu(!PhysioMenu);
    }

    return (
        <>
            <View style={style.HomeScreen}>
                <View style={style.Header}>
                    <Text style={style.HeaderText}>TEO</Text>
                </View>
                <View style={style.menuButton}>
                    <TouchableOpacity onPress={showPatientMenuList}>
                        <Image source={require('./menu-icon.png')} style={style.menu_icon} />
                    </TouchableOpacity>
                </View>
                {!PatientMenu && user?.logType==='patient' && <NotificationMenu />}
                {PatientMenu && user?.logType==='patient' && <MenuItems />}
                {!PhysioMenu && user?.logType==='physio' && <MenuItems />}
            </View>
        </>
    );
}

const style = StyleSheet.create({
    HomeScreen: {
        flex: 1,
        backgroundColor: '#00b2ee',
        width: '100%',
    },
    Header: {
        flex: 0.12,
        marginTop: 25,
        backgroundColor: '#00b2ee',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    HeaderText: {
        marginLeft: 50,
        fontSize: 40,
        fontWeight: 'bold',
        color: '#b0e2ff',
        letterSpacing: 60,
    },
    menu_icon: {
        width: 40,
        height: 40,
    },
    menuButton: {
        position: 'absolute',
        top: 140,
        left: 20,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#4f94cd",
        borderWidth: 5,
        borderColor: '#4f94cd',
        borderRadius: 30,
        zIndex: 10, // Ensures the button is on top
    },
    navigateText: {
        marginTop: 20,
        fontSize: 20,
        color: '#ffffff',
    },
});
