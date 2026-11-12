import { FileText, Loader2, Sparkles } from 'lucide-react';

const EXAMPLE_COMPLAINT =
  'Pedi um hambúrguer e uma porção de batata há mais de 1 hora e o pedido ainda não chegou. O app não atualiza nada, ninguém responde no chat. Isso é um absurdo, já é a segunda vez esse mês. Estou pensando seriamente em cancelar meu cadastro e usar outro app!';

interface ComplaintFormProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  error: string | null;
}

const MAX_LENGTH = 5000;

export default function ComplaintForm({ value, onChange, onAnalyze, isAnalyzing, error }: ComplaintFormProps) {
  const canAnalyze = value.trim().length > 0 && !isAnalyzing;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg shadow-neutral-900/5 ring-1 ring-neutral-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold leading-tight text-neutral-900">Nova reclamação</h2>
          <p className="mt-1 text-sm leading-normal text-neutral-500">Cole o texto enviado pelo cliente.</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(EXAMPLE_COMPLAINT)}
          disabled={isAnalyzing}
          className="shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-50"
        >
          Usar exemplo
        </button>
      </div>

      <label htmlFor="complaint-input" className="sr-only">
        Texto da reclamação
      </label>
      <textarea
        id="complaint-input"
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, MAX_LENGTH))}
        disabled={isAnalyzing}
        rows={10}
        placeholder="Ex.: Meu pedido atrasou mais de uma hora e o entregador não respondeu..."
        className="mt-5 w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-base leading-normal text-neutral-900 placeholder:text-neutral-400 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:opacity-60"
      />

      <div className="mt-2 flex items-center justify-between text-sm text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          <FileText className="h-4 w-4" aria-hidden="true" />
          {value.length} / {MAX_LENGTH}
        </span>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onAnalyze}
        disabled={!canAnalyze}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-4 text-base font-extrabold text-white shadow-md shadow-brand-600/30 transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-600 disabled:shadow-none"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Analisando...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            Analisar com IA
          </>
        )}
      </button>
    </section>
  );
}
