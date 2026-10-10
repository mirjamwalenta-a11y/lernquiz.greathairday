-- ════════════════════════════════════════════════════════════════════════
-- Neue Konten nur noch auf Einladung (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Warum: Über den öffentlichen anon-Key konnte sich bisher JEDER ein Konto
-- im gemeinsamen Projekt anlegen (Auth-API /signup) und war danach
-- „authenticated“ – damit greifen alle Policies „TO authenticated“
-- (z.B. Lernquiz-Fragen lesen). Ein Einladungs-Code im Browser schützt
-- davor nicht (CLAUDE.md, Regel 3).
--
-- Neu: Der Auth-Hook „Before User Created“ lässt eine Registrierung nur
-- noch zu, wenn die E-Mail-Adresse vorher serverseitig vorgemerkt wurde:
--   * Lernquiz → „Neuer Lehrling“: die Meisterin merkt die Adresse über
--     registrierung_vormerken() vor (nur mit ist_meisterin()), 10 Minuten gültig
--   * sonst: Zeile in registrierung_vorgemerkt per SQL-Editor anlegen
-- NICHT betroffen (laufen nicht über den Hook): Konten, die über die
-- Team-App (Edge Function team-admin) oder im Dashboard über
-- „Add user → Create new user“ angelegt werden. Bestehende Konten und
-- das Einloggen sind ebenfalls nicht betroffen.
--
-- Reihenfolge:
--   1. Dieses Skript im SQL-Editor ausführen (ändert noch nichts am Verhalten)
--   2. Dashboard → Authentication → Hooks → „Before User Created“ →
--      Postgres → Schema public → Funktion hook_registrierung_pruefen → Speichern
-- Rückgängig: den Hook im Dashboard wieder ausschalten.
-- Das Skript kann gefahrlos mehrfach ausgeführt werden.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

-- ── Vormerk-Liste ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.registrierung_vorgemerkt (
  email        text PRIMARY KEY CHECK (email = lower(email)),
  gueltig_bis  timestamptz NOT NULL DEFAULT now() + interval '10 minutes',
  vorgemerkt_von uuid,
  angelegt_am  timestamptz NOT NULL DEFAULT now()
);

-- RLS an. Kein Zugriff über die API (anon/authenticated) – nur über die
-- SECURITY-DEFINER-Funktion unten und den Auth-Hook (supabase_auth_admin).
ALTER TABLE public.registrierung_vorgemerkt ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.registrierung_vorgemerkt FROM anon, authenticated, public;

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT SELECT, DELETE ON public.registrierung_vorgemerkt TO supabase_auth_admin;
DROP POLICY IF EXISTS registrierung_auth_hook ON public.registrierung_vorgemerkt;
CREATE POLICY registrierung_auth_hook ON public.registrierung_vorgemerkt
  FOR ALL TO supabase_auth_admin USING (true) WITH CHECK (true);

-- ── Vormerken (Lernquiz → Neuer Lehrling) ───────────────────────────────
-- Nur eine angemeldete Meisterin, nur Lernquiz-Adressen.
CREATE OR REPLACE FUNCTION public.registrierung_vormerken(p_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email text := lower(trim(p_email));
BEGIN
  IF NOT public.ist_meisterin() THEN
    RAISE EXCEPTION 'Keine Berechtigung' USING ERRCODE = '42501';
  END IF;
  IF v_email IS NULL OR v_email !~ '^[^@\s]+\.lernquiz@greathairday\.at$' THEN
    RAISE EXCEPTION 'Nur Lernquiz-Adressen können vorgemerkt werden' USING ERRCODE = '22023';
  END IF;
  DELETE FROM public.registrierung_vorgemerkt WHERE gueltig_bis < now();
  INSERT INTO public.registrierung_vorgemerkt (email, gueltig_bis, vorgemerkt_von)
  VALUES (v_email, now() + interval '10 minutes', auth.uid())
  ON CONFLICT (email) DO UPDATE
    SET gueltig_bis = EXCLUDED.gueltig_bis, vorgemerkt_von = EXCLUDED.vorgemerkt_von;
END;
$$;

REVOKE ALL ON FUNCTION public.registrierung_vormerken(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.registrierung_vormerken(text) TO authenticated;

-- ── Auth-Hook „Before User Created“ ─────────────────────────────────────
-- Läuft als supabase_auth_admin. Erlaubt nur vorgemerkte, noch gültige
-- Adressen und verbraucht die Vormerkung dabei.
CREATE OR REPLACE FUNCTION public.hook_registrierung_pruefen(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email text := lower(trim(event->'user'->>'email'));
  v_treffer int;
BEGIN
  DELETE FROM public.registrierung_vorgemerkt
   WHERE email = v_email AND gueltig_bis >= now();
  GET DIAGNOSTICS v_treffer = ROW_COUNT;
  IF v_treffer > 0 THEN
    RETURN '{}'::jsonb;
  END IF;
  RETURN jsonb_build_object('error', jsonb_build_object(
    'http_code', 403,
    'message', 'Neue Konten gibt es nur auf Einladung.'));
END;
$$;

GRANT EXECUTE ON FUNCTION public.hook_registrierung_pruefen(jsonb) TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.hook_registrierung_pruefen(jsonb) FROM authenticated, anon, public;

COMMIT;

-- ── Kontrolle (ändert nichts) ───────────────────────────────────────────
-- Erwartet: rls_an = true; anon_darf_vormerken = false;
--           angemeldet_darf_hook = false; fremd = Fehlermeldung „nur auf Einladung“
SELECT
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.registrierung_vorgemerkt'::regclass) AS rls_an,
  has_function_privilege('anon', 'public.registrierung_vormerken(text)', 'EXECUTE')               AS anon_darf_vormerken,
  has_function_privilege('authenticated', 'public.hook_registrierung_pruefen(jsonb)', 'EXECUTE')  AS angemeldet_darf_hook,
  public.hook_registrierung_pruefen('{"user":{"email":"fremd@example.com"}}'::jsonb)->'error'->>'message' AS fremd;
