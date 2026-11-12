import { useCallback, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import TriageHeader from '@/components/triage/TriageHeader';
import ComplaintForm from '@/components/triage/ComplaintForm';
import AnalysisResults from '@/components/triage/AnalysisResults';
import HistoryList from '@/components/triage/HistoryList';
<<<<<<< HEAD
import { fetchRecentComplaints } from '@/lib/complaints';
=======
import { analyzeComplaint, fetchRecentComplaints, saveComplaint } from '@/lib/complaints';
>>>>>>> 6f90103e49f00525e4d2bc54e66063b5a651a27c
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
<<<<<<< HEAD
    if (!complaint.trim()) return;
=======
    const text = complaint.trim();
    if (!text || isAnalyzing) return;
>>>>>>> 6f90103e49f00525e4d2bc54e66063b5a651a27c

    setIsAnalyzing(true);
    setAnalyzeError(null);
    setSaveNotice(null);

    try {
<<<<<<< HEAD
      // Simula a latência de chamada de API de IA (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const lowerText = complaint.toLowerCase();
      let category = 'Problema Geral no Pedido';
      let urgency: ComplaintAnalysis['urgency'] = 'Média';
      let churnRisk: ComplaintAnalysis['churn_risk'] = 'Médio';
      let suggestedResponse =
        'Olá! Sentimos muito pelo inconveniente com o seu pedido. Nossa equipe já está analisando o ocorrido com a loja parceira para tomar as devidas providências.';
      let actionRecommended = 'Notificar suporte operacional e acompanhar o caso';

      if (lowerText.includes('atraso') || lowerText.includes('demorou') || lowerText.includes('demora')) {
        category = 'Atraso na Entrega';
        urgency = 'Alta';
        churnRisk = 'Alto';
        suggestedResponse =
          'Olá! Pedimos desculpas pelo atraso. Já identificamos o problema na rota de entrega e emitimos um cupom de desconto em sua conta pelo inconveniente.';
        actionRecommended = 'Priorizar rota com o entregador e disparar voucher de retratação';
      } else if (lowerText.includes('fria') || lowerText.includes('qualidade') || lowerText.includes('estragad')) {
        category = 'Qualidade do Alimento';
        urgency = 'Crítica';
        churnRisk = 'Alto';
        suggestedResponse =
          'Lamentamos muito pela má experiência com a qualidade da refeição. Realizamos o estorno total do valor e já sinalizamos a cozinha do restaurante.';
        actionRecommended = 'Emitir reembolso imediato e abrir chamado com a vigilância de qualidade do parceiro';
      } else if (lowerText.includes('faltou') || lowerText.includes('faltando') || lowerText.includes('item')) {
        category = 'Item Faltante';
        urgency = 'Média';
        churnRisk = 'Médio';
        suggestedResponse =
          'Sentimos muito que seu pedido não veio completo. O valor proporcional do item faltante já foi reembolsado no seu meio de pagamento de origem.';
        actionRecommended = 'Processar estorno parcial do item faltante';
      }

      const mockAnalysis: ComplaintAnalysis = {
        category,
        urgency,
        churn_risk: churnRisk,
        suggested_response: suggestedResponse,
        action_recommended: actionRecommended,
      };

      setResult({
        complaintText: complaint,
        analysis: mockAnalysis,
        id: null,
      });
    } catch (error) {
      console.error('Erro na análise:', error);
      setAnalyzeError('Falha ao processar análise.');
=======
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
>>>>>>> 6f90103e49f00525e4d2bc54e66063b5a651a27c
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
<<<<<<< HEAD
            Classifique automaticamente o nível de urgência, risco de churn e gere respostas empáticas em segundos com IA.
=======
            Cole a mensagem do cliente e veja a categoria, a urgência, o risco de cancelamento e uma resposta sugerida.
>>>>>>> 6f90103e49f00525e4d2bc54e66063b5a651a27c
          </p>
        </div>
      </section>

<<<<<<< HEAD
      <main className="relative mx-auto -mt-16 max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <ComplaintForm
              complaint={complaint}
              onChange={setComplaint}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              error={analyzeError}
            />

            {result && (
              <AnalysisResults
                complaintText={result.complaintText}
                analysis={result.analysis}
                recordId={result.id}
                saveNotice={saveNotice}
                onSaved={() => {
                  setSaveNotice('Análise salva no histórico com sucesso!');
                  void loadHistory();
                }}
              />
            )}
          </div>

          <div className="lg:col-span-5">
            <HistoryList
              records={history}
              loading={historyLoading}
              error={historyError}
              selectedId={result?.id ?? null}
              onSelect={handleSelectRecord}
              onRetry={loadHistory}
            />
          </div>
=======
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
>>>>>>> 6f90103e49f00525e4d2bc54e66063b5a651a27c
        </div>
      </main>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 6f90103e49f00525e4d2bc54e66063b5a651a27c
