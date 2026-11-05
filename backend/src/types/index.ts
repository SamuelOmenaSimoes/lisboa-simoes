export type { FreightRequest, FreightResponse } from '../../../shared/freight'
export interface ContactRequest {
  name: string
  company: string
  email: string
  phone?: string
  origin?: string
  destination?: string
  cargoType?: string
  message?: string
}
