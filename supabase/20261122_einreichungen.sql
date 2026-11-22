-- ════════════════════════════════════════════════════════════════════════
-- Meisterin-Bereich: „Einreichungen & Projekte“ (V1)
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Ein schlankes Werkzeug der Meisterin, um Wettbewerbs-Einreichungen
-- (V1: Staatspreis, Mercur Innovationspreis) zu führen und kritisch zu
-- prüfen. Kein Projektmanager, keine Teamfunktionen, kein Scoring.
--
-- public.einreichungen        – eine Zeile pro Vorhaben:
--                               Kopfdaten (Titel, Wettbewerb, Deadline,
--                               Kernbotschaft, ausdrückliche Anforderungen),
--                               die Abschnitte Ausgangslage, Lösung, Wirkung,
--                               Offene Lücken und der Wettbewerbs-Check
--                               (jsonb: Einschätzung + kurze Hinweise je
--                               Abschnitt, die drei wichtigsten Schwächen)
-- public.einreichung_belege   – der Abschnitt „Belege“: Material direkt im
--                               Tool (Beobachtung, Aussage, Beispiel, Zahl,
--                               Screenshot/Foto, Dokumentation), optional mit
--                               einem Bild
-- Storage-Bucket einreichung-belege (privat, nur JPEG, max. 2 MB). Pfad
--                               <einreichung_id>/<beleg_id>.jpg, per CHECK an
--                               die Zeile gebunden.
--
-- Rechte (CLAUDE.md Regeln 1 und 3 – Rolle serverseitig über ist_meisterin()):
--   beide Tabellen   Meisterin → alles · alle anderen Konten (Lehrlinge,
--                    Team-App) → nichts · anon → nichts (kein Grant, keine Policy)
--   Bucket           Meisterin → alles · sonst niemand · nicht öffentlich
--
-- Löschen: Belege hängen mit ON DELETE RESTRICT an der Einreichung, damit
-- keine Bilddatei ohne Zeile übrig bleibt. Die App löscht zuerst die Dateien
-- (Storage-API), dann die Belege, dann die Einreichung.
--
-- Persönliche Daten: Belege sollen ohne Namen von Lehrlingen oder Kundinnen
-- auskommen (Hinweis in der App). Zitate von Lehrlingen nur mit deren
-- Erlaubnis (siehe Rückmeldungen, zitat_ok).
--
-- Voraussetzung: 20260927_meisterin_rolle.sql (ist_meisterin()).
-- Ohne diese Migration zeigt die Kachel einen Hinweis, der Rest der App
-- läuft unverändert. Alles in einer Transaktion. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

DO $pruef$ BEGIN
  IF to_regprocedure('public.ist_meisterin()') IS NULL THEN
    RAISE EXCEPTION 'Abbruch: ist_meisterin() fehlt – zuerst 20260927_meisterin_rolle.sql ausführen.';
  END IF;
END $pruef$;

-- ── 1. Einreichungen ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.einreichungen (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titel          text NOT NULL CHECK (char_length(titel) BETWEEN 1 AND 160),
  wettbewerb     text NOT NULL CHECK (wettbewerb IN ('staatspreis', 'mercur')),
  deadline       date,
  kernbotschaft  text NOT NULL DEFAULT '' CHECK (char_length(kernbotschaft) <= 400),
  anforderungen  text NOT NULL DEFAULT '' CHECK (char_length(anforderungen) <= 4000),
  ausgangslage   text NOT NULL DEFAULT '' CHECK (char_length(ausgangslage) <= 8000),
  loesung        text NOT NULL DEFAULT '' CHECK (char_length(loesung) <= 8000),
  wirkung        text NOT NULL DEFAULT '' CHECK (char_length(wirkung) <= 8000),
  luecken        text NOT NULL DEFAULT '' CHECK (char_length(luecken) <= 8000),
  -- {"abschnitte": {"ausgangslage": {"stufe": "klar|teilweise|allgemein",
  --   "tragfaehig": "…", "unklar": "…", "unbelegt": "…"}, …},
  --  "schwaechen": ["…", "…", "…"]}
  pruefung       jsonb NOT NULL DEFAULT '{}'::jsonb
                 CHECK (jsonb_typeof(pruefung) = 'object' AND pg_column_size(pruefung) <= 40000),
  erstellt_am    timestamptz NOT NULL DEFAULT now(),
  geaendert_am   timestamptz NOT NULL DEFAULT now()
);

-- RLS im selben Schritt wie die Tabelle
ALTER TABLE public.einreichungen ENABLE ROW LEVEL SECURITY;

-- ── 2. Belege ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.einreichung_belege (
  id              uuid PRIMARY KEY,   -- kommt aus der App (crypto.randomUUID), wegen des Bildpfads
  einreichung_id  uuid NOT NULL REFERENCES public.einreichungen(id) ON DELETE RESTRICT,
  art             text NOT NULL CHECK (art IN ('beobachtung', 'aussage', 'beispiel', 'zahl', 'screenshot', 'dokument')),
  abschnitt       text NOT NULL DEFAULT 'allgemein' CHECK (abschnitt IN ('ausgangslage', 'loesung', 'wirkung', 'allgemein')),
  titel           text NOT NULL CHECK (char_length(titel) BETWEEN 1 AND 160),
  inhalt          text NOT NULL DEFAULT '' CHECK (char_length(inhalt) <= 4000),
  datum           date,
  quelle          text NOT NULL DEFAULT '' CHECK (char_length(quelle) <= 200),
  bild_pfad       text UNIQUE,
  erstellt_am     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT einreichung_belege_pfad_passt
    CHECK (bild_pfad IS NULL OR bild_pfad = einreichung_id::text || '/' || id::text || '.jpg')
);
CREATE INDEX IF NOT EXISTS einreichung_belege_einreichung_idx ON public.einreichung_belege (einreichung_id);

-- RLS im selben Schritt wie die Tabelle
ALTER TABLE public.einreichung_belege ENABLE ROW LEVEL SECURITY;

-- ── 3. Grants: nur angemeldete Konten, RLS entscheidet. Kein Recht für anon.
REVOKE ALL ON public.einreichungen, public.einreichung_belege FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.einreichungen      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.einreichung_belege TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.einreichungen      TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.einreichung_belege TO service_role;

-- ── 4. Policies: nur die Meisterin ─────────────────────────────────────
DROP POLICY IF EXISTS einreichungen_meisterin      ON public.einreichungen;
DROP POLICY IF EXISTS einreichung_belege_meisterin ON public.einreichung_belege;
CREATE POLICY einreichungen_meisterin ON public.einreichungen FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());
CREATE POLICY einreichung_belege_meisterin ON public.einreichung_belege FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- geaendert_am pflegt der Server
CREATE OR REPLACE FUNCTION public.einreichungen_geaendert()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $f$
BEGIN
  NEW.geaendert_am := now();
  RETURN NEW;
END $f$;
REVOKE ALL ON FUNCTION public.einreichungen_geaendert() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS einreichungen_geaendert ON public.einreichungen;
CREATE TRIGGER einreichungen_geaendert BEFORE UPDATE ON public.einreichungen
  FOR EACH ROW EXECUTE FUNCTION public.einreichungen_geaendert();

-- ── 5. Bucket für Bilder zu Belegen ─────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('einreichung-belege', 'einreichung-belege', false, 2097152, ARRAY['image/jpeg'])
ON CONFLICT (id) DO UPDATE
  SET public = false, file_size_limit = 2097152, allowed_mime_types = ARRAY['image/jpeg'];

-- Nur die Meisterin, und nur Dateien, zu denen es eine Beleg-Zeile gibt
DROP POLICY IF EXISTS einreichung_belege_storage_meisterin ON storage.objects;
CREATE POLICY einreichung_belege_storage_meisterin ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'einreichung-belege' AND public.ist_meisterin())
  WITH CHECK (bucket_id = 'einreichung-belege' AND public.ist_meisterin()
              AND EXISTS (SELECT 1 FROM public.einreichung_belege b WHERE b.bild_pfad = storage.objects.name));

COMMIT;

-- ── Prüfen (Ergebnis im SQL-Editor ansehen) ─────────────────────────────
-- Erwartet: je Tabelle authenticated und service_role (DELETE, INSERT, SELECT, UPDATE), keine Zeile für anon
SELECT table_name, grantee, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS rechte
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name IN ('einreichungen', 'einreichung_belege')
  AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY table_name, grantee ORDER BY table_name, grantee;

-- Erwartet: einreichungen_meisterin, einreichung_belege_meisterin (je ALL, authenticated)
SELECT tablename, policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('einreichungen', 'einreichung_belege') ORDER BY 1, 2;

-- Erwartet: einreichung-belege, public = false
SELECT id, public, file_size_limit, allowed_mime_types FROM storage.buckets WHERE id = 'einreichung-belege';
