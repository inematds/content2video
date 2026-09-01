---
workflow: product-launch-video
flow: automation
storyboard: no
message: "A disputa vencível agora não é esperar pelo WebMCP: é fazer sua marca ser citada nas respostas de IA"
destination: vertical-social
aspect: 1080x1920
aspect_ratio: 9:16
width: 1080
height: 1920
fps: 30
language: pt-BR
audience: "profissionais de marketing, SEO e líderes de crescimento"
length: 60s
angle: "do futuro do WebMCP à vantagem prática de visibilidade em IA hoje"
narration: yes
voice_provider: edge-tts
voice_id: pt-BR-FranciscaNeural
quality_target: 8
---

## Intent

Vídeo promocional vertical, em português brasileiro, que usa a provocação da
landing page da Semrush: WebMCP sinaliza para onde a descoberta está indo, mas
a batalha concreta de hoje é ser citado e recomendado por respostas de IA. O
filme deve vender clareza e ação, não explicar a especificação técnica em
detalhe.

## Assets

- https://www.semrush.com/lp/web-mcp/en/ — fonte oficial para mensagem, marca,
  telas, gráficos e alegações.

## Customizations

- Formato 9:16 em 1080x1920, 30 fps.
- Duração-alvo de 60 segundos, aceitável entre 42 e 78 segundos.
- Narração obrigatória em todas as cenas com `edge-tts` e
  `pt-BR-FranciscaNeural`; não usar fallback silencioso.
- Manchetes respeitam 7,5% de margem lateral, 6% vertical, largura máxima de
  85% e bloco recomendado de até 24% da altura, inclusive no pico da animação.
- Incluir mídia local, snapshots e auditoria real das caixas de título após
  `document.fonts.ready`.

## Notes

- Não renderizar MP4 nesta etapa; a aprovação ocorrerá na interface.
- Qualidade mínima esperada: 8/10.
- Usar somente afirmações rastreáveis à página capturada.
