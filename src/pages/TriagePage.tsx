import { useCallback, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import TriageHeader from '@/components/triage/TriageHeader';
import ComplaintForm from '@/components/triage/ComplaintForm';
import AnalysisResults from '@/components/triage/AnalysisResults';
import HistoryList from '@/components/triage/HistoryList';
import { fetchRecentComplaints } from '@/lib/complaints';
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
    if (!complaint.trim()) return;

    setIsAnalyzing(true);
    setAnalyzeError(null);

    try {
      // Simula a latência de chamada de API de IA (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const lowerText = complaint.toLowerCase();
      let category = 'Problema Geral no Pedido';
      let urgency: ComplaintAnalysis['urgency'] = 'medio';
      let cancellationRisk = 45;
      let cancellationLevel: ComplaintAnalysis['cancellation_level'] = 'medio';
      let suggestedReply =
        'Olá! Sentimos muito pelo inconveniente com o seu pedido. Nossa equipe já está analisando o ocorrido com a loja parceira para tomar as devidas providências.';

      if (lowerText.includes('atraso') || lowerText.includes('demorou') || lowerText.includes('demora') || lowerText.includes('1 hora')) {
        category = 'Atraso na Entrega';
        urgency = 'critico';
        cancellationRisk = 85;
        cancellationLevel = 'alto';
        suggestedReply =
          'Olá! Pedimos desculpas pelo atraso. Já identificamos o problema na rota de entrega e emitimos um cupom de desconto em sua conta pelo inconveniente.';
      } else if (lowerText.includes('fria') || lowerText.includes('qualidade') || lowerText.includes('estragad')) {
        category = 'Qualidade do Alimento';
        urgency = 'critico';
        cancellationRisk = 92;
        cancellationLevel = 'alto';
        suggestedReply =
          'Lamentamos muito pela má experiência com a qualidade da refeição. Realizamos o estorno total do valor e já sinalizamos a cozinha do restaurante.';
      } else if (lowerText.includes('faltou') || lowerText.includes('faltando') || lowerText.includes('item')) {
        category = 'Item Faltante';
        urgency = 'medio';
        cancellationRisk = 50;
        cancellationLevel = 'medio';
        suggestedReply =
          'Sentimos muito que seu pedido não veio completo. O valor proporcional do item faltante já foi reembolsado no seu meio de pagamento de origem.';
      }

      const mockAnalysis: ComplaintAnalysis = {
        category,
        urgency,
        cancellation_risk: cancellationRisk,
        cancellation_level: cancellationLevel,
        suggested_reply: suggestedReply,
      };

      setResult({
        complaintText: complaint,
        analysis: mockAnalysis,
        id: null,
      });
    } catch (error) {
      console.error('Erro na análise:', error);
      setAnalyzeError('Falha ao processar análise.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectRecord = (record: ComplaintRecord) => {
    setResult({ complaintText: record.complaint_text, analysis: record, id: record.id });
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
            Classifique automaticamente o nível de urgência, risco de cancelamento e gere respostas empáticas em segundos com IA.
          </p>
        </div>
      </section>

      <main className="relative mx-auto -mt-16 max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <ComplaintForm
              value={complaint}
              onChange={setComplaint}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              error={analyzeError}
            />

            {result && (
              <AnalysisResults
                complaintText={result.complaintText}
                analysis={result.analysis}
              />
            )}
          </div>

          <div className="lg:col-span-5">
            <HistoryList
              records={history}
              isLoading={historyLoading}
              error={historyError}
              selectedId={result?.id ?? null}
              onSelect={handleSelectRecord}
              onRetry={loadHistory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}