import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import { useNavigation } from '@react-navigation/native';


export default function AdminPanel() {
    const openPatientAdder = () => {
        console.log('openPatientAdder');
    }

    const openPhysioAdder = () => {
        console.log('openPhysioAdder');
    }

    const navigation = useNavigation();

    return (
        <View style = {styles.container}>
            <CustomButton title='addPatient' onPress={openPatientAdder} />
            <CustomButton title='addPhysio'  onPress={openPhysioAdder} />
            <CustomButton title='Logout'  onPress={()=> navigation.navigate("Login")}/>
            <Text>Admin Panel</Text>
        </View>
    );
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#00b2ee',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });