import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';

export default function Login({navigation}) {
  return (
    <View style={styles.container}>
        <View style={styles.loginContainer}>
            <Text style={styles.title}>Login</Text>
            <TextInput style={styles.input} placeholder='Email'></TextInput>
            <TextInput style={styles.input} placeholder='Password'></TextInput> 
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>
        </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 24,
  },
  loginContainer: {
    backgroundColor: '#c8d9e6',
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    borderColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 20,
  },
  input: {
    padding: 10,
    height: 48,
    width: 320,
    backgroundColor: 'white',
    margin: 16,
  },
});