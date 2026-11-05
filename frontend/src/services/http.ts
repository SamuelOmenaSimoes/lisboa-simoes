export async function postJson(path: string, body: unknown, timeoutMs=15000): Promise<unknown> {
 const base=(import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
 let response: Response
 try {
  response=await fetch(`${base}/api/${path}`,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(timeoutMs)})
 } catch { throw new Error('Não foi possível conectar ao atendimento. Confira sua conexão e tente novamente. No envio de formulário, aguarde antes de reenviar.') }
 const data: unknown=await response.json().catch(()=>null)
 if (!response.ok) {
  const message=data && typeof data==='object' && 'error' in data && typeof data.error==='string' ? data.error : 'Serviço indisponível no momento. Tente novamente mais tarde.'
  throw new Error(message)
 }
 if (!data || typeof data!=='object') throw new Error('O servidor retornou uma resposta inválida. Tente novamente mais tarde.')
 return data
}
