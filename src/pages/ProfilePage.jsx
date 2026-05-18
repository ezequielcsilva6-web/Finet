import { useEffect, useState } from 'react'
import ProtectedLayout from '../components/ProtectedLayout'
import { fetchProfile } from '../api'

function ProfilePage({ theme, toggleTheme }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetchProfile()
        setProfile(response.data.user)
      } catch (err) {
        setError('Erro ao carregar perfil.')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  return (
    <ProtectedLayout theme={theme} toggleTheme={toggleTheme}>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glow">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Perfil</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Sua conta</h1>
          </div>
          <div className="rounded-3xl bg-slate-950/70 px-4 py-3 text-sm text-slate-300">Configurações gerais</div>
        </div>

        {loading && <p className="text-slate-400">Carregando perfil...</p>}
        {error && <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-red-100">{error}</div>}

        {profile && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <h2 className="text-xl font-semibold text-white">Informações pessoais</h2>
              <dl className="mt-6 space-y-4 text-sm text-slate-300">
                <div>
                  <dt className="text-slate-400">Nome completo</dt>
                  <dd className="mt-2 text-white">{profile.name}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">E-mail</dt>
                  <dd className="mt-2 text-white">{profile.email}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">CPF</dt>
                  <dd className="mt-2 text-white">{profile.cpf}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Data de nascimento</dt>
                  <dd className="mt-2 text-white">{profile.birthdate}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <h2 className="text-xl font-semibold text-white">Saúde financeira</h2>
              <p className="mt-4 text-slate-300">O Finet ajuda você a acompanhar seus resultados, manter metas e reduzir gastos.</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-sm text-slate-400">Modo</p>
                  <p className="mt-2 text-lg font-semibold text-white">{theme === 'dark' ? 'Escuro' : 'Claro'}</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-sm text-slate-400">Recomendações</p>
                  <p className="mt-2 text-lg font-semibold text-white">Verifique alertas e otimize suas metas.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </ProtectedLayout>
  )
}

export default ProfilePage
