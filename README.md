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

Basis: ARC v14. Die vorhandene Plattformfunktionalität wurde für die GitHub-Vorbereitung nicht fachlich umgebaut; ergänzt wurden Repository-, Deployment- und Validierungsdateien sowie das zuvor fehlende Web-App-Manifest.

## v12.3
- Kraft-Ruderübungen (Kabel, Maschine, Langhantel, Kurzhantel) sind explizit Strength-Blöcke mit Sätzen/Wdh./RPE.
- Bereits falsch gespeicherte Ruderblöcke werden beim Laden automatisch repariert.
- Ruder-Visuals unterscheiden Cable Row, Row Machine, Barbell Row, Dumbbell Row und Inverted Row deutlicher.
- Visual-Audit prüft alle Katalogeinträge auf eine spezifische Darstellung.


## ARC v13
- Klarere Informationshierarchie und mobile Bedienung
- Datenbasierte 7-Tage-Grafiken im Dashboard
- Übersichtlichere Plan- und Workout-Karten mit Zeit-/Blockzusammenfassung
- Aufgeräumter Wochenplan und fokussierter Live-Workout-Modus
- Visuelle Exercise-Cards mit konsistenterem Kontrast und Tiefe


## ARC v13.1
- Trainingsseite deutlich reduziert: Einheiten zuerst, Timer und manuelle Eingabe sekundär.
- Live-Workout kann während der Einheit um Sätze und Übungen erweitert oder gekürzt werden.
- Satztracking fragt standardmäßig nur Gewicht, Wiederholungen und Erledigt ab.
- Session-RPE, Wohlbefinden und Schmerz werden ausschließlich einmal beim Beenden erfasst.
- Optional können Live-Änderungen beim Abschluss in den zugrunde liegenden Plan übernommen werden.
- Dashboard-Kennzahlen und Startseitenaktionen haben explizite Ziele; Erholungswerte öffnen einen Verlauf statt ein zusätzliches Check-in-Formular.


## ARC v13.2
- Distanzfelder erscheinen nur noch bei echten Strecken-/Ausdaueraktivitäten; Schwimmen/Rudern nutzen Meter, Lauf/Rad/Skaten/Wandern Kilometer.
- Vor dem Start öffnet eine Trainingskarte eine vollständige Listenübersicht mit getrennten Blöcken.
- Während des Trainings ist die gesamte Übungs-/Blockliste jederzeit über „Übersicht“ erreichbar und direkt anspringbar.
- Gym, Laufen, Schwimmen, Rad, Skaten, Rudern, EMOM, CrossFit, Calisthenics, Reha und Mobility werden als getrennte Modalitätsblöcke eines Trainingstags gruppiert.
- Der Planeditor kann verschiedene Modalitäten am selben Tag kombinieren; die Blockauswahl ist nicht mehr auf die Tages-Sportart beschränkt.


## ARC v14
- Startübersicht: Kennzahlen und Insights öffnen echte Detailansichten statt tote Kacheln.
- Trainingsblöcke besitzen sportartspezifisches Live-Tracking für Gym, Lauf, Schwimmen, Rad, Rudern, EMOM/HIIT/CrossFit sowie Mobility/Reha.
- Krafttraining zeigt letzte Satzleistungen direkt am Satz und deterministische Progressionsvorschläge.
- Trainingsstart erlaubt den Start des gesamten Tages oder nur eines einzelnen Modalitätsblocks.
- Laufende Workouts bleiben editierbar: Übungen hinzufügen/entfernen und Reihenfolge ändern.
- Visuelles Trainingstagebuch, PR-Ansicht, Muskel-/Volumenanalyse und adaptive Wochenhinweise.
- Nach dem Training öffnet eine sportartspezifische Auswertung mit Volumen, Sätzen, RPE, Erschöpfung, Distanz/Pace und optionaler MET-Kalorienschätzung.
- Wearable-Bereich zeigt transparent den Integrationsstatus; ohne Provider-Authentifizierung wird kein Fake-Sync vorgetäuscht.
- Private Sharing-Funktion über Web Share / Zwischenablage.
- Zusätzliche Responsive-/Text-Fixes gegen Überlappungen und abgeschnittene Inhalte.
