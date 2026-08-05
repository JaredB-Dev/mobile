import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getCategoriaColor } from '../../data/categorias';

interface DistribucionPieChartProps {
  distribucion: { categoria: string; monto: number }[];
}

const DistribucionPieChart: React.FC<DistribucionPieChartProps> = ({ distribucion }) => {
  const totalGastos = distribucion.reduce((sum, d) => sum + d.monto, 0);

  return (
    <IonCard>
      <IonCardHeader><IonCardTitle style={{ fontSize: '1rem' }}>Distribución de gastos</IonCardTitle></IonCardHeader>
      <IonCardContent>
        {distribucion.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--ion-color-medium)' }}>Sin gastos en este período.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={distribucion} dataKey="monto" nameKey="categoria" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {distribucion.map((d) => <Cell key={d.categoria} fill={getCategoriaColor(d.categoria)} />)}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  if (typeof value === 'number' && typeof name === 'string') {
                    return [`$${value.toFixed(2)} (${((value / totalGastos) * 100).toFixed(0)}%)`, name];
                  }
                  return [String(value ?? ''), String(name ?? '')];
                }}
                labelStyle={{ color: '#333' }}
              />
              <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '0.75rem' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default DistribucionPieChart;