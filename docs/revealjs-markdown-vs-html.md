# reveal.js mit Markdown oder direkt in HTML? – Zusammenfassung

Datum: 2026-11-05
Kontext: Diskussion zum Workflow mit Markdown + pandoc (Vorbild: <https://github.com/zhbluzern/slides>)

## Frage

Ist Markdown (gebaut mit pandoc zu reveal.js-HTML) der beste Weg für Präsentationen,
oder erreicht man damit nicht alle Gestaltungsmöglichkeiten von reveal.js?
Sollte man besser direkt im HTML-Code arbeiten?

## Kurzantwort

**Markdown als Quelle behalten und bei Bedarf raw HTML direkt in die .md-Dateien einbetten.**
Damit kommt man an praktisch alle Gestaltungsmöglichkeiten von reveal.js –
man muss nicht auf reines HTML umsteigen. Reines HTML lohnt sich nur bei stark
interaktiven Decks (eigene JS-Visualisierungen, eingebettete Apps, komplexe Animationen).

## Begründung (pandoc + revealjs-Writer)

Pandoc gibt raw HTML-Blöcke und inline HTML 1:1 in die `<section>`-Elemente aus
(Markdown-in-HTML-Blöcken ist standardmäßig deaktiviert, d. h. das HTML wird nicht „kaputt geparst").
Damit ist der HTML-Escape-Hatch immer verfügbar:

| Was man will | Lösung im Markdown |
|---|---|
| Folien-Attribute (Hintergrund, Transition, eigene Klasse) | Header-Attribute: `## Titel {data-background="img/x.jpg" data-transition="zoom"}` |
| Fragmente (schrittweises Einblenden) | Listen mit `-i` (inkrementell) oder gezielt: `::: {.fragment} ... :::` |
| Sprechernotizen | `::: notes ... :::` (pandoc macht daraus `<aside class="notes">`) |
| Zweispaltige/komplexe Layouts | raw HTML (`<div class="columns">...`) + eigene CSS-Klasse; mit `-f markdown+markdown_in_html_blocks` darf im HTML sogar wieder Markdown stehen |
| Code-Highlighting | pandoc-eigene Syntaxhervorhebung (skylighting), keine Konfiguration nötig |
| Vertikale Folien | `#`-Kapitel mit `##`-Folien darunter (pandoc erzeugt bei reveal.js daraus eine 2D-Struktur: `#` horizontal, `##` vertikal) |

## Was nicht im Markdown geht (und wo es hingehört)

- `Reveal.initialize({...})`, Plugin-Einbindung, globales JS/CSS
  → eigenes pandoc-Template (`--template=...`, siehe `build/revealjs-template-4.x.html`)
    oder `--include-in-header=bundle.html`
- Theme/CSS → `--variable theme="..."` bzw. `build/reveal.js-4.3.1/dist/theme/*.css`

Hinweis: Das pandoc-Standardtemplate (3.x) lädt die reveal.js-Plugins noch über die
alten 3.x-Pfade (`dist/plugin/notes.js`). Für das vendorte reveal.js 4.x braucht man
die Pfade `plugin/notes/notes.js` etc. – deshalb liegt in `build/` ein angepasstes
Template (`revealjs-template-4.x.html`).

## Alternativen (kurz geprüft)

- **reveal-md**: komfortabel (Live-Reload, Speaker Notes in eigenen Dateien, Frontmatter),
  braucht aber einen Server; für statisches Hosting (GitHub Pages) Export via `--static` nötig.
- **reveal.js-eigenes Markdown-Plugin**: `<section data-markdown="slides.md">` im HTML,
  Markdown wird zur Laufzeit geladen (`Note:` für Notizen,
  `<!-- .slide: data-... -->` für Folien-Attribute). Spart den Build-Schritt,
  lokales `file://` kann das Laden der .md aber blockieren.
- **Marp**: ähnlich markdown-zentriert, eigenes Ökosystem.

Da der bestehende Workflow (Markdown → pandoc → statisches HTML → GitHub Pages) läuft,
lohnt sich ein Umstieg nicht.

## Fazit / Empfehlung

1. Markdown-Dateien bleiben die Quelle der Inhalte (lesbar, gut versionierbar).
2. Für Sonderfälle raw HTML in die .md einbetten (Attribute am Header, `::: notes`,
   `::: {.fragment}`, Layout-divs) – dann fehlt nichts.
3. Globale Anpassungen (Plugins, Konfiguration, eigenes CSS) über das angepasste
   Template in `build/revealjs-template-4.x.html` und `--include-in-header`.
4. Reines HTML nur für hochgradig interaktive Einzeldecks.

Praxisbeispiel siehe `2026_11_Beispielpraesentation/` (inkl. Anwendungsdoku in dessen `README.md`).
