"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { calculateProductCosts } from "@/lib/calculations"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Calculator } from "lucide-react"

export function ProductForm() {
  const { products, generalData, addProduct, removeProduct } = useAppStore()
  const [formData, setFormData] = useState({
    name: "",
    materialCost: "",
    productionPerHour: "",
    salePrice: "",
    monthlyProduction: "",
    contributionMargin: "",
    usePriceByMargin: false,
  })

  const [calculatedCosts, setCalculatedCosts] = useState<any>(null)

  const totalMonthlyProduction = products.reduce((sum, product) => sum + product.monthlyProduction, 0)

  // Calcular costos en tiempo real
  useEffect(() => {
    const costs = calculateProductCosts(
      {
        materialCost: Number.parseFloat(formData.materialCost) || 0,
        productionPerHour: Number.parseFloat(formData.productionPerHour) || 0,
        monthlyProduction: Number.parseFloat(formData.monthlyProduction) || 0,
        contributionMargin: Number.parseFloat(formData.contributionMargin) || 0,
        usePriceByMargin: formData.usePriceByMargin,
      },
      generalData,
      totalMonthlyProduction + (Number.parseFloat(formData.monthlyProduction) || 0),
    )
    setCalculatedCosts(costs)
  }, [formData, generalData, totalMonthlyProduction])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.materialCost ||
      !formData.productionPerHour ||
      !formData.monthlyProduction ||
      (!formData.usePriceByMargin && !formData.salePrice) ||
      (formData.usePriceByMargin && !formData.contributionMargin)
    ) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      materialCost: Number.parseFloat(formData.materialCost),
      productionPerHour: Number.parseFloat(formData.productionPerHour),
      salePrice: formData.usePriceByMargin ? undefined : Number.parseFloat(formData.salePrice),
      monthlyProduction: Number.parseFloat(formData.monthlyProduction),
      contributionMargin: formData.usePriceByMargin ? Number.parseFloat(formData.contributionMargin) : undefined,
      usePriceByMargin: formData.usePriceByMargin,
    }

    addProduct(newProduct)
    setFormData({
      name: "",
      materialCost: "",
      productionPerHour: "",
      salePrice: "",
      monthlyProduction: "",
      contributionMargin: "",
      usePriceByMargin: false,
    })
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Productos</CardTitle>
        <CardDescription>Agrega los productos que deseas analizar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica del producto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Camiseta básica"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="materialCost">Costo Materiales ($) *</Label>
              <Input
                id="materialCost"
                type="number"
                step="0.01"
                value={formData.materialCost}
                onChange={(e) => handleInputChange("materialCost", e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productionPerHour">Producción por Hora *</Label>
              <Input
                id="productionPerHour"
                type="number"
                step="0.1"
                value={formData.productionPerHour}
                onChange={(e) => handleInputChange("productionPerHour", e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyProduction">Producción Mensual *</Label>
              <Input
                id="monthlyProduction"
                type="number"
                value={formData.monthlyProduction}
                onChange={(e) => handleInputChange("monthlyProduction", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Cálculos automáticos */}
          {calculatedCosts && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Cálculos Automáticos</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-blue-600 font-medium">Mano de Obra/Unidad</div>
                  <div className="font-semibold">{formatCurrency(calculatedCosts.laborCostPerUnit)}</div>
                </div>
                <div>
                  <div className="text-blue-600 font-medium">Costo Directo</div>
                  <div className="font-semibold">{formatCurrency(calculatedCosts.directCost)}</div>
                </div>
                <div>
                  <div className="text-blue-600 font-medium">Costo Fijo/Unidad</div>
                  <div className="font-semibold">{formatCurrency(calculatedCosts.fixedCostPerUnit)}</div>
                </div>
                <div>
                  <div className="text-blue-600 font-medium">Costo Total/Unidad</div>
                  <div className="font-semibold text-lg">{formatCurrency(calculatedCosts.totalCostPerUnit)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Configuración de precio */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch
                id="priceMode"
                checked={formData.usePriceByMargin}
                onCheckedChange={(checked) => handleInputChange("usePriceByMargin", checked)}
              />
              <Label htmlFor="priceMode">Calcular precio por margen de contribución</Label>
            </div>

            {formData.usePriceByMargin ? (
              <div className="space-y-2">
                <Label htmlFor="contributionMargin">Margen de Contribución Deseado (%) *</Label>
                <Input
                  id="contributionMargin"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.contributionMargin}
                  onChange={(e) => handleInputChange("contributionMargin", e.target.value)}
                  placeholder="25.0"
                />
                {calculatedCosts?.calculatedSalePrice && (
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <div className="text-green-700 text-sm">Precio calculado:</div>
                    <div className="text-green-800 font-bold text-lg">
                      {formatCurrency(calculatedCosts.calculatedSalePrice)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="salePrice">Precio de Venta Fijo ($) *</Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => handleInputChange("salePrice", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </Button>
        </form>

        {products.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Productos Registrados ({products.length})</h3>
            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.name}</span>
                      {product.usePriceByMargin && (
                        <Badge variant="secondary">Margen {product.contributionMargin}%</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.usePriceByMargin ? "Precio automático" : `$${product.salePrice}`} |{" "}
                      {product.monthlyProduction}/mes
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProduct(product.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
