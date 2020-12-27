
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Constants from "expo-constants";
import facade from "./serverFacade";
import GetLoginData from "./getLoginData";
import { StatusBar } from "expo-status-bar";
import NearbyModal from "./components/NearbyPlayersModal";

const MyButton = ({ txt, onPressButton }) => {
  return (
    <TouchableHighlight style={styles.touchable} onPress={onPressButton}>
      <Text style={styles.touchableTxt}>{txt}</Text>
    </TouchableHighlight>
  );
};

export default App = () => {
  //HOOKS
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [errorMessage, setErrorMessage] = useState(null);
  const [gameArea, setGameArea] = useState([]);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [region, setRegion] = useState(null);
  const [serverIsUp, setServerIsUp] = useState(false);
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [teamPositions, setTeamPositions] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  let mapRef = useRef(null);

  function teamPositionHandler(teamPositions) {
    setTeamPositions(teamPositions);
  }

  useEffect(() => {
    getLocationAsync();
    getGameArea();
  }, []);

  async function getGameArea() {
    try {
      const area = await facade.fetchGameArea();
      setGameArea(area);
      setServerIsUp(true);
    } catch (err) {
      setErrorMessage("Could not fetch GameArea");
    }
  }

  getLocationAsync = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMessage("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    setPosition({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  /*
  When a press is done on the map, coordinates (lat,lon) are provided via the event object
  */
  onMapPress = async (event) => {
    if (event.nativeEvent.coordinate != undefined) {
      //Get location from where user pressed on map, and check it against the server
      const coordinate = event.nativeEvent.coordinate;
      const lon = coordinate.longitude;
      const lat = coordinate.latitude;
      try {
        const status = await facade.isUserInArea(lon, lat);
        showStatusFromServer(setStatus, status);
      } catch (err) {
        Alert.alert("Error", "Server could not be reached");
        setServerIsUp(false);
      }
    }
  };

  onCenterGameArea = () => {
    //Hardcoded, should be calculated as center of polygon received from server
    const latitude = 55.777055745928664;
    const longitude = 12.55897432565689;
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.04,
      },
      1000
    );
  };

  sendRealPosToServer = async () => {
    const lat = position.latitude;
    const lon = position.longitude;
    try {
      const status = await facade.isUserInArea(lon, lat);
      showStatusFromServer(setStatus, status);
    } catch (err) {
      setErrorMessage("Could not get result from server");
      setServerIsUp(false);
    }
  };

  const [showLoginDialog, setShowLoginDialog] = useState(true);

  const closeLoginDataDialog = () => {
    setShowLoginDialog(false);
  };

  const updateOtherPlayers = useCallback(
    (props) => {
      setOtherPlayers(props);
    },
    [setOtherPlayers]
  );

  const showCreator = () => {
    Alert.alert("Casper Prejler \n cph-cp277 \n - CPHBusiness");
  };

  const info = serverIsUp ? status : " Server is not up";
  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      {!region && <Text style={styles.fetching}>.. Fetching data</Text>}

      {region && position.longitude != undefined && (
        <MapView
          ref={mapRef}
          style={{ flex: 14 }}
          onPress={onMapPress}
          mapType="standard"
          region={region}
        >
          {/*App MapView.Polygon to show gameArea*/}
          {serverIsUp && (
            <MapView.Polygon
              coordinates={gameArea}
              strokeWidth={1}
              onPress={onMapPress}
              fillColor="rgba(128, 153, 177, 0.5)"
            />
          )}

          {/*App MapView.Marker to show users current position*/}
          <MapView.Marker
            coordinate={{
              longitude: position.longitude,
              latitude: position.latitude,
              title: "You are here",
            }}
            description={"This is where you are currently located."}
          />
          {otherPlayers.map((marker, index) => (
            <MapView.Marker
              key={index}
              coordinate={{
                longitude: marker.geometry.coordinates[0],
                latitude: marker.geometry.coordinates[1],
                title: marker.properties.name,
              }}
              description={marker.properties.name}
              // Didn't show on adroid it seems only iphone
              //pinColor={"#000000"}
              pinColor={"green"}
            />
          ))}
        </MapView>
      )}

      <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>
        Your position (lat,long): {position.latitude}, {position.longitude}
      </Text>
      <Text style={{ flex: 1, textAlign: "center" }}>{info}</Text>

      <MyButton
        style={{ flex: 2 }}
        onPressButton={sendRealPosToServer}
        txt="Upload real Position"
      />

      <MyButton
        style={{ flex: 2 }}
        onPressButton={() => onCenterGameArea()}
        txt="Show Game Area"
      />
      <MyButton
        style={{ flex: 2 }}
        onPressButton={() => showCreator()}
        txt="Show Author"
      />

      <Button title="login" onPress={() => setShowLoginDialog(true)} />
      <GetLoginData
        visible={showLoginDialog}
        onClose={closeLoginDataDialog}
        positions={position}
        setOtherPlayers={updateOtherPlayers}
      />
      <StatusBar style="auto" />
      {!loggedIn && (
        <View>
          <MyButton
            style={{ flex: 2 }}
            txt="Check for nearby players"
            onPressButton={() => setShowModal(true)}
          />
          <NearbyModal
            visible={showModal}
            setVisible={setShowModal}
            position={position}
            onSearch={teamPositionHandler}
          />
        </View>
      )
      }

    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
  },
  touchable: { backgroundColor: "#4682B4", margin: 3 },
  touchableTxt: { fontSize: 22, textAlign: "center", padding: 5 },

  fetching: {
    fontSize: 35,
    flex: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center",
  },
});

function showStatusFromServer(setStatus, status) {
  setStatus(status.msg);
  setTimeout(() => setStatus("- - - - - - - - - - - - - - - - - - - -"), 3000);
}

