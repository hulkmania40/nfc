import { useMemo, useState, type FormEvent, useEffect } from "react"
import { Copy, PlusCircle, Trash2, Check, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ConfirmationSheet } from "@/components/confirmation-sheet"
import { GlassCard } from "@/components/glass-card"
import { Navbar } from "@/components/navbar"
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
  const renameTag = useTagStore((state) => state.renameTag)
  const updateTagDefaultAmount = useTagStore((state) => state.updateTagDefaultAmount)
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
    <div className="min-h-svh pb-8 pt-2">
      <Navbar />

      <div className="mx-auto mt-4 w-full max-w-7xl space-y-4 px-4 sm:mt-6 sm:space-y-6 sm:px-5 md:px-8">
        {/* Header with GlassCard */}
        <GlassCard className="space-y-4 p-5 sm:p-6 md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">
              Settings
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Configure Hydra
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Manage your hydration goals, NFC tags, and data preferences.
            </p>
          </div>

          {/* Settings Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Daily Goal (ml)
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
                  className="h-11 w-full rounded-xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50 sm:h-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  ml
                </span>
              </div>
              <p className="text-xs text-slate-400">Recommended: 2000-3000ml</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Default Glass (ml)
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
                  className="h-11 w-full rounded-xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50 sm:h-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  ml
                </span>
              </div>
              <p className="text-xs text-slate-400">Used for new tags</p>
            </div>
          </div>
        </GlassCard>

        {/* Add Tag & Manage Tags with GlassCard */}
        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Add Tag Form */}
          <GlassCard className="space-y-5 p-5 sm:p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">
                Add NFC Tag
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                Create a glass profile
              </h2>
            </div>

            <form onSubmit={handleAddTag} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Tag Name
                </label>
                <input
                  value={tagName}
                  onChange={(event) => setTagName(event.target.value)}
                  placeholder="e.g., Desk Bottle"
                  className="h-11 w-full rounded-xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50 sm:h-12"
                  maxLength={30}
                />
                <p className="text-xs text-slate-400">
                  {tagName.length}/30 characters
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Default Amount (ml)
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
                    className="h-11 w-full rounded-xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50 sm:h-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ml
                  </span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="rounded-full px-6"
                disabled={!tagName.trim() || !validateAmount(tagAmount)}
              >
                <PlusCircle className="mr-2 size-4" />
                Add Tag
              </Button>
            </form>
          </GlassCard>

          {/* Manage Tags */}
          <GlassCard className="space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">
                  Manage Tags
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                  Your NFC profiles
                </h2>
              </div>
              <span className="rounded-full bg-white/70 px-3 py-1 text-sm text-slate-600">
                {tags.length}
              </span>
            </div>

            {tags.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/70 bg-white/40 p-8 text-center">
                <p className="text-sm text-slate-500">No tags created yet</p>
                <p className="text-xs text-slate-400">Add your first tag above</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-100 overflow-y-auto pr-1">
                {tags.map((tag) => (
                  <GlassCard key={tag.id} tone="soft" className="p-4">
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-[1fr_0.6fr]">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                            Name
                          </label>
                          <input
                            defaultValue={tag.name}
                            onBlur={(event) => {
                              const value = event.target.value.trim()
                              if (value && value !== tag.name) {
                                renameTag(tag.id, value)
                                toast.success(`Renamed to "${value}"`)
                              }
                            }}
                            className="h-10 w-full rounded-lg border border-white/70 bg-white/80 px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50"
                            maxLength={30}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                            Amount
                          </label>
                          <input
                            type="number"
                            min={50}
                            max={1000}
                            step={25}
                            defaultValue={tag.defaultAmount}
                            onBlur={(event) => {
                              const value = Number(event.target.value)
                              if (validateAmount(value) && value !== tag.defaultAmount) {
                                updateTagDefaultAmount(tag.id, value)
                                toast.success(`Updated amount to ${value}ml`)
                              }
                            }}
                            className="h-10 w-full rounded-lg border border-white/70 bg-white/80 px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 rounded-xl bg-white/65 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="truncate font-mono text-xs text-slate-500">
                          {getTagUrl(tag.id)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full px-4"
                            onClick={() => handleCopy(tag.id)}
                          >
                            {copySuccess === tag.id ? (
                              <Check className="size-4 text-green-500" />
                            ) : (
                              <Copy className="size-4" />
                            )}
                            <span className="ml-1.5">
                              {copySuccess === tag.id ? "Copied!" : "Copy URL"}
                            </span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-full px-4"
                            onClick={() => setDeleteTargetId(tag.id)}
                          >
                            <Trash2 className="size-4" />
                            <span className="ml-1.5 hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </GlassCard>
        </section>

        {/* Reset Section with GlassCard */}
        <GlassCard className="space-y-4 border-red-200/50 bg-red-50/30 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-red-500">
                Danger Zone
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                Reset all data
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This will permanently delete all settings, tags, and hydration logs.
              </p>
            </div>
            <Button
              variant="destructive"
              className="rounded-full px-6"
              onClick={() => setResetRequested(true)}
            >
              <RefreshCw className="mr-2 size-4" />
              Reset Everything
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Confirmation Sheets */}
      {deleteTarget && (
        <ConfirmationSheet
          title={`Delete "${deleteTarget.name}"?`}
          amountLabel={`${deleteTarget.defaultAmount} ml`}
          description={`This will remove the "${deleteTarget.name}" tag and stop NFC taps from working.`}
          confirmLabel="Delete Tag"
          secondaryLabel="Keep Tag"
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
          amountLabel="⚠️ This action cannot be undone"
          description="All your settings, tags, and hydration history will be permanently deleted."
          confirmLabel="Yes, Reset All"
          secondaryLabel="Cancel"
          confirmVariant="destructive"
          onCancel={() => setResetRequested(false)}
          onConfirm={handleResetAll}
        />
      )}
    </div>
  )
}