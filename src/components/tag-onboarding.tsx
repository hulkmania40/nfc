import { useState, type FormEvent, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ClipboardCopy, Sparkles, Check, Droplets, ArrowRight } from "lucide-react"
import { toast } from "sonner"

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
  const tags = useTagStore((state) => state.tags)
  
  const [name, setName] = useState("")
  const [defaultAmount, setDefaultAmount] = useState(250)
  const [createdUrl, setCreatedUrl] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({})
  
  const nameInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)

  // Focus name input on mount
  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  // Reset copy state after 2 seconds
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isCopied])

  const validateForm = (): boolean => {
    const newErrors: { name?: string; amount?: string } = {}
    
    // Validate name
    const trimmedName = name.trim()
    if (!trimmedName) {
      newErrors.name = "Please enter a tag name"
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    } else if (trimmedName.length > 30) {
      newErrors.name = "Name must be less than 30 characters"
    } else if (tags.some(tag => tag.name.toLowerCase() === trimmedName.toLowerCase())) {
      newErrors.name = "A tag with this name already exists"
    }
    
    // Validate amount
    if (defaultAmount < 50) {
      newErrors.amount = "Minimum amount is 50ml"
    } else if (defaultAmount > 5000) {
      newErrors.amount = "Maximum amount is 5000ml"
    } else if (defaultAmount % 25 !== 0) {
      newErrors.amount = "Amount must be in multiples of 25ml"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!validateForm()) {
      // Focus first field with error
      if (errors.name) {
        nameInputRef.current?.focus()
      }
      return
    }

    setIsCreating(true)
    
    try {
      const trimmedName = name.trim()
      const tag = addTag({ name: trimmedName, defaultAmount })
      const url = getTagUrl(tag.id)
      setCreatedUrl(url)
      toast.success(`Created "${trimmedName}" tag!`)
      
      // Reset form but keep the URL visible
      setName("")
      setDefaultAmount(hydrationRepository.getSettings().defaultGlass || 250)
      
      // Scroll to URL section
      setTimeout(() => {
        urlInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    } catch (error) {
      toast.error("Failed to create tag. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const copyUrl = async () => {
    if (!createdUrl) return
    
    try {
      await navigator.clipboard.writeText(createdUrl)
      setIsCopied(true)
      toast.success("URL copied to clipboard!")
    } catch {
      toast.error("Failed to copy URL")
    }
  }

  const handleAmountChange = (value: string) => {
    const numValue = Number(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setDefaultAmount(numValue)
      // Clear amount error if valid
      if (numValue >= 50 && numValue <= 5000 && numValue % 25 === 0) {
        setErrors(prev => ({ ...prev, amount: undefined }))
      }
    }
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-4xl flex-col justify-center px-4 py-10 sm:px-5 md:px-8">
      <GlassCard className="relative overflow-hidden p-6 sm:p-8 md:p-10">
        {/* Background gradient */}
        <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_65%)]" />
        
        {/* Header */}
        <div className="relative">
          <div className="flex items-center gap-3 text-cyan-600">
            <Sparkles className="size-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.34em]">Welcome to Hydra</p>
          </div>
          
          <div className="mt-4 space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Create your first tag
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Set up your first NFC tag to start tracking your hydration. All data stays local on your device.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="relative mt-6 space-y-4 sm:mt-8">
          <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Tag Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  // Clear name error if valid
                  if (errors.name && event.target.value.trim().length >= 2) {
                    setErrors(prev => ({ ...prev, name: undefined }))
                  }
                }}
                placeholder="e.g., Kitchen Glass"
                className={`h-12 w-full rounded-xl border bg-white/80 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                  errors.name 
                    ? 'border-red-300 focus:border-red-300 focus:ring-red-200/50' 
                    : 'border-white/70 focus:border-cyan-300 focus:ring-cyan-200/50'
                }`}
                maxLength={30}
                disabled={isCreating}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              <div className="flex items-center justify-between">
                {errors.name ? (
                  <p id="name-error" className="text-xs text-red-500">
                    {errors.name}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    {name.length}/30 characters
                  </p>
                )}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Default Amount (ml) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={50}
                  max={5000}
                  step={25}
                  value={defaultAmount || ''}
                  onChange={(event) => handleAmountChange(event.target.value)}
                  onBlur={() => {
                    // Auto-correct to nearest valid amount
                    if (defaultAmount < 50) setDefaultAmount(50)
                    else if (defaultAmount > 5000) setDefaultAmount(5000)
                    else if (defaultAmount % 25 !== 0) {
                      setDefaultAmount(Math.round(defaultAmount / 25) * 25)
                    }
                  }}
                  className={`h-12 w-full rounded-xl bg-white/80 px-4 text-slate-900 outline-none transition focus:ring-4 ${
                    errors.amount 
                      ? 'border-red-300 focus:border-red-300 focus:ring-red-200/50' 
                      : 'border border-white/70 focus:border-cyan-300 focus:ring-cyan-200/50'
                  }`}
                  disabled={isCreating}
                  aria-invalid={!!errors.amount}
                  aria-describedby={errors.amount ? "amount-error" : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  ml
                </span>
              </div>
              {errors.amount ? (
                <p id="amount-error" className="text-xs text-red-500">
                  {errors.amount}
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Multiples of 25ml • 50-5000ml
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full rounded-full sm:w-auto"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 size-4" />
                Create Tag
              </>
            )}
          </Button>
        </form>

        {/* Success State - Created URL */}
        {createdUrl && (
          <GlassCard 
            ref={urlInputRef}
            tone="accent" 
            className="relative mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300 sm:mt-8"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                <Check className="size-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-600">
                    Tag Created! 🎉
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Program your NFC sticker with this URL:
                  </p>
                </div>
                
                <div className="flex flex-col gap-3 rounded-xl bg-white/70 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="break-all font-mono text-xs text-slate-700 sm:text-sm">
                    {createdUrl}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="rounded-full px-4"
                      onClick={copyUrl}
                      disabled={isCopied}
                    >
                      {isCopied ? (
                        <>
                          <Check className="mr-1.5 size-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardCopy className="mr-1.5 size-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button asChild className="rounded-full px-4">
                      <Link to="/dashboard">
                        Continue
                        <ArrowRight className="ml-1.5 size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Droplets className="size-3.5" />
                  <span>Tap the URL with any NFC writer app to program your sticker</span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </GlassCard>
    </div>
  )
}