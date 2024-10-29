import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from './FireBase';
import { collection, getDocs } from 'firebase/firestore';

const BusinessListings = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'businesses'));
        const businessList = querySnapshot.docs.map(doc => doc.data());
        setBusinesses(businessList);
      } catch (error) {
        console.log("Error fetching businesses: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Businesses</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : businesses.length > 0 ? (
        <FlatList
          data={businesses}
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
  listContainer: {
    paddingBottom: 20,
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
    marginTop: 20,
  },
});

export default BusinessListings;
