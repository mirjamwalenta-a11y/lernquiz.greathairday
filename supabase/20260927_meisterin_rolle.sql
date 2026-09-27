-- ════════════════════════════════════════════════════════════════════════
-- Meisterin-Rolle serverseitig (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Warum: Lernquiz, Lern-Tool und Schnuppertag haben bisher JEDES erfolgreiche
-- Login (auch das eines Lehrlings) als Meisterin behandelt. Die Rolle wird
-- jetzt in der Datenbank festgelegt und über ist_meisterin() geprüft,
-- ohne E-Mail-Adresse im Code (siehe CLAUDE.md, Regeln 2 und 3).
--
-- Ausführen im Supabase SQL-Editor, Schritt für Schritt, VOR dem Merge der
-- dazugehörigen App-Änderung (sonst kommt die Meisterin nicht mehr rein).
-- ════════════════════════════════════════════════════════════════════════


-- ── SCHRITT 1: Rollen-Tabelle + Prüffunktion ────────────────────────────
CREATE TABLE IF NOT EXISTS public.app_rollen (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  rolle      text NOT NULL CHECK (rolle IN ('meisterin')),
  angelegt_am timestamptz NOT NULL DEFAULT now()
);

-- RLS an, bewusst OHNE Policy: niemand liest/schreibt die Tabelle direkt über
-- die API. Zugriff nur über die SECURITY-DEFINER-Funktion unten.
ALTER TABLE public.app_rollen ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_rollen FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.ist_meisterin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_rollen
    WHERE user_id = auth.uid() AND rolle = 'meisterin'
  );
$$;

REVOKE ALL ON FUNCTION public.ist_meisterin() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.ist_meisterin() TO authenticated;


-- ── SCHRITT 2: Meisterin-Konto eintragen ────────────────────────────────
-- Im SQL-Editor die Platzhalter-Adresse durch die E-Mail des Meisterin-
-- Kontos ersetzen und ausführen. Die echte Adresse NICHT in diese Datei
-- zurückschreiben und nicht committen (CLAUDE.md, Regel 2).
INSERT INTO public.app_rollen (user_id, rolle)
SELECT id, 'meisterin' FROM auth.users WHERE email = 'MEISTERIN-EMAIL-HIER-EINSETZEN'
ON CONFLICT (user_id) DO NOTHING;

-- Kontrolle: muss genau 1 Zeile zeigen (das Meisterin-Konto).
SELECT u.email, r.rolle, r.angelegt_am
FROM public.app_rollen r JOIN auth.users u ON u.id = r.user_id;


-- ── SCHRITT 3: Diagnose (nur lesen, ändert nichts) ──────────────────────
-- Ergebnis bitte an Claude schicken. Damit werden im nächsten Schritt die
-- Datenbank-Regeln (RLS) für Lehrlinge, Fragen, Verlauf, Schnuppertage und
-- Probezeiten passend auf ist_meisterin() umgestellt, statt sie zu raten.

-- 3a) Welche Tabellen haben RLS an/aus?
SELECT c.relname AS tabelle, c.relrowsecurity AS rls_an
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY 1;

-- 3b) Welche Policies gibt es?
SELECT tablename AS tabelle, policyname, cmd, roles, qual AS using_bedingung, with_check
FROM pg_policies WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3c) Wie sind die Passwort-/E-Mail-Funktionen abgesichert?
SELECT p.proname AS funktion, p.prosecdef AS security_definer,
       pg_get_functiondef(p.oid) AS definition
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('update_user_password', 'confirm_user_email', 'ist_meisterin');
