-- ════════════════════════════════════════════════════════════════════════
-- Lehrlings-Zugang sperren / wieder freigeben
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Bisher war „Quiz aktiv: AUS“ nur eine Prüfung im Lernquiz-Login (Browser).
-- Das Konto selbst blieb gültig: Anmelden im Lern-Tool oder direkt über die
-- API ging weiter, und eine offene Sitzung lief einfach weiter. Nach
-- CLAUDE.md Regel 3 muss so etwas am Server durchgesetzt werden.
--
-- Neu: public.lehrling_zugang_sperren(target_user_id, gesperrt)
--  * nur eine angemeldete Meisterin (ist_meisterin()) darf sie aufrufen
--  * nur für Konten, die als Lehrling in public.lehrlinge stehen und selbst
--    KEINE Meisterin sind (die Meisterin kann sich nicht aussperren)
--  * sperren:   lehrlinge.aktiv = false, auth.users.banned_until = 'infinity'
--               (Supabase lehnt damit Anmeldung UND Token-Erneuerung ab)
--               und alle Sitzungen/Refresh-Tokens des Kontos werden gelöscht
--               → spätestens nach Ablauf des aktuellen Zugriffstokens (max.
--               1 Stunde) ist der Zugang in ALLEN Apps dieses Projekts weg
--  * freigeben: lehrlinge.aktiv = true, banned_until = NULL
--  * Daten (Verlauf, Abzeichen, Praxis-Tagebuch …) bleiben erhalten
--
-- Keine neue Tabelle → keine neuen RLS-Regeln/GRANTs auf Tabellen nötig.
-- Funktion: fester search_path, kein Ausführungsrecht für anon/PUBLIC.
-- Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.lehrling_zugang_sperren(target_user_id uuid, gesperrt boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.ist_meisterin() THEN
    RAISE EXCEPTION 'Keine Berechtigung' USING ERRCODE = '42501';
  END IF;

  IF target_user_id IS NULL OR gesperrt IS NULL THEN
    RAISE EXCEPTION 'Konto und Sperr-Status angeben' USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.lehrlinge WHERE user_id = target_user_id) THEN
    RAISE EXCEPTION 'Nur Lehrlings-Konten können hier gesperrt werden' USING ERRCODE = '42501';
  END IF;

  IF EXISTS (SELECT 1 FROM public.app_rollen WHERE user_id = target_user_id) THEN
    RAISE EXCEPTION 'Meisterinnen-Konten können hier nicht gesperrt werden' USING ERRCODE = '42501';
  END IF;

  UPDATE public.lehrlinge SET aktiv = NOT gesperrt WHERE user_id = target_user_id;

  IF gesperrt THEN
    UPDATE auth.users SET banned_until = 'infinity'::timestamptz WHERE id = target_user_id;
    DELETE FROM auth.refresh_tokens WHERE user_id = target_user_id::text;
    DELETE FROM auth.sessions WHERE user_id = target_user_id;
  ELSE
    UPDATE auth.users SET banned_until = NULL WHERE id = target_user_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.lehrling_zugang_sperren(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.lehrling_zugang_sperren(uuid, boolean) TO authenticated;

-- Kontrolle 1: anon darf NICHT ausführen (erwartet: false, true)
SELECT has_function_privilege('anon', 'public.lehrling_zugang_sperren(uuid, boolean)', 'EXECUTE') AS anon_darf,
       has_function_privilege('authenticated', 'public.lehrling_zugang_sperren(uuid, boolean)', 'EXECUTE') AS angemeldet_darf;

-- Kontrolle 2 (nach dem Sperren in der App): gesperrte Lehrlings-Konten
-- erwartet: aktiv = false und banned_until = infinity
SELECT l.name, l.aktiv, u.banned_until
FROM public.lehrlinge l JOIN auth.users u ON u.id = l.user_id
WHERE l.aktiv = false OR u.banned_until IS NOT NULL;
