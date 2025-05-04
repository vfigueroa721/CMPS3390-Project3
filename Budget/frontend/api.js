import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '@env';


const API_URL = EXPO_PUBLIC_API_URL;// from env

//const API_URL = 'http://localhost:5000/api'; // or your server IP if testing on phone
//const API_URL = 'http://192.168.1.33:5000/api'; 

export const signupUser = async (firstName, email, password) => {
  const response = await axios.post(`${API_URL}/auth/signup`, { firstName, email, password });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};
//api.js