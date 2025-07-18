document.addEventListener("DOMContentLoaded", () => {
  // Element-Referenzen
  const toggleBtn    = document.getElementById("toggleAdvancedButton");
  const advanced     = document.getElementById("advancedSearch");
  const simpleForm   = document.getElementById("simpleSearchForm");
  const advancedForm = document.getElementById("advancedForm");
  const ergebnisse   = document.getElementById("ergebnisContainer");

  // Hilfsfunktionen
  function zeigeErgebnisse(buecher) {
    if (!buecher || buecher.length === 0) {
      zeigeKeineTreffer("Keine Treffer gefunden.");
      return;
    }

    console.log("Das Buch wurde gefunden:");
    buecher.forEach(b => {
    console.log("📖 Titel:", b.title, "| Autor:", b.author, "| ID", b.ENTRY_SHARED_ID)
    });

    ergebnisse.innerHTML = buecher
      .map(buch => {
        const id     = buch.ENTRY_SHARED_ID ?? "";
        const title  = buch.title ?? "Unbekannter Titel";
        const author = buch.author ?? "Unbekannter Autor";

        if (!id) {
          console.warn("⚠️ WARNUNG: Buch ohne ID:", buch);
          return `<div class="result-card">⚠️ Buch ohne gültige ID</div>`;
        }

        return `
          <div class="result-card">
            <a href="buch.html?id=${encodeURIComponent(id)}" class="result-title">
              <strong>${title}</strong>${buch.author ? " von " + author : ""}
            </a>
          </div>`;
      })
      .join("");
  }

  function zeigeKeineTreffer(txt = "Keine passenden Ergebnisse gefunden.") {
    ergebnisse.innerHTML = `<p>${txt}</p>`;
  }

  // 🔍 JSON oder Textprüfung
  function fetchUndPrüfen(url, callback) {
    fetch(url)
      .then(res => res.text())
      .then(text => {
        try {
          const json = JSON.parse(text);
          callback(json);
        } catch (err) {
          console.error("❌ Fehler beim Parsen der Antwort:", err, text);
          zeigeKeineTreffer("Unerwartete Serverantwort. Bitte prüfe die Server-Konsole.");
        }
      })
      .catch(err => {
        console.error("❌ Netzfehler oder Server nicht erreichbar:", err);
        zeigeKeineTreffer("Serverfehler. Bitte später erneut versuchen.");
      });
  }

  // Einfache Suche
  if (simpleForm) {
    simpleForm.addEventListener("submit", e => {
      e.preventDefault();
      const input = simpleForm.querySelector('input[name="query"]');
      const q     = input.value.trim();

      if (!q) {
        zeigeKeineTreffer("Bitte geben Sie einen Suchbegriff ein.");
        return;
      }

      const url = `search.php?query=${encodeURIComponent(q)}`;
      console.log("🔍 Sende einfache Suchanfrage:", url);
      fetchUndPrüfen(url, zeigeErgebnisse);

      input.value = "";
    });
  }

  // Erweiterte Suche
  if (advancedForm) {
    advancedForm.addEventListener("submit", e => {
      e.preventDefault();
      const author    = document.getElementById("autor").value.trim();
      const title     = document.getElementById("titel").value.trim();
      const isbn      = document.getElementById("isbn").value.trim();
      const publisher = document.getElementById("verlag").value.trim();
      const keywords  = Array.from(document.querySelectorAll("input[name='genre']:checked"))
                            .map(g => g.value);

      if (!author && !title && !isbn && !publisher && keywords.length === 0) {
        zeigeKeineTreffer("Bitte geben Sie mindestens ein Suchkriterium ein.");
        return;
      }

      const params = new URLSearchParams();
      if (author)    params.append("author", author);
      if (title)     params.append("title", title);
      if (isbn)      params.append("isbn", isbn);
      if (publisher) params.append("publisher", publisher);
      keywords.forEach(g => params.append("genre[]", g));

      const url = `search.php?${params.toString()}`;
      console.log("🔍 Sende erweiterte Suchanfrage:", url);
      fetchUndPrüfen(url, zeigeErgebnisse);
    });
  }

  // Toggle für "Erweiterte Suche"
  if (toggleBtn && advanced) {
    toggleBtn.addEventListener("click", () => {
      const hidden = advanced.hasAttribute("hidden");
      advanced.toggleAttribute("hidden");
      toggleBtn.textContent = hidden ? "Einfache Suche" : "Erweiterte Suche";
    });
  }

  // Reset-Hinweis
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("reset", () => {
      setTimeout(() => {
        const autor   = document.getElementById("autor")?.value.trim();
        const titel   = document.getElementById("titel")?.value.trim();
        const isbn    = document.getElementById("isbn")?.value.trim();
        const verlag  = document.getElementById("verlag")?.value.trim();
        const genres  = document.querySelectorAll("input[name='genre']:checked");
        const query   = document.querySelector('input[name="query"]')?.value.trim();

        if (!autor && !titel && !isbn && !verlag && genres.length === 0 && !query) {
          zeigeKeineTreffer("Bitte starten Sie eine Suche, um Ergebnisse zu sehen.");
        }
      }, 0);
    });
  });
});
