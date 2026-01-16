// hooks/useSpecterStore.js
import { create } from 'zustand';

export const useSpecterStore = create((set) => ({
  messages: [],
  logs: [],
  status: 'OFFLINE', // OFFLINE, IDLE, CONNECTED
  sharedKey: null,
  
  setSharedKey: (key) => set({ sharedKey: key }),
  setStatus: (status) => set({ status }),
  
  addMessage: (msg) => set((state) => ({ 
    messages: [...state.messages, { ...msg, id: Date.now() }] 
  })),
  
  addLog: (log) => set((state) => ({ 
    logs: [log, ...state.logs].slice(0, 10) // Keep last 10 logs
  })),

  clearMessages: () => set({ messages: [] }),
}));