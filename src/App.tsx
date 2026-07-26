import { AnimatePresence, motion } from "framer-motion"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import { AppBackground } from "@/components/app-background"
import { InstallPrompt } from "@/components/install-prompt"
import { UndoToast } from "@/components/undo-toast"
import { DashboardPage } from "@/pages/dashboard-page"
import { LandingPage } from "@/pages/landing-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { SettingsPage } from "@/pages/settings-page"
import { TapPage } from "@/pages/tap-page"

export function App() {
  const location = useLocation()

  return (
    <div className="relative min-h-svh overflow-hidden">
      <AppBackground />
      <UndoToast />
      <InstallPrompt />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
          transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
          className="relative"
        >
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tap/:tagId" element={<TapPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  )
}

export default App
