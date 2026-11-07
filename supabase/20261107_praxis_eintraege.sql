-- ════════════════════════════════════════════════════════════════════════
-- Praxis-Tagebuch: Lehrling trägt ein, was geübt wurde – Meisterin bestätigt
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Eine Zeile pro Übung:
--   datum             wann geübt wurde
--   bereich           was geübt wurde (aus der Liste oder selbst eingetragen)
--   details           genauer, z. B. „Rundbürste, Volumen am Oberkopf“
--   dauer_min         wie lange (1–600 Minuten)
--   kontrolliert_von  wer kontrolliert hat (Name, vom Lehrling eingetragen)
--   notiz             optional
--   bestaetigt        true erst, wenn die Meisterin bestätigt hat
--   bestaetigt_am     Zeitpunkt der Bestätigung
--
-- Rechte (CLAUDE.md, Regeln 1 und 3 – Rolle serverseitig über ist_meisterin()):
--   Lehrling  → eigene Einträge lesen und anlegen; ändern und löschen nur,
--               solange sie NICHT bestätigt sind. Selbst bestätigen geht nicht
--               (alle Lehrlings-Regeln verlangen bestaetigt = false).
--   Meisterin → alles (insbesondere bestätigen)
--   anon      → nichts (kein Grant, keine Policy)
--
-- Voraussetzung: 20260927_meisterin_rolle.sql (ist_meisterin()) ist gelaufen.
-- Der Code (lerntool.html, lernquiz.html) zeigt ohne diese Tabelle einen
-- Hinweis statt des Tagebuchs. Alles in einer Transaktion. Mehrfach ausführbar.
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
    CREATE TABLE IF NOT EXISTS public.praxis_eintraege (
      id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lehrling_id      %s NOT NULL REFERENCES public.lehrlinge(id) ON DELETE CASCADE,
      datum            date NOT NULL DEFAULT current_date,
      bereich          text NOT NULL CHECK (char_length(bereich) BETWEEN 1 AND 80),
      details          text CHECK (details IS NULL OR char_length(details) <= 300),
      dauer_min        integer NOT NULL CHECK (dauer_min BETWEEN 1 AND 600),
      kontrolliert_von text CHECK (kontrolliert_von IS NULL OR char_length(kontrolliert_von) <= 60),
      notiz            text CHECK (notiz IS NULL OR char_length(notiz) <= 500),
      bestaetigt       boolean NOT NULL DEFAULT false,
      bestaetigt_am    timestamptz,
      erstellt_am      timestamptz NOT NULL DEFAULT now()
    )$t$, typ);
END $anlegen$;

CREATE INDEX IF NOT EXISTS praxis_eintraege_lehrling_idx
  ON public.praxis_eintraege (lehrling_id, datum DESC);

-- RLS im selben Schritt wie die Tabelle
ALTER TABLE public.praxis_eintraege ENABLE ROW LEVEL SECURITY;

-- Grants: nur was die App braucht. Kein Recht für anon.
-- (id ist uuid mit gen_random_uuid() – kein Sequence-Grant nötig)
REVOKE ALL ON public.praxis_eintraege FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.praxis_eintraege TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.praxis_eintraege TO service_role;

DROP POLICY IF EXISTS praxis_eintraege_eigene_lesen    ON public.praxis_eintraege;
DROP POLICY IF EXISTS praxis_eintraege_eigene_anlegen  ON public.praxis_eintraege;
DROP POLICY IF EXISTS praxis_eintraege_eigene_aendern  ON public.praxis_eintraege;
DROP POLICY IF EXISTS praxis_eintraege_eigene_loeschen ON public.praxis_eintraege;
DROP POLICY IF EXISTS praxis_eintraege_meisterin       ON public.praxis_eintraege;

CREATE POLICY praxis_eintraege_eigene_lesen ON public.praxis_eintraege FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY praxis_eintraege_eigene_anlegen ON public.praxis_eintraege FOR INSERT TO authenticated
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid())
              AND bestaetigt = false AND bestaetigt_am IS NULL);
CREATE POLICY praxis_eintraege_eigene_aendern ON public.praxis_eintraege FOR UPDATE TO authenticated
  USING      (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid())
              AND bestaetigt = false)
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid())
              AND bestaetigt = false AND bestaetigt_am IS NULL);
CREATE POLICY praxis_eintraege_eigene_loeschen ON public.praxis_eintraege FOR DELETE TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid())
         AND bestaetigt = false);
CREATE POLICY praxis_eintraege_meisterin ON public.praxis_eintraege FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

COMMIT;

-- ── Kontrolle ───────────────────────────────────────────────────────────
-- Erwartet: rls_an = true
SELECT c.relrowsecurity AS rls_an
FROM pg_class c WHERE c.oid = 'public.praxis_eintraege'::regclass;

-- Erwartet: 5 Policies (eigene_lesen/_anlegen/_aendern/_loeschen, meisterin), alle nur für authenticated
SELECT policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'praxis_eintraege' ORDER BY policyname;

-- Erwartet: Grants für authenticated (DELETE, INSERT, SELECT, UPDATE) und service_role, keine für anon
SELECT grantee, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS rechte
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'praxis_eintraege'
  AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY grantee ORDER BY grantee;
