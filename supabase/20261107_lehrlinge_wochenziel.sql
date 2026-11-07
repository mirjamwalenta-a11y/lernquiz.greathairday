-- ════════════════════════════════════════════════════════════════════════
-- Lehrlinge: einstellbares Wochenziel
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Neue Spalte in public.lehrlinge:
--   wochenziel   Lerneinheiten pro Woche (1 bis 7), Standard 3.
--                Eine Lerneinheit = ein abgeschlossenes Quiz (ein Eintrag in
--                public.verlauf: Lernquiz, Themen-Quiz, Praxis-Quizze).
--
-- Keine neue Tabelle und keine neue Regel: Die bestehenden RLS-Regeln aus
-- 20261010_rls_lernquiz_aktuell.sql gelten zeilenweise auch für die neue
-- Spalte:
--   lehrlinge_eigener   → Lehrling darf die eigene Zeile nur LESEN
--                         (kann sein Wochenziel also nicht selbst ändern)
--   lehrlinge_meisterin → Meisterin (ist_meisterin()) darf alles
--   anon                → nichts
-- Die bestehenden Tabellenrechte (GRANT auf public.lehrlinge) gelten auch
-- für neu hinzugefügte Spalten – es sind keine zusätzlichen GRANTs nötig.
-- (Falls im Projekt jemals Spaltenrechte für lehrlinge vergeben wurden, zeigt
-- die Kontrolle unten das: dann bitte melden statt raten.)
--
-- Der Code (lerntool.html, lernquiz.html) funktioniert auch ohne diese
-- Spalte und rechnet dann mit 3. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE public.lehrlinge
  ADD COLUMN IF NOT EXISTS wochenziel smallint NOT NULL DEFAULT 3;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'lehrlinge_wochenziel_bereich'
      AND conrelid = 'public.lehrlinge'::regclass
  ) THEN
    ALTER TABLE public.lehrlinge
      ADD CONSTRAINT lehrlinge_wochenziel_bereich CHECK (wochenziel BETWEEN 1 AND 7);
  END IF;
END $$;

-- Kontrolle 1: Es muss 1 Zeile kommen (smallint, Standard 3).
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'lehrlinge' AND column_name = 'wochenziel';

-- Kontrolle 2: RLS ist an (relrowsecurity = true).
SELECT relname, relrowsecurity FROM pg_class WHERE oid = 'public.lehrlinge'::regclass;

-- Kontrolle 3: Policies auf lehrlinge – erwartet genau diese zwei:
--   lehrlinge_eigener (SELECT) und lehrlinge_meisterin (ALL).
-- Keine Policy für anon, keine UPDATE-Policy für Lehrlinge.
SELECT policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'lehrlinge';
