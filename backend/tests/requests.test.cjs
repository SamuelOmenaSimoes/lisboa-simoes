const {test,before,after}=require('node:test')
const assert=require('node:assert/strict')
const {randomUUID}=require('node:crypto')
const {app}=require('../dist/backend/src/app.js')
const {calculateFreight}=require('../dist/shared/freight.js')
const {parseRouteMetrics,getRouteMetrics}=require('../dist/backend/src/services/routeProvider.js')
let server,base
before(async()=>{delete process.env.ROUTE_API_KEY;server=app.listen(0);await new Promise(r=>server.once('listening',r));base=`http://127.0.0.1:${server.address().port}`})
after(()=>new Promise(r=>server.close(r)))
const req={originLat:-23.55,originLng:-46.63,destLat:-25.42,destLng:-49.27,originLabel:'São Paulo',destLabel:'Curitiba',cargoType:'perigoso',weight:1}
test('eixos alteram somente a referência de pedágio; composição fecha',()=>{
 const a=calculateFreight({...req,axles:3}),b=calculateFreight({...req,axles:4})
 assert.equal(b.tollEstimate,Math.round(a.tollEstimate*4/3*100)/100);assert.equal(a.baseValue,b.baseValue)
 assert.equal(a.routeSource,'reference');assert.match(a.routeNotice,/Não consulta praças reais/)
 for(const axles of [1,2,5,6,7,8,9]) assert.throws(()=>calculateFreight({...req,axles}));assert.throws(()=>calculateFreight({...req,axles:3.5}))
})
test('rota consultada substitui distância, duração e pedágios, sem duplicar combustível',()=>{
 const a=calculateFreight(req,{distanceKm:500,durationMinutes:420,tollEstimate:123.45})
 assert.equal(a.routeSource,'provider');assert.equal(a.distanceKm,500);assert.equal(a.tollEstimate,123.45);assert.equal(a.durationMinutes,420)
 assert.equal(a.fuelSurcharge,Math.round(a.baseValue*.15*100)/100)
})
test('parser de rota aceita zero conhecido e rejeita null, negativos e resposta incompleta',()=>{
 const sample={status:'OK',distancia:'125KM',duracaoSegundos:7200,dados:{veiculo:{custoTotalDinheiro:0}}}
 assert.deepEqual(parseRouteMetrics(sample),{distanceKm:125,durationMinutes:120,tollEstimate:0})
 for(const value of [null,-1,'20']) assert.throws(()=>parseRouteMetrics({...sample,dados:{veiculo:{custoTotalDinheiro:value}}}))
 assert.throws(()=>parseRouteMetrics({status:'OK'}))
})
test('requisição do provedor envia latitude/longitude e eixos; timeout e autenticação só no servidor',async()=>{
 const original=global.fetch
 process.env.ROUTE_API_KEY='test-key-not-real'
 global.fetch=async(url,options)=>{
  assert.equal(url,'https://calcularpedagio.com.br/api/coordenadas/v3')
  assert.equal(options.headers.Authorization,'Bearer test-key-not-real');assert.ok(options.signal)
  const body=JSON.parse(options.body);assert.deepEqual(body.pontos,[[req.originLat,req.originLng],[req.destLat,req.destLng]])
  assert.equal(body.veiculo.eixos,4)
  return {ok:true,json:async()=>({status:'OK',distancia:'500KM',duracaoSegundos:3600,dados:{veiculo:{custoTotalDinheiro:100}}})}
 }
 try {assert.equal((await getRouteMetrics({...req,axles:4})).tollEstimate,100)}
 finally {global.fetch=original;delete process.env.ROUTE_API_KEY}
})
test('reenvio concorrente conserva protocolo e gera somente um e-mail; alteração com mesma chave retorna conflito',async()=>{
 const mail=require('nodemailer'),original=mail.createTransport
 let sent=0
 process.env.SMTP_HOST='test.invalid';process.env.MAIL_FROM='site@example.com';delete process.env.MAIL_TO
 mail.createTransport=()=>({sendMail:async options=>{sent++;assert.equal(options.to,'contato@lisitrans.com.br');assert.equal(options.replyTo.address,'ana@example.com');await new Promise(r=>setTimeout(r,20));return {accepted:['contato@lisitrans.com.br'],rejected:[]}},close(){}})
 const body={name:'Ana',company:'Empresa',email:'ana@example.com',privacyAccepted:true,requestId:randomUUID()}
 const post=data=>fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
 try {
  const results=await Promise.all([post(body),post(body)])
  assert.equal(results[0].status,201);assert.equal(results[1].status,201)
  assert.deepEqual(await results[0].json(),await results[1].json());assert.equal(sent,1)
  assert.equal((await post({...body,name:'Outra pessoa'})).status,409)
 } finally {mail.createTransport=original;delete process.env.SMTP_HOST;delete process.env.MAIL_FROM}
})

test('referência Mogi–São Bernardo: 12 t e 3 eixos se aproxima da cotação de R$ 1.900',()=>{
 const result=calculateFreight({originLat:-23.5227,originLng:-46.187,destLat:-23.6914,destLng:-46.5646,originLabel:'Mogi das Cruzes, SP',destLabel:'São Bernardo do Campo, SP',cargoType:'perigoso',weight:12,axles:3})
 assert.equal(result.distanceKm,49)
 assert.equal(result.weightSurcharge,495)
 assert.equal(result.totalEstimate,1909.63)
 assert.ok(Math.abs(result.totalEstimate-1900)<20)
})
