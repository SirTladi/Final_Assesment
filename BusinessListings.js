import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { db } from './FireBase';
import { collection, getDocs } from 'firebase/firestore';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';

const BusinessListings = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'businesses'));
        const businessList = querySnapshot.docs.map(doc => doc.data());
        setBusinesses(businessList);
        setFilteredBusinesses(businessList);
      } catch (error) {
        console.log("Error fetching businesses: ", error);
      } finally {
        setLoading(false);
      }
    };

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    };

    fetchBusinesses();
    getLocation();
  }, []);

  useEffect(() => {
    filterAndSortBusinesses();
  }, [searchTerm, selectedCategory, userLocation]);

  const filterAndSortBusinesses = () => {
    let filteredList = businesses;

    if (searchTerm) {
      filteredList = filteredList.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredList = filteredList.filter(business => business.category === selectedCategory);
    }

    if (userLocation) {
      filteredList.sort((a, b) => {
        const distanceA = calculateDistance(userLocation, a.location);
        const distanceB = calculateDistance(userLocation, b.location);
        return distanceA - distanceB;
      });
    }

    setFilteredBusinesses(filteredList);
  };

  const calculateDistance = (userLocation, businessLocation) => {
    const R = 6371;
    const dLat = toRad(businessLocation.latitude - userLocation.latitude);
    const dLon = toRad(businessLocation.longitude - userLocation.longitude);
    const lat1 = toRad(userLocation.latitude);
    const lat2 = toRad(businessLocation.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const toRad = (value) => value * Math.PI / 180;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Businesses</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <Picker
        selectedValue={selectedCategory}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="All Categories" value="" />
        <Picker.Item label="Restaurant" value="Restaurant" />
        <Picker.Item label="Store" value="Store" />
        <Picker.Item label="Service" value="Service" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
      ) : filteredBusinesses.length > 0 ? (
        <FlatList
          data={filteredBusinesses}
          keyExtractor={(item) => item.contact}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.businessImage} />}
              <Text style={styles.businessName}>{item.name}</Text>
              <Text style={styles.businessInfo}>📍 {item.address}</Text>
              <Text style={styles.businessInfo}>📞 {item.contact}</Text>
              <Text style={styles.businessCategory}>{item.category}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noDataText}>No businesses found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  businessImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  businessName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  businessInfo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  businessCategory: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    backgroundColor: '#e0f0ff',
  },
  noDataText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default BusinessListings;
