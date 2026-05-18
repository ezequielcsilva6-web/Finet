import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerRequest } from '../api'

function validateCPF(cpf) {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11 || /^([0-9])\1+$/.test(cleaned)) return false
  const digits = cleaned.split('').map(Number)
  const calc = (count) => {
    const slice = digits.slice(0, count)
    const multiplier = count + 1
    const sum = slice.reduce((acc, val, index) => acc + val * (multiplier - index), 0)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  return calc(9) === digits[9] && calc(10) === digits[10]
}

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', cpf: '', email: '', password: '', confirmPassword: '', birthdate: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!validateCPF(form.cpf)) {
      setError('CPF inválido. Digite um CPF válido.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      await registerRequest({
        name: form.name,
        cpf: form.cpf,
        email: form.email,
        password: form.password,
        birthdate: form.birthdate,
      })
      navigate('/login')
    } catch (err) {
      console.error('Register error', err)
      setError(err.response?.data?.message || err.message || 'Erro ao registrar usuário.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_32%),linear-gradient(180deg,_#050816_0%,_#0c1223_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-[32px] border border-white/10 bg-slate-950/90 p-10 shadow-glow backdrop-blur-xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-finet-300">Finet</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">Cadastro Seguro</h1>
            <p className="mt-3 text-slate-400">Crie sua conta e comece a controlar suas finanças com IA.</p>
          </div>

          {error && <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}

          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Nome completo
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  placeholder="Seu nome"
                />
              </label>

              <label className="block text-sm font-medium text-slate-300">
                CPF
                <input
                  type="text"
                  name="cpf"
                  required
                  value={form.cpf}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  placeholder="000.000.000-00"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-300">
              E-mail
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                placeholder="seu@email.com"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Senha
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  placeholder="Mínimo 8 caracteres"
                />
              </label>

              <label className="block text-sm font-medium text-slate-300">
                Confirmar senha
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  placeholder="Repita a senha"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-300">
              Data de nascimento
              <input
                type="date"
                name="birthdate"
                required
                value={form.birthdate}
                onChange={handleChange}
                className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-3xl bg-finet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-finet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
            Já possui conta?{' '}
            <Link to="/login" className="font-semibold text-white hover:text-finet-100">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
