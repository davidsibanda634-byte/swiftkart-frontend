import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

const KEY = 'scalablenexus_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(function() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || null
    } catch {
      return null
    }
  })

  const [authReady] = useState(true)

  const login = function(userData) {
    setUser(userData)
    localStorage.setItem(KEY, JSON.stringify(userData))
  }

  const logout = function() {
    setUser(null)
    localStorage.removeItem(KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, authReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}