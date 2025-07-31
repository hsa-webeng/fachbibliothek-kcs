# KCS Fachbibliothek Website
Barrierefreie Website zum Ausleihen von Fachbüchern und -artikeln zum Thema Inklusivität und Barrierefreiheit.
Zusammenarbeit der KCS mit Studierenden der Hochschule Ansbach.
## Projektbeschreibung und -entwicklung
Das vorliegende Projekt ist der Prototyp einer barrierefreien Website, um die Ausleihe der Medien der Fachbibliothek zu vereinfachen und zugänglich zu machen.
In der Entwicklung des Prototyps wurden HTML und CSS im Frontend und PHP und Javascript sowie SQL im Backend verwendet. Um die vorliegenden Daten aus der Citavi-Datenbank in MySQL einzubinden, wurde JabRef als Zwischeninstanz genutzt.
## Repository Inhalt
buch.html
buch.js
buch.php
buch_debug.log
detail.css
hochschule.js
index.html
kcs_bibliothek.sql
search.php
style.css
## Installation Vorraussetzungen
XAMPP oder ein anderer Webserver mit:
-        Apache
-        PHP (>= 7.4 empfohlen)
-        MySQL oder MariaDB
## Installation Datenbank
- In phpMyAdmin legen sie eine neue Datenbank namens 'kcs-bibliothek’ an, (wenn der Name abweicht, müssen sie den Name der Datenbank in buch.php und search.php ändern)
- setzen sie das CharSet utf8_bin
-Nachdem die Datenbank angelegt ist, importieren sie ‘kcs_bibliothek.sql’ in die Datenbank

## Funktionalität
Auf der Startseite können Stichworte in das Suchfeld eingegeben, oder mit der Erweiterten Suche spezifiziert werden. Daraufhin wird eine Ergebnisliste aus der Datenbank generiert, aus der das gewünschte Medium ausgewählt werden kann. Von dort wird der Nutzer zur Detailseite des Werkes weitergeleitet.
Zukünftig soll es möglich sein, über einen "Ausleihen" Button, wenn das Medium verfügbar ist, das KCS über E-Mail von dem Auftrag in Kenntnis zu setzen.
### Credits
Prototyp erstellt von Anna-Lena Hübl, Irmela Kaufmann, Tamara Loy und Tassia Hausmann, unter Betreuung von Joschi Kuphal und in Zusammenarbeit mit Miriam Grünz.
