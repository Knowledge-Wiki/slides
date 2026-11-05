# Bento-Box-Design mit `custom.css` – ausführliche Beschreibung

Datum: 2026-11-05
Praxisbeispiel: `2026_11_Beispiel_Bento_Boxen/` (gebaut: `index.html`)
Gegenstück (Tailwind-Ansatz): Analyse in `docs/revealjs-tailwind-vs-markdown-boxen.md`

---

## 1. Idee

Statt jedes Layout inline im HTML zu stylen (Tailwind-Utility-Klassen wie im
NeoWiki-Deck: `rounded-[8px] border bg-linear-to-br from-pw-highlight ...`),
bekommt hier **jede wiederkehrende Komponente eine semantische CSS-Klasse** in
einer zentralen Datei (`custom.css`). Im Markdown steht dann nur noch:

```markdown
:::: {.bento-grid}
::: {.box}
**Helle Box**

Inhalt …
:::

::: {.box .box-dark}
**Dunkle Box**

Inhalt …
:::
::::
```

Das Design liegt komplett in `custom.css`, der Inhalt komplett in `slides.md` –
Trennung wie bei einem Theme, nur eine Ebene tiefer.

## 2. Design-Tokens: CSS-Variablen statt Tailwind-`@theme`

Im Tailwind-Deck werden Brand-Farben in `@theme { --color-pw-primary: ... }`
deklariert und als `text-pw-primary` verwendet. Das Äquivalent ohne Build-Schritt
sind eigene CSS-Variablen in `:root`:

```css
:root {
  --slide-bg: #f4f8fb;
  --slide-heading: #182b39;
  --slide-text: #234257;
  --slide-accent: #32739b;
  --slide-highlight-bg: #e7f0f7;
  --slide-highlight-deep: #d4e6f2;
  --slide-border: #cae0ed;
  --slide-muted: #6c757d;
  --bento-dark: #1a3347;
  --bento-dark-light: #234257;
  --bento-dark-border: #2d5a75;
  --bento-dark-muted: #9bc5de;
}
```

Die Tokens erfüllen **zwei** Aufgaben:

1. Sie steuern die eigenen Komponenten (`.box`, `.pill`, Listen …).
2. Sie überschreiben das reveal.js-Theme, indem sie auf dessen Variablen
   gemappt werden:

   ```css
   .reveal {
     --r-background-color: var(--slide-bg);
     --r-main-color: var(--slide-text);
     --r-heading-color: var(--slide-heading);
     --r-link-color: var(--slide-accent);
   }
   ```

   Damit muss man nicht das ganze reveal-Theme neu schreiben (wie
   `dist/theme/black.css`), sondern biegt nur Farben und Fonts um. Das
   Theme im Build-Befehl (`--variable theme="white"`) liefert nur das
   strukturelle Grundgerüst (Abstände, Fragment-Animationen etc.).

**Faustregel für Größen:** reveal.js skaliert den gesamten Folieninhalt
(Font-Größe über `--r-main-font-size`, Standard 42px). Deshalb in
`custom.css` konsequent **em-Einheiten** verwenden (`padding: 0.8em 1.1em`,
`gap: 14px` nur für Grid-Abstände) – dann skaliert alles mit dem Slide-Maßstab.

## 3. Die Komponenten (vollständiges `custom.css`)

### 3.1 Basis & Typo

```css
.reveal h1, .reveal h2, .reveal h3 {
  text-transform: none;          /* reveal Themes nutzen oft UPPERCASE */
  color: var(--slide-heading);
  letter-spacing: -0.02em;
}
```

Alle Selektoren hängen unter `.reveal`, damit sie nur innerhalb des Decks greifen.

### 3.2 Listen mit eigenem Bullet

```css
.reveal ul { list-style: none; padding-left: 0; }
.reveal ul li { position: relative; padding-left: 1.2em; margin-bottom: 0.45em; }
.reveal ul li::before {
  content: "\25B8";              /* ▸ */
  color: var(--slide-accent);
  position: absolute;
  left: 0;
}
```

Ersetzt die Standard-Aufzählungszeichen – im NeoWiki-Deck passiert dasselbe per
Utility-Klassen und `content` im `<style>`-Block.

### 3.3 Die Box (`.box` / `.box-dark`)

```css
.reveal .box {
  border: 1px solid var(--slide-border);
  border-radius: 10px;                       /* ← die "abgerundete Box" */
  padding: 0.8em 1.1em;
  background: linear-gradient(to bottom right,
    var(--slide-highlight-bg), var(--slide-highlight-deep));
  text-align: left;
}
.reveal .box > p:first-child strong {        /* Box-Titel (erste Zeile fett) */
  font-size: 1.15em;
  color: var(--slide-heading);
}
.reveal .box-dark {
  background: linear-gradient(to bottom right, var(--bento-dark), var(--bento-dark-light));
  border-color: var(--bento-dark-border);
  color: #fff;
}
.reveal .box-dark > p:first-child strong { color: #fff; }
```

**Tailwind-Äquivalent** (aus dem NeoWiki-Deck):
`rounded-[8px]` → `border-radius`, `border border-pw-border` → `border`,
`bg-linear-to-br from-pw-highlight to-pw-highlight-deep` → `background: linear-gradient(...)`,
`px-[32px] py-[36px]` → `padding`. Variante per zweiter Klasse: `.box-dark`
(entspricht `from-bento-dark to-bento-dark-light border-bento-dark-border`).

### 3.4 Das Grid (`.bento-grid`)

```css
.reveal .bento-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;   /* 2 Spalten */
  gap: 14px;
  text-align: left;
}
.reveal .bento-grid.cols-3 { grid-template-columns: repeat(3, 1fr); }
.reveal .bento-grid .span-2  { grid-column: span 2; }   /* Box über volle Breite */
```

**Tailwind-Äquivalent:** `grid grid-cols-2 gap-[14px]` bzw.
`grid-cols-3` bzw. `col-span-2`.

### 3.5 Pills (`.pill`)

```css
.reveal .pill {
  display: inline-block;
  background: var(--slide-highlight-bg);
  border: 1px solid var(--slide-border);
  border-radius: 20px;
  padding: 0.1em 0.6em;
  font-size: 0.75em;
}
```

Inline im Fließtext via pandoc-Inline-Attribut: `[wichtiger Punkt]{.pill}`
→ `<span class="pill">wichtiger Punkt</span>`.

## 4. Wie pandoc Markdown → HTML baut (Struktur im fertigen Deck)

```html
<section class="slide level2">          <!-- eine Folie (## in slides.md) -->
  <div class="bento-grid">              <!-- :::: {.bento-grid} -->
    <div class="box">                   <!-- ::: {.box} -->
      <p><strong>Helle Box</strong></p>
      <p>Inhalt …</p>
    </div>
    <div class="box box-dark">          <!-- ::: {.box .box-dark} -->
      …
    </div>
  </div>
</section>
```

Wichtige pandoc-Regeln dabei:

- **Verschachtelte Fenced Divs brauchen unterschiedlich lange Fences:**
  außen `::::`, innen `:::` – sonst beendet der kürzere Fence den äußeren Div vorzeitig.
- **Keine Überschriften (`###`) innerhalb der Divs!** Pandoc wandelt eine
  Überschrift in einem Div in ein nested `<section>` um – in reveal.js wären das
  vertikale Slides statt Box-Inhalt. Box-Titel als **fett gedruckte erste Zeile**
  (`**Titel**`) oder `[Titel]{.box-title}`.
- Mit `-f markdown+markdown_in_html_blocks` darf auch in raw-HTML-Divs
  (`<div class="bento-grid">`) normaler Markdown-Inhalt stehen.
- Klassen kombinieren sich mit reveal.js-Features: `::: {.box .fragment}`
  macht die Box zum Fragment (erscheint erst per Klick).

## 5. Einbindung in den Build

```bash
pandoc -s -i \
  -f markdown+markdown_in_html_blocks \
  -t revealjs \
  --template=../build/revealjs-template-4.x.html \
  --variable revealjs-url=../build/reveal.js-4.3.1 \
  --variable theme="white" \
  --css=custom.css \
  slides.md -o index.html
```

`--css=custom.css` hängt die Datei nach dem reveal-Theme in den `<head>`
(Reihenfolge in der erzeugten HTML: reset.css, reveal.css, theme, **custom.css**)
– dadurch überschreiben die eigenen Regeln gezielt Theme-Werte.

## 6. Erweiterungen

### Neue Box-Variante
Einfach eine Klasse ergänzen und per zweiter Klasse aktivieren:

```css
.reveal .box-accent {
  background: var(--slide-accent);
  border-color: var(--slide-accent);
  color: #fff;
}
```
```markdown
::: {.box .box-accent}
**Akzent-Box**
:::
```

### Pro-Folie-Theming (wie `data-bernhard` im NeoWiki-Deck)
Am `##`-Header ein Attribut mitgeben – pandoc landet es auf dem `<section>`:

```markdown
## ECHOLOT-Teil {data-vendor="echolot"}
```

```css
.reveal section[data-vendor="echolot"] {
  --slide-accent: #1764ff;
  --slide-border: rgba(23, 100, 255, 0.25);
  --slide-highlight-bg: rgba(23, 100, 255, 0.08);
}
```

Weil alle Komponenten die Variablen benutzen, färbt sich die ganze Folie um –
inkl. Boxen, Bullets, Pills.

### Dunkler Gesamt-Abschnitt
Ganze Folien dunkel: `## Titel {data-background="#1a3347" class="invert"}` plus

```css
.reveal section.invert {
  --slide-heading: #fff;
  --slide-text: #d7e5f0;
}
```

### Logo-Overlay wie im NeoWiki-Deck
Fixed positioniertes `<img>` im HTML (über `--include-in-header` oder direkt in
einem raw-HTML-Block am Anfang von `slides.md`) + JS im Template, das per
`Reveal.on('slidechanged', …)` anhand eines `data-*`-Attributs der aktuellen
Folie umschaltet (siehe `index.html` des NeoWiki-Repos).

## 7. Wann custom.css, wann Tailwind?

| | custom.css (dieser Ansatz) | Tailwind (NeoWiki-Deck) |
|---|---|---|
| Quelle | Markdown + pandoc | eine `index.html` |
| Klassen | semantisch, wiederverwendbar (`.box`, `.bento-grid`) | utilities, inline im HTML (`rounded-[8px] px-[32px] …`) |
| Design-Token | CSS-Variablen in `:root` | `@theme` in `tailwind.css` |
| Build | nur pandoc | pandoc optional + `npx @tailwindcss/cli` |
| Gut für | viele/variable Decks, Textfokus, Wartbarkeit | stark design-getriebene Einzeldecks, schnelles Prototyping im HTML |
| Bridge | Tailwind kann nach dem pandoc-Build über die fertige `index.html` laufen und per `--css` eingebunden werden | — |

Für die meisten Fälle reicht `custom.css`: Die „abgerundeten Boxen" sind am Ende
nur `border-radius` + `border` + `padding` – der Rest ist Geschmackssache bei der
Organisation.
