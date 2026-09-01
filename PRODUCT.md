# Content2Video INEMA

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegado: aplicação Node.js local com interface web responsiva e dependências mínimas, escolhida para instalação e teste rápidos na rede local.

## Users

Uso pessoal do proprietário do projeto, em computador ou outro dispositivo conectado à mesma rede local, para transformar links de sites e matérias em vídeos curtos.

## Product Purpose

Receber uma URL, gerar roteiro, narração e composição visual, permitir revisão e edição e entregar um MP4 pronto para publicação.

## Positioning

Une geração orientada por link, padrões editoriais INEMA, edição no HyperFrames e renderização local em um fluxo único e visível.

## Operating Context

A aplicação roda em `192.168.2.99:3080`, reutiliza o OAuth salvo no Codex CLI por padrão, aceita OpenAI API opcional pelo `.env`, cria projetos dentro de `videos/` e entrega arquivos em `renders/`.

## Capabilities and Constraints

- Sem login de usuários; acesso restrito à rede local.
- Uma URL HTTP ou HTTPS inicia a geração em 9:16 ou 16:9.
- Duração alvo de 60 segundos, com tolerância de 30%.
- Português brasileiro usa Edge TTS com `pt-BR-FranciscaNeural`.
- Formato padrão vertical 1080 × 1920 a 30 fps.
- Nota mínima de qualidade: 8.
- A edição visual é feita no HyperFrames Studio.
- Um projeto pode ser editado por prompt ou duplicado e adaptado sem alterar o original.
- Jobs exibem fases e podem ser cancelados com preservação dos arquivos já produzidos.
- A renderização final ocorre depois de aprovação explícita.

## Brand Commitments

Nome Content2Video INEMA. Preservar o padrão editorial INEMA e a consistência de voz, títulos e margens já definidos em `AGENTS.md` e `config/production-defaults.json`.

## Evidence on Hand

- Três projetos HyperFrames em `videos/`.
- Vídeo promocional INEMA e seus ativos em `videos/inema-club-promo/`.
- Plano original em `docs/plano_content2video_inema.md`.
- Defaults executáveis em `config/production-defaults.json` e `.env`.

## Product Principles

- Um link deve iniciar o trabalho sem exigir conhecimento técnico.
- O estado de cada etapa deve permanecer visível.
- Editar, aprovar, renderizar e baixar devem ser ações inequívocas.
- Voz, idioma, duração e área segura devem ser previsíveis por padrão.
- Falhas devem explicar o problema e a recuperação possível.

## Accessibility & Inclusion

Interface responsiva, navegável por teclado, com foco visível, contraste suficiente e estados que não dependem apenas de cor.
