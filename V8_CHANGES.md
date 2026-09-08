# ARC v8 — Coach-Upgrade

- Datenbasierter lokaler Coach statt generischem Keyword-Fallback.
- Auswertung der letzten 7/14/28 Tage: Einheiten, Minuten, Session-RPE, Wohlbefinden, Schmerzscore und Belastungsindikator (Dauer × RPE).
- Vergleich aktuelle Woche vs. Vorwoche, wenn genügend Daten vorhanden sind.
- Readiness-Schätzung aus den letzten Einheiten.
- Erkennt konkrete Übungen aus der ARC-Übungsbibliothek und wertet geloggte Sätze, Gewicht, Wiederholungen und RPE aus.
- Konkrete Progressionsregeln pro Übung.
- Analysiert den gespeicherten Wochenplan auf direkt aufeinanderfolgende harte Tage.
- Antworten auf heutiges Training, letztes Training, Recovery/Deload und sport-spezifische Fragen.
- Bessere Antworten für Laufen, Schwimmen, Rad, Skaten, Rudern und Hiking.
- Sicherheitslogik für Warnzeichen.
- Nutzertext wird im Chat escaped.
- Neue Schnellfragen.
- Vollständig lokal: keine API und keine Tokens.
