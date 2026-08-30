---
name: Content2Video INEMA
description: Bancada editorial responsiva para transformar links em vídeos e acompanhar a produção.
colors:
  navy-ink: "#0b1021"
  navy-surface: "#11182f"
  navy-raised: "#17213d"
  navy-hover: "#1d2948"
  divider: "#2a385a"
  divider-bright: "#3e5279"
  text-primary: "#eef3ff"
  text-muted: "#a9b6d0"
  cyan-signal: "#00d9ff"
  cyan-soft: "#8cecff"
  cyan-hover: "#66e8ff"
  progress-track: "#263451"
  ready: "#27dda1"
  warning: "#ffca6a"
  error: "#ff7f8e"
typography:
  display:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(44px, 5.2vw, 82px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 650
    lineHeight: 1.2
  job-title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.2
  metadata:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.45
  state:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "0.04em"
rounded:
  line: "3px"
  control: "12px"
  surface: "14px"
  round: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "24px"
  xl: "42px"
components:
  button-primary:
    backgroundColor: "{colors.cyan-signal}"
    textColor: "{colors.navy-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.surface}"
    padding: "0 22px"
    height: "66px"
  button-primary-hover:
    backgroundColor: "{colors.cyan-hover}"
    textColor: "{colors.navy-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.surface}"
    padding: "0 22px"
    height: "66px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  button-download:
    backgroundColor: "{colors.text-primary}"
    textColor: "{colors.navy-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  input-url:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.surface}"
    padding: "0 20px"
    height: "66px"
  card-panel:
    backgroundColor: "{colors.navy-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.surface}"
    padding: "24px"
---

# Design System: Content2Video INEMA

## Overview

**Creative North Star: "A Bancada Editorial"**

Content2Video INEMA é uma bancada de operação editorial: escura, precisa e silenciosa, com a energia do ciano reservada para decisões, foco e progresso. A interface deve parecer uma ferramenta de produção madura — superfícies azul-marinho foscas, divisórias finas, densidade controlada e hierarquia imediatamente legível — sem ornamentação que dispute atenção com a URL, o estado do trabalho ou o preview do vídeo.

O fluxo visual é intake-first. A entrada ampla abre a experiência; abaixo dela, o trilho de produção explica o que está acontecendo e a filmoteca vertical oferece os artefatos acionáveis. Em telas estreitas, essa mesma ordem vira uma pilha contínua, preservando prioridade, legibilidade e acesso às ações.

**Key Characteristics:**

- Azul-marinho profundo e ciano editorial de alta precisão.
- Anton apenas para a manchete; Hanken Grotesk conduz toda a operação.
- Superfícies foscas, divisórias finas, cantos controlados e profundidade pontual.
- Estados neutro, pronto e erro combinam cor, texto e forma — nunca apenas cor.
- Entrada por URL primeiro, produção em trilho compacto e filmoteca vertical acionável.

## Colors

A paleta usa o azul-marinho como ambiente de trabalho e o ciano como sinal raro e inequívoco de ação, foco ou andamento.

### Primary

- **Ciano de Sinal** (`cyan-signal`): ação principal, palavra decisiva da manchete, foco ativo e progresso em curso.
- **Ciano de Leitura** (`cyan-soft`): rótulos, estados informativos e destaques que precisam ser legíveis sem competir com a ação principal.
- **Ciano de Passagem** (`cyan-hover`): resposta clara e breve ao hover da ação principal.

### Secondary

- **Verde Pronto** (`ready`): conclusão e disponibilidade confirmada.
- **Âmbar de Atenção** (`warning`): reserva semântica para avisos recuperáveis; não é decoração.
- **Rosa de Erro** (`error`): falha, indisponibilidade e mensagem de correção.

### Neutral

- **Tinta Marinho** (`navy-ink`): fundo estrutural da aplicação e contraste escuro dentro de ações claras.
- **Mesa Marinho** (`navy-surface`): painéis, campo de entrada composto e recipientes de trabalho.
- **Plano Elevado** (`navy-raised`): nível reservado para superfícies que precisam se separar da mesa.
- **Marinho de Passagem** (`navy-hover`): resposta discreta de linhas e controles ao ponteiro.
- **Divisor Técnico** (`divider`): separação interna de baixa ênfase.
- **Divisor Ativo** (`divider-bright`): contorno de controles e marcadores neutros.
- **Papel Frio** (`text-primary`): texto principal e ação clara sobre o fundo escuro.
- **Azul de Apoio** (`text-muted`): descrição, metadado e estado neutro.
- **Trilho de Progresso** (`progress-track`): base escura das barras de andamento e conclusão.

### Named Rules

**The Signal Rarity Rule.** O ciano forte aparece apenas onde uma ação, foco ou progresso precisa vencer a hierarquia.

**The Semantic Trio Rule.** Neutro, pronto e erro mantêm papéis estáveis; cada estado repete seu significado em texto ou forma além da cor.

## Typography

**Display Font:** Anton (with `sans-serif` fallback)

**Body Font:** Hanken Grotesk (with `system-ui, sans-serif` fallback)

**Character:** Anton dá impacto editorial concentrado à promessa de entrada. Hanken Grotesk sustenta leitura operacional, números, metadados e ações com uma voz contemporânea e funcional.

### Hierarchy

- **Display** (400, escala fluida, 1.04): somente para a manchete de maior impacto; usa linhas curtas, tracking compacto, quebra por sentido e separação óptica entre blocos de cor.
- **Headline** (650, 20px, 1.2): títulos de painéis e seções operacionais.
- **Title** (600, 19px, 1.25): nome de projeto dentro da filmoteca, sempre com truncamento seguro quando necessário.
- **Body** (400, 16px, 1.55): descrição da proposta e conteúdo de leitura contínua.
- **Label** (650, 13px, 1.2): controles, rótulos e estados; caixa alta e tracking ampliado ficam restritos a estados compactos de produção.
- **Job Title** (600, 14px, 1.2): identificação truncável de um trabalho no trilho de produção.
- **Metadata** (400, 12px, 1.45): etapas, contagens, datas, fatos de configuração e detalhes auxiliares.
- **State** (650, 11px, 0.04em): estado compacto em caixa alta, sempre acompanhado pelo contexto da linha.

### Named Rules

**The One Poster Voice Rule.** Anton é uma voz de manchete, nunca uma fonte de interface; Hanken Grotesk assume tudo o que o usuário precisa operar ou comparar.

## Layout

O conteúdo ocupa um contêiner central de até 1500px, com respiro lateral fluido entre 20px e 64px. A entrada usa uma grade assimétrica: promessa editorial à esquerda e formulário mais largo à direita. A área de trabalho repete essa relação em escala menor, com um trilho de produção compacto e uma filmoteca dominante.

O ritmo nasce de intervalos curtos de 8–24px dentro de componentes e saltos maiores, fluidos, entre regiões. Divisórias mantêm listas densas escaneáveis sem transformar cada item em um cartão isolado. Em larguras de até 980px, entrada e workspace viram uma única coluna e o trilho deixa de ser sticky. Até 680px, o formulário empilha campo e ação, os pôsteres encolhem e as ações dos projetos ocupam uma linha própria com alvos flexíveis.

**The Intake-First Rule.** A URL e sua ação permanecem acima do acompanhamento e da biblioteca em qualquer largura.

**The Vertical Film Library Rule.** Projetos são linhas editoriais com pôster 9:16, título, metadados e ações; não se convertem em uma grade de thumbnails genérica.

## Elevation & Depth

O sistema combina camadas tonais com poucas sombras estruturais. Painéis permanecem foscos e contidos; a profundidade serve para separar recipientes relevantes do fundo, enquanto divisórias carregam a maior parte da organização. Um wash radial de ciano pode ambientar o topo, mas não invade superfícies nem substitui contraste.

### Shadow Vocabulary

- **Sombra de Bancada** (`0 18px 50px rgba(2, 6, 18, 0.36)`): separa o formulário composto e os painéis principais do fundo.
- **Sombra de Pôster** (`0 10px 26px rgba(2, 6, 18, 0.35)`): dá espessura mínima ao preview vertical.
- **Sinal de Estado** (`0 3px 12px` com a cor semântica translúcida): reservado a pontos de pronto, erro ou linhas de trabalho em movimento.

### Named Rules

**The Controlled Depth Rule.** Elevação pertence a recipientes, previews e estados ativos; linhas de lista permanecem planas e separadas por divisores.

## Shapes

Painéis e o campo composto usam cantos suavemente arredondados de 14px. Botões auxiliares, pôsteres e toasts usam 12px; barras de progresso usam 3px; pontos de estado são circulares. O conjunto evita tanto geometria agressivamente quadrada quanto cápsulas decorativas. Bordas de 1px são técnicas e discretas, ganhando ciano apenas durante foco ou interação.

**The Fourteen-Pixel Surface Rule.** Recipientes principais compartilham o mesmo raio de 14px para parecerem partes da mesma bancada.

## Components

### Buttons

- **Shape:** controles firmes, com 12px nas ações independentes; a ação principal herda o recorte do formulário composto de 14px.
- **Primary:** fundo em Ciano de Sinal, texto em Tinta Marinho, altura de 66px e padding horizontal de 22px.
- **Hover / Focus:** hover clareia o ciano; active desloca 1px; foco usa contorno visível de 3px em Ciano de Leitura com offset de 3px.
- **Secondary:** transparente, borda Divisor Ativo e altura mínima de 44px; hover combina borda ciano e wash ciano discreto.
- **Download:** inverte a hierarquia com Papel Frio sobre Tinta Marinho; hover muda para Ciano de Leitura.

### Cards / Containers

- **Corner Style:** superfície contínua de 14px, com clipping quando contém listas.
- **Background:** Mesa Marinho; hover de linha usa Marinho de Passagem.
- **Shadow Strategy:** Sombra de Bancada apenas no recipiente, não em cada item.
- **Border:** divisórias internas de 1px em Divisor Técnico.
- **Internal Padding:** 22–24px em cabeçalhos e linhas operacionais.

### Inputs / Fields

- **Style:** o input transparente vive dentro de um recipiente Mesa Marinho com borda Divisor Ativo, 14px de raio e 66px de altura.
- **Focus:** o recipiente inteiro recebe borda Ciano de Sinal e uma expansão luminosa curta; o input não cria uma segunda borda.
- **Error / Disabled:** erro aparece como mensagem textual em Rosa de Erro; a ação desabilitada mantém rótulo e reduz opacidade.

### Navigation

A topbar de 66–76px usa fundo Tinta Marinho translúcido, divisor inferior e marca compacta à esquerda. A marca é acompanhada por um link textual Ciano de Leitura para o INEMA.CLUB. O estado do sistema fica à direita com ponto semântico e rótulo explícito; em mobile, o rótulo some para preservar marca, link e ponto de estado sem estouro horizontal.

### Production Rail

Cada trabalho é uma linha compacta com título truncado, estado textual em caixa alta, descrição da etapa e uma barra de progresso de 3px. Em andamento usa ciano e movimento; concluído usa verde e preenchimento integral; falha usa rosa e preenchimento integral. Movimento respeita `prefers-reduced-motion`.

### Vertical Film Row

Cada projeto combina pôster 9:16, nome, metadados e ações. O hover tonal cobre a linha inteira. Em mobile, o pôster reduz de 92px para 72px e as ações descem para uma faixa própria, preservando alvos de 44px.

## Do's and Don'ts

### Do:

- **Do** preservar a ordem intake, produção e filmoteca em desktop e mobile.
- **Do** usar Ciano de Sinal para ação, foco e progresso, mantendo-o raro no restante da tela.
- **Do** combinar toda semântica de pronto ou erro com rótulo textual, ícone, barra ou outra forma não cromática.
- **Do** manter pôsteres de projeto em 9:16 e ações inequívocas como “Editar”, “Aprovar e renderizar” e “Baixar”.
- **Do** respeitar foco visível, alvos mínimos de 44px e preferência por movimento reduzido.

### Don't:

- **Don't** trocar as superfícies foscas por vidro brilhante, gradientes decorativos ou cartões flutuantes em excesso.
- **Don't** usar Anton em botões, metadados, estados ou conteúdo operacional.
- **Don't** transformar a filmoteca vertical em uma grade genérica de capas.
- **Don't** depender apenas de verde, rosa ou ciano para comunicar estado.
- **Don't** deixar ornamento competir com URL, status, preview ou ação principal.
