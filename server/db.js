import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const file = path.join(dataDir, 'finet.json')

function readDb() {
  if (!fs.existsSync(file)) {
    const initial = { users: [], transactions: [], goals: [], investmentProfiles: [] }
    fs.writeFileSync(file, JSON.stringify(initial, null, 2))
    return initial
  }
  try {
    const raw = fs.readFileSync(file, 'utf8')
    return JSON.parse(raw || '{}')
  } catch (e) {
    return { users: [], transactions: [], goals: [], investmentProfiles: [] }
  }
}

function writeDb(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

const now = () => new Date().toISOString()

export function createUser({ name, cpf, email, password, birthdate }) {
  const db = readDb()
  const user = {
    id: Date.now(),
    name,
    cpf,
    email,
    password,
    birthdate,
    created_at: now(),
    updated_at: now(),
  }
  db.users.push(user)
  writeDb(db)
  return user.id
}

export function getUserByEmail(email) {
  const db = readDb()
  return db.users.find((user) => user.email === email)
}

export function getUserByCPF(cpf) {
  const db = readDb()
  return db.users.find((user) => user.cpf === cpf)
}

export function getUserById(id) {
  const db = readDb()
  const user = db.users.find((u) => u.id === id)
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    cpf: user.cpf,
    email: user.email,
    birthdate: user.birthdate,
    created_at: user.created_at,
  }
}

export function addTransaction(userId, transaction) {
  const db = readDb()
  const tx = {
    id: Date.now(),
    user_id: userId,
    type: transaction.type,
    category: transaction.category,
    amount: Number(transaction.amount),
    date: transaction.date,
    title: transaction.title,
    note: transaction.note || '',
    recurrence: transaction.recurrence || 'Único',
    created_at: now(),
  }
  db.transactions.unshift(tx)
  writeDb(db)
  return tx.id
}

export function getTransactions(userId) {
  const db = readDb()
  return db.transactions.filter((tx) => tx.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export function deleteTransaction(userId, transactionId) {
  const db = readDb()
  db.transactions = db.transactions.filter((tx) => !(tx.user_id === userId && tx.id === transactionId))
  writeDb(db)
  return true
}

export function getGoals(userId) {
  const db = readDb()
  return db.goals
    .filter((goal) => goal.user_id === userId)
    .map((goal) => {
      const target = Number(goal.target_amount || 0)
      const current = Number(goal.current_amount || 0)
      const months = Number(goal.months || 1)
      const progressPercentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
      const remaining = Math.max(0, target - current)
      const monthlySavings = months > 0 ? Math.round((remaining / months) * 100) / 100 : remaining
      return {
        ...goal,
        target_amount: target,
        current_amount: current,
        months,
        progressPercentage,
        monthlySavings,
      }
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export function createGoal(userId, goal) {
  const db = readDb()
  const item = {
    id: Date.now(),
    user_id: userId,
    title: goal.title,
    target_amount: Number(goal.target_amount),
    current_amount: Number(goal.current_amount),
    months: Number(goal.months),
    priority: goal.priority,
    created_at: now(),
  }
  db.goals.unshift(item)
  writeDb(db)
  return item.id
}

export function getInvestmentProfile(userId) {
  const db = readDb()
  return db.investmentProfiles.find((profile) => profile.user_id === userId)
}

export function saveInvestmentProfile(userId, profile) {
  const db = readDb()
  const existing = db.investmentProfiles.find((p) => p.user_id === userId)
  if (existing) {
    existing.salary = Number(profile.salary)
    existing.invest_amount = Number(profile.invest_amount)
    existing.risk_profile = profile.risk_profile
    existing.updated_at = now()
  } else {
    db.investmentProfiles.push({
      user_id: userId,
      salary: Number(profile.salary),
      invest_amount: Number(profile.invest_amount),
      risk_profile: profile.risk_profile,
      updated_at: now(),
    })
  }
  writeDb(db)
  return true
}

export function calculateSummary(userId) {
  const transactions = getTransactions(userId)
  const incomes = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0)
  const expenses = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0)
  const balance = incomes - expenses
  const monthlyIncome = incomes
  const monthlyExpenses = expenses
  const dailyBudget = Math.max(0, balance / 30)
  const weeklyBudget = Math.max(0, balance / 4)
  const survivalDays = monthlyExpenses > 0 ? Math.max(0, Math.floor((balance / monthlyExpenses) * 30)) : 90
  const alert = balance < 0 ? 'Seu padrão atual é arriscado.' : 'Você está avançando com segurança.'
  const prediction = balance < 0 ? 'Você ficará sem saldo em 18 dias.' : 'Continue equilibrando suas finanças.'
  const riskLevel = balance < 0 ? 'Alto' : balance / (monthlyExpenses || 1) < 0.3 ? 'Médio' : 'Baixo'
  const recommendedSavings = Math.max(0, Math.round((monthlyIncome - monthlyExpenses) * 0.3 * 100) / 100)
  const trendData = [
    { month: 'Jan', balance: Math.max(0, balance * 0.65 + 1200) },
    { month: 'Fev', balance: Math.max(0, balance * 0.75 + 800) },
    { month: 'Mar', balance: Math.max(0, balance * 0.9 + 100) },
    { month: 'Abr', balance: Math.max(0, balance * 1.0 + 200) },
    { month: 'Mai', balance: Math.max(0, balance * 1.1 + 350) },
    { month: 'Jun', balance },
  ]
  return { balance, monthlyIncome, monthlyExpenses, dailyBudget, weeklyBudget, survivalDays, alert, prediction, riskLevel, recommendedSavings, trendData }
}
