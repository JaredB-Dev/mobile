export const formatDia = (isoString: string): string =>
  new Date(isoString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

export const formatMes = (isoString: string): string =>
  new Date(isoString).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });