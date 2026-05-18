import { Router } from 'express'
import { saveInvestmentProfile } from '../db.js'

const router = Router()

const marketData = [
  { symbol: 'IBOV', name: 'Ações em alta', price: 'R$ 18.900', risk: 'Médio', potential: 'Crescimento', volatility: 8 },
  { symbol: 'FII', name: 'Fundos Imobiliários', price: 'R$ 23.80', risk: 'Baixo', potential: 'Renda estável', volatility: 4 },
  { symbol: 'BTC', name: 'Bitcoin', price: 'R$ 132.000', risk: 'Alto', potential: 'Volatilidade', volatility: 18 },
  { symbol: 'GREEN', name: 'Renda fixa verde', price: 'R$ 100.20', risk: 'Baixo', potential: 'Segurança', volatility: 2 },
  { symbol: 'AAPL', name: 'Ações internacionais', price: 'R$ 23.50', risk: 'Médio', potential: 'Diversificação', volatility: 7 },
]

router.get('/market', (req, res) => {
  return res.json({ market: marketData })
})

router.post('/simulate', (req, res) => {
  const { salary, amount, riskProfile } = req.body
  if (!salary || !amount || !riskProfile) {
    return res.status(400).json({ message: 'Dados de simulação incompletos.' })
  }

  saveInvestmentProfile(req.user.id, { salary, invest_amount: amount, risk_profile: riskProfile })

  const baseReturn = amount * (riskProfile === 'Agressivo' ? 0.28 : riskProfile === 'Moderado' ? 0.16 : 0.09)
  const estimatedReturn = Math.round((amount + baseReturn) * 100) / 100
  const potential = riskProfile === 'Agressivo' ? 'Retorno alto' : riskProfile === 'Moderado' ? 'Boa diversificação' : 'Proteção de capital'
  const message = `Com perfil ${riskProfile.toLowerCase()}, você pode atingir até R$ ${estimatedReturn.toFixed(2)} em um ano.`

  return res.json({ estimatedReturn, potential, message })
})

export default router
