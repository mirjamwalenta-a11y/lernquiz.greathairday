-- ════════════════════════════════════════════════════════════════════════
-- Technikkopf ab März 2027: Texte unter den 4 Ansichten
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Wozu: In zwischenpruefung.html (Praxis › Technikkopf › Bilder › „Ab März
-- 2027“) stehen unter den 4 Fotos Titel, Beschreibung und ein Hinweis.
-- Die Meisterin kann diese Texte direkt in der App ändern („Text
-- bearbeiten“). Ohne Eintrag in dieser Tabelle zeigt die App die
-- eingebauten Standardtexte.
--
-- Sicherheit (CLAUDE.md, Regeln 1 und 3; SICHERHEIT-RLS-CHECK.md, Abschnitt 2):
--   - RLS im selben Schritt wie CREATE TABLE.
--   - Lesen: alle angemeldeten Konten (reine Lerninhalte, keine persönlichen
--     Daten). KEIN Zugriff für anon: Wer nicht angemeldet ist, sieht die
--     eingebauten Standardtexte.
--   - Schreiben: nur die Meisterin, serverseitig über ist_meisterin()
--     (aus 20260927_meisterin_rolle.sql). Der „Text bearbeiten“-Knopf in der
--     App blendet nur die Bedienung ein, die Absicherung ist diese Policy.
--   - Kein DELETE: Texte werden nur geändert.
--   - geaendert_von / geaendert_am setzt ein Trigger am Server, der Client
--     kann sie nicht vorgeben.
--
-- Voraussetzung: 20260927_meisterin_rolle.sql ist gelaufen.
-- Ausführen im Supabase SQL-Editor. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

CREATE TABLE IF NOT EXISTS public.technikkopf_bildtexte (
  ansicht      smallint PRIMARY KEY CHECK (ansicht BETWEEN 1 AND 4),
  titel        text NOT NULL CHECK (char_length(titel) BETWEEN 1 AND 80),
  text         text NOT NULL DEFAULT '' CHECK (char_length(text) <= 400),
  hinweis      text NOT NULL DEFAULT '' CHECK (char_length(hinweis) <= 300),
  geaendert_am timestamptz NOT NULL DEFAULT now(),
  geaendert_von uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.technikkopf_bildtexte ENABLE ROW LEVEL SECURITY;

-- Rechte: nur was die App braucht. anon bekommt nichts.
REVOKE ALL ON public.technikkopf_bildtexte FROM anon, authenticated;
GRANT SELECT ON public.technikkopf_bildtexte TO authenticated;
GRANT INSERT (ansicht, titel, text, hinweis) ON public.technikkopf_bildtexte TO authenticated;
-- ansicht steht mit drin, weil das Speichern per upsert (ON CONFLICT DO UPDATE) alle
-- gesendeten Spalten setzt; der Wert bleibt dabei gleich.
GRANT UPDATE (ansicht, titel, text, hinweis) ON public.technikkopf_bildtexte TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.technikkopf_bildtexte TO service_role;

DROP POLICY IF EXISTS technikkopf_bildtexte_lesen ON public.technikkopf_bildtexte;
CREATE POLICY technikkopf_bildtexte_lesen ON public.technikkopf_bildtexte
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS technikkopf_bildtexte_meisterin_neu ON public.technikkopf_bildtexte;
CREATE POLICY technikkopf_bildtexte_meisterin_neu ON public.technikkopf_bildtexte
  FOR INSERT TO authenticated WITH CHECK (public.ist_meisterin());

DROP POLICY IF EXISTS technikkopf_bildtexte_meisterin_aendern ON public.technikkopf_bildtexte;
CREATE POLICY technikkopf_bildtexte_meisterin_aendern ON public.technikkopf_bildtexte
  FOR UPDATE TO authenticated USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- Wer/wann geändert: immer vom Server gesetzt
CREATE OR REPLACE FUNCTION public.technikkopf_bildtexte_stempel()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.geaendert_am := now();
  NEW.geaendert_von := auth.uid();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS technikkopf_bildtexte_stempel ON public.technikkopf_bildtexte;
CREATE TRIGGER technikkopf_bildtexte_stempel
  BEFORE INSERT OR UPDATE ON public.technikkopf_bildtexte
  FOR EACH ROW EXECUTE FUNCTION public.technikkopf_bildtexte_stempel();

COMMIT;

-- Kontrolle 1: RLS muss „true“ sein.
SELECT relname, relrowsecurity FROM pg_class
WHERE oid = 'public.technikkopf_bildtexte'::regclass;

-- Kontrolle 2: genau 3 Policies (lesen, meisterin_neu, meisterin_aendern).
SELECT policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'technikkopf_bildtexte';

-- Kontrolle 3: anon darf nichts (keine Zeile mit grantee = anon).
SELECT grantee, privilege_type FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'technikkopf_bildtexte'
ORDER BY grantee, privilege_type;
