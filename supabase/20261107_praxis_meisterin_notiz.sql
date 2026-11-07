-- ════════════════════════════════════════════════════════════════════════
-- Praxis-Tagebuch: Notiz der Meisterin
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Neue Spalte public.praxis_eintraege.meisterin_notiz (max. 500 Zeichen).
-- Der Lehrling sieht sie bei seinem Eintrag, darf sie aber NICHT schreiben:
-- Die bestehenden RLS-Regeln erlauben dem Lehrling, eigene unbestätigte
-- Einträge zu ändern – deshalb schützt ein Trigger genau diese Spalte
-- (CLAUDE.md Regel 3: Rolle serverseitig über ist_meisterin()).
--
--   Meisterin (ist_meisterin())   → darf die Notiz setzen/ändern
--   Lehrling                      → Änderung wird abgelehnt; beim Anlegen
--                                   wird ein mitgeschickter Wert verworfen
--   SQL-Editor/service_role       → unverändert erlaubt (keine App-Rolle)
--
-- Keine neue Tabelle: RLS und GRANTs aus 20261107_praxis_eintraege.sql gelten
-- auch für die neue Spalte (Tabellenrechte umfassen neue Spalten).
-- Der Code funktioniert auch ohne diese Spalte (dann ohne Meisterin-Notiz).
-- Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE public.praxis_eintraege
  ADD COLUMN IF NOT EXISTS meisterin_notiz text
  CHECK (meisterin_notiz IS NULL OR char_length(meisterin_notiz) <= 500);

CREATE OR REPLACE FUNCTION public.praxis_meisterin_notiz_schuetzen()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Nur die App-Rollen werden geprüft; SQL-Editor/service_role bleiben frei
  IF current_user NOT IN ('anon', 'authenticated') OR public.ist_meisterin() THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.meisterin_notiz := NULL;
  ELSIF NEW.meisterin_notiz IS DISTINCT FROM OLD.meisterin_notiz THEN
    RAISE EXCEPTION 'Nur die Meisterin darf die Meisterin-Notiz ändern' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.praxis_meisterin_notiz_schuetzen() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS praxis_meisterin_notiz_schuetzen ON public.praxis_eintraege;
CREATE TRIGGER praxis_meisterin_notiz_schuetzen
  BEFORE INSERT OR UPDATE ON public.praxis_eintraege
  FOR EACH ROW EXECUTE FUNCTION public.praxis_meisterin_notiz_schuetzen();

-- Kontrolle: erwartet 1 Zeile (meisterin_notiz, text) und 1 Zeile Trigger
SELECT column_name, data_type FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'praxis_eintraege' AND column_name = 'meisterin_notiz';
SELECT tgname FROM pg_trigger
WHERE tgrelid = 'public.praxis_eintraege'::regclass AND tgname = 'praxis_meisterin_notiz_schuetzen';
