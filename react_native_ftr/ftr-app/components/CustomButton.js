import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ onPress, title, style=styles.button, textStyle=styles.buttonText }) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4682b4',
        marginLeft: 50,
        padding: 8,
        opacity: 0.8,
        borderRadius: 50,
        marginVertical: 10,
        width: '30%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#00b2ee',
        fontSize: 18,
    },
});

export default CustomButton;
