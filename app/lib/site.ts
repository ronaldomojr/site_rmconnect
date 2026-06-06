/** Constantes de conteúdo do site RM Connect (fonte única de verdade). */

export const WHATSAPP_URL = "https://wa.link/h5a3dn";

/** Roteiro das 6 cenas do scroll storytelling (sincronizadas com o morph 3D). */
export const SCENES = [
  {
    kicker: "RM Connect",
    title: "Transformamos ideias em sistemas inteligentes.",
    items: [],
  },
  {
    kicker: "Automação",
    title: "Tudo conectado, sem esforço manual.",
    items: ["Automação de Processos", "Integração de APIs", "Inteligência Artificial", "n8n"],
  },
  {
    kicker: "Desenvolvimento",
    title: "Da ideia ao sistema completo.",
    items: ["Front-end", "Sistemas Web", "Dashboards", "Aplicações SaaS"],
  },
  {
    kicker: "Inteligência Artificial",
    title: "Sistemas que pensam com você.",
    items: ["IA", "Agentes Inteligentes", "Automação Cognitiva", "Processamento de Dados"],
  },
  {
    kicker: "Escala",
    title: "Construído para escalar.",
    items: [],
  },
  {
    kicker: "RM Connect",
    title: "Conectando tecnologia, automação e inteligência.",
    items: [],
  },
] as const;

export const NAV_LINKS = [
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Stack", href: "#stack" },
  { label: "Projetos", href: "#projetos" },
  { label: "Contato", href: "#contato" },
] as const;

export const STATS = [
  { value: 20, suffix: "+", label: "projetos entregues" },
  { value: 15, suffix: "+", label: "bots em produção" },
  { value: 100, suffix: "%", label: "automações end-to-end" },
  { value: 8, suffix: "", label: "áreas de atuação" },
] as const;

export const SERVICES = [
  {
    title: "Sites & Landing Pages",
    desc: "Interfaces modernas e de alta conversão, com arquitetura limpa e performance de ponta.",
  },
  {
    title: "Dashboards em tempo real",
    desc: "Painéis sob medida que transformam dados em decisão, com visualização rápida e dinâmica.",
  },
  {
    title: "Branding & Identidade",
    desc: "Construção de marca e identidade visual que dão presença e consistência ao seu negócio.",
  },
  {
    title: "Bots de WhatsApp",
    desc: "Atendimento e agendamento autônomos via Evolution API e WPPConnect, 24/7.",
  },
  {
    title: "Bot de Marketing",
    desc: "Automação de demandas de marketing: conteúdo, disparos e fluxos sempre no ritmo certo.",
  },
  {
    title: "Automação RPA + IA",
    desc: "Orquestração com n8n conectando CRMs, planilhas e APIs — fluxos end-to-end sem intervenção humana.",
  },
  {
    title: "Geração de Leads",
    desc: "Motores de prospecção que buscam, filtram e qualificam leads para o seu time comercial.",
  },
  {
    title: "Integração de APIs",
    desc: "Conexão avançada entre sistemas para que todo o seu ecossistema trabalhe em sinergia.",
  },
] as const;

export const TECH = [
  "TypeScript",
  "Node.js",
  "Next.js",
  "n8n",
  "Redis",
  "Evolution API",
  "WPPConnect",
  "React",
  "PostgreSQL",
] as const;

export const PROJECTS = [
  {
    id: "barber-bot",
    name: "Barber Bot",
    tag: "Agendamento inteligente",
    desc: "Automação completa da agenda de barbearias via WhatsApp: disponibilidade em tempo real, confirmações, cancelamentos e lembretes — orquestrado com Redis para manter a conversa fluida.",
    stack: ["TypeScript", "Node.js", "Redis", "WhatsApp"],
  },
  {
    id: "lead-hunter",
    name: "Lead Hunter — IVB Edtech",
    tag: "Prospecção automatizada",
    desc: "Sistema sob medida que busca, filtra e qualifica leads para o setor educacional técnico, entregando dados estruturados direto ao comercial e poupando horas de pesquisa.",
    stack: ["TypeScript", "Node.js", "Scraping", "IA"],
  },
  {
    id: "crm-leads",
    name: "Gestão de Leads com CRM",
    tag: "RPA + IA",
    desc: "Captura leads de canais digitais, qualifica com IA e cria cartões dinâmicos no pipeline (Trello), notificando os responsáveis em tempo real.",
    stack: ["n8n", "Trello", "IA", "APIs"],
  },
  {
    id: "marketing-bot",
    name: "Bot de Marketing",
    tag: "Automação de marketing",
    desc: "Robô que executa demandas de marketing de ponta a ponta — produção, organização e disparo de conteúdo — liberando o time para o que importa.",
    stack: ["Node.js", "n8n", "IA", "WhatsApp"],
  },
  {
    id: "dashboards",
    name: "Dashboards corporativos",
    tag: "Visualização de dados",
    desc: "Painéis em tempo real desenvolvidos sob medida para empresas, com UX clean e dados apresentados de forma rápida e acionável.",
    stack: ["Next.js", "TypeScript", "React", "APIs"],
  },
  {
    id: "branding",
    name: "Projetos de Branding",
    tag: "Identidade visual",
    desc: "Construção de marca e identidade visual que posicionam o negócio com presença e consistência em todos os pontos de contato.",
    stack: ["Design", "Branding", "UI"],
  },
] as const;
