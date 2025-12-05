import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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

// ============ USERS ENDPOINTS ============
export async function registerUser(payload) {
  try {
    const res = await api.post('/users/register', payload)
    if (res.data?.data?.token) setAuthToken(res.data.data.token)
    return res.data
  } catch (error) {
    console.error('Register API error:', error.response?.data || error.message)
    throw error
  }
}

export async function loginUser(payload) {
  try {
    const res = await api.post('/users/login', payload)
    if (res.data?.data?.token) setAuthToken(res.data.data.token)
    return res.data
  } catch (error) {
    console.error('Login API error:', error.response?.data || error.message)
    throw error
  }
}

export async function getAllUsers() {
  const res = await api.get('/users')
  return res.data
}

export async function getUserById(id) {
  const res = await api.get(`/users/${id}`)
  return res.data
}

export async function updateUser(id, payload) {
  const res = await api.put(`/users/${id}`, payload)
  return res.data
}

export async function deleteUser(id) {
  const res = await api.delete(`/users/${id}`)
  return res.data
}

// ============ TRANSACTIONS ENDPOINTS ============
export async function fetchTransactions(params = {}) {
  const res = await api.get('/transactions', { params })
  return res.data
}

export async function getTransactionsByUser(userId) {
  const res = await api.get(`/transactions/user/${userId}`)
  return res.data
}

export async function getTransactionById(id) {
  const res = await api.get(`/transactions/${id}`)
  return res.data
}

export async function createTransaction(payload) {
  const res = await api.post('/transactions', payload)
  return res.data
}

export async function updateTransaction(id, payload) {
  const res = await api.put(`/transactions/${id}`, payload)
  return res.data
}

export async function deleteTransaction(id) {
  const res = await api.delete(`/transactions/${id}`)
  return res.data
}

// ============ CATEGORIES ENDPOINTS ============
export async function getAllCategories() {
  const res = await api.get('/categories')
  return res.data
}

export async function getCategoriesByUser(userId) {
  const res = await api.get(`/categories/user/${userId}`)
  return res.data
}

export async function getCategoryById(id) {
  const res = await api.get(`/categories/${id}`)
  return res.data
}

export async function createCategory(payload) {
  const res = await api.post('/categories', payload)
  return res.data
}

export async function updateCategory(id, payload) {
  const res = await api.put(`/categories/${id}`, payload)
  return res.data
}

export async function deleteCategory(id) {
  const res = await api.delete(`/categories/${id}`)
  return res.data
}

// ============ BUDGETS ENDPOINTS ============
export async function getAllBudgets() {
  const res = await api.get('/budgets')
  return res.data
}

export async function getBudgetsByUser(userId) {
  const res = await api.get(`/budgets/user/${userId}`)
  return res.data
}

export async function getBudgetById(id) {
  const res = await api.get(`/budgets/${id}`)
  return res.data
}

export async function createBudget(payload) {
  const res = await api.post('/budgets', payload)
  return res.data
}

export async function updateBudget(id, payload) {
  const res = await api.put(`/budgets/${id}`, payload)
  return res.data
}

export async function deleteBudget(id) {
  const res = await api.delete(`/budgets/${id}`)
  return res.data
}

// ============ REPORTS ENDPOINTS ============
export async function getAllReports() {
  const res = await api.get('/reports')
  return res.data
}

export async function getReportsByUser(userId) {
  const res = await api.get(`/reports/user/${userId}`)
  return res.data
}

export async function getReportById(id) {
  const res = await api.get(`/reports/${id}`)
  return res.data
}

export async function createReport(payload) {
  const res = await api.post('/reports', payload)
  return res.data
}

export async function updateReport(id, payload) {
  const res = await api.put(`/reports/${id}`, payload)
  return res.data
}

export async function deleteReport(id) {
  const res = await api.delete(`/reports/${id}`)
  return res.data
}

export default api
