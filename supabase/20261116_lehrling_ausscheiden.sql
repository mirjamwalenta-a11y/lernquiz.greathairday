-- ════════════════════════════════════════════════════════════════════════
-- Lehrling „Ausgeschieden“: Lernzahlen behalten, Person entfernen
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Bisher gab es nur „Löschen“. Dabei gingen alle Lernzahlen verloren
-- (Verlauf, Kompetenz, Praxis-Tagebuch, Prüfgespräche), und das
-- Anmelde-Konto blieb gesperrt bestehen, samt Konto-Adresse mit dem Namen
-- (vorname.nachname.lernquiz@…).
--
-- Neu: public.lehrling_ausscheiden(p_lehrling_id text)
--  * nur eine angemeldete Meisterin (ist_meisterin()) darf sie aufrufen
--    (CLAUDE.md Regel 3: Rolle am Server, nicht nur im Browser)
--  * nicht für Meisterinnen-Konten
--  * in EINEM Schritt (geht etwas schief, bleibt alles wie es war):
--      - lehrlinge: Name → „Ehemalige:r Lehrling <Jahr> · <Nr.>“,
--        aktiv = false, ausgeschieden_am = heute, user_id = NULL
--      - Anmelde-Konto löschen (auth.users, damit auch Sitzungen,
--        Refresh-Tokens, PIN-Hash und die Konto-Adresse mit dem Namen)
--      - Freitexte leeren, in denen Namen stehen können:
--        praxis_eintraege.details/notiz/kontrolliert_von/meisterin_notiz,
--        pruefgespraeche.notiz, farb_plaene.warum/rueckmeldung
--      - wiederholung (Fragen-Plan, wird nicht mehr gebraucht) löschen
--  * ERHALTEN bleiben die Lernzahlen ohne Namen: verlauf, kompetenz,
--    Praxis-Datum/-Bereich/-Dauer/-Bestätigung, Ergebnis der Prüfgespräche,
--    Status der Farb-Pläne, Abzeichen. Sie zählen im Ausbildungsbericht.
--  * Das lässt sich nicht rückgängig machen.
--
-- Wie lange diese Zahlen ohne Namen bleiben dürfen, legt die
-- Datenschutzerklärung fest (rechtliches.html, Löschfristen – offen).
--
-- Keine neue Tabelle. Neue Spalte lehrlinge.ausgeschieden_am: die
-- bestehenden Tabellen-Rechte und RLS-Regeln gelten für sie mit.
-- Funktion: SECURITY DEFINER, fester search_path, kein Ausführungsrecht
-- für anon/PUBLIC. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE public.lehrlinge ADD COLUMN IF NOT EXISTS ausgeschieden_am date;
-- Ausgeschiedene haben kein Konto mehr
ALTER TABLE public.lehrlinge ALTER COLUMN user_id DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.lehrling_ausscheiden(p_lehrling_id text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  l        record;
  nr       integer;
  neu_name text;
BEGIN
  IF NOT public.ist_meisterin() THEN
    RAISE EXCEPTION 'Keine Berechtigung' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO l FROM public.lehrlinge WHERE id::text = p_lehrling_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lehrling nicht gefunden' USING ERRCODE = '22023';
  END IF;
  IF l.ausgeschieden_am IS NOT NULL THEN
    RETURN l.name;   -- schon erledigt
  END IF;
  IF l.user_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.app_rollen WHERE user_id = l.user_id) THEN
    RAISE EXCEPTION 'Meisterinnen-Konten können nicht ausscheiden' USING ERRCODE = '42501';
  END IF;

  SELECT count(*) + 1 INTO nr FROM public.lehrlinge
   WHERE ausgeschieden_am IS NOT NULL
     AND extract(year FROM ausgeschieden_am) = extract(year FROM current_date);
  neu_name := 'Ehemalige:r Lehrling ' || extract(year FROM current_date)::int || ' · ' || nr;

  UPDATE public.lehrlinge
     SET name = neu_name, aktiv = false, ausgeschieden_am = current_date, user_id = NULL
   WHERE id = l.id;

  UPDATE public.praxis_eintraege
     SET details = NULL, notiz = NULL, kontrolliert_von = NULL, meisterin_notiz = NULL
   WHERE lehrling_id = l.id;
  UPDATE public.pruefgespraeche SET notiz = NULL WHERE lehrling_id = l.id;
  UPDATE public.farb_plaene SET warum = NULL, rueckmeldung = NULL WHERE lehrling_id = l.id;
  DELETE FROM public.wiederholung WHERE lehrling_id = l.id;

  IF l.user_id IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = l.user_id;
  END IF;

  RETURN neu_name;
END;
$$;

REVOKE ALL ON FUNCTION public.lehrling_ausscheiden(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.lehrling_ausscheiden(text) TO authenticated;

-- Kontrolle 1: anon darf NICHT ausführen (erwartet: false, true)
SELECT has_function_privilege('anon', 'public.lehrling_ausscheiden(text)', 'EXECUTE') AS anon_darf,
       has_function_privilege('authenticated', 'public.lehrling_ausscheiden(text)', 'EXECUTE') AS angemeldet_darf;

-- Kontrolle 2 (nach dem ersten „Ausgeschieden“ in der App):
-- erwartet: Name „Ehemalige:r …“, aktiv = false, user_id leer, kein Konto
SELECT l.name, l.aktiv, l.ausgeschieden_am, l.user_id,
       (SELECT count(*) FROM public.verlauf v WHERE v.lehrling_id = l.id) AS quizze
FROM public.lehrlinge l
WHERE l.ausgeschieden_am IS NOT NULL;
