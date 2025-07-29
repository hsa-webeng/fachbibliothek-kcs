// Wartet, bis das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------------------
  // URL-Parameter auslesen (z. B. ?id=123)
  // -------------------------------------------
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // DOM-Elemente vorbereiten
  const container = document.getElementById("buchContainer");
  const titelElement = document.getElementById("buchtitel");
  const tabTitel = document.getElementById("tabTitel");
  const tabInhalt = document.getElementById("tabInhalt");

  // Falls keine Buch-ID vorhanden ist: Fehlermeldung anzeigen
  if (!id) {
    container.innerHTML = "<p>Buch-ID fehlt.</p>";
    return;
  }

  // -------------------------------------------
  // Buchdaten vom Server laden
  // -------------------------------------------
  fetch(`buch.php?id=${encodeURIComponent(id)}`)
    .then(res => res.json())
    .then(buch => {

      // Fehlerbehandlung vom Server
      if (buch.error) {
        container.innerHTML = `<p>${buch.error}</p>`;
        return;
      }

      // Buchtitel in der Überschrift setzen (mit Fallback)
      titelElement.textContent = buch.title ?? "Titel unbekannt";

      /**
       * KEYWORDS ALS BADGES DARSTELLEN
       * - Bereinigt LaTeX-Kommandos
       * - Trennt nach , ; :
       * - Gibt einzelne <span>-Elemente zurück
       */
      function renderKeywordsBadges(keywordString) {
        const wrapper = document.createElement("div");
        wrapper.className = "keywords-wrapper";

        if (!keywordString) return wrapper;

        // Schritt 1: LaTeX entfernen
        let cleaned = keywordString
          .replace(/\\[{}]/g, "")                     // z. B. \{ oder \}
          .replace(/[{}]/g, "")                       // geschweifte Klammern
          .replace(/\\text\w+\{.*?\}/g, "");          // LaTeX-Kommandos wie \textbf{}

        // Schritt 2: Aufteilen in einzelne Begriffe
        const parts = cleaned.split(/;|,|:/);

        // Schritt 3: Trimmen, Filtern, Badge erzeugen
        parts.map(k => k.trim())
             .filter(k => k.length > 1)
             .forEach(kw => {
               const badge = document.createElement("span");
               badge.className = "keyword-badge";
               badge.textContent = kw;
               wrapper.appendChild(badge);
             });

        return wrapper;
      }

      /**
       * ANZEIGE: Bibliografische Angaben (Tab 1)
       */
      function renderTitel() {
        container.innerHTML = `
          <h3 class="buch-section-title">Bibliografische Angaben</h3>
          <dl class="buch-infos">
            <div><dt>Autor:</dt><dd>${buch.author ?? "Keine Angabe"}</dd></div>
            <div><dt>Beschreibung:</dt><dd>${buch.description || "Keine Beschreibung vorhanden."}</dd></div>
            <div><dt>Keywords:</dt><dd id="keywordOutput">${buch.keywords ? "" : "Keine Angabe"}</dd></div>
            <div><dt>ISBN:</dt><dd>${buch.isbn ?? "Keine Angabe"}</dd></div>
            <div><dt>Verlag:</dt><dd>${buch.publisher ?? "Keine Angabe"}</dd></div>
            <div><dt>Jahr:</dt><dd>${buch.year ?? "Keine Angabe"}</dd></div>
            <div><dt>Status:</dt><dd>${buch.status ?? "Keine Angabe"}</dd></div>
          </dl>
        `;

        // Keywords dynamisch einfügen
        if (buch.keywords) {
          const keywordWrapper = renderKeywordsBadges(buch.keywords);
          const keywordOutput = document.getElementById("keywordOutput");
          if (keywordOutput) keywordOutput.appendChild(keywordWrapper);
        }
      }

      /**
       * ANZEIGE: Platzhalter für Inhalt (Tab 2)
       */
      function renderInhalt() {
        container.innerHTML = `<p>Inhaltliche Beschreibung folgt. (Platzhalter)</p>`;
      }

      /**
       * Tabs umschalten (visuell & ARIA)
       * - Setzt aktiven Tab optisch und für Screenreader
       */
      function activateTab(activeButton) {
        [tabTitel, tabInhalt].forEach(btn => {
          btn.classList.remove("active");
          btn.setAttribute("aria-selected", "false");
          btn.setAttribute("tabindex", "-1");
        });

        activeButton.classList.add("active");
        activeButton.setAttribute("aria-selected", "true");
        activeButton.setAttribute("tabindex", "0");
        activeButton.focus(); // für Tastatur-Navigation
      }

      // -------------------------------------------
      // Initial: Titel-Tab anzeigen
      // -------------------------------------------
      renderTitel();
      activateTab(tabTitel);

      // -------------------------------------------
      // Event-Listener für Tab-Wechsel
      // -------------------------------------------
      tabTitel.addEventListener("click", () => {
        activateTab(tabTitel);
        renderTitel();
      });

      tabInhalt.addEventListener("click", () => {
        activateTab(tabInhalt);
        renderInhalt();
      });
    });
});


     

