---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "AGI não é apenas uma IA mais poderosa: é a hipótese de uma inteligência capaz de aprender e transferir conhecimento entre domínios"
destination: vertical-social
aspect: 1080x1920
aspect_ratio: "9:16"
width: 1080
height: 1920
fps: 30
language: pt-BR
audience: "pessoas interessadas em tecnologia, negócios e inteligência artificial"
length: 60s
angle: concept
narration: yes
voice_provider: edge-tts
voice_id: pt-BR-FranciscaNeural
quality_target: 8
style_preset: code-editorial
---

## Intent

Explainer vertical em português brasileiro, baseado no artigo da AWS, que
separa a inteligência artificial atual da hipótese de uma inteligência
artificial geral. O vídeo deve explicar em um minuto o salto de propósito
específico para transferência entre domínios, os blocos cognitivos que esse
salto exigiria e por que a AGI continua sendo uma meta teórica.

## Assets

- https://aws.amazon.com/pt/what-is/artificial-general-intelligence/ — artigo-fonte pesquisado e preservado em `capture/extracted/visible-text.txt`.

## Customizations

- Formato 9:16, 1080x1920, 30 fps.
- Duração-alvo de 60 segundos; intervalo aceitável de 42 a 78 segundos.
- Narração em todas as cenas com `edge-tts` e `pt-BR-FranciscaNeural`, sem fallback silencioso.
- Mídia congelada localmente; sem dependências de rede durante prévia ou render.
- Manchetes com 7,5% de margem lateral, 6% vertical, largura máxima de 85% e bloco recomendado de até 24% da altura.
- Ajuste tipográfico somente depois de `document.fonts.ready`; medir início, pico e fim das animações.
- Gerar snapshots e rodar `hyperframes check` antes da prévia.

## Notes

- Não renderizar o MP4 nesta etapa. A aprovação ocorrerá na interface HyperFrames.
- Tratar AGI como conceito teórico e meta de pesquisa, não como tecnologia já alcançada.
- Diferenciar explicitamente AGI de IA generativa e de sistemas de propósito específico.
- Qualidade mínima esperada: 8/10.
