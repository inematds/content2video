# Roadmap do Content2Video

## Convenção de versão

A versão pública usa `vMAJOR.RECURSO.CORREÇÃO`, começando em `v1.00.00`.

- RECURSO (`xx`) sobe quando uma funcionalidade é entregue e CORREÇÃO volta a `00`.
- CORREÇÃO (`yy`) sobe a cada conserto sem mudança funcional.
- MAJOR só muda quando houver uma evolução grande ou incompatível; ao chegar em `v2`, os outros campos voltam a `00`.
- O `package.json` mantém a forma numérica equivalente, sem zeros à esquerda, e a interface aplica a apresentação com dois dígitos.

## Próximos recursos

### Versões mais avançadas

- [ ] Integrar provedores de vídeo generativo e apresentadores.
  - Permitir escolher por cena entre HyperFrames, clipe de IA, avatar, imagem animada e mídia do usuário.
  - Registrar provedor, modelo, duração, situação e identificador externo de cada solicitação.
  - Manter fallback para HyperFrames ou mídia local quando a geração externa falhar.
  - Tratar autenticação, limites, cancelamento, repetição e falhas de cada provedor sem expor chaves na interface.

- [ ] Medir e mostrar o custo em créditos de cada etapa da produção.
  - Exibir créditos consumidos por fase e o total acumulado do trabalho.
  - Separar custos de geração, mídia, voz, validação, renderização e CTA quando o provedor fornecer esses dados.
  - Mostrar uma estimativa antes de iniciar e o custo real depois da conclusão.
  - Registrar os valores no histórico do trabalho para comparação entre versões e formatos.

- [x] Permitir cancelar uma geração ou renderização em andamento pela interface.
  - O botão **Cancelar** aparece somente em trabalhos canceláveis.
  - Processos filhos do Codex, HyperFrames, navegador e FFmpeg são encerrados em grupo.
  - O estado final `cancelled` permanece separado de `failed`.
  - Os arquivos já produzidos são preservados para inspeção ou retomada.
  - Há confirmação antes do cancelamento e fallback de encerramento forçado.
- [x] Exibir as fases de geração, cópia, edição e renderização.
- [x] Editar um projeto existente por prompt sem remover o editor visual.
- [x] Criar uma cópia adaptada por instrução, preservando o original.
- [x] Escolher entre os formatos 9:16 e 16:9.

Recursos entregues na versão `v1.01.00`.

### v1.02.00

- [x] Registrar o início e o fim de cada fase do trabalho.
- [x] Mostrar a duração de cada etapa e o tempo total na interface.
- [x] Continuar atualizando o relógio da etapa ativa durante a produção.

### v1.03.00

- [x] Oferecer CTA INEMA.CLUB opcional na criação, edição e cópia, marcado por padrão.
- [x] Salvar a preferência de CTA nos metadados de cada projeto.
- [x] Preparar encerramentos próprios para 9:16 e 16:9.
- [x] Anexar automaticamente o CTA ao final do MP4 aprovado, sem alterar a composição editável.
- [x] Mostrar **Adicionando CTA** como etapa da renderização.
- [x] Documentar a arquitetura e deixar explícito que a versão atual não integra geração externa de clipes ou avatares.

### v1.04.00

- [x] Preservar checkpoints de renderização quando uma tentativa falhar ou for cancelada.
- [x] Permitir **Continuar de onde parou**, reutilizando validação, render e CTA já concluídos.
- [x] Permitir **Refazer render completo** como escolha explícita.
- [x] Identificar na interface as fases reutilizadas.
- [x] Criar a pasta `renders/` antes de salvar o MP4 final.

## Correções entregues

### v1.01.01

- [x] Tornar o play da capa clicável para abrir a prévia e revisão.
- [x] Renomear a ação visual para **Abrir editor**.
- [x] Adicionar os atalhos **Continuar de onde parou** e **Corrigir e validar** à edição por prompt.

### v1.01.02

- [x] Mostrar play somente quando existe MP4 pronto e reproduzir o arquivo diretamente.
- [x] Exibir a situação do projeto: fase ativa, **Aguardando revisão** ou **Pronto para assistir**.

### v1.01.03

- [x] Não liberar editor, edição, cópia ou render enquanto o projeto estiver em produção.
- [x] Derivar a fase visível da atividade mais recente para não anunciar validação durante a criação das cenas.
- [x] Recusar como concluída uma produção cujo `index.html` ainda seja apenas a composição inicial vazia.
- [x] Evitar a falha de sandbox do Codex nas próximas execuções autônomas.
