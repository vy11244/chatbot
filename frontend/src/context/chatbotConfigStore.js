import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePreviewStore = create(
  persist(
    (set, get) => ({
      chatbotName: "AI Assistant",
      headerColor: "#f5f5f5",
      avatarFile: null,
      avatarUrl: null,
      systemPrompt: "",
      setName: (name) => set({ chatbotName: name }),
      setHeaderColor: (color) => set({ headerColor: color }),
      setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
      setAvatarFile: (file) => {
        if (file) {
          const prevUrl = get().avatarUrl;
          if (prevUrl) URL.revokeObjectURL(prevUrl);
          const newUrl = URL.createObjectURL(file);
          set({ avatarFile: file, avatarUrl: newUrl });
        }
      },
      clearAvatarUrl: () => {
        const prevUrl = get().avatarUrl;
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        set({ avatarUrl: null });
      }
    }),
    {
      name: 'preview-settings',
      getStorage: () => localStorage,
    }
  )
);