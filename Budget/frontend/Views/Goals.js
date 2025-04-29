import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';

export default function Goals() {
  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Balance: $1,000.00</Text>
      <View style={styles.inputColumn}>
        <TextInput
          style={styles.input}
          placeholder='Goal Name'
          value=''
        />
        <TextInput
          style={styles.input}
          placeholder='Goal Amount'
          value=''
        />
        <TouchableOpacity style={styles.addGoalButton}>
          <Text style={styles.addGoal}>Add Goal</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.goalContainer}>
          <View style={styles.goalCard}>
            <Text style={styles.goalText}>Vacation</Text>
            <Text style={styles.goalAmountText}>Goal: $1,000.00</Text>
            <Text style={styles.goalSavedText}>Saved: $500.00</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
              </View>
            </View>
            <View style={styles.inputRow}>
            <TextInput 
              style={styles.input} 
              placeholder='Amount to add'
              value=''
            />
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.add}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
        <View style={styles.goalContainer}>
          <View style={styles.goalCard}>
            <Text style={styles.goalText}>New Car</Text>
            <Text style={styles.goalAmountText}>Goal: $3,000.00</Text>
            <Text style={styles.goalSavedText}>Saved: $1,000.00</Text>
            <View style={styles.inputRow}>
            <TextInput 
              style={styles.input} 
              placeholder='Amount to add'
              value=''
            />
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.add}>Add</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
        <View style={styles.goalContainer}>
          <View style={styles.goalCard}>
            <Text style={styles.goalText}>House</Text>
            <Text style={styles.goalAmountText}>Goal: $10,000.00</Text>
            <Text style={styles.goalSavedText}>Saved: $5,0000.00</Text>
            <View style={styles.inputRow}>
            <TextInput 
              style={styles.input} 
              placeholder='Amount to add'
              value=''
            />
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.add}>Add</Text>
            </TouchableOpacity>
          </View>
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
  inputColumn: {
    gap: 10,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: '#F9F6EE',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: 200,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addGoalButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    borderColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 80,
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
  goalText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  goalAmountText: {
    fontSize: 15,
  },
  goalSavedText: {
    fontSize: 15,
    color: 'blue',
  },
  goalCard: {
    backgroundColor: '#c8d9e5',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
  addButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    borderColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 50,
    marginLeft: 10,
    alignItems: 'center',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '50%',
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
  },
});