import { useEffect, useState } from 'react'
import ProtectedLayout from '../components/ProtectedLayout'
import { fetchInvestments, simulateInvestment } from '../api'

const riskProfiles = ['Conservador', 'Moderado', 'Agressivo']

function InvestmentsPage() {
  const [market, setMarket] = useState([])
  const [simulated, setSimulated] = useState(null)
  const [form, setForm] = useState({ salary: '', amount: '', riskProfile: 'Moderado' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadMarket() {
      try {
        const response = await fetchInvestments()
        setMarket(response.data.market)
      } catch (err) {
        setError('Falha ao carregar os dados de investimento.')
      } finally {
        setLoading(false)
      }
    }
    loadMarket()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      const response = await simulateInvestment({
        salary: Number(form.salary),
        amount: Number(form.amount),
        riskProfile: form.riskProfile,
      })
      setSimulated(response.data)
    } catch (err) {
      setError('Não foi possível simular o investimento.')
    }
  }

  return (
    <ProtectedLayout>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glow glass-card animate-fade-in">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Finet Invest</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Investimentos inteligentes</h1>
          </div>
          <span className="rounded-3xl bg-finet-600/15 px-4 py-3 text-sm text-finet-100">Atualização contínua</span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h2 className="text-xl font-semibold text-white">Mercado em foco</h2>
            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-slate-400">Carregando carteiras...</p>
              ) : (
                market.map((asset) => (
                  <div key={asset.symbol} className="rounded-3xl border border-white/5 bg-slate-900/80 p-5 glass-card">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-400">{asset.symbol}</p>
                        <h3 className="mt-2 text-lg font-semibold text-white">{asset.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold text-white">{asset.price}</p>
                        <span className={`rounded-full px-2 py-1 text-xs ${asset.risk === 'Baixo' ? 'bg-emerald-500/15 text-emerald-200' : asset.risk === 'Médio' ? 'bg-amber-500/15 text-amber-200' : 'bg-rose-500/15 text-rose-200'}`}>
                          {asset.risk}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">Potencial: {asset.potential} • Volatilidade: {asset.volatility}%</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h2 className="text-xl font-semibold text-white">Simulador</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm text-slate-300">
                Salário
                <input
                  type="number"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  required
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  placeholder="5000"
                />
              </label>

              <label className="block text-sm text-slate-300">
                Valor para investir
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  placeholder="1200"
                />
              </label>

              <label className="block text-sm text-slate-300">
                Perfil de risco
                <select
                  name="riskProfile"
                  value={form.riskProfile}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                >
                  {riskProfiles.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <button type="submit" className="w-full rounded-3xl bg-finet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-finet-400">
                Simular investimento
              </button>
            </form>

            {simulated && (
              <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/90 p-5 glass-card">
                <p className="text-sm text-slate-400">Recomendação</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{simulated.message}</h3>
                <dl className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/70 p-4">
                    <dt>Retorno estimado</dt>
                    <dd className="mt-2 text-lg font-semibold text-white">R$ {simulated.estimatedReturn.toFixed(2)}</dd>
                  </div>
                  <div className="rounded-3xl bg-slate-950/70 p-4">
                    <dt>Potencial</dt>
                    <dd className="mt-2 text-lg font-semibold text-white">{simulated.potential}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>

        {error && <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-red-100">{error}</div>}
      </section>
    </ProtectedLayout>
  )
}

export default InvestmentsPage
