import React, { useEffect, useState } from 'react';
import { View, Button, Text, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, MapEvent } from 'react-native-maps';
import * as Location from 'expo-location';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function MapsScreen() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  const handleSelectLocation = (event: MapEvent) => {
    setLocation(event.nativeEvent.coordinate);
  };

  const handleGetCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
  };

  return (
    <View style={{ flex: 1 }}>
      {location ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleSelectLocation}
        >
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
        </MapView>
      ) : (
        <Text>{errorMsg || 'Loading map...'}</Text>
      )}
      <Button title="Get Current Location" onPress={handleGetCurrentLocation} />
    </View>
  );
}
