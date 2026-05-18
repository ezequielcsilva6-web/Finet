import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginRequest } from '../api'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await loginRequest({ email, password })
      const { token, user } = response.data
      localStorage.setItem('finet-token', token)
      localStorage.setItem('finet-user', JSON.stringify(user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao fazer login. Verifique seus dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_32%),linear-gradient(180deg,_#050816_0%,_#0c1223_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-xl rounded-[32px] border border-white/10 bg-slate-950/90 p-10 shadow-glow backdrop-blur-xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-finet-300">Finet</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">Entrar na sua conta</h1>
            <p className="mt-3 text-slate-400">Acesse seu painel financeiro inteligente e acompanhe seu progresso.</p>
          </div>

          {error && <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-300">
              E-mail
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                placeholder="seu@email.com"
              />
            </label>

            <label className="block text-sm font-medium text-slate-300">
              Senha
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                placeholder="Digite sua senha"
              />
            </label>

            <div className="flex items-center justify-between text-sm text-slate-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-slate-900 text-finet-500 focus:ring-finet-500" />
                Manter conectado
              </label>
              <Link to="/forgot" className="font-semibold text-finet-300 hover:text-white">
                Esqueceu sua senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-finet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-finet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Acessando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
            Não tem uma conta?{' '}
            <Link to="/register" className="font-semibold text-white hover:text-finet-100">
              Criar Finet
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
