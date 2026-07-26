import { useEffect, useState } from "react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  if (!visible || deferredPrompt === null) {
    return null
  }

  const handleInstall = async () => {
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setVisible(false)
    setDeferredPrompt(null)
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-5">
      <GlassCard className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-4 p-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Install Hydra</p>
          <p className="text-sm text-slate-600">Launch it like a native app and stay offline-ready.</p>
        </div>
        <Button onClick={handleInstall} className="rounded-full px-4">
          <Download className="size-4" />
          Install
        </Button>
      </GlassCard>
    </div>
  )
}
