-- ════════════════════════════════════════════════════════════════════════
-- Lehrlinge: Lehrbeginn (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Neue Spalte public.lehrlinge.lehrbeginn (Datum, optional). Damit zählt im
-- Praxis-Auszug „Aktuelles Lehrjahr“ ab dem echten Lehrbeginn statt ab 1.9.
--
-- Keine neue Tabelle und keine neue Regel: Die bestehenden RLS-Regeln aus
-- 20261010_rls_lernquiz_aktuell.sql gelten auch für die neue Spalte:
--   lehrlinge_eigener   → Lehrling darf die eigene Zeile nur LESEN
--   lehrlinge_meisterin → nur die Meisterin (ist_meisterin()) darf ändern
--   anon                → nichts
-- Tabellenrechte gelten auch für neue Spalten – keine zusätzlichen GRANTs.
-- Der Code funktioniert auch ohne diese Spalte (dann ab 1.9.). Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE public.lehrlinge
  ADD COLUMN IF NOT EXISTS lehrbeginn date;

-- Kontrolle: erwartet 1 Zeile (lehrbeginn, date)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'lehrlinge' AND column_name = 'lehrbeginn';
