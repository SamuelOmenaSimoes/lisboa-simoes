import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import freightRouter from './routes/freight'
import contactRouter from './routes/contact'
export const app=express()
app.disable('x-powered-by')
// Configure apenas a quantidade real de proxies controlados pela infraestrutura.
if (process.env.TRUST_PROXY_HOPS) app.set('trust proxy',Number(process.env.TRUST_PROXY_HOPS))
app.use(helmet())
app.use(cors({origin:process.env.FRONTEND_URL || 'http://localhost:5173'}))
app.use(express.json({limit:'20kb'}))
app.use('/api',rateLimit({windowMs:60000,limit:60,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Muitas solicitações. Aguarde um minuto.'}}))
app.use('/api/contact',rateLimit({windowMs:15*60000,limit:5,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Limite de solicitações atingido. Aguarde alguns minutos.'}}),contactRouter)
app.use('/api/freight',freightRouter)
app.get('/health',(_req,res)=>res.json({status:'ok',service:'Lisboa Simões API'}))
app.use((_req,res)=>res.status(404).json({error:'Recurso não encontrado.'}))
app.use((err: {status?:number},_req:express.Request,res:express.Response,_next:express.NextFunction)=>{
 const status=err.status===413?413:err.status===400?400:500
 res.status(status).json({error:status===413?'Solicitação muito grande.':status===400?'JSON inválido.':'Erro interno. Tente novamente.'})
})
