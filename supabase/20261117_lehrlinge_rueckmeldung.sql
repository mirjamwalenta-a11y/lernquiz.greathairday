-- ════════════════════════════════════════════════════════════════════════
-- Rückmeldung der Lehrlinge zur Lern-App
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Wofür: Lehrlinge sagen kurz, was ihnen die App bringt. Die Meisterin sieht
-- die Antworten gesammelt (Meisterin-Bereich und Ausbildungsbericht), z. B.
-- als „Feedback von Lehrlingen“ für den Staatspreis „Beste Lehrbetriebe“.
--
-- Eine Zeile pro Rückmeldung:
--   hilfreich    1–5 (wie sehr hilft die App beim Lernen)
--   leichter     'ja' | 'teils' | 'nein' (leichter als nur mit Unterlagen?)
--   hilft        was am meisten hilft (Liste von Bereichen, höchstens 12)
--   veraendert   Freitext: was hat sich verändert (≤ 600 Zeichen)
--   verbessern   Freitext: was fehlt / was besser werden soll (≤ 600 Zeichen)
--   zitat_ok     Lehrling erlaubt, Sätze daraus OHNE Namen zu verwenden
--                (z. B. Preis-Einreichung, Website). Standard: nein.
--
-- Rechte (CLAUDE.md, Regeln 1 und 3 – Rolle serverseitig über ist_meisterin()):
--   Lehrling  → eigene Rückmeldungen lesen und anlegen. Ändern darf er nur
--               zitat_ok (Einwilligung geben oder zurücknehmen) – erzwungen
--               über ein Spaltenrecht (GRANT UPDATE (zitat_ok)).
--   Meisterin → lesen und löschen. KEIN Anlegen und KEIN Ändern: Die
--               Rückmeldungen sollen echt sein, und die Einwilligung zur
--               Verwendung als Zitat kann nur der Lehrling selbst geben.
--   anon      → nichts (kein Grant, keine Policy)
--
-- Voraussetzung: 20260927_meisterin_rolle.sql (ist_meisterin()) ist gelaufen.
-- Der Code (lerntool.html, lernquiz.html) zeigt ohne diese Tabelle nichts an
-- bzw. einen Hinweis. Alles in einer Transaktion. Mehrfach ausführbar.
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
    CREATE TABLE IF NOT EXISTS public.lehrlinge_rueckmeldung (
      id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lehrling_id  %s NOT NULL REFERENCES public.lehrlinge(id) ON DELETE CASCADE,
      hilfreich    smallint NOT NULL CHECK (hilfreich BETWEEN 1 AND 5),
      leichter     text CHECK (leichter IS NULL OR leichter IN ('ja', 'teils', 'nein')),
      hilft        text[] NOT NULL DEFAULT '{}' CHECK (cardinality(hilft) <= 12),
      veraendert   text CHECK (veraendert IS NULL OR char_length(veraendert) <= 600),
      verbessern   text CHECK (verbessern IS NULL OR char_length(verbessern) <= 600),
      zitat_ok     boolean NOT NULL DEFAULT false,
      erstellt_am  timestamptz NOT NULL DEFAULT now()
    )$t$, typ);
END $anlegen$;

CREATE INDEX IF NOT EXISTS lehrlinge_rueckmeldung_lehrling_idx
  ON public.lehrlinge_rueckmeldung (lehrling_id, erstellt_am DESC);

-- RLS im selben Schritt wie die Tabelle
ALTER TABLE public.lehrlinge_rueckmeldung ENABLE ROW LEVEL SECURITY;

-- Grants: nur was die App braucht. Kein Recht für anon.
-- UPDATE nur auf die Spalte zitat_ok (Einwilligung), sonst nichts änderbar.
-- (id ist uuid mit gen_random_uuid() – kein Sequence-Grant nötig)
REVOKE ALL ON public.lehrlinge_rueckmeldung FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.lehrlinge_rueckmeldung TO authenticated;
GRANT UPDATE (zitat_ok) ON public.lehrlinge_rueckmeldung TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lehrlinge_rueckmeldung TO service_role;

DROP POLICY IF EXISTS rueckmeldung_eigene_lesen     ON public.lehrlinge_rueckmeldung;
DROP POLICY IF EXISTS rueckmeldung_eigene_anlegen   ON public.lehrlinge_rueckmeldung;
DROP POLICY IF EXISTS rueckmeldung_eigene_zitat     ON public.lehrlinge_rueckmeldung;
DROP POLICY IF EXISTS rueckmeldung_meisterin_lesen  ON public.lehrlinge_rueckmeldung;
DROP POLICY IF EXISTS rueckmeldung_meisterin_loeschen ON public.lehrlinge_rueckmeldung;

CREATE POLICY rueckmeldung_eigene_lesen ON public.lehrlinge_rueckmeldung FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY rueckmeldung_eigene_anlegen ON public.lehrlinge_rueckmeldung FOR INSERT TO authenticated
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
-- Ändern: nur eigene Zeilen; welche Spalte, begrenzt der Grant oben (nur zitat_ok)
CREATE POLICY rueckmeldung_eigene_zitat ON public.lehrlinge_rueckmeldung FOR UPDATE TO authenticated
  USING      (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()))
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY rueckmeldung_meisterin_lesen ON public.lehrlinge_rueckmeldung FOR SELECT TO authenticated
  USING (public.ist_meisterin());
CREATE POLICY rueckmeldung_meisterin_loeschen ON public.lehrlinge_rueckmeldung FOR DELETE TO authenticated
  USING (public.ist_meisterin());

COMMIT;

-- ── Kontrolle ───────────────────────────────────────────────────────────
-- Erwartet: rls_an = true
SELECT c.relrowsecurity AS rls_an
FROM pg_class c WHERE c.oid = 'public.lehrlinge_rueckmeldung'::regclass;

-- Erwartet: 5 Policies (eigene_lesen, eigene_anlegen, eigene_zitat,
-- meisterin_lesen, meisterin_loeschen), alle nur für authenticated.
-- Keine INSERT- oder UPDATE-Policy für die Meisterin.
SELECT policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'lehrlinge_rueckmeldung' ORDER BY policyname;

-- Erwartet: authenticated = DELETE, INSERT, SELECT; service_role = alle; anon fehlt
SELECT grantee, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS rechte
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'lehrlinge_rueckmeldung'
  AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY grantee ORDER BY grantee;

-- Erwartet: genau 1 Zeile – authenticated, UPDATE, zitat_ok
SELECT grantee, privilege_type, column_name
FROM information_schema.column_privileges
WHERE table_schema = 'public' AND table_name = 'lehrlinge_rueckmeldung'
  AND grantee = 'authenticated' AND privilege_type = 'UPDATE';
