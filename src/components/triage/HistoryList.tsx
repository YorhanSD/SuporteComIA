import { ArrowRight, History, Loader2 } from 'lucide-react';
import { URGENCY_META, formatDateTime } from '@/lib/complaintMeta';
import type { ComplaintRecord } from '@/types/complaint';

interface HistoryListProps {
  records: ComplaintRecord[];
  isLoading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (record: ComplaintRecord) => void;
  onRetry: () => void;
}

export default function HistoryList({ records, isLoading, error, selectedId, onSelect, onRetry }: HistoryListProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg shadow-neutral-900/5 ring-1 ring-neutral-200">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <History className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-extrabold leading-tight text-neutral-900">Histórico recente</h2>
          <p className="text-sm leading-normal text-neutral-500">Clique em uma reclamação para reabrir a análise.</p>
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-neutral-600">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Carregando histórico...
        </div>
      )}

      {!isLoading && error && (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl bg-brand-50 p-4">
          <p className="text-sm font-semibold text-brand-800">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !error && records.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-sm leading-normal text-neutral-500">
          Nenhuma reclamação analisada ainda.
        </p>
      )}

      {!isLoading && !error && records.length > 0 && (
        <ul className="mt-6 divide-y divide-neutral-100">
          {records.map((record) => {
            const urgency = URGENCY_META[record.urgency];
            const isSelected = record.id === selectedId;
            return (
              <li key={record.id}>
                <button
                  type="button"
                  onClick={() => onSelect(record)}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`group flex w-full items-center gap-4 rounded-xl px-3 py-4 text-left transition-colors hover:bg-neutral-50 ${
                    isSelected ? 'bg-brand-50 hover:bg-brand-50' : ''
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold text-neutral-900">{record.category}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${urgency.badgeClass}`}
                      >
                        {urgency.label}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm leading-normal text-neutral-600">{record.complaint_text}</p>
                    <p className="mt-1 text-xs leading-normal text-neutral-500">{formatDateTime(record.created_at)}</p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600"
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
