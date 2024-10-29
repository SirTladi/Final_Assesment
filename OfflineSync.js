
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from './FireBase';
import { collection, addDoc, onSnapshot, enableNetwork, disableNetwork } from 'firebase/firestore';

const OfflineSync = () => {
  const [businesses, setBusinesses] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    const q = collection(db, 'businesses');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setBusinesses(data);
    });
    return unsubscribe;
  }, []);

  const toggleOfflineMode = async () => {
    if (offlineMode) {
      await enableNetwork(db);
      Alert.alert('Online', 'Data syncing is now enabled.');
    } else {
      await disableNetwork(db);
      Alert.alert('Offline', 'You are now in offline mode.');
    }
    setOfflineMode(!offlineMode);
  };

  const handleAddBusiness = async () => {
    if (!name || !category) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'businesses'), { name, category });
      Alert.alert('Success', 'Business added successfully');
      setName('');
      setCategory('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add business. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleOfflineMode}>
        <Text style={styles.toggleButtonText}>{offlineMode ? "Go Online" : "Go Offline"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Add a Business</Text>
      <TextInput
        placeholder="Business Name"
        placeholderTextColor="#8c8c8c"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Category"
        placeholderTextColor="#8c8c8c"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#ff914d" />
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={handleAddBusiness}>
          <Text style={styles.addButtonText}>Add Business</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.listTitle}>Businesses</Text>
      <FlatList
        data={businesses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.businessCard}>
            <Text style={styles.businessName}>{item.name}</Text>
            <Text style={styles.businessCategory}>Category: {item.category}</Text>
          </View>
        )}
      />
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
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
  toggleButton: {
    alignSelf: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#ff914d',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
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
});

export default OfflineSync;
