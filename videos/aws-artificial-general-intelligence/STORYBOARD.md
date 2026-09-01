---
format: 1080x1920
fps: 30
duration: 60s
message: "AGI não é apenas uma IA mais poderosa: é a hipótese de uma inteligência capaz de aprender e transferir conhecimento entre domínios."
arc: "concept-explainer · Reframe → Contrast → Cognitive stack → Research paths → Building blocks → Barriers → Distillation"
audience: "pessoas interessadas em tecnologia, negócios e inteligência artificial"
mode: autonomous
language: pt-BR
voice_provider: edge-tts
voice_id: pt-BR-FranciscaNeural
music: none
captions: true
---

## Video direction

- Palette: papel quente `#FAF9F5` como chão, tinta `#141413` para a voz, superfícies `#EFE9DE` para módulos, navy `#181715` apenas para profundidade técnica e coral `#CC785C` como um único pulso de tensão por quadro.
- Tipografia: display editorial em sentence case, corpo sans limpo e labels mono; títulos curtos, sem caixa alta serifada. A primeira leitura de cada frame deve sobreviver sem os detalhes técnicos.
- Motion grammar: reveals sequenciais guiados pela voz, com long-tail settle e `power3` como padrão; cada objeto aparece quando é nomeado. Nada é despejado no primeiro quarto da cena. Cortes internos usam direção e velocidade compatíveis.
- Rhythm: frames 1 e 2 fazem o reframe; frames 3 a 6 constroem o mesmo “mapa da generalidade” por integração, caminhos, peças e barreiras; frame 7 é o breather deliberado, com a maior área de hold imóvel.
- Persistent stage: uma linha coral de transferência nasce no hook, atravessa os diagramas dos frames 2 a 6 e termina como a lacuna do círculo no frame 7.
- Safe area: toda manchete fica dentro de 7,5% nas laterais e 6% na vertical, largura máxima de 85% e bloco máximo recomendado de 24%; medir depois de `document.fonts.ready` no início, pico e fim. Conteúdo essencial termina acima da faixa inferior de 17% reservada às legendas.
- Hold policy: após a última revelação, o quadro segura imóvel; no máximo jitter quase imperceptível em um único elemento. Sem breathing, sem drift de câmera na metade final.
- Negative list: sem cérebro neon, robô humanoide, olhos digitais, partículas aleatórias, gradientes roxo-azul, interfaces genéricas, números inventados, slideshow com entrada precoce ou screensaver com elementos flutuando sem função.

## Frame 1 — O salto não é responder melhor

- scene: A mesma pergunta atravessa três domínios; uma resposta especializada trava, enquanto a ideia de transferência continua.
- voiceover: "O salto para uma inteligência geral não é responder melhor. É aprender algo aqui — e conseguir usar esse conhecimento em outro lugar."
- duration: 6.912s
- poster: 5.8s
- transition_in: cut
- status: animated
- src: compositions/frames/01-o-salto.html
- type: hook
- persuasion: Counterintuitive claim + transfer metaphor
- beat: surpresa + curiosidade
- blueprint: compose
- focal: a troca tipográfica `MELHOR` → `EM OUTRO LUGAR`
- roles: frase fixa = foreground subject; cartões LINGUAGEM, VISÃO e AÇÃO = supporting; linha coral = caminho de transferência; papel com índice mono = background

narrativeRole: Abre a lacuna cognitiva com a diferença que realmente importa: transferência, não potência.
keyMessage: Generalidade significa levar aprendizado de um domínio para outro.

Compose: constrói o hook com troca tipográfica, revelação por palavras e desenho do caminho de transferência.
Scene 1 (0.0–1.6s): no terço superior, “O salto não é” entra por per-word staggered reveal (`dynamic-content-sequencing`); abaixo, apenas o cartão LINGUAGEM existe. Framing rule-of-thirds, três camadas, câmera fixa.
Scene 2 (1.6–3.3s): “RESPONDER MELHOR” ocupa 70% da largura e substitui a frase por hard-cut word-swap (`discrete-text-sequence`); um pequeno medidor cresce e trava no mesmo domínio.
Scene 3 (3.3–5.6s): no cue “aprender algo aqui”, a palavra APRENDER permanece fixa; a linha coral desenha de LINGUAGEM para VISÃO e depois AÇÃO (`svg-path-draw`), enquanto os cartões entram um por vez na metade posterior.
Scene 4 (5.6–6.912s): “EM OUTRO LUGAR” resolve em display no alto, com os três cartões conectados abaixo; a linha termina e tudo segura imóvel para leitura.

## Frame 2 — IA atual versus AGI

- scene: Um sistema estreito permanece preso a uma coluna; a hipótese de AGI atravessa linguagem, visão e ação no mesmo palco.
- voiceover: "A IA atual, inclusive a generativa, continua especializada. AGI é a hipótese de um sistema que aprende sozinho e resolve problemas em vários domínios."
- duration: 9.648s
- poster: 7.8s
- transition_in: blur-crossfade LEFT
- status: animated
- src: compositions/frames/02-ia-versus-agi.html
- type: product_intro
- persuasion: Comparison of two options + definition by contrast
- beat: orientação + clareza
- blueprint: comparison-split (Adapt)
- focal: pilha vertical `IA ATUAL` versus campo conectado `AGI`
- roles: painel superior = propósito específico; painel inferior = hipótese geral; linha coral = transferência; labels de domínio = supporting; chão creme = background

narrativeRole: Nomeia o conceito pelo contraste com sistemas que o público já usa.
keyMessage: IA generativa ainda é propósito específico; AGI seria generalidade entre domínios.

Adapt: mantém a entrada espelhada de dois cartões, mas converte o split horizontal em dois andares para 9:16; o gesto principal continua sendo o contraste físico entre lados equivalentes.
Scene 1 (0.0–2.0s): o painel “IA ATUAL” abre no alto por split-tilt card (`split-tilt-cards`); dentro dele, GENERATIVA encaixa em uma única coluna rotulada “ESPECIALIZADA”.
Scene 2 (2.0–4.4s): LINGUAGEM, IMAGEM e CÓDIGO aparecem como três chips no painel superior, porém cada um termina em uma borda fechada; reveals são sequenciais, não simultâneos.
Scene 3 (4.4–7.7s): o painel “AGI” sobe da base com inclinação oposta; os mesmos três chips reaparecem conectados pela linha coral e um quarto chip “NOVO DOMÍNIO” entra somente no cue final.
Scene 4 (7.7–9.648s): as inclinações assentam; “APRENDE SOZINHO” e “VÁRIOS DOMÍNIOS” surgem como dois labels de conclusão e o quadro segura imóvel.

## Frame 3 — Quatro capacidades, um sistema

- scene: Memória, aprendizado, percepção e criatividade se conectam em torno de um núcleo cognitivo que só funciona quando integrado.
- voiceover: "Para isso, não basta juntar habilidades. Memória, aprendizado, percepção e criatividade teriam de funcionar como um único sistema cognitivo integrado."
- duration: 8.328s
- poster: 7.0s
- transition_in: blur-crossfade LEFT
- status: animated
- src: compositions/frames/03-quatro-capacidades.html
- type: feature_showcase
- persuasion: Rule of four + progressive disclosure
- beat: compreensão + fascinação
- blueprint: constellation-hub (Adapt)
- focal: núcleo `SISTEMA COGNITIVO`
- roles: núcleo central = foreground subject; quatro capacidades = ring nodes; conectores = causal structure; índice mono e papel = background/supporting

narrativeRole: Converte a abstração de inteligência humana em quatro capacidades nomeadas pela fonte.
keyMessage: AGI exige integração cognitiva, não uma coleção desconectada de recursos.

Adapt: mantém o hub e os nós em anel; elimina órbita contínua e câmera push para respeitar o registro editorial, usando conexão desenhada como assinatura.
Scene 1 (0.0–1.8s): quatro cápsulas vazias ocupam um anel vertical ao redor de um centro ainda incompleto; “NÃO BASTA JUNTAR” entra no terço superior por per-word reveal.
Scene 2 (1.8–5.7s): MEMÓRIA, APRENDIZADO, PERCEPÇÃO e CRIATIVIDADE entram uma por vez com smooth spring-pop (`spring-pop-entrance`), exatamente em seus cues; nenhum conector aparece antes do quarto nome.
Scene 3 (5.7–7.3s): o centro resolve em “SISTEMA COGNITIVO”; quatro linhas se desenham até ele (`avatar-cloud-network` + `svg-path-draw`) e a linha coral percorre o circuito uma única vez.
Scene 4 (7.3–8.328s): “INTEGRADO” aparece abaixo do núcleo; todos os nós assentam e seguram imóveis.

## Frame 4 — Cinco caminhos de pesquisa

- scene: Cinco linhas teóricas entram como peças diferentes e terminam agrupadas em uma via híbrida, sem declarar uma vencedora.
- voiceover: "A pesquisa explora caminhos simbólicos, conexionistas, universalistas, corporificados e híbridos. Cada um tenta explicar uma parte diferente da inteligência."
- duration: 8.592s
- poster: 7.2s
- transition_in: blur-crossfade LEFT
- status: animated
- src: compositions/frames/04-caminhos.html
- type: feature_showcase
- persuasion: Numbered enumeration + frame-then-fill
- beat: panorama + foco
- blueprint: grid-card-assemble (Adapt)
- focal: mosaico de cinco caminhos com `HÍBRIDO` como síntese, não vencedor
- roles: cards numerados = foreground items; linha coral = fio de pesquisa; título e índice = supporting; papel e tile = background

narrativeRole: Organiza o campo teórico sem fingir consenso sobre um único caminho.
keyMessage: Há várias abordagens concorrentes e complementares para pesquisar AGI.

Adapt: mantém o assemble em cascata, mas usa um mosaico vertical assimétrico em vez de grade uniforme; a assinatura é a população progressiva dos cinco itens.
Scene 1 (0.0–1.5s): “CAMINHOS DE PESQUISA” ocupa o alto; uma régua vertical numerada estabelece cinco slots vazios, acima da faixa de legenda.
Scene 2 (1.5–3.6s): SIMBÓLICO e CONEXIONISTA entram em slots opostos com short-path stagger assemble (`center-outward-expansion`), cada qual com um glifo próprio: regra lógica e rede.
Scene 3 (3.6–5.8s): UNIVERSALISTA e CORPORIFICADO completam a coluna em cues separados; uma fórmula e uma mão sensorial aparecem como line-art local.
Scene 4 (5.8–7.4s): HÍBRIDO ocupa o slot maior; a linha coral liga apenas bordas relevantes, sem transformar o mosaico em ranking.
Scene 5 (7.4–8.592s): “PARTES DIFERENTES DA INTELIGÊNCIA” fecha a régua no terço inferior útil e o conjunto segura.

## Frame 5 — Peças não são o todo

- scene: Aprendizado profundo, IA generativa, linguagem, visão e robótica entram como módulos; o rótulo AGI permanece incompleto.
- voiceover: "Aprendizado profundo, IA generativa, linguagem, visão e robótica empurram essa pesquisa. Mas essas tecnologias são peças do quebra-cabeça — não a AGI pronta."
- duration: 10.2s
- poster: 8.8s
- transition_in: blur-crossfade LEFT
- status: animated
- src: compositions/frames/05-pecas-nao-todo.html
- type: benefit_highlight
- persuasion: Part-to-whole distinction + subtractive framing
- beat: aha + cautela
- blueprint: fixed-anchor-cycle (Adapt)
- focal: contorno fixo `AGI?` com uma lacuna central
- roles: contorno AGI = pinned anchor; cinco tecnologias = cycling region; puzzle incompleto = payoff; linha coral = supporting; superfície navy = technical background

narrativeRole: Impede o atalho comum de confundir avanços atuais com a chegada da AGI.
keyMessage: Tecnologias emergentes contribuem para a pesquisa, mas nenhuma equivale à AGI.

Adapt: mantém o anchor imóvel e faz as tecnologias mudarem ao redor; troca skins de produto por peças técnicas e preserva o resolve em um lockup incompleto.
Scene 1 (0.0–1.9s): em uma janela navy vertical, o contorno “AGI?” entra uma vez e fica preso no centro alto; zero drift e zero breathing a partir daqui.
Scene 2 (1.9–6.8s): APRENDIZADO PROFUNDO, IA GENERATIVA, LINGUAGEM, VISÃO e ROBÓTICA ocupam sucessivamente o slot abaixo do anchor por discrete state cycle (`discrete-text-sequence`); cada estado adiciona uma peça geométrica ao redor, sem tocar o centro.
Scene 3 (6.8–8.6s): no cue “peças do quebra-cabeça”, os cinco módulos assentam em círculo; a linha coral conecta o perímetro, mas uma peça central permanece vazia.
Scene 4 (8.6–10.2s): “NÃO É A AGI PRONTA” entra na lacuna como coral-callout e imediatamente retorna a tinta clara; o anchor continua imóvel e o quadro segura.

## Frame 6 — Três barreiras abertas

- scene: Três barreiras bloqueiam um caminho contínuo: transferir entre domínios, criar com emoção e perceber o mundo físico.
- voiceover: "E ainda faltam três saltos: transferir conhecimento entre domínios, reproduzir criatividade emocional e perceber o mundo físico com riqueza humana."
- duration: 8.04s
- poster: 6.9s
- transition_in: blur-crossfade LEFT
- status: animated
- src: compositions/frames/06-barreiras.html
- type: pain_point
- persuasion: Rule of three + causal bottleneck
- beat: tensão + realismo
- blueprint: spatial-pan-stations (Adapt)
- focal: percurso vertical interrompido por três estações
- roles: trilho coral = camera path; TRANSFERÊNCIA, EMOÇÃO e PERCEPÇÃO = stations; ícones lineares = supporting; papel com cartografia mono = background

narrativeRole: Torna concretos os desafios que mantêm a AGI fora do alcance atual.
keyMessage: Generalização, emoção e percepção sensorial continuam sem solução equivalente à humana.

Adapt: mantém um único mundo maior que o quadro e a câmera percorrendo estações; gira o percurso para o eixo vertical do 9:16 e termina numa lacuna, não num nó caótico.
Scene 1 (0.0–1.5s): a câmera abre na etiqueta “TRÊS SALTOS”; um trilho coral desenha para baixo e começa o pan vertical (`viewport-change` + `svg-path-draw`).
Scene 2 (1.5–3.6s): a câmera estaciona em TRANSFERÊNCIA; dois domínios permanecem separados por uma ponte incompleta e o label entra no cue.
Scene 3 (3.6–5.6s): novo pan chega a EMOÇÃO; uma forma lógica encontra um pulso irregular, mas os dois não se fundem. A câmera volta a ficar estática durante a leitura.
Scene 4 (5.6–7.1s): último pan chega a PERCEPÇÃO; olho, ouvido e mão aparecem por SVG self-draw (`svg-icon-enrichment` + `svg-path-draw`).
Scene 5 (7.1–8.04s): o trilho termina antes de “Riqueza humana”; a lacuna fica visível e o quadro segura, sem push adicional.

## Frame 7 — Ainda é uma meta teórica

- scene: As peças formam quase um círculo, mas uma lacuna permanece; a frase final transforma “maior” em “geral”.
- voiceover: "Por isso, AGI continua sendo uma meta teórica e distante. A diferença não é um modelo simplesmente maior. É uma inteligência realmente geral."
- duration: 8.112s
- poster: 6.9s
- transition_in: blur-crossfade
- status: animated
- src: compositions/frames/07-meta-teorica.html
- type: branding
- persuasion: Distillation + callback
- beat: clareza + resolução
- blueprint: titlecard-reveal (Adapt)
- focal: card chain `META TEÓRICA` → `MAIOR ≠ GERAL` → `REALMENTE GERAL`
- roles: três cartões tipográficos = foreground subject; círculo incompleto = supporting callback; linha coral = lacuna; papel limpo = background

narrativeRole: Fecha retornando ao contraste do hook e entrega uma definição memorável.
keyMessage: AGI continua teórica; seu critério é generalidade, não escala isolada.

Adapt: usa a variante de cadeia de cartões; cada cartão tem um único gesto contido e o último recebe o maior hold do vídeo.
Scene 1 (0.0–2.2s): “META TEÓRICA” revela por gentle scale-settle no terço superior; o círculo incompleto se desenha abaixo e segura.
Scene 2 (2.2–4.8s): hard cut em opacidade total para “MAIOR ≠ GERAL”; MAIOR perde contraste enquanto GERAL permanece em tinta, sem segundo movimento.
Scene 3 (4.8–6.2s): blur-snap handoff (`depth-of-field-blur`) para “INTELIGÊNCIA” e, no cue final, “REALMENTE GERAL” entra por slide-up crossfade (`discrete-text-sequence`).
Scene 4 (6.2–8.112s): o círculo fecha quase todo, deixando a linha coral como lacuna deliberada; o título segura totalmente imóvel até o fim.
