document.addEventListener("DOMContentLoaded", () => {
  // Parameter aus der URL holen
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // Referenzen auf DOM-Elemente
  const container = document.getElementById("buchContainer");
  const titelElement = document.getElementById("buchtitel");
  const tabTitel = document.getElementById("tabTitel");
  const tabInhalt = document.getElementById("tabInhalt");

  // Keine ID? Frühzeitiger Abbruch
  if (!id) {
    container.innerHTML = "<p>Buch-ID fehlt.</p>";
    return;
  }

  // Buchdaten vom Server abrufen
  fetch(`buch.php?id=${encodeURIComponent(id)}`)
    .then(res => res.json())
    .then(buch => {

      // Fehler vom Server
      if (buch.error) {
        container.innerHTML = `<p>${buch.error}</p>`;
        return;
      }

      // Titel setzen (Fallback wenn nicht vorhanden)
      titelElement.textContent = buch.title ?? "Titel unbekannt";

      /**
       * Funktion: Keywords als Badges darstellen
       * - Entfernt LaTeX-Reste
       * - Trennt nach , ; :
       * - Baut einzelne <span>-Badges
       */
      function renderKeywordsBadges(keywordString) {
        const wrapper = document.createElement("div");
        wrapper.className = "keywords-wrapper";

        if (!keywordString) return wrapper;

        // 1. Bereinigen
        let cleaned = keywordString
          .replace(/\\[{}]/g, "")                    // z. B. \{ \}
          .replace(/[{}]/g, "")                      // geschweifte Klammern
          .replace(/\\text\w+\{.*?\}/g, "");         // LaTeX-Kommandos

        // 2. Split nach ; , oder :
        const parts = cleaned.split(/;|,|:/);

        // 3. Filter & rendern
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
       * Funktion: Tab "Bibliografische Angaben"
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

        // Keywords einfügen
        if (buch.keywords) {
          const keywordWrapper = renderKeywordsBadges(buch.keywords);
          const keywordOutput = document.getElementById("keywordOutput");
          if (keywordOutput) keywordOutput.appendChild(keywordWrapper);
        }
      }

      /**
       * Funktion: Platzhalter für inhaltliche Beschreibung
       */
      function renderInhalt() {
        container.innerHTML = `<p>Inhaltliche Beschreibung folgt. (Platzhalter)</p>`;
      }

      /**
       * Funktion: Tabs visuell aktiv setzen (und für Screenreader)
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
        activeButton.focus(); // optional für Tastatur-Fokus
      }

      // Initialer Tab anzeigen
      renderTitel();
      activateTab(tabTitel);

      // Event-Listener für Tab-Wechsel
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

     

