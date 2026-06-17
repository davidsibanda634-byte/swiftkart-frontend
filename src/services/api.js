import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://swiftkart2-backend.onrender.com/api',
})

api.interceptors.request.use(function(config) {
  try {
    const user = JSON.parse(localStorage.getItem('swiftkart_user'))
    if (user && user.token) {
      config.headers.Authorization = 'Bearer ' + user.token
    }
  } catch (e) {
    localStorage.removeItem('swiftkart_user')
  }
  return config
})

api.interceptors.response.use(
  function(response) { return response },
  function(error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('swiftkart_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api