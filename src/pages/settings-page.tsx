import { useMemo, useState, type FormEvent } from "react"
import { Copy, PlusCircle, Trash2 } from "lucide-react"

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

  const deleteTarget = useMemo(() => tags.find((tag) => tag.id === deleteTargetId) ?? null, [deleteTargetId, tags])

  const handleAddTag = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (tagName.trim().length === 0) {
      return
    }

    addTag({ name: tagName, defaultAmount: tagAmount })
    setTagName("")
    setTagAmount(settings.defaultGlass)
  }

  const handleCopy = async (tagId: string) => {
    await navigator.clipboard.writeText(getTagUrl(tagId))
  }

  const handleResetAll = () => {
    hydrationRepository.clearAll()
    resetSettings()
    resetTags()
    resetLogs()
    setResetRequested(false)
  }

  return (
    <div className="mx-auto min-h-svh w-full max-w-7xl px-5 pb-12 pt-2 md:px-8">
      <Navbar />

      <div className="mt-6 space-y-6">
        <GlassCard className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">Settings</p>
            <h1 className="mt-1 text-4xl font-semibold tracking-tight text-slate-900">Tune Hydra to your routine.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Adjust the defaults, manage your tags, and keep everything fully local.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Daily goal</span>
              <input
                type="number"
                min={500}
                step={50}
                value={settings.dailyGoal}
                onChange={(event) => setDailyGoal(Number(event.target.value))}
                className="h-12 rounded-2xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none ring-0 transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Default glass amount</span>
              <input
                type="number"
                min={50}
                step={25}
                value={settings.defaultGlass}
                onChange={(event) => setDefaultGlass(Number(event.target.value))}
                className="h-12 rounded-2xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none ring-0 transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50"
              />
            </label>
          </div>
        </GlassCard>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <GlassCard className="space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">Add NFC tag</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">Create another glass profile</h2>
            </div>
            <form onSubmit={handleAddTag} className="space-y-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">Tag name</span>
                <input
                  value={tagName}
                  onChange={(event) => setTagName(event.target.value)}
                  placeholder="Desk Bottle"
                  className="h-12 rounded-2xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none ring-0 transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">Default amount</span>
                <input
                  type="number"
                  min={50}
                  step={25}
                  value={tagAmount}
                  onChange={(event) => setTagAmount(Number(event.target.value))}
                  className="h-12 rounded-2xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none ring-0 transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50"
                />
              </label>
              <Button type="submit" className="rounded-full px-6">
                <PlusCircle className="size-4" />
                Add tag
              </Button>
            </form>
          </GlassCard>

          <GlassCard className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">Manage tags</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">Rename, copy URL, or delete</h2>
            </div>
            <div className="space-y-4">
              {tags.map((tag) => (
                <GlassCard key={tag.id} tone="soft" className="p-4">
                  <div className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_0.4fr]">
                      <label className="grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Name</span>
                        <input
                          defaultValue={tag.name}
                          onBlur={(event) => renameTag(tag.id, event.target.value)}
                          className="h-11 rounded-2xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none ring-0 transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Amount</span>
                        <input
                          type="number"
                          min={50}
                          step={25}
                          defaultValue={tag.defaultAmount}
                          onBlur={(event) => updateTagDefaultAmount(tag.id, Number(event.target.value))}
                          className="h-11 rounded-2xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none ring-0 transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/50"
                        />
                      </label>
                    </div>
                    <div className="flex flex-col gap-3 rounded-2xl bg-white/65 p-4 md:flex-row md:items-center md:justify-between">
                      <p className="break-all font-mono text-xs text-slate-500">{getTagUrl(tag.id)}</p>
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" className="rounded-full px-4" onClick={() => handleCopy(tag.id)}>
                          <Copy className="size-4" />
                          Copy URL
                        </Button>
                        <Button variant="destructive" size="sm" className="rounded-full px-4" onClick={() => setDeleteTargetId(tag.id)}>
                          <Trash2 className="size-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </GlassCard>
        </section>

        <GlassCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">Reset all data</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Start over with a clean slate.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">This removes settings, tags, and hydration logs from local storage.</p>
          </div>
          <Button variant="destructive" className="rounded-full px-6" onClick={() => setResetRequested(true)}>
            Reset everything
          </Button>
        </GlassCard>
      </div>

      {deleteTarget ? (
        <ConfirmationSheet
          title={`Delete ${deleteTarget.name}?`}
          amountLabel="This tag will disappear from the dashboard."
          description="Any future NFC taps for this tag will stop working until it is recreated."
          confirmLabel="Delete tag"
          secondaryLabel="Keep tag"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={() => {
            deleteTag(deleteTarget.id)
            setDeleteTargetId(null)
          }}
        />
      ) : null}

      {resetRequested ? (
        <ConfirmationSheet
          title="Reset all data?"
          amountLabel="Everything stored locally will be removed."
          description="You will need to recreate your tags and goals from scratch."
          confirmLabel="Reset"
          secondaryLabel="Keep data"
          onCancel={() => setResetRequested(false)}
          onConfirm={handleResetAll}
        />
      ) : null}
    </div>
  )
}
