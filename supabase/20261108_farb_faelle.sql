-- ════════════════════════════════════════════════════════════════════════
-- Farb-Fälle: Meisterin schickt einen Fall, Lehrling plant die Rezeptur,
-- Meisterin gibt Rückmeldung. Dazu: Rezeptur im Praxis-Tagebuch.
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- public.farb_faelle   – ein Fall (ohne Namen/Fotos der Kundin)
--   lehrling_id NULL   = für alle Lehrlinge
-- public.farb_plaene   – der Plan eines Lehrlings zu einem Fall
--   status: offen (wartet) · passt · fast · nochmal
--
-- Rechte (CLAUDE.md Regeln 1 und 3 – Rolle serverseitig über ist_meisterin()):
--   farb_faelle  Meisterin → alles · Lehrling → nur lesen: eigene Fälle und
--                Fälle „für alle“ · anon → nichts
--   farb_plaene  Meisterin → alles (bewerten) · Lehrling → eigene lesen und
--                anlegen, ändern nur solange status = 'offen'; Status,
--                Rückmeldung und Bewertung kann er nicht setzen (WITH CHECK)
--                · löschen nur Meisterin · anon → nichts
--
-- Zusätzlich: praxis_eintraege.rezeptur (Text, optional, max. 200 Zeichen) –
-- gilt mit den bestehenden Regeln aus 20261107_praxis_eintraege.sql.
--
-- Voraussetzung: 20260927_meisterin_rolle.sql und 20261107_praxis_eintraege.sql.
-- Alles in einer Transaktion. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

DO $pruef$ BEGIN
  IF to_regprocedure('public.ist_meisterin()') IS NULL THEN
    RAISE EXCEPTION 'Abbruch: ist_meisterin() fehlt – zuerst 20260927_meisterin_rolle.sql ausführen.';
  END IF;
END $pruef$;

-- lehrling_id bekommt denselben Typ wie lehrlinge.id
DO $anlegen$
DECLARE typ text;
BEGIN
  SELECT format_type(a.atttypid, a.atttypmod) INTO typ
  FROM pg_attribute a
  WHERE a.attrelid = 'public.lehrlinge'::regclass AND a.attname = 'id' AND NOT a.attisdropped;

  EXECUTE format($t$
    CREATE TABLE IF NOT EXISTS public.farb_faelle (
      id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lehrling_id  %s REFERENCES public.lehrlinge(id) ON DELETE CASCADE,
      titel        text NOT NULL CHECK (char_length(titel) BETWEEN 1 AND 120),
      ist_th       integer NOT NULL CHECK (ist_th BETWEEN 1 AND 10),
      weiss        integer NOT NULL DEFAULT 0 CHECK (weiss BETWEEN 0 AND 3),
      gefaerbt     boolean NOT NULL DEFAULT false,
      wunsch       text NOT NULL CHECK (wunsch ~ '^[0-9]{1,2}(\.[0-9]{1,2})?$'),
      aktiv        boolean NOT NULL DEFAULT true,
      erstellt_am  timestamptz NOT NULL DEFAULT now()
    )$t$, typ);

  EXECUTE format($t$
    CREATE TABLE IF NOT EXISTS public.farb_plaene (
      id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      fall_id       uuid NOT NULL REFERENCES public.farb_faelle(id) ON DELETE CASCADE,
      lehrling_id   %s NOT NULL REFERENCES public.lehrlinge(id) ON DELETE CASCADE,
      oxidant       text CHECK (oxidant IS NULL OR char_length(oxidant) <= 20),
      farbe_g       integer CHECK (farbe_g IS NULL OR farbe_g BETWEEN 0 AND 500),
      naturton_g    integer CHECK (naturton_g IS NULL OR naturton_g BETWEEN 0 AND 500),
      oxidant_ml    integer CHECK (oxidant_ml IS NULL OR oxidant_ml BETWEEN 0 AND 1000),
      reihenfolge   text CHECK (reihenfolge IS NULL OR char_length(reihenfolge) <= 500),
      warum         text CHECK (warum IS NULL OR char_length(warum) <= 500),
      status        text NOT NULL DEFAULT 'offen' CHECK (status IN ('offen','passt','fast','nochmal')),
      rueckmeldung  text CHECK (rueckmeldung IS NULL OR char_length(rueckmeldung) <= 500),
      bewertet_am   timestamptz,
      erstellt_am   timestamptz NOT NULL DEFAULT now()
    )$t$, typ);
END $anlegen$;

CREATE INDEX IF NOT EXISTS farb_faelle_lehrling_idx ON public.farb_faelle (lehrling_id, erstellt_am DESC);
CREATE INDEX IF NOT EXISTS farb_plaene_fall_idx ON public.farb_plaene (fall_id, lehrling_id, erstellt_am DESC);

-- RLS im selben Schritt wie die Tabellen
ALTER TABLE public.farb_faelle ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farb_plaene ENABLE ROW LEVEL SECURITY;

-- Grants: nur was die App braucht, kein Recht für anon
REVOKE ALL ON public.farb_faelle FROM anon, authenticated;
REVOKE ALL ON public.farb_plaene FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farb_faelle TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farb_plaene TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farb_faelle TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farb_plaene TO service_role;

DROP POLICY IF EXISTS farb_faelle_lesen     ON public.farb_faelle;
DROP POLICY IF EXISTS farb_faelle_meisterin ON public.farb_faelle;
CREATE POLICY farb_faelle_lesen ON public.farb_faelle FOR SELECT TO authenticated
  USING (
    lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid())
    OR (lehrling_id IS NULL AND EXISTS (SELECT 1 FROM public.lehrlinge l WHERE l.user_id = auth.uid()))
  );
CREATE POLICY farb_faelle_meisterin ON public.farb_faelle FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

DROP POLICY IF EXISTS farb_plaene_eigene_lesen   ON public.farb_plaene;
DROP POLICY IF EXISTS farb_plaene_eigene_anlegen ON public.farb_plaene;
DROP POLICY IF EXISTS farb_plaene_eigene_aendern ON public.farb_plaene;
DROP POLICY IF EXISTS farb_plaene_meisterin      ON public.farb_plaene;
CREATE POLICY farb_plaene_eigene_lesen ON public.farb_plaene FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY farb_plaene_eigene_anlegen ON public.farb_plaene FOR INSERT TO authenticated
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid())
              AND status = 'offen' AND rueckmeldung IS NULL AND bewertet_am IS NULL);
CREATE POLICY farb_plaene_eigene_aendern ON public.farb_plaene FOR UPDATE TO authenticated
  USING      (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()) AND status = 'offen')
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid())
              AND status = 'offen' AND rueckmeldung IS NULL AND bewertet_am IS NULL);
CREATE POLICY farb_plaene_meisterin ON public.farb_plaene FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- Rezeptur im Praxis-Tagebuch
ALTER TABLE public.praxis_eintraege
  ADD COLUMN IF NOT EXISTS rezeptur text CHECK (rezeptur IS NULL OR char_length(rezeptur) <= 200);

COMMIT;

-- ── Kontrolle ───────────────────────────────────────────────────────────
-- Erwartet: beide true
SELECT relname, relrowsecurity AS rls_an FROM pg_class
WHERE oid IN ('public.farb_faelle'::regclass, 'public.farb_plaene'::regclass);

-- Erwartet: authenticated (DELETE, INSERT, SELECT, UPDATE) und service_role je Tabelle, keine Zeile für anon
SELECT table_name, grantee, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS rechte
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name IN ('farb_faelle','farb_plaene')
  AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY table_name, grantee ORDER BY table_name, grantee;
