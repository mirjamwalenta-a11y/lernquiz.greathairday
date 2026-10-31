-- ════════════════════════════════════════════════════════════════════════
-- Praxis-Check: Meisterin beobachtet eine echte Behandlung und hakt ab
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Gespeichert in der bestehenden Tabelle public.pruefgespraeche
-- (20261031_pruefgespraeche.sql), mit zwei neuen Spalten:
--   art         'gespraech' (Prüfgespräch, Standard) oder 'praxis' (Praxis-Check)
--   checkliste  die abgehakten Punkte, z. B.
--               [{"punkt": "Handschuhe getragen", "ok": true}, …]
-- ergebnis bleibt verstanden / teilweise / nicht
-- (beim Praxis-Check: sicher gemacht / teilweise sicher / noch nicht sicher).
--
-- Keine neue Tabelle, keine neue Regel: Die RLS-Regeln von pruefgespraeche
-- (Meisterin alles über ist_meisterin(), Lehrling nur eigene Zeilen lesen,
-- anon nichts) und die bestehenden Tabellenrechte gelten auch für die
-- neuen Spalten – keine zusätzlichen GRANTs nötig.
--
-- Voraussetzung: 20261031_pruefgespraeche.sql ist gelaufen. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

ALTER TABLE public.pruefgespraeche
  ADD COLUMN IF NOT EXISTS art        text NOT NULL DEFAULT 'gespraech',
  ADD COLUMN IF NOT EXISTS checkliste jsonb;

DO $chk$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pruefgespraeche_art_check') THEN
    ALTER TABLE public.pruefgespraeche
      ADD CONSTRAINT pruefgespraeche_art_check CHECK (art IN ('gespraech', 'praxis'));
  END IF;
END $chk$;

COMMIT;

-- Kontrolle: Es müssen 2 Zeilen kommen (art, checkliste).
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'pruefgespraeche'
  AND column_name IN ('art', 'checkliste');
