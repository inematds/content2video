# Content2Video INEMA

**🇧🇷 [Português](README.md) · 🇺🇸 [English](README.en.md) · 🇪🇸 [Español](README.es.md)**

Entra un enlace, sale un video editable. El proyecto lee una página, crea el guion, el storyboard, la narración, los subtítulos y el motion design en HyperFrames, deja todo disponible para revisión y solo entonces renderiza el MP4.

El estándar actual es un video vertical en portugués brasileño, de aproximadamente 1 minuto y con un 30% de tolerancia (42–78 s), voz fija `pt-BR-FranciscaNeural` y calificación mínima de 8. El idioma de la página de origen no cambia la voz: una fuente en inglés sigue recibiendo narración en pt-BR, salvo que se solicite explícitamente lo contrario.

[Abrir la guía visual](https://inematds.github.io/content2video/guia/es/) · [Plan del proyecto](docs/plano_content2video_inema.md)

Versión actual: `v1.06.00`. El historial y las evoluciones planificadas están en el [ROADMAP](ROADMAP.md).

## Arquitectura y proveedores de la versión actual

La `v1.06.00` no usa un servicio externo de generación de video. El resultado actual es una composición programable: el agente crea el guion y las escenas, HyperFrames organiza y anima los elementos, y FFmpeg entrega el MP4.

| Componente | Responsabilidad actual | ¿Genera clips con IA? |
|---|---|---|
| Codex vía OAuth o OpenAI API | Investiga la fuente, planifica el video y crea o edita el guion, HTML, las escenas y los metadatos | No |
| HyperFrames | Arma la línea de tiempo, anima, valida, abre el editor y renderiza la composición | No; renderiza la composición creada |
| Edge TTS | Genera la narración, usando `pt-BR-FranciscaNeural` para las salidas en portugués brasileño | No |
| FFmpeg/FFprobe | Procesa audio y video, verifica el archivo y adjunta el CTA al MP4 final | No |
| Medios locales | Proporcionan imágenes, videos, fuentes, íconos y otros archivos usados por las escenas | No por sí solos |

`AI_PROVIDER=codex` y `AI_PROVIDER=openai` eligen cómo se ejecuta el agente de producción. Esta configuración no elige un generador de clips y no significa que el video sea generado por los modelos de video de OpenAI.

En esta versión no están integrados proveedores de clips generativos ni avatares, como HeyGen, Veo, Runway, Kling o Sora. Por lo tanto, la interfaz todavía no permite elegir un proveedor de video, un modelo, la duración del clip ni créditos de ese tipo de servicio.

El flujo actual produce principalmente motion graphics, tipografía animada, diagramas, imágenes y medios locales. Un proyecto puede usar un video ya disponible como medio, pero Content2Video no solicita ese clip a un proveedor generativo.

### Evolución prevista

Una versión futura podrá permitir elegir por escena entre:

- composición y motion graphic de HyperFrames;
- clip generado con IA;
- presentador o avatar;
- imagen animada;
- medio enviado o seleccionado por el usuario.

Esta evolución deberá registrar en cada escena el proveedor, el modelo, la duración, el estado de la solicitud, el costo estimado y los créditos efectivamente consumidos. La integración también deberá mantener una opción de respaldo para HyperFrames o medios locales cuando un proveedor falle o no se seleccione.

## Requisitos previos

- Node.js 22 o superior;
- FFmpeg y FFprobe;
- `curl`, usado por la verificación de estado de `start.sh`;
- Codex CLI autenticado con `codex login` (predeterminado), o una clave de OpenAI configurada en `.env`;
- acceso a internet para leer la URL y obtener HyperFrames en la primera ejecución.

Comprueba la instalación:

```bash
node --version
ffmpeg -version
codex --version
codex login status
```

## Instalación

```bash
git clone https://github.com/inematds/content2video.git
cd content2video
cp .env.example .env
npm install
```

El `.env` real nunca se versiona. Los valores predeterminados documentados están en `.env.example`. De manera predeterminada, `APP_HOST=0.0.0.0` y `PREVIEW_HOST=0.0.0.0` ponen la interfaz y el editor a disposición de todas las interfaces de red de la máquina.

## Usar la interfaz

Inicia el servidor en segundo plano:

```bash
./start.sh
```

El script crea `.runtime/content2video.pid`, guarda la salida en `.runtime/content2video.log` y evita iniciar una segunda instancia. Para detener el servidor y los editores que abrió:

```bash
./stop.sh
```

`stop.sh` valida que el PID pertenezca a este proyecto antes de enviar `SIGTERM`, espera hasta 10 segundos a que el proceso se cierre normalmente y usa `SIGKILL` solo si el proceso no responde. Los archivos de ejecución en `.runtime/` no se versionan.

En la misma máquina, abre `http://127.0.0.1:3080`. En otra computadora, celular o tableta de la red local, usa la IP de la máquina que ejecuta Content2Video, por ejemplo:

```text
http://192.168.2.99:3080
http://192.168.1.172:3080
```

Lista las direcciones disponibles con `hostname -I`. La dirección `0.0.0.0` es solo la dirección de escucha del servidor y no debe escribirse en el navegador.

### Operación y diagnóstico

```bash
# iniciar
./start.sh

# consultar el proceso
cat .runtime/content2video.pid

# seguir el registro
tail -f .runtime/content2video.log

# detener
./stop.sh
```

`APP_PORT` sigue tomando su valor de `.env` (predeterminado `3080`). Es posible sobrescribir los parámetros para una ejecución específica:

```bash
APP_PORT=4080 ./start.sh
```

Para restringir la interfaz a una dirección específica, define `APP_HOST` y `PREVIEW_HOST` antes del comando o modifica `.env`. Los scripts dan prioridad a las variables indicadas en la terminal.

> Seguridad: la interfaz no tiene inicio de sesión. Úsala solo en redes confiables y limita el puerto `3080` a la LAN en el firewall. No redirijas este puerto en el router ni expongas el servicio directamente a internet.

También es posible ejecutarlo en primer plano, lo que resulta útil durante el desarrollo:

```bash
npm start
```

En la interfaz:

1. Pega el enlace de la página o el artículo.
2. Si quieres orientar el enfoque, completa **Objetivo del video**. Esta instrucción complementa el enlace y define el público, el enfoque y el mensaje sin sustituir los datos de la fuente.
3. Elige **9:16 Vertical** (`1080 × 1920`) o **16:9 Horizontal** (`1920 × 1080`).
4. En el menú desplegable **Forma de hablar**, elige **Popular y sencillo**, **Conversación natural** o **Técnico y detallado**. El estilo popular predeterminado usa frases cortas y palabras comunes, y explica los términos difíciles con ejemplos.
5. En el menú desplegable **Ritmo del habla**, elige **Tranquilo** (`-10%`), **Natural** (`+0%`) o **Rápido** (`+12%`).
6. Deja marcada la opción **Agregar CTA INEMA.CLUB al final** o desmárcala para crear el video sin el cierre.
7. Elige el **Preset visual**. El predeterminado **Automático — el plan decide** analiza la fuente, el público y el formato para definir una dirección específica; los demás presets aplican lineamientos visuales definidos. Usa **Editar preset en otra pantalla** para ajustar la paleta, la tipografía, la composición, el movimiento y los medios.
8. Haz clic en **Crear dirección visual**. El sistema investiga la fuente y prepara solo el briefing, el storyboard y una escena piloto.
9. En la etapa de revisión visual, comprueba la imagen. Usa **Aprobar visual y producir**, **Editar preset** o **Actualizar escena piloto**. La voz y las escenas completas solo se generan después de la aprobación.
10. Durante la producción, el estado muestra la actividad actual y mantiene bloqueados el editor, la edición con prompt, la copia y el render para evitar abrir o modificar una composición incompleta.
11. Cuando la producción termine sin MP4, el estado mostrará **En espera de revisión**: usa **Abrir editor** o **Editar con prompt**.
12. Usa **Crear copia** cuando quieras adaptar una versión sin tocar el proyecto original.
13. Haz clic en **Aprobar y renderizar** y descarga el MP4 desde la tarjeta del proyecto.
14. Cuando el estado cambie a **Listo para ver**, aparecerá el botón de reproducción en la portada y abrirá el MP4 final.

Las dos opciones quedan registradas en `BRIEF.md` y `meta.json` como `conversation_style`, `speech_pace` y `voice_rate` antes de generar el audio. Las ediciones y regeneraciones conservan el estilo y el ritmo del proyecto.

### Fases, reanudación y cancelación

Cada trabajo muestra su tipo, formato, tiempo total, fase actual y cuánto tiempo se empleó en cada etapa. La duración de la etapa activa sigue contando; las etapas completadas conservan el tiempo final. La generación, la copia, la edición con prompt y el renderizado tienen flujos propios. Mientras el trabajo esté en cola o en ejecución, el botón **Cancelar** detiene los procesos de Codex, HyperFrames, el navegador y FFmpeg asociados al trabajo.

La interfaz usa la actividad más reciente del generador para evitar anunciar la validación mientras todavía se construyen las escenas. Un trabajo solo se completa cuando `index.html` contiene una composición armada; el archivo inicial vacío no habilita el editor.

La cancelación conserva los archivos generados hasta ese momento para inspeccionarlos o reanudar el trabajo. El historial de trabajos permanece en memoria durante la sesión actual del servidor; al reiniciar la aplicación, se borra la lista de jobs, pero los proyectos y los archivos permanecen en `output/content2video/`.

Cuando falla o se cancela un render, los archivos válidos quedan como puntos de control en `.runtime/render-staging/`. Durante la misma sesión del servidor, la acción **Continuar desde donde quedó** reutiliza esos archivos y omite la validación, el renderizado o el CTA que ya se hayan completado. Las fases omitidas aparecen como **reutilizada** y no reciben un nuevo tiempo.

Este es el comportamiento predeterminado: continuar aprovecha lo que ya está listo. Usa **Rehacer render completo** solo cuando quieras descartar el punto de control de ese intento y volver a ejecutar todas las fases. Cuando el MP4 se guarda correctamente en `output/content2video/<projeto>/renders/`, se eliminan los puntos de control temporales.

### Editar visualmente o con prompt

- El botón de reproducción aparece en la portada solo cuando hay un MP4 listo y reproduce directamente el video final.
- **Abrir editor** abre HyperFrames Studio para revisar y editar directamente.
- **Editar con prompt** modifica el proyecto actual. Escribe lo que quieres cambiar y, de preferencia, lo que se debe conservar.
- Dentro de **Editar con prompt**, el acceso directo **Continuar desde donde quedó** completa el material incompleto, conserva lo que ya está correcto, corrige la validación y prepara capturas sin renderizar.
- **Crear copia** duplica el proyecto, elimina los renders antiguos de la copia y aplica la instrucción solo a la nueva carpeta. La copia recibe un nombre como `<projeto>-copia` o `<projeto>-copia-2`.

Ejemplo de instrucción:

```text
Quita la escena sobre los precios, conserva la voz y los colores actuales,
cambia el CTA final y haz que el ritmo sea más directo.
```

Las ediciones y las copias permiten cambiar el formato y la opción de CTA desde el mismo panel. El agente actualiza la composición, el briefing y los metadatos, conserva `pt-BR-FranciscaNeural` cuando la salida está en portugués brasileño y ejecuta la validación antes de habilitar la revisión.

### Biblioteca de prompts para editar

Copia un bloque en **Objetivo del video** al crear una dirección o en **Editar con prompt** para un video existente. En el objetivo, orienta la nueva producción; en la edición, modifica el proyecto actual.

**Cambiar solo la dirección visual**

```text
Cambia solo la dirección visual. Usa una estética editorial premium, con fondo oscuro,
tipografía potente, una idea dominante por cuadro y movimiento breve. Conserva los datos,
el guion, la duración, la voz y el CTA. Evita el neón, el glassmorphism y el exceso de tarjetas.
```

**Mejorar la legibilidad sin rediseñar**

```text
Conserva la identidad visual actual. Mejora el contraste, la jerarquía y el espacio.
Divide los títulos según su sentido, mantenlos dentro del área segura y dales tiempo real de lectura.
No cambies el guion, la narración, las imágenes ni la duración sin necesidad.
```

**Editorial científica**

```text
Usa una dirección editorial científica: diagramas claros, datos con la fuente visible, una paleta sobria
y tipografía precisa. Explica visualmente la relación entre causa y efecto. Evita las imágenes
decorativas, la jerga sin explicación y el aspecto de una presentación corporativa.
```

**Tecnología sin neón**

```text
Crea una estética de tecnología madura, con azul profundo, blanco y un solo acento.
Usa interfaces, flujos y detalles reales del producto. No uses neón, cuadrículas futuristas,
códigos aleatorios, robots genéricos ni brillo decorativo.
```

**Los datos como protagonistas**

```text
Transforma las cifras principales en una narrativa visual. Muestra el contexto, la comparación
y la consecuencia; una métrica por momento. Conserva la precisión y escribe la fuente en el cuadro.
Evita los gráficos 3D, los ejes engañosos y los contadores sin referencia.
```

**Simplificar el movimiento**

```text
Reduce el movimiento a lo necesario para orientar la atención. Usa entradas breves, pausas
para leer y transiciones motivadas por el contenido. Conserva el diseño y la identidad.
Elimina la flotación continua, el parallax decorativo y las animaciones simultáneas.
```

**Reforzar el gancho inicial**

```text
Reescribe solo los primeros 5 segundos para abrir con la consecuencia más concreta
del artículo. Haz que la imagen demuestre la frase. Conserva los datos, la voz, el estilo y el resto del video.
No uses una pregunta genérica ni una promesa sensacionalista.
```

**Auditar el área segura**

```text
Valida todos los titulares al inicio, en el pico y al final de cada animación, después de que se carguen las fuentes.
En 9:16, mantén un ancho máximo del 85% y márgenes laterales del 7,5%.
Divide según el sentido antes de reducir la fuente. Corrige cualquier píxel fuera del área segura.
```

**Adaptar correctamente el formato**

```text
Adapta esta versión a 9:16. Recompon cada escena para el nuevo encuadre; no te limites a recortar
ni a escalar el diseño horizontal. Conserva el guion, la voz, la identidad y el tiempo de lectura.
Reubica las imágenes y los datos para aprovechar la lectura vertical.
```

**Reutilizar el estilo de otro proyecto**

```text
Usa como referencia visual el proyecto <nome-do-projeto>: paleta, tipografía, densidad,
tratamiento de imagen y ritmo de movimiento. No copies el contenido ni la estructura de las escenas.
Conserva el guion y la voz de este video, y registra la referencia en el briefing.
```

### CTA automático

La opción **Agregar CTA INEMA.CLUB al final** viene marcada de forma predeterminada al crear un proyecto, editar con prompt y crear copias. La elección se guarda como `include_cta` en el `meta.json` del proyecto y aparece en la tarjeta como **CTA al final** o **Sin CTA**.

Al hacer clic en **Aprobar y renderizar**, el sistema renderiza la composición editable y, si la opción está activa, adjunta un cierre de 5,5 segundos adecuado al formato elegido. El CTA no se inserta en las escenas editables: se une solo al MP4 final. Así, se puede activar o desactivar en una edición futura sin cambiar el contenido del video.

Los archivos reutilizados por el render están en:

```text
output/content2video/inema-club-cta/renders/inema-club-cta.mp4
output/content2video/inema-club-cta/renders/inema-club-cta-16x9.mp4
```

Durante el render, la interfaz muestra por separado **Renderizando video** y **Agregando CTA**. Si el CTA está desmarcado, se omite esta etapa.

El comando `npm run video:render -- <projeto>` también respeta `include_cta`. En cambio, el comando directo `npx hyperframes render` solo produce la composición y no une el CTA automáticamente.

La interfaz no requiere un inicio de sesión propio. Está diseñada para usarse localmente o en una red privada; no la expongas directamente a internet sin agregar autenticación y HTTPS.

## Usar sin interfaz, desde la terminal

Consulta los comandos disponibles:

```bash
npm run video -- --help
```

Crea un proyecto a partir de una URL. El último argumento, opcional, define el nombre de la carpeta:

```bash
npm run video:create -- https://www.inema.club/ inema-club-promo
```

El comando crea `output/content2video/inema-club-promo/`, genera el material editable y valida la composición, pero no la renderiza automáticamente. Después:

```bash
npm run video:list
npm run video:check -- inema-club-promo
npm run video:preview -- inema-club-promo
npm run video:render -- inema-club-promo
```

El MP4 final queda en:

```text
output/content2video/<nome-do-projeto>/renders/<nome-do-projeto>.mp4
```

También es posible ejecutar HyperFrames directamente dentro de cualquier video:

```bash
cd output/content2video/inema-club-promo
npx --yes hyperframes@0.8.20 check
npx --yes hyperframes@0.8.20 preview
npx --yes hyperframes@0.8.20 render --quality high --output renders/inema-club-promo.mp4
```

## OAuth de la suscripción o API

De manera predeterminada, se reutiliza la sesión OAuth ya conectada en Codex CLI:

```dotenv
AI_PROVIDER=codex
```

Autentícate una vez en la computadora:

```bash
codex login
```

Para usar la OpenAI API, modifica solo el `.env` local:

```dotenv
# AI_PROVIDER=codex
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
# OPENAI_MODEL=
```

Nunca envíes la clave a Git. `.gitignore` ya excluye `.env` y sus variantes locales.

Estas dos opciones controlan el agente que construye el proyecto. Ninguna de ellas activa la generación de clips de video en la `v1.06.00`.

## Valores configurables

`.env.example` reúne el idioma, la voz, la duración, la tolerancia, la calificación mínima, el formato, la resolución, los FPS, la calidad, las carpetas y las direcciones de la interfaz. Las reglas editoriales ejecutables también están en `config/production-defaults.json` y `AGENTS.md`.

| Configuración | Predeterminado |
|---|---|
| Idioma | `pt-BR` |
| Voz | `pt-BR-FranciscaNeural` vía Edge TTS |
| Duración | 60 s, rango aceptado de 42 a 78 s |
| Calidad mínima | 8 |
| Formato | 9:16, 1080 × 1920, 30 fps |
| Formato alternativo | 16:9, 1920 × 1080, 30 fps |
| Render | MP4 en calidad alta, después de la aprobación |

## Proyectos de ejemplo

- `output/content2video/inema-club-promo`: video de INEMA.club;
- `output/content2video/zuckerberg-anti-dolly-parton`: artículo en inglés narrado con la misma voz brasileña;
- `output/content2video/mudancas-compostas`: MVP original de aproximadamente 1 minuto.

Para validar un ejemplo completo:

```bash
npm run video:check -- mudancas-compostas
ffprobe output/content2video/mudancas-compostas/renders/mudancas-compostas.mp4
```

## Estructura

```text
app/                         interfaz y servidor local
config/                      valores predeterminados de producción
docs/                        plan e informe del MVP
scripts/video.mjs            comandos de terminal
start.sh                     inicia el servidor en segundo plano
stop.sh                      detiene de forma segura la instancia iniciada
output/content2video/<projeto>/  fuentes editables, medios, capturas y renders
.runtime/                    PID y registro locales, ignorados por Git
.env.example                 configuración de referencia segura
```

## Seguridad y publicación

- no versiones `.env`, tokens, cookies ni credenciales;
- revisa los derechos de uso de los medios capturados de la página de origen;
- mantén la interfaz restringida a una red confiable mientras no tenga inicio de sesión;
- comprueba los titulares en el área segura y escucha la narración antes del render final.

## Versionado

La versión mostrada sigue el formato `vMAJOR.RECURSO.CORRECCIÓN`:

- `v1.01.00`: se entrega una nueva función; incrementa RECURSO y reinicia CORRECCIÓN en `00`;
- `v1.01.01`: corrección de un error sin una nueva función; incrementa solo CORRECCIÓN;
- `v2.00.00`: cambio importante o incompatible; incrementa MAJOR y reinicia los demás campos.

Los campos RECURSO y CORRECCIÓN se muestran con dos dígitos, pero son numéricamente compatibles con `package.json` (`1.1.1`, por ejemplo).

## Licencia

Uso interno y educativo de INEMA. Verifica los derechos del contenido de origen y de los medios antes de distribuir cada video.
