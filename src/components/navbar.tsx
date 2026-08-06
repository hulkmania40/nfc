import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Home, Settings, Droplets, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: Home },
  { label: "Settings", to: "/settings", icon: Settings },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <header className="relative z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4 md:px-8 md:py-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 text-slate-900">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/80 shadow-[0_14px_40px_rgba(14,165,233,0.18)] ring-1 ring-white/80 sm:size-11 sm:rounded-2xl">
            <div className="size-4 rounded-full bg-linear-to-br from-cyan-200 via-cyan-400 to-cyan-600 sm:size-5" />
          </div>
          <div className="hidden xs:block">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-cyan-500 sm:text-sm">
              Hydra
            </p>
            <p className="hidden text-[10px] text-slate-500 sm:block sm:text-xs">
              Premium hydration tracker
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                isActive(item.to)
                  ? "bg-cyan-50 text-cyan-700 shadow-sm"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2 rounded-full px-5 bg-cyan-500 hover:bg-cyan-600">
            <Link to="/dashboard">
              <Droplets className="mr-1.5 size-3.5" />
              Open app
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative z-50 flex size-10 items-center justify-center rounded-xl transition-all duration-200 md:hidden",
            isOpen 
              ? "bg-cyan-50 text-cyan-600" 
              : "bg-white/80 text-slate-600 hover:bg-white/90"
          )}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-40 transform bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-y-0" : "-translate-y-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-50">
              <Sparkles className="size-4 text-cyan-500" />
            </div>
            <span className="text-sm font-semibold text-slate-900">Hydra</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-cyan-50 text-cyan-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn(
                  "size-5",
                  active ? "text-cyan-500" : "text-slate-400"
                )} />
                {item.label}
                {active && (
                  <span className="ml-auto size-1.5 rounded-full bg-cyan-500" />
                )}
              </Link>
            )
          })}
          
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Button asChild className="w-full rounded-full bg-cyan-500 hover:bg-cyan-600">
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                <Droplets className="mr-2 size-4" />
                Open App
              </Link>
            </Button>
          </div>

          {/* Mobile Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-center text-xs text-slate-400">
              Premium hydration tracker
            </p>
          </div>
        </nav>
      </div>
    </>
  )
}