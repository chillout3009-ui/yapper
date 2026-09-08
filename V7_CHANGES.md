# ARC v7 — Bild- und Screenshot-Import

## Neu

- Trainingspläne können aus **Screenshots und Fotos** erkannt werden.
- Upload von bis zu 8 Bildern gleichzeitig.
- **Lokale OCR im Browser** mit Deutsch + Englisch (Tesseract.js); Bilder werden von ARC nicht an einen eigenen Server gesendet.
- Automatische Zuordnung erkannter Zeilen zum ARC-Übungs- und Ausdauerkatalog.
- Erkennt u. a. `3×10`, `4 × 8–12`, RPE-Angaben, Zeitvorgaben und Ausdauerintervalle wie `5×1 km` oder `8×400 m`.
- Wochentage in Screenshots werden als Trainingstage übernommen.
- Review vor dem Import: erkannte Übung kann aus einer Liste korrigiert werden; Sätze/Intervalle können geprüft werden.
- Nicht eindeutig erkannte Textzeilen werden separat angezeigt, statt stillschweigend verworfen zu werden.
- Anschließend öffnet sich der normale Plan-Editor; dort können fehlende Bausteine ergänzt und der Plan gespeichert werden.
- Mehrere Screenshots können zu einem Plan zusammengeführt werden.

## Datenschutz

Die OCR läuft im Browser. ARC sendet die ausgewählten Bilddateien nicht an Supabase oder einen ARC-Server. Beim ersten Start lädt Tesseract.js die für die Texterkennung benötigten Bibliotheks-/Sprachdateien aus dem CDN.

## Update-Verhalten

Der Service Worker wurde auf `arc-v7` aktualisiert. Navigationen verwenden jetzt Network-first, damit neue Deployments nicht mehr so leicht durch eine alte gecachte `index.html` verdeckt werden.
