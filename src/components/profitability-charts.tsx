"use client";

import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

export function ProfitabilityCharts() {
  const { calculationResult } = useAppStore();

  if (!calculationResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gráficos de Rentabilidad</CardTitle>
          <CardDescription>
            Los gráficos aparecerán después de calcular la rentabilidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Realiza el cálculo para ver los gráficos
          </div>
        </CardContent>
      </Card>
    );
  }

  interface BarChartProduct {
    name: string;
    utilidad: number;
    margen: number;
  }

  interface Product {
    name: string;
    monthlyProfit: number;
    profitMarginPercentage: number;
    materialCost: number;
    laborCostPerUnit: number;
    fixedCostPerUnit: number;
  }

  interface CalculationResult {
    products: Product[];
  }

  const barChartData: BarChartProduct[] = calculationResult.products.map(
    (product: Product) => ({
      name:
        product.name.length > 10
          ? product.name.substring(0, 10) + "..."
          : product.name,
      utilidad: product.monthlyProfit,
      margen: product.profitMarginPercentage,
    })
  );

  interface PieChartProduct {
    name: string;
    value: number;
    color: string;
  }

  const pieChartData: PieChartProduct[] = calculationResult.products.map(
    (product: Product, index: number): PieChartProduct => ({
      name: product.name,
      value: Math.max(0, product.monthlyProfit),
      color: `var(--chart-${(index % 6) + 1})`, // Usar colores dinámicos de shadcn/ui
    })
  );

  interface CostBreakdownData {
    name: string;
    materiales: number;
    manoObra: number;
    costosFijos: number;
  }

  const costBreakdownData: CostBreakdownData[] = calculationResult.products.map(
    (product: Product): CostBreakdownData => ({
      name:
        product.name.length > 10
          ? product.name.substring(0, 10) + "..."
          : product.name,
      materiales: product.materialCost,
      manoObra: product.laborCostPerUnit,
      costosFijos: product.fixedCostPerUnit,
    })
  );

  // Configuración de los gráficos
  const utilidadChartConfig = {
    utilidad: {
      label: "Utilidad",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const pieChartConfig = pieChartData.reduce(
    (acc, entry) => ({
      ...acc,
      [entry.name]: {
        label: entry.name,
        color: entry.color,
      },
    }),
    {} as ChartConfig // Asegura el tipo ChartConfig
  );

  const costBreakdownChartConfig = {
    materiales: {
      label: "Materiales",
      color: "hsl(var(--chart-1))",
    },
    manoObra: {
      label: "Mano de Obra",
      color: "hsl(var(--chart-2))",
    },
    costosFijos: {
      label: "Costos Fijos",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const margenChartConfig = {
    margen: {
      label: "Margen %",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras - Utilidad Mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Utilidad Mensual por Producto</CardTitle>
          <CardDescription>
            Comparación de utilidades mensuales estimadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={utilidadChartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart accessibilityLayer data={barChartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 10)} // Asegura que el nombre no sea demasiado largo
                />
                <YAxis
                  tickFormatter={(value) =>
                    `$${value.toLocaleString("es-CO", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}`
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel={false} />}
                />
                <Legend />
                <Bar
                  dataKey="utilidad"
                  fill="var(--color-chart-1)"
                  radius={8}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico Circular - Distribución de Utilidades */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Utilidades</CardTitle>
          <CardDescription>
            Participación de cada producto en la utilidad total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieChartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Barras Apiladas - Desglose de Costos */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose de Costos por Producto</CardTitle>
          <CardDescription>
            Composición de costos: materiales, mano de obra y costos fijos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={costBreakdownChartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costBreakdownData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) =>
                    `$${value.toLocaleString("es-CO", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  }
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar
                  dataKey="materiales"
                  stackId="a"
                  fill="var(--color-chart-2)"
                />
                <Bar
                  dataKey="manoObra"
                  stackId="a"
                  fill="var(--color-chart-3)"
                />
                <Bar
                  dataKey="costosFijos"
                  stackId="a"
                  fill="var(--color-chart-4)"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Líneas - Márgenes de Ganancia */}
      <Card>
        <CardHeader>
          <CardTitle>Márgenes de Ganancia</CardTitle>
          <CardDescription>Porcentaje de margen por producto</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={margenChartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={barChartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="margen"
                  stroke="var(--color-margen)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-margen)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
