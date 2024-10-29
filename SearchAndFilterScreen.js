
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Picker, ActivityIndicator, StyleSheet } from 'react-native';
import { db } from './FireBase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const SearchAndFilterScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'businesses'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setBusinesses(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = category ? business.category === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Businesses</Text>
      <TextInput
        placeholder="Search by name"
        placeholderTextColor="#8c8c8c"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />

      <Text style={styles.subtitle}>Filter by Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="All Categories" value="" />
        <Picker.Item label="Food" value="food" />
        <Picker.Item label="Fashion" value="fashion" />
        <Picker.Item label="Services" value="services" />
        {}
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#ff914d" />
      ) : (
        <FlatList
          data={filteredBusinesses}
          keyExtractor={(item) => item.contact}
          renderItem={({ item }) => (
            <View style={styles.businessCard}>
              <Text style={styles.businessName}>{item.name}</Text>
              <Text style={styles.businessCategory}>Category: {item.category}</Text>
              <Text style={styles.businessContact}>Contact: {item.contact}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginVertical: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  businessCard: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  businessCategory: {
    fontSize: 16,
    color: '#555',
  },
  businessContact: {
    fontSize: 16,
    color: '#555',
  },
});

export default SearchAndFilterScreen;
