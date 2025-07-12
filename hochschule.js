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
      zeigeKeineTreffer();
      return;
    }
    ergebnisse.innerHTML = buecher
      .map(
        buch => `
          <div class="result-card">
            <a href="buch.html?id=${encodeURIComponent(buch.ENTRY_SHARED_ID)}" 
              class="result-title">${buch.title} von ${buch.author}</a>
          </div>`
      )
      .join("");
  }

  function zeigeKeineTreffer(txt = "Keine passenden Ergebnisse gefunden.") {
    ergebnisse.innerHTML = `<p>${txt}</p>`;
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

      fetch(`search.php?query=${encodeURIComponent(q)}`)
        .then(response => response.json())
        .then(buecher => {
          zeigeErgebnisse(buecher);
        })
        .catch(error => {
          console.error('Fehler bei der Suche:', error);
          zeigeKeineTreffer("Die Serverantwort ist ungültig");
        });

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
      const keywords  = Array.from(
        document.querySelectorAll("input[name='genre']:checked")
      ).map(g => g.value);

      if (!author && !title && !isbn && !publisher && keywords.length === 0) {
        zeigeKeineTreffer("Bitte geben Sie mindestens ein Suchkriterium ein.");
        return;
      }

      // Suchparameter zusammensetzen
      const params = new URLSearchParams();
      if (author) params.append("author", author);
      if (title) params.append("title", title);
      if (isbn) params.append("isbn", isbn);
      if (publisher) params.append("publisher", publisher);
      keywords.forEach(g => params.append("genre[]", g));

      fetch(`search.php?${params.toString()}`)
        .then(response => response.json())
        .then(buecher => {
          zeigeErgebnisse(buecher);
        })
        .catch(error => {
          console.error('Fehler bei der erweiterten Suche:', error);
          zeigeKeineTreffer("Fehler bei der Suche. Bitte versuchen Sie es später erneut.");
        });
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
