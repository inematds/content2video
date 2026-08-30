---
format: 1080x1920
duration: 60s
message: "O INEMA.CLUB transforma curiosidade sobre IA em uma jornada prática de aprendizado, projetos e comunidade."
arc: "Future Pacing → Product → Mechanism → Breadth → Proof → Audience → Community → CTA"
audience: "pessoas que querem aprender e aplicar inteligência artificial"
mode: autonomous
music: none
---

## Video direction

- Palette: fundo azul-marinho `bg`, texto claro `text` e ciano `primary` como único acento; cartões translúcidos e sem sombras, conforme `frame.md`.
- Tipografia: display e corpo em `-apple-system`, com hierarquia de vídeo; títulos dominantes, etiquetas menores e números tabulares.
- Motion grammar: movimentos com assentamento longo e suave; cada elemento aparece quando a narração o nomeia, principalmente na metade final da cena; nada é despejado no início.
- Reveal model: tipografia, telas e cartões entram em sequência guiada pela voz. Os frames 2 e 5 têm pausas de leitura mais longas; durante holds, apenas jitter mínimo quando necessário.
- Rhythm: frames 1–4 constroem direção e mecanismo; frame 5 desacelera para a prova `+400`; frames 6–7 voltam a expandir; frame 8 fecha com calma e ação.
- Caption keep-out: conteúdo essencial permanece no topo de 83% do quadro vertical.
- Negative list: sem gradientes genéricos de IA, sem segundo acento, sem sombras pesadas, sem navegação de browser recriada, sem slideshow front-loaded e sem movimento de screensaver.

## Frame 1 — Direção, não ruído

- scene: Ferramentas e cursos aparecem como escolhas dispersas; a palavra CAMINHO assume o centro.
- voiceover: "Você não precisa de mais uma lista de ferramentas. Precisa de um caminho para usar inteligência artificial de verdade."
- duration: 7.704s
- poster: 5.4s
- transition_in: cut
- status: animated
- src: compositions/frames/01-direcao.html
- type: hook
- persuasion: Pain validation + category reframing
- beat: tensão → clareza
- blueprint: ticker-takeover (Adapt)
- asset_candidates: assets/inemaclub-aprenda-pratique-evolua-o-ecos.webp — peça oficial INEMA.CLUB com a promessa Aprenda, Pratique, Evolua
- focal: assets/inemaclub-aprenda-pratique-evolua-o-ecos.webp
- roles: inemaclub-aprenda-pratique-evolua-o-ecos.webp = hero surface, supporting until the takeover

narrativeRole: Abre na dor de excesso de informação e muda o desejo para uma jornada orientada.
keyMessage: A pessoa precisa de direção prática, não de mais conteúdo solto.

Adapt: mantém a colisão que substitui o ruído por um herói; o herói final é a promessa oficial do INEMA.CLUB.
Scene 1 (0.0–1.6s): só “MAIS UMA LISTA?” ocupa o terço superior; type-on com caret (`discrete-text-sequence`), composição assimétrica 70/30 com linhas ciano nas bordas.
Scene 2 (1.6–4.4s): o slot central alterna “FERRAMENTAS”, “CURSOS”, “TENDÊNCIAS” por in-place token cycle (`vertical-spring-ticker`), um termo por pista da voz; o restante do quadro continua vazio e tenso.
Scene 3 (4.4–6.2s): a palavra “CAMINHO” entra da direita com motion-blur streak (`motion-blur-streak`) e desloca fisicamente a lista (`reactive-displacement`); a peça oficial começa a ocupar o plano de fundo.
Scene 4 (6.2–7.704s): a peça oficial resolve nítida em card grande no topo de 75% do quadro; “USE IA DE VERDADE” segura no primeiro plano e permanece imóvel.

## Frame 2 — Uma jornada

- scene: A tela oficial do portal entra como um mapa central e a tríade Aprenda, Pratique, Evolua se acende em sequência.
- voiceover: "No INEMA.CLUB, aprender, praticar e evoluir fazem parte da mesma jornada — do primeiro prompt ao projeto publicado."
- duration: 8.328s
- poster: 5.2s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/02-jornada.html
- type: product_intro
- persuasion: Future pacing
- beat: descoberta + aspiração
- blueprint: device-surface-showcase (Adapt)
- asset_candidates: assets/scroll-000.png — abertura oficial do portal INEMA.CLUB; assets/inemaclub-aprenda-pratique-evolua-o-ecos.webp — peça oficial da proposta central
- focal: assets/scroll-000.png
- roles: scroll-000.png = hero surface; inemaclub-aprenda-pratique-evolua-o-ecos.webp = supporting proof card

narrativeRole: Nomeia o produto e entrega a promessa completa até o segundo beat.
keyMessage: O portal conecta aprendizado e aplicação em uma única jornada.

Adapt: mantém a superfície oficial persistente e a progressão de estados; troca a navegação por três focos editoriais sincronizados à voz.
Scene 1 (0.0–1.5s): o screenshot oficial estabelece como janela vertical inclinada levemente, ocupando 70% do quadro; edge slide-in com settle suave, título “INEMA.CLUB” no alto.
Scene 2 (1.5–4.4s): “APRENDER”, “PRATICAR”, “EVOLUIR” acendem um por vez sobre a superfície com keyword glow (`asr-keyword-glow`); layout layered-depth, screenshot ao fundo e palavras no meio.
Scene 3 (4.4–6.8s): a janela aproxima a área central por zoom-to-target (`coordinate-target-zoom`) enquanto a peça oficial entra como supporting card, sem esconder a tela real.
Scene 4 (6.8–8.328s): “DO PRIMEIRO PROMPT AO PROJETO PUBLICADO” monta por per-word reveal (`dynamic-content-sequencing`) e segura imóvel para leitura.

## Frame 3 — Ordem certa

- scene: A progressão numerada da trilha para iniciantes avança de FEP até deploy e sistemas de IA.
- voiceover: "A trilha para iniciantes organiza os cursos na ordem certa: fundamentos, dados, visão, agentes de código e deploy."
- duration: 8.232s
- poster: 5.0s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-trilha.html
- type: feature_showcase
- persuasion: Friction reduction
- beat: clareza + controle
- blueprint: spatial-pan-stations (Reproduce)
- asset_candidates: assets/scroll-021.png — introdução oficial da Trilha para Iniciantes; assets/scroll-029.png — grade oficial de cursos numerados
- focal: assets/scroll-029.png
- roles: scroll-021.png = background context; scroll-029.png = hero surface

narrativeRole: Mostra como o portal elimina a dúvida sobre por onde começar.
keyMessage: Há uma progressão organizada, não uma lista aleatória.

Scene 1 (0.0–2.0s): a câmera abre no station “FUNDAMENTOS”, com recorte do screenshot `scroll-021` e marcador 01; pan/focus-lock (`viewport-change`) em faixa vertical, composição full-width strip.
Scene 2 (2.0–4.1s): pan suave alcança “DADOS + VISÃO”; dois marcadores aparecem quando a voz nomeia cada base, por discrete reveal (`discrete-text-sequence`).
Scene 3 (4.1–6.5s): a câmera atravessa o screenshot `scroll-029` e para em “AGENTES DE CÓDIGO”; uma linha ciano se autodeseha entre os pontos (`svg-path-draw`).
Scene 4 (6.5–8.232s): último pan aterrissa em “DEPLOY”; os quatro pontos ficam conectados e o rótulo “NA ORDEM CERTA” segura estático.

## Frame 4 — Escolha seu foco

- scene: Trilhas temáticas ocupam uma grade viva e convergem para a escolha do usuário.
- voiceover: "Depois, você escolhe seu foco: automação, design, negócios, Codex, Claude Code, agentes e muito mais."
- duration: 7.8s
- poster: 5.0s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/04-foco.html
- type: feature_showcase
- persuasion: Value stacking
- beat: possibilidade + autonomia
- blueprint: grid-card-assemble (Adapt)
- asset_candidates: assets/scroll-071.png — seção oficial com as trilhas de aprendizado do INEMA.PRO
- focal: assets/scroll-071.png
- roles: scroll-071.png = background evidence and source for theme cards

narrativeRole: Expande a jornada sem perder a sensação de escolha orientada.
keyMessage: Cada pessoa encontra uma trilha adequada ao seu objetivo.

Adapt: mantém a grade que se monta, mas usa grupos temáticos do portal em vez de cartões genéricos.
Scene 1 (0.0–1.4s): “ESCOLHA SEU FOCO” entra no topo esquerdo; screenshot oficial aparece dimmed ao fundo, com hierarquia 3:1.
Scene 2 (1.4–4.8s): cartões “AUTOMAÇÃO”, “DESIGN”, “NEGÓCIOS” e “CODEX” entram diretamente em seus slots (`center-outward-expansion` short-path), cada um no cue da voz; grade 2×2 no topo de 70% do quadro.
Scene 3 (4.8–6.5s): “CLAUDE CODE” e “AGENTES” completam a grade; um glow ciano passa uma única vez sobre a seleção (`ambient-glow-bloom`).
Scene 4 (6.5–7.8s): a grade reduz contraste e um único pill “E MUITO MAIS” torna-se o foco; hold imóvel.

## Frame 5 — Mais de 400 projetos

- scene: O número +400 conta para cima e revela a seção oficial de projetos prontos para usar.
- voiceover: "E conhecimento não fica parado: são mais de quatrocentos projetos prontos para baixar, estudar, adaptar e colocar em uso."
- duration: 8.304s
- poster: 5.7s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/05-projetos.html
- type: social_proof
- persuasion: Statistical proof + show-don't-tell proof
- beat: confiança + potência
- blueprint: dataviz-countup (Adapt)
- asset_candidates: assets/scroll-078.png — seção oficial Projetos com a prova de mais de 400 projetos
- focal: assets/scroll-078.png
- roles: scroll-078.png = hero evidence surface

narrativeRole: Converte a promessa de prática em evidência quantitativa e utilizável.
keyMessage: O aprendizado gera acesso a projetos reais, não só teoria.

Adapt: mantém o número como herói e o pouso em uma superfície de prova real; omite gráficos inventados.
Scene 1 (0.0–2.8s): “+400” conta e cresce no centro (`counting-dynamic-scale`), acompanhado por um arco ciano que preenche (`stat-bars-and-fills`); composição centered, número ocupando metade da largura.
Scene 2 (2.8–5.5s): a câmera atravessa o número e revela `scroll-078` como grande card oficial (`multi-phase-camera`); “PROJETOS PRONTOS” entra sobre a borda superior.
Scene 3 (5.5–7.0s): “BAIXAR · ESTUDAR · ADAPTAR · USAR” revela termo por termo (`dynamic-content-sequencing`) em quatro pills abaixo da tela, ainda acima da faixa de legendas.
Scene 4 (7.0–8.304s): o screenshot e o `+400` coexistem em asymmetric 60/40; glow ciano repousa atrás do número e tudo segura estático.

## Frame 6 — Para o seu momento

- scene: Perfis profissionais alternam ao redor de uma frase fixa: USE IA PARA EVOLUIR.
- voiceover: "Conteúdo para quem quer produzir melhor, liderar com IA, criar um negócio ou acelerar a própria carreira."
- duration: 8.064s
- poster: 5.1s
- transition_in: blur-crossfade
- status: animated
- src: compositions/frames/06-perfis.html
- type: benefit_highlight
- persuasion: Audience identification
- beat: pertencimento + ambição
- blueprint: fixed-anchor-cycle (Adapt)
- asset_candidates: assets/profissional-operacional-mais-produtivid.webp — perfil profissional operacional; assets/empreendedor-estratgico-com-ia.webp — perfil empreendedor; assets/gestor-e-lder-lidere-melhor-com-ia.webp — perfil gestor e líder
- focal: assets/empreendedor-estratgico-com-ia.webp
- roles: profissional-operacional-mais-produtivid.webp = cycling supporting card; empreendedor-estratgico-com-ia.webp = cycling hero card; gestor-e-lder-lidere-melhor-com-ia.webp = cycling supporting card

narrativeRole: Faz diferentes públicos se reconhecerem na proposta do portal.
keyMessage: O ecossistema serve a objetivos profissionais concretos.

Adapt: mantém o anchor totalmente imóvel e faz os perfis reais ciclarem ao lado, em cadência constante.
Scene 1 (0.0–1.8s): “USE IA PARA EVOLUIR” entra uma vez no terço superior esquerdo e fixa; word-by-word build (`dynamic-content-sequencing`), câmera estática.
Scene 2 (1.8–5.8s): ao lado do anchor, os cards reais alternam “PRODUZIR MELHOR”, “LIDERAR”, “CRIAR UM NEGÓCIO” com hard-cut label replacement (`discrete-text-sequence`); o anchor nunca se move.
Scene 3 (5.8–6.9s): o ciclo para no card mais amplo e “ACELERAR A CARREIRA” acende inteiro, sem novo movimento de câmera.
Scene 4 (6.9–8.064s): a linha “PARA O SEU MOMENTO” completa o lockup abaixo do anchor; long static hold.

## Frame 7 — Comunidade ativa

- scene: Canais especializados orbitam um núcleo INEMA e a tela oficial da comunidade confirma a escala.
- voiceover: "Tudo conectado a uma comunidade ativa, com grupos especializados, novidades e aprendizado contínuo."
- duration: 6.888s
- poster: 4.8s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-comunidade.html
- type: feature_showcase
- persuasion: Social proof + authority by association
- beat: conexão + pertencimento
- blueprint: constellation-hub (Adapt)
- asset_candidates: assets/scroll-086.png — seção oficial dos grupos e canais Telegram; assets/inemavip.png — convite oficial INEMA.VIP
- focal: assets/scroll-086.png
- roles: scroll-086.png = background evidence surface; inemavip.png = center hub

narrativeRole: Mostra que a jornada continua com pessoas, atualização e troca.
keyMessage: O aprendizado é sustentado por uma comunidade especializada.

Adapt: mantém o núcleo e os satélites, usando nomes reais de canais e a tela oficial da comunidade.
Scene 1 (0.0–1.6s): o convite `inemavip.png` entra como hub central e o screenshot `scroll-086` sustenta o fundo a 40%; centered layered-depth.
Scene 2 (1.6–4.6s): chips “CODEX”, “AGENTES”, “VÍDEOS”, “PROMPTS” e “VOZ” aparecem ao redor em stagger suave (`spring-pop-entrance`) com conectores desenhados (`avatar-cloud-network`, `svg-path-draw`).
Scene 3 (4.6–5.8s): “NOVIDADES” e “APRENDIZADO CONTÍNUO” completam o anel quando a voz os nomeia; sem inventar métricas.
Scene 4 (5.8–6.888s): o hub permanece nítido, satélites recebem leve redução de contraste e a frase “COMUNIDADE ATIVA” segura no topo.

## Frame 8 — Entre e construa

- scene: Aprenda, Pratique e Evolua fecham em sequência; o endereço INEMA.CLUB torna-se a ação principal.
- voiceover: "Entre em inema ponto club. Escolha sua trilha. Construa algo real. E evolua com inteligência artificial."
- duration: 7.92s
- poster: 5.8s
- transition_in: squeeze
- status: animated
- src: compositions/frames/08-cta.html
- type: cta
- persuasion: Future pacing + urgency-to-act
- beat: motivação + ação
- blueprint: cta-morph-press (Adapt)
- asset_candidates: assets/inemaclub-aprenda-pratique-evolua-o-ecos.webp — peça oficial INEMA.CLUB para o fechamento de marca
- focal: assets/inemaclub-aprenda-pratique-evolua-o-ecos.webp
- roles: inemaclub-aprenda-pratique-evolua-o-ecos.webp = supporting brand plate behind the CTA

narrativeRole: Converte a promessa em um próximo passo simples e memorável.
keyMessage: A jornada pode começar agora em INEMA.CLUB.

Adapt: mantém o morph no mesmo centro e o clique final; a placa oficial sustenta a identidade sem competir com a URL.
Scene 1 (0.0–2.1s): “APRENDA · PRATIQUE · EVOLUA” revela em três cues sobre a placa oficial, centralizado e com anéis ciano discretos no fundo.
Scene 2 (2.1–4.2s): a tríade condensa no mesmo centro em um pill sólido “INEMA.CLUB” (`scale-swap-transition`), a única superfície opaca da cena.
Scene 3 (4.2–6.1s): “ESCOLHA SUA TRILHA” e “CONSTRUA ALGO REAL” entram abaixo em duas linhas, na ordem da voz; cursor se aproxima com desaceleração.
Scene 4 (6.1–7.92s): cursor e CTA pressionam juntos (`physics-press-reaction`), ripple ciano expande (`cursor-click-ripple`) e o frame segura em “EVOLUA COM IA”.
