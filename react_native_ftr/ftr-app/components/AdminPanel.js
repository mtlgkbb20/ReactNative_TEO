import * as React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";
import { DBContext } from "./DBContext";
import { useContext } from "react";
import { Card } from "react-native-paper";

export default function AdminPanel() {
  const { db } = useContext(DBContext);
  const [patientArr, setPatientArr] = React.useState([]);
  const [physioArr, setPhysioArr] = React.useState([]);
  const [sessionArr, setSessionArr] = React.useState([]);
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const [isProcess, setIsProcess] = React.useState(false);
  const [showingProfile, setShowingProfile] = React.useState(false);
  const [currentView, setCurrentView] = React.useState(null);

  const openPatientAdder = () => {
    console.log("openPatientAdder");
  };

  const openPhysioAdder = () => {
    console.log("openPhysioAdder");
  };

  const fetchPatients = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT User.name, User.surname FROM Login INNER JOIN User ON Login.username = User.username WHERE Login.logType = 'patient';",
        [],
        (_, { rows: { _array } }) => {
          setPatientArr(_array);
          console.log("Patients: ", _array);
        },
        (_, error) => {
          console.error("Error fetching patients: ", error);
        }
      );
    });
  };

  const fetchPhysios = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT User.name, User.surname FROM Login INNER JOIN User ON Login.username = User.username WHERE Login.logType = 'physio';",
        [],
        (_, { rows: { _array } }) => {
          setPhysioArr(_array);
          console.log("Physios: ", _array);
        },
        (_, error) => {
          console.error("Error fetching physios: ", error);
        }
      );
    });
  };

  const fetchSessions = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Sessions;", // Adjust this query based on your table schema
        [],
        (_, { rows: { _array } }) => {
          setSessionArr(_array);
          console.log("Sessions: ", _array);
        },
        (_, error) => {
          console.error("Error fetching sessions: ", error);
        }
      );
    });
  };

  const showPatients = () => {
    setCurrentView("patients");
    setIsProcess(!isProcess);
    fetchPatients();
  };

  const showPhysios = () => {
    setCurrentView("physios");
    setIsProcess(!isProcess);
    fetchPhysios();
  };

  const showSessions = () => {
    setCurrentView("sessions");
    setIsProcess(!isProcess);
    fetchSessions();
  };

  const showProfile = (name, surname) => {
    setShowingProfile(!showingProfile);
    setSelectedPatient({ name, surname });
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM User WHERE name = ? AND surname = ?;",
        [name, surname],
        (_, { rows }) => {
          console.log("Patient profile: ", rows._array[0]);
          setSelectedPatient(rows._array[0]);
        },
        (_, error) => {
          console.error("Error fetching patient profile: ", error);
        }
      );
    });
  };

  const navigation = useNavigation();

  const renderList = (data) => (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Card style={styles.patientList}>
          <Card.Content style={styles.patient}>
            {((currentView === "patients") || (currentView === "physios")) && <Text style={{ fontSize: 20 }}>
              {item.name} {item.surname}
            </Text>}
            {((currentView === "patients") || (currentView === "physios")) && <CustomButton
              title="showProfile"
              onPress={() => showProfile(item.name, item.surname)}
              style={{ width: 80, height: 30, borderRadius: 10 }}
              textStyle={{ fontSize: 12 }}
            />}
          </Card.Content>
        </Card>
      )}
    />
  );

  return (
    <View style={styles.container}>
      {!isProcess && (
        <>
          <Text style={{ marginTop: 100, fontSize: 30 }}>Admin Panel</Text>
          <View style={styles.mainPanel}>
            <CustomButton title="addPatient" onPress={openPatientAdder} style={styles.panelButtons} />
            <CustomButton title="addPhysio" onPress={openPhysioAdder} style={styles.panelButtons} />
            <CustomButton title="showPatients" onPress={showPatients} style={styles.panelButtons} />
            <CustomButton title="showPhysios" onPress={showPhysios} style={styles.panelButtons} />
            <CustomButton title="showSessions" onPress={showSessions} style={styles.panelButtons} />
            <CustomButton
              title="Logout"
              onPress={() => navigation.navigate("Login")}
            />
          </View>
        </>
      )}

      {isProcess && !showingProfile && (
        <>
          <View style={{ marginTop: 100 }}>
            <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 30 }}>
              {currentView === "patients" && "PATIENT LIST"}
              {currentView === "physios" && "PHYSIO LIST"}
              {currentView === "sessions" && "SESSIONS LIST"}
            </Text>
            {currentView === "patients" && renderList(patientArr)}
            {currentView === "physios" && renderList(physioArr)}
            {currentView === "sessions" && renderList(sessionArr)}
            <CustomButton title="Back" onPress={() => setIsProcess(false)} style={{ marginBottom: 100, marginLeft: 0, borderRadius: 15, width: 80 }} />
          </View>
        </>
      )}

      {selectedPatient && showingProfile && (
        <Card style={styles.patientInf}>
          <Card.Title
            title={`PATIENT INFORMATION`}
            style={{ justifyContent: "center", alignItems: "center", marginBottom: 80, marginTop: 20 }}
          />
          <Card.Content style={{ justifyContent: "center" }}>
            <Text style={styles.infoText}>Name: {selectedPatient.name}</Text>
            <Text style={styles.infoText}>Surname: {selectedPatient.surname}</Text>
            <Text style={styles.infoText}>Age: {selectedPatient.age}</Text>
            <Text style={styles.infoText}>Phone: {selectedPatient.phone}</Text>
            <Text style={styles.infoText}>Mail: {selectedPatient.mail}</Text>
            <CustomButton title="Back" onPress={() => setShowingProfile(false)} style={{ marginTop: 30, borderRadius: 15, width: 80, marginLeft: 0 }} />
          </Card.Content>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00b2ee",
    alignItems: "center",
    justifyContent: "center",
  },
  mainPanel: {
    flex: 1,
    backgroundColor: "#00b2ee",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 35,
  },
  panelButtons: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    width: 200,
    margin: 10,
  },
  patientList: {
    backgroundColor: "#b0e2ff",
    padding: 2,
    marginTop: '5%',
    borderRadius: 10,
    alignItems: "center",
  },
  patient: {
    flexDirection: "row",
    justifyContent: "flex",
    alignItems: "center",
    height: 60,
  },
  patientInf: {
    backgroundColor: "#b0e2ff",
    padding: 20,
    width: 300,
    height: 500,
    borderRadius: '50%',
    paddingLeft:'10%'},
  infoText: {
    marginVertical: 10,
    fontSize: 15,
  },
});
