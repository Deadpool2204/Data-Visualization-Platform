// src/api/auth.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const signupUser = (userData) => axios.post(`${API_URL}/signup`, userData);
export const loginUser = (userData) => axios.post(`${API_URL}/login`, userData);
export const forgotPasswordUser = (userData) => axios.post(`${API_URL}/forgot-password`, userData);
