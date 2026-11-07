-- ════════════════════════════════════════════════════════════════════════
-- Wiederholung in Abständen: was nicht gewusst wurde, kommt automatisch wieder
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Eine Zeile pro Lehrling und Lernquiz-Frage (frage_id = id aus der
-- Fragenbank, z. B. „1-mc4“):
--   stufe        0 = falsch/geraten → nach 1 Tag wieder
--                1 = 1× richtig wiederholt → nach 3 Tagen
--                2 = 2× richtig → nach 7 Tagen
--                3 = 3× richtig → nach 14 Tagen
--                4 = sitzt (kommt nicht mehr extra)
--   faellig_am   Tag, ab dem die Frage wieder dran ist
--   zuletzt_am   Tag der letzten Antwort auf diese Frage
--
-- Rechte (CLAUDE.md, Regeln 1 und 3 – Rolle serverseitig über ist_meisterin()):
--   Lehrling  → eigene Zeilen lesen, anlegen, ändern, löschen
--               (die App schreibt beim Quiz-Ende den neuen Stand)
--   Meisterin → alles
--   anon      → nichts (kein Grant, keine Policy)
--
-- Voraussetzung: 20260927_meisterin_rolle.sql (ist_meisterin()) ist gelaufen.
-- Der Code (lernquiz.html, lerntool.html) funktioniert auch ohne diese Tabelle
-- (dann eben ohne Wiederholung über mehrere Tage).
-- Alles in einer Transaktion. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

DO $pruef$ BEGIN
  IF to_regprocedure('public.ist_meisterin()') IS NULL THEN
    RAISE EXCEPTION 'Abbruch: ist_meisterin() fehlt – zuerst 20260927_meisterin_rolle.sql ausführen.';
  END IF;
END $pruef$;

-- lehrling_id bekommt denselben Typ wie lehrlinge.id (uuid oder bigint)
DO $anlegen$
DECLARE typ text;
BEGIN
  SELECT format_type(a.atttypid, a.atttypmod) INTO typ
  FROM pg_attribute a
  WHERE a.attrelid = 'public.lehrlinge'::regclass AND a.attname = 'id' AND NOT a.attisdropped;

  EXECUTE format($t$
    CREATE TABLE IF NOT EXISTS public.wiederholung (
      id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lehrling_id %s NOT NULL REFERENCES public.lehrlinge(id) ON DELETE CASCADE,
      frage_id    text NOT NULL,
      stufe       smallint NOT NULL DEFAULT 0 CHECK (stufe BETWEEN 0 AND 4),
      faellig_am  date NOT NULL DEFAULT current_date,
      zuletzt_am  date NOT NULL DEFAULT current_date,
      erstellt_am timestamptz NOT NULL DEFAULT now(),
      UNIQUE (lehrling_id, frage_id)
    )$t$, typ);
END $anlegen$;

CREATE INDEX IF NOT EXISTS wiederholung_faellig_idx
  ON public.wiederholung (lehrling_id, faellig_am);

-- RLS im selben Schritt wie die Tabelle
ALTER TABLE public.wiederholung ENABLE ROW LEVEL SECURITY;

-- Grants: nur was die App braucht. Kein Recht für anon.
-- (id ist uuid mit gen_random_uuid() – kein Sequence-Grant nötig)
REVOKE ALL ON public.wiederholung FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wiederholung TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wiederholung TO service_role;

DROP POLICY IF EXISTS wiederholung_eigene_lesen    ON public.wiederholung;
DROP POLICY IF EXISTS wiederholung_eigene_anlegen  ON public.wiederholung;
DROP POLICY IF EXISTS wiederholung_eigene_aendern  ON public.wiederholung;
DROP POLICY IF EXISTS wiederholung_eigene_loeschen ON public.wiederholung;
DROP POLICY IF EXISTS wiederholung_meisterin       ON public.wiederholung;

CREATE POLICY wiederholung_eigene_lesen ON public.wiederholung FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY wiederholung_eigene_anlegen ON public.wiederholung FOR INSERT TO authenticated
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY wiederholung_eigene_aendern ON public.wiederholung FOR UPDATE TO authenticated
  USING      (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()))
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY wiederholung_eigene_loeschen ON public.wiederholung FOR DELETE TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY wiederholung_meisterin ON public.wiederholung FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

COMMIT;

-- ── Kontrolle ───────────────────────────────────────────────────────────
-- Erwartet: rls_an = true
SELECT c.relrowsecurity AS rls_an
FROM pg_class c WHERE c.oid = 'public.wiederholung'::regclass;

-- Erwartet: 5 Policies (eigene_lesen/_anlegen/_aendern/_loeschen, meisterin), alle nur für authenticated
SELECT policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'wiederholung' ORDER BY policyname;

-- Erwartet: Grants nur für authenticated und service_role (DELETE, INSERT, SELECT, UPDATE), keine für anon
SELECT grantee, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS rechte
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'wiederholung'
  AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY grantee ORDER BY grantee;
