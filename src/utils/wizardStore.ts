import { create } from "zustand";

type WizardState = {
  category: string | null;
  formData: Record<string, any>;
  images: any[];
  location: Record<string, any>;
  price: number | null;
  setCategory: (cat: string | null) => void;
  updateData: (field: string, value: any) => void;
  setImages: (imgs: any[]) => void;
  setLocation: (loc: Record<string, any>) => void;
  setPrice: (p: number | null) => void;
  resetAll: () => void;
};

export const useWizardStore = create<WizardState>((set) => ({
  category: null,
  formData: {},
  images: [],
  location: {},
  price: null,

  setCategory: (cat: string | null) => set({ category: cat }),
  updateData: (field: string, value: any) =>
    set((state: WizardState) => ({ formData: { ...state.formData, [field]: value } })),
  setImages: (imgs: any[]) => set({ images: imgs }),
  setLocation: (loc: Record<string, any>) => set({ location: loc }),
  setPrice: (p: number | null) => set({ price: p }),

  resetAll: () =>
    set({ category: null, formData: {}, images: [], location: {}, price: null }),
}));
