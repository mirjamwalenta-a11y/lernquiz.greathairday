-- ════════════════════════════════════════════════════════════════════════
-- Lehrlinge: „Nur zum Testen“ (z. B. Stylist:innen, die die App ausprobieren)
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Neue Spalte in public.lehrlinge:
--   nur_test   true  = Testzugang (erscheint im Meisterin-Bereich unten in der
--                      eingeklappten Gruppe „Zum Testen“, ohne Prüfhinweise)
--              false = echter Lehrling (Standard, steht oben)
--
-- Keine neue Tabelle und keine neue Regel: Die bestehenden RLS-Regeln aus
-- 20261010_rls_lernquiz_aktuell.sql gelten auch für die neue Spalte:
--   lehrlinge_eigener   → Lehrling darf die eigene Zeile nur LESEN
--   lehrlinge_meisterin → nur die Meisterin (ist_meisterin()) darf ändern
--   anon                → nichts
-- Die bestehenden Tabellenrechte gelten auch für neu hinzugefügte Spalten –
-- es sind keine zusätzlichen GRANTs nötig.
--
-- Der Code (lernquiz.html) funktioniert auch ohne diese Spalte und zeigt dann
-- alle wie bisher als Lehrlinge. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE public.lehrlinge
  ADD COLUMN IF NOT EXISTS nur_test boolean NOT NULL DEFAULT false;

-- Kontrolle 1: Es muss 1 Zeile kommen (boolean, Standard false).
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'lehrlinge' AND column_name = 'nur_test';

-- Kontrolle 2: Policies – erwartet unverändert genau diese zwei:
--   lehrlinge_eigener (SELECT) und lehrlinge_meisterin (ALL).
SELECT policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'lehrlinge';
