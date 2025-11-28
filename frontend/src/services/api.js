import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// Token management
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('ff_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    localStorage.removeItem('ff_token')
    delete api.defaults.headers.common['Authorization']
  }
}

// Initialize token from storage on load
const existing = typeof window !== 'undefined' ? localStorage.getItem('ff_token') : null
if (existing) setAuthToken(existing)

export async function fetchTransactions(params = {}) {
  const res = await api.get('/transactions', { params })
  return res.data
}

export async function createTransaction(payload) {
  const res = await api.post('/transactions', payload)
  return res.data
}

// Auth endpoints
export async function registerUser(payload) {
  const res = await api.post('/users/register', payload)
  const data = res.data
  return data
}

export async function loginUser(payload) {
  const res = await api.post('/users/login', payload)
  const data = res.data
  const token = data?.data?.token
  if (token) setAuthToken(token)
  return data
}

export default api
