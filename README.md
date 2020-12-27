# 4semjs-period3

## Learning goals

### Explain Pros & Cons with React Native + Expo used to implement a Mobile App for Android and IOS, compared to using the Native Tools/languages for the two platforms.
You don't have to reinvent the wheel. With React Native you have readily available components to build the app. Also, React Native is cross platform, so you don't need a different 		tech stack and language for each platform. The cons of multiplatform can be performance. Apps written for their native platform can be more optimized in some cases.

### What is meant by the React Native Paradigm "Learn once, write anywhere" compared to for example the original (now dead) idea with Java "Write Once, run everywhere".
With React, there isn't a huge difference between building web apps and writing mobile apps with Native once you have already learned React. With the old Java saying, it was meant 		that it could run on any platform that had the java virtual machine installed. However, as compilers and interpreters became better, this became obsolete.

### In React Native, which parts of your code gets compiled to Native Code (Widgets) and which parts do NOT?
	

### Explain the basic building block in a React Native Application and the difference(s) between a React Application and a React Native App.
React Native uses native components instead of web components as building blocks. For example to render an app, it uses the "View" component. 

### Explain and demonstrate ways to handle User Input in a React Native Application

We can use the ``` <TextInput>``` component as a form, and then use state to collect the data from the component

```javascript
const [userName, setUserName] = useState("");
const [password, setPassword] = useState("");

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

```

### Explain and demonstrate how to handle state in a React Native Application
See above example
### Explain and demonstrate how to communicate with external servers, in a React Native Application
We can use fetch to handle API requests
```javascript
async function fetchGameArea() {
    const res = await fetch(`${SERVER_URL}/geoapi/gamearea`).then((res) =>
      res.json()
    );
    return res.coordinates;
  }
```
### Explain and demonstrate how to use Native Device Features in a React Native/Expo app.
We can use the platform module to detect which platform the app is running on.

We can then use logic to implement platform specific code

```javascript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100
});
```

### Explain and demonstrate a React Native Client that uses geo-components (Location, MapView, etc.)
We can use the Map component from react-native-maps that uses either Google or Apple maps

With the Location module, we are able to request permission from the device to use it's location feature, that way, we are able to pinpoint our own location.

```javascript
 getLocationAsync = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMessage("Permission to access location was denied");
      return;
    }


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


```

### Demonstrate both server and client-side, of the geo-related parts of your implementation of the ongoing semester case.
Gamebackend : https://github.com/cprejler/gamebackend

Client: 
