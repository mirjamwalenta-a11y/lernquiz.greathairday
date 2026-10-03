# Sicherheits-Check vor dem Merge

Kurze Checkliste zu den Regeln in `CLAUDE.md`. Gilt für dieses Repo und das gemeinsame Supabase-Projekt
`wrxlaltgtgkdomklgrlj`.

**Wann durchgehen?** Vor jedem Merge, der eines davon enthält:
- neue Tabelle, neue Spalte mit persönlichen Daten, neue oder geänderte Policy
- neuer Login-Weg, „Angemeldet bleiben“, neue Rolle oder Rollenprüfung
- neue Funktion mit `SECURITY DEFINER`, neue View
- neue Seite, die mit dem anon-Key auf Supabase zugreift

Reine Lerninhalte ohne Supabase-Zugriff (statische Daten, `localStorage`) brauchen nur Punkt 1 und den Datenschutz-Punkt aus Abschnitt 3.

---

## 1. Schnell-Check (immer)

- [ ] Keine Zugangsdaten, privaten E-Mail-Adressen oder anderen persönlichen Daten in Code, Kommentaren, Doku oder `value="…"`
- [ ] Keine Fotos oder Namen echter Kund:innen ohne Freigabe
- [ ] Rollen (Meisterin/Chefin, Lehrling) werden nur zum Ein- und Ausblenden im Browser geprüft. Die eigentliche Sperre liegt in RLS oder einer Funktion auf dem Server.

## 2. Neue Tabelle

1. **RLS im selben Schritt wie `CREATE TABLE`**, in derselben Migration:
   ```sql
   CREATE TABLE public.beispiel ( … );
   ALTER TABLE public.beispiel ENABLE ROW LEVEL SECURITY;
   ```
   RLS ohne Policy sperrt erst einmal alles. Das ist der sichere Ausgangszustand.
2. **Policies so eng wie möglich.** Muster aus `supabase/20260927_rls_lernquiz_schnuppertag.sql`:
   - Meisterin: `USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin())`
   - eigene Zeilen: über `auth.uid()`, z. B. `lehrlinge.user_id = auth.uid()`
   - Lesen für alle Angemeldeten nur bei Inhalten ohne persönliche Daten (z. B. Quizfragen)
3. **Keine Sammel-Policy `auth.role() = 'authenticated'` zum Schreiben.** Policies sind ODER-verknüpft. Eine solche Policy öffnet die Tabelle für jedes Konto aller Apps im Projekt, auch für Test- und Lehrlingskonten.
4. **Keine anon-Policy ohne Rückfrage.** Wenn ein Zugriff ohne Login nötig ist (z. B. Wochenquiz-Link), nur genau die eine Aktion freigeben und im Kommentar der Migration begründen.
5. **Prüfen** (SQL-Editor), siehe Abschnitt 5: Die Tabelle taucht nicht unter „ohne RLS“ auf, und die Policies sind die erwarteten.

## 3. Neuer Login-Weg, Sitzung, Rolle

- [ ] „Angemeldet bleiben“ nutzt ein **zufälliges, ablaufendes Token**, das auf dem Server geprüft wird. Nie eine Personen-ID, einen Namen oder eine andere erratbare oder vom Browser frei setzbare ID.
- [ ] PINs und Passwörter sind nicht per anon-Key lesbar, auch nicht gehasht.
- [ ] Die Rollenprüfung läuft über RLS, eine `SECURITY DEFINER`-Funktion oder eine Edge Function. Eine JS-Prüfung wie `if (!istChefin()) return` ist nur Bedienkomfort.
- [ ] `SECURITY DEFINER`-Funktionen setzen `SET search_path = public` (oder leer) und prüfen selbst, wer sie aufruft.
- [ ] Neue Views in `public` mit `WITH (security_invoker = true)`, sonst umgehen sie RLS.

## 4. Automatisches RLS-Audit einrichten (einmalig)

`.github/workflows/rls-audit.yml` prüft jeden Montag alle Tabellen im Projekt. Findet es eine Tabelle ohne RLS,
legt es ein GitHub-Issue mit dem Label `rls-audit` an. Ist schon eines offen, kommt ein Kommentar dazu. Sind wieder alle Tabellen
abgesichert, schließt es das Issue.

**Schritt 1 – Lese-Konto anlegen** (Supabase → SQL Editor). Das Konto braucht keine Rechte auf Tabellen. Es liest nur den
Systemkatalog, und das darf jede Rolle.
```sql
CREATE ROLE rls_audit LOGIN PASSWORD '<neues langes Zufallspasswort>'
  NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
ALTER ROLE rls_audit SET default_transaction_read_only = on;
```
Das Passwort nirgends im Repo ablegen.

**Schritt 2 – Verbindungs-URL holen.** Supabase → *Connect* → **Session pooler** (Port 5432). Die direkte Verbindung
funktioniert von GitHub aus oft nicht, weil sie nur IPv6 nutzt. In der URL Benutzer und Passwort ersetzen:
```
postgresql://rls_audit.wrxlaltgtgkdomklgrlj:<PASSWORT>@<host aus dem Dashboard>:5432/postgres
```

**Schritt 3 – Secret setzen.** GitHub → Repo → *Settings* → *Secrets and variables* → *Actions* →
*New repository secret*: Name `SUPABASE_DB_URL`, Wert = URL aus Schritt 2.

**Schritt 4 – Testlauf.** GitHub → *Actions* → *RLS-Audit* → *Run workflow*. Grün = alles abgesichert oder Issue angelegt.
Rot mit „Secret SUPABASE_DB_URL fehlt“ = Schritt 3 fehlt.

Das Audit ist nur das Sicherheitsnetz. Es ersetzt die Abschnitte 1 bis 3 nicht und prüft keine Policies, nur ob RLS an ist.

## 5. Prüf-SQL zum Selbst-Ausführen

**Tabellen ohne RLS** (dieselbe Abfrage wie im Audit, vereinfacht):
```sql
SELECT n.nspname AS schema, c.relname AS tabelle
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind IN ('r','p') AND NOT c.relrowsecurity
  AND n.nspname IN ('public')
ORDER BY 1, 2;
```

**Alle Policies einer Tabelle:**
```sql
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = '<tabelle>';
```

**Verdächtig breite Policies** (offen für anon oder für alle Angemeldeten ohne weitere Bedingung):
```sql
SELECT tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND (roles && ARRAY['anon','public']::name[]
       OR qual IN ('true', '(auth.role() = ''authenticated''::text)')
       OR with_check IN ('true', '(auth.role() = ''authenticated''::text)'))
ORDER BY 1, 2;
```
Jeder Treffer braucht eine Begründung in der zugehörigen Migration (z. B. Wochenquiz-Link) oder eine engere Policy.
