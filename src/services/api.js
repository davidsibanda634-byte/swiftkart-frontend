import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://swiftkart2-backend.onrender.com/api',
})

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('swiftkart_user'))
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

export default api