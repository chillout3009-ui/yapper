# ARC v14

## Training Intelligence
- Letzte Leistung pro Kraftübung und pro Satz wird im Live-Workout angezeigt.
- Deterministische Progressionsvorschläge erhöhen Gewicht nur, wenn die obere Wiederholungsgrenze in der letzten Einheit erreicht wurde.
- PR-Auswertung basiert auf Maximalgewicht und geschätztem 1RM aus tatsächlich protokollierten Sätzen.
- Muskel-/Volumenanalyse fasst Arbeitssätze nach Bereichen zusammen.

## Workout-Blöcke
- Jeder Modalitätsblock kann bereits in der Startübersicht separat gestartet werden.
- Teiltrainings werden als eigene Session gespeichert, ohne den restlichen Trainingstag zu überschreiben.
- Aktive Workouts können Übungen hinzufügen, löschen und umsortieren.
- Sportartspezifische Eingaben: Gym = Sätze/Last/Wdh.; Lauf/Rad/Schwimmen/Rudern = Strecke + Zeit; EMOM/HIIT/CrossFit = Runden/Score; Mobility/Reha = Dauer.

## Auswertung
- Nach dem Speichern erscheint automatisch eine sportartspezifische Auswertung.
- Gym: bewegtes Gewicht, Sätze, Session-RPE, Erschöpfung, PRs und optionale Kalorienschätzung.
- Cardio: Dauer, Distanz, Pace/Geschwindigkeit, Session-RPE, Erschöpfung und optionale Kalorienschätzung.
- Kalorien sind ausdrücklich als MET-basierte Schätzung markiert und werden nur berechnet, wenn ein Körpergewicht hinterlegt wurde.

## Navigation & UI
- Neue ARC-Insights-Detailseite für Trainingstagebuch, Belastung, Erholung, PRs, Muskel-/Volumenanalyse, Wochenplanung, Wearables und Teilen.
- Dashboard-Kacheln öffnen passende Detailansichten.
- Responsive CSS wurde um Text-Wrapping, min-width-Schutz und mobil stabilere Workout-/Modal-Layouts erweitert.

## Integrationen
- Wearable-Sync ist als transparente Statusansicht vorbereitet. Eine echte Garmin/Apple/COROS-Verbindung benötigt weiterhin Provider-Authentifizierung und wird nicht simuliert.
- Teilen funktioniert privat über Web Share API bzw. Zwischenablage.
