import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  Activity,
  Target,
  TrendingUp,
  User,
  Moon,
  Sun,
  LogOut,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/', icon: Home },
  { label: 'Planejamento', path: '/planning', icon: Target },
  { label: 'Emocional', path: '/emotional', icon: HeartPulse },
  { label: 'Sobrevivência', path: '/survival', icon: ShieldCheck },
  { label: 'Transações', path: '/transactions', icon: Activity },
  { label: 'Metas', path: '/goals', icon: Target },
  { label: 'Investimentos', path: '/investments', icon: TrendingUp },
  { label: 'Perfil', path: '/profile', icon: User },
]

function ProtectedLayout({ children, theme = 'dark', toggleTheme = () => {} }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('finet-user') || '{}')

  function handleLogout() {
    localStorage.removeItem('finet-token')
    localStorage.removeItem('finet-user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-4 lg:px-6">
        <div className="grid flex-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-glow backdrop-blur-xl lg:sticky lg:top-4 lg:self-start glass-card animate-fade-in">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-finet-600/15 text-finet-200 shadow-lg shadow-finet-500/10">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-finet-300">Finet</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Olá, {user.name || 'Usuário'}</h2>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-3xl px-4 py-3 transition duration-300 ease-out ${
                      active
                        ? 'bg-finet-700/90 text-white shadow-lg shadow-finet-500/20'
                        : 'text-finet-200 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-finet-500/10 hover:-translate-y-0.5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-10 space-y-3 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left text-sm text-finet-100 transition hover:border-finet-500/40 hover:bg-slate-900"
              >
                <span>Modo {theme === 'dark' ? 'claro' : 'escuro'}</span>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-finet-600/10 px-4 py-3 text-left text-sm text-finet-100 transition hover:bg-finet-600/15"
              >
                <span>Sair</span>
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </aside>

          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default ProtectedLayout
