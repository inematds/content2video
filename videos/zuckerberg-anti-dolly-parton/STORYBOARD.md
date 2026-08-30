---
format: 1080x1920
duration: 60s
message: "A polarização política separa quase tudo, mas a pesquisa mostra um consenso raro e invertido nas avaliações de Dolly Parton e Mark Zuckerberg"
arc: concept-explainer
audience: publico geral interessado em tecnologia e cultura
mode: autonomous
music: none
---

## Video direction

- Palette: coral como campo ou acento principal, creme como superfície de leitura e preto-tinta para contraste; nunca branco sobre coral. Bebas condensada carrega títulos e números; Inter carrega fonte, método e ressalvas.
- Motion grammar: entradas suaves de cauda longa, com cada palavra, barra e número surgindo quando a narração os nomeia; nada é despejado no primeiro quarto da cena. Durante a leitura final, tudo fica estável, sem respiração preguiçosa ou deriva de câmera.
- Rhythm: frames 1, 3, 4 e 5 têm construção cinética; frame 2 oferece uma pausa editorial; frame 6 faz a virada de interpretação; frame 7 desacelera deliberadamente; frame 8 encerra com um longo hold.
- Layout: composição nativa 9:16, com conteúdo principal concentrado nos 83% superiores e faixa inferior livre para legendas. Alternar centro, bandas empilhadas, régua vertical e composição assimétrica.
- Negative list: sem fotografias, rostos sintéticos, interface falsa, degradê “IA” azul/roxo, cartões arredondados, sombras suaves, bounce, telas que front-load e congelam, ou elementos flutuando como screensaver.

## Frame 1 — Dois consensos

- scene: As palavras DEMOCRATAS e REPUBLICANOS colidem, se separam e deixam dois marcadores apontando para direções opostas.
- voiceover: "Democratas e republicanos discordam sobre quase tudo. Mas dois nomes produziram consensos — em direções opostas."
- duration: 8.112s
- poster: 4.5s
- transition_in: cut
- status: animated
- src: compositions/frames/01-dois-consensos.html
- type: hook
- persuasion: Counterintuitive claim + question-to-answer pairing
- beat: surpresa e curiosidade
- blueprint: compose
- focal: a palavra CONSENSO atravessada por duas setas em direções opostas
- roles: DEMOCRATAS e REPUBLICANOS = supporting bands · CONSENSO = foreground subject · hatch coral e linhas de registro = background

narrativeRole: Abre uma lacuna cognitiva usando a convergência inesperada entre partidos como o fato que merece atenção.
keyMessage: Em um ambiente polarizado, dois nomes geraram consensos raros, mas em sentidos opostos.

Compose: troca de frases em um centro fixo e duas setas editoriais que se separam, sem carregar variantes de logo ou produto.
Scene 1 (0.0–2.4s): fundo coral com hatch; DEMOCRATAS entra pelo topo e REPUBLICANOS pela base, em bandas empilhadas, via per-word staggered reveal (`dynamic-content-sequencing`), ocupando a metade superior do quadro.
Scene 2 (2.4–5.3s): DISCORDAM substitui as bandas por hard-cut word-swap (`discrete-text-sequence`); uma régua preta se divide em duas direções enquanto QUASE TUDO pousa abaixo, revelado no cue da voz.
Scene 3 (5.3–8.171s): CONSENSOS cresce no centro e DUAS DIREÇÕES aparece em coral sobre creme; duas setas se afastam com `center-outward-expansion`, depois seguram estáveis acima da faixa de legendas.

## Frame 2 — A régua

- scene: Um painel editorial apresenta a pesquisa nacional da UMass Lowell como a régua comum para todas as comparações.
- voiceover: "A pesquisa nacional da UMass Lowell, feita em abril de 2026, perguntou a adultos americanos como viam figuras públicas."
- duration: 8.64s
- poster: 5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-a-regua.html
- type: product_intro
- persuasion: Citation + frame-then-fill
- beat: orientação e confiança
- blueprint: titlecard-reveal (Adapt)
- focal: selo UMass Lowell + data ABRIL 2026
- roles: selo da fonte = foreground subject · pergunta da pesquisa = supporting · creme com grande numeral 2026 = background

narrativeRole: Define a fonte, a data e o que exatamente foi medido antes de mostrar qualquer número.
keyMessage: A comparação vem de uma pesquisa nacional sobre impressão favorável ou desfavorável de figuras públicas.

Adapt: manter a calma de uma cadeia de cartões; usar três placas editoriais — fonte, data e pergunta — em cortes secos.
Scene 1 (0.0–2.6s): campo creme; UMASS LOWELL e PESQUISA NACIONAL surgem no terço superior por single restrained reveal (`scale-swap-transition`), com uma linha coral desenhando a base.
Scene 2 (2.6–5.7s): hard cut para ABRIL 2026 em numeral wallpaper, com ADULTOS AMERICANOS aparecendo abaixo por `discrete-text-sequence`; composição central e densa só no eixo vertical.
Scene 3 (5.7–9.088s): hard cut para a pergunta “FAVORÁVEL OU DESFAVORÁVEL?” em duas linhas; pequenos rótulos FIGURAS PÚBLICAS e FONTE PRIMÁRIA chegam nos cues finais e o cartão segura imóvel.

## Frame 3 — Dolly no alto

- scene: No mesmo placar vertical, duas barras de Dolly Parton sobem juntas, rotuladas DEM e REP.
- voiceover: "Dolly Parton aparece no topo: favorável para 78% dos democratas e 73% dos republicanos."
- duration: 8.52s
- poster: 5.5s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/03-dolly-no-alto.html
- type: social_proof
- persuasion: Statistical proof + progressive disclosure
- beat: admiração e clareza
- blueprint: dataviz-countup (Adapt)
- focal: barras 78% DEM e 73% REP
- roles: barras partidárias = foreground subject · nome DOLLY PARTON = supporting · régua 0–100 e numeral 70 = background

narrativeRole: Materializa o primeiro consenso com duas barras altas e quase equivalentes.
keyMessage: Dolly Parton registrou alta favorabilidade entre democratas e republicanos.

Adapt: manter contagem e preenchimento sincronizados; trocar instrumentos múltiplos por um único placar vertical persistente.
Scene 1 (0.0–2.2s): campo creme com régua 0–100; DOLLY PARTON entra no terço superior e a primeira barra vazia se estabelece, em composição assimétrica 60/40.
Scene 2 (2.2–5.3s): barra DEM cresce até 78% por `stat-bars-and-fills` enquanto o número conta por `counting-dynamic-scale`; rótulo DEMOCRATAS aparece no mesmo cue.
Scene 3 (5.3–8.661s): barra REP cresce até 73% logo ao lado, com idêntica escala; ambos os números ficam estáveis e um colchete coral os une sob a palavra ALTO.

## Frame 4 — Zuckerberg no piso

- scene: O placar mantém a mesma escala; as duas barras de Mark Zuckerberg mal deixam a linha de base.
- voiceover: "Mark Zuckerberg quase encosta no chão: 8% entre democratas e 13% entre republicanos."
- duration: 7.536s
- poster: 5.5s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/04-zuckerberg-no-piso.html
- type: feature_showcase
- persuasion: Comparison of two options + statistical proof
- beat: choque e compreensão
- blueprint: dataviz-countup (Adapt)
- focal: barras 8% DEM e 13% REP na linha de base
- roles: barras partidárias = foreground subject · nome MARK ZUCKERBERG = supporting · régua 0–100 e linha do piso = background

narrativeRole: Usa a mesma régua visual para tornar o contraste impossível de atribuir a escalas diferentes.
keyMessage: A favorabilidade de Zuckerberg foi baixa entre os dois partidos.

Adapt: repetir exatamente a régua do frame anterior; o movimento principal é a pequena altura das barras, não uma nova câmera.
Scene 1 (0.0–2.0s): mesmo placar creme e mesma régua 0–100; MARK ZUCKERBERG entra no terço superior com per-word reveal, e uma linha preta enfatiza o piso.
Scene 2 (2.0–4.6s): barra DEM cresce apenas até 8%, número contado em coral; 92% do trilho permanece vazio e legível.
Scene 3 (4.6–7.36s): barra REP chega a 13%; os dois valores seguram lado a lado enquanto QUASE NO CHÃO aparece encaixado na linha de base.

## Frame 5 — A distância total

- scene: O placar partidário se contrai em dois números nacionais: 70% para Dolly e 10% para Zuckerberg, ligados por uma distância de 60 pontos.
- voiceover: "No total, a diferença também é enorme: 70% de favorabilidade para Dolly, contra 10% para Zuckerberg."
- duration: 8.376s
- poster: 5.5s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/05-a-distancia-total.html
- type: feature_showcase
- persuasion: Distillation + worked example with real numbers
- beat: aha e convicção
- blueprint: dataviz-countup (Adapt)
- focal: distância de 60 pontos entre 70% e 10%
- roles: 70 e 10 = foreground subjects · trilho de 60 pontos = supporting · wallpaper 60 e faixa coral = background

narrativeRole: Condensa quatro números partidários em uma medida nacional fácil de memorizar.
keyMessage: A diferença total de favorabilidade é de sessenta pontos percentuais.

Adapt: manter o count-up como assinatura; converter o placar partidário em uma régua nacional de distância.
Scene 1 (0.0–2.4s): fundo preto-tinta; NO TOTAL surge no topo e dois pontos vazios se alinham num trilho vertical creme.
Scene 2 (2.4–5.5s): DOLLY conta até 70% e ocupa o ponto superior, com preenchimento coral; ZUCKERBERG conta até 10% e fixa o ponto inferior.
Scene 3 (5.5–8.469s): o segmento entre os pontos se desenha e o numeral 60 PONTOS aparece como wallpaper coral; o conjunto segura sem câmera ou jitter.

## Frame 6 — A leitura da manchete

- scene: A expressão ANTI-DOLLY aparece como um carimbo editorial e se abre em duas frases mais precisas: alta dos dois lados versus baixa dos dois lados.
- voiceover: "A Futurism chamou isso de relação anti-Dolly Parton: uma é admirada dos dois lados; o outro registra baixa aprovação nos dois."
- duration: 8.424s
- poster: 6s
- transition_in: blur-crossfade
- status: animated
- src: compositions/frames/06-a-leitura-da-manchete.html
- type: benefit_highlight
- persuasion: Coined term + contrast
- beat: reconhecimento e precisão
- blueprint: comparison-split (Adapt)
- focal: carimbo editorial ANTI-DOLLY
- roles: carimbo = foreground subject · duas definições empilhadas = supporting · metade coral e metade preta = background

narrativeRole: Traduz a metáfora editorial da matéria sem transformá-la em um fato medido pela pesquisa.
keyMessage: “Anti-Dolly” é a interpretação da Futurism para dois padrões partidários invertidos.

Adapt: manter a comparação simétrica; em 9:16, converter os cartões laterais em painéis empilhados e trocar a inclinação 3D por uma abertura plana.
Scene 1 (0.0–2.5s): o carimbo FUTURISM: “ANTI-DOLLY” desce ao centro sobre uma divisão dura coral/preto, com `discrete-text-sequence` destacando a atribuição.
Scene 2 (2.5–6.2s): painel superior abre para DOLLY — ALTA NOS DOIS LADOS; painel inferior abre para ZUCKERBERG — BAIXA NOS DOIS, em entradas espelhadas por `split-tilt-cards` adaptado sem float.
Scene 3 (6.2–8.939s): dois pequenos badges INTERPRETAÇÃO EDITORIAL surgem nas bordas internas, sem bounce; as duas definições permanecem legíveis e estáveis.

## Frame 7 — O que o dado não diz

- scene: Um selo OPINIÃO, NÃO CARÁTER interrompe o placar; abaixo, três notas distinguem favorabilidade, motivo e julgamento moral.
- voiceover: "Os números não explicam sozinhos o motivo, e a pesquisa mede opinião, não caráter. Mas revelam algo raro: consenso em uma época polarizada."
- duration: 9.768s
- poster: 6.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-o-que-o-dado-nao-diz.html
- type: benefit_highlight
- persuasion: Counterexample + generalization
- beat: cautela e compreensão
- blueprint: grid-card-assemble (Adapt)
- focal: selo OPINIÃO, NÃO CARÁTER
- roles: selo de ressalva = foreground subject · três notas de método = supporting · painel creme com régua fantasma = background

narrativeRole: Impede a leitura abusiva dos dados e preserva apenas a conclusão que a pesquisa sustenta.
keyMessage: A pesquisa mede favorabilidade; não prova por que as pessoas responderam assim nem define caráter.

Adapt: manter a montagem sequencial de itens; usar uma lista vertical de três limites metodológicos em vez de uma grade de benefícios.
Scene 1 (0.0–2.6s): o placar anterior perde saturação; OPINIÃO, NÃO CARÁTER entra como faixa coral no terço superior, em restrained scale settle.
Scene 2 (2.6–6.8s): três linhas chegam uma por uma, diretamente nos seus slots: MEDE FAVORABILIDADE; NÃO EXPLICA O MOTIVO; NÃO JULGA CARÁTER, por short-path stagger (`center-outward-expansion`).
Scene 3 (6.8–9.685s): um colchete preto agrupa as três notas e CONSENSO RARO aparece abaixo; toda a lista segura imóvel para a ressalva ser lida.

## Frame 8 — Leia a convergência

- scene: As quatro barras retornam em miniatura e se transformam em duas setas convergentes; a frase LEIA O DADO fecha a peça.
- voiceover: "Quando os extremos concordam, vale olhar o dado antes da manchete. Às vezes, o verdadeiro fato não é a divisão — é a convergência."
- duration: 9.048s
- poster: 6s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-leia-a-convergencia.html
- type: branding
- persuasion: Callback + distillation
- beat: clareza e resolução
- blueprint: compose
- focal: a palavra CONVERGÊNCIA formada por duas setas
- roles: mini-barras 78/73 e 8/13 = supporting · CONVERGÊNCIA = foreground subject · campo creme e banda coral = background

narrativeRole: Retorna ao paradoxo do início e transforma a comparação específica em um princípio de leitura crítica.
keyMessage: O dado mais interessante pode ser o ponto em que grupos opostos convergem.

Compose: relay de frases com longo hold final; as barras retornam como prova visual antes do payoff tipográfico.
Scene 1 (0.0–2.6s): quatro mini-barras 78, 73, 8 e 13 entram no alto por `stat-bars-and-fills`, enquanto QUANDO OS EXTREMOS CONCORDAM aparece em dois tempos.
Scene 2 (2.6–6.2s): as barras se comprimem em duas setas que convergem no centro por `center-outward-expansion`; LEIA O DADO substitui a manchete por hard-cut word-swap.
Scene 3 (6.2–9.131s): CONVERGÊNCIA ocupa quase toda a largura em Bebas coral; uma linha fina credita UMass Lowell + Futurism, e o quadro segura totalmente estável até o fim.
