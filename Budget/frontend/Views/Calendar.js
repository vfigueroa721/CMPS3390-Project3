import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Modal, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';

const API_URL = 'http://192.168.1.33:5000/api/events'; // Replace with your IP for mobile testing

export default function CustomCalendar() {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [billName, setBillName] = useState('');
  const [amount, setAmount] = useState('');

  // 🔁 Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_URL);
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to load events', err);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const handleAddPayment = async () => {
    if (!billName || !amount || isNaN(amount)) {
      Alert.alert('Invalid input', 'Please enter a valid bill name and amount.');
      return;
    }

    // Prevent duplicate entry
    const isDuplicate = events.some(
      (e) => e.date === selectedDate && e.name.toLowerCase() === billName.toLowerCase()
    );
    if (isDuplicate) {
      Alert.alert('Duplicate Entry', 'This bill is already added for the selected date.');
      return;
    }

    try {
      const res = await axios.post(API_URL, {
        date: selectedDate,
        name: billName,
        amount: parseFloat(amount),
      });
      setEvents((prev) => [...prev, res.data]);
      setModalVisible(false);
      setBillName('');
      setAmount('');
    } catch (err) {
      console.error('Failed to save event', err);
      Alert.alert('Error', 'Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (err) {
      console.error('Failed to delete event', err);
      Alert.alert('Error', 'Could not delete the event');
    }
  };

  const markedDates = events.reduce((marked, event) => {
    marked[event.date] = {
      marked: true,
      dotColor: 'blue',
    };
    return marked;
  }, {});

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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
          upcomingEvents.map((event) => (
            <View key={event._id} style={styles.eventItem}>
              <Text>{event.date} - {event.name}: ${event.amount.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => handleDelete(event._id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Payment on {selectedDate}</Text>
            <TextInput
              style={styles.input}
              placeholder="Bill Name"
              value={billName}
              onChangeText={setBillName}
              placeholderTextColor="#ccc"
            />
            <TextInput
              style={styles.input}
              placeholder="Bill Amount"
              value={amount}
              keyboardType="numeric"
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

const styles = StyleSheet.create({
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
  deleteText: {
    marginTop: 5,
    color: 'red',
    fontSize: 13,
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
    fontWeight: 'bold',
  },
});
