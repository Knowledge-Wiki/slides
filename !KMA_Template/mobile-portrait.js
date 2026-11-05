/* Mobile-first: Hochformat-Optimierung (testweise KMA-Template)
   ------------------------------------------------------------------
   reveal.js skaliert die Folie seitenverhältnistreu ins Fenster. Auf einem
   hochformatigen kleinen Bildschirm (Telefon) wäre die 16:9-Folie nur ein
   schmaler Streifen in der Mitte – oben/unten tote Fläche, Text winzig.

   Deshalb wird im Hochformat per Reveal.configure() die Foliengröße auf das
   Seitenverhältnis des Fensters umgestellt (Breite fix 720, Höhe = 720 * vh/vw).
   Die Folie füllt dann Breite UND Höhe des Screens und der Inhalt ist deutlich
   größer lesbar. Im Querformat wird die ursprüngliche Foliengröße
   (16:9: 1280x720 bzw. 4:3: 1024x768) wiederhergestellt.

   Die Klasse `kma-portrait` am <html>-Element schaltet die zugehörigen
   CSS-Regeln in custom.css frei (Komponenten stapeln sich, damit der Inhalt
   die verfügbare Höhe ausfüllt). Ohne JS bleibt das Layout unverändert. */
(function () {
  "use strict";

  if (!window.Reveal) return;                 // reveal.js nicht geladen
  if (/print-pdf/.test(location.search)) return; // PDF-Export nicht anfassen

  var PORTRAIT_BASE_WIDTH = 720;              // Folienbreite im Hochformat
  var base = null;                            // ursprüngliche Foliengröße

  function captureBase() {
    if (base) return;
    var c = Reveal.getConfig();
    base = { width: c.width, height: c.height };
  }

  function apply() {
    if (!base) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var portrait = vh > vw;
    document.documentElement.classList.toggle("kma-portrait", portrait);
    if (portrait) {
      // Folie exakt im Fenster-Seitenverhältnis -> füllt den Screen komplett
      Reveal.configure({
        width: PORTRAIT_BASE_WIDTH,
        height: Math.max(1, Math.round(PORTRAIT_BASE_WIDTH * vh / vw))
      });
    } else {
      Reveal.configure({ width: base.width, height: base.height });
    }
  }

  // Basis-Foliengröße erst nach Reveal-Init übernehmen (sonst Default 960x700)
  if (Reveal.isReady && Reveal.isReady()) {
    captureBase();
    apply();
  } else {
    Reveal.on("ready", function () {
      captureBase();
      apply();
    });
  }

  window.addEventListener("resize", apply);
  window.addEventListener("orientationchange", apply);
})();
