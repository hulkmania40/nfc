import { Link, useLocation } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import {
  Droplets,
  Gauge,
  Home,
  Moon,
  SunDim,
  Waves,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSettingsStore } from "@/stores/settings-store"

const navItems = [
  { label: "Home", to: "/dashboard", icon: Home },
  { label: "Settings", to: "/settings", icon: Gauge },
]

const tagNavItems = [
  { label: "Today", to: "/dashboard", icon: Gauge },
  { label: "Tap", to: "/tap/quick", icon: Droplets },
  { label: "History", to: "/history", icon: Waves },
  { label: "Settings", to: "/settings", icon: SunDim },
]

export function Navbar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const settings = useSettingsStore((s) => s.settings)

  const isDashboardArea = location.pathname === "/" || location.pathname.startsWith("/dashboard")
  const activeItems = isDashboardArea ? tagNavItems : navItems

  return (
    <>
      <header className="sticky top-0 z-50 mx-auto w-full max-w-5xl px-3 py-2.5 sm:px-5 sm:py-3">
        <nav className="glass-strong flex items-center justify-between rounded-[1.25rem] px-4 py-2.5 sm:rounded-[1.5rem] sm:px-5">
          <Link to="/dashboard" className="flex items-center gap-2.5 text-foreground">
            <div className="relative flex size-9 items-center justify-center sm:size-10">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-pulse-glow" />
              <Droplets className="size-5 text-cyan-400 relative z-10" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold tracking-wider text-foreground">HYDRA</span>
              <p className="text-[10px] text-muted-foreground tracking-wide">
                {settings.dailyGoal.toLocaleString()} ml goal
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {activeItems.map((item) => {
              const active = location.pathname.startsWith(item.to)
              const Icon = item.icon as LucideIcon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm",
                    active
                      ? "bg-cyan-500/15 text-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.12)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("size-4", active && "text-cyan-400")} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-1 flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunDim className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </nav>
      </header>
    </>
  )
}

export function BottomTabNav() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-5xl px-3 pb-3 sm:pb-5">
      <div className="glass-strong flex items-center justify-around rounded-[1.25rem] px-2 py-1.5 sm:rounded-[1.5rem] sm:px-3 sm:py-2">
        {tagNavItems.map((item) => {
          const active = location.pathname === item.to || (item.to === "/tap/quick" && location.pathname.startsWith("/tap"))
          const Icon = item.icon as LucideIcon
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all duration-200 sm:gap-1 sm:px-4 sm:py-2",
                active
                  ? "text-cyan-400"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                {active && (
                  <div className="absolute -inset-2 rounded-full bg-cyan-500/15" />
                )}
                <Icon className={cn("size-5 relative z-10", active && "scale-110")} />
              </div>
              <span className={cn("text-[9px] font-medium sm:text-[10px]", active && "text-cyan-400")}>
                {item.label}
              </span>
            </Link>
          )
        })}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:gap-1 sm:px-4 sm:py-2"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunDim className="size-5" /> : <Moon className="size-5" />}
        </button>
      </div>
    </nav>
  )
}
