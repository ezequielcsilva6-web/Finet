import { useEffect, useState } from 'react'
import ProtectedLayout from '../components/ProtectedLayout'
import { fetchInsights } from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function InsightsPage() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadInsights() {
      setLoading(true)
      try {
        const response = await fetchInsights()
        setInsights(response.data)
      } catch (err) {
        console.error('Erro ao carregar insights', err)
        setError('Não foi possível carregar os insights agora. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
    loadInsights()
  }, [])

  return (
    <ProtectedLayout>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glow glass-card animate-fade-in">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">IA Financeira</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Insights Inteligentes</h1>
          </div>
          <span className="rounded-3xl bg-finet-600/15 px-4 py-3 text-sm text-finet-100">Recomendações com base nos seus dados</span>
        </div>

        {loading ? (
          <p className="text-slate-300">Gerando insights...</p>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-red-100">{error}</div>
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 glass-card">
                <h2 className="text-xl font-semibold text-white">Panorama financeiro</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-sm text-slate-400">Saldo atual</p>
                    <p className="mt-2 text-3xl font-semibold text-white">R$ {insights.summary.balance}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-sm text-slate-400">Gastos mensais</p>
                    <p className="mt-2 text-3xl font-semibold text-white">R$ {insights.summary.monthlyExpenses}</p>
                  </div>
                </div>
                <div className="mt-6 rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-sm text-slate-400">Humor financeiro</p>
                  <p className="mt-2 text-xl font-semibold text-white">{insights.financialMood}</p>
                  <p className="mt-2 text-slate-300">{insights.moodAdvice}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 glass-card">
                <h2 className="text-xl font-semibold text-white">Foco de economia</h2>
                <div className="mt-5 space-y-4">
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-sm text-slate-400">Categoria principal</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{insights.topExpenseCategory || 'Nenhuma'}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-sm text-slate-400">Renda disponível</p>
                    <p className="mt-2 text-2xl font-semibold text-white">R$ {insights.availableCash}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6 glass-card">
              <h2 className="text-xl font-semibold text-white">Região de maior impacto</h2>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={insights.categorySpend} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="category" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 16, border: '1px solid rgba(148,163,184,0.18)' }} />
                    <Bar dataKey="amount" fill="#38bdf8" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 glass-card">
                <h2 className="text-xl font-semibold text-white">Sugestões da IA</h2>
                <ul className="mt-4 space-y-3 text-slate-300">
                  {insights.recommendations.map((item, index) => (
                    <li key={index} className="rounded-3xl bg-slate-950/70 p-4">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 glass-card">
                <h2 className="text-xl font-semibold text-white">Próximos passos</h2>
                <div className="mt-4 space-y-3 text-slate-300">
                  <p>{insights.nextStep}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </ProtectedLayout>
  )
}
