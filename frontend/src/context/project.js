// project.js
import { create } from 'zustand';

const useProjectsState = create((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter(p => p.project_id !== projectId)
    })),
}));

export default useProjectsState; // Add default export