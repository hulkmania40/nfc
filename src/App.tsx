import { Routes, Route, Navigate } from "react-router-dom"

import { AppBackground } from "@/components/app-background"
import { InstallPrompt } from "@/components/install-prompt"
import { UndoToast } from "@/components/undo-toast"
import { DashboardPage } from "@/pages/dashboard-page"
import { LandingPage } from "@/pages/landing-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { SettingsPage } from "@/pages/settings-page"
import { HistoryPage } from "@/pages/history-page"
import { TapPage } from "@/pages/tap-page"

export function App() {
  return (
    <div className="relative min-h-svh overflow-hidden">
      <AppBackground />
      <UndoToast />
      <InstallPrompt />
      <main className="relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tap" element={<Navigate to="/dashboard" replace />} />
          <Route path="/tap/:tagId" element={<TapPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
