# ARC – Adaptive Training

ARC ist eine sportartenübergreifende Trainingsplattform für Trainingsplanung, Workout-Tracking, Krafttraining, Laufen, Schwimmen, Radfahren, Skaten, Rudern, Hiking, Conditioning, Mobility und Rehab/Prehab.

## Repository-Struktur

- `index.html` – Hauptanwendung
- `backend.js` – Supabase Auth/Sync
- `config.js` – öffentliche Browser-Konfiguration für Supabase
- `exercise-visuals-v11.js` – Kraft/Calisthenics/Rehab-Visuals
- `cardio-visuals-v12.js` – Cardio-/Ausdauer-Visuals + Kurzbeschreibungen
- `sw.js` – Service Worker / Offline-Cache
- `manifest.webmanifest` – PWA-Metadaten
- `SCIENCE.md` – wissenschaftliche Grundlage
- `docs/GITHUB_SETUP.md` – komplette GitHub-/Vercel-Anleitung
- `docs/DAILY_WORKFLOW.md` – Workflow für künftige Updates

## Lokal prüfen

Voraussetzung: Node.js 22 oder neuer.

```bash
npm run validate
```

Für eine lokale Browser-Vorschau kann der Ordner mit einem beliebigen statischen Webserver ausgeliefert werden, z. B.:

```bash
python3 -m http.server 8080
```

Danach `http://localhost:8080` öffnen.

## Deployment

Empfohlen: GitHub Repository mit dem **bestehenden Vercel-Projekt** verbinden. `main` dient als Production Branch. Andere Branches werden zuerst als Preview getestet.

Siehe: [docs/GITHUB_SETUP.md](docs/GITHUB_SETUP.md)

## Sicherheit

Der Supabase Publishable Key in `config.js` ist für den Browser bestimmt. Private Schlüssel wie Supabase `service_role`, OpenAI-Keys, Passwörter oder sonstige Server-Secrets dürfen niemals in dieses Repository committed werden.

## Aktueller Stand

Basis: ARC v12. Die vorhandene Plattformfunktionalität wurde für die GitHub-Vorbereitung nicht fachlich umgebaut; ergänzt wurden Repository-, Deployment- und Validierungsdateien sowie das zuvor fehlende Web-App-Manifest.

## v12.3
- Kraft-Ruderübungen (Kabel, Maschine, Langhantel, Kurzhantel) sind explizit Strength-Blöcke mit Sätzen/Wdh./RPE.
- Bereits falsch gespeicherte Ruderblöcke werden beim Laden automatisch repariert.
- Ruder-Visuals unterscheiden Cable Row, Row Machine, Barbell Row, Dumbbell Row und Inverted Row deutlicher.
- Visual-Audit prüft alle Katalogeinträge auf eine spezifische Darstellung.
