-- ════════════════════════════════════════════════════════════════════════
-- Fehlerbibliothek „Aus Fehlern lernen“: Lernfälle aus echten Situationen
-- im Salon, ohne Namen, von der Meisterin geschrieben und freigegeben.
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- public.lernfaelle         – der Fall (nur Lerninhalt, keine Personendaten):
--                             Kompetenz, Titel, Situation, Frage, Antworten,
--                             Erklärung, freigegeben, einwilligung_ok
-- public.lernfaelle_quelle  – woher der Fall stammt (optional): Lehrling,
--                             Praxis-Eintrag, Einwilligung offen/ja/nein.
--                             Getrennte Tabelle, damit andere Lehrlinge nie
--                             sehen können, wessen Fehler es war.
--
-- Entscheidungen der Inhaberin (2026-11-19):
--   - Fälle legt nur die Meisterin an (Text umformuliert, ohne Namen).
--   - Vorerst nur Text, keine Fotos.
--   - Sichtbar für Lehrlinge erst, wenn die Meisterin freigegeben hat.
--   - Stammt der Fall aus der Praxis eines Lehrlings, muss dieser Lehrling
--     zustimmen (wie bei den Zitaten). Ohne Zustimmung bleibt der Fall
--     unsichtbar. Die Zustimmung kann er jederzeit zurücknehmen.
--
-- Rechte (CLAUDE.md Regeln 1 und 3 – Rolle serverseitig über ist_meisterin()):
--   lernfaelle         Meisterin → alles
--                      Lehrling  → lesen, wenn freigegeben UND einwilligung_ok;
--                                  dazu die Fälle, die aus der eigenen Praxis
--                                  stammen (um zuzustimmen) · nie schreiben
--                      andere Konten im Projekt (z. B. Team-App) → nichts,
--                      weil die Policy ein Lehrlingskonto verlangt
--                      anon → nichts (kein Grant, keine Policy)
--   lernfaelle_quelle  Meisterin → alles · Lehrling → nur eigene Zeilen lesen
--                      · anon → nichts
--   Zustimmen/zurücknehmen nur über lernfall_einwilligung() (SECURITY
--   DEFINER, prüft selbst, dass der Aufrufer der Lehrling der Quelle ist).
--   Ein Trigger setzt einwilligung_ok = false, sobald eine Quelle angelegt
--   wird – auch wenn die Meisterin es im Browser anders schickt.
--
-- Voraussetzung: 20260927_meisterin_rolle.sql (ist_meisterin()) und
-- 20261107_praxis_eintraege.sql. Alles in einer Transaktion. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

DO $pruef$ BEGIN
  IF to_regprocedure('public.ist_meisterin()') IS NULL THEN
    RAISE EXCEPTION 'Abbruch: ist_meisterin() fehlt – zuerst 20260927_meisterin_rolle.sql ausführen.';
  END IF;
END $pruef$;

CREATE TABLE IF NOT EXISTS public.lernfaelle (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kompetenz       text NOT NULL CHECK (kompetenz ~ '^[a-z]{2,30}$'),          -- id aus kompetenzen.js
  titel           text NOT NULL CHECK (char_length(titel) BETWEEN 1 AND 120),
  situation       text NOT NULL CHECK (char_length(situation) BETWEEN 1 AND 800),
  frage           text NOT NULL CHECK (char_length(frage) BETWEEN 1 AND 300),
  -- [{"t": "Antwort", "richtig": true, "feedback": "…"}], 2–4 Antworten, genau eine richtig (prüft die App)
  optionen        jsonb NOT NULL CHECK (jsonb_typeof(optionen) = 'array' AND jsonb_array_length(optionen) BETWEEN 2 AND 4),
  erklaerung      text NOT NULL CHECK (char_length(erklaerung) BETWEEN 1 AND 800),
  freigegeben     boolean NOT NULL DEFAULT false,
  einwilligung_ok boolean NOT NULL DEFAULT true,   -- false, solange eine Quelle ohne Zustimmung existiert
  erstellt_am     timestamptz NOT NULL DEFAULT now(),
  geaendert_am    timestamptz NOT NULL DEFAULT now()
);

-- RLS im selben Schritt wie die Tabelle
ALTER TABLE public.lernfaelle ENABLE ROW LEVEL SECURITY;

-- lehrling_id bekommt denselben Typ wie lehrlinge.id (uuid oder bigint)
DO $anlegen$
DECLARE typ text;
BEGIN
  SELECT format_type(a.atttypid, a.atttypmod) INTO typ
  FROM pg_attribute a
  WHERE a.attrelid = 'public.lehrlinge'::regclass AND a.attname = 'id' AND NOT a.attisdropped;

  EXECUTE format($t$
    CREATE TABLE IF NOT EXISTS public.lernfaelle_quelle (
      fall_id         uuid PRIMARY KEY REFERENCES public.lernfaelle(id) ON DELETE CASCADE,
      lehrling_id     %s NOT NULL REFERENCES public.lehrlinge(id) ON DELETE CASCADE,
      praxis_id       uuid REFERENCES public.praxis_eintraege(id) ON DELETE SET NULL,
      einwilligung    text NOT NULL DEFAULT 'offen' CHECK (einwilligung IN ('offen', 'ja', 'nein')),
      beantwortet_am  timestamptz,
      erstellt_am     timestamptz NOT NULL DEFAULT now()
    )$t$, typ);
END $anlegen$;

ALTER TABLE public.lernfaelle_quelle ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS lernfaelle_quelle_lehrling_idx ON public.lernfaelle_quelle (lehrling_id);

-- Grants: nur was die App braucht. Kein Recht für anon.
REVOKE ALL ON public.lernfaelle, public.lernfaelle_quelle FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lernfaelle        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lernfaelle_quelle TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lernfaelle        TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lernfaelle_quelle TO service_role;

-- ── Policies ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS lernfaelle_meisterin       ON public.lernfaelle;
DROP POLICY IF EXISTS lernfaelle_lehrling_lesen  ON public.lernfaelle;
CREATE POLICY lernfaelle_meisterin ON public.lernfaelle FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());
-- Lehrling: freigegebene Fälle mit Zustimmung, dazu Fälle aus der eigenen Praxis
CREATE POLICY lernfaelle_lehrling_lesen ON public.lernfaelle FOR SELECT TO authenticated
  USING (
    (freigegeben AND einwilligung_ok
      AND EXISTS (SELECT 1 FROM public.lehrlinge l WHERE l.user_id = auth.uid()))
    OR id IN (SELECT q.fall_id FROM public.lernfaelle_quelle q
              WHERE q.lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()))
  );

DROP POLICY IF EXISTS lernfaelle_quelle_meisterin     ON public.lernfaelle_quelle;
DROP POLICY IF EXISTS lernfaelle_quelle_eigene_lesen  ON public.lernfaelle_quelle;
CREATE POLICY lernfaelle_quelle_meisterin ON public.lernfaelle_quelle FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());
CREATE POLICY lernfaelle_quelle_eigene_lesen ON public.lernfaelle_quelle FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));

-- ── Neue Quelle: Fall erst nach Zustimmung sichtbar ─────────────────────
-- Läuft als Tabellenbesitzer, damit es nicht vom Browser abhängt.
CREATE OR REPLACE FUNCTION public.lernfaelle_quelle_neu()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
BEGIN
  NEW.einwilligung := 'offen';
  NEW.beantwortet_am := NULL;
  PERFORM set_config('lernfall.intern', 'ja', true);
  UPDATE public.lernfaelle SET einwilligung_ok = false WHERE id = NEW.fall_id;
  PERFORM set_config('lernfall.intern', '', true);
  RETURN NEW;
END $f$;
REVOKE ALL ON FUNCTION public.lernfaelle_quelle_neu() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS lernfaelle_quelle_neu ON public.lernfaelle_quelle;
CREATE TRIGGER lernfaelle_quelle_neu BEFORE INSERT ON public.lernfaelle_quelle
  FOR EACH ROW EXECUTE FUNCTION public.lernfaelle_quelle_neu();

-- Ändert die Meisterin die Einwilligung direkt, zieht einwilligung_ok mit
-- (sie kann damit nur sperren oder eine echte Zustimmung bestehen lassen,
-- „ja“ setzt nur der Lehrling über lernfall_einwilligung()).
CREATE OR REPLACE FUNCTION public.lernfaelle_quelle_geaendert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
BEGIN
  IF NEW.einwilligung = 'ja' AND OLD.einwilligung <> 'ja'
     AND current_setting('lernfall.einwilligung_durch_lehrling', true) IS DISTINCT FROM 'ja' THEN
    RAISE EXCEPTION 'Zustimmen kann nur der Lehrling selbst.';
  END IF;
  PERFORM set_config('lernfall.intern', 'ja', true);
  UPDATE public.lernfaelle SET einwilligung_ok = (NEW.einwilligung = 'ja') WHERE id = NEW.fall_id;
  PERFORM set_config('lernfall.intern', '', true);
  RETURN NEW;
END $f$;
REVOKE ALL ON FUNCTION public.lernfaelle_quelle_geaendert() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS lernfaelle_quelle_geaendert ON public.lernfaelle_quelle;
CREATE TRIGGER lernfaelle_quelle_geaendert BEFORE UPDATE ON public.lernfaelle_quelle
  FOR EACH ROW EXECUTE FUNCTION public.lernfaelle_quelle_geaendert();

-- Quelle gelöscht (z. B. Lehrling gelöscht): bisherige Zustimmung bleibt, offene/abgelehnte sperren weiter
CREATE OR REPLACE FUNCTION public.lernfaelle_quelle_weg()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
BEGIN
  PERFORM set_config('lernfall.intern', 'ja', true);
  UPDATE public.lernfaelle SET einwilligung_ok = (OLD.einwilligung = 'ja') WHERE id = OLD.fall_id;
  PERFORM set_config('lernfall.intern', '', true);
  RETURN OLD;
END $f$;
REVOKE ALL ON FUNCTION public.lernfaelle_quelle_weg() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS lernfaelle_quelle_weg ON public.lernfaelle_quelle;
CREATE TRIGGER lernfaelle_quelle_weg AFTER DELETE ON public.lernfaelle_quelle
  FOR EACH ROW EXECUTE FUNCTION public.lernfaelle_quelle_weg();

-- ── Zustimmen oder zurücknehmen (nur der Lehrling der Quelle) ───────────
CREATE OR REPLACE FUNCTION public.lernfall_einwilligung(p_fall uuid, p_ja boolean)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE n integer;
BEGIN
  PERFORM set_config('lernfall.einwilligung_durch_lehrling', 'ja', true);
  UPDATE public.lernfaelle_quelle q
     SET einwilligung = CASE WHEN p_ja THEN 'ja' ELSE 'nein' END,
         beantwortet_am = now()
   WHERE q.fall_id = p_fall
     AND q.lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid());
  GET DIAGNOSTICS n = ROW_COUNT;
  PERFORM set_config('lernfall.einwilligung_durch_lehrling', '', true);
  IF n = 0 THEN RAISE EXCEPTION 'Kein Lernfall aus deiner Praxis.'; END IF;
  RETURN CASE WHEN p_ja THEN 'ja' ELSE 'nein' END;
END $f$;
REVOKE ALL ON FUNCTION public.lernfall_einwilligung(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.lernfall_einwilligung(uuid, boolean) TO authenticated;

-- einwilligung_ok setzen nur die Trigger oben (nie der Browser, auch nicht die
-- Meisterin): neuer Fall startet mit true (noch keine Quelle), danach bleibt der
-- Wert, außer eine Quelle wird angelegt, beantwortet oder gelöscht.
-- Dazu geaendert_am pflegen.
CREATE OR REPLACE FUNCTION public.lernfaelle_schutz()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $f$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.einwilligung_ok := true;
  ELSE
    IF current_setting('lernfall.intern', true) IS DISTINCT FROM 'ja' THEN
      NEW.einwilligung_ok := OLD.einwilligung_ok;
    END IF;
    NEW.geaendert_am := now();
  END IF;
  RETURN NEW;
END $f$;
DROP TRIGGER IF EXISTS lernfaelle_geaendert_am ON public.lernfaelle;
DROP TRIGGER IF EXISTS lernfaelle_schutz ON public.lernfaelle;
REVOKE ALL ON FUNCTION public.lernfaelle_schutz() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER lernfaelle_schutz BEFORE INSERT OR UPDATE ON public.lernfaelle
  FOR EACH ROW EXECUTE FUNCTION public.lernfaelle_schutz();

COMMIT;

-- ── Kontrolle ───────────────────────────────────────────────────────────
-- Erwartet: beide rls_an = true
SELECT relname, relrowsecurity AS rls_an FROM pg_class
WHERE oid IN ('public.lernfaelle'::regclass, 'public.lernfaelle_quelle'::regclass);

-- Erwartet: je Tabelle authenticated und service_role (DELETE, INSERT, SELECT, UPDATE), keine Zeile für anon
SELECT table_name, grantee, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS rechte
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name IN ('lernfaelle', 'lernfaelle_quelle')
  AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY table_name, grantee ORDER BY table_name, grantee;

-- Erwartet: lernfaelle_meisterin, lernfaelle_lehrling_lesen, lernfaelle_quelle_meisterin, lernfaelle_quelle_eigene_lesen
SELECT tablename, policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('lernfaelle', 'lernfaelle_quelle') ORDER BY 1, 2;

-- Erwartet: lernfall_einwilligung mit authenticated=X (ausführen), ohne anon und ohne „=X/“ für alle;
-- die Trigger-Funktionen nur für den Besitzer (postgres) und service_role
SELECT p.proname, p.proacl FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname LIKE 'lernf%' ORDER BY 1;
