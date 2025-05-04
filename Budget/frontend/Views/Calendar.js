import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CustomCalendar() {
  const [selectedDate, setSelectedDate] = useState(''); // track selected date
  const [events, setEvents] = useState([]); // list of payments
  const [modalVisible, setModalVisible] = useState(false);
  const [billName, setBillName] = useState('');
  const [amount, setAmount] = useState('');

  // mark the dates with events
  const markedDates = events.reduce((marked, event) => {
    marked[event.date] = {
      marked: true,
      dotColor: 'blue',
    };
    return marked;
  }, {});

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  // add payment events 
  const handleAddPayment = () => {
    // user input validation
    if(!billName || !amount || isNaN(amount)) return;

    const newEvent = {
      date: selectedDate,
      name: billName,
      amount: parseFloat(amount),
    };
    
    setEvents([...events, newEvent]);
    setModalVisible(false);
    setBillName('');
    setAmount('');
  };

  // filter events and sort 
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a,b) => new Date(a.date) - new Date(b.date));

    return (
      <View style={styles.container}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
        />

        <Text style={styles.upcomingTitle}>Upcoming Payments</Text>
        <ScrollView style={styles.upcomingContainer}>
          {upcomingEvents.length === 0 ? (
            <Text style={styles.noEvents}>No upcoming payments</Text>
          ) : (
            upcomingEvents.map((event, index) => (
              <View key={index} style={styles.eventItem}>
                <Text>{event.date} - {event.name}: ${event.amount.toFixed(2)}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <Modal
          visible={modalVisible}
          transparent
          animationType='slide'
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Payment on {selectedDate}</Text>
              <TextInput
                style={styles.input}
                placeholder='Bill Name'
                value={billName}
                onChangeText={setBillName}
                placeholderTextColor="#ccc"
              />
              <TextInput
                style={styles.input}
                placeholder='Bill Amount'
                value={amount}
                keyboardType='numeric'
                onChangeText={setAmount}
                placeholderTextColor="#ccc"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleAddPayment}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

    );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  upcomingContainer: {
    flex: 1,
  },
  eventItem: {
    backgroundColor: '#e0ecf3',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  noEvents: {
    color: 'gray',
  },
  cancelButton: {
    marginTop: 10, 
    color: 'red',
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
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18, 
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F9F6EE',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: 200,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: 'rgba(64, 131, 180, 0.68)',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
});
