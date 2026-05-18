import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { createUser, getUserByCPF, getUserByEmail, getUserById } from '../db.js'

const secret = process.env.JWT_SECRET || 'finet-secret'
const router = Router()

router.post('/register', async (req, res) => {
  const { name, cpf, email, password, birthdate } = req.body
  if (!name || !cpf || !email || !password || !birthdate) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' })
  }

  if (getUserByEmail(email)) {
    return res.status(409).json({ message: 'E-mail já cadastrado.' })
  }
  if (getUserByCPF(cpf)) {
    return res.status(409).json({ message: 'CPF já cadastrado.' })
  }

  const encrypted = await bcrypt.hash(password, 10)
  const userId = createUser({ name, cpf, email, password: encrypted, birthdate })
  const user = getUserById(userId)
  return res.status(201).json({ message: 'Cadastro realizado com sucesso.', user })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' })
  }

  const user = getUserByEmail(email)
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas.' })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return res.status(401).json({ message: 'Credenciais inválidas.' })
  }

  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '8h' })
  const safeUser = getUserById(user.id)
  return res.json({ token, user: safeUser })
})

router.post('/forgot-password', (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: 'E-mail é obrigatório.' })
  }
  return res.json({ message: 'Se encontrado, enviaremos instruções para o e-mail informado.' })
})

router.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Não autorizado.' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, secret)
    const user = getUserById(payload.userId)
    return res.json({ user })
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido.' })
  }
})

export default router
