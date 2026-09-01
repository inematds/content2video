---
format: 1080x1920
fps: 30
duration: 60s
message: "WebMCP transforma páginas que agentes precisam interpretar em ferramentas estruturadas que eles podem executar."
arc: "Friction → Reframe → Contrast → Mechanism → Complement → Implementation → Practical next step"
audience: "profissionais de marketing, produto, growth e tecnologia"
mode: autonomous
language: pt-BR
voice_provider: edge-tts
voice_id: pt-BR-FranciscaNeural
music: none
captions: true
---

## Video direction

- Palette: papel creme `#FAF9F5`, tinta `#141413`, superfícies técnicas em navy quente `#181715` e coral `#CC785C` usado uma única vez por quadro.
- Tipografia: EB Garamond em sentence case para manchetes; Inter para explicação; JetBrains Mono para índices, labels e código.
- Motion grammar: objetos entram quando a narração os nomeia; cada cena tem uma transformação causal clara e termina em hold legível. Movimento primário em push horizontal, morph de interface e desenho de conectores.
- Persistent stage: do frame 3 ao 6, a mesma página vertical evolui de interface visual para camada estruturada, fluxo de chamada, comparação de protocolos e implementação.
- Safe area: manchetes dentro de 7,5% nas laterais e 6% na vertical, com largura máxima de 85% e bloco máximo de 24%; medir depois de `document.fonts.ready` no início, pico e fim. Conteúdo essencial fica acima da faixa inferior de 17% reservada às legendas.
- Reveal model: uma ideia dominante por frame; no máximo quatro grupos concorrentes. Os detalhes técnicos surgem como consequência da ação anterior, nunca todos no primeiro instante.
- Negative list: sem cérebro neon, partículas de “IA”, robôs humanoides, glows, gradientes genéricos, dashboards aleatórios, estatísticas não verificadas ou reprodução literal da página do artigo.

## Frame 1 — Uma página não é uma API

- scene: Um agente tenta operar uma interface visual; a página se afasta e revela a distância entre “ver” e “executar”.
- voiceover: "Hoje, um agente de IA olha para muitos sites como quem tenta entender uma máquina por uma fotografia: ele vê botões, mas precisa adivinhar como agir."
- duration: 9.024s
- poster: 6.2s
- transition_in: cut
- status: animated
- src: compositions/frames/01-fotografia.html
- type: hook
- persuasion: Pain validation + visceral metaphor
- beat: fricção → curiosidade
- blueprint: kinetic-type-beats (Adapt)
- asset_candidates: none — construção editorial em HTML/CSS
- focal: página vertical esquemática com cursor hesitante
- roles: página = objeto-problema; cursor = agente; fotografia = metáfora tipográfica

narrativeRole: Torna concreta a limitação de interfaces feitas apenas para olhos e cliques humanos.
keyMessage: Ver uma página não equivale a saber operá-la com segurança.

Adapt: usa batidas tipográficas como diagnóstico progressivo, com a interface persistente no centro.
Scene 1 (0.0–1.8s): a página entra como card alto no papel creme; três controles aparecem sem rótulo técnico e um cursor percorre pequenas distâncias, sem clicar.
Scene 2 (1.8–4.8s): “VÊ BOTÕES” surge no alto enquanto caixas de detecção contornam a interface; o cursor tenta caminhos diferentes, sempre retornando ao ponto inicial.
Scene 3 (4.8–7.0s): a página comprime dentro de uma moldura fotográfica e “MAS PRECISA ADIVINHAR” substitui a primeira frase por morph de texto.
Scene 4 (7.0–8.4s): a fotografia fica imóvel; uma linha coral curta pergunta “e se a página explicasse como agir?” e segura para leitura.

## Frame 2 — A página declara ferramentas

- scene: A moldura do frame anterior abre e a página passa a emitir uma ferramenta nomeada, descrita e estruturada.
- voiceover: "WebMCP muda essa relação. A própria página pode declarar ferramentas, com nome, descrição e campos estruturados, para o agente descobrir e chamar."
- duration: 8.64s
- poster: 6.0s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/02-declarar.html
- type: thesis
- persuasion: Category reframing
- beat: revelação + clareza
- blueprint: titlecard-reveal (Adapt)
- asset_candidates: none — ícones SVG e interface CSS locais
- focal: tool card `buscar_produto`
- roles: página = origem; tool card = novo contrato; três labels = estrutura

narrativeRole: Entrega a tese e nomeia o mecanismo até o segundo beat.
keyMessage: WebMCP permite que a página publique ações compreensíveis por agentes.

Adapt: o título se resolve em uma interface útil, em vez de permanecer como cartela estática.
Scene 1 (0.0–1.5s): “WebMCP” ocupa o centro em EB Garamond; a moldura fotográfica do frame anterior se abre atrás do título.
Scene 2 (1.5–4.2s): uma ferramenta `buscar_produto` desliza para fora da página; “NOME”, “DESCRIÇÃO” e “CAMPOS” surgem, um por cue da voz.
Scene 3 (4.2–7.0s): os três labels encaixam em um schema compacto; uma seta liga “PÁGINA” a “AGENTE” com a ferramenta no meio.
Scene 4 (7.0–8.5s): “DESCOBRIR → CHAMAR” substitui o diagrama e segura, sem movimento ambiente.

## Frame 3 — De tentativa a chamada

- scene: A mesma página mostra o antes e o depois: interpretação por pixels versus chamada estruturada.
- voiceover: "Em vez de procurar elementos, tirar screenshots e simular cliques, o agente recebe uma ação explícita, envia argumentos e obtém um resultado previsível."
- duration: 8.544s
- poster: 6.4s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-contraste.html
- type: comparison
- persuasion: Contrast + friction reduction
- beat: compreensão + alívio
- blueprint: comparison-split (Reproduce)
- asset_candidates: none — comparação vetorial construída localmente
- focal: divisão `INTERPRETAR` versus `CHAMAR`
- roles: lado esquerdo = processo frágil; lado direito = ferramenta estruturada

narrativeRole: Faz a vantagem operacional ser entendida sem prometer autonomia irrestrita.
keyMessage: A ação estruturada substitui inferência visual por uma chamada explícita.

Scene 1 (0.0–2.0s): o quadro divide em duas colunas; à esquerda, boxes de visão e cursor; à direita, um card vazio `tool()`.
Scene 2 (2.0–5.2s): “SCREENSHOT”, “PROCURAR” e “CLICAR” empilham à esquerda em percurso quebrado; o cursor salta entre alvos.
Scene 3 (5.2–7.4s): à direita, `{ termo: "tênis" }` entra no card e produz `{ resultados: 12 }`; uma única linha direta conecta entrada e saída.
Scene 4 (7.4–8.7s): a coluna esquerda perde contraste; “AÇÃO EXPLÍCITA” domina a direita e segura.

## Frame 4 — A chamada acontece na aba

- scene: Usuário, agente, navegador e página formam um circuito; a resposta retorna sem perder o contexto da sessão.
- voiceover: "Tudo acontece no contexto real da aba: usuário, agente, navegador e aplicação compartilham sessão, estado e controles, inclusive com confirmação humana quando necessário."
- duration: 9.336s
- poster: 6.5s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/04-circuito.html
- type: mechanism
- persuasion: Mechanism + trust
- beat: fluidez + segurança
- blueprint: constellation-hub (Adapt)
- asset_candidates: none — diagrama SVG local
- focal: navegador como hub do circuito
- roles: usuário = intenção; agente = decisão; navegador = contexto; página = execução

narrativeRole: Explica onde o WebMCP opera e introduz segurança sem interromper a narrativa.
keyMessage: A execução usa o contexto da sessão e pode manter o humano no circuito.

Adapt: transforma a constelação em fluxo dirigido; cada ligação é desenhada somente quando seu ator é nomeado.
Scene 1 (0.0–1.7s): a página do frame 3 reduz e ocupa o centro como “NAVEGADOR”; os outros três nós ainda estão vazios.
Scene 2 (1.7–5.2s): “USUÁRIO”, “AGENTE” e “APLICAÇÃO” surgem em sequência; conectores desenham um circuito no sentido horário.
Scene 3 (5.2–7.4s): chips “SESSÃO” e “ESTADO” atravessam o centro; a ferramenta retorna um resultado ao agente.
Scene 4 (7.4–9.0s): um selo “CONFIRMAR?” interrompe o circuito, recebe um check humano e libera a última conexão; hold estático.

## Frame 5 — Complemento, não substituição

- scene: MCP e WebMCP ocupam camadas complementares e se encaixam entre servidor e experiência na página.
- voiceover: "Ele não substitui o MCP tradicional. O MCP conecta agentes a serviços de backend; o WebMCP expõe as capacidades presentes na experiência web aberta no navegador."
- duration: 10.104s
- poster: 6.0s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-complemento.html
- type: clarification
- persuasion: Objection handling
- beat: distinção + encaixe
- blueprint: comparison-split (Adapt)
- asset_candidates: none — diagrama em duas camadas
- focal: encaixe vertical BACKEND + ABA
- roles: MCP = infraestrutura; WebMCP = experiência da página; agente = consumidor comum

narrativeRole: Evita o principal mal-entendido conceitual do artigo.
keyMessage: MCP e WebMCP operam em camadas diferentes e complementares.

Adapt: a divisão não cria vencedores; os dois lados terminam formando uma única pilha.
Scene 1 (0.0–2.0s): “MCP” e “WebMCP” aparecem em duas metades equivalentes, separados por uma regra fina.
Scene 2 (2.0–4.8s): “SERVIÇOS DE BACKEND” cresce sob MCP; servidores simplificados conectam ao agente.
Scene 3 (4.8–7.0s): “EXPERIÊNCIA NA ABA” cresce sob WebMCP; a página persistente conecta ao mesmo agente.
Scene 4 (7.0–8.6s): as metades empilham como camadas; a frase “COMPLEMENTARES” surge no encaixe e segura.

## Frame 6 — Duas formas de expor uma ação

- scene: Uma janela de código e um formulário demonstram as APIs imperativa e declarativa.
- voiceover: "Há duas portas de entrada: uma API imperativa em JavaScript para ações mais dinâmicas, e uma API declarativa que transforma formulários HTML em ferramentas."
- duration: 9.312s
- poster: 6.3s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/06-duas-apis.html
- type: implementation
- persuasion: Specificity + feasibility
- beat: técnica + aplicabilidade
- blueprint: grid-card-assemble (Adapt)
- asset_candidates: none — código e formulário reconstruídos localmente
- focal: par `JavaScript` e `HTML form`
- roles: card imperativo = registro por código; card declarativo = formulário descrito

narrativeRole: Converte o conceito em uma escolha de implementação compreensível.
keyMessage: WebMCP prevê APIs imperativa e declarativa.

Adapt: usa dois cards que se montam como alternativas, sem inventar uma grade maior.
Scene 1 (0.0–1.6s): o título “DUAS PORTAS” entra no alto; duas bases vazias ocupam o centro.
Scene 2 (1.6–4.8s): o card “IMPERATIVA” revela um snippet `registerTool(...)` com type-on curto; label “JAVASCRIPT” entra abaixo.
Scene 3 (4.8–7.3s): o card “DECLARATIVA” monta campos de formulário e o atributo `toolname`; label “HTML” entra no cue da voz.
Scene 4 (7.3–8.8s): os cards se alinham lado a lado e um brace comum os nomeia “FERRAMENTAS”; hold imóvel.

## Frame 7 — Comece pelo fluxo certo

- scene: Um formulário realista recebe uma camada de ferramenta; a composição fecha lembrando que a tecnologia ainda é experimental.
- voiceover: "A proposta ainda é experimental. O melhor começo é um fluxo claro e repetitivo, como buscar, filtrar ou enviar um formulário. Primeiro, torne a página encontrável. Depois, executável."
- duration: 10.584s
- poster: 6.7s
- transition_in: blur-crossfade
- status: animated
- src: compositions/frames/07-comecar.html
- type: closer
- persuasion: Practical next step + calibrated urgency
- beat: cautela → ação
- blueprint: cta-morph-press (Adapt)
- asset_candidates: none — formulário editorial em HTML/CSS
- focal: transformação `ENCONTRÁVEL` → `EXECUTÁVEL`
- roles: formulário = primeiro caso de uso; selo experimental = cautela; CTA = próximo passo

narrativeRole: Fecha com um próximo passo útil sem apresentar a proposta como padrão finalizado.
keyMessage: Vale experimentar WebMCP em fluxos simples, repetitivos e bem delimitados.

Adapt: o CTA nasce da transformação do próprio formulário, não de um botão promocional isolado.
Scene 1 (0.0–2.0s): selo mono “PROPOSTA EXPERIMENTAL” aparece; um formulário de busca simples entra abaixo, já preenchido.
Scene 2 (2.0–5.4s): “BUSCAR”, “FILTRAR” e “ENVIAR” alternam dentro do mesmo slot enquanto a camada `tool` contorna o formulário.
Scene 3 (5.4–7.2s): “ENCONTRÁVEL” ocupa o centro; a palavra comprime e uma seta coral atravessa a linha.
Scene 4 (7.2–8.9s): a palavra resolve em “EXECUTÁVEL”; abaixo, “COMECE POR UM FLUXO CLARO” segura até o corte final.
