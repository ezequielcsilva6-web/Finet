import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ProtectedLayout from '../components/ProtectedLayout'
import { fetchSummary, fetchGoals, fetchInvestments } from '../api'

function DashboardPage({ toggleTheme, theme }) {
  const [summary, setSummary] = useState(null)
  const [goals, setGoals] = useState([])
  const [market, setMarket] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [summaryRes, goalsRes, marketRes] = await Promise.all([fetchSummary(), fetchGoals(), fetchInvestments()])
        setSummary(summaryRes.data)
        setGoals(goalsRes.data.goals)
        setMarket(marketRes.data.market)
      } catch (err) {
        setError('Não foi possível carregar o painel. Atualize a página.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const riskTone = useMemo(() => {
    if (!summary) return 'Neutro'
    if (summary.riskLevel === 'Alto') return 'Alto risco detectado'
    if (summary.riskLevel === 'Médio') return 'Atenção necessária'
    return 'Perfil saudável'
  }, [summary])

  if (loading) {
    return (
      <ProtectedLayout theme={theme} toggleTheme={toggleTheme}>
        <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-glow">
          <p className="text-slate-300">Carregando dashboard...</p>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout theme={theme} toggleTheme={toggleTheme}>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-glow backdrop-blur-xl glass-card animate-fade-in">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-finet-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-finet-100">Painel principal</span>
            <h1 className="mt-4 text-3xl font-semibold text-white">Finet Intelligence</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Visão geral dos seus ganhos, gastos e metas com insights automáticos.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Orçamento diário</p>
              <p className="mt-3 text-3xl font-semibold text-white">R$ {summary.dailyBudget.toFixed(2)}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Sobrevivência financeira</p>
              <p className="mt-3 text-3xl font-semibold text-white">{summary.survivalDays} dias</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-4">
          {[
            { label: 'Saldo total', value: summary.balance, tone: 'text-emerald-300' },
            { label: 'Entradas', value: summary.monthlyIncome, tone: 'text-finet-300' },
            { label: 'Saídas', value: summary.monthlyExpenses, tone: 'text-rose-300' },
            { label: 'Meta de economia', value: summary.recommendedSavings, tone: 'text-sky-300' },
          ].map((card) => (
            <div key={card.label} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 glass-card">
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className={`mt-4 text-3xl font-semibold ${card.tone}`}>R$ {card.value.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 glass-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Evolução financeira</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Histórico de renda e despesas</h2>
              </div>
              <span className="rounded-2xl bg-finet-600/15 px-3 py-1 text-sm text-finet-100">{summary.alert}</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 18, border: '1px solid rgba(148,163,184,0.18)' }} />
                  <Area type="monotone" dataKey="balance" stroke="#7c3aed" fill="url(#incomeGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 glass-card">
            <p className="text-sm text-slate-400">Análise rápida</p>
            <h2 className="mt-3 text-xl font-semibold text-white">Modo sobrevivência</h2>
            <p className="mt-4 text-slate-300">{riskTone}. {summary.prediction}</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-900/80 p-5">
                <p className="text-sm uppercase tracking-[0.23em] text-slate-400">Gasto por semana</p>
                <p className="mt-2 text-3xl font-semibold text-white">R$ {summary.weeklyBudget.toFixed(2)}</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-5">
                <p className="text-sm uppercase tracking-[0.23em] text-slate-400">Gasto por dia</p>
                <p className="mt-2 text-3xl font-semibold text-white">R$ {summary.dailyBudget.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glow glass-card animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Metas inteligentes</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Resultados em desenvolvimento</h2>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">{goals.length} metas</span>
          </div>

          <div className="mt-6 space-y-4">
            {goals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 glass-card">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">{goal.title}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{goal.progressPercentage.toFixed(0)}% concluído</h3>
                  </div>
                  <p className="rounded-full bg-finet-600/10 px-3 py-1 text-sm text-finet-100">{goal.priority}</p>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-finet-500" style={{ width: `${goal.progressPercentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glow glass-card animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Investimentos</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Mercado em tempo real</h2>
            </div>
            <span className="rounded-full bg-slate-700/50 px-3 py-1 text-sm text-slate-100">Atualizado agora</span>
          </div>

          <div className="mt-6 space-y-4">
            {market.slice(0, 4).map((symbol) => (
              <div key={symbol.symbol} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 glass-card">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">{symbol.symbol}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{symbol.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-white">{symbol.price}</p>
                    <span className={`rounded-full px-2 py-1 text-xs ${symbol.change >= 0 ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'}`}>
                      {symbol.change >= 0 ? '+' : ''}{symbol.change}%
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-400">Risco: {symbol.riskLevel} • Potencial: {symbol.potential}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error && <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-red-100">{error}</div>}
    </ProtectedLayout>
  )
}

export default DashboardPage
