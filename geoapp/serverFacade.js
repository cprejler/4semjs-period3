import { SERVER_URL } from "./settings";
import { Base64 } from "js-base64";

ServerFacade = () => {
  async function fetchGameArea() {
    const res = await fetch(`${SERVER_URL}/api/geoAPI/gamearea`).then((res) =>
      res.json()
    );
    return res.coordinates;
  }

  async function isUserInArea(lon, lat) {
    const status = await fetch(
      `${SERVER_URL}/geoAPI/isuserinarea/${lon}/${lat}`
    ).then((res) => res.json());
    return status;
  }

  async function getPeopleInRadius(lat, lon, rad, username, password) {
    let headers = new Headers();
    headers.set(
      "Authorization",
      "Basic " + Base64.encode(username + ":" + password)
    );
    try {
      const url = `${SERVER_URL}/api/geoAPI/findNearbyPlayers/${lon}/${lat}/${rad}`;
      console.log(url);
      const status = await fetch(url, {
        method: "GET",
        headers: headers,
      }).then((res) => res.json());
      return status;
    } catch (err) {
      return false;
    }
  }

  async function nearbyPlayers(userName, password, lon, lat, distance) {
    const latitude = lat;
    const longitude = lon;
    const body = {
      userName,
      password,
      lon: longitude,
      lat: latitude,
      distance
    }
    const status = await fetch(`${SERVER_URL}/gameAPI/nearbyplayers`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json());
    return status;
  }

  return {
    fetchGameArea,
    isUserInArea,
    getPeopleInRadius,
    nearbyPlayers
  };
};

export default ServerFacade();