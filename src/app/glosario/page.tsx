import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"

const glossaryTerms = [
  {
    term: "Costo Materiales",
    definition: "Costo directo de los insumos físicos necesarios para fabricar una sola unidad del producto. No incluye costos indirectos como empaques generales si estos se consideran fijos.",
    example: "Si haces camisetas, el costo de tela, hilos y botones por cada camiseta."
  },
  {
    term: "Producción por Hora / Mensual",
    definition: "Cantidad de unidades que se pueden fabricar en una hora de trabajo por una sola persona (o unidad de mano de obra), y la cantidad total proyectada al mes.",
    example: "Si puedes hacer 5 camisetas en una hora, tu producción por hora es 5."
  },
  {
    term: "Margen de Contribución (%)",
    definition: "Porcentaje del precio de venta que sirve para cubrir los costos fijos y generar ganancia (utilidad neta), una vez pagados los costos directos.",
    example: "Un margen de 30% en una camiseta de $10.000 significa que $3.000 quedan para pagar costos fijos y rentabilidad."
  },
  {
    term: "Precio de Venta",
    definition: "El precio final al que venderás el producto al cliente. Se puede fijar manualmente o calcularse en base a un Margen de Contribución deseado.",
    example: "El precio final de lista al público."
  },
  {
    term: "Costos Fijos Mensuales",
    definition: "Gastos operativos que debes pagar cada mes sí o sí, sin importar si tu producción o ventas son altas o bajas.",
    example: "El alquiler del local, servicios públicos mensuales (agua, luz, internet), sueldos administrativos."
  },
  {
    term: "Costo Directo",
    definition: "La suma de los Costos de Materiales por unidad más el Costo de Mano de Obra necesario para fabricar esa unidad.",
    example: "Total que sale tu producto antes de aplicarle porcentaje de costos fijos y ganancia."
  },
  {
    term: "Mano de Obra por Hora",
    definition: "Lo que cuesta una hora de trabajo de la persona que fabrica directamente los productos.",
    example: "Si se le paga $50.000 por 8 horas, la mano de obra por hora es aproximadamente $6.250."
  },
  {
    term: "Punto de Equilibrio (Break-even)",
    definition: "El nivel de ventas o producción en el que los ingresos totales son iguales a los costos totales (fijos y variables). No hay pérdida ni ganancia.",
    example: "Si tu punto de equilibrio son 100 camisetas, necesitas vender 100 este mes para no perder dinero."
  },
  {
    term: "Rentabilidad",
    definition: "El porcentaje de beneficio neto final que queda de cada producto después de deducir todos los costos (directos y la parte proporcional de los fijos).",
    example: "Una rentabilidad >30% es considerada Excelente, mientras que una <15% es Baja."
  }
]

export default function GlosarioPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la Calculadora
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Glosario Financiero</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Entiende los conceptos clave para calcular la rentabilidad de tu negocio con precisión.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {glossaryTerms.map((item, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{item.term}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Definición</h4>
                  <p className="text-sm">{item.definition}</p>
                </div>
                {item.example && (
                  <div className="mt-auto pt-4 border-t">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Ejemplo</h4>
                    <p className="text-sm italic text-muted-foreground">{item.example}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
