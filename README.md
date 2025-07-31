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
flat_books.sql 
hochschule.js
index.html
search.php
style.css
## Installation Vorraussetzungen
XAMPP oder ein anderer Webserver mit:
-        Apache
-        PHP (>= 7.4 empfohlen)
-        MySQL oder MariaDB
## Funktionalität
Auf der Startseite können Stichworte in das Suchfeld eingegeben, oder mit der Erweiterten Suche spezifiziert werden. Daraufhin wird eine Ergebnisliste aus der Datenbank generiert, aus der das gewünschte Medium ausgewählt werden kann. Von dort wird der Nutzer zur Detailseite des Werkes weitergeleitet.
Wenn das Medium verfügbar ist und der Nutzer aus „Ausleihen“ klickt, wird das KCS über E-Mail von dem Auftrag in Kenntnis gesetzt.
### Credits
Prototyp erstellt von Anna-Lena Hübl, Irmela Kaufmann, Tamara Loy und Tassia Hausmann, unter Betreuung von Joschi Kuphal und in Zusammenarbeit mit Miriam Grünz.
