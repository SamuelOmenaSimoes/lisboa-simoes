import 'dotenv/config'
import { app } from './app'
const port=Number(process.env.PORT || 3001)
const server=app.listen(port,()=>console.log(`Lisboa Simões API: http://localhost:${port}`))
for (const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>{server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),10000).unref()})
