-- ════════════════════════════════════════════════════════════════════════
-- Kompetenz: „sitzt erst nach ein paar Tagen“ und „Wie sicher bist du?“
-- (Supabase-Projekt wrxlaltgtgkdomklgrlj)
--
-- Neue Spalten in public.kompetenz (eine Zeile pro Lehrling und Thema):
--   gut_seit       erster Tag der aktuellen Serie guter Runden
--   gut_am         Tag der letzten guten Runde
--                  → „sitzt“ erst, wenn gut_am mindestens 3 Tage nach gut_seit liegt;
--                    eine schwache Runde setzt beide auf NULL
--   geraten        wie oft eine MC-Frage richtig, aber „geraten“ beantwortet wurde
--   sicher_falsch  wie oft eine MC-Frage „sicher“, aber falsch beantwortet wurde
--
-- Keine neue Tabelle und keine neue Regel: Die bestehenden RLS-Regeln aus
-- 20261010_rls_lernquiz_aktuell.sql (Lehrling nur eigene Zeilen, Meisterin
-- alles) gelten zeilenweise und damit auch für die neuen Spalten. Die
-- bestehenden Tabellenrechte (GRANT auf public.kompetenz) gelten ebenfalls
-- für neu hinzugefügte Spalten – es sind keine zusätzlichen GRANTs nötig.
--
-- Der Code im Lernquiz und in quiz-verlauf.js funktioniert auch ohne diese
-- Spalten (speichert dann ohne sie); erst nach dem Ausführen greifen die
-- neuen Regeln. Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE public.kompetenz
  ADD COLUMN IF NOT EXISTS gut_seit      date,
  ADD COLUMN IF NOT EXISTS gut_am        date,
  ADD COLUMN IF NOT EXISTS geraten       integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sicher_falsch integer NOT NULL DEFAULT 0;

-- Kontrolle: Es müssen 4 Zeilen kommen.
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'kompetenz'
  AND column_name IN ('gut_seit', 'gut_am', 'geraten', 'sicher_falsch');
