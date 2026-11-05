// ============================================
// DADOS DA EMPRESA — edite aqui para atualizar o site
// ============================================

export const COMPANY = {
  name: 'Lisboa Simões',
  fullName: 'Lisboa Simões Transportes',
  cnpj: '29.155.126/0001-17',
  founded: '2017',
  phone: '11 99672-3325',
  whatsapp: '5511950547481',
  email: 'contato@lisitrans.com.br',
  linkedin: 'https://www.linkedin.com',
  instagram: 'https://www.instagram.com',
  address: 'Rua Cardoso de Siqueira, 1118 - Sala 3',
  city: 'São Paulo — SP',
  cep: '08795-020',
}

export const STATS = [
  { value: `${Math.max(0, new Date().getFullYear() - Number(COMPANY.founded))}+`, label: 'Anos de operação' },
  { value: '200+', label: 'Entregas mensais' },
  { value: '150+', label: 'Clientes ativos' },
]

export const SERVICES = [
  {
    id: 'Resíduo Líquido Perigoso',
    title: 'Resíduo Líquido Perigoso',
    description: 'Transporte de resíduos líquidos perigosos com rastreamento em tempo real e equipe especializada em manuseio seguro.',
    icon: 'truck',
  },
  {
    id: 'Carga Fracionada',
    title: 'Carga Fracionada',
    description: 'Solução econômica para volumes parciais. Consolidação de cargas com a mesma eficiência operacional.',
    icon: 'boxes',
  },
  {
    id: 'Carga Dedicada',
    title: 'Carga Dedicada',
    description: 'Veículo exclusivo para sua operação. Máximo controle, privacidade logística e SLA personalizado.',
    icon: 'shield',
  },
]

export const DIFFERENTIALS = [
  {
    title: 'Rastreamento em Tempo Real',
    description: 'Tecnologia GPS com monitoramento contínuo.',
  },
  {
    title: 'Equipe Especializada',
    description: 'Motoristas treinados, uniformizados e com certificação MOPP.',
  },
  {
    title: 'Gestão de Ocorrências',
    description: 'Central de atendimento 24 horas com protocolo de gestão de crises, sinistros e desvios operacionais.',
  },
]

export const REGIONS = [
  { region: 'Grande São Paulo', detail: 'Cobertura total, 24h/dia' },
  { region: 'Interior de SP', detail: 'Principais eixos viários' },
  { region: 'Sul de Minas Gerais', detail: 'Sul Mineiro' },
  { region: 'Rio de Janeiro', detail: 'Capital e Baixada Fluminense' },
  { region: 'Paraná', detail: 'Curitiba e Região Metropolitana' },
]

export const FLEET = [
  { type: 'Caminhão Combinado Auto Vácuo/Hidrojato', capacity: '12 toneladas', count: '1 unidade', use: 'Carga Fracionada / Frete Fechado' },
  { type: 'Caminhão Combinado Auto Vácuo/Hidrojato', capacity: '15 toneladas', count: '1 unidade', use: 'Carga Fracionada / Frete Fechado' },
  { type: 'Caminhão Auto Vácuo', capacity: '20 toneladas', count: '2 unidades', use: 'Carga Fracionada / Frete Fechado' },
  { type: 'Caminhão Combinado Auto Vácuo Revestido', capacity: '13 toneladas', count: '1 unidade', use: 'Carga Fracionada / Frete Fechado' },
  { type: 'Caminhão Auto Vácuo', capacity: '15 toneladas', count: '1 unidade', use: 'Carga Fracionada / Frete Fechado' },
]

export const CLIENTS_SEGMENTS = [
  'Indústria de Bens de Consumo',
  'Distribuidoras Farmacêuticas',
  'E-commerce e Varejo Digital',
  'Indústria de Eletrônicos',
  'Autopeças e Manufatura',
  'Alimentos e Bebidas',
  'Cosméticos e Higiene',
  'Insumos Industriais',
]

export { FREIGHT_CONFIG } from '../../../shared/freight'
