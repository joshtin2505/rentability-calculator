"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import type { FixedCost } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

export function GeneralDataForm() {
  const { generalData, setGeneralData, addFixedCost, updateFixedCost, removeFixedCost } = useAppStore()
  const [newCostName, setNewCostName] = useState("")

  const handleLaborCostChange = (value: string) => {
    const numValue = Number.parseFloat(value) || 0
    setGeneralData({
      ...generalData,
      laborCostPerHour: numValue,
    })
  }

  const handleFixedCostChange = (id: string, field: keyof FixedCost, value: string) => {
    if (field === "amount") {
      const numValue = Number.parseFloat(value) || 0
      updateFixedCost(id, { [field]: numValue })
    } else {
      updateFixedCost(id, { [field]: value })
    }
  }

  const handleAddFixedCost = () => {
    if (newCostName.trim()) {
      const newCost: FixedCost = {
        id: Date.now().toString(),
        name: newCostName.trim(),
        amount: 0,
      }
      addFixedCost(newCost)
      setNewCostName("")
    }
  }

  const totalFixedCosts = generalData.fixedCosts.reduce((sum, cost) => sum + cost.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos Generales del Negocio</CardTitle>
        <CardDescription>Configura los costos generales de tu negocio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="laborCost">Costo Mano de Obra por Hora ($)</Label>
          <Input
            id="laborCost"
            type="number"
            step="0.01"
            value={generalData.laborCostPerHour}
            onChange={(e) => handleLaborCostChange(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Costos Fijos Mensuales</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Nombre del costo"
                value={newCostName}
                onChange={(e) => setNewCostName(e.target.value)}
                className="w-48"
              />
              <Button onClick={handleAddFixedCost} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {generalData.fixedCosts.map((cost) => (
              <div key={cost.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <Input
                    value={cost.name}
                    onChange={(e) => handleFixedCostChange(cost.id, "name", e.target.value)}
                    placeholder="Nombre del costo"
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    step="0.01"
                    value={cost.amount}
                    onChange={(e) => handleFixedCostChange(cost.id, "amount", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFixedCost(cost.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Total Costos Fijos Mensuales:</div>
            <div className="text-2xl font-bold text-blue-600">
              ${totalFixedCosts.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
