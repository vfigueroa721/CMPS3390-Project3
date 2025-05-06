import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Modal,
  Keyboard, TouchableWithoutFeedback, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
const BASE_URL = 'http://192.168.1.33:5000';

export default function Balance() {
  const [balance, setBalance] = useState(0);
  const [bills, setBills] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [balanceModalVisible, setBalanceModalVisible] = useState(false);
  const [tempBalance, setTempBalance] = useState('');

  const [newBillName, setNewBillName] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingBillId, setEditingBillId] = useState(null);

  const [addAmount, setAddAmount] = useState({});
  const [sortOption, setSortOption] = useState('name');
  const [sortAscending, setSortAscending] = useState(true);

  const parsedBalance = parseFloat(balance) || 0;

  const totalPaid = bills.reduce((sum, b) => sum + b.added, 0).toFixed(2);
  const totalRemaining = bills.reduce((sum, b) => sum + (b.amount - b.added), 0).toFixed(2);

  useEffect(() => {
    fetchBalance();
    fetchBills();
  }, []);
  
  const fetchBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/user/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.balance);
    } catch (err) {
      showAlert('Error', 'Failed to fetch balance');
    }
  };
  
  const syncBalanceToBackend = async (newBalance) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`${BASE_URL}/api/user/balance`, {
        balance: newBalance,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // ✅ Get fresh balance from server
      const updated = await axios.get(`${BASE_URL}/api/user/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setBalance(parseFloat(updated.data.balance));
    } catch (err) {
      showAlert('Error', 'Failed to update balance on server');
    }
  };
  
  
  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      import('react-native').then(({ Alert }) => Alert.alert(title, message));
    }
  };

  const showConfirm = (title, message, onConfirm) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    } else {
      import('react-native').then(({ Alert }) =>
        Alert.alert(title, message, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: onConfirm },
        ])
      );
    }
  };

  const fetchBills = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/bills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBills(res.data);
    } catch (err) {
      showAlert('Error', 'Failed to load bills');
    }
  };

  const handleAddOrEditBill = async () => {
    const parsedAmount = parseFloat(newBillAmount);
    if (!newBillName || isNaN(parsedAmount)) {
      showAlert('Invalid input', 'Enter a valid name and numeric amount');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      if (editMode) {
        const res = await axios.put(`${BASE_URL}/api/bills/${editingBillId}`, {
          name: newBillName,
          amount: parsedAmount,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBills((prev) =>
          prev.map((bill) => (bill._id === editingBillId ? res.data : bill))
        );
      } else {
        const res = await axios.post(`${BASE_URL}/api/bills`, {
          name: newBillName,
          amount: parsedAmount,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBills((prev) => [...prev, res.data]);
      }

      setNewBillName('');
      setNewBillAmount('');
      setModalVisible(false);
      setEditMode(false);
    } catch (err) {
      showAlert('Error', 'Failed to save bill');
    }
  };

  const handleAddToBill = async (billId) => {
    const amountToAdd = parseFloat(addAmount[billId]);
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      showAlert('Invalid Amount', 'Enter a positive number.');
      return;
    }

    if (amountToAdd > parsedBalance) {
      showAlert('Insufficient Balance', 'You don’t have enough balance.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.patch(`${BASE_URL}/api/bills/${billId}/add`, {
        amount: amountToAdd,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBills((prev) =>
        prev.map((bill) => (bill._id === billId ? res.data : bill))
      );

      const newBalance = parseFloat(balance) - amountToAdd;
syncBalanceToBackend(newBalance);

      setAddAmount({ ...addAmount, [billId]: '' });
    } catch (err) {
      showAlert('Error', 'Failed to update bill');
    }
  };

  const handleDeleteBill = async (billId) => {
    showConfirm('Delete Bill', 'Are you sure you want to delete this bill?', async () => {
      try {
        const billToDelete = bills.find((b) => b._id === billId);
        const token = await AsyncStorage.getItem('token');
  
        await axios.delete(`${BASE_URL}/api/bills/${billId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const currentBalance = parseFloat(balance) || 0;
        const amountToRestore = billToDelete.added || 0;
  
        const restoredBalance = parseFloat(balance) + billToDelete.added;
syncBalanceToBackend(restoredBalance);

        setBills((prev) => prev.filter((bill) => bill._id !== billId));
      } catch (err) {
        showAlert('Error', 'Failed to delete bill');
      }
    });
  };
  

  const handleEditBill = (bill) => {
    setEditMode(true);
    setEditingBillId(bill._id);
    setNewBillName(bill.name);
    setNewBillAmount(String(bill.amount));
    setModalVisible(true);
  };

  const getProgressPercentage = (added, total) => {
    if (total === 0) return '0%';
    return `${Math.min((added / total) * 100, 100).toFixed(0)}%`;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.balanceText}>You have ${parseFloat(balance || 0).toFixed(2)}</Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.addBillButton} onPress={() => setBalanceModalVisible(true)}>
            <Text style={styles.add}>Set Balance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBillButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.add}>Add New Bill</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.header}>Bills</Text>

        <View style={styles.sortRow}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              setSortOption('name');
              setSortAscending((prev) => !prev);
            }}
          >
            <Text style={styles.sortText}>Sort by Name {sortOption === 'name' ? (sortAscending ? '↑' : '↓') : ''}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              setSortOption('amount');
              setSortAscending((prev) => !prev);
            }}
          >
            <Text style={styles.sortText}>Sort by Amount {sortOption === 'amount' ? (sortAscending ? '↑' : '↓') : ''}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.totals}>Total Paid: ${totalPaid} | Remaining: ${totalRemaining}</Text>

        <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          {[...bills]
            .sort((a, b) => {
              if (sortOption === 'name') {
                return sortAscending
                  ? a.name.localeCompare(b.name)
                  : b.name.localeCompare(a.name);
              } else {
                return sortAscending ? a.amount - b.amount : b.amount - a.amount;
              }
            })
            .map((bill) => (
              <View key={bill._id} style={styles.billCard}>
                <Text style={styles.billText}>
                  {bill.name} : ${bill.amount.toFixed(2)}
                </Text>
                <Text style={styles.addedText}>
                  Added: ${bill.added.toFixed(2)} ({getProgressPercentage(bill.added, bill.amount)})
                </Text>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: getProgressPercentage(bill.added, bill.amount) },
                    ]}
                  />
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter amount"
                    value={addAmount[bill._id] || ''}
                    onChangeText={(value) => setAddAmount({ ...addAmount, [bill._id]: value })}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity style={styles.addButton} onPress={() => handleAddToBill(bill._id)}>
                    <Text style={styles.add}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEditBill(bill)}>
                    <Text style={styles.editText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteBill(bill._id)}>
                    <Text style={styles.deleteText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </ScrollView>

        {/* Add/Edit Modal */}
        <Modal transparent visible={modalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editMode ? 'Edit Bill' : 'Add New Bill'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Bill Name"
                value={newBillName}
                onChangeText={setNewBillName}
              />
              <TextInput
                style={styles.input}
                placeholder="Bill Amount"
                value={newBillAmount}
                onChangeText={setNewBillAmount}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.addBillButton} onPress={handleAddOrEditBill}>
                <Text style={styles.add}>{editMode ? 'Save Changes' : 'Save Bill'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setModalVisible(false); setEditMode(false); }}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Set Balance Modal */}
        <Modal transparent visible={balanceModalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Set Your Balance</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your balance"
                value={tempBalance}
                onChangeText={setTempBalance}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.addBillButton}
                onPress={() => {
                  const parsed = parseFloat(tempBalance);
                  if (!isNaN(parsed)) {
                    syncBalanceToBackend(parsed);
                    setTempBalance('');
                    setBalanceModalVisible(false);
                  }
                  
                }}
              >
                <Text style={styles.add}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setBalanceModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

// Add your styles here (same as previous version with styles for progressBar, buttons, etc.)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  balanceText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  billText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addedText: {
    fontSize: 15,
    color: 'blue',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  input: {
    backgroundColor: '#F9F6EE',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: 150,
    marginTop: 10,
  },
  addBillButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  add: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    color: 'red',
  },
  scrollContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  noBills: {
    alignItems: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
  },
  billCard: {
    backgroundColor: '#c8d9e5',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    gap: 10,
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
  deleteText: {
    color: 'red',
    fontSize: 20,
    paddingHorizontal: 5,
  },
  editText: {
    color: '#333',
    fontSize: 20,
    paddingHorizontal: 5,
  },
  progressBarBackground: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 5,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 5,
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 20,
  },
  sortButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sortText: {
    fontWeight: 'bold',
  },
  totals: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
});
