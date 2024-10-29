import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { auth } from './FireBase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    setLoading(true);
    setMessage('');
    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>
      
      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#8c8c8c"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {message ? <Text style={styles.success}>{message}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Sending..." : "Send Reset Email"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.goBack}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#ff914d',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  goBack: {
    color: '#007bff',
    marginTop: 20,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
  success: {
    color: 'green',
    marginBottom: 15,
  },
});

export default ForgotPasswordScreen;
