import { useEffect, useState, type ReactNode } from 'react';
import { AlertTriangle, Check, Copy, MessageSquareText, Tag, UserMinus, type LucideIcon } from 'lucide-react';
import { CANCELLATION_META, URGENCY_META } from '@/lib/complaintMeta';
import type { ComplaintAnalysis } from '@/types/complaint';

interface AnalysisResultsProps {
  analysis: ComplaintAnalysis;
  complaintText: string;
}

function ResultCard({
  icon: Icon,
  title,
  delay,
  children,
  className = '',
}: {
  icon: LucideIcon;
  title: string;
  delay: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`animate-fade-up rounded-3xl bg-white p-6 shadow-md shadow-neutral-900/5 ring-1 ring-neutral-200 transition-shadow hover:shadow-lg ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <h3 className="text-sm font-semibold leading-normal text-neutral-500">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function ReplyCard({ reply, delay }: { reply: string; delay: number }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <ResultCard icon={MessageSquareText} title="Sugestão de resposta" delay={delay} className="md:col-span-2">
      <p className="text-base leading-[1.5] text-neutral-800">{reply}</p>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? 'Copiado' : 'Copiar resposta'}
        </button>
      </div>
    </ResultCard>
  );
}

export default function AnalysisResults({ analysis, complaintText }: AnalysisResultsProps) {
  const urgency = URGENCY_META[analysis.urgency];
  const cancellation = CANCELLATION_META[analysis.cancellation_level];

  return (
    <div className="space-y-4">
      <div className="animate-fade-up rounded-3xl bg-neutral-900 p-6 text-white" style={{ animationDelay: '0ms' }}>
        <p className="text-sm font-semibold leading-normal text-neutral-300">Reclamação analisada</p>
        <p className="mt-2 line-clamp-4 text-base leading-[1.5]">{complaintText}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ResultCard icon={Tag} title="Categoria" delay={80}>
          <p className="text-xl font-extrabold leading-tight text-neutral-900">{analysis.category}</p>
        </ResultCard>

        <ResultCard icon={AlertTriangle} title="Nível de urgência" delay={160}>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-extrabold ring-1 ring-inset ${urgency.badgeClass}`}
          >
            <span className={`h-2 w-2 rounded-full ${urgency.dotClass} ${analysis.urgency === 'critico' ? 'animate-pulse' : ''}`} />
            {urgency.label}
          </span>
        </ResultCard>

        <ResultCard icon={UserMinus} title="Risco de cancelamento" delay={240} className="md:col-span-2">
          <div className="flex items-end justify-between gap-4">
            <p className="text-4xl font-extrabold leading-none text-neutral-900">
              {analysis.cancellation_risk}
              <span className="text-xl text-neutral-500">%</span>
            </p>
            <p className={`text-sm font-bold ${cancellation.textClass}`}>{cancellation.label}</p>
          </div>
          <div
            className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-neutral-200"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={analysis.cancellation_risk}
            aria-label="Risco de cancelamento"
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${cancellation.barClass}`}
              style={{ width: `${analysis.cancellation_risk}%` }}
            />
          </div>
        </ResultCard>

        <ReplyCard reply={analysis.suggested_reply} delay={320} />
      </div>
    </div>
  );
}
