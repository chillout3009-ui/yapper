# ARC künftig mit GitHub verwalten

Diese Anleitung ist für die bestehende statische ARC-Plattform gedacht. Ziel:

**lokale Änderung → GitHub → Vercel Preview → Merge in `main` → automatische Live-Aktualisierung**

## Empfohlene Struktur

- `main` = produktive Website
- `feature/...` = Änderungen, die zuerst getestet werden
- Pull Request = kontrollierte Freigabe vor Produktion

## 1. GitHub-Repository anlegen

1. Bei GitHub anmelden.
2. **New repository** wählen.
3. Name: z. B. `arc-training-platform`.
4. Für den Anfang empfehlenswert: **Private**.
5. Repository **nicht** zusätzlich mit README/.gitignore initialisieren, weil diese Dateien bereits in ARC enthalten sind.
6. Repository erstellen.

## 2A. Einfachste Methode: GitHub Desktop

1. Dieses GitHub-Ready-Paket entpacken.
2. GitHub Desktop öffnen.
3. **File → Add Local Repository** bzw. ein vorhandenes lokales Projekt hinzufügen.
4. Falls der Ordner noch kein Git-Repository ist, GitHub Desktop bietet an, eines anzulegen.
5. Als Repository den entpackten ARC-Ordner wählen.
6. Commit-Nachricht: `chore: prepare ARC for GitHub`.
7. **Publish repository** wählen und das eben angelegte GitHub-Repository verwenden.

Ab dann:

1. Dateien ändern.
2. In GitHub Desktop Änderungen prüfen.
3. Commit schreiben.
4. **Push origin**.

## 2B. Alternativ per Terminal

Im ARC-Ordner:

```bash
git init
git add .
git commit -m "chore: prepare ARC for GitHub"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/arc-training-platform.git
git push -u origin main
```

## 3. Bestehendes Vercel-Projekt mit GitHub verbinden

Wenn du deine aktuelle Vercel-Projekt-URL und Domain behalten möchtest, **kein neues Vercel-Projekt anlegen**, sondern das bestehende Projekt verbinden.

### Im Vercel-Dashboard

1. Bestehendes ARC-Projekt öffnen.
2. **Settings → Git** öffnen.
3. GitHub autorisieren, falls nötig.
4. Dein `arc-training-platform` Repository als Connected Git Repository verbinden.
5. Unter **Settings → Environments → Production → Branch Tracking** prüfen, dass `main` die Production Branch ist.

Alternativ mit Vercel CLI:

```bash
npm i -g vercel
vercel login
vercel link
vercel git connect
```

`vercel link` verbindet deinen lokalen ARC-Ordner mit dem bestehenden Vercel-Projekt. `vercel git connect` verbindet danach den Git-Remote mit diesem Projekt.

## 4. So arbeitest du künftig

### Kleine sichere Änderung

```bash
git checkout -b feature/neue-funktion
# Dateien ändern
git add .
git commit -m "feat: neue Funktion"
git push -u origin feature/neue-funktion
```

Danach auf GitHub einen Pull Request öffnen. Vercel erstellt für den Branch/PR eine eigene Preview-URL. Erst testen, dann in `main` mergen.

### Produktion

Sobald ein Pull Request in `main` gemerged wird, erzeugt Vercel automatisch ein Production Deployment. Die bestehende Domain bleibt beim gleichen Vercel-Projekt erhalten.

## 5. Vor jedem Push prüfen

```bash
npm run validate
```

Die gleiche Prüfung läuft zusätzlich automatisch über GitHub Actions.

## 6. Supabase und Schlüssel

`config.js` enthält nur die Browser-Konfiguration für ARC. Ein Supabase **Publishable Key** ist für Browser-Clients gedacht und daher im ausgelieferten Frontend ohnehin sichtbar.

Trotzdem gilt zwingend:

- niemals Supabase `service_role` committen
- niemals OpenAI/API-Secret-Keys committen
- niemals Passwörter oder private Tokens committen
- RLS in Supabase aktiviert lassen

Lokale `.env`-Dateien und typische Secret-Dateien sind deshalb in `.gitignore` ausgeschlossen.

## 7. Wenn eine Änderung kaputt ist

Auf GitHub kannst du den letzten funktionierenden Commit wiederherstellen oder einen fehlerhaften Commit revertieren. Bei Arbeit über Pull Requests bleibt `main` normalerweise stabiler, weil du die Vercel Preview vorher testen kannst.
