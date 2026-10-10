-- ════════════════════════════════════════════════════════════════════════
-- RLS für Lernquiz, Lern-Tool, Schnuppertag und Probezeit – aktueller Stand
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj). Ersetzt 20260927_rls_lernquiz_schnuppertag.sql
-- (das nie ausgeführt wurde).
--
-- Befund aus der Abfrage vom 2026-10-10: Auf allen Lernquiz-Tabellen lagen
-- Regeln wie „Team liest/schreibt/ändert/löscht“, „eingeloggt_alles“ und
-- „Nur eingeloggte User“ (auth.role() = 'authenticated'). Da Regeln
-- ODER-verknüpft sind, konnte JEDES angemeldete Konto – auch Lehrlinge und
-- Konten anderer Apps – alles lesen, ändern und löschen. Mehrere Regeln
-- enthielten außerdem eine E-Mail-Adresse im Klartext (CLAUDE.md, Regel 2).
--
-- Neu (CLAUDE.md, Regel 3 – Rolle serverseitig über ist_meisterin()):
--   Meisterin          → alles
--   Lehrling           → nur eigene Zeilen (über lehrlinge.user_id = auth.uid())
--   Fragen/Lern-Tool   → lesen für Angemeldete, schreiben nur Meisterin
--   Lern-Serien (ghd_streaks), Schnuppertag, Probezeit → nur Meisterin
--   Wochenquiz-Link ohne Login → die vier „Anon …“-Regeln bleiben unverändert
--
-- Anders als der Entwurf vom September entfernt dieses Skript ALLE
-- bisherigen Regeln der Tabellen (außer den vier Anon-Regeln), nicht nur
-- die mit bekannten Namen – so bleibt keine alte offene Regel übrig.
--
-- Voraussetzung: 20260927_meisterin_rolle.sql (ist_meisterin()) ist gelaufen.
-- Alles in einer Transaktion: entweder alles oder nichts. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

DO $pruef$ BEGIN
  IF to_regprocedure('public.ist_meisterin()') IS NULL THEN
    RAISE EXCEPTION 'Abbruch: ist_meisterin() fehlt – zuerst 20260927_meisterin_rolle.sql ausführen.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.app_rollen WHERE rolle = 'meisterin') THEN
    RAISE EXCEPTION 'Abbruch: kein Meisterin-Konto in app_rollen – sonst käme niemand mehr an die Daten.';
  END IF;
END $pruef$;

-- ── Alle bisherigen Regeln entfernen (außer den Anon-Regeln für den Wochenquiz-Link) ──
DO $weg$
DECLARE r record;
BEGIN
  FOR r IN SELECT tablename, policyname FROM pg_policies
           WHERE schemaname = 'public'
             AND tablename IN ('fragen','lerntool_daten','lehrlinge','kompetenz','verlauf','lernquiz_abzeichen',
                               'ghd_streaks','schnuppertage','probezeiten','probezeit_wochen',
                               'probezeit_monats_feedback','probezeit_ziele','probezeit_quiz','probezeit_quiz_fragen')
             AND policyname NOT IN ('Anon kann Quiz einreichen', 'Anon liest Fragen', 'Anon liest Ziele', 'Anon liest Probezeit-ID')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $weg$;

-- ── Lernquiz / Lern-Tool: Fragen-Tabellen ───────────────────────────────
-- Lesen: alle Angemeldeten (Lehrlinge brauchen die Fragen). Schreiben: Meisterin.

CREATE POLICY fragen_lesen     ON public.fragen FOR SELECT TO authenticated USING (true);
CREATE POLICY fragen_meisterin ON public.fragen FOR ALL    TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

CREATE POLICY lerntool_daten_lesen     ON public.lerntool_daten FOR SELECT TO authenticated USING (true);
CREATE POLICY lerntool_daten_meisterin ON public.lerntool_daten FOR ALL    TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- ── Lehrlinge ───────────────────────────────────────────────────────────
-- Lehrling liest nur den eigenen Eintrag; anlegen/ändern/löschen: Meisterin
-- (Neuanlage im Lernquiz: direkt mit dem Token der Meisterin).

CREATE POLICY lehrlinge_eigener  ON public.lehrlinge FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY lehrlinge_meisterin ON public.lehrlinge FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- ── Kompetenz: Lehrling liest/legt an/aktualisiert eigene Zeilen ────────

CREATE POLICY kompetenz_eigene_lesen ON public.kompetenz FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY kompetenz_eigene_anlegen ON public.kompetenz FOR INSERT TO authenticated
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY kompetenz_eigene_aendern ON public.kompetenz FOR UPDATE TO authenticated
  USING      (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()))
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY kompetenz_meisterin ON public.kompetenz FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- ── Verlauf: Lehrling liest und speichert eigene Quiz-Ergebnisse ────────

CREATE POLICY verlauf_eigener_lesen ON public.verlauf FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY verlauf_eigener_anlegen ON public.verlauf FOR INSERT TO authenticated
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY verlauf_meisterin ON public.verlauf FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- ── Abzeichen: Lehrling liest und speichert eigene Abzeichen ────────────

CREATE POLICY abzeichen_eigene_lesen ON public.lernquiz_abzeichen FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY abzeichen_eigene_anlegen ON public.lernquiz_abzeichen FOR INSERT TO authenticated
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY abzeichen_meisterin ON public.lernquiz_abzeichen FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- ── Schnuppertag + Probezeit: nur Meisterin ─────────────────────────────

CREATE POLICY schnuppertage_meisterin ON public.schnuppertage FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

CREATE POLICY probezeiten_meisterin ON public.probezeiten FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

CREATE POLICY probezeit_wochen_meisterin ON public.probezeit_wochen FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

CREATE POLICY probezeit_monats_feedback_meisterin ON public.probezeit_monats_feedback FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

CREATE POLICY probezeit_ziele_meisterin ON public.probezeit_ziele FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- Wochenquiz: „Anon kann Quiz einreichen“ bleibt (Link ohne Login).
CREATE POLICY probezeit_quiz_meisterin ON public.probezeit_quiz FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- Wochenquiz: „Anon liest Fragen“ bleibt (Link ohne Login).
CREATE POLICY probezeit_quiz_fragen_meisterin ON public.probezeit_quiz_fragen FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- ── Lern-Serien der Meisterin (meisterin.html) ──────────────────────────
CREATE POLICY ghd_streaks_meisterin ON public.ghd_streaks FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

COMMIT;

-- ── Kontrolle: Regeln der betroffenen Tabellen ──────────────────────────
-- Erwartet: keine „Team …“, „eingeloggt_alles“, „Nur eingeloggte User“ und
-- keine Regel mit E-Mail-Adresse mehr; offene_regeln = 0.
SELECT
  (SELECT count(*) FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('fragen','lerntool_daten','lehrlinge','kompetenz','verlauf','lernquiz_abzeichen',
                        'ghd_streaks','schnuppertage','probezeiten','probezeit_wochen',
                        'probezeit_monats_feedback','probezeit_ziele','probezeit_quiz','probezeit_quiz_fragen')
      AND (coalesce(qual, '') || coalesce(with_check, '')) ~ '(auth\.role\(\)|auth\.email\(\)|@)')  AS offene_regeln,
  (SELECT count(*) FROM pg_policies WHERE schemaname = 'public' AND policyname LIKE '%meisterin')   AS meisterin_regeln,
  (SELECT count(*) FROM pg_policies WHERE schemaname = 'public' AND policyname LIKE 'Anon %')        AS anon_regeln_wochenquiz;
