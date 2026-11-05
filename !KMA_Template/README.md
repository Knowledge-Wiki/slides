# 2026_11_KMA – Beispielpräsentation mit KMA-Styling

Beispiel-Deck im Corporate Design der **KM-A Knowledge Management
Associates** (<https://km-a.net>): **weißer Hintergrund, rot/blau**,
Logo als SVG.

## KMA-Brand (recherchiert auf km-a.net)

| Element | Wert | Verwendung |
|---|---|---|
| KM-A Rot | `#c00000` | Überschriften, Akzente, Logo, Kapitel-Folien (`accent_color` im Divi-Theme, `fill` im Logo-SVG) |
| KM-A Blau | `#0070c0` | Links, AAA-Marken (KM Academy / Associates / Austria) |
| Grundfläche | `#ffffff` | Folien-Hintergrund |
| Text | `#444444` / `#666666` | Fließtext / Sekundär |
| Schrift | Open Sans | wie auf km-a.net – lokal vendored in `../build/fonts/` (WOFF2 + `fonts.css`, OFL-Lizenz), Fallback Arial |

Logo: `img/kma_logo_400pxsquare.svg` (400×400, rot `#c00000`).

## Aufbau

```
2026_11_KMA/
├── slides.md          # Inhalt (einzige Datei, die man bearbeitet)
├── custom.css         # KMA-Design-Tokens & Komponenten (Farben, Karten, Swatches, Footer-Logo)
├── img/
│   └── kma_logo_400pxsquare.svg
├── index.html         # fertig gebautes Deck (pandoc-Ausgabe)
└── README.md          # diese Doku
```

## Bauen

Zwei Varianten aus derselben Quelle `slides.md` – je nach Ausgabegerät
(16:9-Screen/Beamer vs. 4:3-Beamer):

```bash
cd 2026_11_KMA

# 16:9 (Standard, index.html)
pandoc -s -i \
  -f markdown+markdown_in_html_blocks \
  -t revealjs \
  --template=../build/revealjs-template-6.x.html \
  --variable revealjs-url=../build/reveal.js-6.0.2 \
  --variable theme="white" \
  --variable slideNumber=true \
  --variable width=1280 --variable height=720 --variable margin=0.02 \
  --css=custom.css \
  slides.md -o index.html

# 4:3 (Beamer, index-4x3.html) – nur width/height/margin ändern
pandoc -s -i \
  -f markdown+markdown_in_html_blocks \
  -t revealjs \
  --template=../build/revealjs-template-6.x.html \
  --variable revealjs-url=../build/reveal.js-6.0.2 \
  --variable theme="white" \
  --variable slideNumber=true \
  --variable width=1024 --variable height=768 --variable margin=0.04 \
  --css=custom.css \
  slides.md -o index-4x3.html
```

- reveal.js **6.0.2** (vendored, `../build/reveal.js-6.0.2/`), Theme `white`,
  überschrieben via CSS-Variablen in `custom.css`.
  Template `revealjs-template-6.x.html` – Plugin-Pfade in 6.x liegen unter
  `dist/plugin/*.js` (in 4.x unter `plugin/<name>/<name>.js`).
- pandoc **3.1.3**.
- **Open Sans** liegt lokal in `../build/fonts/` (WOFF2, Gewichte 300/400/600/700/800,
  Subsets latin + latin-ext, Lizenz `OFL.txt`), geladen per `header-includes` in
  `slides.md` (`<link rel="stylesheet" href="../build/fonts/fonts.css">`) –
  **kein externer Request**, das Deck läuft voll offline.
- **Layout/Seitenverhältnis:** reveal.js skaliert die Folie immer
  *seitenverhältnistreu* ins Fenster; `margin` bezieht sich auf die Folie,
  nicht auf den Screen. Default beider reveal.js-Versionen ist 960×700 bei
  `margin: 0.04` (1,37:1 → auf 16:9-Screens breite Seitenbalken). Deshalb hier
  16:9 (1280×720) bzw. 4:3 (1024×768) passend zum Beamer. Auf abweichendem
  Seitenverhältnis füllt die Folie eine Achse komplett – dagegen hilft der
  eigene Innenabstand der Vollbreiten-Komponenten (`.columns`, `.kma-grid`,
  `.swatches` mit `padding: 0 0.8em` in `custom.css`).
- `-i`: Listen erscheinen punktweise (Fragmente).
- `markdown_in_html_blocks`: Markdown auch innerhalb von raw-HTML-divs.

## Was das Deck demonstriert

| Folie | Baustein |
|---|---|
| Titelfolie | YAML-Header mit `subtitle` + Logo im `institute`; Open Sans lokal via `header-includes` (`../build/fonts/fonts.css`) |
| Wer wir sind | Zweispalten-Layout (`div.columns`) mit Logo-Bild |
| Die drei AAA | 3er-Grid `.kma-grid` mit Karten `.kma-card` (Titel als **fett**, nicht `###` – sonst macht pandoc daraus eine eigene Slide); Grid-Tracks `minmax(0,1fr)`, damit die 3. Spalte nicht rechts rausläuft |
| Wer wir sind, Die drei AAA | Klasse `.slide-compact` am `##`-Header → kleinere Grundschrift (`font-size: 0.72em`, skaliert alles in em) für inhaltsreiche Folien |
| KMA-Styleguide | Farb-Fächer `.swatches` (rot/blau/weiß/text) als raw HTML |
| Kapitel: Akzentfolien | `#`-Header mit `data-background="#c00000" class="kma-chapter"` → Vollton-Rot, weißer Text; `##`-Folie mit `data-background="#0070c0"` → Blau |
| jede Folie | dezentes Logo unten links via `.reveal::after` in `custom.css` |

## Weiterführend

- Vollständiger KMA-Styleguide (Brand-Fakten von km-a.net, alle Komponenten,
  Do's & Don'ts): `../docs/kma-styleguide.md`

## Mobile-first: Hochformat (Test)

Auf hochformatigen kleinen Bildschirmen (Telefon) skaliert reveal.js die 16:9-Folie
seitenverhältnistreu auf die Breite – die Folie wäre nur ein schmaler Streifen in
der Mitte des Screens. Zwei Dateien im KMA-Template stellen das um:

- `mobile-portrait.js` – im Hochformat (`vh > vw`) wird per `Reveal.configure()`
  die Foliengröße auf das Fenster-Seitenverhältnis gesetzt (Breite 720, Höhe passend),
  sodass die Folie den Screen ausfüllt und der Inhalt größer lesbar ist; im Querformat
  wird die ursprüngliche Größe (1280×720 bzw. 1024×768) wiederhergestellt. Das Script
  setzt außerdem die Klasse `kma-portrait` am `<html>`-Element. PDF-Export
  (`?print-pdf`) wird nicht verändert.
- `custom.css` (Abschnitt „Mobile-first: Hochformat“) – bei `html.kma-portrait`
  stapeln sich `.columns` und `.kma-grid` einspaltig, `.swatches` bricht auf 2 Spalten
  um, Fließtext wird linksbündig (Titel-/Kapitelfolien zentriert), Footer-Logo kleiner.

Eingebunden via `header-includes` in `slides.md` (`<script defer …>`) und in den
gebauten `index.html` / `index-4x3.html` vor `</body>`.

## Präsentieren

`index.html` im Browser öffnen – komplett statisch und **voll offline**
(reveal.js und Open Sans liegen lokal in `../build/`; ohne `fonts.css` fällt
die Schrift auf Arial/sans-serif zurück).
Tasten: `Esc` Übersicht, `s` Speaker-Ansicht (Notizen), `f` Vollbild,
`?` Hilfe, `index.html?print-pdf` → PDF-Export.
