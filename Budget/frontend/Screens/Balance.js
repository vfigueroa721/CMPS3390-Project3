import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';

export default function Balance() {
  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>You have: $1,000.00</Text>
      <View style={styles.inputColumn}>
        <TextInput
          style={styles.input}
          placeholder='Enter new bill name'
        />
        <TextInput
          style={styles.input}
          placeholder='Enter bill amount'
          keyboardType='numeric'
        />
        <TouchableOpacity
          style={styles.addBillButton}
        >
          <Text style={styles.add}>Add Bill</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Expenses</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        
        <View style={styles.billContainer}>
          <View style={styles.billCard}>
            <Text style={styles.billText}>
              Groceries: $150.00
            </Text>
            <Text style={styles.addedText}>
              Money added for this bill: $0.00
            </Text>
            <TextInput
              style={styles.input}
              placeholder='Enter an amount to add'
              keyboardType='numeric'
            />
          </View>
        </View>
        <View style={styles.billContainer}>
          <View style={styles.billCard}>
            <Text style={styles.billText}>
              Car Payment: $450.00
            </Text>
            <Text style={styles.addedText}>
              Money added for this bill: $0.00
            </Text>
            <TextInput
              style={styles.input}
              placeholder='Enter an amount to add'
              keyboardType='numeric'
            />
          </View>
        </View>
        <View style={styles.billContainer}>
          <View style={styles.billCard}>
            <Text style={styles.billText}>
              Phone Bill: $50.00
            </Text>
            <Text style={styles.addedText}>
              Money added for this bill: $0.00
            </Text>
            <TextInput
              style={styles.input}
              placeholder='Enter an amount to add'
              keyboardType='numeric'
            />
          </View>
        </View>
        <View style={styles.billContainer}>
          <View style={styles.billCard}>
            <Text style={styles.billText}>
              Groceries: $150.00
            </Text>
            <Text style={styles.addedText}>
              Money added for this bill: $0.00
            </Text>
            <TextInput
              style={styles.input}
              placeholder='Enter an amount to add'
              keyboardType='numeric'
            />
          </View>
        </View>
      </ScrollView>
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
  balanceText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 18,
  },
  billText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addedText: {
    fontSize: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputColumn: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: '#F9F6EE',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: 200,
  },
  addBillButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    borderColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 70,
  },
  scrollContainer: {
    marginTop: 10,
    width: '100%',
    height: '100%',
    shadowColor: '#77b3e7',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 100,
    paddingHorizontal: 30,
    paddingVertical: 10,
    
  },
  billCard: {
    backgroundColor: '#c8d9e5',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
});