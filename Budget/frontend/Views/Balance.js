import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';

export default function Balance() {
  const [balance, setBalance] = useState(''); // manage user's balance 
  const [bills, setBills] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // new bill information
  const [newBillName, setNewBillName] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');

  const [addAmount, setAddAmount] = useState({}); // 
  const [balanceModalVisivle, setBalanceModalVisible] = useState(false);
  const [tempBalance, setTempBalance] = useState('');

  // convert user's balance to a number
  let parsedBalance = parseFloat(balance);
  if(isNaN(parsedBalance)) {
    parsedBalance = 0;
  }

  const handleAddBill = () => {
    if(!newBillName || !newBillAmount || isNaN(newBillAmount)) return;

    // new bill object
    const newBill = {
      id: Date.now(),
      name: newBillName,
      amount: parseFloat(newBillAmount),
      added: 0,
    };

    setBills([...bills, newBill]); // add the new bill to the list of bills
    setNewBillName('');
    setNewBillAmount('');
    setModalVisible(false);
  };

  // handle adding money to the bills 
  const handleAddToBill = (billId) => {
    const amountToAdd = parseFloat(addAmount[billId]);

    // validate the user's input 
    if(
        isNaN(amountToAdd) || 
        amountToAdd <= 0 ||
        amountToAdd > parsedBalance
      ) {
        return;
      }

      // update the amount of money added to the bill
      const updatedBills = bills.map((bill) => {
        if(bill.id === billId) {
          const newAdded = Math.min(bill.added + amountToAdd, bill.amount);
          return {...bill, added: newAdded};
          }
          return bill;
      });
      
      setBills(updatedBills);
      // subtract amount from the balance 
      setBalance((parsedBalance - amountToAdd).toFixed(2)); 
      setAddAmount({...addAmount, [billId]: ''});
    };

    return (
      <View style={styles.container}>
        <Text style={styles.balanceText}>You have ${parseFloat(balance || 0).toFixed(2)}</Text>

        <TouchableOpacity
          style={styles.addBillButton}
          onPress={() => setBalanceModalVisible(true)}
        >
          <Text style={styles.add}>Set Balance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addBillButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.add}>Add New Bill</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Bills</Text>

        <ScrollView style={styles.scrollContainer}>
          {bills.length === 0 ? (
            <View style={styles.noBills}>
              <Text style={styles.noBills}>No bills added yet.</Text>
            </View>
          ) : (
            // display every bill 
            bills.map((bill) => {
              return (
                <View key={bill.id} style={styles.billContainer}>
                  <View style={styles.billCard}>
                    <Text style={styles.billText}>
                      {bill.name} : ${bill.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.addedText}>
                      Money added for this bill: ${bill.added.toFixed(2)}
                    </Text>
                    <View style={styles.inputRow}>
                      <TextInput
                        style={styles.input}
                        placeholder='Enter amount'
                        value={addAmount[bill.id] || ''}
                        onChangeText={(value) =>
                          setAddAmount({...addAmount, [bill.id] : value})
                        } 
                        keyboardType='numeric'
                      />
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToBill(bill.id)}
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
              <Text style={styles.modalTitle}>Add New Bill</Text>
              <TextInput 
                style={styles.input}
                placeholder='Bill Name'
                value={newBillName}
                onChangeText={setNewBillName}
                placeholderTextColor="#ccc"
              />
              <TextInput
                style={styles.input}
                placeholder='Bill Amount'
                value={newBillAmount}
                onChangeText={setNewBillAmount}
                keyboardType='numeric'
                placeholderTextColor="#ccc"
              />
              <TouchableOpacity style={styles.addBillButton} onPress={handleAddBill}>
                <Text style={styles.add}>Save Bill</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal 
          transparent={true}
          visible={balanceModalVisivle}
          animationType='slide'
          onRequestClose={() => setBalanceModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Set Your Balance</Text>
              <TextInput
                style={styles.input}
                placeholder='Enter your balance'
                value={tempBalance}
                onChangeText={setTempBalance}
                keyboardType='numeric'
              />
              <TouchableOpacity
                style={styles.addBillButton}
                onPress={() => {
                  if(!isNaN(parseFloat(tempBalance))) {
                    setBalance(parseFloat(tempBalance).toFixed(2));
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

        <StatusBar style='auto'/>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 200,
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
    height: '100%',
    shadowColor: '#77b3e7',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 100,
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
});