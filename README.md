# Content2Video INEMA

Um link entra, um vídeo editável sai. O projeto lê uma página, cria roteiro, storyboard, narração, legendas e motion design no HyperFrames, deixa tudo disponível para revisão e só então renderiza o MP4.

O padrão atual é vídeo vertical em português brasileiro, com cerca de 1 minuto e 30% de tolerância (42–78 s), voz fixa `pt-BR-FranciscaNeural` e nota mínima 8. A língua da página de origem não troca a voz: uma fonte em inglês continua recebendo narração pt-BR, salvo pedido explícito.

[Abrir o guia visual](https://inematds.github.io/videoimpacto/guia/) · [Plano do projeto](docs/plano_content2video_inema.md)

## Pré-requisitos

- Node.js 22 ou superior;
- FFmpeg e FFprobe;
- Codex CLI autenticado com `codex login` (padrão), ou uma chave da OpenAI configurada no `.env`;
- acesso à internet para ler a URL e obter o HyperFrames na primeira execução.

Confira a instalação:

```bash
node --version
ffmpeg -version
codex --version
codex login status
```

## Instalação

```bash
git clone https://github.com/inematds/videoimpacto.git
cd videoimpacto
cp .env.example .env
npm install
```

O `.env` real nunca é versionado. Os padrões documentados ficam em `.env.example`; ajuste principalmente `APP_HOST` e `PREVIEW_HOST` para o IP do computador que executará o sistema.

## Usar com a interface

Inicie o servidor:

```bash
npm start
```

Com o padrão deste ambiente, abra `http://192.168.2.99:3080`. Em outra máquina ou rede, troque o IP no `.env`.

Na interface:

1. Cole o link da página ou artigo.
2. Clique em **Criar vídeo** e acompanhe o trabalho.
3. Abra o projeto no editor para revisar texto, cenas, imagens e tempos.
4. Clique em **Aprovar e renderizar**.
5. Baixe o MP4 pelo próprio card do projeto.

A interface não exige login próprio. Ela foi feita para uso local ou em rede privada; não a exponha diretamente à internet sem adicionar autenticação e HTTPS.

## Usar sem interface, pelo terminal

Veja os comandos disponíveis:

```bash
npm run video -- --help
```

Crie um projeto a partir de uma URL. O último argumento, opcional, define o nome da pasta:

```bash
npm run video:create -- https://www.inema.club/ inema-club-promo
```

O comando cria `videos/inema-club-promo/`, gera o material editável e valida a composição, mas não renderiza automaticamente. Depois:

```bash
npm run video:list
npm run video:check -- inema-club-promo
npm run video:preview -- inema-club-promo
npm run video:render -- inema-club-promo
```

O MP4 final fica em:

```text
videos/<nome-do-projeto>/renders/<nome-do-projeto>.mp4
```

Também é possível executar o HyperFrames diretamente dentro de qualquer vídeo:

```bash
cd videos/inema-club-promo
npx --yes hyperframes@0.8.19 check
npx --yes hyperframes@0.8.19 preview
npx --yes hyperframes@0.8.19 render --quality high --output renders/inema-club-promo.mp4
```

## OAuth da assinatura ou API

O padrão reutiliza a sessão OAuth já conectada no Codex CLI:

```dotenv
AI_PROVIDER=codex
```

Autentique uma vez no computador:

```bash
codex login
```

Para usar a OpenAI API, altere somente o `.env` local:

```dotenv
# AI_PROVIDER=codex
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
# OPENAI_MODEL=
```

Nunca envie a chave ao Git. O `.gitignore` já exclui `.env` e variantes locais.

## Padrões configuráveis

O `.env.example` reúne idioma, voz, duração, tolerância, nota mínima, formato, resolução, FPS, qualidade, pastas e endereços da interface. As regras editoriais executáveis também estão em `config/production-defaults.json` e `AGENTS.md`.

| Configuração | Padrão |
|---|---|
| Idioma | `pt-BR` |
| Voz | `pt-BR-FranciscaNeural` via Edge TTS |
| Duração | 60 s, faixa aceita de 42 a 78 s |
| Qualidade mínima | 8 |
| Formato | 9:16, 1080 × 1920, 30 fps |
| Render | MP4 em qualidade alta, após aprovação |

## Projetos de exemplo

- `videos/inema-club-promo`: vídeo do INEMA.club;
- `videos/zuckerberg-anti-dolly-parton`: artigo em inglês narrado com a mesma voz brasileira;
- `videos/mudancas-compostas`: MVP original de aproximadamente 1 minuto.

Para validar um exemplo completo:

```bash
npm run video:check -- mudancas-compostas
ffprobe videos/mudancas-compostas/renders/mudancas-compostas.mp4
```

## Estrutura

```text
app/                         interface e servidor local
config/                      padrões de produção
docs/                        plano e relatório do MVP
scripts/video.mjs            comandos de terminal
videos/<projeto>/            fontes editáveis, mídia, snapshots e renders
.env.example                 configuração segura de referência
```

## Segurança e publicação

- não versionar `.env`, tokens, cookies ou credenciais;
- revisar direitos de uso das mídias capturadas da página de origem;
- manter a interface restrita à rede confiável enquanto estiver sem login;
- conferir manchetes na área segura e ouvir a narração antes do render final.

## Licença

Uso interno e educacional INEMA. Verifique os direitos do conteúdo-fonte e das mídias antes de distribuir cada vídeo.
