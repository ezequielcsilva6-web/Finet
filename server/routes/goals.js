import { Router } from 'express'
import { createGoal, deleteGoal, getGoals } from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const goals = getGoals(req.user.id).map((goal) => {
    const progressPercentage = Math.min(100, (goal.current_amount / goal.target_amount) * 100)
    const monthlySavings = goal.months > 0 ? (goal.target_amount - goal.current_amount) / goal.months : 0
    return { ...goal, progressPercentage, monthlySavings }
  })
  return res.json({ goals })
})

router.post('/', (req, res) => {
  const { title, target_amount, current_amount, months, priority } = req.body
  if (!title || !target_amount || !current_amount || !months || !priority) {
    return res.status(400).json({ message: 'Todos os campos da meta são obrigatórios.' })
  }
  const id = createGoal(req.user.id, { title, target_amount, current_amount, months, priority })
  return res.status(201).json({ message: 'Meta criada.', id })
})

router.delete('/:goalId', (req, res) => {
  const { goalId } = req.params
  if (!goalId) {
    return res.status(400).json({ message: 'ID da meta é obrigatório.' })
  }
  const parsedId = Number(goalId)
  if (Number.isNaN(parsedId)) {
    return res.status(400).json({ message: 'ID da meta inválido.' })
  }
  deleteGoal(req.user.id, parsedId)
  return res.json({ message: 'Meta removida com sucesso.' })
})

export default router
