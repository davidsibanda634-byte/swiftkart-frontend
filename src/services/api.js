import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Auto-attach token to every request if user is logged in
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('swiftkart_user'))
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

export default api