-- ════════════════════════════════════════════════════════════════════════
-- Lehrlinge: Art des Zugangs – „Lehrling“ oder „Stylistin“
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Stylistinnen lernen in der Lern-App mit (Farblabor, Beratung, Umformung …).
-- Sie bekommen denselben Zugang wie ein Lehrling (Name + 6-stellige PIN),
-- stehen im Meisterin-Bereich aber in einer eigenen Gruppe „Stylistinnen“
-- und ohne Prüfhinweise.
--
-- Neue Spalte in public.lehrlinge:
--   art   'lehrling'  = Lehrling (Standard)
--         'stylistin' = ausgelernte Mitarbeiterin, die mitlernt
--
-- Die Spalte steuert nur die Anzeige im Meisterin-Bereich. Sie gibt KEINE
-- zusätzlichen Rechte: Eine Stylistin darf genau so viel wie ein Lehrling.
--
-- Keine neue Tabelle und keine neue Regel: Die bestehenden RLS-Regeln aus
-- 20261010_rls_lernquiz_aktuell.sql gelten auch für die neue Spalte:
--   lehrlinge_eigener   → eigene Zeile nur LESEN (die Art kann man also
--                         nicht selbst ändern)
--   lehrlinge_meisterin → nur die Meisterin (ist_meisterin()) darf ändern
--   anon                → nichts
-- Die bestehenden Tabellenrechte gelten auch für neu hinzugefügte Spalten –
-- es sind keine zusätzlichen GRANTs nötig.
--
-- Der Code (lernquiz.html) funktioniert auch ohne diese Spalte; eine
-- Stylistin wird dann wie ein Lehrling (3. Lehrjahr) angezeigt.
-- Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE public.lehrlinge
  ADD COLUMN IF NOT EXISTS art text NOT NULL DEFAULT 'lehrling';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lehrlinge_art_check') THEN
    ALTER TABLE public.lehrlinge
      ADD CONSTRAINT lehrlinge_art_check CHECK (art IN ('lehrling', 'stylistin'));
  END IF;
END $$;

-- Kontrolle 1: Es muss 1 Zeile kommen (text, Standard 'lehrling').
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'lehrlinge' AND column_name = 'art';

-- Kontrolle 2: RLS ist an, Policies unverändert:
--   lehrlinge_eigener (SELECT) und lehrlinge_meisterin (ALL).
SELECT relrowsecurity FROM pg_class WHERE oid = 'public.lehrlinge'::regclass;
SELECT policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'lehrlinge';
