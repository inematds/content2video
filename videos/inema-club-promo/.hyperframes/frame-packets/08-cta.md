# Frame packet: 08-cta

## Project inputs

- Project: /home/nmaldaner/projetos/content2video/videos/inema-club-promo
- Design tokens: /home/nmaldaner/projetos/content2video/videos/inema-club-promo/frame.md
- RULES_DIR: /home/nmaldaner/.claude/skills/hyperframes-animation/rules

## Assigned storyboard block

## Frame 8 — Entre e construa

- scene: Aprenda, Pratique e Evolua fecham em sequência; o endereço INEMA.CLUB torna-se a ação principal.
- voiceover: "Entre em inema ponto club. Escolha sua trilha. Construa algo real. E evolua com inteligência artificial."
- duration: 7.92s
- poster: 5.8s
- transition_in: squeeze
- status: outline
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

## Selected blueprint: cta-morph-press

# cta-morph-press — CTA Morph & Press

**intent**: A resting brand mark condenses at the same screen center into a smaller, brighter CTA, then a cursor arrives from off-stage and lands a human-aimed click on it. The viewer's eye is walked from "this is who we are" to "and this is what you do." The morph and the click are the two headline beats.

**roles served**

- CTA (from `cta-morph-press`): when the close moves from brand identity to a single user action, two elements share the same center sequentially (a morph, not a cut), and the payoff is a simulated click with physical feedback. Reach for it for a focused "click here" sign-off — no spatial set, no multi-step UI (that's `cursor-ui-demo`).
- Hook (ROLE-WIDENED, from `widget-morph-on-blank-field`): the same
  machinery run as an OPENER — a lone `[widget]` (pill / chip lockup) on a flat field transforms
  in place, performs its payload, then vanishes to a plain frame that a typed `[title]` resolves.
  The click, when present, ignites the morph rather than closing it; there may be no cursor at
  all. Reach for it when the product hook IS one widget doing one thing — still no spatial set,
  no multi-step UI (that's `cursor-ui-demo`). Mint-reconsideration trigger: if future mining
  brings 2+ more widget-morph openers with the vanish → typed-title resolve, promote this variant
  to its own blueprint (the beat order is fully inverted by then).

**duration**: 4–6s (Hook widget-morph opener 5–7.5s)

**shot structure** (a `[bg]` canvas; hero and CTA are flex-centered siblings sharing one `transform-origin`)

- **Scene 1 (0.0–~1.4s) — presence.** The `[hero mark / brand lockup]` holds dead-center, alive but resting — only a faint rotational breath on the mark; any title text under it stays rock-stable. Camera static.
- **Scene 2 (~1.4–2.4s) — the morph (signature move).** The hero CONDENSES at the same screen center into a smaller, brighter `[CTA]` (button / card): the outgoing mark shrink-fades exactly as the CTA scales up in its place. Because they share one `transform-origin`, the eye reads it as one element transforming, not a swap.
- **Scene 3 (~2.4–3.4s) — approach.** A `[cursor]` arrives from off-stage on a **decelerating** path (it "arrives," it does not pass through) and lands a few px **off** the CTA's geometric center, so the aim reads human, not scripted.
- **Scene 4 (~3.4–end) — press.** The cursor lands a physical CLICK — cursor and CTA compress together in lockstep, then release with feedback (an optional ripple / glow bloom). Holds on the clicked state.
- **Variant — Hook (widget-morph opener)** (from `widget-morph-on-blank-field`;
  reorders the beats — press first, morph second, title last). **(1) presence**: a lone
  `[pill / chip lockup]` sits centered on a flat `[field]`; optionally the `[cursor]` glides in, a
  hover pill-background appears behind the chip, and the click lands with the same lockstep press.
  **(2) the morph**: the widget transforms IN PLACE — expands downward anchored at its top edge
  into a `[menu]`, or spring-morphs outward into a `[prompt card]` with a small overshoot settle —
  new content fades/slides into place. **(3) payload**: the transformed state performs —
  `[placeholder]` types with a blinking caret, `[user text]` types while a control flips from
  muted to its vibrant active color, or the menu snap-collapses back to the pill carrying the
  `[new value]` + a checkmark pop; the background may snap to a new color under the persistent
  foreground card. **(4) resolve**: the widget VANISHES; a plain frame closes the beat — a
  `[closing title]` types on center, or a hold on the flipped solid.

**motion vocabulary**: faint rotation-only resting breath (logo scope only); same-center morph-swap (shrink-fade ↔ scale-up sharing `transform-origin`); cursor decel-arrival from off-stage; off-center human aim; lockstep press compression; release feedback ripple / glow. Hook opener: anchored downward expand of a pill into a menu and springy snap-collapse back;
chip-to-card spring morph with overshoot settle; placeholder / user-text typewriter with blinking
caret (may cut mid-word); control color-state flip muted → vibrant; background color snap under a
persistent foreground card; checkmark pop; widget vanish to blank frame; typed closing title.

**rule mapping**

- hero → CTA condense at one center → `scale-swap-transition` (shared `transform-origin: 50% 50%` is what sells the morph; CTA `position: absolute` so it doesn't shove the hero during the brief overlap)
- resting-hero aliveness (rotation only, scoped to the mark so the Phase-2 scale doesn't fight it) → `sine-wave-loop` (low-amplitude rotation register — subtle jitter, not a scale breath)
- cursor press + release in lockstep (single-target-array so both compress together) → `physics-press-reaction` (PRESS_DOWN + RELEASE portion)
- cursor approach (decel from off-stage, off-center landing, hard-cut opacity in) → `gsap-effects` (translate on `power2.out`)
- click ripple / release glow → `cursor-click-ripple` (attack-decay ring) and/or `ambient-glow-bloom` (release bloom)
- (Hook) chip → prompt-card spring morph at one center → `scale-swap-transition` (the base morph
  contract, run in the expand direction) + `card-morph-anchor` (corner-radius / surface ride-along)
- (Hook) anchored-edge expand / snap-collapse (pill ↔ menu, top edge pinned) →
  `anchored-layout-expand` (edge-anchored directional container growth — origin-pinned expansion
  with counter-scaled children; `card-morph-anchor` stays for uniform-scale morphs only)
- (Hook) placeholder + user typing, blinking caret, mid-word cut → `gsap-effects` (typewriter) +
  `context-sensitive-cursor` (blink) + `discrete-text-sequence` (mid-word cut states)
- (Hook) control color flip muted → vibrant → `press-release-spring` (color-transition variation)
- (Hook) checkmark pop / card-arrival overshoot → `spring-pop-entrance`
- (Hook) hover pill-background + igniting click → the base's `physics-press-reaction` +
  `cursor-click-ripple` mappings apply unchanged

**camera modifier**: camera-static — the morph and click happen in element space; a camera move would compete with the click as the climax. The Hook opener keeps the same contract — even the background color flip is an element-level
snap, not a camera event.

## Selected motion rule: cursor-click-ripple

---
name: cursor-click-ripple
description: Animated mouse cursor moves to target, clicks with scale depression and expanding ripple rings.
metadata:
  tags: cursor, click, ripple, interaction, mouse, button
---

# Cursor Click Ripple

An animated cursor moves to a target element, performs a click with visual depression, and emits expanding ripple rings from the click point. Three sequential phases on one timeline: **move** (eased translation to the target's center) → **click** (scale depression on cursor + target together, yoyo back) → **ripple** (1–3 staggered rings expand and fade from the click point). This is a _point event at one location_ — a sustained hold across space is [cursor-drag.md](cursor-drag.md).

## Recipe

```html
<button class="target-button">{ctaLabel}</button>
<div class="cursor"><!-- arrow SVG, positioned at the entry corner --></div>
<!-- Rings live in DOM from t=0 at the click-target CENTER, scale 0 + opacity 0 -->
<div class="ripple ripple-1"></div>
<div class="ripple ripple-2"></div>
<div class="ripple ripple-3"></div>
```

```css
.ripple {
  position: absolute;
  left: 50%;
  top: 50%; /* click-target center */
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid {rippleColor};
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
}
```

```js
// Phase 1 — Move: eased, not linear
tl.to(".cursor", { x: TARGET_X, y: TARGET_Y, duration: MOVE_DUR, ease: MOVE_EASE }, 0);

// Phase 2 — Click: cursor + target depress together, then return
tl.to(
  ".cursor",
  { scale: CURSOR_PRESS_SCALE, duration: PRESS_DUR, ease: "power2.in", yoyo: true, repeat: 1 },
  CLICK_AT,
);
tl.to(
  ".target-button",
  { scale: TARGET_PRESS_SCALE, duration: PRESS_DUR, ease: "power2.in", yoyo: true, repeat: 1 },
  CLICK_AT,
);

// Phase 3 — Ripple burst, N rings staggered from the click point
tl.set([".ripple-1", ".ripple-2", ".ripple-3"], { opacity: 1 }, RIPPLE_AT);
tl.to(
  [".ripple-1", ".ripple-2", ".ripple-3"],
  {
    scale: RIPPLE_SCALE,
    opacity: 0,
    duration: RIPPLE_DUR,
    ease: RIPPLE_EASE,
    stagger: RIPPLE_STAGGER,
    immediateRender: false, // holds scale 0 / opacity 0 until the click moment
  },
  RIPPLE_AT,
);
```

## Variations

- **Single ring** — one `.ripple`, no stagger; more elegant when the rest of the scene is busy.
- **Keyframed attack-decay** — a `keyframes` block ramps opacity 0 → peak → 0 across the duration; a clearer "energy radiates and dissipates" envelope.
- **Multi-ring expanding pulse** — 3 rings at 0.08 s stagger when the click is the scene's climactic moment.

## Values

| token                       | range                       | notes                                                                                                                                  |
| --------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| MOVE_DUR                    | 0.4–1.0 s                   | short darts; long reads as a "considered click." Must end before CLICK_AT or it reads as a misclick                                    |
| MOVE_EASE                   | discrete choice             | `power2.inOut` calm · `power3.out` decisive · `back.out(1.2–1.4)` settles onto the button with a tiny recoil (higher reads cartoonish) |
| CLICK_AT                    | `MOVE_DUR + 0–0.3 s`        | zero pause reads as autopilot; >0.3 s reads as hesitation                                                                              |
| PRESS_DUR                   | 0.06–0.12 s (half; yoyo ×2) | short crisp, long mushy; must finish before the next phase needs normal scale                                                          |
| CURSOR / TARGET_PRESS_SCALE | 0.80–0.90 / 0.92–0.97       | cursor compresses MORE than the target — the cursor is the actor, the target the recipient                                             |
| RIPPLE_AT                   | `CLICK_AT + 0–0.08 s`       | simultaneous feels causal; slight delay feels acoustic                                                                                 |
| RIPPLE_DUR                  | 0.5–1.0 s                   | sharp ping vs soft sonar; must complete before anything that needs the ring gone                                                       |
| RIPPLE_SCALE                | 3–6                         | 3 stays near the click site; if the ring would exit the frame before fading, lower it                                                  |
| RIPPLE_STAGGER              | 0.06–0.12 s (or 0)          | below ~0.06 s reads as one thick ring; above ~0.12 s as separate events                                                                |
| RIPPLE_EASE                 | discrete choice             | `power2.out` standard ping · `power3.out` sharper attack · `expo.out` strong distant pulse                                             |
| TARGET_X / TARGET_Y         | layout-derived              | must match the target's visual centroid — a 4 px miss reads as missing the button                                                      |

Reference values: `../../examples/cta-orbit-collapse.html` — 0.5 s move on `back.out(1.3)`, click +0.2 s, press 0.08 s at 0.85/0.95, single ring to 5× over 0.7 s `power2.out`.

## Critical Constraints

- **Move before click** — trigger the click only after the move tween settles; clicking mid-motion reads as unintentional.
- **Rings live in DOM from t=0** at the click-target center with `scale: 0` + `opacity: 0` — never conditionally rendered; `immediateRender: false` on the expand so they hold invisible until the trigger.
- **Ripple from the click point** — the button's visual center, not any element's bounding-box origin.
- **Synchronized depression** — cursor + target depress at the same position with the same duration, and both yoyo back.
- **Cursor above all content** (high z-index) for the whole sequence; `pointer-events: none` on cursor + ripples.

## See also

`orbit-3d-entry` (click as the pivot that collapses orbiters) · `center-outward-expansion` (click triggers an outward burst) · `press-release-spring` (stronger physical feel on the target) · `scale-swap-transition` (the button's post-click state change).

## Selected motion rule: physics-press-reaction

---
name: physics-press-reaction
description: Cursor + element synchronized press via subtractive spring forces — cursor lands on element, both compress together, then release. Distinct from press-release-spring (which has no cursor).
metadata:
  tags: spring, click, physics, cursor, subtractive, interaction, synchronized
---

# Physics Press Reaction (Cursor + Element Synced)

Models a real click: a cursor approaches a button, lands, and both compress IN SYNC, then release together. Distinct from [press-release-spring.md](press-release-spring.md) (no cursor — just a press happening); this rule is the COMBINED cursor + element behavior. A single `PRESS_INTENSITY` drives both: press down compresses both to `1 - PRESS_INTENSITY` via **one targets array**, release springs both back to 1.0 with overshoot. The cursor translates to the button's center BEFORE the press starts; after release it may move on or hold.

## Recipe

```html
<button class="btn" id="btn">{ctaCopy}</button>
<!-- Cursor at scene-root level so it translates freely; arrow TIP is the click
     point, so transform-origin: 0 0 — scaling around the tip keeps it stable. -->
<svg class="cursor" id="cursor" style="pointer-events: none; transform-origin: 0 0">…</svg>
```

```js
gsap.set("#cursor", { x: CURSOR_START_X, y: CURSOR_START_Y }); // off-screen / far corner

// Phase 1 — approach
tl.to(
  "#cursor",
  { x: BUTTON_CENTER_X, y: BUTTON_CENTER_Y, duration: APPROACH_DUR, ease: "power2.inOut" },
  APPROACH_START,
);

// Phase 2 — coordinated press down: ONE targets array, same scale
tl.to(
  ["#btn", "#cursor"],
  { scale: 1 - PRESS_INTENSITY, duration: PRESS_DOWN_DUR, ease: "power1.in" },
  PRESS_DOWN_AT,
);

// Phase 3 — release: both spring back together
tl.to(
  ["#btn", "#cursor"],
  { scale: 1, duration: RELEASE_DUR, ease: `back.out(${BOUNCE_FACTOR})` },
  RELEASE_AT,
);

// Phase 4 — inner glow during press, resting shadow on release (contact confirmation)
tl.to(
  "#btn",
  { boxShadow: "{btnPressedShadow}", duration: PRESS_DOWN_DUR, ease: "power1.in" },
  PRESS_DOWN_AT,
);
tl.to(
  "#btn",
  { boxShadow: "{btnRestingShadow}", duration: RELEASE_DUR, ease: "power2.out" },
  RELEASE_AT,
);

// Cursor optionally exits after the press settles
tl.to(
  "#cursor",
  { x: CURSOR_EXIT_X, y: CURSOR_EXIT_Y, duration: CURSOR_EXIT_DUR, ease: "power2.out" },
  CURSOR_EXIT_AT,
);
```

## Variations

- **Multiple-element chain press** — press button A → A triggers a swap → cursor moves to button B → presses again; each press is one full down-release sub-routine.
- **Hold press (continuous pressure)** — insert a `HOLD_DUR` window between press-down and release: both scales stay at `1 - PRESS_INTENSITY`, inner glow stays on. Suggests "thinking" or "loading."
- **Synchronized inner-glow pulse** — during the hold, pulse the inset glow with a sine driver: a `{ p: 0 }` proxy tweened to `Math.PI * GLOW_PULSE_CYCLES * 2` on `ease: "none"`, `onUpdate` writing `boxShadow` with `alpha = GLOW_BASE_ALPHA + sin(p) * GLOW_PULSE_AMP`. Suggests "processing."

## Values

| token               | range / rule                             | notes                                                                                  |
| ------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------- |
| APPROACH_START      | 0–0.3 s                                  | long delays read as a dead frame                                                       |
| APPROACH_DUR        | 0.7–1.3 s                                | faster = urgent, slower = deliberate                                                   |
| PRESS_DOWN_AT       | `= APPROACH_START + APPROACH_DUR`        | cursor arrives exactly as the press begins — avoids "tapping on air"                   |
| PRESS_DOWN_DUR      | 0.1–0.25 s                               |                                                                                        |
| RELEASE_AT          | > `PRESS_DOWN_AT + PRESS_DOWN_DUR`       | optional 0.05–0.4 s hold (or `HOLD_DUR` 0.3–0.8 s) for "thinking" interactions         |
| RELEASE_DUR         | 0.4–0.7 s                                | long enough for the overshoot to settle                                                |
| PRESS_INTENSITY     | 0.05 subtle · 0.10 standard · 0.15 heavy | applied to both cursor and button via the single targets array                         |
| BOUNCE_FACTOR       | 1.6 soft · 2.0 firm · 2.4 cartoony       |                                                                                        |
| CURSOR_START / EXIT | off-screen or far corner                 | the approach must read as motion-in, not a teleport; exit ≥ `RELEASE_AT + RELEASE_DUR` |
| BUTTON_CENTER       | measured                                 | for `place-items: center` at 1920×1080: `(960, 540)`                                   |
| BRAND_REVEAL_AT     | < `PRESS_DOWN_AT`                        | context precedes interaction                                                           |
| glow pulse          | 1–4 cycles; base α 0.15–0.3; amp 0.1–0.2 | `GLOW_BASE_ALPHA − GLOW_PULSE_AMP ≥ 0`                                                 |
| CURSOR_SIZE         | 48–96 px at 1080p                        |                                                                                        |

## Critical Constraints

- **Same press scale on cursor AND button** (one targets array) — only the button scaling makes the cursor "tap on air"; only the cursor scaling makes the button feel disconnected.
- **Cursor arrives BEFORE the press starts** — a clear "cursor over target" moment, or the press is unattributed.
- **`back.out(BOUNCE_FACTOR)` on the release, for both together** — a linear release loses the tactile feel; release MUST come after press.
- **Inner glow appears DURING press, fades on release** — outer shadow shrinks (pushed in), inner glow appears (energy concentrated).
- **Cursor `transform-origin: 0 0`** — the arrow's tip is the click point; scale around the tip keeps it stable. `pointer-events: none` on the cursor.
- **Climax dwell ≥ 1 s** — after release the composition must continue ≥ 1 s; the press is a beat, the viewer needs time to see the result.
- **No real `mouseenter` / `click` events** — HF is a render context; everything runs via the timeline.

## See also

`press-release-spring` (the BUTTON-only press; this rule layers the cursor on top) · `cursor-click-ripple` (adds a ripple at the click point) · `scale-swap-transition` (the press TRIGGERS the swap).

## Selected motion rule: scale-swap-transition

---
name: scale-swap-transition
description: Coordinated shrink-out + spring pop-in morph-like transition between two elements — no SVG path interpolation needed.
metadata:
  tags: transition, morph, scale, swap, spring, pop
---

# Scale-Swap Transition

Simulates a "morph" between two DOM elements by overlapping exit and entrance scale animations. Lighter weight than [card-morph-anchor.md](card-morph-anchor.md) (which morphs container dimensions — use that for SHAPE changes; this rule is for SAME-shape state swaps) and easier than SVG path interpolation.

At a single trigger, two coordinated tweens fire:

1. **Outgoing**: scale `1.0 → EXIT_SCALE` + opacity `1 → 0`, fast `power2.in` (rushing away).
2. **Incoming**: scale `EXIT_SCALE → 1.0` + opacity `0 → 1`, `back.out(BOUNCE_FACTOR)` (arriving with weight).

A small `OVERLAP` window during which both are mid-tween creates the morph illusion; the incoming sits on top via z-index so the outgoing's fade-tail doesn't bleed through.

## Recipe

```html
<!-- Both cards position: absolute; inset: 0 in one fixed-size wrapper — same
     footprint, same transform-origin: 50% 50%. Incoming starts opacity: 0,
     transform: scale(EXIT_SCALE), z-index above the outgoing. -->
<div class="swap-wrap">
  <div class="card outgoing" id="outgoing">{outgoingIcon} {outgoingLabel}</div>
  <div class="card incoming" id="incoming">
    {incomingIcon} {incomingLabel}
    <div class="sub" id="sub">{incomingSubline}</div>
  </div>
</div>
```

```js
// Outgoing: shrink + fade fast
tl.to(
  "#outgoing",
  { scale: EXIT_SCALE, opacity: 0, duration: EXIT_DUR, ease: "power2.in" },
  TRIGGER,
);

// Incoming: pops in with overshoot, starting OVERLAP before the exit finishes
tl.to(
  "#incoming",
  { scale: 1.0, opacity: 1, duration: ENTER_DUR, ease: `back.out(${BOUNCE_FACTOR})` },
  TRIGGER + EXIT_DUR - OVERLAP,
);

// Inner content reveals AFTER the incoming settles
tl.fromTo(
  "#sub",
  { opacity: 0, y: SUB_REVEAL_Y_PX },
  { opacity: 1, y: 0, duration: SUB_REVEAL_DUR, ease: "power3.out" },
  TRIGGER + EXIT_DUR + SUB_REVEAL_DELAY,
);
```

## Variations

- **Delayed inner content reveal** — the classic pattern above: morph the container, then reveal inner text once it settles; the 0.2–0.4 s gap lets the eye land on the new shape before reading.
- **Triple swap (3-state cycle)** — chain A→B→C with triggers `TRIGGER_AB` / `TRIGGER_BC`; each transition is its own tween pair, the previous incoming becoming the next outgoing. State-evolution narratives (early → mid → final labels).
- **Color-shift transition (no scale)** — for a flat morph between same-shape states, drop the scale and keep opacity + a brief background hue tween; less dramatic, more product-UI tone.

## Values

| token            | range                                 | notes                                                                                                  |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| TRIGGER          | ≥ outgoing settled + a presence-dwell | the outgoing must "land" before transforming                                                           |
| EXIT_DUR         | 0.3–0.5 s                             |                                                                                                        |
| ENTER_DUR        | 0.45–0.7 s                            | longer than `EXIT_DUR` so the overshoot can settle                                                     |
| OVERLAP          | 0.1–0.2 s                             | >0.3 s both are clearly visible together (no morph); <0.05 s leaves a visible empty gap                |
| EXIT_SCALE       | 0.6–0.8                               | smaller exits feel dramatic but risk reading as "vanish" instead of "morph"                            |
| BOUNCE_FACTOR    | 1.4 soft · 1.8 firm · 2.2 cartoony    |                                                                                                        |
| SUB_REVEAL_DELAY | 0.2–0.4 s                             | reveals during the morph compete with the swap for attention                                           |
| BRAND_REVEAL_AT  | < TRIGGER                             | context (brand, eyebrow) sets the stage early; revealed AT the swap it competes with the headline beat |

## Critical Constraints

- **Incoming z-index ABOVE outgoing** — otherwise the outgoing's fade-tail (opacity 0.3–0.5) bleeds through and double-exposes the frame.
- **Both elements share `transform-origin: 50% 50%`** — different origins make the morph read as one thing teleporting elsewhere.
- **Bouncy ease ONLY on the incoming** — outgoing `power2.in`, incoming `back.out`; reversed, the swap feels mechanical.
- **Both cards `position: absolute; inset: 0`** in the same fixed-size wrapper (sized to fit both states; the wrap never resizes).
- **Don't `display: none` the outgoing** after the fade — leave it at `opacity: 0` so layout doesn't reflow.
- **Inner content reveals after the container settles**; **climax dwell ≥ 1 s** after the final state + subline land.

## See also

`press-release-spring` (a button press TRIGGERS the swap — cause and effect) · `card-morph-anchor` (shape-changing alternative) · `reactive-displacement` (when the replacement should read as a causal collision) · `sine-wave-loop` (idle breathing on the final state).
