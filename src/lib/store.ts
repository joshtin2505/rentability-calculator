import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, GeneralData, CalculationResult, FixedCost } from "@/types"

interface AppState {
  products: Product[]
  generalData: GeneralData
  calculationResult: CalculationResult | null
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  removeProduct: (id: string) => void
  setGeneralData: (data: GeneralData) => void
  addFixedCost: (cost: FixedCost) => void
  updateFixedCost: (id: string, cost: Partial<FixedCost>) => void
  removeFixedCost: (id: string) => void
  setCalculationResult: (result: CalculationResult) => void
  clearAll: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      products: [],
      generalData: {
        laborCostPerHour: 0,
        fixedCosts: [
          { id: "1", name: "Arriendo", amount: 0 },
          { id: "2", name: "Servicios", amount: 0 },
          { id: "3", name: "Transporte", amount: 0 },
          { id: "4", name: "Otros", amount: 0 },
        ],
      },
      calculationResult: null,

      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),

      updateProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
        })),

      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      setGeneralData: (data) => set({ generalData: data }),

      addFixedCost: (cost) =>
        set((state) => ({
          generalData: {
            ...state.generalData,
            fixedCosts: [...state.generalData.fixedCosts, cost],
          },
        })),

      updateFixedCost: (id, updatedCost) =>
        set((state) => ({
          generalData: {
            ...state.generalData,
            fixedCosts: state.generalData.fixedCosts.map((c) => (c.id === id ? { ...c, ...updatedCost } : c)),
          },
        })),

      removeFixedCost: (id) =>
        set((state) => ({
          generalData: {
            ...state.generalData,
            fixedCosts: state.generalData.fixedCosts.filter((c) => c.id !== id),
          },
        })),

      setCalculationResult: (result) => set({ calculationResult: result }),

      clearAll: () =>
        set({
          products: [],
          generalData: {
            laborCostPerHour: 0,
            fixedCosts: [
              { id: "1", name: "Arriendo", amount: 0 },
              { id: "2", name: "Servicios", amount: 0 },
              { id: "3", name: "Transporte", amount: 0 },
              { id: "4", name: "Otros", amount: 0 },
            ],
          },
          calculationResult: null,
        }),
    }),
    {
      name: "business-calculator-storage",
    },
  ),
)
