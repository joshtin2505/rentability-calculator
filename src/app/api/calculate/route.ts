import { type NextRequest, NextResponse } from "next/server"
import { calculateProductProfitability } from "@/lib/calculations"
import type { Product, GeneralData } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const { products, generalData }: { products: Product[]; generalData: GeneralData } = await request.json()

    if (!products || !generalData) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const result = calculateProductProfitability(products, generalData)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error en cálculos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
