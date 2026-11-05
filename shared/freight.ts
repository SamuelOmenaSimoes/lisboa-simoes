// ============================================
// CONFIGURAÇÃO DO CÁLCULO DE FRETE
// Estimativa própria: não reproduz a fórmula nem as tarifas do Rotas Brasil.
// Apenas resíduos perigosos e óleo residual
// ============================================

export const FREIGHT_CONFIG = {
  baseRatePerKm: 8.50,        // R$ por km base
  minimumCharge: 350.00,      // Cobrança mínima em R$
  fuelSurcharge: 0.15,        // 15% sobretaxa de combustível
  tollEstimatePerKm: 0.30,    // Estimativa de pedágio por km

  // Tipos de resíduo (apenas perigosos)
  wasteTypes: {
    'perigoso': {
      label: 'Resíduo Perigoso',
      multiplier: 2.8,
      weightRatePerTon: 45.00,    // Referência inicial calibrada pela cotação Mogi → SBC, 12 t, 3 eixos.
    },
    'oleo-residual': {
      label: 'Óleo Residual',
      multiplier: 2.2,
      weightRatePerTon: 75.00,
    },
  } as Record<string, { label: string; multiplier: number; weightRatePerTon: number }>,

  // Taxa adicional por km para resíduos perigosos (seguro/rastreamento/documentação)
  hazmatFeePerKm: {
    'perigoso': 1.20,
    'oleo-residual': 0.85,
  } as Record<string, number>,
}

export const CARGO_TYPES=Object.entries(FREIGHT_CONFIG.wasteTypes).map(([value,c])=>({value,label:c.label}))
export interface FreightRequest {
 originLat: number; originLng: number; destLat: number; destLng: number;
 originLabel: string; destLabel: string; cargoType: string; weight: number; axles?: number;
}
export interface RouteMetrics { distanceKm: number; durationMinutes: number; tollEstimate: number }
export interface FreightResponse {
 axles: number; routeSource: 'reference' | 'provider'; routeNotice: string;
 distanceKm: number; durationMinutes: number; baseValue: number; fuelSurcharge: number;
 tollEstimate: number; weightSurcharge: number; hazmatFee: number; totalEstimate: number; origin: string; destination: string;
}
export const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
 const rad = Math.PI / 180
 const a = Math.sin((lat2-lat1)*rad/2)**2 + Math.cos(lat1*rad)*Math.cos(lat2*rad)*Math.sin((lng2-lng1)*rad/2)**2
 return Math.round(6371 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, a)))) * 1.15)
}
export function validateFreight(value: unknown): asserts value is FreightRequest {
 if (!value || typeof value !== 'object') throw new Error('Informe os dados da simulação.')
 const x = value as Record<string, unknown>
 if (Array.isArray(value)) throw new Error('Informe os dados da simulação.')
 if (x.axles !== undefined && x.axles !== 3 && x.axles !== 4) throw new Error('Selecione o caminhão de 3 ou 4 eixos.')
 for (const [key, limit] of [['originLat',90],['destLat',90],['originLng',180],['destLng',180]] as const) {
  if (typeof x[key] !== 'number' || !Number.isFinite(x[key]) || Math.abs(x[key] as number) > limit) throw new Error('Coordenadas inválidas.')
 }
 for (const key of ['originLabel','destLabel']) if (typeof x[key] !== 'string' || !(x[key] as string).trim() || (x[key] as string).length > 250) throw new Error('Selecione origem e destino.')
 if (typeof x.weight !== 'number' || !Number.isFinite(x.weight) || x.weight < .1 || x.weight > 100) throw new Error('O peso deve estar entre 0,1 e 100 toneladas.')
 if (!CARGO_TYPES.some(c=>c.value===x.cargoType)) throw new Error('Tipo de carga inválido.')
 if (x.originLat === x.destLat && x.originLng === x.destLng) throw new Error('Selecione cidades de origem e destino diferentes.')
}
const money = (n: number) => Math.round(n*100)/100
export function calculateFreight(req: FreightRequest, route?: RouteMetrics): FreightResponse {
 validateFreight(req)
 const cfg=FREIGHT_CONFIG
 const axles=req.axles ?? 3
 const distanceKm=route ? route.distanceKm : haversineKm(req.originLat,req.originLng,req.destLat,req.destLng)
 if (route && (![route.distanceKm,route.durationMinutes,route.tollEstimate].every(Number.isFinite) || route.distanceKm <= 0 || route.durationMinutes < 0 || route.tollEstimate < 0)) throw new Error('Dados de rota inválidos.')
 const multiplier=cfg.wasteTypes[req.cargoType].multiplier
 const baseValue=money(Math.max(distanceKm*cfg.baseRatePerKm*multiplier,cfg.minimumCharge))
 const weightSurcharge=money(Math.max(0,req.weight-1)*cfg.wasteTypes[req.cargoType].weightRatePerTon)
 const fuelSurcharge=money(baseValue*cfg.fuelSurcharge)
 // R$ 0,30/km é referência comercial para 3 eixos, não tarifa de uma praça.
 const tollEstimate=money(route ? route.tollEstimate : distanceKm*cfg.tollEstimatePerKm*(axles/3))
 const hazmatFee=money(distanceKm*(cfg.hazmatFeePerKm[req.cargoType] || 0))
 return { axles, routeSource: route ? 'provider' : 'reference',
 routeNotice: route ? 'Distância e pedágios estimados pelo provedor de rotas para os eixos informados.' : 'Distância geográfica acrescida de 15%; pedágios por referência de R$ 0,30/km para 3 eixos, proporcional aos eixos informados. Não consulta praças reais.',
 distanceKm, durationMinutes: route ? route.durationMinutes : Math.round(distanceKm/70*60), baseValue, weightSurcharge, fuelSurcharge, tollEstimate, hazmatFee,
 totalEstimate:money(baseValue+weightSurcharge+fuelSurcharge+tollEstimate+hazmatFee),origin:req.originLabel,destination:req.destLabel }
}
