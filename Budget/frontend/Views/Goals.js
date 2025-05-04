import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useState } from 'react';

export default function Goals() {
  const [goals, setGoals] = useState([]); // list of goals
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [addAmounts, setAddAmounts] = useState({}); 

  // adds a new goal
  const handleAddGoal = () => {
    // goal input validation
    if(
      !newGoalName || 
      !newGoalAmount || 
      isNaN(newGoalAmount)) 
      return;

    // new goal object 
    const newGoal = {
      id: Date.now(),
      name: newGoalName,
      amount: parseFloat(newGoalAmount),
      saved: 0
    };

    // add to goal's list
    setGoals([...goals, newGoal]);
    setNewGoalName('');
    setNewGoalAmount('');
    setModalVisible(false);
  };

  // add saved money to the goal
  const handleAddToSaved = (goalId) => {
    const amountToAdd = parseFloat(addAmounts[goalId]);
    // valid saved money amount 
    if(isNaN(amountToAdd) || amountToAdd <= 0) return;

    // update the goal
    const updatedGoals = goals.map(goal => {
      if(goal.id == goalId) {
        const newSaved = goal.saved + amountToAdd;
        return {...goal, saved: newSaved > goal.amount ? goal.amount : newSaved};
      }
      return goal;
    });

    setGoals(updatedGoals);
    setAddAmounts({...addAmounts, [goalId]: ''})
  }

  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Balance: $1,000.00</Text>

      <TouchableOpacity style={styles.addGoalButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addGoal}>Add New Goal</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollContainer}>
      {goals.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <Text style={styles.noGoals}>You haven't added any goals yet.</Text>
            <Text style={styles.noGoals}>Tap "Add New Goal" to get started!</Text>
          </View>
        ) : (
          goals.map((goal) => {
            const progress = Math.min((goal.saved / goal.amount) * 100, 100);
            return (
              <View key={goal.id} style={styles.goalContainer}>
                <View style={styles.goalCard}>
                  <Text style={styles.goalText}>{goal.name}</Text>
                  <Text style={styles.goalAmountText}>Goal: ${goal.amount.toFixed(2)}</Text>
                  <Text style={styles.goalSavedText}>Saved: ${goal.saved.toFixed(2)}</Text>
                  <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${progress}%` }]} />
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.inputSmall}
                      placeholder='Add money'
                      value={addAmounts[goal.id] || ''}
                      onChangeText={(value) => 
                        setAddAmounts({...addAmounts, [goal.id]: value})
                      }
                      keyboardType='numeric'
                    />
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleAddToSaved(goal.id)}
                    >
                      <Text style={styles.add}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal 
        transparent={true}
        visible={modalVisible}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Goal</Text>
            <TextInput
              style={styles.input}
              placeholder='Goal Name'
              value={newGoalName}
              onChangeText={setNewGoalName}
            />
            <TextInput
              style={styles.input}
              placeholder='Goal Amount'
              value={newGoalAmount}
              onChangeText={setNewGoalAmount}
              keyboardType='numeric'
            />
            <TouchableOpacity style={styles.addGoalButton} onPress={handleAddGoal}>
              <Text style={styles.addGoal}>Save Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent:'flex-start',
    paddingTop: 40,
  },
  balanceText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  addGoalButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    borderColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
    marginVertical: 10,
  },
  addGoal: {
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContainer: {
    width: '100%',
    shadowColor: '#77b3e7',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 100,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  goalContainer: {
    marginBottom: 10,
  },
  goalCard: {
    backgroundColor: '#c8d9e5',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    gap: 10,
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
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
  },
  input: {
    backgroundColor: '#F9F6EE',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: 200,
    marginTop: 10,
  },
  inputSmall: {
    backgroundColor: '#F9f6ee',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    width: 100,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  add: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10, 
    color: 'red',
  },
  noGoals: {
    fontSize: 16, 
    color: 'gray'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

