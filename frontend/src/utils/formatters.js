export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value ?? 0);
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const [year, month, day] = dateStr.substring(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export function formatNumber(value, decimals = 4) {
  return Number(value ?? 0).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function todayISO() {
  return new Date().toISOString().substring(0, 10);
}
