import type { FreightRequest, RouteMetrics } from '../../../shared/freight'
// Contrato v3: https://calcularpedagio.com.br/documentacao
export function parseRouteMetrics(value: unknown): RouteMetrics {
 if (!value || typeof value !== 'object') throw new Error('Resposta de rota inválida')
 const v=value as Record<string, any>
 if (v.status !== 'OK' || !v.dados || typeof v.dados !== 'object') throw new Error('Rota indisponível')
 const d = typeof v.distancia === 'string' ? v.distancia.match(/^([0-9]+(?:\.[0-9]+)?)\s*KM$/i) : null
 const distanceKm = d ? Number(d[1]) : NaN
 const seconds = v.duracaoSegundos
 const toll = v.dados.veiculo?.custoTotalDinheiro
 // null indica tarifa desconhecida; nunca converter null para zero.
 if (typeof toll !== 'number' || !Number.isFinite(toll) || toll < 0 || !Number.isFinite(distanceKm) || distanceKm <= 0 || typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) throw new Error('Distância, duração ou pedágios incompletos')
 return {distanceKm,durationMinutes:Math.round(seconds/60),tollEstimate:toll}
}
export async function getRouteMetrics(req: FreightRequest): Promise<RouteMetrics | undefined> {
 const key=process.env.ROUTE_API_KEY
 if (!key) return undefined
 const response=await fetch('https://calcularpedagio.com.br/api/coordenadas/v3',{
  method:'POST',redirect:'error',headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
  body:JSON.stringify({pontos:[[req.originLat,req.originLng],[req.destLat,req.destLng]],veiculo:{tipo:'caminhao',eixos:req.axles ?? 3}}),
  signal:AbortSignal.timeout(8000),
 })
 if (!response.ok) throw new Error('Provedor de rotas indisponível')
 return parseRouteMetrics(await response.json())
}
