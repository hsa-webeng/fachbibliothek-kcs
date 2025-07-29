// Warten bis das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // === ELEMENT‑REFERENZEN =======
  // ==============================

  const toggleBtn    = document.getElementById("toggleAdvancedButton"); // Umschalt-Button
  const advanced     = document.getElementById("advancedSearch");       // Erweiterte Suche
  const simpleForm   = document.getElementById("simpleSearchForm");     // Formular für einfache Suche
  const advancedForm = document.getElementById("advancedForm");         // Formular für erweiterte Suche
  const ergebnisse   = document.getElementById("ergebnisContainer");    // Container für Ergebnisliste

  // ==============================
  // === SUCHERGEBNISSE RENDER ===
  // ==============================

  /**
   * Zeigt eine Liste von Buchergebnissen im DOM an
   */
  function zeigeErgebnisse(buecher) {
    if (!buecher || buecher.length === 0) {
      return zeigeKeineTreffer("Keine Treffer gefunden.");
    }

    ergebnisse.innerHTML = buecher.map(buch => {
      const id     = buch.ENTRY_SHARED_ID ?? "";
      const title  = buch.title  ?? "Unbekannter Titel";
      const author = buch.author ?? "Unbekannter Autor";

      // Fehlerbehandlung: Buch ohne gültige ID
      if (!id) {
        console.warn("⚠️ Buch ohne ID:", buch);
        return `<div class="result-card">⚠️ Buch ohne gültige ID</div>`;
      }

      // HTML-Struktur für ein einzelnes Ergebnis
      return `
        <div class="result-card">
          <a href="buch.html?id=${encodeURIComponent(id)}" class="result-title">
            <strong>${title}</strong>
            ${buch.author 
              ? `<span class="author">von ${author}</span>` 
              : ""}
          </a>
        </div>
      `;
    }).join("");
  }

  /**
   * Zeigt einen Hinweistext an, wenn keine Ergebnisse vorliegen
   */
  function zeigeKeineTreffer(txt = "Keine passenden Ergebnisse gefunden.") {
    ergebnisse.innerHTML = `<p>${txt}</p>`;
  }

  // ====================================
  // === FETCH + JSON FEHLERBEHANDLUNG ==
  // ====================================

  /**
   * Führt eine HTTP-Anfrage aus und behandelt Fehler beim Parsen
   */
  function fetchUndPruefen(url, callback) {
    fetch(url)
      .then(res => res.text())
      .then(text => {
        try {
          const json = JSON.parse(text);
          callback(json);
        } catch (err) {
          console.error("❌ Parsing-Fehler:", err, text);
          zeigeKeineTreffer("Unerwartete Serverantwort. Siehe Konsole.");
        }
      })
      .catch(err => {
        console.error("❌ Netzfehler:", err);
        zeigeKeineTreffer("Serverfehler. Bitte später erneut versuchen.");
      });
  }

  // ============================
  // === EINFACHE SUCHE LOGIK ===
  // ============================

  if (simpleForm) {
    simpleForm.addEventListener("submit", e => {
      e.preventDefault();

      const input = simpleForm.querySelector('input[name="query"]');
      const q     = input.value.trim();

      // Leere Eingabe → Hinweis
      if (!q) {
        return zeigeKeineTreffer("Bitte geben Sie einen Suchbegriff ein.");
      }

      const url = `search.php?query=${encodeURIComponent(q)}`;
      console.log("🔍 Einfache Suche:", url);
      fetchUndPruefen(url, zeigeErgebnisse);
    });
  }

  // ==============================
  // === ERWEITERTE SUCHE LOGIK ===
  // ==============================

  if (advancedForm) {
    advancedForm.addEventListener("submit", e => {
      e.preventDefault();

      const author    = document.getElementById("autor").value.trim();
      const title     = document.getElementById("titel").value.trim();
      const isbn      = document.getElementById("isbn").value.trim();
      const publisher = document.getElementById("verlag").value.trim();

      const genres = Array.from(
        document.querySelectorAll("input[name='genre']:checked")
      ).map(el => el.value);

      // Kein Feld ausgefüllt → Hinweis
      if (!author && !title && !isbn && !publisher && genres.length === 0) {
        return zeigeKeineTreffer("Bitte mindestens ein Kriterium angeben.");
      }

      // Suchparameter zusammenstellen
      const params = new URLSearchParams();
      if (author)    params.append("author", author);
      if (title)     params.append("title", title);
      if (isbn)      params.append("isbn", isbn);
      if (publisher) params.append("publisher", publisher);
      genres.forEach(g => params.append("genre[]", g));

      const url = `search.php?${params.toString()}`;
      console.log("🔍 Erweiterte Suche:", url);
      fetchUndPruefen(url, zeigeErgebnisse);
    });
  }

  // ==================================
  // === TOGGLE "ERWEITERTE SUCHE" ====
  // ==================================

  if (toggleBtn && advanced) {
    toggleBtn.addEventListener("click", () => {
      const showing = !advanced.hasAttribute("hidden");

      // Sichtbarkeit toggeln
      advanced.toggleAttribute("hidden");

      // Button-Text aktualisieren
      toggleBtn.textContent = showing
        ? "Erweiterte Suche"
        : "Einfache Suche";
    });
  }

  // =====================================
  // === RESET-HANDLING FÜR FORMS ========
  // =====================================

  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("reset", () => {
      // Mit kurzem Delay prüfen, ob alle Felder leer sind
      setTimeout(() => {
        const query = document.querySelector('input[name="query"]')?.value.trim();

        const filledAdvanced = Array.from(
          document.querySelectorAll("#advancedSearch input")
        ).some(i => i.value.trim() || i.checked);

        // Wenn kein Feld gefüllt ist → Hinweis anzeigen
        if (!query && !filledAdvanced) {
          zeigeKeineTreffer("Bitte eine Suche starten, um Ergebnisse zu sehen.");
        }
      }, 0);
    });
  });

});
