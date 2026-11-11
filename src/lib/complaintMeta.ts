import type { CancellationLevel, Urgency } from '@/types/complaint';

export const URGENCY_META: Record<Urgency, { label: string; badgeClass: string; dotClass: string }> = {
  baixo: {
    label: 'Baixo',
    badgeClass: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  medio: {
    label: 'Médio',
    badgeClass: 'bg-amber-50 text-amber-900 ring-amber-300',
    dotClass: 'bg-amber-500',
  },
  critico: {
    label: 'Crítico',
    badgeClass: 'bg-brand-700 text-white ring-brand-800',
    dotClass: 'bg-white',
  },
};

export const CANCELLATION_META: Record<CancellationLevel, { label: string; barClass: string; textClass: string }> = {
  baixo: { label: 'Risco baixo', barClass: 'bg-emerald-500', textClass: 'text-emerald-700' },
  medio: { label: 'Risco médio', barClass: 'bg-amber-500', textClass: 'text-amber-800' },
  alto: { label: 'Risco alto', barClass: 'bg-brand-600', textClass: 'text-brand-700' },
};

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
