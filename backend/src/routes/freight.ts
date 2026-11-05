import { Router } from 'express'
import { calculateFreight, validateFreight } from '../../../shared/freight'
import { getRouteMetrics } from '../services/routeProvider'
const router=Router()
router.post('/calculate',async(req,res)=>{
 try { validateFreight(req.body) } catch(err) { return res.status(400).json({error:err instanceof Error?err.message:'Dados inválidos.'}) }
 try {
  let metrics
  let providerFailed=false
  try { metrics=await getRouteMetrics(req.body) } catch { providerFailed=true }
  const result=calculateFreight(req.body,metrics)
  if (providerFailed) result.routeNotice='A consulta ao provedor de rotas ficou indisponível. Exibindo somente referência aproximada por distância e eixos, sem tarifas de praças reais.'
  res.set('Cache-Control','no-store')
  return res.json(result)
 } catch {return res.status(500).json({error:'Não foi possível calcular a aproximação. Tente novamente.'})}
})
export default router
