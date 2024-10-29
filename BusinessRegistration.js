import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, ScrollView, FlatList } from 'react-native';
import { db, storage } from './FireBase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const API_KEY = '492251df9e724924a0ee153df596b99e';

const BusinessRegistration = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [category, setCategory] = useState('');
  const [contact, setContact] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    setFilteredBusinesses(
      businesses.filter((business) =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, businesses]);

  const fetchBusinesses = async () => {
    const querySnapshot = await getDocs(collection(db, 'businesses'));
    const businessList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBusinesses(businessList);
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const uploadImage = async () => {
    if (imageUri) {
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `business_logos/${filename}`);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      return getDownloadURL(storageRef);
    }
    return null;
  };

  const handleRegister = async () => {
    try {
      const imageUrl = await uploadImage();
      await addDoc(collection(db, 'businesses'), { name, address, category, contact, imageUrl });
      Alert.alert('Success', 'You have successfully registered your business!');
      fetchBusinesses();
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };

  const fetchAddressSuggestions = async (text) => {
    setAddress(text);
    if (text.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, { params: { q: text, key: API_KEY, limit: 5, countrycode: 'ZA' } });
      const suggestions = response.data.results.map(result => result.formatted);
      setAddressSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  const selectAddress = (suggestedAddress) => {
    setAddress(suggestedAddress);
    setAddressSuggestions([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Your Business</Text>

      <TextInput
        placeholder="Business Name"
        placeholderTextColor="#8c8c8c"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Address"
        placeholderTextColor="#8c8c8c"
        value={address}
        onChangeText={fetchAddressSuggestions}
        style={styles.input}
      />

      {addressSuggestions.length > 0 && (
        <FlatList
          data={addressSuggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => selectAddress(item)} style={styles.suggestion}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}

      <TextInput
        placeholder="Category"
        placeholderTextColor="#8c8c8c"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TextInput
        placeholder="Contact Number"
        placeholderTextColor="#8c8c8c"
        value={contact}
        onChangeText={setContact}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
        <Text style={styles.uploadButtonText}>Upload Business Logo</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register Business</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Search Businesses</Text>

      <TextInput
        placeholder="Search by name"
        placeholderTextColor="#8c8c8c"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
      />

      <FlatList
        data={filteredBusinesses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.businessCard}>
            <Text style={styles.businessName}>{item.name}</Text>
            <Text style={styles.businessInfo}>📍 {item.address}</Text>
            <Text style={styles.businessInfo}>📞 {item.contact}</Text>
            <Text style={styles.businessCategory}>{item.category}</Text>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.imagePreview} />}
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  suggestionsList: {
    width: '100%',
    maxHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  uploadButton: {
    backgroundColor: '#ff914d',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 10,
  },
  registerButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  businessCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  businessName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  businessInfo: {
    fontSize: 16,
    color: '#555',
  },
  businessCategory: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
    marginTop: 10,
  },
});

export default BusinessRegistration;
