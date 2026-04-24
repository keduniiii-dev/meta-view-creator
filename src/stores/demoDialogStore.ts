import { create } from 'zustand'

interface DemoDialogState {
  open: boolean
  setOpen: (open: boolean) => void
}

export const useDemoDialogStore = create<DemoDialogState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))