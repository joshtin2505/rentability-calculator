"use client"

import { useAppStore } from "@/lib/store"
import { exportToExcel } from "@/lib/export"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Calculator } from "lucide-react"

export function ResultsDashboard() {
  const { products, generalData, calculationResult, setCalculationResult } = useAppStore()

  const handleCalculate = async () => {
    if (products.length === 0) {
      alert("Agrega al menos un producto para calcular")
      return
    }

    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products, generalData }),
      })

      if (!response.ok) {
        throw new Error("Error en el cálculo")
      }

      const result = await response.json()
      setCalculationResult(result)
    } catch (error) {
      console.error("Error:", error)
      alert("Error al calcular. Intenta nuevamente.")
    }
  }

  const handleExport = () => {
    if (calculationResult) {
      exportToExcel(calculationResult)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getProfitabilityColor = (margin: number) => {
    if (margin >= 30) return "bg-green-500"
    if (margin >= 15) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Rentabilidad</CardTitle>
          <CardDescription>Calcula y analiza la rentabilidad de tus productos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={handleCalculate} className="flex-1 md:flex-none">
              <Calculator className="w-4 h-4 mr-2" />
              Calcular Rentabilidad
            </Button>

            {calculationResult && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Excel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {calculationResult && (
        <>
          {/* Resumen General */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculationResult.totalMonthlyRevenue)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Costos Mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(calculationResult.totalMonthlyCosts)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Utilidad Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${calculationResult.totalMonthlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(calculationResult.totalMonthlyProfit)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Margen Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${calculationResult.averageProfitMargin >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatPercentage(calculationResult.averageProfitMargin)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabla Detallada */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado por Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Costo M.O./Unidad</TableHead>
                      <TableHead className="text-right">Costo Directo</TableHead>
                      <TableHead className="text-right">Costo Fijo/Unidad</TableHead>
                      <TableHead className="text-right">Costo Total/Unidad</TableHead>
                      <TableHead className="text-right">Precio Venta</TableHead>
                      <TableHead className="text-right">Utilidad/Unidad</TableHead>
                      <TableHead className="text-right">Margen %</TableHead>
                      <TableHead className="text-right">Utilidad Mensual</TableHead>
                      <TableHead>Rentabilidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calculationResult.products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div>
                            {product.name}
                            {product.usePriceByMargin && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Margen {product.contributionMargin}%
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(product.laborCostPerUnit)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.directCost)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.fixedCostPerUnit)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(product.totalCostPerUnit)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            {formatCurrency(product.finalSalePrice)}
                            {product.calculatedSalePrice && (
                              <div className="text-xs text-muted-foreground">Calculado</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell
                          className={`text-right ${product.grossProfitPerUnit >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatCurrency(product.grossProfitPerUnit)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${product.profitMarginPercentage >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatPercentage(product.profitMarginPercentage)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${product.monthlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatCurrency(product.monthlyProfit)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getProfitabilityColor(product.profitMarginPercentage)} text-white`}>
                            {product.profitMarginPercentage >= 30
                              ? "Excelente"
                              : product.profitMarginPercentage >= 15
                                ? "Buena"
                                : "Baja"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
