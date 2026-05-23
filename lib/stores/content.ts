import { create } from 'zustand'
import type { RichContentIdea } from '@/lib/claude'

export interface SavedIdea {
  uid: string
  idea: RichContentIdea
  savedAt: string
}

interface ContentStore {
  savedIdeas: SavedIdea[]
  templateFormat: string | null
  selectedIdea: RichContentIdea | null
  saveIdea: (idea: RichContentIdea) => void
  removeIdea: (uid: string) => void
  setTemplateFormat: (format: string) => void
  setSelectedIdea: (idea: RichContentIdea | null) => void
}

export const useContentStore = create<ContentStore>((set) => ({
  savedIdeas: [],
  templateFormat: null,
  selectedIdea: null,
  saveIdea: (idea) =>
    set((state) => {
      if (state.savedIdeas.some((s) => s.idea.id === idea.id)) return state
      return {
        savedIdeas: [
          { uid: `${idea.id}-${Date.now()}`, idea, savedAt: new Date().toISOString() },
          ...state.savedIdeas,
        ],
      }
    }),
  removeIdea: (uid) =>
    set((state) => ({ savedIdeas: state.savedIdeas.filter((s) => s.uid !== uid) })),
  setTemplateFormat: (format) => set({ templateFormat: format }),
  setSelectedIdea: (idea) => set({ selectedIdea: idea }),
}))
