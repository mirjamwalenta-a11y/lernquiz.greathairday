-- ════════════════════════════════════════════════════════════════════════
-- „Zuletzt geübt“ pro Thema und Quiz-Modus im Verlauf
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Neue Spalten:
--   public.kompetenz.zuletzt_am   Tag der letzten Übung zu diesem Thema
--                                 (wird bei jeder Runde gesetzt, auch bei
--                                 schwachen Runden – anders als gut_am)
--   public.verlauf.modus          womit geübt wurde:
--                                   'schnell'  Schnell-Check (Lernquiz)
--                                   'tief'     Lerneinheit (Lernquiz)
--                                   'lap'      LAP-Vorbereitung (Lernquiz)
--                                   'uebung'   Übungs-Quiz (Lern-Tool,
--                                              Schnittwerkstatt, Werkzeugkunde …)
--                                 Ältere Einträge bleiben leer (NULL).
--
-- Keine neue Tabelle und keine neue Regel: Die bestehenden RLS-Regeln aus
-- 20261010_rls_lernquiz_aktuell.sql gelten zeilenweise auch für die neuen
-- Spalten:
--   kompetenz: Lehrling liest/legt an/ändert nur eigene Zeilen, Meisterin alles
--   verlauf:   Lehrling liest/legt an nur eigene Zeilen, Meisterin alles
--   anon:      nichts
-- Die bestehenden Tabellenrechte (GRANT auf kompetenz/verlauf) gelten auch
-- für neu hinzugefügte Spalten – es sind keine zusätzlichen GRANTs nötig.
--
-- Der Code (lernquiz.html, lerntool.html, quiz-verlauf.js) funktioniert auch
-- ohne diese Spalten (speichert dann ohne sie). Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE public.kompetenz
  ADD COLUMN IF NOT EXISTS zuletzt_am date;

ALTER TABLE public.verlauf
  ADD COLUMN IF NOT EXISTS modus text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'verlauf_modus_werte' AND conrelid = 'public.verlauf'::regclass
  ) THEN
    ALTER TABLE public.verlauf
      ADD CONSTRAINT verlauf_modus_werte CHECK (modus IS NULL OR modus IN ('schnell', 'tief', 'lap', 'uebung'));
  END IF;
END $$;

-- Kontrolle 1: Es müssen 2 Zeilen kommen (zuletzt_am: date, modus: text).
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND ((table_name = 'kompetenz' AND column_name = 'zuletzt_am')
    OR (table_name = 'verlauf'   AND column_name = 'modus'));

-- Kontrolle 2: RLS ist auf beiden Tabellen an (relrowsecurity = true).
SELECT relname, relrowsecurity FROM pg_class
WHERE oid IN ('public.kompetenz'::regclass, 'public.verlauf'::regclass);

-- Kontrolle 3: Policies – erwartet unverändert:
--   kompetenz_eigene_lesen / _anlegen / _aendern, kompetenz_meisterin,
--   verlauf_eigener_lesen / _anlegen, verlauf_meisterin. Keine für anon.
SELECT tablename, policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('kompetenz', 'verlauf')
ORDER BY tablename, policyname;
