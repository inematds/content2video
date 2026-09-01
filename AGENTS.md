# Padrão Content2Video INEMA

Estas regras valem para novos vídeos deste repositório. Não altere vídeos existentes apenas para adequá-los ao padrão; faça isso somente quando o usuário pedir uma correção retroativa.

## Voz e idioma

- O idioma de saída, e não o idioma da fonte, determina a voz da narração.
- Para saída em português brasileiro, use sempre `edge-tts` com `pt-BR-FranciscaNeural`.
- Mantenha a mesma voz em todas as cenas, regenerações e versões de um projeto.
- Uma página ou artigo em inglês traduzido para português continua usando a voz brasileira padrão.
- Só troque o idioma ou a voz quando o usuário pedir explicitamente. Ao trocar o idioma, escolha uma voz nativa desse idioma e mantenha-a no vídeo inteiro.
- Registre `language`, `voice_provider` e `voice_id` no briefing e nos metadados antes de gerar o áudio. Não use uma voz genérica ou estrangeira como fallback silencioso.

## Manchetes e títulos

- Em 9:16, mantenha todo título principal dentro de 7,5% de margem lateral e 6% de margem vertical. A largura máxima é 85% do quadro e a altura máxima recomendada do bloco é 24%.
- Faça o ajuste depois de `document.fonts.ready`; uma fonte substituta não serve como prova de encaixe.
- Se o título não couber, nesta ordem: quebre a linha por sentido, reduza responsivamente o tamanho e compacte levemente o tracking. Nunca corte, esconda ou deixe texto escapar do quadro.
- Valide a caixa real do título com `getBoundingClientRect()` no estado de maior escala da animação, não apenas no quadro parado.
- A auditoria deve incluir início, pico e fim de cada animação de manchete. Qualquer pixel fora da área segura bloqueia a prévia.

Os valores executáveis ficam em `config/production-defaults.json`.

## Diretório de saída

- Todo projeto de vídeo é local e deve ser criado em `output/content2video/`.
- Não rastreie no Git o conteúdo de `videos/` nem de `output/content2video/`.
