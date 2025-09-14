// frontend/src/axios.js
import axios from 'axios'

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/', // important: trailing slash
})

API.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('userInfo')
    const userInfo = raw ? JSON.parse(raw) : null

    // use access first (SimpleJWT)
    const token = userInfo?.access || userInfo?.token || userInfo?.authToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
  } catch (err) {
    // ignore bad localStorage
  }
  return config
}, (error) => Promise.reject(error))

export default API
