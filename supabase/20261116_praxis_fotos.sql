-- ════════════════════════════════════════════════════════════════════════
-- Praxis-Tagebuch: Fotos (bis zu 3 pro Eintrag)
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Entscheidungen der Inhaberin (2026-11-16):
--   * sehen dürfen: der Lehrling seine EIGENEN Fotos, die Meisterin alle
--   * Motiv: Übungskopf oder Modell OHNE Gesicht; beim Modell ist
--     „Einverständnis liegt vor“ Pflicht (die Einwilligung selbst holt und
--     verwahrt der Salon)
--   * gelöscht werden die Fotos, wenn der Lehrling ausscheidet oder
--     gelöscht wird
--
-- Bestandteile:
--   1. Privater Storage-Bucket `praxis-fotos` (nicht öffentlich, nur JPEG,
--      max. 2 MB; die App verkleinert vorher auf ca. 1600 px und entfernt
--      dabei die Bild-Metadaten wie den Aufnahmeort)
--   2. Tabelle public.praxis_fotos: eine Zeile pro Foto (Pfad, Motiv,
--      Einverständnis). Pfad = <lehrling_id>/<eintrag_id>/<foto_id>.jpg
--      ist durch einen CHECK fest an die Zeile gebunden.
--   3. Storage-Regeln: eine Datei darf nur hochgeladen/gelesen/gelöscht
--      werden, wenn es dazu eine passende Zeile in praxis_fotos gibt, die
--      man selbst sehen darf. Damit hat jede Datei eine Zeile, und das
--      Löschen über die Zeilen erwischt alle Dateien.
--   4. Lehrling löschen/ausscheiden geht erst, wenn die Fotos weg sind:
--      Fremdschlüssel mit ON DELETE RESTRICT bzw. eine Prüfung in
--      lehrling_ausscheiden(). Dateien lassen sich in Supabase nicht per
--      SQL löschen (nur über die Storage-API) – die App löscht sie deshalb
--      vorher (praxis-fotos.js) und der Server verhindert, dass welche
--      übrig bleiben.
--
-- Rechte (CLAUDE.md, Regeln 1 und 3 – Rolle serverseitig über ist_meisterin()):
--   Lehrling  → eigene Fotos lesen; hochladen und löschen nur bei eigenen,
--               noch NICHT bestätigten Einträgen; ändern gar nicht
--   Meisterin → alles (insbesondere ein unpassendes Foto löschen)
--   anon      → nichts (kein Grant, keine Policy, Bucket nicht öffentlich)
--
-- Voraussetzung: 20261107_praxis_eintraege.sql, 20261116_lehrling_ausscheiden.sql.
-- Ohne diese Migration zeigt die App keine Foto-Funktion (der Rest läuft
-- unverändert). Alles in einer Transaktion. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

DO $pruef$ BEGIN
  IF to_regprocedure('public.ist_meisterin()') IS NULL THEN
    RAISE EXCEPTION 'Abbruch: ist_meisterin() fehlt – zuerst 20260927_meisterin_rolle.sql ausführen.';
  END IF;
  IF to_regclass('public.praxis_eintraege') IS NULL THEN
    RAISE EXCEPTION 'Abbruch: praxis_eintraege fehlt – zuerst 20261107_praxis_eintraege.sql ausführen.';
  END IF;
  IF to_regprocedure('public.lehrling_ausscheiden(text)') IS NULL THEN
    RAISE EXCEPTION 'Abbruch: lehrling_ausscheiden() fehlt – zuerst 20261116_lehrling_ausscheiden.sql ausführen.';
  END IF;
END $pruef$;

-- ── 1. Bucket ───────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('praxis-fotos', 'praxis-fotos', false, 2097152, ARRAY['image/jpeg'])
ON CONFLICT (id) DO UPDATE
  SET public = false, file_size_limit = 2097152, allowed_mime_types = ARRAY['image/jpeg'];

-- ── 2. Tabelle ──────────────────────────────────────────────────────────
-- lehrling_id bekommt denselben Typ wie lehrlinge.id (uuid oder bigint)
DO $anlegen$
DECLARE typ text;
BEGIN
  SELECT format_type(a.atttypid, a.atttypmod) INTO typ
  FROM pg_attribute a
  WHERE a.attrelid = 'public.lehrlinge'::regclass AND a.attname = 'id' AND NOT a.attisdropped;

  EXECUTE format($t$
    CREATE TABLE IF NOT EXISTS public.praxis_fotos (
      id              uuid PRIMARY KEY,
      eintrag_id      uuid NOT NULL REFERENCES public.praxis_eintraege(id) ON DELETE RESTRICT,
      lehrling_id     %s NOT NULL REFERENCES public.lehrlinge(id) ON DELETE RESTRICT,
      pfad            text NOT NULL UNIQUE,
      motiv           text NOT NULL CHECK (motiv IN ('uebungskopf', 'modell_ohne_gesicht')),
      einverstaendnis boolean NOT NULL DEFAULT false,
      erstellt_am     timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT praxis_fotos_pfad_passt
        CHECK (pfad = lehrling_id::text || '/' || eintrag_id::text || '/' || id::text || '.jpg'),
      CONSTRAINT praxis_fotos_modell_einverstanden
        CHECK (motiv = 'uebungskopf' OR einverstaendnis)
    )$t$, typ);
END $anlegen$;

CREATE INDEX IF NOT EXISTS praxis_fotos_eintrag_idx  ON public.praxis_fotos (eintrag_id);
CREATE INDEX IF NOT EXISTS praxis_fotos_lehrling_idx ON public.praxis_fotos (lehrling_id);

-- RLS im selben Schritt wie die Tabelle
ALTER TABLE public.praxis_fotos ENABLE ROW LEVEL SECURITY;

-- Grants: nur was die App braucht (kein UPDATE). Kein Recht für anon.
-- id kommt aus der App (crypto.randomUUID) – keine Sequence.
REVOKE ALL ON public.praxis_fotos FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.praxis_fotos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.praxis_fotos TO service_role;

DROP POLICY IF EXISTS praxis_fotos_eigene_lesen    ON public.praxis_fotos;
DROP POLICY IF EXISTS praxis_fotos_eigene_anlegen  ON public.praxis_fotos;
DROP POLICY IF EXISTS praxis_fotos_eigene_loeschen ON public.praxis_fotos;
DROP POLICY IF EXISTS praxis_fotos_meisterin       ON public.praxis_fotos;

CREATE POLICY praxis_fotos_eigene_lesen ON public.praxis_fotos FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
-- Hochladen nur zu einem eigenen, noch nicht bestätigten Eintrag
CREATE POLICY praxis_fotos_eigene_anlegen ON public.praxis_fotos FOR INSERT TO authenticated
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid())
              AND EXISTS (SELECT 1 FROM public.praxis_eintraege e
                          WHERE e.id = eintrag_id AND e.lehrling_id = praxis_fotos.lehrling_id
                            AND e.bestaetigt = false));
CREATE POLICY praxis_fotos_eigene_loeschen ON public.praxis_fotos FOR DELETE TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid())
         AND EXISTS (SELECT 1 FROM public.praxis_eintraege e
                     WHERE e.id = eintrag_id AND e.bestaetigt = false));
CREATE POLICY praxis_fotos_meisterin ON public.praxis_fotos FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- Höchstens 3 Fotos pro Eintrag; Eintrag und Lehrling müssen zusammenpassen
CREATE OR REPLACE FUNCTION public.praxis_fotos_pruefen()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.praxis_eintraege e
                 WHERE e.id = NEW.eintrag_id AND e.lehrling_id = NEW.lehrling_id) THEN
    RAISE EXCEPTION 'Eintrag gehört nicht zu diesem Lehrling' USING ERRCODE = '42501';
  END IF;
  IF (SELECT count(*) FROM public.praxis_fotos f WHERE f.eintrag_id = NEW.eintrag_id) >= 3 THEN
    RAISE EXCEPTION 'Höchstens 3 Fotos pro Eintrag' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.praxis_fotos_pruefen() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS praxis_fotos_pruefen ON public.praxis_fotos;
CREATE TRIGGER praxis_fotos_pruefen
  BEFORE INSERT ON public.praxis_fotos
  FOR EACH ROW EXECUTE FUNCTION public.praxis_fotos_pruefen();

-- ── 3. Storage-Regeln für den Bucket ────────────────────────────────────
-- Jede Datei braucht eine passende Zeile in praxis_fotos. Die Unterabfrage
-- läuft mit den RLS-Regeln der Person, die gerade zugreift: Ein Lehrling
-- findet also nur eigene Zeilen.
DROP POLICY IF EXISTS praxis_fotos_storage_lesen    ON storage.objects;
DROP POLICY IF EXISTS praxis_fotos_storage_anlegen  ON storage.objects;
DROP POLICY IF EXISTS praxis_fotos_storage_loeschen ON storage.objects;
DROP POLICY IF EXISTS praxis_fotos_storage_meisterin ON storage.objects;

CREATE POLICY praxis_fotos_storage_lesen ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'praxis-fotos'
         AND EXISTS (SELECT 1 FROM public.praxis_fotos f
                     JOIN public.lehrlinge l ON l.id = f.lehrling_id
                     WHERE f.pfad = storage.objects.name AND l.user_id = auth.uid()));
CREATE POLICY praxis_fotos_storage_anlegen ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'praxis-fotos'
              AND EXISTS (SELECT 1 FROM public.praxis_fotos f
                          JOIN public.lehrlinge l ON l.id = f.lehrling_id
                          JOIN public.praxis_eintraege e ON e.id = f.eintrag_id
                          WHERE f.pfad = storage.objects.name AND l.user_id = auth.uid()
                            AND e.bestaetigt = false));
CREATE POLICY praxis_fotos_storage_loeschen ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'praxis-fotos'
         AND EXISTS (SELECT 1 FROM public.praxis_fotos f
                     JOIN public.lehrlinge l ON l.id = f.lehrling_id
                     JOIN public.praxis_eintraege e ON e.id = f.eintrag_id
                     WHERE f.pfad = storage.objects.name AND l.user_id = auth.uid()
                       AND e.bestaetigt = false));
CREATE POLICY praxis_fotos_storage_meisterin ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'praxis-fotos' AND public.ist_meisterin())
  WITH CHECK (bucket_id = 'praxis-fotos' AND public.ist_meisterin());

-- ── 4. Ausscheiden: erst wenn keine Fotos mehr da sind ──────────────────
-- Unverändert aus 20261116_lehrling_ausscheiden.sql, nur mit der neuen
-- Prüfung „keine Fotos mehr“ (die App löscht sie vorher über die Storage-API).
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
  IF EXISTS (SELECT 1 FROM public.praxis_fotos WHERE lehrling_id = l.id) THEN
    RAISE EXCEPTION 'Zuerst die Praxis-Fotos löschen' USING ERRCODE = '23503';
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

COMMIT;

-- ── Kontrolle ───────────────────────────────────────────────────────────
-- Erwartet: public = false, 2097152, {image/jpeg}
SELECT id, public, file_size_limit, allowed_mime_types FROM storage.buckets WHERE id = 'praxis-fotos';

-- Erwartet: rls_an = true
SELECT c.relrowsecurity AS rls_an FROM pg_class c WHERE c.oid = 'public.praxis_fotos'::regclass;

-- Erwartet: 4 Policies (eigene_lesen/_anlegen/_loeschen, meisterin), alle nur für authenticated
SELECT policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'praxis_fotos' ORDER BY policyname;

-- Erwartet: 4 Policies praxis_fotos_storage_*, alle nur für authenticated
SELECT policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE 'praxis_fotos_storage_%'
ORDER BY policyname;

-- Erwartet: authenticated = DELETE, INSERT, SELECT; service_role alle; keine Zeile für anon
SELECT grantee, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS rechte
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'praxis_fotos'
  AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY grantee ORDER BY grantee;
