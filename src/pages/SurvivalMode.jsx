import { useEffect, useState } from 'react'
import { fetchSurvival } from '../api'
import ProtectedLayout from '../components/ProtectedLayout'

export default function SurvivalMode() {
  const [survival, setSurvival] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSurvival() {
      try {
        const response = await fetchSurvival()
        setSurvival(response.data)
      } catch (err) {
        setError('Não foi possível carregar o modo sobrevivência. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
    loadSurvival()
  }, [])

  return (
    <ProtectedLayout>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glow glass-card animate-fade-in">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Modo sobrevivência</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Planejamento de emergência</h1>
          </div>
          <span className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">Atenção rápida</span>
        </div>

        {loading ? (
          <p className="text-slate-300">Carregando informações...</p>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-red-100">{error}</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 glass-card">
              <p className="text-sm text-slate-400">Resumo atual</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">R$ {survival.balance.toFixed(2)}</h2>
              <p className="mt-3 text-slate-300">Despesas mensais estimadas: R$ {survival.monthlyExpenses.toFixed(2)}</p>
              <p className="mt-3 rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-200">{survival.alert}</p>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 glass-card">
                <p className="text-sm text-slate-400">Dias de runway</p>
                <h3 className="mt-3 text-3xl font-semibold text-white">{survival.runwayDays}</h3>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 glass-card">
                <p className="text-sm text-slate-400">Fundo de emergência ideal</p>
                <h3 className="mt-3 text-3xl font-semibold text-white">R$ {survival.bufferRecommendation.toFixed(2)}</h3>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 glass-card">
                <p className="text-sm text-slate-400">Fundo de 6 meses</p>
                <h3 className="mt-3 text-3xl font-semibold text-white">R$ {survival.emergencyFund.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        )}

        {survival && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Como melhorar seu colchão financeiro</h2>
            <ul className="mt-4 space-y-2 text-slate-300">
              {survival.actions.map((action) => (
                <li key={action} className="rounded-3xl bg-slate-950/70 px-4 py-3">
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </ProtectedLayout>
  )
}
