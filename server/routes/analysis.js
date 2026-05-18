import express from 'express'
import { calculateSummary, getTransactions } from '../db.js'

const router = express.Router()

// POST /analysis/simulate
// body: { months: number, scenario: 'conservative'|'baseline'|'aggressive', monthlyContribution: number }
router.post('/simulate', (req, res) => {
  try {
    const userId = req.user.id
    const { months = 12, scenario = 'baseline', monthlyContribution = 0 } = req.body || {}

    const summary = calculateSummary(userId)
    let balance = Number(summary.balance || 0)
    let monthlyNet = Number((summary.monthlyIncome || 0) - (summary.monthlyExpenses || 0))

    const rates = {
      conservative: 0.002, // ~2.4% a.a.
      baseline: 0.005, // ~6% a.a.
      aggressive: 0.01, // ~12% a.a.
    }

    const monthlyReturn = rates[scenario] ?? rates.baseline
    const incomeGrowth = 0.002 // small monthly income growth
    const expenseGrowth = 0.003 // small monthly expense increase

    const projections = []
    let firstNegativeMonth = null
    let cumulativeContribution = 0

    for (let i = 1; i <= months; i++) {
      // adjust monthly net for simple growth/decay assumptions
      monthlyNet = monthlyNet * (1 + incomeGrowth - expenseGrowth)
      cumulativeContribution += Number(monthlyContribution || 0)

      // apply return on current balance, then add net and contribution
      balance = balance * (1 + monthlyReturn) + monthlyNet + Number(monthlyContribution || 0)

      if (balance < 0 && firstNegativeMonth === null) firstNegativeMonth = i

      projections.push({
        month: i,
        balance: Math.round(balance * 100) / 100,
        monthlyNet: Math.round(monthlyNet * 100) / 100,
        cumulativeContribution: Math.round(cumulativeContribution * 100) / 100,
      })
    }

    const result = {
      initialBalance: Math.round((summary.balance || 0) * 100) / 100,
      months,
      scenario,
      monthlyReturn,
      projections,
      finalBalance: projections.length ? projections[projections.length - 1].balance : Math.round(balance * 100) / 100,
      firstNegativeMonth,
      totalContributed: Math.round(cumulativeContribution * 100) / 100,
    }

    res.json(result)
  } catch (e) {
    res.status(500).json({ message: 'Erro no simulador', error: String(e) })
  }
})

router.get('/emotional-map', (req, res) => {
  try {
    const userId = req.user.id
    const transactions = getTransactions(userId).filter((tx) => tx.type === 'expense')

    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const periods = [
      { label: 'Madrugada', start: 0, end: 6 },
      { label: 'Manhã', start: 6, end: 12 },
      { label: 'Tarde', start: 12, end: 18 },
      { label: 'Noite', start: 18, end: 24 },
    ]

    const weekdaySpend = weekdays.map((day, index) => ({ day, amount: 0 }))
    const periodSpend = periods.map((period) => ({ period: period.label, amount: 0 }))
    const categorySpend = {}

    const emotionalLabels = {
      Lazer: ['Lazer', 'Entretenimento', 'Cinema', 'Viagem', 'Compras', 'Games'],
      Conforto: ['Alimentação', 'Restaurante', 'Cafeteria', 'Delivery', 'Sobremesa'],
      Necessidade: ['Transporte', 'Saúde', 'Moradia', 'Educação', 'Contas'],
      Impulso: ['Moda', 'Tecnologia', 'Bebidas', 'Bar', 'Presentes'],
    }

    const totalExpenses = transactions.reduce((sum, tx) => {
      const amount = Number(tx.amount || 0)
      const date = new Date(tx.date)
      const weekday = date.getDay()
      const hour = date.getHours()

      weekdaySpend[weekday].amount += amount
      const period = periods.find((p) => hour >= p.start && hour < p.end)
      if (period) {
        const item = periodSpend.find((item) => item.period === period.label)
        if (item) item.amount += amount
      }

      const category = tx.category || 'Outros'
      categorySpend[category] = (categorySpend[category] || 0) + amount
      return sum + amount
    }, 0)

    const emotionalCategories = Object.entries(emotionalLabels).map(([label, values]) => {
      const amount = transactions.reduce((sum, tx) => {
        const category = tx.category || 'Outros'
        return sum + (values.includes(category) ? Number(tx.amount || 0) : 0)
      }, 0)
      return { label, amount }
    })

    const strongestEmotion = emotionalCategories.reduce((best, current) => (current.amount > best.amount ? current : best), { label: 'Neutro', amount: 0 })
    const recommendations = []
    if (strongestEmotion.label === 'Impulso') {
      recommendations.push('Evite compras de impulso em horários de pico emocional.')
    } else if (strongestEmotion.label === 'Lazer') {
      recommendations.push('Planeje gastos de lazer e defina um teto mensal para evitar excessos.')
    } else {
      recommendations.push('Revise categorias de maior peso e busque alternativas mais econômicas.')
    }
    if (periodSpend.some((item) => item.amount > totalExpenses * 0.35)) {
      recommendations.push('Cuidado com períodos com gasto excessivo em curto espaço de tempo.')
    }

    res.json({
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      weekdaySpend: weekdaySpend.map((item) => ({ ...item, amount: Math.round(item.amount * 100) / 100 })),
      periodSpend: periodSpend.map((item) => ({ ...item, amount: Math.round(item.amount * 100) / 100 })),
      categorySpend: Object.entries(categorySpend).map(([category, amount]) => ({ category, amount: Math.round(amount * 100) / 100 })),
      emotionalCategories,
      strongestEmotion,
      recommendations,
    })
  } catch (e) {
    res.status(500).json({ message: 'Erro ao calcular o mapa emocional', error: String(e) })
  }
})

router.get('/survival', (req, res) => {
  try {
    const userId = req.user.id
    const summary = calculateSummary(userId)
    const { balance, monthlyExpenses, recommendedSavings, survivalDays } = summary
    const bufferRecommendation = Math.round((monthlyExpenses * 3) * 100) / 100
    const runwayDays = monthlyExpenses > 0 ? Math.round((balance / monthlyExpenses) * 30) : 999
    const emergencyFund = Math.round((monthlyExpenses * 6) * 100) / 100
    const safeZone = balance >= bufferRecommendation
    const alert = balance <= 0 ? 'Saldo negativo. Priorize receitas ou corte gastos imediatamente.' : safeZone ? 'Reserva saudável para 3 meses de despesas.' : 'Você ainda não possui colchão de emergência suficiente.'
    const actions = [
      'Revise despesas não essenciais',
      'Aumente a contribuição mensal para as reservas',
      'Mantenha ao menos 3 meses de despesas líquidas em caixa',
    ]

    res.json({
      balance: Math.round(balance * 100) / 100,
      monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
      bufferRecommendation,
      runwayDays: Math.max(0, runwayDays),
      emergencyFund,
      safeZone,
      alert,
      actions,
      survivalDays,
      recommendedSavings,
    })
  } catch (e) {
    res.status(500).json({ message: 'Erro ao calcular o modo sobrevivência', error: String(e) })
  }
})

export default router
