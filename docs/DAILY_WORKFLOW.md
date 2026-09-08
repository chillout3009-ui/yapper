# ARC – täglicher GitHub-Workflow

## Wenn du selbst etwas änderst

1. `main` aktualisieren.
2. Neuen Branch erstellen, z. B. `feature/cardio-ui`.
3. Änderung vornehmen.
4. `npm run validate`.
5. Commit + Push.
6. Vercel Preview öffnen und testen.
7. Pull Request mergen.
8. Vercel aktualisiert Produktion automatisch.

## Wenn ChatGPT eine neue ARC-Version erstellt

1. Neue/änderte Dateien herunterladen.
2. In deinen lokalen ARC-Repository-Ordner kopieren und bestehende Dateien ersetzen.
3. GitHub Desktop zeigt exakt, welche Dateien verändert wurden.
4. Änderungen prüfen.
5. In einem neuen Branch committen und pushen.
6. Preview testen.
7. Pull Request nach `main` mergen.

## Sinnvolle Commit-Namen

- `feat: add ...` – neue Funktion
- `fix: correct ...` – Fehlerbehebung
- `ui: improve ...` – Oberfläche
- `docs: update ...` – Dokumentation
- `chore: ...` – Wartung/Struktur

## Merksatz

**Nicht direkt auf der Live-Seite experimentieren. Branch → Preview → Merge → Production.**
