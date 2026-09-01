# Frame packet: 04-circuito

## Project inputs

- Project: /home/nmaldaner/projetos/content2video/videos/inboundcycle-que-e-webmcp
- Design tokens: /home/nmaldaner/projetos/content2video/videos/inboundcycle-que-e-webmcp/frame.md
- RULES_DIR: /home/nmaldaner/.agents/skills/hyperframes-animation/rules

## Assigned storyboard block

## Frame 4 — A chamada acontece na aba

- scene: Usuário, agente, navegador e página formam um circuito; a resposta retorna sem perder o contexto da sessão.
- voiceover: "Tudo acontece no contexto real da aba: usuário, agente, navegador e aplicação compartilham sessão, estado e controles, inclusive com confirmação humana quando necessário."
- duration: 9.336s
- poster: 6.5s
- transition_in: push-slide LEFT
- status: planned
- src: compositions/frames/04-circuito.html
- type: mechanism
- persuasion: Mechanism + trust
- beat: fluidez + segurança
- blueprint: constellation-hub (Adapt)
- asset_candidates: none — diagrama SVG local
- focal: navegador como hub do circuito
- roles: usuário = intenção; agente = decisão; navegador = contexto; página = execução

narrativeRole: Explica onde o WebMCP opera e introduz segurança sem interromper a narrativa.
keyMessage: A execução usa o contexto da sessão e pode manter o humano no circuito.

Adapt: transforma a constelação em fluxo dirigido; cada ligação é desenhada somente quando seu ator é nomeado.
Scene 1 (0.0–1.7s): a página do frame 3 reduz e ocupa o centro como “NAVEGADOR”; os outros três nós ainda estão vazios.
Scene 2 (1.7–5.2s): “USUÁRIO”, “AGENTE” e “APLICAÇÃO” surgem em sequência; conectores desenham um circuito no sentido horário.
Scene 3 (5.2–7.4s): chips “SESSÃO” e “ESTADO” atravessam o centro; a ferramenta retorna um resultado ao agente.
Scene 4 (7.4–9.0s): um selo “CONFIRMAR?” interrompe o circuito, recebe um check humano e libera a última conexão; hold estático.

## Selected blueprint: constellation-hub

# constellation-hub — Constellation / Hub + Satellites

**intent**: Labeled/iconned nodes spring into a ring/cluster around a center, then the shot resolves on the core — either by pushing the camera INTO the center (depth-of-field collapsing onto it) or by holding a hub mark while the satellites ORBIT it; the "everything connects to / sits around one center" beat.

**roles served**

- Hook (from `hook-cluster-push-in`): a constellation of tool/app nodes springs into a wide ring, then a sustained camera push-in with depth-of-field resolves on the inner core — "it connects everything / one hub for all your tools."
- Social_Proof (from `social-proof-orbit-ecosystem`): the product brand mark lands as the center hub and partner logos spring onto a ring and revolve around it — "plugs into / sits at the center of your stack."
- CTA (from `cta-orbit-collapse`): the ring resolves by COLLAPSE rather than a push-in — category icons drift around an empty central CTA, a cursor click implodes the orbit toward the click point, and the product demo springs OUT of that collapse as the answer (scope → choice → consequence → product).
- Social_Proof (from `proof-logo-chain`): a persistent center logo accrues proofs — its wordmark decodes, a claim ticker swaps, the logo glides to center, then avatars cascade into orbit with drawn connectors while partner logos scroll the bottom strip; four claims read as one statement.
- Social_Proof (from `scatter-drift-finisher`): the ecosystem beat as a
  static END CARD — a two-line serif `[headline]` is the center (no hub mark, no ring), `[~20 app
icons]` pop in scattered frame-wide in a quick stagger, then keep drifting very slowly OUTWARD
  to the end. "Connects to thousands of apps" said with count and spread, not geometry.

**duration**: 5–8s (Hook 5–6s · Social_Proof 5–8s · CTA orbit-collapse ~6s · Social_Proof
scatter-drift end card ~2.5s as a closing beat)

**shot structure**

Consolidated template — nodes ring a center, then one of two finishers resolves on the core.

- Scene 1 (0.0–~1.5s): `[bg]` (dark/space field, optionally slow-drifting diffused gradient blobs). `[primary nodes]` (circles carrying `[icon]` + label) SPRING-POP in (scale 0→1, ~1.15 elastic overshoot, staggered) arranged in a wide ring/cluster around an empty or marked center `[hub]`.
- Scene 2 (~0.7–2.5s, overlapping): smaller `[secondary nodes]` (platform / partner-logo chips) pop in staggered with the same elastic spring, filling the gaps; optional thin `[accent]` connector lines / orbit ring draw from hub→nodes. Camera holds.
- Scene 3 (~2.5–Xs, the resolve): see finisher variant below; lands and HOLDS on the magnified / orbited center to the end.

- Variant — Hook (push-in finisher): from Scene 3, a continuous smooth CAMERA PUSH-IN toward the center inner cluster — inner nodes scale up and stay sharp while outer nodes are pushed toward the edges and progressively BLUR (depth-of-field), background scales up smoothly; holds magnified on the core.
- Variant — Social_Proof (orbit finisher): the center `[brand mark]` snaps in via a quick 3D rotate that decelerates and settles; a thin `[accent]` orbit ring draws around it; `[N partner badges]` spring onto the ring (staggered overshoot) and revolve CLOCKWISE while staying upright, under a continuous slow camera ZOOM-OUT (ecosystem reveal).
- Variant — Social_Proof (optional type-push-through opener, prepended before Scene 1): centered `[headline]` types/slides in with a huge transparent-fill OUTLINE copy of the same words behind it; the outline text scales up exponentially toward camera (high-speed dolly / push-through), breaches the frame, then HARD-CUTS to the hub bg of Scene 1.
- Variant — Social_Proof (scatter-drift finisher, no ring): the center is a two-line serif
  `[headline]` building in place (not a mark); `[~20 app icons]` pop in SCATTERED across the whole
  frame in a quick stagger — no ring geometry, no connectors — then sustain a very slow outward
  drift to the end. Camera fully static: no push-in, no zoom-out; the "everything around one
  center" reads from the drift vectors pointing away from the headline. Often chained as the end
  card of a preceding UI beat (the prior card dissolves into it).

**motion vocabulary**: staggered elastic spring-pop node entrances (~1.15 overshoot); slow gradient-blob drift; connector-line / orbit-ring draw-on; 3D snap-rotate-settle on the hub mark; continuous camera push-in (inner sharp, outer depth-of-field blur, bg scale-up); clockwise orbital revolve of upright badges; continuous slow camera zoom-out (ecosystem reveal); optional outline-text push-through dolly entry. Scatter-drift finisher: frame-wide scattered icon pop-in (staggered, no ring); sustained slow
outward icon drift; in-place two-line serif headline build; static-frame hold to the end.

**rule mapping** (motion verb → `rules/<id>.md`)

- staggered spring-pop node entrances → `spring-pop-entrance` (elastic overshoot) + `gsap-effects` (stagger recipe); 3D-flip-in flavor → `orbit-3d-entry`
- ring / cluster layout of nodes around a center → `avatar-cloud-network` (nodes on an elliptical ring + SVG lines to a center)
- icons on the nodes → `svg-icon-enrichment`
- connector lines hub→node → `svg-path-draw`
- orbit-ring draw-on → `svg-path-draw`
- slow gradient-blob drift → `sine-wave-loop` (idle looped drift)
- 3D snap-rotate-settle on hub mark → `orbit-3d-entry` (3D-flip entry); technique CSS-3D
- clockwise orbital revolve of upright badges → `orbit-3d-entry` (continuous elliptical orbit); technique MotionPath
- camera push-in toward center → `multi-phase-camera` (PUSH-in) + `coordinate-target-zoom` (target the core)
- background scale-up during push-in → `multi-phase-camera`
- continuous slow zoom-out (ecosystem reveal) → `multi-phase-camera` (pull-back) / `coordinate-target-zoom`
- outline-text push-through dolly opener (Social_Proof) → `3d-text-depth-layers` (outline copy behind) + `multi-phase-camera` (push-through)
- depth-of-field blur on outer nodes during push-in → `depth-of-field-blur` (progressive DOF/focus-falloff blur on the off-center outer nodes while the inner core stays sharp)
- frame-wide scattered icon pop-in (no ring) → `spring-pop-entrance` (staggered group) +
  `gsap-effects` (stagger recipe); positions pre-baked scattered — NOT `avatar-cloud-network`'s
  elliptical ring
- sustained slow outward icon drift → `center-outward-expansion` (outward vectors, slow sustained
  register — drift targets sit slightly past the pop-in positions)
- in-place serif headline build → `gsap-effects` (staggered line/word reveal)

**camera modifier**: push-in-with-DOF (Hook) — `multi-phase-camera` PUSH-in targeted via `coordinate-target-zoom` onto the core; the focus-falloff blur half of it is backed by `depth-of-field-blur`. Orbit finisher (Social_Proof) — slow continuous zoom-out via `multi-phase-camera` (pull-back) while satellites revolve. Scatter-drift finisher (Social_Proof end card) — none: the frame never moves; the outward drift
is element-level.
