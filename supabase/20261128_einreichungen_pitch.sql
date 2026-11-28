-- ════════════════════════════════════════════════════════════════════════
-- Meisterin-Bereich: „Einreichungen & Projekte“ – Reiter „2-Minuten-Pitch“
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Neue Spalte public.einreichungen.pitch (jsonb): der Pitch der Meisterin,
-- aufgebaut aus der eigenen Einreichung – vier Zeitabschnitte (Hook,
-- Problem & Lösung, Zeigen, Beleg & Schluss) mit Sprechtext und „Im Bild“
-- für das Video, der Satz zum Merken, Sprechtempo und die letzte Probezeit.
--
-- Keine neue Tabelle, kein neuer Login-Weg. Die Spalte erbt RLS, Grants und
-- die Policy einreichungen_meisterin aus 20261122_einreichungen.sql:
-- lesen und schreiben nur die Meisterin (ist_meisterin()), anon nichts.
-- Keine KI, nichts verlässt die eigene Datenbank.
--
-- Voraussetzung: 20261122_einreichungen.sql. Ohne diese Migration zeigt der
-- Reiter einen Hinweis, der Rest läuft unverändert. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

DO $pruef$ BEGIN
  IF to_regclass('public.einreichungen') IS NULL THEN
    RAISE EXCEPTION 'Abbruch: public.einreichungen fehlt – zuerst 20261122_einreichungen.sql ausführen.';
  END IF;
END $pruef$;

-- {"teile": {"hook": {"text": "…", "bild": "…"}, "loesung": {…}, "zeigen": {…}, "schluss": {…}},
--  "merksatz": "…", "tempo": "ruhig|normal|zuegig",
--  "probe": {"datum": "2026-11-28", "sek": [18, 31, 44, 29]}}
ALTER TABLE public.einreichungen
  ADD COLUMN IF NOT EXISTS pitch jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.einreichungen DROP CONSTRAINT IF EXISTS einreichungen_pitch_form;
ALTER TABLE public.einreichungen ADD CONSTRAINT einreichungen_pitch_form
  CHECK (jsonb_typeof(pitch) = 'object' AND pg_column_size(pitch) <= 40000);

COMMIT;

-- ── Prüfen (Ergebnis im SQL-Editor ansehen) ─────────────────────────────
-- Erwartet: rowsecurity = true (unverändert)
SELECT relname, relrowsecurity AS rowsecurity FROM pg_class WHERE oid = 'public.einreichungen'::regclass;

-- Erwartet: authenticated und service_role, keine Zeile für anon (unverändert)
SELECT grantee, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS rechte
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'einreichungen' AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY grantee ORDER BY grantee;

-- Erwartet: eine Zeile, data_type jsonb
SELECT column_name, data_type FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'einreichungen' AND column_name = 'pitch';
