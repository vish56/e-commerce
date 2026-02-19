import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
})

API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null

    if (userInfo && userInfo.access) {
      config.headers.Authorization = `Bearer ${userInfo.access}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default API
