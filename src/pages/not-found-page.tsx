import { Link } from "react-router-dom"
import { ArrowLeft, Droplets } from "lucide-react"

import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm glass rounded-[1.5rem] p-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 mb-2">
          <Droplets className="size-8" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">404</p>
        <h1 className="mt-2 text-xl font-bold text-foreground">
          This stream drifted away.
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The page doesn&apos;t exist, but the dashboard is one tap away.
        </p>
        <Link to="/dashboard" className="block mt-6">
          <Button className="w-full rounded-full bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/20">
            <ArrowLeft className="mr-2 size-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
