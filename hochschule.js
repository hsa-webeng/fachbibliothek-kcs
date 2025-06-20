// Wartet, bis die Seite vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {
  // === DOM-Elemente speichern ===
  const toggleBtn       = document.getElementById("toggleAdvancedButton");
  const advancedSection = document.getElementById("advancedSearch");
  const simpleForm      = document.getElementById("simpleSearchForm");
  const advancedForm    = document.getElementById("advancedForm");
  const ergebnisseBox   = document.getElementById("ergebnisse");

  // === Ergebnisse anzeigen ===
  function zeigeErgebnisse(buecher) {
    if (buecher.length === 0) {
      zeigeKeineTreffer();
      return;
    }

    // Ergebnisse als HTML-Karten anzeigen
    ergebnisseBox.innerHTML = buecher.map(buch => `
      <div class="result-card">
        <a href="${buch.id}.html" class="result-title">${buch.anzeige}</a>
      </div>
    `).join("");
  }

  // === Keine Treffer anzeigen ===
  function zeigeKeineTreffer(text = "Keine passenden Ergebnisse gefunden.") {
    ergebnisseBox.innerHTML = `<p>${text}</p>`;
  }

  // === Einfache Suche ===
  simpleForm?.addEventListener("submit", e => {
    e.preventDefault();

    const inputQuery = simpleForm.querySelector('input[name="query"]');
    const suchbegriff = inputQuery.value.trim().toLowerCase();

    if (!suchbegriff) {
      zeigeKeineTreffer("Bitte geben Sie einen Suchbegriff ein.");
      return;
    }

    // Filterung über mehrere Felder
    const treffer = datenbank.filter(buch =>
      [buch.autor, buch.titel, buch.genre, buch.isbn, buch.verlag]
        .filter(Boolean)
        .some(feld => feld.toLowerCase().includes(suchbegriff))
    );

    zeigeErgebnisse(treffer);
    inputQuery.value = ""; // Eingabe leeren
  });

  // === Erweiterte Suche ===
  advancedForm?.addEventListener("submit", e => {
    e.preventDefault();

    // Suchkriterien auslesen
    const autor   = document.getElementById("autor").value.trim().toLowerCase();
    const titel   = document.getElementById("titel").value.trim().toLowerCase();
    const isbn    = document.getElementById("isbn").value.trim().toLowerCase();
    const verlag  = document.getElementById("verlag").value.trim().toLowerCase();
    const genres  = Array.from(document.querySelectorAll("input[name='genre']:checked"))
                         .map(g => g.value.toLowerCase());

    const nichtsAusgefüllt = !autor && !titel && !isbn && !verlag && genres.length === 0;

    if (nichtsAusgefüllt) {
      zeigeKeineTreffer("Bitte geben Sie mindestens ein Suchkriterium ein.");
      return;
    }

    // Filterlogik
    const treffer = datenbank.filter(buch => {
      const passtAutor   = autor   ? buch.autor?.toLowerCase().includes(autor)   : true;
      const passtTitel   = titel   ? buch.titel?.toLowerCase().includes(titel)   : true;
      const passtIsbn    = isbn    ? (buch.isbn   ?? "").toLowerCase().includes(isbn)   : true;
      const passtVerlag  = verlag  ? (buch.verlag ?? "").toLowerCase().includes(verlag) : true;
      const passtGenre   = genres.length > 0
                          ? genres.includes(buch.genre?.toLowerCase())
                          : true;

      return passtAutor && passtTitel && passtIsbn && passtVerlag && passtGenre;
    });

    zeigeErgebnisse(treffer);
  });

  // === Umschalten zwischen einfacher und erweiterter Suche ===
  toggleBtn?.addEventListener("click", () => {
    const istVersteckt = advancedSection.hasAttribute("hidden");
    advancedSection.toggleAttribute("hidden");
    toggleBtn.textContent = istVersteckt ? "Einfache Suche" : "Erweiterte Suche";
  });

  // === Formular-Reset: zeigt Hinweis, wenn alles leer ist ===
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("reset", () => {
      // Kurz warten, bis Felder wirklich geleert sind
      setTimeout(() => {
        const inputsLeer = Array.from(form.querySelectorAll("input[type='text']"))
                                .every(input => !input.value.trim());

        const checkboxLeer = form.querySelectorAll("input[name='genre']:checked").length === 0;
        const allesLeer = inputsLeer && checkboxLeer;

        if (allesLeer) {
          zeigeKeineTreffer("Bitte starten Sie eine Suche, um Ergebnisse zu sehen.");
        }
      }, 0);
    });
  });
});



















