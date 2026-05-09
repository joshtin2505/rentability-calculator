import { ProductForm } from "@/components/product-form"
import { GeneralDataForm } from "@/components/general-data-form"
import { ResultsDashboard } from "@/components/results-dashboard"
import { ProfitabilityCharts } from "@/components/profitability-charts"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Botón flotante para el glosario */}
      <div className="absolute top-4 right-4 z-10">
        <Link href="/glosario">
          <Button variant="outline" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Ver Glosario
          </Button>
        </Link>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Calculadora de Rentabilidad</h1>
          <p className="text-xl text-muted-foreground">
            Analiza la rentabilidad de tus productos y optimiza tu negocio
          </p>
        </div>

        <div className="space-y-8">
          {/* Formularios de Entrada */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductForm />
            <GeneralDataForm />
          </div>

          {/* Dashboard de Resultados */}
          <ResultsDashboard />

          {/* Gráficos */}
          <ProfitabilityCharts />
        </div>
      </div>
    </div>
  )
}
