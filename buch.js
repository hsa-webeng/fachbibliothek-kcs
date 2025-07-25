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
        <h2>${buch.title ?? "-"}</h2>
        <dl>
          <dt>Autor:</dt><dd> ${buch.author ?? "-"}</dd>
          <dt>Beschreibung:</dt> <dd>${buch.description ?? ""}</dd>
          <dt>Keywords:</dt> <dd>${buch.keywords ?? ""}</dd>
          <dt>ISBN:</dt> <dd>${buch.isbn ?? ""}</dd>
          <dt>Verlag:</dt> <dd>${buch.publisher ?? ""}</dd>
          <dt>Jahr:</dt> <dd>${buch.year ?? ""}</dd>
          <dt>Status:</dt> <dd>${buch.status ?? ""}</dd>
        </dl>
        <button id="anfrageButton">Ausleihe anfragen</button>
        <form id="anfrageFormular" hidden>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required />
          <label for="email">E-Mail:</label>
          <input type="email" id="email" name="email" required />
          <label for="dauer">Leihdauer:</label>
          <input type="text" id="dauer" name="dauer" required />
          <label for="isbn">ISBN:</label>
          <input type="text" id="isbn" name="isbn" value="${buch.isbn ?? ""}" readonly />
          <label for="anmerkung">Anmerkung:</label>
          <textarea id="anmerkung" name="anmerkung"></textarea>
          <button type="submit">Absenden</button>
          <button type="button" id="abbrechen">Abbrechen</button>
        </form>
      `;

      document.getElementById("anfrageButton").addEventListener("click", () => {
        document.getElementById("anfrageFormular").hidden = false;
      });

      document.getElementById("abbrechen").addEventListener("click", () => {
        document.getElementById("anfrageFormular").hidden = true;
      });

      document.getElementById("anfrageFormular").addEventListener("submit", (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const dauer = form.dauer.value;
        const isbn = form.isbn.value;
        const anmerkung = form.anmerkung.value;

        const body = `
Hallo,

ich möchte folgendes Buch ausleihen:

📘 Titel: ${buch.title ?? "-"}
👤 Name: ${name}
📧 Mail: ${email}
🕒 Leihdauer: ${dauer}
🔢 ISBN: ${isbn}
📝 Anmerkung: ${anmerkung}

Viele Grüße
${name}
        `;
        const mailtoLink = `mailto:starsandmoonys@gmail.com?subject=Ausleiheanfrage: ${encodeURIComponent(buch.title ?? "-")}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
      });
    })
    .catch(() => {
      container.innerHTML = "<p>Fehler beim Laden des Buchs.</p>";
    });
});

