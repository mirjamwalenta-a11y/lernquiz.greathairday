-- ════════════════════════════════════════════════════════════════════════
-- RLS für Lernquiz, Lern-Tool, Schnuppertag und Probezeit
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Befund aus der Diagnose vom 2026-09-27: Auf diesen Tabellen lagen Policies
-- wie „Team liest/schreibt/ändert/löscht“, „eingeloggt_alles“ oder „Nur
-- eingeloggte User“ mit der Bedingung auth.role() = 'authenticated'. Da
-- Policies ODER-verknüpft sind, konnte damit JEDES angemeldete Konto (auch
-- Lehrlinge, Team- und Testkonten anderer Apps) alles lesen, ändern und
-- löschen. Einige Policies enthielten außerdem eine private E-Mail-Adresse
-- im Klartext (CLAUDE.md, Regel 2).
--
-- Neu (CLAUDE.md, Regel 3 – Rolle serverseitig über ist_meisterin()):
--   Meisterin          → alles
--   Lehrling           → nur eigene Zeilen (über lehrlinge.user_id = auth.uid())
--   Fragen/Lern-Tool   → lesen für Angemeldete, schreiben nur Meisterin
--   Schnuppertag/Probezeit → nur Meisterin
--   Wochenquiz-Link (ohne Login) → wie bisher: Fragen lesen, Ergebnis abgeben
--
-- Voraussetzung: 20260927_meisterin_rolle.sql (ist_meisterin()) ist gelaufen.
-- Alles in einer Transaktion: entweder alles oder nichts.
-- ════════════════════════════════════════════════════════════════════════

BEGIN;

-- ── Lernquiz / Lern-Tool: Fragen-Tabellen ───────────────────────────────
-- Lesen: alle Angemeldeten (Lehrlinge brauchen die Fragen). Schreiben: Meisterin.

DROP POLICY IF EXISTS "Fragen verwalten" ON public.fragen;
DROP POLICY IF EXISTS "Team liest"       ON public.fragen;
DROP POLICY IF EXISTS "Team löscht"      ON public.fragen;
DROP POLICY IF EXISTS "Team schreibt"    ON public.fragen;
DROP POLICY IF EXISTS "Team ändert"      ON public.fragen;
CREATE POLICY fragen_lesen     ON public.fragen FOR SELECT TO authenticated USING (true);
CREATE POLICY fragen_meisterin ON public.fragen FOR ALL    TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

DROP POLICY IF EXISTS "Team liest"    ON public.lerntool_daten;
DROP POLICY IF EXISTS "Team löscht"   ON public.lerntool_daten;
DROP POLICY IF EXISTS "Team schreibt" ON public.lerntool_daten;
DROP POLICY IF EXISTS "Team ändert"   ON public.lerntool_daten;
CREATE POLICY lerntool_daten_lesen     ON public.lerntool_daten FOR SELECT TO authenticated USING (true);
CREATE POLICY lerntool_daten_meisterin ON public.lerntool_daten FOR ALL    TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- ── Lehrlinge ───────────────────────────────────────────────────────────
-- Lehrling liest nur den eigenen Eintrag; anlegen/ändern/löschen: Meisterin
-- (Neuanlage läuft zusätzlich über die Edge Function mit Service-Role).

DROP POLICY IF EXISTS "Lehrlinge verwalten" ON public.lehrlinge;
DROP POLICY IF EXISTS "Team liest"          ON public.lehrlinge;
DROP POLICY IF EXISTS "Team löscht"         ON public.lehrlinge;
DROP POLICY IF EXISTS "Team schreibt"       ON public.lehrlinge;
DROP POLICY IF EXISTS "Team ändert"         ON public.lehrlinge;
CREATE POLICY lehrlinge_eigener  ON public.lehrlinge FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY lehrlinge_meisterin ON public.lehrlinge FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- ── Kompetenz: Lehrling liest/legt an/aktualisiert eigene Zeilen ────────

DROP POLICY IF EXISTS "Eigene Kompetenz" ON public.kompetenz;
DROP POLICY IF EXISTS "Team liest"       ON public.kompetenz;
DROP POLICY IF EXISTS "Team löscht"      ON public.kompetenz;
DROP POLICY IF EXISTS "Team schreibt"    ON public.kompetenz;
DROP POLICY IF EXISTS "Team ändert"      ON public.kompetenz;
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

DROP POLICY IF EXISTS "Eigener Verlauf"  ON public.verlauf;
DROP POLICY IF EXISTS "Team liest"       ON public.verlauf;
DROP POLICY IF EXISTS "Team löscht"      ON public.verlauf;
DROP POLICY IF EXISTS "Team schreibt"    ON public.verlauf;
DROP POLICY IF EXISTS "Team ändert"      ON public.verlauf;
DROP POLICY IF EXISTS "eingeloggt_alles" ON public.verlauf;
CREATE POLICY verlauf_eigener_lesen ON public.verlauf FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY verlauf_eigener_anlegen ON public.verlauf FOR INSERT TO authenticated
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY verlauf_meisterin ON public.verlauf FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- ── Abzeichen: Lehrling liest und speichert eigene Abzeichen ────────────

DROP POLICY IF EXISTS "Team liest"       ON public.lernquiz_abzeichen;
DROP POLICY IF EXISTS "Team löscht"      ON public.lernquiz_abzeichen;
DROP POLICY IF EXISTS "Team schreibt"    ON public.lernquiz_abzeichen;
DROP POLICY IF EXISTS "Team ändert"      ON public.lernquiz_abzeichen;
DROP POLICY IF EXISTS "eingeloggt_alles" ON public.lernquiz_abzeichen;
CREATE POLICY abzeichen_eigene_lesen ON public.lernquiz_abzeichen FOR SELECT TO authenticated
  USING (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY abzeichen_eigene_anlegen ON public.lernquiz_abzeichen FOR INSERT TO authenticated
  WITH CHECK (lehrling_id IN (SELECT l.id FROM public.lehrlinge l WHERE l.user_id = auth.uid()));
CREATE POLICY abzeichen_meisterin ON public.lernquiz_abzeichen FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- ── Schnuppertag + Probezeit: nur Meisterin ─────────────────────────────

DROP POLICY IF EXISTS "Nur eingeloggte User" ON public.schnuppertage;
CREATE POLICY schnuppertage_meisterin ON public.schnuppertage FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

DROP POLICY IF EXISTS "Nur eingeloggte User" ON public.probezeiten;
CREATE POLICY probezeiten_meisterin ON public.probezeiten FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

DROP POLICY IF EXISTS "Nur eingeloggte User" ON public.probezeit_wochen;
CREATE POLICY probezeit_wochen_meisterin ON public.probezeit_wochen FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

DROP POLICY IF EXISTS "Nur eingeloggte User" ON public.probezeit_monats_feedback;
CREATE POLICY probezeit_monats_feedback_meisterin ON public.probezeit_monats_feedback FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

DROP POLICY IF EXISTS "Meisterin Update Ziele"  ON public.probezeit_ziele;
DROP POLICY IF EXISTS "Meisterin liest Ziele"   ON public.probezeit_ziele;
DROP POLICY IF EXISTS "Meisterin schreibt Ziele" ON public.probezeit_ziele;
CREATE POLICY probezeit_ziele_meisterin ON public.probezeit_ziele FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- Wochenquiz: „Anon kann Quiz einreichen“ bleibt (Link ohne Login).
DROP POLICY IF EXISTS "Meisterin liest Quiz"    ON public.probezeit_quiz;
DROP POLICY IF EXISTS "Meisterin schreibt Quiz" ON public.probezeit_quiz;
CREATE POLICY probezeit_quiz_meisterin ON public.probezeit_quiz FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

-- Wochenquiz: „Anon liest Fragen“ bleibt (Link ohne Login).
DROP POLICY IF EXISTS "Meisterin liest individuelle Fragen"    ON public.probezeit_quiz_fragen;
DROP POLICY IF EXISTS "Meisterin schreibt individuelle Fragen" ON public.probezeit_quiz_fragen;
CREATE POLICY probezeit_quiz_fragen_meisterin ON public.probezeit_quiz_fragen FOR ALL TO authenticated
  USING (public.ist_meisterin()) WITH CHECK (public.ist_meisterin());

COMMIT;

-- ── Kontrolle: Regeln der betroffenen Tabellen ──────────────────────────
-- Es dürfen keine „Team …“, „eingeloggt_alles“, „Nur eingeloggte User“
-- und keine Regel mit E-Mail-Adresse mehr auftauchen.
SELECT tablename AS tabelle, string_agg(policyname, ', ' ORDER BY policyname) AS regeln
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('fragen','lerntool_daten','lehrlinge','kompetenz','verlauf','lernquiz_abzeichen',
                    'schnuppertage','probezeiten','probezeit_wochen','probezeit_monats_feedback',
                    'probezeit_ziele','probezeit_quiz','probezeit_quiz_fragen')
GROUP BY tablename ORDER BY tablename;
