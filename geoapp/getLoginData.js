import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import facade from "./serverFacade";

export default function GetLoginData(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [distance, setDistance] = useState("");
  const { visible, onClose, positions, setOtherPlayers } = props;

  const submit = () => {
    const loginData = { userName, password, distance };
    getOtherPlayers(
      loginData.userName,
      loginData.password,
      distance,
      positions
    );
    setUserName("");
    setPassword("");
    setDistance("");
  };

  async function getOtherPlayers(username, password, radius, position) {
    const lon = position.longitude;
    const lat = position.latitude;
    try {
      const people = await facade.getPeopleInRadius(
        lat,
        lon,
        radius,
        username,
        password
      );
      if (people.length == 0) {
        onClose();
        setTimeout(function () {
          Alert.alert(
            `Sucessfully logged in, but there are currently no players within ${radius} meters.`
          );
        }, 1000);
      } else if (people == false) {
        Alert.alert("Wrong password, please try again");
      } else {
        setOtherPlayers(people);
        Alert.alert("Successfully logged in");
        onClose();
      }
    } catch (err) {
      const msg = `${JSON.stringify(err)}`;
      Alert.alert("Something went wrong", msg);
    }
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Username"
          value={userName}
          onChangeText={(txt) => setUserName(txt)}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter Password"
          secureTextEntry={true}
          value={password}
          style={styles.input}
          onChangeText={(txt) => setPassword(txt)}
        />
        <TextInput
          placeholder="Enter Radius (in meters)"
          value={distance}
          keyboardType="numeric"
          style={styles.input}
          onChangeText={(txt) => setDistance(txt)}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title="CANCEL" color="red" onPress={onClose} />
          </View>
          <View style={styles.button}>
            <Button title="ADD" onPress={submit} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  button: {
    width: "40%",
  },
});