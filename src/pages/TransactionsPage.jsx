import { useEffect, useMemo, useState } from 'react'
import ProtectedLayout from '../components/ProtectedLayout'
import { createTransaction, deleteTransaction, fetchTransactions } from '../api'

const categories = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Moradia', 'Cartão de crédito', 'Investimentos', 'Educação', 'Delivery', 'Outros']

function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [form, setForm] = useState({ title: '', amount: '', type: 'expense', category: 'Alimentação', date: '', note: '', recurrence: 'Único' })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    setLoading(true)
    try {
      const response = await fetchTransactions()
      setTransactions(response.data.transactions)
    } catch (err) {
      setError('Não foi possível carregar transações.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const payload = { ...form, amount: Number(form.amount) }
      await createTransaction(payload)
      setForm({ title: '', amount: '', type: 'expense', category: 'Alimentação', date: '', note: '', recurrence: 'Único' })
      loadTransactions()
    } catch (err) {
      setError('Erro ao adicionar transação.')
    }
  }

  async function handleDelete(id) {
    await deleteTransaction(id)
    loadTransactions()
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => transaction.title.toLowerCase().includes(search.toLowerCase()) || transaction.category.toLowerCase().includes(search.toLowerCase()))
  }, [search, transactions])

  return (
    <ProtectedLayout>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glow">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Controle financeiro</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Movimentações</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-[280px_auto]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
              placeholder="Buscar transações"
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h2 className="text-xl font-semibold text-white">Histórico</h2>
            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-slate-400">Carregando transações...</p>
              ) : filteredTransactions.length === 0 ? (
                <p className="text-slate-400">Nenhuma transação encontrada.</p>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-slate-900/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{transaction.category}</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{transaction.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">{transaction.date} • {transaction.recurrence}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-semibold ${transaction.type === 'income' ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDelete(transaction.id)}
                        className="mt-2 text-sm text-slate-400 hover:text-rose-200"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h2 className="text-xl font-semibold text-white">Nova transação</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm text-slate-300">
                Título
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  placeholder="Salário, mercado, academia"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Valor
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                    placeholder="R$ 0,00"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Categoria
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Tipo
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  >
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                  </select>
                </label>
                <label className="block text-sm text-slate-300">
                  Data
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Recorrência
                  <select
                    name="recurrence"
                    value={form.recurrence}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                  >
                    <option>Único</option>
                    <option>Semanal</option>
                    <option>Mensal</option>
                    <option>Anual</option>
                  </select>
                </label>
                <label className="block text-sm text-slate-300">
                  Nota
                  <input
                    type="text"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-finet-500 focus:ring-2 focus:ring-finet-500/20"
                    placeholder="Observações extras"
                  />
                </label>
              </div>

              <button type="submit" className="w-full rounded-3xl bg-finet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-finet-400">
                Adicionar movimentação
              </button>
            </form>
          </div>
        </div>

        {error && <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-red-100">{error}</div>}
      </section>
    </ProtectedLayout>
  )
}

export default TransactionsPage
