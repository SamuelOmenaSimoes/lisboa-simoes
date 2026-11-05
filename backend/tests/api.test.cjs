const { test, before, after }=require('node:test')
const assert=require('node:assert/strict')
const { app }=require('../dist/backend/src/app.js')
const {calculateFreight}=require('../dist/shared/freight.js')
delete process.env.ROUTE_API_KEY
let server,base
before(async()=>{server=app.listen(0);await new Promise(r=>server.once('listening',r));base=`http://127.0.0.1:${server.address().port}`})
after(()=>new Promise(r=>server.close(r)))
const valid={originLat:-23.55,originLng:-46.63,destLat:-25.42,destLng:-49.27,originLabel:'São Paulo',destLabel:'Curitiba',cargoType:'oleo-residual',weight:1}
const post=(path,body)=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
test('resíduo perigoso tem tarifa maior que óleo residual; total corresponde às parcelas',()=>{const a=calculateFreight(valid),b=calculateFreight({...valid,cargoType:'perigoso'});assert.ok(b.totalEstimate>a.totalEstimate);assert.equal(a.totalEstimate,Math.round((a.baseValue+a.weightSurcharge+a.fuelSurcharge+a.tollEstimate+a.hazmatFee)*100)/100)})
test('peso adicional e tarifa mínima',()=>{assert.ok(calculateFreight({...valid,weight:3}).weightSurcharge===150);assert.ok(calculateFreight({...valid,destLat:-23.551}).baseValue>=350)})
test('API rejeita coordenadas, pesos e tipos inválidos',async()=>{for(const change of [{originLat:91},{weight:-1},{weight:0},{cargoType:undefined},{cargoType:'x'},{destLat:valid.originLat,destLng:valid.originLng}])assert.equal((await post('/api/freight/calculate',{...valid,...change})).status,400)})
test('API e cálculo compartilhado retornam o mesmo resultado',async()=>{const res=await post('/api/freight/calculate',valid);assert.equal(res.status,200);assert.deepEqual(await res.json(),calculateFreight(valid))})
test('JSON inválido retorna erro estruturado',async()=>{const res=await fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});assert.equal(res.status,400);assert.ok((await res.json()).error)})
test('contato rejeita dados incompletos e não anuncia envio sem SMTP',async()=>{assert.equal((await post('/api/contact',{name:'Ana'})).status,400);delete process.env.SMTP_HOST;const res=await post('/api/contact',{name:'Ana',company:'Empresa',email:'ana@example.com',privacyAccepted:true});assert.equal(res.status,503);assert.ok((await res.json()).error)})

test('protocolo apenas quando o transporte aceita; rejeição resulta em 502',async()=>{
 const nodemailer=require('nodemailer'),original=nodemailer.createTransport
 process.env.SMTP_HOST='test.invalid';process.env.MAIL_FROM='site@example.com';process.env.MAIL_TO='team@example.com'
 let accepted=true
 nodemailer.createTransport=()=>({sendMail:async options=>{assert.equal(options.replyTo.address,'ana@example.com');return {accepted:accepted?['team@example.com']:[]}},close(){}})
 try {
  const body={name:'Ana',company:'Empresa',email:'ana@example.com',privacyAccepted:true}
  const success=await post('/api/contact',body);assert.equal(success.status,201);assert.match((await success.json()).protocol,/^[a-f0-9-]{36}$/)
  accepted=false;assert.equal((await post('/api/contact',body)).status,502)
 } finally {nodemailer.createTransport=original;delete process.env.SMTP_HOST;delete process.env.MAIL_FROM;delete process.env.MAIL_TO}
})
