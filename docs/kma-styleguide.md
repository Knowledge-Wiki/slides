# KMA-Styleguide für reveal.js-Präsentationen

Datum: 2026-11-05
Praxisbeispiel: `!KMA_Template/` (gebaut: `index.html` + `index-4x3.html`, Quelle: `slides.md` + `custom.css`)
Brand-Quelle: <https://km-a.net/> (HTML/CSS inspiziert am 2026-11-05)

---

## 1. Brand-Fakten (Quelle: km-a.net)

| Element | Wert | Nachweis im Seiten-HTML |
|---|---|---|
| KM-A Rot | `#c00000` | Divi-Customizer `"accent_color":"#c00000"`, `h1–h6{color:#c00000}`, Logo-SVG `fill:#c00000` |
| KM-A Blau | `#0070c0` | AAA-Marken-Namen: `<span style="color: #0070c0;">` (KM Academy / KM Associates / KM Austria) |
| Grundfläche | `#ffffff` | `body.custom-background{background-color:#fff}` |
| Fließtext | `#444444` / `#666666` | `body{color:#444444}`, Divi-Default `#666` |
| Schrift | **Open Sans** | Google-Fonts im `<head>`, `body{font-family:Open Sans,Arial,sans-serif}` |
| Logo | `img/kma_logo_400pxsquare.svg` | 400×400 px, rot `#c00000`, transparenter Hintergrund |

Claim: „The AAA of Knowledge Management" – Education (KM Academy), Consulting
(KM Associates), Innovation (KM Austria). Kontakt: Gersthofer Straße 162,
1180 Vienna, office@km-a.net, +43 1 470 29 09.

## 2. Umsetzung: Design-Tokens in `custom.css`

Wie im Bento-Beispiel (`docs/bento-box-design-custom-css.md`): Brand-Farben als
eigene CSS-Variablen in `:root`, die auf die reveal.js-Theme-Variablen gemappt
werden – das Theme im Build-Befehl (`--variable theme="white"`) liefert nur das
Strukturgerüst:

```css
:root {
  --kma-red: #c00000;
  --kma-blue: #0070c0;
  --kma-bg: #ffffff;
  --kma-text: #444444;
  --kma-muted: #666666;
  --kma-border: #e8e8e8;
}

.reveal {
  --r-background-color: var(--kma-bg);
  --r-main-color: var(--kma-text);
  --r-heading-color: var(--kma-red);
  --r-link-color: var(--kma-blue);
  --r-selection-background-color: var(--kma-red);
  font-family: "Open Sans", Arial, sans-serif;
}
```

**Faustregel Größen:** reveal.js skaliert den gesamten Folieninhalt über die
Font-Größe (Standard 42px). Deshalb in `custom.css` konsequent **em** verwenden
(`padding: 0.7em 0.9em`), nie feste px – außer bei Bildern/Logo.

## 3. Typografie

- **Open Sans** lokal vendored in `build/fonts/` (WOFF2, Gewichte
  300/400/600/700/800, Subsets latin + latin-ext, Lizenz SIL OFL – `OFL.txt`
  liegt daneben; Quelle: npm-Paket `@fontsource/open-sans` 5.3.0). Laden über
  `header-includes` im YAML-Header von `slides.md` – **kein Google-Fonts-Request**:

  ```html
  <link rel="stylesheet" href="../build/fonts/fonts.css">
  ```

  Damit läuft das Deck vollständig offline (reveal.js + Schrift lokal).
  Ohne `fonts.css` fällt die Schrift sauber auf Arial/sans-serif zurück.
- Überschriften `h1–h4`: Open Sans, `text-transform: none`, **rot**;
  `h2` zusätzlich mit roter Unterlinie (`display: inline-block; border-bottom: 3px solid var(--kma-red)`).
- Fließtext `#444444`, `strong` rot hervorgehoben, Links **blau** (`#0070c0`),
  Hover rot. `small`/`figcaption` in `--kma-muted`.

## 4. Logo

- Einzige Datei: `!KMA_Template/img/kma_logo_400pxsquare.svg` (Seitenverhältnis 1:1,
  nie verzerren).
- **Titelfolie:** im YAML-Feld `institute` (`<img src="img/kma_logo_400pxsquare.svg" height="140"/>`).
- **Inhaltsfolien:** normales Markdown-Bild `![KM-A Logo](img/kma_logo_400pxsquare.svg){height="110px"}`.
- **Footer auf jeder Folie:** nicht im HTML, sondern per CSS-Pseudoelement
  (damit `.slides` nur echte `<section>`s enthält):

  ```css
  .reveal::after {
    content: ""; position: fixed; left: 1.2em; bottom: 1.1em;
    width: 52px; height: 52px;
    background: url("img/kma_logo_400pxsquare.svg") center / contain no-repeat;
    opacity: .9; pointer-events: none; z-index: 40;
  }
  ```

- **Auf Vollton-Folien** (Kapitel/Akzent, rot oder blau) Logo **weiß** einfärben,
  sonst ist rot-auf-rot unsichtbar:

  ```css
  .reveal:has(.slides .present.kma-chapter)::after { filter: brightness(0) invert(1); }
  ```

  (`:has()` braucht Chrome 105+ / Firefox 121+ / Safari 15.4+; ohne Support bleibt
  das Logo rot – auf hellen Folien korrekt.)

## 5. Komponenten (semantische Klassen in `custom.css`)

| Klasse | Zweck | Markdown |
|---|---|---|
| `.columns` + `.column` | Zweispalten-Layout | `<div class="columns"><div class="column"> … ` |
| `.kma-grid` + `.kma-card` | 3er-Grid mit Karten (weiß, roter Top-Border, blauer Titel) | `:::: {.kma-grid}` / `::: {.kma-card}` |
| `.swatches` + `.swatch-red/-blue/-white/-text` | Farb-Fächer (Styleguide-Folie) | raw HTML `<div class="swatches">…` |
| `.slide-compact` | kleinere Grundschrift auf inhaltsreichen Folien | `## Titel {.slide-compact}` |
| `.kma-chapter` | Vollton-Folie mit weißem Text | `# Titel {data-background="#c00000" class="kma-chapter"}` |

Wichtige Regeln dazu:

- **Grid nie `repeat(3, 1fr)`**, sondern `repeat(3, minmax(0, 1fr))` – sonst bläht
  der min-content-Inhalt einer Karte die Tracks auf und die 3. Spalte läuft
  rechts aus der Folie. Karten zusätzlich `min-width: 0; overflow-wrap: break-word`.
- **Karten-Titel als fettgedruckter Absatz** (`**KM Academy**`), nie als `###` –
  pandoc macht aus Headern in Fenced Divs eine eigene `<section>`, und reveal.js
  behandelt verschachtelte `<section>`s als vertikale Slides (Grid kaputt).
- **Innere Spalten-divs brauchen `class="column"`** – pandoc packt Klassen-lose
  `<div>`s aus, dann liegen `h3`/`ul`/`figure` einzeln im Flex-Container.
- `.slide-compact` setzt `font-size: 0.72em` auf der `<section>`; weil alles
  Weitere in em gerechnet ist, skaliert die ganze Folie konsistent.
- Listen-Bullets: rotes `▸` (`\25B8`) via `li::before`. Dabei **immer
  `display: block` für `ul/ol/dl` setzen** – das 6.x-Theme deklariert sie als
  `inline-block`, sodass die Liste neben die `h2` (inline-block wegen der roten
  Unterlinie) rutschen würde.
- **Navigatorpfeile (Controls)** halbiert – reveal.js 6.x setzt
  `.reveal .controls { font-size: clamp(10px, 2.5vmin, 40px) }`, die Pfeile sind
  em-basiert (3.6em-Box). In `custom.css` daher:

  ```css
  .reveal .controls { font-size: clamp(5px, 1.25vmin, 20px); }
  ```

## 6. Folien-Muster

**YAML-Header (Titelfolie mit Logo + Font):**

```yaml
---
title: KM-A Knowledge Management Associates
subtitle: The AAA of Knowledge Management
author: Dein Name
date: 05. November 2026
institute: '<img src="img/kma_logo_400pxsquare.svg" height="140"/><br/><small>…</small>'
header-includes: |
  <link rel="stylesheet" href="../build/fonts/fonts.css">
---
```

**Kapitel-Folie (Vollton rot, weißer Text):**

```markdown
# Kapitel: Akzentfolien {data-background="#c00000" class="kma-chapter"}
```

**Blaue Akzent-Folie:**

```markdown
## Blaue Akzentfolie {data-background="#0070c0" class="kma-chapter"}
```

## 7. Build (reveal.js 6.0.2, vendored)

```bash
cd '!KMA_Template'
# 16:9 → index.html
pandoc -s -i -f markdown+markdown_in_html_blocks -t revealjs \
  --template=../build/revealjs-template-6.x.html \
  --variable revealjs-url=../build/reveal.js-6.0.2 \
  --variable theme="white" \
  --variable slideNumber=true \
  --variable width=1280 --variable height=720 --variable margin=0.02 \
  --css=custom.css \
  slides.md -o index.html
# 4:3-Beamer → index-4x3.html (nur width/height/margin ändern):
#   --variable width=1024 --variable height=768 --variable margin=0.04 \
#   slides.md -o index-4x3.html
```

Unterschied 4.x → 6.x: Template wechseln (`revealjs-template-6.x.html`), Plugin-Pfade
liegen in 6.x unter `dist/plugin/*.js`. pandoc 3.1.3.

**Layout-Hinweis (`width`/`height`/`margin`):** Beide reveal.js-Versionen haben
identische Defaults (960×700, `margin: 0.04`), aber 960×700 ist 1,37:1 – auf 16:9-
Screens bleiben dadurch links/rechts Balken („Abstand zum Rand“ von `#slides`).
**Wichtig:** reveal.js skaliert die Folie seitenverhältnistreu ins Fenster, und
`margin` bezieht sich auf die *Folie*, nicht auf den Screen. Deshalb das
Folienformat passend zum Ausgabegerät wählen (16:9 → 1280×720, 4:3-Beamer →
1024×768) und pro Gerät eine Datei bauen. Auf abweichendem Seitenverhältnis
füllt die Folie eine Achse randlos – dagegen schützen die Vollbreiten-Layouts
(`.columns`, `.kma-grid`, `.swatches` mit `padding: 0 0.8em` in `custom.css`),
sodass deren Inhalt nie am Folienrand klebt.
Die Foliengröße ist rein virtuell: reveal.js skaliert per Transform, die Schrift
(42px) bleibt gleich – bei 1280 px Breite passt nur horizontal mehr Inhalt auf
eine Folie.

## 8. Do's & Don'ts

- ✅ Grundfläche immer **weiß**; Rot/Blau nur als Akzent (Headlines, Kapitel-Folien, Logos, Bullets)
- ✅ Auf Vollton-Folien nur **weiße** Schrift (`.kma-chapter`)
- ✅ `em`-Einheiten in `custom.css`, feste px nur bei Bildern/Logo
- ✅ Grid-Tracks `minmax(0, 1fr)`, Karten `min-width: 0`
- ✅ Karten-Titel fett, Spalten-divs mit `class="column"`
- ✅ bei Überlauf: `## Titel {.slide-compact}` statt globaler Schrift-Verkleinerung
- ❌ keine `###`-Header innerhalb von `::: {.kma-card}` (erzeugt eigene Slides)
- ❌ Logo nicht neu zeichnen/verzerren, nur das vorhandene SVG; auf Vollton nur via CSS-Filter weiß
- ❌ keine anderen Blautöne (Divi-Default `#2ea3f2` ist NICHT die KMA-Marke – `#0070c0` verwenden)

## 9. Referenzen

- Praxisbeispiel: `!KMA_Template/` (`slides.md`, `custom.css`, `README.md`, `img/kma_logo_400pxsquare.svg`)
- Lokal vendored Schrift: `build/fonts/` (`fonts.css`, 10 WOFF2-Dateien, `OFL.txt`)
- Brand-Quelle: <https://km-a.net/> – Divi-Customizer `accent_color:#c00000`, AAA-Spans `#0070c0`, Open Sans, Kontaktdaten
- Token-Muster: `docs/bento-box-design-custom-css.md`
- Versionierung vendored reveal.js: `docs/revealjs-versionierung-vendored-vs-cdn.md`
