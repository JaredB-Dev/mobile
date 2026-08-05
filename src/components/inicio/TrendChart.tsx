import { useState, useMemo } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DailyFlow {
  fecha: string;
  ingresos: number;
  gastos: number;
}

interface TrendChartProps {
  data: DailyFlow[]; // se espera un array con hasta 30 días, ordenado de más antiguo a más reciente
}

type Rango = 7 | 15 | 30;

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [rango, setRango] = useState<Rango>(7);

  const filteredData = useMemo(() => {
    return data.slice(-rango);
  }, [data, rango]);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle style={{ fontSize: '1rem' }}>Tendencia</IonCardTitle>
      </IonCardHeader>

      <div style={{ padding: '0 16px' }}>
        <IonSegment
          value={String(rango)}
          onIonChange={(e) => setRango(Number(e.detail.value) as Rango)}
        >
          <IonSegmentButton value="7">
            <IonLabel>7 días</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="15">
            <IonLabel>15 días</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="30">
            <IonLabel>1 mes</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </div>

      <IonCardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--ion-color-success)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--ion-color-success)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--ion-color-danger)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--ion-color-danger)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis dataKey="fecha" tick={{ fontSize: 10 }} interval={Math.floor(rango / 5)} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
                formatter={(value) => {
                    if (typeof value === "number") {
                    return `$${value.toFixed(2)}`;
                    }

                    return value ?? "";
                }}
                labelStyle={{ color: "#333" }}
            />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="var(--ion-color-success)"
              strokeWidth={2}
              fill="url(#colorIngresos)"
              name="Ingresos"
            />
            <Area
              type="monotone"
              dataKey="gastos"
              stroke="var(--ion-color-danger)"
              strokeWidth={2}
              fill="url(#colorGastos)"
              name="Gastos"
            />
          </AreaChart>
        </ResponsiveContainer>
      </IonCardContent>
    </IonCard>
  );
};

export default TrendChart;