import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl items-center px-5 py-10 md:px-8">
      <GlassCard className="w-full text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">This hydration stream drifted away.</h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-600">
          The page you requested doesn&apos;t exist, but the dashboard is only one tap away.
        </p>
        <Button asChild className="mt-8 rounded-full px-6">
          <Link to="/dashboard">
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
        </Button>
      </GlassCard>
    </div>
  )
}
