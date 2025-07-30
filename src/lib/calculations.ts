import type { Product, GeneralData, ProductCalculation, CalculationResult } from "@/types"

export function calculateProductProfitability(products: Product[], generalData: GeneralData): CalculationResult {
  const totalFixedCosts = generalData.fixedCosts.reduce((sum, cost) => sum + cost.amount, 0)
  const totalMonthlyProduction = products.reduce((sum, product) => sum + product.monthlyProduction, 0)

  const calculatedProducts: ProductCalculation[] = products.map((product) => {
    // Costo de mano de obra por unidad
    const laborCostPerUnit = generalData.laborCostPerHour / product.productionPerHour

    // Costo directo (materiales + mano de obra)
    const directCost = product.materialCost + laborCostPerUnit

    // Costo fijo prorrateado por unidad

  const fixedCostPerUnit = totalFixedCosts / totalMonthlyProduction
    // Costo total final por unidad
    const totalCostPerUnit = directCost + fixedCostPerUnit

    // Determinar precio de venta final
    let finalSalePrice: number
    let calculatedSalePrice: number | undefined

    if (product.usePriceByMargin && product.contributionMargin) {
      // Calcular precio por margen de contribución
      // Precio = Costo Total / (1 - Margen/100)
      calculatedSalePrice = totalCostPerUnit / (1 - product.contributionMargin / 100)
      finalSalePrice = calculatedSalePrice
    } else {
      // Usar precio fijo
      finalSalePrice = product.salePrice || 0
    }

    // Utilidad bruta por unidad
    const grossProfitPerUnit = finalSalePrice - totalCostPerUnit

    // Margen de ganancia en porcentaje
    const profitMarginPercentage = finalSalePrice > 0 ? (grossProfitPerUnit / finalSalePrice) * 100 : 0

    // Utilidad mensual estimada
    const monthlyProfit = grossProfitPerUnit * product.monthlyProduction

    return {
      ...product,
      laborCostPerUnit,
      directCost,
      fixedCostPerUnit,
      totalCostPerUnit,
      calculatedSalePrice,
      finalSalePrice,
      grossProfitPerUnit,
      profitMarginPercentage,
      monthlyProfit,
    }
  })

  const totalMonthlyProfit = calculatedProducts.reduce((sum, product) => sum + product.monthlyProfit, 0)
  const totalMonthlyRevenue = calculatedProducts.reduce(
    (sum, product) => sum + product.finalSalePrice * product.monthlyProduction,
    0,
  )
  const totalMonthlyCosts = totalMonthlyRevenue - totalMonthlyProfit
  const averageProfitMargin = totalMonthlyRevenue > 0 ? (totalMonthlyProfit / totalMonthlyRevenue) * 100 : 0

  return {
    products: calculatedProducts,
    totalMonthlyProfit,
    totalMonthlyRevenue,
    totalMonthlyCosts,
    averageProfitMargin,
    totalFixedCosts,
  }
}

// Función para calcular costos en tiempo real (para el formulario)
export function calculateProductCosts(
  product: Partial<Product>,
  generalData: GeneralData,
  totalMonthlyProduction: number,
) {
  if (!product.materialCost || !product.productionPerHour || !product.monthlyProduction) {
    return null
  }

  const totalFixedCosts = generalData.fixedCosts.reduce((sum, cost) => sum + cost.amount, 0)

  // Costo de mano de obra por unidad
  const laborCostPerUnit = generalData.laborCostPerHour / product.productionPerHour

  // Costo directo
  // Costo Total Directo (Materiales + Mano de Obra)
  const directCost = product.materialCost + laborCostPerUnit

  const fixedCostPerUnit = totalFixedCosts / totalMonthlyProduction

  const totalCostPerUnit = directCost + fixedCostPerUnit

  // Precio calculado por margen (si aplica)
  let calculatedSalePrice: number | undefined
  if (product.usePriceByMargin && product.contributionMargin) {
    calculatedSalePrice = totalCostPerUnit / (1 - product.contributionMargin / 100)
  }

  return {
    laborCostPerUnit,
    directCost,
    fixedCostPerUnit,
    totalCostPerUnit,
    calculatedSalePrice,
  }
}
