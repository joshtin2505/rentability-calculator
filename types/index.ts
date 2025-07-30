export interface Product {
  id: string
  name: string
  materialCost: number
  productionPerHour: number
  salePrice?: number // Opcional, se puede calcular por margen
  monthlyProduction: number
  contributionMargin?: number // Margen de contribución deseado
  usePriceByMargin: boolean // Si usar precio por margen o precio fijo
}

export interface FixedCost {
  id: string
  name: string
  amount: number
}

export interface GeneralData {
  laborCostPerHour: number
  fixedCosts: FixedCost[]
}

export interface ProductCalculation extends Product {
  laborCostPerUnit: number
  directCost: number
  fixedCostPerUnit: number
  totalCostPerUnit: number
  calculatedSalePrice?: number // Precio calculado por margen
  finalSalePrice: number // Precio final usado
  grossProfitPerUnit: number
  profitMarginPercentage: number
  monthlyProfit: number
}

export interface CalculationResult {
  products: ProductCalculation[]
  totalMonthlyProfit: number
  totalMonthlyRevenue: number
  totalMonthlyCosts: number
  averageProfitMargin: number
  totalFixedCosts: number
}
