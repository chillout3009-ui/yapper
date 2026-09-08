# ARC v10 – Änderungen

- Coach-Reiter vollständig aus Navigation und Oberfläche entfernt.
- Automatische Evidence-Engine auf dem Dashboard: Erholung, Progression und Ausdauerverteilung werden aus Logs abgeleitet.
- Wissenschaftliche Basis mit transparenten Quellen und Grenzen in der App und in `SCIENCE.md`.
- Planvorlagen und automatisch erzeugte Pläne werden **nicht mehr sofort gespeichert**: zuerst vollständiger, editierbarer Entwurf mit Plan-Check.
- Gespeicherte Pläne zeigen bereits in der Übersicht Trainingstage und Übungsbausteine.
- Übungsdarstellungen sind nun übungs-/intervallspezifisch (Equipment, Position/Bewegungsart, Intervallkennung) statt nur nach Oberkategorie.
- Timer-Engine neu geschrieben: timestamp-basiert gegen Drift, Audio-Cues, Wake Lock, Pause/Resume, Vor/Zurück, Lap/Weiter, Reset.
- EMOM: echte Minutenlogik plus klar benannte Every-90s/E2MOM-Varianten und optionale Übungsrotation.
- Tabata: Classic 20/10 × 8; abweichende Schemen werden als Tabata-style gekennzeichnet.
- HIIT: Arbeit, Erholung, Runden, Sätze, Satzpause, Warm-up, Cool-down und Zielintensität konfigurierbar.
- Custom Intervals: eigene Phasen; Zeitintervalle automatisch, Distanz-/Technikintervalle manuell per Lap/Weiter.
- Ausdauerblöcke werden beim Timerstart automatisch interpretiert (z. B. 6×3 min/3 min oder 5×1 km/2 min).
- Account-/Supabase-Sync bleibt erhalten; keine Cloud-KI nötig.
