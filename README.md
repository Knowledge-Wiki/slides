# KMA_RevealJS_Slides

Präsentationen der [KM-A](https://km-a.net) gebaut mit reveal.js aus Markdown mit pandoc.

## Präsentationen

* [`!KMA_Template/`](!KMA_Template/) ist die zentrale Vorlage für alle
KMA-Decks

### 2026
* [MUDCon26 - EpiMedDat](2026_11_MUDCon26_EpiMedDat/)


## Aufbau des Repositorys

```
KMA_RevealJS_Slides/
├── README.md                        # diese Übersicht
├── !KMA_Template/                   # KMA-Corporate-Design-Template (Vorlage für jedes Deck)
│   ├── slides.md                    # Beispiel-Inhalt (einzige Datei, die man bearbeitet)
│   ├── custom.css                   # KMA-Design-Tokens & Komponenten (Farben, Karten, Swatches, Footer-Logo)
│   ├── img/
│   │   └── kma_logo_400pxsquare.svg # KM-A Logo (rot #c00000, 400×400)
│   ├── index.html                   # gebautes Beispiel-Deck (16:9)
│   ├── index-4x3.html               # gebautes Beispiel-Deck (4:3-Beamer)
│   └── README.md                    # Doku des KMA-Templates: Brand, Komponenten, genauer Build-Befehl
├── build/
│   ├── reveal.js-6.0.2/             # vendortes reveal.js 6.0.2 (npm-Paket: dist/, LICENSE, package.json)
│   ├── revealjs-template-6.x.html   # pandoc-Template für 6.x (Plugin-Pfade dist/plugin/*.js)
│   └── fonts/                       # Open Sans lokal vendored (fonts.css + WOFF2 + OFL.txt) – kein Google-Fonts-Request
├── docs/
│   ├── kma-styleguide.md            # KMA-Corporate-Design für Slides (Brand-Fakten von km-a.net, alle Komponenten, Do's & Don'ts)
│   ├── revealjs-markdown-vs-html.md # Markdown vs. reines HTML bei reveal.js
│   └── bento-box-design-custom-css.md # Boxen/Grids per custom.css (Token-Muster)
└── JJJJ_MM_Name/                    # weitere Präsentationen: eine pro Verzeichnis
    ├── slides.md                    # Inhalt (Markdown)
    ├── custom.css                   # aus !KMA_Template/ übernommen (ggf. ergänzt)
    ├── img/                         # Logo + eigene Bilder
    ├── index.html                   # fertig gebautes Deck (16:9)
    ├── index-4x3.html               # optional: 4:3-Variante für den Beamer
    └── README.md                    # Doku der jeweiligen Präsentation
```

## KMA-Design auf einen Blick

Details siehe [`docs/kma-styleguide.md`](docs/kma-styleguide.md) und
[`!KMA_Template/README.md`](!KMA_Template/README.md):

| Element | Wert |
|---|---|
| KM-A Rot | `#c00000` – Überschriften, Akzente, Logo, Kapitel-Folien |
| KM-A Blau | `#0070c0` – Links, AAA-Marken (Academy / Associates / Austria) |
| Grundfläche | `#ffffff`, Text `#444444` / `#666666` |
| Schrift | Open Sans – lokal vendored in `build/fonts/` (WOFF2, Fallback Arial) |
| Logo | `img/kma_logo_400pxsquare.svg` – Titelfolie via YAML-`institute`, auf jeder Folie dezentes Footer-Logo via CSS |

Fertige Komponenten (semantische Klassen in `custom.css`, im Markdown per
Div-Attributen/Fenced Divs nutzbar): `.columns` (Zweispalter),
`.kma-grid` + `.kma-card` (3er-Karten-Grid), `.swatches` (Farb-Fächer),
`.slide-compact` (kleinere Grundschrift bei viel Inhalt),
`.kma-chapter` (Vollton-Kapitelfolie mit weißem Text via
`{data-background="#c00000" class="kma-chapter"}`).

## Schnellstart

1. Beispiel ansehen: [`!KMA_Template/index.html`](!KMA_Template/index.html)
   im Browser öffnen – dort liegt auch die Anwendungsdoku
   (`!KMA_Template/README.md`) mit dem genauen Build-Befehl.
2. Neue Präsentation: Verzeichnis `JJJJ_MM_Name/` anlegen, `slides.md`,
   `custom.css` und `img/` aus `!KMA_Template/` kopieren, `slides.md`
   bearbeiten.
3. Bauen (aus dem Präsentationsverzeichnis) – reveal.js 6.0.2, Theme `white`
   (wird per CSS-Variablen in `custom.css` ins KMA-Design überschrieben):

   ```bash
   # 16:9 (Standard → index.html)
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

   # 4:3 (Beamer → index-4x3.html) – nur width/height/margin ändern
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

   - `-i`: Listen erscheinen punktweise (Fragmente).
   - `markdown_in_html_blocks`: Markdown auch innerhalb von raw-HTML-Divs.
   - `width`/`height` passend zum Ausgabegerät wählen (reveal.js skaliert die
     Folie seitenverhältnistreu ins Fenster; Default 960×700 ergibt auf 16:9-
     Screens Seitenbalken). Details: `!KMA_Template/README.md`.
   - pandoc **3.1.3** (im Template-README dokumentiert).

4. `index.html` im Browser öffnen – komplett statisch und **voll offline**
   (reveal.js **und** Open Sans liegen lokal in `build/`; ohne `fonts.css`
   fällt die Schrift auf Arial zurück).
   Tasten: `Esc` Übersicht, `s` Speaker-Ansicht (Notizen), `f` Vollbild,
   `?` Hilfe, `index.html?print-pdf` → PDF-Export.

## Versionierung – historisch robuste Decks

- reveal.js liegt **vendored in diesem Git-Repo** (nicht auf einem CDN):
  jedes Deck läuft offline und ist auch in Jahren per `git clone` exakt
  reproduzierbar. Aktuell vorhanden: **reveal.js 6.0.2**
  (`build/reveal.js-6.0.2/`, UMD-Build `dist/reveal.js` funktioniert auch via
  `file://`) und **Open Sans** (`build/fonts/`, WOFF2 + `fonts.css` + OFL-Lizenz,
  geladen via `header-includes` als `<link rel="stylesheet" href="../build/fonts/fonts.css">`).
- Pro Major-Version **ein eigenes Verzeichnis**: `build/reveal.js-6.0.2/`,
  bei Bedarf `build/reveal.js-7.x.y/`, … Bestehende Verzeichnisse **nie
  überschreiben** – alte Decks referenzieren sie per relativem Pfad.
- Jedes Deck pinnt seine Version im Build-Befehl:
  `--variable revealjs-url=../build/reveal.js-6.0.2` plus das passende
  Template (`revealjs-template-6.x.html`; Plugin-Pfade in 6.x unter
  `dist/plugin/*.js`).
- Neue Major-Version aufnehmen: npm-Tarif laden
  (`curl -LO https://registry.npmjs.org/reveal.js/-/reveal.js-X.Y.Z.tgz`),
  `dist/` + `LICENSE` + `package.json` nach `build/reveal.js-X.Y.Z/` kopieren,
  neues Template aus dem letzten ableiten.
- Gebautes `index.html` **mit committen** (Sofortansicht ohne pandoc);
  Quelle `slides.md` sowieso. Pro Deck im README notieren: reveal.js-Version,
  pandoc-Version (`pandoc --version`), genauer Build-Befehl.
- Für langfristige Archivierung zusätzlich PDF-Export neben das Deck legen
  (`index.html?print-pdf` im Browser → „Als PDF speichern“).

## pandoc beschaffen

pandoc wird nicht mitgeliefert. Portable Version (Linux x86_64), z. B.:

```bash
curl -LO https://github.com/jgm/pandoc/releases/download/3.13/pandoc-3.13-linux-amd64.tar.gz
tar xzf pandoc-3.13-linux-amd64.tar.gz   # enthält bin/pandoc
```

oder über den Paketmanager des Systems (`apt install pandoc` etc.).
