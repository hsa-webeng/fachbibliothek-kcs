document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id"); // Einheitlich überall "id" verwenden!
  const container = document.getElementById("buchContainer");

  if (!id) {
    container.innerHTML = "<p>Buch-ID fehlt.</p>";
    return;
  }

  fetch(`buch.php?id=${encodeURIComponent(id)}`)
    .then(res => res.json())
    .then(buch => {
      if (buch.error) {
        container.innerHTML = `<p>${buch.error}</p>`;
        return;
      }
      // Überprüfe die Feldnamen per console.log(buch)
      console.log(buch);

      // Definition-Liste
      container.innerHTML = `
        <h2 "buch-title">${buch.title ?? "-"}</h2>
        <dl>
          <dt>Autor:</dt><dd> ${buch.author ?? "-"}</dd>
          <dt>Beschreibung:</dt> <dd>${buch.description ?? ""}</dd>
          <dt>Keywords:</dt> <dd>${buch.keywords ?? ""}</dd>
          <dt>ISBN:</dt> <dd>${buch.isbn ?? ""}</dd>
          <dt>Verlag:</dt> <dd>${buch.publisher ?? ""}</dd>
          <dt>Jahr:</dt> <dd>${buch.year ?? ""}</dd>
          <dt>Status:</dt> <dd>${buch.status ?? ""}</dd>
        </dl>
        
      `;
      }).catch(()=> {
        container.innerHTML = "<p> Fehler beim Laden des Buches.</p>"
      });
    });

     

