import { create } from 'zustand'

export interface OnboardingData {
  startupName: string
  tagline: string
  industry: string
  audience: string
  personaTags: string[]
  competitors: [string, string, string]
  channels: string[]
  budget: string
  goal: string
}

interface OnboardingStore extends OnboardingData {
  update: (data: Partial<OnboardingData>) => void
  reset: () => void
}

const INITIAL: OnboardingData = {
  startupName: '',
  tagline: '',
  industry: '',
  audience: '',
  personaTags: [],
  competitors: ['', '', ''],
  channels: [],
  budget: '',
  goal: '',
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...INITIAL,
  update: (data) => set((state) => ({ ...state, ...data })),
  reset: () => set(INITIAL),
}))
