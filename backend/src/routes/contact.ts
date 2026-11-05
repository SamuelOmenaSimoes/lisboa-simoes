import { Router } from 'express'
import { randomUUID, createHash } from 'node:crypto'
import nodemailer from 'nodemailer'
const router=Router()
type Delivery={status:number;body:{success?:boolean;protocol?:string;error?:string}}
const deliveries=new Map<string,{fingerprint:string;expires:number;result:Promise<Delivery>}>()
const ttl=60*60*1000
async function deliver(data:Record<string,string>):Promise<Delivery> {
 const protocol=randomUUID()
 const transporter=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT || 587),secure:process.env.SMTP_SECURE==='true',
  auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}:undefined,
  connectionTimeout:5000,greetingTimeout:5000,socketTimeout:10000,disableFileAccess:true,disableUrlAccess:true})
 try {
  const result=await transporter.sendMail({from:process.env.MAIL_FROM,to:process.env.MAIL_TO || 'contato@lisitrans.com.br',replyTo:{address:data.email,name:data.name},
   subject:`Solicitação de orçamento — ${protocol}`,text:Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n')+`\nProtocolo: ${protocol}\nCiência do aviso: ${new Date().toISOString()}`})
  if (!result.accepted?.length || result.rejected?.length) throw new Error('Entrega não aceita integralmente')
  return {status:201,body:{success:true,protocol}}
 } catch {console.error('[contact] Falha no encaminhamento',protocol);return {status:502,body:{error:'Não foi possível confirmar o envio. Aguarde e tente novamente com os mesmos dados, ou utilize o e-mail de contato.'}}}
 finally {transporter.close()}
}
router.post('/',async(req,res)=>{
 res.set('Cache-Control','no-store')
 const body=req.body
 if(!body || typeof body!=='object' || Array.isArray(body)) return res.status(400).json({error:'Solicitação inválida.'})
 const limits:Record<string,number>={name:120,company:160,email:254,phone:40,origin:200,destination:200,cargoType:100,message:3000}
 const data:Record<string,string>={}
 for(const [key,max] of Object.entries(limits)) {
  if(body[key]!==undefined && typeof body[key]!=='string') return res.status(400).json({error:'Dados de contato inválidos.'})
  const value=(body[key]||'').trim()
  if(value.length>max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) return res.status(400).json({error:'Campo inválido ou muito longo.'})
  data[key]=value
 }
 if(!data.name || !data.company || !/^[^\s@<>(),;:\[\]\"\\]+@[^\s@<>(),;:\[\]\"\\]+\.[^\s@<>(),;:\[\]\"\\]+$/.test(data.email) || /[\r\n]/.test(data.name) || body.privacyAccepted!==true) return res.status(400).json({error:'Confira nome, empresa, e-mail e ciência do aviso de privacidade.'})
 const requestId=body.requestId
 if(requestId!==undefined && (typeof requestId!=='string' || !/^[a-f0-9-]{36}$/i.test(requestId))) return res.status(400).json({error:'Identificador da solicitação inválido.'})
 const now=Date.now()
 for(const [key,value] of deliveries) if(value.expires<now) deliveries.delete(key)
 const fingerprint=createHash('sha256').update(JSON.stringify(data)).digest('hex')
 const saved=requestId?deliveries.get(requestId):undefined
 if(saved) {
  if(saved.fingerprint!==fingerprint) return res.status(409).json({error:'Os dados da solicitação foram alterados. Atualize o formulário e tente novamente.'})
  const result=await saved.result
  return res.status(result.status).json(result.body)
 }
 if(!process.env.SMTP_HOST || !process.env.MAIL_FROM) return res.status(503).json({error:'O formulário está temporariamente indisponível. Envie sua solicitação para contato@lisitrans.com.br.'})
 if(deliveries.size>=1000) return res.status(503).json({error:'Atendimento com alto volume. Aguarde antes de tentar novamente.'})
 const key=requestId || randomUUID()
 const pending=deliver(data)
 deliveries.set(key,{fingerprint,expires:now+ttl,result:pending})
 const result=await pending
 if(result.status!==201) deliveries.delete(key)
 return res.status(result.status).json(result.body)
})
export default router
