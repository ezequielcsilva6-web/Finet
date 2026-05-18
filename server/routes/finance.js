import { Router } from 'express'
import { addTransaction, calculateSummary, deleteTransaction, getTransactions } from '../db.js'

const router = Router()

router.get('/summary', (req, res) => {
  const summary = calculateSummary(req.user.id)
  return res.json(summary)
})

router.get('/transactions', (req, res) => {
  const transactions = getTransactions(req.user.id)
  return res.json({ transactions })
})

router.post('/transactions', (req, res) => {
  const payload = req.body
  if (!payload.title || !payload.amount || !payload.category || !payload.type || !payload.date) {
    return res.status(400).json({ message: 'Informações incompletas da transação.' })
  }
  const id = addTransaction(req.user.id, payload)
  return res.status(201).json({ message: 'Transação criada.', id })
})

router.delete('/transactions/:id', (req, res) => {
  const transactionId = Number(req.params.id)
  deleteTransaction(req.user.id, transactionId)
  return res.json({ message: 'Transação removida.' })
})

export default router
