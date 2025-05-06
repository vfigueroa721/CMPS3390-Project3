import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Modal, Alert,Platform, Keyboard } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//const API_URL = 'http://136.168.86.24:5000/api/goals';//school
const API_URL = 'http://192.168.1.33:5000/api/goals';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [addAmounts, setAddAmounts] = useState({});
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      //const balanceRes = await axios.get('http://136.168.86.24:5000/api/user/balance', {//school
        const balanceRes = await axios.get('http://192.168.1.33:5000/api/user/balance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(balanceRes.data.balance);

      const goalsRes = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const loadedGoals = goalsRes.data.map(goal => ({
        id: goal._id,
        name: goal.name,
        amount: goal.goalAmount,
        saved: goal.saved || 0,
      }));
      setGoals(loadedGoals);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoalName || !newGoalAmount || isNaN(newGoalAmount)) return;

    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.post(API_URL, {
        name: newGoalName,
        goalAmount: parseFloat(newGoalAmount),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const savedGoal = res.data;
      setGoals([...goals, {
        id: savedGoal._id,
        name: savedGoal.name,
        amount: savedGoal.goalAmount,
        saved: savedGoal.saved || 0,
      }]);

      setNewGoalName('');
      setNewGoalAmount('');
      setModalVisible(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleAddToSaved = async (goalId) => {
    const amountToAdd = parseFloat(addAmounts[goalId]);
    if (isNaN(amountToAdd) || amountToAdd <= 0) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.put(`${API_URL}/save`, {
        goalId,
        amount: amountToAdd
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedGoals = goals.map(goal =>
        goal.id === goalId ? { ...goal, saved: res.data.saved } : goal
      );
      setGoals(updatedGoals);
      setBalance(res.data.balance);
      setAddAmounts({ ...addAmounts, [goalId]: '' });
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Could not update goal');
    }
  };

  const handleDeleteGoal = (goalId) => {
    console.log('Delete button pressed for goal:', goalId);
    Keyboard.dismiss();
  
    if (Platform.OS === 'web') {
      const confirm = window.confirm('Are you sure you want to delete this goal? Saved money will be restored to your balance.');
      if (confirm) {
        runDelete(goalId); // helper below
      }
    } else {
      setTimeout(() => {
        Alert.alert(
          'Delete Goal',
          'Are you sure you want to delete this goal? Saved money will be restored to your balance.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => runDelete(goalId),
            },
          ]
        );
      }, 100);
    }
  };
  
  const runDelete = async (goalId) => {
    console.log('User confirmed deletion');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.delete(`${API_URL}/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Delete response:', res.data);
  
      if (res.status === 200) {
        setGoals(goals.filter(goal => goal.id !== goalId));
        setBalance(res.data.updatedBalance);
        if (Platform.OS !== 'web') {
          Alert.alert('Success', res.data.message);
        } else {
          alert(res.data.message); // Fallback for web
        }
      } else {
        alert('Could not delete goal');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Server error');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Balance: ${balance.toFixed(2)}</Text>

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
          goals.map(goal => {
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
                      onChangeText={val => setAddAmounts({ ...addAmounts, [goal.id]: val })}
                      keyboardType='numeric'
                    />
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddToSaved(goal.id)}>
                      <Text style={styles.add}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteGoal(goal.id)}
                  >
                    <Text style={styles.deleteText}>Delete Goal</Text>
                  </TouchableOpacity>
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
              placeholderTextColor="#ccc"
            />
            <TextInput
              style={styles.input}
              placeholder='Goal Amount'
              value={newGoalAmount}
              onChangeText={setNewGoalAmount}
              keyboardType='numeric'
              placeholderTextColor="#ccc"
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
  container: { flex: 1, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    paddingTop: 40 
  },
  balanceText: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    marginBottom: 18 
  },
  addGoalButton: { 
    backgroundColor: 'rgba(64, 131, 180, 0.68)', 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    width: 150, 
    alignItems: 'center', 
    marginVertical: 10 
  },
  addGoal: { 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  scrollContainer: { 
    width: '100%', 
    paddingHorizontal: 30, 
    paddingVertical: 20 
  },
  goalContainer: { 
    marginBottom: 10 
  },
  goalCard: { 
    backgroundColor: '#c8d9e5', 
    padding: 15, 
    borderRadius: 8, 
    width: '100%', 
    gap: 10 
  },
  goalText: { 
    color: 'black', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  goalAmountText: { 
    fontSize: 15 
  },
  goalSavedText: { 
    fontSize: 15, 
    color: 'blue' 
  },
  progressBarContainer: { 
    height: 10, 
    backgroundColor: '#e0e0e0', 
    borderRadius: 5, 
    marginBottom: 10, 
    overflow: 'hidden' 
  },
  progressBar: { 
    height: '100%', 
    backgroundColor: 'rgba(64, 131, 180, 0.68)' 
  },
  input: { 
    backgroundColor: '#F9F6EE', 
    borderWidth: 1, 
    borderRadius: 10, 
    padding: 10, 
    width: 200, 
    marginTop: 10 
  },
  inputSmall: { 
    backgroundColor: '#F9f6ee', 
    borderWidth: 1, 
    borderRadius: 5, 
    padding: 8, 
    width: 100 
  },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  addButton: { 
    backgroundColor: 'rgba(64, 131, 180, 0.68)', 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    orderRadius: 10, 
    marginLeft: 10, 
    alignItems: 'center' 
  },
  add: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  cancelButton: { 
    marginTop: 10, 
    color: 'red' 
  },
  noGoals: { 
    fontSize: 16, 
    color: 'gray' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 10, 
    alignItems: 'center', 
    width: '80%' 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  noGoals: {
    fontSize: 16, 
    color: 'gray'
  }
});
