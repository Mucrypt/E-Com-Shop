import { create } from 'zustand'

interface PostCenterState {
  isVisible: boolean
  openPostCenter: () => void
  closePostCenter: () => void
}

const usePostCenterStore = create<PostCenterState>((set) => ({
  isVisible: false,
  openPostCenter: () => set({ isVisible: true }),
  closePostCenter: () => set({ isVisible: false }),
}))

export const usePostCenter = () => {
  const { isVisible, openPostCenter, closePostCenter } = usePostCenterStore()
  
  return {
    isVisible,
    openPostCenter,
    closePostCenter,
  }
}