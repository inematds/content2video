# Content2Video INEMA

Um link entra, um vídeo editável sai. O projeto lê uma página, cria roteiro, storyboard, narração, legendas e motion design no HyperFrames, deixa tudo disponível para revisão e só então renderiza o MP4.

O padrão atual é vídeo vertical em português brasileiro, com cerca de 1 minuto e 30% de tolerância (42–78 s), voz fixa `pt-BR-FranciscaNeural` e nota mínima 8. A língua da página de origem não troca a voz: uma fonte em inglês continua recebendo narração pt-BR, salvo pedido explícito.

[Abrir o guia visual](https://inematds.github.io/content2video/guia/) · [Plano do projeto](docs/plano_content2video_inema.md)

Versão atual: `v1.06.00`. O histórico e as evoluções planejadas estão no [ROADMAP](ROADMAP.md).

## Arquitetura e provedores da versão atual

A `v1.06.00` não usa um serviço externo de vídeo generativo. O resultado atual é uma composição programável: o agente cria roteiro e cenas, o HyperFrames organiza e anima os elementos, e o FFmpeg entrega o MP4.

| Componente | Responsabilidade atual | Gera clipes por IA? |
|---|---|---|
| Codex via OAuth ou OpenAI API | Pesquisa a fonte, planeja o vídeo e cria ou edita roteiro, HTML, cenas e metadados | Não |
| HyperFrames | Monta a timeline, anima, valida, abre o editor e renderiza a composição | Não; renderiza a composição criada |
| Edge TTS | Gera a narração, usando `pt-BR-FranciscaNeural` para saídas em português brasileiro | Não |
| FFmpeg/FFprobe | Processa áudio e vídeo, verifica o arquivo e anexa o CTA ao MP4 final | Não |
| Mídia local | Fornece imagens, vídeos, fontes, ícones e outros arquivos usados pelas cenas | Não por si só |

`AI_PROVIDER=codex` e `AI_PROVIDER=openai` escolhem como o agente de produção é executado. Essa configuração não escolhe um gerador de clipes e não significa que o vídeo seja gerado pelos modelos de vídeo da OpenAI.

Não estão integrados nesta versão provedores de clipes generativos ou avatares, como HeyGen, Veo, Runway, Kling ou Sora. Portanto, não existe ainda na interface uma escolha de provedor de vídeo, modelo, duração de clipe ou créditos desse tipo de serviço.

O fluxo atual produz principalmente motion graphics, tipografia animada, diagramas, imagens e mídia local. Um projeto pode usar um vídeo já disponível como mídia, mas o Content2Video não solicita esse clipe a um provedor generativo.

### Evolução prevista

Uma versão futura poderá permitir a escolha por cena entre:

- composição e motion graphic do HyperFrames;
- clipe gerado por IA;
- apresentador ou avatar;
- imagem animada;
- mídia enviada ou selecionada pelo usuário.

Essa evolução deverá registrar em cada cena o provedor, o modelo, a duração, a situação da solicitação, o custo estimado e os créditos efetivamente consumidos. A integração também deverá manter um caminho de fallback para HyperFrames ou mídia local quando um provedor falhar ou não for selecionado.

## Pré-requisitos

- Node.js 22 ou superior;
- FFmpeg e FFprobe;
- `curl`, usado pela verificação de saúde do `start.sh`;
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
git clone https://github.com/inematds/content2video.git
cd content2video
cp .env.example .env
npm install
```

O `.env` real nunca é versionado. Os padrões documentados ficam em `.env.example`. Por padrão, `APP_HOST=0.0.0.0` e `PREVIEW_HOST=0.0.0.0` disponibilizam a interface e o editor em todas as interfaces de rede da máquina.

## Usar com a interface

Inicie o servidor em segundo plano:

```bash
./start.sh
```

O script cria `.runtime/content2video.pid`, grava a saída em `.runtime/content2video.log` e evita iniciar uma segunda instância. Para encerrar o servidor e os editores abertos por ele:

```bash
./stop.sh
```

O `stop.sh` valida se o PID pertence a este projeto antes de enviar `SIGTERM`, espera até 10 segundos pelo encerramento normal e usa `SIGKILL` somente se o processo não responder. Arquivos de execução em `.runtime/` não são versionados.

Na própria máquina, abra `http://127.0.0.1:3080`. Em outro computador, celular ou tablet da rede local, use o IP da máquina que executa o Content2Video, por exemplo:

```text
http://192.168.2.99:3080
http://192.168.1.172:3080
```

Liste os endereços disponíveis com `hostname -I`. O endereço `0.0.0.0` é somente o endereço de escuta do servidor e não deve ser digitado no navegador.

### Operação e diagnóstico

```bash
# iniciar
./start.sh

# consultar o processo
cat .runtime/content2video.pid

# acompanhar o log
tail -f .runtime/content2video.log

# encerrar
./stop.sh
```

`APP_PORT` continua vindo do `.env` (padrão `3080`). É possível sobrescrever parâmetros em uma execução específica:

```bash
APP_PORT=4080 ./start.sh
```

Para restringir a interface a um endereço específico, defina `APP_HOST` e `PREVIEW_HOST` antes do comando ou altere o `.env`. Os scripts priorizam variáveis informadas no terminal.

> Segurança: a interface não possui login. Use-a somente em redes confiáveis e limite a porta `3080` à LAN no firewall. Não encaminhe essa porta no roteador e não exponha o serviço diretamente à internet.

Também é possível executar em primeiro plano, útil durante desenvolvimento:

```bash
npm start
```

Na interface:

1. Cole o link da página ou artigo.
2. Se quiser orientar o recorte, preencha **Objetivo do vídeo**. Essa instrução complementa o link e define público, foco e mensagem sem substituir os fatos da fonte.
3. Escolha **9:16 Vertical** (`1080 × 1920`) ou **16:9 Horizontal** (`1920 × 1080`).
4. No dropdown **Jeito de falar**, escolha **Popular e simples**, **Conversa natural** ou **Técnico e detalhado**. O padrão popular usa frases curtas, palavras comuns e explica termos difíceis com exemplos.
5. No dropdown **Ritmo da fala**, escolha **Calma** (`-10%`), **Natural** (`+0%`) ou **Rápida** (`+12%`).
6. Mantenha **Adicionar CTA INEMA.CLUB ao final** marcado ou desmarque para produzir sem o encerramento.
7. Escolha o **Preset visual**. O padrão **Automático — plano decide** analisa fonte, público e formato para formular uma direção específica; os demais presets aplicam contratos visuais definidos. Use **Editar preset em outra tela** para ajustar paleta, tipografia, composição, movimento e mídia.
8. Clique em **Criar direção visual**. O sistema pesquisa a fonte e prepara somente o briefing, storyboard e uma cena-piloto.
9. No gate visual, confira a imagem. Use **Aprovar visual e produzir**, **Editar preset** ou **Atualizar cena-piloto**. Voz e cenas completas só são geradas depois da aprovação.
10. Durante a produção, a situação mostra a atividade atual e mantém editor, edição por prompt, cópia e render bloqueados para evitar abrir ou alterar uma composição incompleta.
11. Quando a produção terminar sem MP4, a situação mostra **Aguardando revisão**: use **Abrir editor** ou **Editar com prompt**.
12. Use **Criar cópia** quando quiser adaptar uma versão sem tocar no projeto original.
13. Clique em **Aprovar e renderizar** e baixe o MP4 pelo próprio card do projeto.
14. Quando a situação mudar para **Pronto para assistir**, o play aparece na capa e abre o MP4 final.

As duas escolhas ficam registradas no `BRIEF.md` e no `meta.json` como `conversation_style`, `speech_pace` e `voice_rate` antes da geração do áudio. Edições e regenerações preservam o estilo e o ritmo do projeto.

### Fases, retomada e cancelamento

Cada trabalho mostra seu tipo, formato, tempo total, fase atual e quanto tempo foi gasto em cada etapa. A duração da etapa ativa continua contando; as concluídas preservam o tempo final. Geração, cópia, edição por prompt e renderização possuem trilhas próprias. Enquanto o trabalho estiver na fila ou em execução, o botão **Cancelar** encerra o Codex, HyperFrames, navegador e FFmpeg associados ao processo.

A interface usa a atividade mais recente do gerador para evitar anunciar validação enquanto as cenas ainda estão sendo construídas. Um trabalho só é concluído quando o `index.html` contém uma composição montada; o arquivo inicial vazio não libera o editor.

O cancelamento preserva os arquivos produzidos até aquele momento para inspeção ou retomada. O histórico de trabalhos fica em memória durante a sessão atual do servidor; ao reiniciar a aplicação, a lista de jobs é limpa, mas os projetos e arquivos permanecem em `output/content2video/`.

Quando um render falha ou é cancelado, os arquivos válidos ficam como checkpoints em `.runtime/render-staging/`. Durante a mesma sessão do servidor, a ação **Continuar de onde parou** reutiliza esses arquivos e pula validação, renderização ou CTA que já tenham sido concluídos. As fases puladas aparecem como **reutilizada** e não ganham um novo tempo.

Esse é o comportamento padrão: continuar aproveita o que já está pronto. Use **Refazer render completo** somente quando quiser descartar o checkpoint daquela tentativa e executar todas as fases novamente. Depois que o MP4 é salvo corretamente em `output/content2video/<projeto>/renders/`, os checkpoints temporários são removidos.

### Editar visualmente ou por prompt

- O play aparece na capa somente quando existe um MP4 pronto e reproduz diretamente o vídeo final.
- **Abrir editor** abre o HyperFrames Studio para revisão e edição direta.
- **Editar com prompt** altera o projeto atual. Escreva o que deseja mudar e, de preferência, o que deve ser preservado.
- Dentro de **Editar com prompt**, o atalho **Continuar de onde parou** conclui o material incompleto, preserva o que já está correto, corrige a validação e prepara snapshots sem renderizar.
- **Criar cópia** duplica o projeto, exclui os renders antigos da cópia e aplica a instrução somente na nova pasta. A cópia recebe um nome como `<projeto>-copia` ou `<projeto>-copia-2`.

Exemplo de instrução:

```text
Retire a cena sobre preços, mantenha a voz e as cores atuais,
troque o CTA final e deixe o ritmo mais direto.
```

Edições e cópias aceitam a troca de formato e a opção de CTA no mesmo painel. O agente atualiza composição, briefing e metadados, mantém `pt-BR-FranciscaNeural` quando a saída é brasileira e roda a validação antes de liberar a revisão.

### Biblioteca de prompts para edição

Copie um bloco para **Objetivo do vídeo** ao criar uma direção ou para **Editar com prompt** em um vídeo existente. No objetivo, ele orienta a nova produção; na edição, altera o projeto atual.

**Trocar somente a direção visual**

```text
Mude somente a direção visual. Use uma estética editorial premium, com fundo escuro,
tipografia forte, uma ideia dominante por quadro e movimento curto. Preserve fatos,
roteiro, duração, voz e CTA. Evite neon, glassmorphism e cartões em excesso.
```

**Melhorar legibilidade sem redesenhar**

```text
Preserve a identidade visual atual. Melhore contraste, hierarquia e respiro.
Quebre títulos por sentido, mantenha-os dentro da área segura e dê tempo real de leitura.
Não altere roteiro, narração, imagens ou duração sem necessidade.
```

**Editorial científico**

```text
Use direção editorial científica: diagramas claros, dados com fonte visível, paleta sóbria
e tipografia precisa. Explique a relação entre causa e efeito visualmente. Evite imagens
decorativas, jargão sem explicação e aparência de apresentação corporativa.
```

**Tecnologia sem neon**

```text
Crie uma estética de tecnologia madura, com azul profundo, branco e um único acento.
Use interfaces, fluxos e detalhes reais do produto. Não use neon, grades futuristas,
códigos aleatórios, robôs genéricos ou brilho decorativo.
```

**Dados como protagonista**

```text
Transforme os números principais em uma narrativa visual. Mostre contexto, comparação
e consequência; uma métrica por momento. Preserve a precisão e escreva a fonte no quadro.
Evite gráficos 3D, eixos enganosos e contadores sem referência.
```

**Simplificar o movimento**

```text
Reduza o movimento ao necessário para orientar a atenção. Use entradas curtas, repouso
para leitura e transições motivadas pelo conteúdo. Preserve layout e identidade.
Retire flutuação contínua, parallax decorativo e animações simultâneas.
```

**Fortalecer o gancho inicial**

```text
Reescreva apenas os primeiros 5 segundos para abrir com a consequência mais concreta
da matéria. Faça a imagem provar a frase. Preserve fatos, voz, estilo e restante do vídeo.
Não use pergunta genérica nem promessa sensacionalista.
```

**Auditar área segura**

```text
Valide todas as manchetes no início, pico e fim de cada animação depois que as fontes
estiverem carregadas. Em 9:16, mantenha largura máxima de 85% e margens laterais de 7,5%.
Quebre por sentido antes de reduzir a fonte. Corrija qualquer pixel fora da área segura.
```

**Adaptar o formato corretamente**

```text
Adapte esta versão para 9:16. Recomponha cada cena para o novo quadro; não apenas recorte
ou escale o layout horizontal. Preserve roteiro, voz, identidade e tempo de leitura.
Reposicione imagens e dados para aproveitar a leitura vertical.
```

**Reutilizar o estilo de outro projeto**

```text
Use como referência visual o projeto <nome-do-projeto>: paleta, tipografia, densidade,
tratamento de imagem e ritmo de movimento. Não copie conteúdo nem estrutura de cenas.
Preserve o roteiro e a voz deste vídeo e registre a referência no briefing.
```

### CTA automático

**Adicionar CTA INEMA.CLUB ao final** vem marcado por padrão na criação, na edição por prompt e na criação de cópias. A escolha fica salva como `include_cta` no `meta.json` do projeto e aparece no card como **CTA no final** ou **Sem CTA**.

Ao clicar em **Aprovar e renderizar**, o sistema renderiza a composição editável e, quando a opção está ativa, anexa um encerramento de 5,5 segundos adequado ao formato escolhido. O CTA não é inserido nas cenas editáveis: ele é unido somente ao MP4 final. Assim, pode ser ligado ou desligado em uma edição futura sem alterar o conteúdo do vídeo.

Os arquivos reutilizados pelo render ficam em:

```text
output/content2video/inema-club-cta/renders/inema-club-cta.mp4
output/content2video/inema-club-cta/renders/inema-club-cta-16x9.mp4
```

Durante o render, a interface mostra separadamente **Renderizando vídeo** e **Adicionando CTA**. Se o CTA estiver desmarcado, essa etapa é ignorada.

O comando `npm run video:render -- <projeto>` também respeita `include_cta`. Já o comando direto `npx hyperframes render` produz somente a composição, sem fazer a união automática do CTA.

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

O comando cria `output/content2video/inema-club-promo/`, gera o material editável e valida a composição, mas não renderiza automaticamente. Depois:

```bash
npm run video:list
npm run video:check -- inema-club-promo
npm run video:preview -- inema-club-promo
npm run video:render -- inema-club-promo
```

O MP4 final fica em:

```text
output/content2video/<nome-do-projeto>/renders/<nome-do-projeto>.mp4
```

Também é possível executar o HyperFrames diretamente dentro de qualquer vídeo:

```bash
cd output/content2video/inema-club-promo
npx --yes hyperframes@0.8.20 check
npx --yes hyperframes@0.8.20 preview
npx --yes hyperframes@0.8.20 render --quality high --output renders/inema-club-promo.mp4
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

Essas duas opções controlam o agente que constrói o projeto. Nenhuma delas ativa geração de clipes de vídeo na `v1.06.00`.

## Padrões configuráveis

O `.env.example` reúne idioma, voz, duração, tolerância, nota mínima, formato, resolução, FPS, qualidade, pastas e endereços da interface. As regras editoriais executáveis também estão em `config/production-defaults.json` e `AGENTS.md`.

| Configuração | Padrão |
|---|---|
| Idioma | `pt-BR` |
| Voz | `pt-BR-FranciscaNeural` via Edge TTS |
| Duração | 60 s, faixa aceita de 42 a 78 s |
| Qualidade mínima | 8 |
| Formato | 9:16, 1080 × 1920, 30 fps |
| Formato alternativo | 16:9, 1920 × 1080, 30 fps |
| Render | MP4 em qualidade alta, após aprovação |

## Projetos de exemplo

- `output/content2video/inema-club-promo`: vídeo do INEMA.club;
- `output/content2video/zuckerberg-anti-dolly-parton`: artigo em inglês narrado com a mesma voz brasileira;
- `output/content2video/mudancas-compostas`: MVP original de aproximadamente 1 minuto.

Para validar um exemplo completo:

```bash
npm run video:check -- mudancas-compostas
ffprobe output/content2video/mudancas-compostas/renders/mudancas-compostas.mp4
```

## Estrutura

```text
app/                         interface e servidor local
config/                      padrões de produção
docs/                        plano e relatório do MVP
scripts/video.mjs            comandos de terminal
start.sh                     inicia o servidor em segundo plano
stop.sh                      encerra com segurança a instância iniciada
output/content2video/<projeto>/  fontes editáveis, mídia, snapshots e renders
.runtime/                    PID e log locais, ignorados pelo Git
.env.example                 configuração segura de referência
```

## Segurança e publicação

- não versionar `.env`, tokens, cookies ou credenciais;
- revisar direitos de uso das mídias capturadas da página de origem;
- manter a interface restrita à rede confiável enquanto estiver sem login;
- conferir manchetes na área segura e ouvir a narração antes do render final.

## Versionamento

A versão exibida segue o formato `vMAJOR.RECURSO.CORREÇÃO`:

- `v1.01.00`: novo recurso entregue; incrementa RECURSO e reinicia CORREÇÃO em `00`;
- `v1.01.01`: correção de bug sem novo recurso; incrementa somente CORREÇÃO;
- `v2.00.00`: mudança maior ou incompatível; incrementa MAJOR e reinicia os demais campos.

Os campos RECURSO e CORREÇÃO são exibidos com dois dígitos, mas ficam numericamente compatíveis com o `package.json` (`1.1.1`, por exemplo).

## Licença

Uso interno e educacional INEMA. Verifique os direitos do conteúdo-fonte e das mídias antes de distribuir cada vídeo.
