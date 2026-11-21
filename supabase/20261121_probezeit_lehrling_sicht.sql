-- ════════════════════════════════════════════════════════════════════════
-- Probezeit: Der Lehrling sieht seinen eigenen Plan im Lern-Tool
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Wofür: Im Lern-Tool unter „Mein Weg › Probezeit“ sieht ein eingeloggter
-- Lehrling seine laufende Probezeit: Beginn, Ende, Feedback-Tag, welche
-- Monatsziele erledigt sind und welche Wochenquiz er schon gemacht hat.
-- Wunsch der Inhaberin vom 2026-11-21: „Feedback bleibt bei mir.“
--
-- Was der Lehrling NICHT sieht (bleibt nur bei der Meisterin):
--   probezeit_wochen           (wöchentliche Bewertungen und Notizen)
--   probezeit_monats_feedback  (Monats-Feedback und Status)
--   probezeiten.entscheidung, probezeiten.notizen_abschluss
--   probezeit_quiz.antworten / richtig / gesamt (nur: Woche erledigt ja/nein)
--   schnuppertage              (Bewerbungs- und Testdaten)
--
-- Umsetzung:
--   1. Neue Spalte probezeiten.lehrling_id: Die Meisterin verknüpft die
--      Probezeit in der Schnuppertag-App mit dem Lehrlings-Konto. Ohne
--      Verknüpfung sieht kein Lehrling etwas. Die bestehende Policy
--      probezeiten_meisterin (nur ist_meisterin()) deckt das Setzen ab.
--   2. Funktion meine_probezeit() (SECURITY DEFINER): gibt nur die oben
--      erlaubten Felder der EIGENEN laufenden Probezeit zurück, ermittelt
--      über lehrlinge.user_id = auth.uid(). Keine neuen Policies und keine
--      neuen Tabellen-Grants für Lehrlinge (CLAUDE.md, Regel 1; Muster
--      SICHERHEIT-RLS-CHECK.md, Abschnitt 2). anon bekommt nichts.
--
-- Voraussetzung: 20260927_meisterin_rolle.sql und 20261010_rls_lernquiz_aktuell.sql.
-- In einer Transaktion, mehrfach ausführbar. Ohne diese Migration zeigt das
-- Lern-Tool den Plan einfach nicht an.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

DO $pruef$ BEGIN
  IF to_regprocedure('public.ist_meisterin()') IS NULL THEN
    RAISE EXCEPTION 'Abbruch: ist_meisterin() fehlt – zuerst 20260927_meisterin_rolle.sql ausführen.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                 WHERE n.nspname = 'public' AND c.relname = 'probezeiten' AND c.relrowsecurity) THEN
    RAISE EXCEPTION 'Abbruch: probezeiten hat keine RLS – zuerst 20261010_rls_lernquiz_aktuell.sql ausführen.';
  END IF;
END $pruef$;

-- 1. Verknüpfung Probezeit → Lehrlings-Konto (gleicher Typ wie lehrlinge.id)
DO $spalte$
DECLARE typ text;
BEGIN
  SELECT format_type(a.atttypid, a.atttypmod) INTO typ
  FROM pg_attribute a
  WHERE a.attrelid = 'public.lehrlinge'::regclass AND a.attname = 'id' AND NOT a.attisdropped;
  IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'public.probezeiten'::regclass
                 AND attname = 'lehrling_id' AND NOT attisdropped) THEN
    EXECUTE format('ALTER TABLE public.probezeiten ADD COLUMN lehrling_id %s REFERENCES public.lehrlinge(id) ON DELETE SET NULL', typ);
  END IF;
END $spalte$;
CREATE INDEX IF NOT EXISTS probezeiten_lehrling_idx ON public.probezeiten (lehrling_id);

-- 2. Nur-Lese-Sicht für den Lehrling
CREATE OR REPLACE FUNCTION public.meine_probezeit()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $f$
DECLARE p record;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NULL; END IF;

  SELECT pz.id, pz.beginn, pz.ende, pz.wochentag
    INTO p
  FROM public.probezeiten pz
  JOIN public.lehrlinge l ON l.id = pz.lehrling_id
  WHERE l.user_id = auth.uid() AND pz.status = 'laufend'
  ORDER BY pz.beginn DESC
  LIMIT 1;

  IF NOT FOUND THEN RETURN NULL; END IF;

  RETURN jsonb_build_object(
    'id',        p.id,          -- für den Wochenquiz-Link (derselbe Link wie von der Meisterin)
    'beginn',    p.beginn,
    'ende',      p.ende,
    'wochentag', p.wochentag,
    -- erledigte Monatsziele: { "1": ["m1z1", …], "2": […] } – nur die IDs, keine Notizen
    'ziele', COALESCE((SELECT jsonb_object_agg(z.monat::text, COALESCE(to_jsonb(z.erledigt), '[]'::jsonb))
                       FROM public.probezeit_ziele z WHERE z.probezeit_id = p.id), '{}'::jsonb),
    -- Wochen, in denen das Wochenquiz gemacht wurde – ohne Antworten und Punkte
    'quiz_wochen', COALESCE((SELECT jsonb_agg(DISTINCT q.woche ORDER BY q.woche)
                             FROM public.probezeit_quiz q WHERE q.probezeit_id = p.id), '[]'::jsonb)
  );
END $f$;

REVOKE ALL ON FUNCTION public.meine_probezeit() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.meine_probezeit() TO authenticated;

COMMIT;

-- Prüfen (SQL-Editor):
--   SELECT column_name FROM information_schema.columns
--    WHERE table_name = 'probezeiten' AND column_name = 'lehrling_id';        -- 1 Zeile
--   SELECT has_function_privilege('anon', 'public.meine_probezeit()', 'EXECUTE');  -- false
--   SELECT policyname FROM pg_policies WHERE tablename LIKE 'probezeit%';        -- unverändert
