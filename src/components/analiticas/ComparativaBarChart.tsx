import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

interface ComparativaBarChartProps {
  comparativa: { mes: string; ingresos: number; gastos: number }[];
}

const ComparativaBarChart: React.FC<ComparativaBarChartProps> = ({ comparativa }) => {
  return (
    <IonCard>
      <IonCardHeader><IonCardTitle style={{ fontSize: '1rem' }}>Comparativa</IonCardTitle></IonCardHeader>
      <IonCardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={comparativa} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value) => (typeof value === 'number' ? `$${value.toFixed(2)}` : value ?? '')}
              labelStyle={{ color: '#333' }}
            />
            <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
            <Bar dataKey="ingresos" fill="var(--ion-color-success)" radius={[6, 6, 0, 0]} name="Ingresos" />
            <Bar dataKey="gastos" fill="var(--ion-color-danger)" radius={[6, 6, 0, 0]} name="Gastos" />
          </BarChart>
        </ResponsiveContainer>
      </IonCardContent>
    </IonCard>
  );
};

export default ComparativaBarChart;