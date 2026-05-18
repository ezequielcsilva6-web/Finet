import { useEffect, useState } from 'react'
import ProtectedLayout from '../components/ProtectedLayout'
import { simulatePlanning } from '../api'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function PlanningDashboard() {
  const [months, setMonths] = useState(12)
  const [scenario, setScenario] = useState('baseline')
  const [monthlyContribution, setMonthlyContribution] = useState(0)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // fetch initial simulation on mount
    runSim()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runSim() {
    setLoading(true)
    try {
      const payload = { months: Number(months), scenario, monthlyContribution: Number(monthlyContribution) }
      const res = await simulatePlanning(payload)
      setResult(res.data)
    } catch (e) {
      console.error('Simulação falhou', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedLayout>
      <div className="p-6 animate-fade-in">
        <h1 className="text-2xl font-semibold mb-4">Planejamento Financeiro — Simulador</h1>
        <div className="mb-4 flex flex-col gap-4 lg:flex-row">
        <label className="flex items-center gap-2">
          Meses:
          <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className="ml-2 p-1 border rounded w-24" />
        </label>
        <label className="flex items-center gap-2">
          Cenário:
          <select value={scenario} onChange={(e) => setScenario(e.target.value)} className="ml-2 p-1 border rounded">
            <option value="conservative">Conservador</option>
            <option value="baseline">Padrão</option>
            <option value="aggressive">Agressivo</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Contribuição mensal:
          <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} className="ml-2 p-1 border rounded w-32" />
        </label>
        <button onClick={runSim} disabled={loading} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'Executando...' : 'Simular'}
        </button>
      </div>

      {result && (
        <div>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 border rounded glass-card">Saldo inicial: <strong>R$ {result.initialBalance}</strong></div>
            <div className="p-4 border rounded glass-card">Saldo final: <strong>R$ {result.finalBalance}</strong></div>
            <div className="p-4 border rounded glass-card">Total contribuído: <strong>R$ {result.totalContributed}</strong></div>
          </div>

          <div className="mb-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl bg-slate-950/80 p-4 glass-card">
              <p className="text-sm text-slate-400">Crescimento mensal médio</p>
              <p className="mt-2 text-2xl font-semibold text-white">R$ {result.projections.length ? ((result.finalBalance - result.initialBalance) / months).toFixed(2) : '0.00'}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-4 glass-card">
              <p className="text-sm text-slate-400">Primeiro momento de atenção</p>
              <p className="mt-2 text-2xl font-semibold text-white">{result.firstNegativeMonth ? `${result.firstNegativeMonth} mês(es)` : 'Sem risco imediato'}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-4 glass-card">
              <p className="text-sm text-slate-400">Ritmo de planejamento</p>
              <p className="mt-2 text-2xl font-semibold text-white">{result.pace}</p>
            </div>
          </div>

          <div style={{ height: 320 }} className="mb-6 rounded-3xl bg-slate-950/80 glass-card">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.projections} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#8884d8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6 glass-card">
            <h3 className="text-lg font-medium mb-3">Orientação da IA</h3>
            <ul className="space-y-2 text-slate-300">
              {result.guidance.map((item, index) => (
                <li key={index} className="rounded-3xl bg-slate-900/80 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Detalhes por mês</h3>
            <div className="overflow-auto max-h-64 border rounded">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Mês</th>
                    <th className="p-2">Saldo</th>
                    <th className="p-2">Fluxo mensal</th>
                    <th className="p-2">Contribuído</th>
                  </tr>
                </thead>
                <tbody>
                  {result.projections.map((p) => (
                    <tr key={p.month} className="border-t">
                      <td className="p-2">{p.month}</td>
                      <td className="p-2">R$ {p.balance}</td>
                      <td className="p-2">R$ {p.monthlyNet}</td>
                      <td className="p-2">R$ {p.cumulativeContribution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedLayout>
  )
}
