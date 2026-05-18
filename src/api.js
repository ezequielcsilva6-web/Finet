import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('finet-token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const loginRequest = (payload) => api.post('/auth/login', payload)
export const registerRequest = (payload) => api.post('/auth/register', payload)
export const passwordResetRequest = (payload) => api.post('/auth/forgot-password', payload)
export const fetchSummary = () => api.get('/finance/summary')
export const fetchTransactions = () => api.get('/finance/transactions')
export const createTransaction = (payload) => api.post('/finance/transactions', payload)
export const deleteTransaction = (transactionId) => api.delete(`/finance/transactions/${transactionId}`)
export const fetchGoals = () => api.get('/goals')
export const createGoal = (payload) => api.post('/goals', payload)
export const fetchInvestments = () => api.get('/investments/market')
export const simulateInvestment = (payload) => api.post('/investments/simulate', payload)
export const fetchProfile = () => api.get('/auth/profile')
export const simulatePlanning = (payload) => api.post('/analysis/simulate', payload)
export const fetchSurvival = () => api.get('/analysis/survival')
export const fetchEmotionalMap = () => api.get('/analysis/emotional-map')
