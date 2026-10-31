-- ════════════════════════════════════════════════════════════════════════
-- Prüfhinweise: „⚠️ Bitte nachprüfen“ auf der Übersicht der Meisterin
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Neue Spalten in public.kompetenz (eine Zeile pro Lehrling und Thema):
--   zusatz_falsch        wie oft eine Zusatzfrage („Verstanden?“) falsch war,
--                        obwohl die Hauptfrage richtig war – insgesamt
--   zusatz_falsch_offen  dasselbe, aber nur seit dem letzten Prüfgespräch
--                        zu diesem Thema (die Meisterin setzt es beim
--                        Speichern eines Prüfgesprächs auf 0)
--   sicher_falsch_offen  „sicher, aber falsch“ seit dem letzten Prüfgespräch
--
-- Auslöser für einen Prüfhinweis (Logik in lernquiz.html, pruefHinweise()):
--   1. Thema „sitzt“ laut Quiz, aber zusatz_falsch_offen >= 2
--   2. sicher_falsch_offen >= 2
--   3. Thema „sitzt“ seit über 4 Wochen und wurde nie im Gespräch geprüft
--
-- Keine neue Tabelle, keine neue Regel: Die RLS-Regeln aus
-- 20261010_rls_lernquiz_aktuell.sql (Lehrling nur eigene Zeilen, Meisterin
-- alles) gelten zeilenweise auch für die neuen Spalten, ebenso die
-- bestehenden Tabellenrechte – keine zusätzlichen GRANTs nötig.
--
-- Voraussetzung: 20261029_kompetenz_sicherheit_wiederholung.sql ist gelaufen.
-- Die App funktioniert auch ohne diese Migration (speichert dann ohne die
-- neuen Spalten, Auslöser 1 und 2 greifen erst danach). Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

DO $pruef$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public' AND table_name = 'kompetenz' AND column_name = 'sicher_falsch') THEN
    RAISE EXCEPTION 'Abbruch: zuerst 20261029_kompetenz_sicherheit_wiederholung.sql ausführen.';
  END IF;
END $pruef$;

ALTER TABLE public.kompetenz
  ADD COLUMN IF NOT EXISTS zusatz_falsch       integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS zusatz_falsch_offen integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sicher_falsch_offen integer NOT NULL DEFAULT 0;

-- Bisherige „sicher, aber falsch“ einmalig als offen übernehmen
UPDATE public.kompetenz SET sicher_falsch_offen = sicher_falsch
WHERE sicher_falsch_offen = 0 AND sicher_falsch > 0;

COMMIT;

-- Kontrolle: Es müssen 3 Zeilen kommen.
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'kompetenz'
  AND column_name IN ('zusatz_falsch', 'zusatz_falsch_offen', 'sicher_falsch_offen');
