import { useCallback, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import TriageHeader from '@/components/triage/TriageHeader';
import ComplaintForm from '@/components/triage/ComplaintForm';
import AnalysisResults from '@/components/triage/AnalysisResults';
import HistoryList from '@/components/triage/HistoryList';
import { analyzeComplaint, fetchRecentComplaints, saveComplaint } from '@/lib/complaints';
import type { ComplaintAnalysis, ComplaintRecord } from '@/types/complaint';

interface TriageResult {
  complaintText: string;
  analysis: ComplaintAnalysis;
  id: string | null;
}

export default function TriagePage() {
  const [complaint, setComplaint] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [result, setResult] = useState<TriageResult | null>(null);

  const [history, setHistory] = useState<ComplaintRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      setHistory(await fetchRecentComplaints());
    } catch {
      setHistoryError('Não foi possível carregar o histórico. Tente novamente.');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const handleAnalyze = async () => {
    const text = complaint.trim();
    if (!text || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalyzeError(null);
    setSaveNotice(null);

    try {
      const analysis = await analyzeComplaint(text);
      setResult({ complaintText: text, analysis, id: null });

      try {
        const saved = await saveComplaint(text, analysis);
        setResult({ complaintText: saved.complaint_text, analysis: saved, id: saved.id });
        setHistory((previous) => [saved, ...previous].slice(0, 20));
      } catch {
        setSaveNotice('A análise está pronta, mas não foi possível salvar no histórico.');
      }
    } catch {
      setAnalyzeError('Não foi possível analisar a reclamação agora. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectRecord = (record: ComplaintRecord) => {
    setResult({ complaintText: record.complaint_text, analysis: record, id: record.id });
    setSaveNotice(null);
  };

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900">
      <TriageHeader />

      <section className="relative overflow-hidden bg-brand-600 pb-28 pt-12 text-white sm:pt-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-brand-700/40" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white ring-1 ring-inset ring-white/30">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Análise automática de reclamações
          </p>
          <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-[1.2] sm:text-5xl">
            Triagem inteligente de reclamações
          </h1>
          <p className="mt-4 max-w-xl text-base leading-[1.5] text-white sm:text-lg">
            Cole a mensagem do cliente e veja a categoria, a urgência, o risco de cancelamento e uma resposta sugerida.
          </p>
        </div>
      </section>

      <main className="relative mx-auto grid max-w-6xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-12">
        <div className="-mt-20 space-y-6 lg:col-span-5">
          <ComplaintForm
            value={complaint}
            onChange={setComplaint}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            error={analyzeError}
          />
          <HistoryList
            records={history}
            isLoading={historyLoading}
            error={historyError}
            selectedId={result?.id ?? null}
            onSelect={handleSelectRecord}
            onRetry={loadHistory}
          />
        </div>

        <div className="-mt-20 space-y-4 lg:col-span-7">
          {saveNotice && (
            <p role="status" className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 ring-1 ring-inset ring-amber-300">
              {saveNotice}
            </p>
          )}
          {result ? (
            <AnalysisResults analysis={result.analysis} complaintText={result.complaintText} />
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white/70 p-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Sparkles className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-lg font-extrabold leading-tight text-neutral-900">Os resultados aparecem aqui</h2>
              <p className="mt-2 max-w-sm text-sm leading-[1.5] text-neutral-500">
                Cole uma reclamação ao lado e clique em Analisar com IA para ver a triagem completa.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
