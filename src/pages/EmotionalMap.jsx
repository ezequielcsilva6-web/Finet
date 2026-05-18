import { useEffect, useState } from 'react'
import ProtectedLayout from '../components/ProtectedLayout'
import { fetchEmotionalMap } from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function EmotionalMap() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadMap() {
      try {
        const response = await fetchEmotionalMap()
        setData(response.data)
      } catch (err) {
        setError('Não foi possível carregar o mapa emocional. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    loadMap()
  }, [])

  return (
    <ProtectedLayout>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glow glass-card animate-fade-in">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Gastos emocionais</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Mapa de consumo emocional</h1>
          </div>
          <span className="rounded-3xl bg-finet-500/10 px-4 py-3 text-sm text-finet-100">Análise por dia e período</span>
        </div>

        {loading ? (
          <p className="text-slate-300">Carregando mapa...</p>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-red-100">{error}</div>
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 glass-card">
                <p className="text-sm text-slate-400">Despesa por dia da semana</p>
                <div className="mt-6 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.weekdaySpend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="day" stroke="#cbd5e1" />
                      <YAxis stroke="#cbd5e1" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 16, border: '1px solid rgba(148,163,184,0.18)' }} />
                      <Bar dataKey="amount" fill="#7c3aed" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 glass-card">
                <p className="text-sm text-slate-400">Despesa por período do dia</p>
                <div className="mt-6 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.periodSpend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="period" stroke="#cbd5e1" />
                      <YAxis stroke="#cbd5e1" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 16, border: '1px solid rgba(148,163,184,0.18)' }} />
                      <Bar dataKey="amount" fill="#22c55e" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 glass-card">
                <p className="text-sm text-slate-400">Categorias mais impactadas</p>
                <div className="mt-4 space-y-3">
                  {data.categorySpend.slice(0, 6).map((item) => (
                    <div key={item.category} className="rounded-3xl bg-slate-900/80 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-slate-200">{item.category}</p>
                        <p className="text-lg font-semibold text-white">R$ {item.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 glass-card">
                <p className="text-sm text-slate-400">Insights emocionais</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Maior impulso</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">{data.strongestEmotion.label}</h2>
                    <p className="mt-2 text-slate-300">Gasto total: R$ {data.strongestEmotion.amount}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total de despesas</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">R$ {data.totalExpenses}</h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6 glass-card">
              <h2 className="text-xl font-semibold text-white">Recomendações</h2>
              <ul className="mt-4 space-y-3 text-slate-300">
                {data.recommendations.map((recommendation) => (
                  <li key={recommendation} className="rounded-3xl bg-slate-950/70 p-4">
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </section>
    </ProtectedLayout>
  )
}
