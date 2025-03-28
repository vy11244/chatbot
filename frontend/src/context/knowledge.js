// First update knowledge.js (documents state store)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDocumentsState = create(
  persist(
    (set, get) => ({
      documents: [],
      uploadingFiles: [],

      setDocuments: (documents) => {
        if (Array.isArray(documents)) {
          set({ documents });
        } else {
          console.error('Invalid documents format:', documents);
        }
      },

      deleteDocument: (documentId) => {
        set((state) => ({
          documents: state.documents.filter(doc => doc.document_id !== documentId)
        }));
      },

      setUploadingFiles: (files) => set({ uploadingFiles: files }),

      addDocuments: (newDocs) => {
        if (Array.isArray(newDocs)) {
          set((state) => ({ 
            documents: [...state.documents, ...newDocs],
            uploadingFiles: []
          }));
        }
      },

      clearUploadingFiles: () => set({ uploadingFiles: [] })
    }),
    {
      name: 'documents-storage',
      getStorage: () => localStorage
    }
  )
);

export default useDocumentsState;