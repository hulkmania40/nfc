import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { ClipboardCopy, ExternalLink, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { hydrationRepository } from "@/services/hydration-repository"
import { useTagStore } from "@/stores/tag-store"

function getTagUrl(tagId: string) {
  if (typeof window === "undefined") {
    return `https://localhost:5173/tap/${tagId}`
  }

  return `${window.location.origin}/tap/${tagId}`
}

export function TagOnboarding() {
  const addTag = useTagStore((state) => state.addTag)
  const [name, setName] = useState("Kitchen Glass")
  const [defaultAmount, setDefaultAmount] = useState(250)
  const [createdUrl, setCreatedUrl] = useState<string | null>(null)

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const tag = addTag({ name, defaultAmount })
    setCreatedUrl(getTagUrl(tag.id))
    setName("")
    setDefaultAmount(hydrationRepository.getSettings().defaultGlass)
  }

  const copyUrl = async () => {
    if (createdUrl === null) {
      return
    }

    await navigator.clipboard.writeText(createdUrl)
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center px-5 py-10 md:px-8">
      <GlassCard className="relative overflow-hidden p-8 md:p-10">
        <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_65%)]" />
        <div className="relative flex items-center gap-3 text-cyan-600">
          <Sparkles className="size-5" />
          <p className="text-sm font-semibold uppercase tracking-[0.34em]">First launch</p>
        </div>
        <div className="relative mt-4 space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">Program your first NFC sticker.</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Create a tag for the glass you use most often. Hydra will generate a tap URL for the sticker, while all data stays local.
          </p>
        </div>

        <form onSubmit={handleCreate} className="relative mt-8 grid gap-4 md:grid-cols-[1.2fr_0.8fr_auto]">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Tag name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Kitchen Glass"
              className="h-12 rounded-2xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Default amount</span>
            <input
              type="number"
              min={50}
              step={50}
              value={defaultAmount}
              onChange={(event) => setDefaultAmount(Number(event.target.value))}
              className="h-12 rounded-2xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none ring-0 transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50"
            />
          </label>
          <div className="flex items-end">
            <Button type="submit" className="h-12 rounded-2xl px-6">
              Create tag
            </Button>
          </div>
        </form>

        {createdUrl ? (
          <GlassCard tone="accent" className="relative mt-8 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-500">Program your NFC sticker with this URL</p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="break-all font-mono text-sm text-slate-700">{createdUrl}</p>
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" className="rounded-full px-4" onClick={copyUrl}>
                  <ClipboardCopy className="size-4" />
                  Copy
                </Button>
                <Button asChild className="rounded-full px-4">
                  <Link to="/dashboard">
                    Continue
                    <ExternalLink className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        ) : null}
      </GlassCard>
    </div>
  )
}
