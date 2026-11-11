const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

type Urgency = "baixo" | "medio" | "critico";
type CancellationLevel = "baixo" | "medio" | "alto";

const CATEGORY_RULES: { category: string; keywords: string[] }[] = [
  { category: "Pedido atrasado", keywords: ["atras", "demor", "nao chegou", "nunca chegou", "horas", "esper", "previsao", "tempo de entrega"] },
  { category: "Pedido incompleto", keywords: ["faltou", "faltando", "faltam", "incomplet", "veio sem", "sem o", "sem a", "esqueceram", "nao veio"] },
  { category: "Pedido errado", keywords: ["errado", "trocado", "diferente do pedido", "nao era o que pedi", "pedi outro", "veio outro"] },
  { category: "Qualidade do produto", keywords: ["frio", "estragad", "azedo", "mofo", "qualidade", "ruim", "queimad", "cru", "sem gosto", "vencid"] },
  { category: "Cobranca e reembolso", keywords: ["cobr", "reembols", "estorno", "dinheiro", "cartao", "pix", "valor", "taxa", "cupom"] },
  { category: "Entregador", keywords: ["entregador", "motoboy", "motorista", "entrega mal", "grosso", "educad"] },
  { category: "Seguranca e saude", keywords: ["intoxic", "passei mal", "vomit", "diarre", "golpe", "fraude", "roubo", "roubaram", "seguranca", "corpo estranho", "barata", "inseto", "cabelo"] },
];

const CRITICAL_TERMS = [
  "intoxic", "passei mal", "vomit", "hospital", "golpe", "fraude", "roubaram", "procon", "processo",
  "advogado", "corpo estranho", "barata", "inseto", "cabelo", "reclame aqui", "justica",
];

const CANCELLATION_TERMS = [
  "cancelar", "cancelei", "nunca mais", "nao vou pedir", "nao peco mais", "deletar o app", "apagar o app",
  "desinstal", "trocar de app", "outro app", "concorrente", "99food", "rappi", "ultima vez", "desisti",
];

const ANGER_TERMS = [
  "absurdo", "vergonha", "pessimo", "horrivel", "inaceitavel", "revoltad", "indignad", "raiva", "nunca",
  "descaso", "palhacada", "terrivel", "decepcion", "ridiculo", "!!",
];

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const countMatches = (text: string, terms: string[]) =>
  terms.reduce((total, term) => (text.includes(term) ? total + 1 : total), 0);

const detectCategory = (text: string) => {
  let best = { category: "Outros", hits: 0 };
  for (const rule of CATEGORY_RULES) {
    const hits = countMatches(text, rule.keywords);
    if (hits > best.hits) best = { category: rule.category, hits };
  }
  return best.category;
};

const scoreCancellationRisk = (text: string) => {
  const cancellation = countMatches(text, CANCELLATION_TERMS);
  const anger = countMatches(text, ANGER_TERMS);
  const critical = countMatches(text, CRITICAL_TERMS);
  const exclamations = Math.min((text.match(/!/g) || []).length, 4);
  const raw = cancellation * 30 + anger * 10 + critical * 15 + exclamations * 3;
  return Math.max(5, Math.min(100, raw));
};

const levelFromRisk = (risk: number): CancellationLevel => {
  if (risk >= 60) return "alto";
  if (risk >= 30) return "medio";
  return "baixo";
};

const detectUrgency = (text: string, risk: number): Urgency => {
  if (countMatches(text, CRITICAL_TERMS) > 0) return "critico";
  if (risk >= 60 || countMatches(text, ANGER_TERMS) > 0) return "medio";
  return "baixo";
};

const REPLIES: Record<string, string> = {
  "Pedido atrasado":
    "Olá! Lamentamos muito pelo atraso no seu pedido. Já estamos verificando com o restaurante e o entregador o que aconteceu e vamos te atualizar em instantes. Como forma de desculpas, liberamos um cupom para o seu próximo pedido.",
  "Pedido incompleto":
    "Olá! Sentimos muito que seu pedido tenha vindo incompleto. Já registramos o item faltante e vamos providenciar o reembolso ou o envio do que faltou, conforme a sua preferência.",
  "Pedido errado":
    "Olá! Pedimos desculpas pelo erro no seu pedido. Vamos corrigir a situação agora mesmo: podemos providenciar a troca ou o reembolso total, o que for mais rápido para você.",
  "Qualidade do produto":
    "Olá! Lamentamos que a qualidade do seu pedido não tenha atendido às suas expectativas. Registramos a ocorrência com o restaurante e estamos providenciando o reembolso do valor do item.",
  "Cobranca e reembolso":
    "Olá! Entendemos sua preocupação com a cobrança. Estamos analisando o pagamento do seu pedido e retornaremos com a confirmação do estorno ou da correção o quanto antes.",
  Entregador:
    "Olá! Lamentamos a sua experiência com o entregador. Já registramos a sua reclamação para que a equipe responsável tome as providências necessárias. Obrigado por nos avisar.",
  "Seguranca e saude":
    "Olá! Sentimos muito pelo ocorrido e levamos a sua mensagem a sério. Pedimos que nos envie fotos e os detalhes do pedido para que nossa equipe especializada possa analisar o caso com prioridade. Você também receberá o reembolso integral.",
  Outros:
    "Olá! Obrigado por nos contar o que aconteceu. Lamentamos pela experiência e já encaminhamos o seu caso para a nossa equipe, que entrará em contato com mais detalhes.",
};

const analyze = (complaint: string) => {
  const text = normalize(complaint);
  const category = detectCategory(text);
  const cancellationRisk = scoreCancellationRisk(text);
  const urgency = detectUrgency(text, cancellationRisk);
  return {
    category,
    urgency,
    cancellation_risk: cancellationRisk,
    cancellation_level: levelFromRisk(cancellationRisk),
    suggested_reply: REPLIES[category],
  };
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Método não permitido." }, 405);
    }

    const body = await req.json().catch(() => null);
    const complaint = typeof body?.complaint === "string" ? body.complaint.trim() : "";

    if (!complaint) {
      return jsonResponse({ error: "Cole o texto da reclamação antes de analisar." }, 400);
    }
    if (complaint.length > 5000) {
      return jsonResponse({ error: "A reclamação é muito longa (máximo de 5000 caracteres)." }, 400);
    }

    return jsonResponse(analyze(complaint));
  } catch (err) {
    console.error("analyze-complaint failed", err);
    return jsonResponse({ error: "Não foi possível analisar a reclamação agora." }, 500);
  }
});
