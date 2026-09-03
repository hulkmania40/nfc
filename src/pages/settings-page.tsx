import { useMemo, useState, type FormEvent, useEffect } from "react"
import { Copy, PlusCircle, Trash2, Check, RefreshCw, Scan, Gauge, Droplets, Shield } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { Navbar } from "@/components/navbar"
import { BottomTabNav } from "@/components/navbar"
import { ConfirmationSheet } from "@/components/confirmation-sheet"
import { hydrationRepository } from "@/services/hydration-repository"
import { useHydrationStore } from "@/stores/hydration-store"
import { useSettingsStore } from "@/stores/settings-store"
import { useTagStore } from "@/stores/tag-store"

function getTagUrl(tagId: string) {
  if (typeof window === "undefined") {
    return `https://localhost:5173/tap/${tagId}`
  }
  return `${window.location.origin}/tap/${tagId}`
}

export function SettingsPage() {
  const settings = useSettingsStore((state) => state.settings)
  const setDailyGoal = useSettingsStore((state) => state.setDailyGoal)
  const setDefaultGlass = useSettingsStore((state) => state.setDefaultGlass)
  const resetSettings = useSettingsStore((state) => state.resetSettings)
  const tags = useTagStore((state) => state.tags)
  const addTag = useTagStore((state) => state.addTag)
  const deleteTag = useTagStore((state) => state.deleteTag)
  const resetTags = useTagStore((state) => state.resetTags)
  const resetLogs = useHydrationStore((state) => state.resetLogs)

  const [tagName, setTagName] = useState("")
  const [tagAmount, setTagAmount] = useState(settings.defaultGlass)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [resetRequested, setResetRequested] = useState(false)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  const deleteTarget = useMemo(() => tags.find((tag) => tag.id === deleteTargetId) ?? null, [deleteTargetId, tags])

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [copySuccess])

  const handleAddTag = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = tagName.trim()

    if (trimmedName.length === 0) {
      toast.error("Please enter a tag name")
      return
    }

    if (tags.some(tag => tag.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error("A tag with this name already exists")
      return
    }

    addTag({ name: trimmedName, defaultAmount: tagAmount })
    setTagName("")
    setTagAmount(settings.defaultGlass)
    toast.success(`Added "${trimmedName}" tag`)
  }

  const handleCopy = async (tagId: string) => {
    const url = getTagUrl(tagId)
    try {
      await navigator.clipboard.writeText(url)
      setCopySuccess(tagId)
      toast.success("URL copied to clipboard")
    } catch {
      toast.error("Failed to copy URL")
    }
  }

  const handleResetAll = () => {
    hydrationRepository.clearAll()
    resetSettings()
    resetTags()
    resetLogs()
    setResetRequested(false)
    toast.success("All data has been reset")
  }

  const validateAmount = (value: number): boolean => {
    return value >= 50 && value <= 5000 && value % 25 === 0
  }

  return (
    <div className="min-h-svh pb-24 pt-2">
      <Navbar />

      <div className="mx-auto w-full max-w-5xl space-y-4 px-3 sm:space-y-5 sm:px-5">
        {/* Header */}
        <div className="py-4 sm:py-6">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Scan className="size-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em]">Settings</p>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Configure Hydra
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage your goals, NFC tags, and data.
          </p>
        </div>

        {/* Goals */}
        <GlassCard className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Gauge className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Daily Goals</h2>
              <p className="text-xs text-muted-foreground">Your hydration targets</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Daily Goal
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={500}
                  max={10000}
                  step={50}
                  value={settings.dailyGoal}
                  onChange={(event) => {
                    const value = Number(event.target.value)
                    if (value >= 500 && value <= 10000) {
                      setDailyGoal(value)
                    }
                  }}
                  className="h-11 w-full rounded-xl border border-border/60 bg-card/60 px-4 pr-10 text-sm text-foreground outline-none transition focus:border-cyan-500/30 focus:ring-2 focus:ring-cyan-500/10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  ml
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">Recommended: 2000-3000ml</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Default Glass
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={50}
                  max={1000}
                  step={25}
                  value={settings.defaultGlass}
                  onChange={(event) => {
                    const value = Number(event.target.value)
                    if (value >= 50 && value <= 1000) {
                      setDefaultGlass(value)
                    }
                  }}
                  className="h-11 w-full rounded-xl border border-border/60 bg-card/60 px-4 pr-10 text-sm text-foreground outline-none transition focus:border-cyan-500/30 focus:ring-2 focus:ring-cyan-500/10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  ml
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">Used for new tags</p>
            </div>
          </div>
        </GlassCard>

        {/* Add Tag */}
        <GlassCard className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <PlusCircle className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Add NFC Tag</h2>
              <p className="text-xs text-muted-foreground">Create a new glass profile</p>
            </div>
          </div>

          <form onSubmit={handleAddTag} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tag Name
                </label>
                <input
                  value={tagName}
                  onChange={(event) => setTagName(event.target.value)}
                  placeholder="e.g., Desk Bottle"
                  className="h-11 w-full rounded-xl border border-border/60 bg-card/60 px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-cyan-500/30 focus:ring-2 focus:ring-cyan-500/10"
                  maxLength={30}
                />
              </div>

              <div className="space-y-2 sm:w-28">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={50}
                    max={1000}
                    step={25}
                    value={tagAmount}
                    onChange={(event) => {
                      const value = Number(event.target.value)
                      if (value >= 50 && value <= 1000) {
                        setTagAmount(value)
                      }
                    }}
                    className="h-11 w-full rounded-xl border border-border/60 bg-card/60 px-4 pr-8 text-sm text-foreground outline-none transition focus:border-cyan-500/30 focus:ring-2 focus:ring-cyan-500/10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                    ml
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/20 font-medium"
              disabled={!tagName.trim() || !validateAmount(tagAmount)}
            >
              <PlusCircle className="mr-2 size-4" />
              Add Tag
            </Button>
          </form>
        </GlassCard>

        {/* Manage Tags */}
        <GlassCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Droplets className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Your Tags</h2>
                <p className="text-xs text-muted-foreground">{tags.length} registered</p>
              </div>
            </div>
          </div>

          {tags.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
              <p className="text-sm text-muted-foreground">No tags created yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Add your first tag above</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="group flex flex-col gap-3 rounded-2xl border border-border/40 bg-card/40 p-4 transition-colors hover:border-cyan-500/10 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {tag.name}
                      </span>
                      <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
                        {tag.defaultAmount}ml
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground/70 break-all">
                      {getTagUrl(tag.id)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full text-cyan-400 hover:bg-cyan-500/10"
                      onClick={() => handleCopy(tag.id)}
                    >
                      {copySuccess === tag.id ? (
                        <Check className="size-3.5 text-green-400" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                      <span className="ml-1.5 text-xs">{copySuccess === tag.id ? "Copied" : "Copy"}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full text-red-400 hover:bg-red-500/10"
                      onClick={() => setDeleteTargetId(tag.id)}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="ml-1.5 text-xs hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard className="border-red-500/15 bg-red-500/4 p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Shield className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Danger Zone</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently delete all settings, tags, and hydration history.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs"
            onClick={() => setResetRequested(true)}
          >
            <RefreshCw className="mr-1.5 size-3.5" />
            Reset Everything
          </Button>
        </GlassCard>
      </div>

      {/* Modals */}
      {deleteTarget && (
        <ConfirmationSheet
          title={`Delete "${deleteTarget.name}"?`}
          amountLabel={`${deleteTarget.defaultAmount} ml`}
          description="This will stop NFC taps from logging water for this container."
          confirmLabel="Delete"
          secondaryLabel="Keep"
          confirmVariant="destructive"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={() => {
            deleteTag(deleteTarget.id)
            setDeleteTargetId(null)
            toast.success(`Deleted "${deleteTarget.name}"`)
          }}
        />
      )}

      {resetRequested && (
        <ConfirmationSheet
          title="Reset all data?"
          amountLabel="Cannot be undone"
          description="All settings, tags, and logs will be permanently erased."
          confirmLabel="Yes, Reset"
          secondaryLabel="Cancel"
          confirmVariant="destructive"
          onCancel={() => setResetRequested(false)}
          onConfirm={handleResetAll}
        />
      )}

      <BottomTabNav />
    </div>
  )
}
