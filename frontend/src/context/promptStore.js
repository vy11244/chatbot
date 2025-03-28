import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePromptStore = create(
  persist(
    (set) => ({
      optimizedPrompt: '',
      textareaContent: '',
      setOptimizedPrompt: (prompt) => set({ optimizedPrompt: prompt }),
      setTextareaContent: (content) => set({ textareaContent: content }),
    }),
    {
      name: 'prompt-storage',
    }
  )
)