import { postJson } from './http'
import type { FreightRequest, FreightResponse } from '../../../shared/freight'
export { CARGO_TYPES, FREIGHT_CONFIG } from '../../../shared/freight'
export async function calculateFreight(data: FreightRequest): Promise<FreightResponse> {
 const result=await postJson('freight/calculate',data) as FreightResponse
 if (!['reference','provider'].includes(result.routeSource) || typeof result.routeNotice !== 'string' ||
  ![result.distanceKm,result.durationMinutes,result.baseValue,result.weightSurcharge,result.hazmatFee,result.fuelSurcharge,result.tollEstimate,result.totalEstimate,result.axles].every(n=>typeof n==='number' && Number.isFinite(n) && n>=0) ||
  typeof result.origin !== 'string' || typeof result.destination !== 'string') throw new Error('A resposta da simulação está incompleta. Tente novamente.')
 return result
}
