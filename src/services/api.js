import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://swiftkart2-backend.onrender.com/api',
})

api.interceptors.request.use(function(config) {
  try {
    const user = JSON.parse(localStorage.getItem('scalablenexus_user'))
    if (user && user.token) {
      config.headers.Authorization = 'Bearer ' + user.token
    }
  } catch (e) {
    localStorage.removeItem('scalablenexus_user')
  }
  return config
})

api.interceptors.response.use(
  function(response) { return response },
  function(error) {
    const status = error.response && error.response.status
    const message = error.response && error.response.data && error.response.data.message
    const isTokenError = status === 401 && (
      message === 'Token invalid, not authorized' ||
      message === 'No token, not authorized'
    )
    if (isTokenError) {
      localStorage.removeItem('scalablenexus_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api