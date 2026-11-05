# Lisboa Simões / Lisitrans — segunda versão corrigida

Esta entrega parte exclusivamente da segunda pasta enviada pelo usuário. Mantém seus dados de empresa, frota, serviços, regiões, textos, indicadores e tarifas de resíduos perigosos e óleo residual. Não substitui esse conteúdo pelo da primeira versão.

## Executar

Requer Node.js 22.12+ e npm. Extraia o projeto inteiro, incluindo `shared`.

Na raiz:

```sh
npm run setup
npm run dev:frontend
```

Em outro terminal, na raiz:

```sh
npm run dev:backend
```

Site: http://localhost:5173. API: http://localhost:3001.

## Formulário e e-mail

Copie `backend/.env.example` para `backend/.env` e preencha os dados SMTP, remetente e destinatário. Sem essa configuração, a API retorna indisponibilidade e o site mantém os dados digitados, sem mostrar sucesso falso. A confirmação ocorre quando o servidor SMTP aceita a mensagem; não representa garantia de chegada à caixa postal. O protocolo é um identificador de correlação, não um ticket armazenado em banco.

As credenciais devem ficar apenas no servidor. Não há banco de leads ou CRM nesta entrega. Os testes usam transporte SMTP simulado e não enviam e-mails externos.

## Calculadora

As tarifas são as da SEGUNDA versão: base de R$ 8,50/km, mínimo de R$ 350, combustível de 15%, pedágio aproximado de R$ 0,30/km. Resíduo perigoso: multiplicador 2,8, adicional de R$ 45 por tonelada acima de 1 t e taxa de R$ 1,20/km. Óleo residual: multiplicador 2,2, adicional de R$ 75 por tonelada acima de 1 t e taxa de R$ 0,85/km.

A fonte única é `shared/freight.ts`. Interface e API usam a mesma validação e regra de cálculo. O site envia a simulação para `POST /api/freight/calculate`. Não substitui erros da API por valores silenciosos no navegador. Alterar uma entrada invalida a estimativa anterior; iniciar nova consulta limpa os campos; o resultado pode preencher o formulário comercial.

A distância é geográfica com acréscimo de 15%, não uma rota rodoviária. Pedágios e tempo são aproximações. Não há integração com Rotas Brasil; o código usa uma fórmula própria. Existe uma integração opcional com API Pedágios (ver atualização abaixo). Os valores precisam de homologação comercial antes de serem usados como proposta oficial.

A busca usa uma lista local de cidades de referência, incluindo Mogi das Cruzes, Suzano e Itaquaquecetuba. Não consulta um serviço externo a cada tecla e não cobre todos os municípios. Para outras cidades, o visitante pode solicitar orçamento no formulário. Para busca nacional, conectar uma base completa de municípios ou um provedor adequado.

## Marca e conteúdo

A logo foi extraída do PDF original como SVG transparente. `frontend/public/brand/lisitrans-original.svg` preserva azul e laranja. `lisitrans-dark.svg` substitui apenas o azul por branco para leitura sobre o fundo escuro. Aplicada no cabeçalho e no rodapé; favicon também deriva do símbolo oficial.

Dados e textos permanecem em `frontend/src/data/company.ts` e nos componentes da segunda versão. O WhatsApp foi normalizado com código 55. Referências a 18 anos foram corrigidas para a fundação informada, 2017. O número de estados exibido agora corresponde à lista e os contadores de cidades foram alinhados a 100+.

Os números, certificações, depoimento, disponibilidade 24h, prazo de 48h, capacidades e demais afirmações fornecidos na segunda versão foram mantidos como conteúdo editorial do usuário. Não foram verificados externamente: a empresa deve aprová-los antes da publicação. Confirmar especialmente o endereço/cidade/CEP e os perfis sociais, que ainda apontam para as páginas iniciais das redes. Não foram inventados novos perfis nem corrigidos dados institucionais por suposição. O aviso de privacidade deve refletir o processo real da empresa. As fotografias externas são ilustrativas.

## Compilar, testar e publicar

```sh
npm run build
npm test
```

Build estático: `frontend/dist`. API compilada: `backend/dist/backend/src/index.js`, com o módulo compartilhado em `backend/dist/shared`. Inicie a API com `npm --prefix backend start`. Para inspecionar o build local: `npm --prefix frontend run preview`. Não abra o site diretamente por `file://`.

Na hospedagem, use HTTPS e encaminhe `/api` à API, ou configure `frontend/.env` com `VITE_API_URL=https://api.seudominio.com.br` antes do build. O proxy do Vite só existe no desenvolvimento. Ajuste `FRONTEND_URL` no backend para a origem exata do site. Execute a API com pasta de trabalho `backend` ao usar `.env`.

Configure `TRUST_PROXY_HOPS` somente se houver um proxy reverso e conforme a topologia real. O limitador usa memória por processo; múltiplas instâncias exigem armazenamento compartilhado. `/health` verifica o processo, não o SMTP. Portal e rastreamento não foram implementados; links vazios para esses recursos foram retirados.

## Verificação

Frontend e backend compilados; sete testes de cálculo e API; inspeção no navegador da seleção de cidades por teclado, estimativa e transferência da rota ao formulário. Exemplo verificado: São Paulo–Mogi das Cruzes, 1 t de resíduo perigoso, 52 km aproximados, R$ 1.501,24 com a tabela fornecida.

Não foram feitos testes com e-mail real, carga de produção, dispositivos móveis reais ou integração operacional de rotas.


## Atualização de 05/11/2026 — e-mail, requisições e aproximação

E-mail público e destinatário padrão corrigidos para **contato@lisitrans.com.br**. `MAIL_TO` pode sobrescrever o destinatário apenas no servidor. O remetente autenticado ainda deve ser configurado em `MAIL_FROM`.

Composição mantida conforme orientação do usuário: frete por distância e tipo de resíduo + peso + combustível + pedágios + seguro/rastreamento. As tarifas do material recebido foram conservadas. A interface agora diz **valor aproximado**, informa os componentes e orienta a confirmação do valor exato com a equipe. A simulação cobre um trecho; não calcula retorno nem destinação/tratamento do resíduo.

### Eixos e pedágios

O usuário escolhe entre caminhão menor (3 eixos) e caminhão maior (4 eixos). Sem provedor, a referência de R$ 0,30/km da segunda versão é mantida para 3 eixos e ajustada proporcionalmente: `pedágio aproximado = km aproximados × 0,30 × eixos / 3`. Essa é uma hipótese comercial configurável, não uma tabela oficial de praças. Distância continua geográfica com acréscimo de 15%. O tipo de resíduo altera a tarifa comercial e o adicional de seguro/rastreamento, não a tarifa por eixo de uma praça.

### Consulta opcional de rotas

Para consultar distância e pedágios por caminhão/eixos, o backend inclui um adaptador da API Pedágios v3. É outro provedor, não o Rotas Brasil. Documentação: https://calcularpedagio.com.br/documentacao . Exige conta/plano e chave do provedor; não foi criada conta nem contratada assinatura.

Preencha **somente no servidor** `ROUTE_API_KEY` em `backend/.env`. O adaptador usa `/api/coordenadas/v3`, coordenadas `[latitude, longitude]` e veículo caminhão com os eixos informados. Não envia nome, e-mail ou conteúdo do formulário: somente coordenadas e eixos. A chave não é enviada ao navegador.

Quando há retorno válido, a distância, a duração e os pedágios retornados substituem as referências locais. A tarifa comercial da empresa continua sendo aplicada à distância da rota. Combustível continua sendo o adicional de 15% sobre o frete base; não soma outro custo de combustível do provedor. Tarifa desconhecida (`null`) nunca é tratada como pedágio grátis. Timeout, quota ou resposta inválida geram referência aproximada com aviso explícito, sem exibir um resultado do provedor que não tenha sido obtido. Não há garantia de rota autorizada para resíduos perigosos: validação operacional continua necessária.

Sem chave, a aplicação não chama serviços externos de rotas. O adaptador foi validado com respostas simuladas de acordo com o contrato documentado, sem consulta comercial real. A resposta atual do provedor precisa de homologação com uma chave válida antes de uso operacional.

### Formulário e requisições

- URLs da API normalizadas e respostas JSON verificadas; sucesso de formulário exige `success: true` e protocolo válido.
- Timeout de 15 s na simulação e 60 s no formulário; valores e campos preservados em caso de falha.
- Mudanças nos dados da simulação invalidam respostas antigas que chegarem depois.
- Bloqueio imediato de duplo clique no envio e campos desabilitados enquanto envia.
- Identificador estável em uma tentativa repetida com os mesmos dados. O backend reutiliza o resultado da solicitação já aceita, inclusive quando duas requisições chegam juntas, dentro de uma hora e no mesmo processo.
- A memória de deduplicação é limitada e guarda hash dos campos e resultado, não o formulário completo. Para múltiplas instâncias ou reinícios, usar armazenamento persistente compartilhado. Falhas ambíguas de SMTP ainda podem exigir verificação manual antes de reenviar; isso não é garantia de entrega exatamente uma vez.
- Sem SMTP, a API devolve 503 e a tela oferece um e-mail preenchido para o visitante enviar manualmente pelo próprio aplicativo de e-mail. Esse botão não envia automaticamente.

Verificação atualizada: **12 testes automatizados passaram** (regra de cálculo, validação HTTP, eixos, parser do provedor, contrato da requisição externa simulado e deduplicação do envio). Frontend e backend compilados. No navegador, verificados cálculo pela API, avisos de aproximação, e-mail corrigido e erro do formulário sem SMTP. Nenhum e-mail externo foi enviado. A instalação de produção ainda precisa das credenciais SMTP e, se desejado, da chave do provedor de rotas.


### Simplificação da navegação

Escolha visual restrita a caminhão menor (3 eixos) ou maior (4 eixos), com a mesma validação na API. A seção de clientes foi substituída por segmentos atendidos, sem depoimentos, NPS ou indicadores de relacionamento.


### Calibração comercial inicial — 05/11/2026

O usuário informou valor de referência de R$ 1.900 para Mogi das Cruzes → São Bernardo do Campo, 12 t de resíduo perigoso, caminhão de 3 eixos. A simulação anterior era R$ 2.404,63, com adicional por peso de R$ 990. O parâmetro de peso do resíduo perigoso foi reduzido de R$ 90 para R$ 45 por tonelada acima de 1 t. A mesma simulação passa a R$ 1.909,63 (diferença de R$ 9,63 em relação à referência). Óleo residual e os demais parâmetros não foram alterados.

Este ajuste afeta todas as simulações de resíduo perigoso com mais de 1 t. É uma calibração provisória com um exemplo comercial, não uma validação de toda a tabela nem uma correção dos pedágios. Comparar outras rotas, pesos e veículos com cotações reais antes da homologação. Não foi aplicado um desconto oculto nem um valor fixo à rota.
