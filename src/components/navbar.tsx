import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Settings", to: "/settings" },
]

export function Navbar() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8">
      <Link to="/" className="flex items-center gap-3 text-slate-900">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-white/80 shadow-[0_14px_40px_rgba(14,165,233,0.18)] ring-1 ring-white/80">
          <span className="size-5 rounded-full bg-[radial-gradient(circle_at_30%_30%,#dffbfd,#22d3ee_70%,#0ea5e9)]" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.38em] text-cyan-500">Hydra</p>
          <p className="text-xs text-slate-500">Premium hydration tracker</p>
        </div>
      </Link>

      <nav className="hidden items-center gap-2 md:flex">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/70 hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
        <Button asChild size="sm" className="ml-2 rounded-full px-5">
          <Link to="/dashboard">Open app</Link>
        </Button>
      </nav>
    </header>
  )
}
