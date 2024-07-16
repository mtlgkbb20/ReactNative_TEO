import { Button, View } from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Notifications() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Button title="Goback" onPress={()=> navigation.goBack()}/>
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
});


