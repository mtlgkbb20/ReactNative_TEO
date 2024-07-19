import React, { createContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite/legacy';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export const DBContext = createContext();

export const DBProvider = ({ children }) => {
    const [db, setDb] = useState(null);

    useEffect(() => {
        const initDatabase = async () => {
            const dbFileName = 'fiziktedavi.db';
            const dbAssetPath = `${FileSystem.documentDirectory}SQLite/${dbFileName}`;
            const asset = Asset.fromModule(require('../assets/fiziktedavi.db'));

            try {
                // Check if the database file exists in the app's document directory
                const dbFileExists = await FileSystem.getInfoAsync(dbAssetPath);
                if (!dbFileExists.exists) {
                    // If not, copy it from the asset folder
                    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite', { intermediates: true });
                    await FileSystem.downloadAsync(asset.uri, dbAssetPath);
                }
                const db = SQLite.openDatabase(dbFileName);
                setDb(db);

                db.transaction(tx => {
                    // Drop tables for testing purposes
                    //tx.executeSql('DROP TABLE IF EXISTS Login;');
                    //tx.executeSql('DROP TABLE IF EXISTS User;');
                    //tx.executeSql('DROP TABLE IF EXISTS Patients;');
                    //tx.executeSql('DROP TABLE IF EXISTS Therapists;');
                    //tx.executeSql('DROP TABLE IF EXISTS Sessions;');
                    //tx.executeSql('DROP TABLE IF EXISTS Messages;');
                    // Create Login table
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS Login (
                            username TEXT NOT NULL, 
                            password TEXT NOT NULL,
                            logType TEXT NOT NULL
                        );`,
                        [],
                        () => console.log('Login table created successfully'),
                        (_, error) => console.error('Error creating Login table: ', error)
                    );
                    //user table
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS User (
                            id INTEGER PRIMARY KEY AUTOINCREMENT, 
                            username TEXT NOT NULL,
                            name TEXT NOT NULL, 
                            surname TEXT NOT NULL,
                            age INTEGER NOT NULL, 
                            phone TEXT NOT NULL,
                            mail TEXT NOT NULL
                        );`,
                        [],
                        () => console.log('User table created successfully'),
                        (_, error) => console.error('Error creating User table: ', error)
                    );

                    // Create Patients table
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS Patients (
                            id INTEGER PRIMARY KEY NOT NULL, 
                            therapistId INTEGER NOT NULL,
                            condition TEXT NOT NULL,
                            Foreign Key (id) references User(id)
                        );`,
                        [],
                        () => console.log('Patients table created successfully'),
                        (_, error) => console.error('Error creating Patients table: ', error)
                    );

                    // Create Therapists table
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS Therapists (
                            id INTEGER PRIMARY KEY NOT NULL, 
                            specialty TEXT NOT NULL,
                            Foreign Key (id) references User(id)
                        );`,
                        [],
                        () => console.log('Therapists table created successfully'),
                        (_, error) => console.error('Error creating Therapists table: ', error)
                    );

                    // Create Sessions table
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS Sessions (
                            id INTEGER PRIMARY KEY Autoincrement, 
                            patientId INTEGER NOT NULL, 
                            therapistId INTEGER NOT NULL, 
                            date TEXT NOT NULL,
                            FOREIGN KEY (patientId) REFERENCES Patients (id),
                            FOREIGN KEY (therapistId) REFERENCES Therapists (id)
                        );`,
                        [],
                        () => console.log('Sessions table created successfully'),
                        (_, error) => console.error('Error creating Sessions table: ', error)
                    );

                    // Create Treatments table
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS Messages (
                            id INTEGER PRIMARY KEY AUTOINCREMENT, 
                            patientId INTEGER NOT NULL, 
                            therapistId INTEGER NOT NULL, 
                            content TEXT NOT NULL, 
                            messageDate TEXT NOT NULL,
                            sender TEXT NOT NULL,
                            receiver TEXT NOT NULL,
                            FOREIGN KEY (patientId) REFERENCES Patients (id),
                            FOREIGN KEY (therapistId) REFERENCES Therapists (id)
                        );`,
                        [],
                        () => console.log('Treatments table created successfully'),
                        (_, error) => console.error('Error creating Treatments table: ', error)
                    );

                });
            } catch (error) {
                console.error('Error initializing database: ', error);
            }
        };

        initDatabase();
    }, []);

    return (
        <DBContext.Provider value={{ db, setDb }}>
            {children}
        </DBContext.Provider>
    );
};
