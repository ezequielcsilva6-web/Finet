import { useEffect, useMemo, useState } from 'react'
import ProtectedLayout from '../components/ProtectedLayout'
import { createGoal, deleteGoal, fetchGoals } from '../api'

function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [form, setForm] = useState({ title: '', target_amount: '', current_amount: '', months: 12, priority: 'Alta' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadGoals() {
      setLoading(true)
      try {
        const response = await fetchGoals()
        setGoals(response.data.goals)
      } catch (err) {
        setError('Não foi possível carregar metas.')
      } finally {
        setLoading(false)
      }
    }
    loadGoals()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      const payload = {
        title: form.title,
        target_amount: Number(form.target_amount),
        current_amount: Number(form.current_amount),
        months: Number(form.months),
        priority: form.priority,
      }
      await createGoal(payload)
      setForm({ title: '', target_amount: '', current_amount: '', months: 12, priority: 'Alta' })
      const response = await fetchGoals()
      setGoals(response.data.goals)
    } catch (err) {
      setError('Falha ao criar meta financeira.')
    }
  }

  async function handleDelete(goalId) {
    setError('')
    try {
      await deleteGoal(goalId)
      const response = await fetchGoals()
      setGoals(response.data.goals)
    } catch (err) {
      setError('Falha ao excluir a meta.')
    }
  }

  const progressMetrics = useMemo(() => {
    const total = goals.reduce((sum, goal) => sum + goal.progressPercentage, 0)
    return goals.length ? Math.round(total / goals.length) : 0
  }, [goals])

  return (
    <ProtectedLayout>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glow glass-card animate-fade-in">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Objetivos e conquistas</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Meus Objetivos</h1>
          </div>
          <div className="rounded-3xl bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
            Progresso médio: {progressMetrics}%
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h2 className="text-xl font-semibold text-white">Visão geral das metas</h2>
            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-slate-400">Carregando metas...</p>
              ) : goals.length === 0 ? (
                <p className="text-slate-400">Ainda não há metas criadas.</p>
              ) : (
                goals.map((goal) => (
                  <div key={goal.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 glass-card">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-400">{goal.title}</p>
                        <h3 className="mt-2 text-lg font-semibold text-white">R$ {goal.current_amount.toFixed(2)} de R$ {goal.target_amount.toFixed(2)}</h3>
                      </div>
                      <span className="rounded-full bg-finet-600/10 px-3 py-1 text-sm text-finet-100">{goal.priority}</span>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-finet-500" style={{ width: `${goal.progressPercentage}%` }} />
                    </div>
                    <p className="mt-3 text-sm text-slate-400">Guarde R$ {goal.monthlySavings.toFixed(2)} / mês para atingir em {goal.months} meses.</p>
                    <button
                      type="button"
                      onClick={() => handleDelete(goal.id)}
                      className="mt-4 rounded-3xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                    >
                      Excluir objetivo
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h2 className="text-xl font-semibold text-white">Nova meta</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm text-slate-300">
                Nome do objetivo
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  placeholder="Comprar moto"
                />
              </label>

              <label className="block text-sm text-slate-300">
                Valor total
                <input
                  type="number"
                  name="target_amount"
                  value={form.target_amount}
                  onChange={handleChange}
                  required
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  placeholder="18000"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Já possui guardado
                  <input
                    type="number"
                    name="current_amount"
                    value={form.current_amount}
                    onChange={handleChange}
                    required
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                    placeholder="2000"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Prazo (meses)
                  <input
                    type="number"
                    name="months"
                    value={form.months}
                    onChange={handleChange}
                    required
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  />
                </label>
              </div>

              <label className="block text-sm text-slate-300">
                Prioridade
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                >
                  <option>Alta</option>
                  <option>Média</option>
                  <option>Baixa</option>
                </select>
              </label>

              <button type="submit" className="w-full rounded-3xl bg-finet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-finet-400">
                Criar objetivo
              </button>
            </form>
          </div>
        </div>

        {error && <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-red-100">{error}</div>}
      </section>
    </ProtectedLayout>
  )
}

export default GoalsPage
