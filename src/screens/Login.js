import React, { useEffect } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";
import CustomButton from '../utils/CustomButton';
// import AsyncStorage from "@react-native-async-storage/async-storage";
import SQLite from 'react-native-sqlite-storage';
import { useSelector, useDispatch } from 'react-redux';
import { setName } from "../redux/actions";
import PushNotification from "react-native-push-notification";

const db = SQLite.openDatabase(
    {
        name: 'MainDB',
        location: 'default',
    },
    () => { },
    error => { console.log(error) }
);

export default function Login({ navigation }) {

    const { name } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    // const [name, setName] = useState('')

    useEffect(() => {
        createTable();
        getData();
        createChannels();
    }, []);

    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "Users "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT);"
            )
        })
    }

    const createChannels = () => {
        PushNotification.createChannel({
            channelId: "test-channel",
            channelName: "Test Channel"
        }
        )
    }

    const getData = () => {
        try {
            //  AsyncStorage.getItem('UserName')
            //      .then(value => {
            //         if (value != null) {
            //             navigation.navigate('Home')
            //         }
            //     })
            db.transaction((tx) => {
                "SELECT Name FROM Users",
                    [],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            navigation.navigate('Home');
                        }
                    }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const setData = async () => {
        if (name.length == 0) {
            Alert.alert('Warning!', 'Please write your name!')
        } else {
            try {
                dispatch(setName(name));
                // await AsyncStorage.setItem('UserName', name);
                await db.transaction(async (tx) => {
                    await tx.executeSql(
                        "INSERT INTO Users (Name) VALUES (?)",
                        [name]
                    );
                })
                navigation.navigate('Home');
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <View style={styles.body}>
            <Image
                style={styles.logo}
                source={require('../../assets/asyncstorage.png')}
            />
            <Text style={styles.text}>
                Async Storage
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                onChangeText={(value) => dispatch(setName(value))}
            />
            <CustomButton
                title='Login'
                onPressFunction={setData}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#0080ff',
    },
    logo: {
        width: 100,
        height: 100,
        margin: 20
    },
    text: {
        fontSize: 30,
        color: '#ffffff',
        marginBottom: 100
    },
    input: {
        width: 300,
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10,
    }
})