-- ════════════════════════════════════════════════════════════════════════
-- Bestätigung der Verhaltensregeln durch Lehrlinge
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Wofür: Im Lern-Tool (Seite „Unsere Verhaltensregeln“, Wörni) bestätigt der
-- Lehrling: „Ich habe die Verhaltensregeln gelesen und zur Kenntnis genommen!“
-- Die Meisterin sieht im Meisterin-Bereich (lernquiz.html), wer wann bestätigt
-- hat. Wunsch der Inhaberin vom 2026-11-20.
--
-- Eine Zeile pro Lehrling und Stand der Regeln:
--   stand          Stand aus salon-regeln.js (z. B. '2026-11-20'). Ändern sich
--                  die Regeln, bekommt die Datei einen neuen Stand und es wird
--                  erneut bestätigt.
--   bestaetigt_am  setzt der Server (DEFAULT now()). Der Lehrling darf nur
--                  lehrling_id und stand schreiben (Spaltenrecht), kein
--                  frei gewähltes Datum.
-- Keine weiteren persönlichen Daten.
--
-- Rechte (CLAUDE.md, Regeln 1 und 3 – Rolle serverseitig über ist_meisterin()):
--   Lehrling  → eigene Bestätigungen lesen und anlegen. Kein Ändern, kein Löschen.
--   Meisterin → lesen und löschen (z. B. Test oder Versehen). Kein Anlegen und
--               kein Ändern: Bestätigen kann nur der Lehrling selbst.
--   anon      → nichts (kein Grant, keine Policy)
--
-- Voraussetzung: 20260927_meisterin_rolle.sql (ist_meisterin()) ist gelaufen.
-- Ohne diese Tabelle merkt sich das Lern-Tool die Bestätigung nur auf dem
-- Gerät, und der Meisterin-Bereich zeigt nichts an. In einer Transaktion,
-- mehrfach ausführbar.
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
    CREATE TABLE IF NOT EXISTS public.regeln_bestaetigung (
      id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lehrling_id    %s NOT NULL REFERENCES public.lehrlinge(id) ON DELETE CASCADE,
      stand          text NOT NULL CHECK (stand ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}[a-z]?$'),
      bestaetigt_am  timestamptz NOT NULL DEFAULT now(),
      UNIQUE (lehrling_id, stand)
    )$t$, typ);
END $anlegen$;

-- RLS im selben Schritt wie die Tabelle
ALTER TABLE public.regeln_bestaetigung ENABLE ROW LEVEL SECURITY;

-- Grants: nur was die App braucht. Kein Recht für anon.
-- INSERT nur auf lehrling_id und stand → bestaetigt_am kommt immer vom Server.
-- (id ist uuid mit gen_random_uuid() – kein Sequence-Grant nötig)
REVOKE ALL ON public.regeln_bestaetigung FROM anon, authenticated;
GRANT SELECT, DELETE ON public.regeln_bestaetigung TO authenticated;
GRANT INSERT (lehrling_id, stand) ON public.regeln_bestaetigung TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.regeln_bestaetigung TO service_role;

DROP POLICY IF EXISTS regeln_eigene_lesen       ON public.regeln_bestaetigung;
DROP POLICY IF EXISTS regeln_eigene_anlegen     ON public.regeln_bestaetigung;
DROP POLICY IF EXISTS regeln_meisterin_lesen    ON public.regeln_bestaetigung;
DROP POLICY IF EXISTS regeln_meisterin_loeschen ON public.regeln_bestaetigung;

CREATE POLICY regeln_eigene_lesen ON public.regeln_bestaetigung FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY regeln_eigene_anlegen ON public.regeln_bestaetigung FOR INSERT TO authenticated
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY regeln_meisterin_lesen ON public.regeln_bestaetigung FOR SELECT TO authenticated
  USING (public.ist_meisterin());
CREATE POLICY regeln_meisterin_loeschen ON public.regeln_bestaetigung FOR DELETE TO authenticated
  USING (public.ist_meisterin());

COMMIT;

-- ── Kontrolle ───────────────────────────────────────────────────────────
-- Erwartet: rls_an = true
SELECT c.relrowsecurity AS rls_an
FROM pg_class c WHERE c.oid = 'public.regeln_bestaetigung'::regclass;

-- Erwartet: 4 Policies (eigene_anlegen, eigene_lesen, meisterin_lesen,
-- meisterin_loeschen), alle nur für authenticated. Keine UPDATE-Policy.
SELECT policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'regeln_bestaetigung' ORDER BY policyname;

-- Erwartet: authenticated = DELETE, SELECT; service_role = alle; anon fehlt
SELECT grantee, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS rechte
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'regeln_bestaetigung'
  AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY grantee ORDER BY grantee;

-- Erwartet: genau 2 Zeilen – authenticated, INSERT, lehrling_id und stand
SELECT grantee, privilege_type, column_name
FROM information_schema.column_privileges
WHERE table_schema = 'public' AND table_name = 'regeln_bestaetigung'
  AND grantee = 'authenticated' AND privilege_type = 'INSERT' ORDER BY column_name;
