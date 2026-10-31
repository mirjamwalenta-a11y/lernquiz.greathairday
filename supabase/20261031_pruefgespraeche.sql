-- ════════════════════════════════════════════════════════════════════════
-- Prüfgespräche: Meisterin prüft mündlich, ob der Lehrling verstanden hat
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Das Lernquiz zeigt, was der Lehrling ankreuzen kann. Im Prüfgespräch
-- erklärt der Lehrling eine Frage in eigenen Worten (ohne Antwortauswahl),
-- die Meisterin sieht die Musterlösung und hält fest:
--   verstanden / teilweise / nicht verstanden  (+ optionale Notiz)
-- Eine Zeile pro gestellter Frage.
--
-- Rechte (CLAUDE.md, Regeln 1 und 3 – Rolle serverseitig über ist_meisterin()):
--   Meisterin → alles (anlegen, lesen, ändern, löschen)
--   Lehrling  → nur eigene Zeilen LESEN (sieht im Verlauf das Ergebnis und
--               die Notiz der Meisterin), nicht anlegen/ändern/löschen
--   anon      → nichts (kein Grant, keine Policy)
--
-- Voraussetzung: 20260927_meisterin_rolle.sql (ist_meisterin()) ist gelaufen.
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
    CREATE TABLE IF NOT EXISTS public.pruefgespraeche (
      id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lehrling_id %s NOT NULL REFERENCES public.lehrlinge(id) ON DELETE CASCADE,
      thema       text NOT NULL,
      frage_id    text,
      frage       text NOT NULL,
      ergebnis    text NOT NULL CHECK (ergebnis IN ('verstanden', 'teilweise', 'nicht')),
      notiz       text,
      datum       date NOT NULL DEFAULT current_date,
      erstellt_am timestamptz NOT NULL DEFAULT now()
    )$t$, typ);
END $anlegen$;

CREATE INDEX IF NOT EXISTS pruefgespraeche_lehrling_idx
  ON public.pruefgespraeche (lehrling_id, thema, erstellt_am DESC);

-- RLS im selben Schritt wie die Tabelle
ALTER TABLE public.pruefgespraeche ENABLE ROW LEVEL SECURITY;

-- Grants: nur was die App braucht. Kein Recht für anon.
REVOKE ALL ON public.pruefgespraeche FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pruefgespraeche TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pruefgespraeche TO service_role;

DROP POLICY IF EXISTS pruefgespraeche_eigene_lesen ON public.pruefgespraeche;
DROP POLICY IF EXISTS pruefgespraeche_meisterin    ON public.pruefgespraeche;

CREATE POLICY pruefgespraeche_eigene_lesen ON public.pruefgespraeche FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY pruefgespraeche_meisterin ON public.pruefgespraeche FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

COMMIT;

-- ── Kontrolle ───────────────────────────────────────────────────────────
-- Erwartet: rls_an = true, 2 Policies, Grants nur für authenticated und service_role.
SELECT c.relrowsecurity AS rls_an
FROM pg_class c WHERE c.oid = 'public.pruefgespraeche'::regclass;

SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies WHERE schemaname = 'public' AND tablename = 'pruefgespraeche';

SELECT grantee, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS rechte
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'pruefgespraeche'
  AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY grantee ORDER BY grantee;
