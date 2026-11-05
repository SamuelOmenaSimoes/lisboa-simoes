import type { LocationSuggestion } from '../types'
export { haversineKm } from '../../../shared/freight'
const cities: LocationSuggestion[] = [
 ['Mogi das Cruzes, SP',-23.5227,-46.187],['Suzano, SP',-23.5425,-46.3108],['Itaquaquecetuba, SP',-23.4861,-46.3483],
 ['São Paulo, SP',-23.5505,-46.6333],['Guarulhos, SP',-23.4543,-46.5337],['Campinas, SP',-22.9099,-47.0626],
 ['Santos, SP',-23.9608,-46.3336],['Sorocaba, SP',-23.5015,-47.4526],['Ribeirão Preto, SP',-21.1704,-47.8103],
 ['São José dos Campos, SP',-23.2237,-45.9009],['Jundiaí, SP',-23.1857,-46.8978],['Osasco, SP',-23.5325,-46.7917],
 ['Barueri, SP',-23.5113,-46.8765],['São Bernardo do Campo, SP',-23.6914,-46.5646],['Santo André, SP',-23.6639,-46.5383],
 ['São José do Rio Preto, SP',-20.8113,-49.3758],['Bauru, SP',-22.3145,-49.0587],['Piracicaba, SP',-22.7253,-47.6492],
 ['Rio de Janeiro, RJ',-22.9068,-43.1729],['Duque de Caxias, RJ',-22.7856,-43.3117],['Volta Redonda, RJ',-22.5231,-44.1041],
 ['Belo Horizonte, MG',-19.9167,-43.9345],['Pouso Alegre, MG',-22.2304,-45.9369],['Varginha, MG',-21.5514,-45.4303],
 ['Uberlândia, MG',-18.9186,-48.2772],['Juiz de Fora, MG',-21.7642,-43.3503],
 ['Curitiba, PR',-25.4284,-49.2733],['Londrina, PR',-23.3045,-51.1696],['Maringá, PR',-23.4205,-51.9333],
 ['Joinville, SC',-26.3044,-48.8487],['Florianópolis, SC',-27.5954,-48.548],['Itajaí, SC',-26.9101,-48.6705],
 ['Blumenau, SC',-26.9194,-49.0661],['Porto Alegre, RS',-30.0346,-51.2177],['Brasília, DF',-15.7939,-47.8828],
 ['Goiânia, GO',-16.6869,-49.2648],['Salvador, BA',-12.9777,-38.5016],['Recife, PE',-8.0476,-34.877],
 ['Fortaleza, CE',-3.7319,-38.5267],['Vitória, ES',-20.3155,-40.3128],['Manaus, AM',-3.119,-60.0217],
 ['Belém, PA',-1.4558,-48.4902],['Cuiabá, MT',-15.6014,-56.0979],['Campo Grande, MS',-20.4697,-54.6201],
].map(([label,lat,lng])=>({label:label as string,lat:lat as number,lng:lng as number}))
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
export const searchLocations=(query:string)=>query.trim().length<2 ? [] : cities.filter(c=>normalize(c.label).includes(normalize(query.trim()))).slice(0,6)
