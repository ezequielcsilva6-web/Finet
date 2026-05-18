import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import financeRoutes from './routes/finance.js'
import goalsRoutes from './routes/goals.js'
import investmentsRoutes from './routes/investments.js'
import analysisRoutes from './routes/analysis.js'
import { authenticate } from './middleware/auth.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(helmet())
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'] }))
app.use(express.json())
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

app.get('/', (req, res) => {
  res.json({ message: 'Finet backend is running.' })
})

app.use('/auth', authRoutes)
app.use('/finance', authenticate, financeRoutes)
app.use('/goals', authenticate, goalsRoutes)
app.use('/investments', authenticate, investmentsRoutes)
app.use('/analysis', authenticate, analysisRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint não encontrado.' })
})

app.listen(port, () => {
  console.log(`Finet API rodando na porta ${port}`)
})
