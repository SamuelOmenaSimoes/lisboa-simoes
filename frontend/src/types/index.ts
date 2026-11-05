export type { FreightRequest, FreightResponse } from '../../../shared/freight'
export interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address: {
    city?: string
    town?: string
    state?: string
    country?: string
  }
}

export interface LocationSuggestion {
  label: string
  lat: number
  lng: number
}

export interface ContactForm {
  name: string
  company: string
  email: string
  phone: string
  origin: string
  destination: string
  cargoType: string
  message: string
}
