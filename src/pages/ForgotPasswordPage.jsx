import { useState } from 'react'
import { Link } from 'react-router-dom'
import { passwordResetRequest } from '../api'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      await passwordResetRequest({ email })
      setMessage('Caso o e-mail exista, você receberá instruções em breve.')
    } catch (err) {
      setError('Não foi possível enviar o link de recuperação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_32%),linear-gradient(180deg,_#050816_0%,_#0c1223_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-950/90 p-10 shadow-glow backdrop-blur-xl">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-finet-300">Finet</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">Recuperar senha</h1>
            <p className="mt-3 text-slate-400">Digite seu e-mail cadastrado para receber um link de recuperação.</p>
          </div>

          {message && <div className="mb-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">{message}</div>}
          {error && <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-300">
              E-mail cadastrado
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                placeholder="seu@email.com"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-finet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-finet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Enviar instruções'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Lembrou sua senha?{' '}
            <Link to="/login" className="font-semibold text-white hover:text-finet-100">
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
