import { create } from "zustand"

import { hydrationRepository } from "@/services/hydration-repository"
import type { HydrationTag } from "@/types/hydration"

type TagInput = {
  name: string
  defaultAmount: number
}

type TagState = {
  tags: HydrationTag[]
  addTag: (input: TagInput) => HydrationTag
  renameTag: (id: string, name: string) => void
  updateTagDefaultAmount: (id: string, defaultAmount: number) => void
  deleteTag: (id: string) => void
  resetTags: () => void
  getTagById: (id: string) => HydrationTag | undefined
}

const initialTags = hydrationRepository.getTags()

export const useTagStore = create<TagState>((set, get) => ({
  tags: initialTags,
  addTag(input) {
    const tag: HydrationTag = {
      id: hydrationRepository.createTagId(),
      name: input.name.trim(),
      defaultAmount: Math.max(1, Math.round(input.defaultAmount)),
    }

    set((state) => {
      const tags = [...state.tags, tag]
      hydrationRepository.saveTags(tags)
      return { tags }
    })

    return tag
  },
  renameTag(id, name) {
    set((state) => {
      const tags = state.tags.map((tag) => (tag.id === id ? { ...tag, name: name.trim() } : tag))
      hydrationRepository.saveTags(tags)
      return { tags }
    })
  },
  updateTagDefaultAmount(id, defaultAmount) {
    set((state) => {
      const tags = state.tags.map((tag) =>
        tag.id === id ? { ...tag, defaultAmount: Math.max(1, Math.round(defaultAmount)) } : tag
      )
      hydrationRepository.saveTags(tags)
      return { tags }
    })
  },
  deleteTag(id) {
    set((state) => {
      const tags = state.tags.filter((tag) => tag.id !== id)
      hydrationRepository.saveTags(tags)
      return { tags }
    })
  },
  resetTags() {
    set(() => {
      hydrationRepository.saveTags([])
      return { tags: [] }
    })
  },
  getTagById(id) {
    return get().tags.find((tag) => tag.id === id)
  },
}))
