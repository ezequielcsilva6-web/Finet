import { Router } from 'express'
import { createGoal, getGoals } from '../db.js'

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

export default router
