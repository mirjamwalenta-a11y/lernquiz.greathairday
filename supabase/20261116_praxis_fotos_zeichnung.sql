-- ════════════════════════════════════════════════════════════════════════
-- Praxis-Fotos: Markierungen der Meisterin („ins Foto zeichnen“)
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Neue Spalte public.praxis_fotos.zeichnung (jsonb): Striche, Kreise und
-- Pfeile in Prozent-Koordinaten des Fotos. Das Foto selbst bleibt
-- unverändert, die Markierungen liegen als eigene Ebene darüber.
--
-- Rechte (CLAUDE.md Regeln 1 und 3 – Rolle serverseitig über ist_meisterin()):
--   Meisterin → darf zeichnen (UPDATE über die bestehende Policy
--               praxis_fotos_meisterin FOR ALL)
--   Lehrling  → sieht die Markierungen auf den eigenen Fotos (bestehende
--               SELECT-Policy), darf sie nicht ändern: Für UPDATE gibt es
--               keine Lehrlings-Policy; beim Hochladen setzt ein Trigger die
--               Spalte auf NULL (sonst könnte er „Markierungen“ mitschicken)
--   anon      → nichts
--
-- Neu ist nur das Tabellenrecht UPDATE für authenticated – RLS lässt es nur
-- der Meisterin. Keine neue Tabelle.
-- Voraussetzung: 20261116_praxis_fotos.sql. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

DO $pruef$ BEGIN
  IF to_regclass('public.praxis_fotos') IS NULL THEN
    RAISE EXCEPTION 'Abbruch: praxis_fotos fehlt – zuerst 20261116_praxis_fotos.sql ausführen.';
  END IF;
END $pruef$;

ALTER TABLE public.praxis_fotos ADD COLUMN IF NOT EXISTS zeichnung jsonb;
ALTER TABLE public.praxis_fotos DROP CONSTRAINT IF EXISTS praxis_fotos_zeichnung_groesse;
ALTER TABLE public.praxis_fotos ADD CONSTRAINT praxis_fotos_zeichnung_groesse
  CHECK (zeichnung IS NULL OR octet_length(zeichnung::text) <= 60000);

-- Ändern dürfen nur die Meisterin (Policy) – das Tabellenrecht braucht es dafür
GRANT UPDATE ON public.praxis_fotos TO authenticated;

CREATE OR REPLACE FUNCTION public.praxis_fotos_zeichnung_schuetzen()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Nur App-Rollen prüfen; SQL-Editor/service_role bleiben frei
  IF current_user NOT IN ('anon', 'authenticated') OR public.ist_meisterin() THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.zeichnung := NULL;
  ELSE
    RAISE EXCEPTION 'Nur die Meisterin darf Fotos markieren' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.praxis_fotos_zeichnung_schuetzen() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS praxis_fotos_zeichnung_schuetzen ON public.praxis_fotos;
CREATE TRIGGER praxis_fotos_zeichnung_schuetzen
  BEFORE INSERT OR UPDATE ON public.praxis_fotos
  FOR EACH ROW EXECUTE FUNCTION public.praxis_fotos_zeichnung_schuetzen();

COMMIT;

-- ── Kontrolle ───────────────────────────────────────────────────────────
-- Erwartet: 1 Zeile (zeichnung, jsonb)
SELECT column_name, data_type FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'praxis_fotos' AND column_name = 'zeichnung';

-- Erwartet: authenticated = DELETE, INSERT, SELECT, UPDATE; keine Zeile für anon
SELECT grantee, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS rechte
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'praxis_fotos'
  AND grantee IN ('anon', 'authenticated')
GROUP BY grantee ORDER BY grantee;
