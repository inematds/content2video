# Plano de implementação — Link ou documento para vídeo de aproximadamente 1 minuto

A melhor forma de construir essa aplicação é tratá-la como um **motor de produção audiovisual em etapas**, e não como um único agente que recebe o link e tenta gerar o vídeo inteiro de uma vez.

A estrutura central seria:

> **Fonte → Extração → Análise → Roteiro → Storyboard → Seleção de mídias → Narração → Montagem → Verificação → Vídeo**

A decisão técnica mais importante é criar primeiro um **storyboard estruturado em JSON**. Esse storyboard será o contrato entre a inteligência artificial e o sistema de renderização.

A IA decide **o que comunicar**.  
O código decide **como baixar, cortar, organizar, renderizar e salvar**.

---

## 1. Objetivo do produto

O usuário poderá:

1. Colar um link ou enviar um documento.
2. Escolher o objetivo do vídeo:
   - **Alcance:** conteúdo rápido, curioso e impactante.
   - **Autoridade:** explicativo, mostrando conhecimento.
   - **Promocional:** direcionado para uma oferta, produto ou evento.
3. Escolher o formato:
   - Vertical 9:16.
   - Horizontal 16:9.
   - Quadrado 1:1.
4. Receber uma análise da fonte.
5. Revisar o título, roteiro e storyboard.
6. Gerar uma prévia.
7. Corrigir cenas individualmente.
8. Exportar o vídeo final em MP4.

O resultado ideal seria um vídeo com:

- Duração-alvo de 60 segundos, com tolerância de 30% para mais ou para menos (42 a 78 segundos).
- Aproximadamente 6 a 12 cenas, ajustadas à duração e ao ritmo editorial.
- Narração.
- Legendas.
- Imagens extraídas da fonte.
- Capturas de páginas ou documentos.
- Trechos de vídeos existentes, quando autorizados.
- Imagens geradas por IA quando faltarem recursos visuais.
- Música de fundo opcional.
- Identidade visual do INEMA.

---

## 2. Fluxo completo da aplicação

```text
Usuário
   ↓
Envia link ou documento
   ↓
Sistema identifica o tipo da fonte
   ↓
Extrai texto, imagens, vídeos e metadados
   ↓
Divide o conteúdo em blocos verificáveis
   ↓
IA analisa ideias, fatos e argumentos
   ↓
IA cria roteiro e storyboard
   ↓
Sistema procura a melhor mídia para cada cena
   ↓
Gera somente as imagens que estiverem faltando
   ↓
Seleciona e corta trechos de vídeo
   ↓
Gera narração e legendas
   ↓
Produz prévia em baixa resolução
   ↓
Executa verificações automáticas
   ↓
Renderiza o MP4 final
```

---

## 3. Tipos de entrada

A primeira versão deveria aceitar:

| Entrada | Tratamento |
|---|---|
| Página pública | Extrair título, texto, imagens, vídeos e metadados |
| Artigo ou blog | Aplicar modo de leitura e remover menus/anúncios |
| PDF | Extrair texto, imagens e renderizar páginas importantes |
| PDF escaneado | Usar OCR somente quando necessário |
| DOCX | Extrair títulos, parágrafos, tabelas e imagens |
| PPTX | Extrair textos, imagens e capturas dos slides |
| TXT ou Markdown | Processar diretamente |
| MP4 enviado | Transcrever, identificar cenas e selecionar trechos |
| Link direto de vídeo | Baixar somente quando permitido |
| YouTube ou plataforma semelhante | Usar legenda/transcrição e mídia conforme autorização |

Na primeira versão, eu não tentaria capturar vídeos de qualquer site automaticamente. Isso introduziria problemas com formatos, proteção de streaming, direitos autorais, bloqueios e páginas que exigem login.

O caminho seguro para o MVP seria:

- Vídeo enviado pelo usuário.
- Link direto para MP4.
- Fontes previamente suportadas por conectores específicos.
- Posteriormente, YouTube e outros provedores.

---

## 4. Arquitetura recomendada

```text
┌──────────────────────────────┐
│ Interface Web / Bot / API    │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ API de Projetos              │
│ Autenticação e configurações │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Orquestrador de Workflow     │
│ Fila, estados e tentativas   │
└───────┬────────┬────────┬────┘
        ↓        ↓        ↓
   Extração   Análise   Mídias
        ↓        ↓        ↓
     Texto   Storyboard  Imagens/clipes
        └────────┬────────┘
                 ↓
          Áudio e legendas
                 ↓
             Renderizador
                 ↓
          Verificador de vídeo
                 ↓
          MP4 + projeto editável
```

### Componentes principais

#### Interface

Recomendação:

- Next.js ou React.
- Upload por arrastar e soltar.
- Campo para colar link.
- Visualização do resumo.
- Editor de roteiro.
- Storyboard em cartões.
- Prévia do vídeo.
- Botão para regenerar somente uma cena.

#### API e orquestração

Recomendação para o seu ambiente:

- Node.js com TypeScript.
- Fastify ou NestJS.
- BullMQ com Redis para o MVP.
- Temporal futuramente, caso os fluxos fiquem muito longos e complexos.

A aplicação não deve depender de uma requisição HTTP aberta durante todo o processamento. Cada geração deve virar um **job persistente**.

#### Armazenamento

- PostgreSQL para projetos, cenas, versões e estados.
- S3 ou MinIO para documentos, imagens, áudio e vídeos.
- Redis para filas e cache.
- URLs temporárias assinadas para acesso aos arquivos.

#### Workers especializados

Os processos pesados devem ficar em workers separados:

- `worker-ingest`
- `worker-extract`
- `worker-transcribe`
- `worker-analyze`
- `worker-assets`
- `worker-audio`
- `worker-render`
- `worker-qa`

Isso permite repetir somente a parte que falhou.

---

## 5. Pipeline detalhado

### Etapa 1 — Criação do projeto

O sistema cria um projeto contendo:

- Fonte.
- Objetivo do vídeo.
- Público.
- Duração-alvo e faixa de tolerância.
- Formato.
- Idioma.
- Tom de voz.
- Marca.
- Chamada para ação.
- Preferências de apresentador ou narração.

Exemplo:

```json
{
  "mode": "authority",
  "language": "pt-BR",
  "aspect_ratio": "9:16",
  "target_duration_ms": 60000,
  "min_duration_ms": 42000,
  "max_duration_ms": 78000,
  "tone": "direto, inteligente e acessível",
  "audience": "profissionais interessados em inteligência artificial",
  "brand_kit_id": "inema-default"
}
```

### Etapa 2 — Ingestão segura

O sistema:

1. Detecta se é link ou arquivo.
2. Verifica tamanho e tipo real do arquivo.
3. Calcula um hash do conteúdo.
4. Salva o original.
5. Bloqueia URLs internas ou perigosas.
6. Cria um registro de procedência.

O hash é importante para não processar duas vezes o mesmo documento.

Também é necessário proteger o sistema contra:

- SSRF.
- Arquivos maliciosos.
- URLs apontando para redes privadas.
- Redirecionamentos infinitos.
- Downloads enormes.
- Páginas contendo instruções maliciosas para a IA.

O conteúdo da fonte deve ser tratado como **informação não confiável**, nunca como instrução para o agente.

### Etapa 3 — Extração

#### Para páginas web

O sistema pode usar:

- Playwright para carregar páginas dinâmicas.
- Mozilla Readability para identificar o texto principal.
- Open Graph para título, descrição e imagem.
- Seletores DOM para identificar figuras, gráficos e vídeos.
- Capturas específicas de elementos, em vez de apenas screenshots da página inteira.

Devem ser coletados:

- Título.
- Autor.
- Data.
- Texto principal.
- Subtítulos.
- Imagens.
- Legendas das imagens.
- URLs de mídia.
- Imagem destacada.
- Vídeos incorporados.
- Metadados da fonte.

#### Para PDF

- PyMuPDF ou PDFium para texto e imagens.
- Renderização das páginas importantes.
- OCR apenas em páginas sem texto pesquisável.
- Detecção de gráficos, tabelas e figuras.

#### Para DOCX e PPTX

- Extração do texto estruturado.
- Extração das imagens embutidas.
- Renderização de páginas ou slides quando necessário.

#### Para vídeos

- FFprobe para metadados.
- FFmpeg para quadros e cortes.
- Whisper para transcrição com timestamps.
- Detecção de mudança de cena.
- Criação de miniaturas para cada trecho.

### Etapa 4 — Normalização e fundamentação

Todo o conteúdo deve ser convertido para um modelo comum:

```text
Documento
 ├── Bloco 1
 ├── Bloco 2
 ├── Bloco 3
 ├── Imagem 1
 ├── Imagem 2
 ├── Vídeo 1
 └── Metadados
```

Cada bloco recebe:

- Identificador.
- Texto.
- Posição na fonte.
- Página ou URL.
- Tipo.
- Importância.
- Embedding opcional.

A IA não deve simplesmente resumir o texto inteiro. Primeiro, ela deve produzir uma **ficha factual**:

- Qual é o assunto?
- Qual é a ideia central?
- Quais são os fatos principais?
- Quais são os argumentos?
- Quais números ou datas aparecem?
- O que é opinião?
- O que não está comprovado?
- Que elementos visuais existem?

Isso reduz alucinação.

---

## 6. Processo editorial

A análise pode ser dividida em quatro papéis lógicos.

### Analista

Extrai fatos, argumentos e ideias.

### Editor

Escolhe o melhor ângulo para o público.

### Roteirista

Produz:

- Gancho inicial.
- Desenvolvimento.
- Conclusão.
- Chamada para ação.

### Diretor visual

Transforma cada parte do roteiro em uma cena.

Uma quinta etapa, o **verificador**, compara o roteiro com a fonte antes de iniciar gerações caras.

---

## 7. Os três modos de vídeo

### Alcance

Objetivo: parar o usuário no feed.

```text
0–5s: gancho forte
5–16s: problema ou fato surpreendente
16–39s: explicação rápida
39–53s: consequência
53–60s: pergunta ou chamada
```

### Autoridade

Objetivo: demonstrar conhecimento.

```text
0–5s: tese
5–16s: contexto
16–43s: três pontos principais
43–54s: interpretação
54–60s: conclusão
```

### Promocional

Objetivo: levar o usuário para uma ação.

```text
0–5s: problema
5–18s: consequência
18–36s: solução
36–49s: diferencial
49–60s: oferta e chamada
```

Essas marcações representam o ritmo de uma versão-alvo de 60 segundos. Para vídeos entre 42 e 78 segundos, os blocos devem ser ajustados proporcionalmente, preservando o gancho e a chamada para ação.

A mesma fonte pode gerar os três roteiros, reaproveitando a análise e os recursos extraídos.

---

## 8. Storyboard como contrato central

O sistema nunca deveria passar diretamente do resumo para o MP4.

Ele deve criar algo semelhante a:

```json
{
  "title": "A mudança que quase ninguém percebeu",
  "target_duration_ms": 60000,
  "min_duration_ms": 42000,
  "max_duration_ms": 78000,
  "narration_text": "Texto completo da narração...",
  "scenes": [
    {
      "id": "scene-01",
      "purpose": "hook",
      "duration_ms": 4200,
      "voiceover": "A inteligência artificial acabou de ultrapassar uma nova barreira.",
      "source_chunk_ids": ["chunk-12"],
      "overlay_text": "UMA NOVA BARREIRA",
      "visual": {
        "preferred_strategy": "source_video",
        "asset_id": "video-03",
        "start_ms": 18300,
        "end_ms": 22500,
        "fallback_strategy": "generated_image",
        "fallback_prompt": "Visual cinematográfico representando..."
      },
      "transition": "cut"
    }
  ]
}
```

Cada cena deve conter:

- Tempo.
- Narração.
- Texto na tela.
- Referência ao conteúdo original.
- Tipo de visual.
- Mídia escolhida.
- Alternativa caso a mídia falhe.
- Movimento de câmera.
- Transição.
- Estilo de legenda.

Isso permite:

- Trocar uma imagem sem refazer o roteiro.
- Alterar a narração sem reprocessar o documento.
- Gerar novamente apenas uma cena.
- Criar versões 9:16 e 16:9 usando o mesmo projeto.
- Reproduzir exatamente um vídeo antigo.

---

## 9. Seleção de imagens e vídeos

Para cada cena, o sistema deve procurar recursos nesta ordem:

1. Trecho de vídeo da própria fonte.
2. Imagem original da fonte.
3. Gráfico, figura ou slide extraído.
4. Captura de uma parte específica da página.
5. Quadro retirado de um vídeo.
6. Imagem de biblioteca autorizada.
7. Imagem gerada por IA.
8. Cena gráfica usando textos, formas e identidade visual.

Cada candidato recebe uma pontuação:

```text
Pontuação =
  relevância semântica
+ qualidade visual
+ resolução
+ compatibilidade com o formato
+ procedência e autorização
- repetição
- presença excessiva de texto
- baixa qualidade
```

O sistema deve evitar colocar a mesma imagem em várias cenas apenas porque ela foi a primeira encontrada.

### Uso de vídeo da fonte

Para selecionar um trecho:

1. Transcrever o vídeo.
2. Dividir em cenas.
3. Relacionar cada cena à transcrição.
4. Criar embeddings dos trechos.
5. Comparar o conceito do storyboard com os clipes.
6. Selecionar um trecho entre aproximadamente 2 e 6 segundos.
7. Recortar e adaptar para 9:16 ou 16:9.
8. Remover o áudio original, salvo quando ele fizer parte da história.

Quando o vídeo mostrar uma pessoa falando algo diferente da narração, deve-se evitar close no rosto para não criar uma falsa impressão de sincronização labial.

---

## 10. Geração de imagens

A imagem gerada deve ser apenas uma estratégia de fallback ou uma escolha editorial consciente.

O projeto deve possuir uma **bíblia visual**:

- Estilo.
- Iluminação.
- Paleta.
- Nível de realismo.
- Tipos de enquadramento.
- Personagens.
- Vestimentas.
- Marca.
- Elementos proibidos.

Assim, todas as imagens ficam consistentes.

Para assuntos factuais, a IA não deve inventar:

- Gráficos apresentados como verdadeiros.
- Fotografias de eventos que não aconteceram.
- Pessoas reais realizando ações não documentadas.
- Interfaces ou produtos falsos sem identificação.

Nesses casos, é melhor usar:

- Ilustração conceitual.
- Infográfico.
- Texto animado.
- Captura da fonte.
- Cena abstrata claramente editorial.

---

## 11. Narração, legendas e duração

### Padrão de voz por idioma

O idioma da fonte nunca deve escolher a voz. Quem determina a voz é o idioma de saída solicitado para o vídeo.

- Para vídeos em português brasileiro, a voz padrão é `pt-BR-FranciscaNeural`, usando `edge-tts`.
- A mesma voz deve ser mantida em todas as cenas, regenerações e versões do projeto.
- Um artigo em inglês traduzido para português continua usando a voz brasileira padrão.
- O sistema só troca a voz ou o idioma quando o usuário pedir explicitamente.
- Quando outro idioma for solicitado, deve-se escolher uma voz nativa desse idioma e mantê-la no vídeo inteiro.
- Se a voz configurada estiver indisponível, a geração deve parar e informar o problema; não deve substituir silenciosamente por uma voz estrangeira.
- `language`, `voice_provider` e `voice_id` devem ser persistidos no projeto antes da geração do primeiro áudio.

O fluxo correto é:

1. Gerar o texto.
2. Gerar o áudio.
3. Medir a duração real do áudio.
4. Ajustar o roteiro ou o ritmo.
5. Distribuir a duração entre as cenas.
6. Gerar timestamps das palavras.
7. Criar as legendas.
8. Renderizar.

Não se deve confiar apenas no número de palavras, porque vozes diferentes possuem velocidades diferentes.

Para manter o vídeo próximo de um minuto, com tolerância editorial de 30%:

- Duração-alvo: 60 segundos.
- Faixa operacional recomendada: 50 a 70 segundos.
- Faixa excepcional aceita: 42 a 78 segundos.
- Se ficar fora da faixa aceita, o sistema ajusta o roteiro e gera novamente a narração.
- Pequenos ajustes de velocidade podem ser usados, sem deixar a voz artificial.
- O CTA nunca deve ser cortado automaticamente.

A trilha musical deve ser reduzida durante a fala usando ducking.

### Área segura para manchetes

Títulos e manchetes devem ser medidos com a fonte definitiva carregada e também no ponto de maior escala da animação.

Para vídeos verticais 9:16:

- Margem lateral mínima: 7,5% do quadro.
- Margem vertical mínima: 6% do quadro.
- Largura máxima do título: 85% do quadro.
- Altura máxima recomendada do bloco: 24% do quadro.
- Se não couber, quebrar a linha por sentido, reduzir o tamanho responsivamente e, por último, compactar levemente o espaçamento entre letras.
- Nunca resolver o problema com corte, `overflow: hidden` sobre o texto ou deslocamento para fora da tela.
- Verificar início, pico e fim da animação. Um título fora da área segura deve bloquear a prévia.

Os padrões executáveis estão em `config/production-defaults.json`.

---

## 12. Renderização

Para o seu caso, eu adotaria:

- **FFmpeg** para cortes, conversões, áudio, legendas, normalização e montagem básica.
- **Remotion** para templates mais sofisticados, textos animados e layouts em React.
- Renderização dentro de Docker com versões fixadas.

Como já houve problemas com Chromium e Playwright no Ubuntu 26.04, eu não deixaria o renderizador depender diretamente dos pacotes do sistema operacional.

### MVP mais robusto

FFmpeg como renderizador principal, sem depender de navegador.

### Versão visual avançada

Remotion dentro de uma imagem Docker própria, com Chrome e dependências fixadas.

Assim, uma atualização da VPS não quebra toda a produção.

---

## 13. Stack recomendada

| Área | Tecnologia recomendada |
|---|---|
| Interface | Next.js + React |
| API | Node.js + TypeScript + Fastify ou NestJS |
| Workflow inicial | BullMQ + Redis |
| Banco | PostgreSQL |
| Arquivos | MinIO ou S3 |
| Página web | Playwright + Readability |
| PDF | PyMuPDF/PDFium |
| Documentos | Parsers específicos ou Apache Tika |
| Transcrição | Whisper local ou API |
| Processamento audiovisual | FFmpeg + FFprobe |
| Detecção de cenas | FFmpeg ou PySceneDetect |
| Render básico | FFmpeg |
| Render avançado | Remotion em Docker |
| IA de análise | Adaptador Ollama/OpenAI/Anthropic/OpenRouter |
| Imagem | Adaptadores para modelo local ou APIs |
| Voz | Adaptadores para TTS local ou APIs |
| Observabilidade | Logs estruturados + métricas por etapa |

---

## 14. Estratégia de modelos

O sistema não deve ficar preso a um único fornecedor.

```typescript
interface LLMProvider {
  analyzeDocument(input: AnalysisInput): Promise<AnalysisResult>;
  createScript(input: ScriptInput): Promise<ScriptResult>;
  verifyScript(input: VerificationInput): Promise<VerificationResult>;
}

interface ImageProvider {
  generate(input: ImageGenerationInput): Promise<GeneratedAsset>;
}

interface TTSProvider {
  synthesize(input: TTSInput): Promise<AudioAsset>;
}
```

Uma boa distribuição seria:

- Qwen/Ollama local para classificação, divisão e resumos iniciais.
- Modelo mais forte apenas para roteiro, direção editorial e verificação.
- Whisper local para transcrição.
- Geração de imagens local no DGX quando houver modelo adequado.
- API como fallback para tarefas em que a qualidade local não for suficiente.

Isso reduz custo sem sacrificar as decisões criativas importantes.

---

## 15. Controle de custos e repetição de trabalho

Cada etapa precisa salvar seu resultado:

```text
INGESTED
EXTRACTED
ANALYZED
SCRIPTED
STORYBOARDED
ASSETS_RESOLVED
AUDIO_CREATED
PREVIEW_RENDERED
VERIFIED
FINAL_RENDERED
```

Cada resultado recebe uma chave baseada em:

```text
hash(
  entrada
  + configurações
  + versão do prompt
  + modelo
  + versão do código
)
```

Assim:

- Alterar a legenda não refaz a transcrição.
- Alterar uma cena não refaz todas as imagens.
- Falha no render não refaz o roteiro.
- Falha na imagem 7 não regenera as imagens 1 a 6.
- Um documento já processado pode reutilizar a extração.
- Uma nova versão 16:9 reutiliza análise, roteiro e mídias.

A aplicação deve renderizar primeiro uma prévia em menor resolução. O vídeo final só é produzido após aprovação ou validação.

Isso evita gastar recursos gerando um vídeo 1080p que será descartado.

---

## 16. Organização do projeto

```text
content2video/
├── apps/
│   ├── web/
│   └── api/
├── workers/
│   ├── ingest/
│   ├── extract/
│   ├── transcribe/
│   ├── analyze/
│   ├── assets/
│   ├── audio/
│   ├── render/
│   └── verify/
├── packages/
│   ├── contracts/
│   ├── database/
│   ├── storage/
│   ├── providers/
│   ├── prompts/
│   └── media-utils/
├── templates/
│   ├── authority/
│   ├── reach/
│   └── promotional/
├── docker/
└── tests/
```

O pacote `contracts` deve conter os schemas versionados de:

- Projeto.
- Documento extraído.
- Análise.
- Roteiro.
- Storyboard.
- Cena.
- Mídia.
- Render.
- Erro.

---

## 17. Implementação em etapas

### Primeira entrega: documento para vídeo com imagens

Escopo:

- Link de artigo.
- PDF.
- DOCX.
- Texto.
- Extração de imagens.
- Captura de partes da página.
- Resumo.
- Roteiro.
- Storyboard.
- Narração.
- Legendas.
- Vídeo vertical.
- Imagem gerada quando não houver visual adequado.
- Prévia e exportação.

Ainda sem tentar capturar vídeos complexos da internet.

Essa entrega já produz um produto utilizável.

### Segunda entrega: uso de vídeos existentes

Adicionar:

- Upload de MP4.
- Link direto de vídeo.
- Transcrição com timestamps.
- Detecção de cenas.
- Busca semântica de clipes.
- Recorte automático.
- Enquadramento vertical.
- Combinação de clipes e imagens.

### Terceira entrega: produto editorial completo

Adicionar:

- Modos Alcance, Autoridade e Promocional.
- Três versões a partir da mesma fonte.
- Editor de storyboard.
- Regeneração por cena.
- Biblioteca de templates.
- Kit de marca.
- Múltiplas vozes.
- Múltiplos formatos.
- Histórico de versões.
- Controle de custo por projeto.

### Quarta entrega: produção em escala

Adicionar:

- Processamento em lote.
- Criação de vários vídeos por documento.
- Variações de gancho.
- Testes A/B.
- Integração com bot.
- API pública.
- Agendamento.
- Aprovação em equipe.
- Distribuição para redes sociais.

---

## 18. Critérios de aceitação do MVP

O MVP estará funcional quando conseguir:

1. Receber um link público, PDF ou DOCX.
2. Extrair corretamente a ideia central.
3. Produzir um roteiro fundamentado na fonte.
4. Criar um storyboard editável.
5. Usar imagens da fonte sempre que possível.
6. Gerar imagens somente quando necessário.
7. Produzir narração e legendas sincronizadas.
8. Criar um vídeo com duração-alvo de 60 segundos e duração final entre 42 e 78 segundos.
9. Exportar MP4 em 9:16.
10. Refazer uma cena sem repetir todo o processamento.
11. Mostrar quais mídias foram extraídas, geradas ou enviadas.
12. Registrar custo, duração e erro de cada etapa.
13. Usar uma cena gráfica de fallback quando nenhuma mídia funcionar.
14. Impedir que instruções encontradas no documento controlem os agentes.

---

## 19. Casos que devem fazer parte dos testes

A aplicação deve ser testada com:

- Artigo simples.
- Página carregada por JavaScript.
- Página com muitas imagens.
- Página sem imagens.
- PDF com texto.
- PDF escaneado.
- PDF com gráficos.
- DOCX com imagens.
- PPTX.
- Documento muito longo.
- MP4 curto.
- MP4 longo.
- Vídeo sem fala.
- Vídeo com música.
- Fonte inacessível.
- Página com paywall.
- Arquivo corrompido.
- Conteúdo que tenta dar instruções à IA.
- Imagens horizontais para vídeo vertical.
- Narração abaixo de 42 segundos ou acima de 78 segundos.
- Artigo em inglês com vídeo final em português, confirmando o uso da voz brasileira padrão.
- Regeneração parcial de cenas, confirmando que a voz não muda.
- Manchete curta, longa e com palavra sem quebra, validada no pico da animação em 9:16.
- Fonte carregada com atraso, confirmando que o encaixe é recalculado após `document.fonts.ready`.

---

## 20. Riscos principais

### Direitos autorais

O sistema deve registrar:

- Origem de cada mídia.
- URL.
- Data da captura.
- Tipo de uso.
- Se foi enviada pelo usuário.
- Se foi gerada.
- Se há autorização conhecida.

Não deve tentar quebrar DRM ou proteções de streaming.

### Alucinação

Cada afirmação do roteiro deve estar ligada a um ou mais blocos da fonte. O verificador deve rejeitar afirmações sem sustentação.

### Bloqueios de páginas

O sistema deve possuir fallback:

- Tentar leitura simples.
- Tentar navegador.
- Pedir o documento ao usuário.
- Usar somente os metadados disponíveis.
- Nunca tentar contornar autenticação ou paywall.

### Mídia de baixa qualidade

Fallbacks:

- Recorte inteligente.
- Fundo desfocado.
- Movimento leve.
- Composição gráfica.
- Imagem gerada.
- Tela com texto e marca.

### Falhas caras

O workflow deve possuir checkpoints e repetição por etapa. Nunca reiniciar automaticamente todo o projeto.

---

## 21. Como encaixar no ecossistema INEMA

Criaria um serviço independente chamado provisoriamente:

```text
content2video-engine
```

ou:

```text
inema-content-video
```

O bot não deveria conter toda a lógica. Ele apenas faria:

```text
/criarvideo <link>
```

Depois:

1. Envia o projeto para a API.
2. Recebe o identificador.
3. Mostra o progresso.
4. Entrega a prévia.
5. Permite aprovar ou alterar.
6. Retorna o vídeo final.

O motor poderia ser utilizado por:

- `musicavideo.inema.club`
- `inemaccvbot`
- INEMA.PRO
- Automação por Telegram
- Painel web
- API externa

Se os serviços atuais de vídeo já estiverem bem separados, o novo motor pode reutilizá-los. Mas a extração, análise, storyboard e controle de jobs devem continuar em uma camada própria.

---

## Recomendação final

O menor caminho seguro e útil é:

> **Começar com página/PDF/DOCX → roteiro → storyboard → imagens extraídas ou geradas → narração → legendas → vídeo vertical.**

Somente depois adicionar a captura e seleção automática de trechos de vídeos externos.

A base de tudo deve ser:

1. **Storyboard JSON versionado.**
2. **Workflow com checkpoints.**
3. **Procedência de cada informação e mídia.**
4. **Renderização independente da IA.**
5. **Regeneração somente da parte alterada.**
6. **Adaptadores para trocar modelos e fornecedores.**

Essa arquitetura permite começar simples, mas já deixa preparado o caminho para uma verdadeira **máquina de transformar qualquer conteúdo em vídeos de alcance, autoridade e venda**.

**Avaliação geral do plano:** 8/10.  
**Confiança na arquitetura:** alta.  
**Maior área de risco:** captura genérica de vídeos de plataformas externas, por limitações técnicas, jurídicas e de acesso.  
**Primeira ação recomendada:** definir e implementar o schema do `Project`, `Analysis`, `Storyboard`, `Scene` e `Asset` antes de escrever os agentes ou o renderizador.
