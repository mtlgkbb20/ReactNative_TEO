import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './components/HomeScreen';
import HomeExercise from './components/HomeExercise';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './components/Settings';
import Login from './components/Login';
import Profile from './components/Profile';
import WriteToPhysio from './components/WriteToPhysio';
import Notifications from './components/Notifications';
import History from './components/History';
import Register from './components/Register';
import { UserProvider } from './components/UserContext';
import { DBProvider } from './components/DBContext';
import AdminPanel from './components/AdminPanel';
import PatientList from './components/PatientList';
import Information from './components/Information';
import MenuItems from './components/MenuItems';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <DBProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="HomeExercise" component={HomeExercise} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
            <Stack.Screen name="History" component={History} options={{ headerShown: false }} />
            <Stack.Screen name="WriteToPhysio" component={WriteToPhysio} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            <Stack.Screen name="AdminPanel" component={AdminPanel} options={{ headerShown: false }} />
            <Stack.Screen name="PatientList" component={PatientList} options={{ headerShown: false }} />
            <Stack.Screen name="Information" component={Information} options={{ headerShown: false }} />
            <Stack.Screen name="MenuItems" component={MenuItems} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </DBProvider>
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
