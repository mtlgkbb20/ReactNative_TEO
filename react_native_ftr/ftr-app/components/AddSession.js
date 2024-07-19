import { Button, View, Text, FlatList, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import { DBContext } from "./DBContext";
import { Card } from "react-native-paper";
import CustomButton from "./CustomButton";
import React from "react";

export default function AddSession() {
  const navigation = useNavigation();
  const { db } = useContext(DBContext);
  const [sessionArr, setSessionArr] = React.useState([]);
  const [isAdding, setIsAdding] = React.useState(false);
  const [patientId, setPatientId] = React.useState(null);
    const [patientName, setPatientName] = React.useState("");
    const [date, setDate] = React.useState("");

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Sessions;",
        [],
        (_, { rows }) => {
          console.log("Sessions: ", rows);
          setSessionArr(rows._array);
        },
        (_, error) => {
          console.error("Error fetching sessions: ", error);
        }
      );
    });
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.sessionCard}>
      <Card.Content>
        <Text>Session ID: {item.id}</Text>
        <Text>Session Patient: {item.patientId}</Text>
        <Text>Session Therapist: {item.therapistId}</Text>
        <Text>Session Date: {item.date}</Text>
      </Card.Content>
    </Card>
  );

    const addSession = () => {
        db.transaction(tx => {
            tx.executeSql(
                'Select id from User where name = ?;',
                [patientName],
                (_, { rows }) => {
                    console.log('Patient ID: ', rows);
                    setPatientId(rows.item(0).id);
                    console.log('Patient ID: ', patientId);
                },
                (_, error) => {
                    console.error('Error fetching patient ID: ', error);
                }
            );
            tx.executeSql(
                'INSERT INTO Sessions (patientId, therapistId, date) VALUES (?, ?, ?);',
                [patientId, 1, date],
                (_, result) => {
                    console.log('Session added successfully: ', result);
                    setIsAdding(!isAdding);
                    tx.executeSql(
                        'SELECT * FROM Sessions;',
                        [],
                        (_, { rows }) => {
                            console.log('Sessions: ', rows);
                            setSessionArr(rows._array);
                        },
                        (_, error) => {
                            console.error('Error fetching sessions: ', error);
                        }
                    );
                },
                (_, error) => {
                    console.error('Error adding session: ', error);
                }
            );
        }
        );
    }

  return (
    <View style={styles.container}>
      {!isAdding && (
        <>
          <Text style={styles.header}>Oturumlar</Text>
          <CustomButton
            title="Oturum Ekle"
            onPress={() => setIsAdding(!isAdding)} // Adjust the screen name accordingly
            style={styles.addButton}
          />
          <FlatList
            data={sessionArr}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
          />
          <CustomButton title="Geri" onPress={() => navigation.navigate("Home")} style={{marginLeft:-175, marginBottom: 50, borderRadius:10, height:40}} />

        </>
      )}
      {isAdding && (
        <>
        <View style={styles.inputBoxes}>
          <Text style={styles.header}>Oturum Ekle</Text>
          <TextInput value={date} onChangeText={date => setDate(date)} placeholder="Tarih" style={styles.inputs} />
          <TextInput value={patientName} onChangeText={patientName => setPatientName(patientName)} placeholder="Hasta Adı" style={styles.inputs} />
          <CustomButton title="Oturum Ekle" onPress={() => addSession()} style={{borderRadius:10, width:120, marginTop: 50, marginLeft:0}} />
          <CustomButton title="Geri" onPress={() => setIsAdding(!isAdding)} style={{marginLeft:0, marginBottom: 20, borderRadius:10, height:35}} />
        </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AAA",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    marginTop: 70,
    marginBottom: 20,
  },
  addButton: {
    marginLeft: 0,
    borderRadius: 10,
    width: 250,
    height: 50,
    justifyContent: "center",
    marginBottom: 20,
  },
  sessionCard: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    width: 300,
  },
  flatList: {
    width: 300,
  },
  inputBoxes: {
    marginTop: 150,
    width: 300,
    height: 300,
  },
    inputs: {
        width: "100%",
        height: 40,
        marginTop: 15,
        borderRadius: 8,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
});
