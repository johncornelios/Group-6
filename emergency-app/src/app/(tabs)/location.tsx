
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

export default function LocationScreen() {
  const router = useRouter();

  const [location, setLocation] =
    useState<Location.LocationObject | null>(null);

  const [address, setAddress] = useState("Locating...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Automatically locate the user
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    setLoading(true);
    setError("");

    try {
      // Ask permission to access GPS
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setError(
          "Location permission denied. Please enable location access."
        );
        return;
      }

      // Get current GPS coordinates
      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      setLocation(currentLocation);

      // Try to get an approximate address
      try {
        const addresses =
          await Location.reverseGeocodeAsync({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });

        if (addresses.length > 0) {
          const place = addresses[0];

          const fullAddress = [
            place.street,
            place.city,
            place.region,
            place.country,
          ]
            .filter(Boolean)
            .join(", ");

          setAddress(
            fullAddress || "Address unavailable"
          );
        } else {
          setAddress("Address unavailable");
        }
      } catch {
        setAddress("Address unavailable");
      }
    } catch (err) {
      console.error("GPS Error:", err);
      setError(
        "Unable to detect your location. Please check GPS or browser permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  const openMap = () => {
    if (!location) return;

    const { latitude, longitude } = location.coords;

    const url = Platform.select({
      ios: `https://maps.apple.com/?ll=${latitude},${longitude}`,
      default: `https://www.google.com/maps?q=${latitude},${longitude}`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        setError("Unable to open the map.");
      });
    }
  };

  return (
    <View style={styles.screen}>

      {/* BACK BUTTON HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            ← Back
          </Text>
        </TouchableOpacity>
      </View>

      {/* GPS LOCATION CONTENT */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.icon}>📍</Text>

        <Text style={styles.title}>
          GPS Location
        </Text>

        <Text style={styles.subtitle}>
          Automatically detecting your current location
        </Text>

        {loading ? (
          <View style={styles.card}>
            <ActivityIndicator
              size="large"
              color="#B91C1C"
            />

            <Text style={styles.loadingText}>
              Getting your GPS location...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.card}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : location ? (
          <View style={styles.card}>
            <Text style={styles.successText}>
              ✓ Location Detected
            </Text>

            <Text style={styles.label}>
              LATITUDE
            </Text>

            <Text style={styles.value}>
              {location.coords.latitude.toFixed(6)}
            </Text>

            <Text style={styles.label}>
              LONGITUDE
            </Text>

            <Text style={styles.value}>
              {location.coords.longitude.toFixed(6)}
            </Text>

            <Text style={styles.label}>
              GPS ACCURACY
            </Text>

            <Text style={styles.value}>
              {location.coords.accuracy != null
                ? `± ${location.coords.accuracy.toFixed(1)} meters`
                : "Unavailable"}
            </Text>

            <Text style={styles.label}>
              APPROXIMATE ADDRESS
            </Text>

            <Text style={styles.address}>
              {address}
            </Text>

            <TouchableOpacity
              style={styles.mapButton}
              onPress={openMap}
            >
              <Text style={styles.buttonText}>
                🗺️ View on Map
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={getLocation}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            🔄 Refresh GPS Location
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Your location is accessed only after you
          grant permission. GPS accuracy depends
          on your device and surroundings.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  // BACK BUTTON HEADER
  header: {
    width: "100%",
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "flex-start",
  },

  backButton: {
    backgroundColor: "#FFE2E2",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    color: "#C5161D",
    fontSize: 14,
    fontWeight: "bold",
  },

  scrollView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 55,
    marginBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 420,
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },

  loadingText: {
    marginTop: 15,
    color: "#6B7280",
    textAlign: "center",
  },

  successText: {
    color: "#16A34A",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },

  label: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 12,
  },

  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 5,
    textAlign: "center",
  },

  address: {
    fontSize: 15,
    color: "#111827",
    marginTop: 8,
    textAlign: "center",
  },

  mapButton: {
    backgroundColor: "#B91C1C",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    width: "100%",
    alignItems: "center",
  },

  refreshButton: {
    backgroundColor: "#B91C1C",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 15,
    textAlign: "center",
  },

  note: {
    color: "#9CA3AF",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    maxWidth: 350,
  },
});
