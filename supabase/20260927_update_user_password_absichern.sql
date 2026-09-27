-- ════════════════════════════════════════════════════════════════════════
-- update_user_password absichern (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Fund aus der Diagnose vom 2026-09-27: Die Funktion lief als SECURITY
-- DEFINER OHNE jede Prüfung und war (Postgres-Standard) für PUBLIC, also
-- auch anon, ausführbar. Damit konnte jeder mit dem öffentlichen anon-Key
-- das Passwort JEDES Kontos (auch der Meisterin) setzen.
--
-- Neu:
--  * nur eine angemeldete Meisterin (ist_meisterin()) darf sie aufrufen
--  * nur für Konten, die als Lehrling in public.lehrlinge stehen
--    (einziger Aufrufer: Lernquiz → Lehrling bearbeiten → neue PIN)
--  * PIN muss 6 Ziffern haben (wie im Lernquiz-Formular)
--  * fester search_path, kein Ausführungsrecht für anon/PUBLIC
-- ════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_user_password(target_user_id uuid, new_password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
  IF NOT public.ist_meisterin() THEN
    RAISE EXCEPTION 'Keine Berechtigung' USING ERRCODE = '42501';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.lehrlinge WHERE user_id = target_user_id) THEN
    RAISE EXCEPTION 'Nur Lehrlings-Konten können hier geändert werden' USING ERRCODE = '42501';
  END IF;

  IF new_password IS NULL OR new_password !~ '^[0-9]{6}$' THEN
    RAISE EXCEPTION 'PIN muss genau 6 Ziffern haben' USING ERRCODE = '22023';
  END IF;

  UPDATE auth.users
     SET encrypted_password = crypt(new_password, gen_salt('bf'))
   WHERE id = target_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.update_user_password(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_user_password(uuid, text) TO authenticated;

-- Kontrolle: anon darf NICHT mehr ausführen (erwartet: false, true)
SELECT has_function_privilege('anon', 'public.update_user_password(uuid, text)', 'EXECUTE') AS anon_darf,
       has_function_privilege('authenticated', 'public.update_user_password(uuid, text)', 'EXECUTE') AS angemeldet_darf;
