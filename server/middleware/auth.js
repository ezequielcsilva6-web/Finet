import jwt from 'jsonwebtoken'
import { getUserById } from '../db.js'

const secret = process.env.JWT_SECRET || 'finet-secret'

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, secret)
    const user = getUserById(payload.userId)
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' })
  }
}
