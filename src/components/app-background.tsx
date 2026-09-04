import { useState, useEffect } from "react"

function checkDark(): boolean {
  return !document.documentElement.classList.contains("light")
}

export function AppBackground() {
  const [isDark, setIsDark] = useState(() => checkDark())

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const update = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => setIsDark(checkDark()), 50)
    }

    // MutationObserver catches classList changes on <html> from ThemeProvider
    const observer = new MutationObserver(update)
    const root = document.documentElement
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })

    // Storage event catches cross-tab changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme") update()
    }
    window.addEventListener("storage", handleStorage)

    return () => {
      observer.disconnect()
      window.removeEventListener("storage", handleStorage)
      clearTimeout(timeout)
    }
  }, [])

  if (!isDark) {
    // Light mode: render the colorful gradient background
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(167,243,255,0.45),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(186,230,253,0.25),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(239,246,255,0.72))]" />
        <div className="absolute -left-20 -top-30 h-96 w-96 rounded-full bg-cyan-300/35 blur-3xl" />
        <div className="absolute -right-35 top-36 h-120 w-120 rounded-full bg-sky-200/45 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-112 bg-[linear-gradient(180deg,transparent,rgba(238,250,255,0.72))]" />
      </div>
    )
  }

  // Dark mode: render subtle dark-mode gradients
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.04),transparent_50%)]" />
      <div className="absolute -left-40 top-1/3 h-160 w-160 rounded-full bg-cyan-500/3 blur-[120px]" />
      <div className="absolute -right-40 bottom-1/4 h-120 w-120 rounded-full bg-blue-500/3 blur-[100px]" />
    </div>
  )
}
