import * as XLSX from "xlsx"
import type { CalculationResult } from "@/types"

export function exportToExcel(data: CalculationResult) {
  const workbook = XLSX.utils.book_new()

  // Hoja de productos detallados
  const productsData = data.products.map((product) => ({
    Producto: product.name,
    "Costo Materiales": product.materialCost,
    "Producción/Hora": product.productionPerHour,
    "Precio Venta": product.salePrice,
    "Producción Mensual": product.monthlyProduction,
    "Usa Precio por Margen": product.usePriceByMargin ? "Sí" : "No",
    "Margen Contribución %": product.contributionMargin || "N/A",
    "Precio Fijo": product.salePrice || "N/A",
    "Precio Final": product.finalSalePrice,
    "Costo Mano Obra/Unidad": product.laborCostPerUnit,
    "Costo Directo": product.directCost,
    "Costo Fijo/Unidad": product.fixedCostPerUnit,
    "Costo Total/Unidad": product.totalCostPerUnit,
    "Utilidad/Unidad": product.grossProfitPerUnit,
    "Margen %": product.profitMarginPercentage,
    "Utilidad Mensual": product.monthlyProfit,
  }))

  const productsSheet = XLSX.utils.json_to_sheet(productsData)
  XLSX.utils.book_append_sheet(workbook, productsSheet, "Productos")

  // Hoja de resumen
  const summaryData = [
    { Concepto: "Ingresos Mensuales Totales", Valor: data.totalMonthlyRevenue },
    { Concepto: "Costos Mensuales Totales", Valor: data.totalMonthlyCosts },
    { Concepto: "Costos Fijos Totales", Valor: data.totalFixedCosts },
    { Concepto: "Utilidad Mensual Total", Valor: data.totalMonthlyProfit },
    { Concepto: "Margen Promedio (%)", Valor: data.averageProfitMargin },
  ]

  const summarySheet = XLSX.utils.json_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen")

  // Descargar archivo
  XLSX.writeFile(workbook, `analisis-rentabilidad-${new Date().toISOString().split("T")[0]}.xlsx`)
}
