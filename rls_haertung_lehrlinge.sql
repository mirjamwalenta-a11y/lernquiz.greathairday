-- ════════════════════════════════════════════════════════════
--  A Great Hair Day · Lernquiz
--  RLS-Härtung: lehrlinge, fragen, verlauf, kompetenz
--  Im Supabase SQL-Editor ausführen. Sicher mehrfach ausführbar
--  (DROP POLICY IF EXISTS vor jedem CREATE POLICY).
-- ════════════════════════════════════════════════════════════

-- ── lehrlinge ──────────────────────────────────────────────────
-- Fachlich: jede/r Lehrling sieht/ändert nur die eigene Zeile (user_id = auth.uid()),
-- Anlegen/Ändern/Löschen fremder Zeilen sowie Aktiv/Inaktiv-Schalten ist Meisterin-Sache.
-- Das eigentliche Anlegen läuft über die rapid-function (Service-Role, umgeht RLS ohnehin) —
-- die INSERT-Policy hier ist nur ein zusätzlicher Riegel gegen direkte REST-Inserts.
ALTER TABLE lehrlinge ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lehrlinge_select" ON lehrlinge;
CREATE POLICY "lehrlinge_select" ON lehrlinge FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com');

DROP POLICY IF EXISTS "lehrlinge_insert" ON lehrlinge;
CREATE POLICY "lehrlinge_insert" ON lehrlinge FOR INSERT TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com');

DROP POLICY IF EXISTS "lehrlinge_update" ON lehrlinge;
CREATE POLICY "lehrlinge_update" ON lehrlinge FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com');

DROP POLICY IF EXISTS "lehrlinge_delete" ON lehrlinge;
CREATE POLICY "lehrlinge_delete" ON lehrlinge FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com');

-- ── fragen ─────────────────────────────────────────────────────
-- Fachlich: Fragebank lesen dürfen alle eingeloggten Lehrlinge (zum Quiz-Spielen),
-- bearbeiten/anlegen/löschen darf nur die Meisterin (im JS bereits so erzwungen,
-- hier zusätzlich auf Datenebene).
ALTER TABLE fragen ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fragen_select" ON fragen;
CREATE POLICY "fragen_select" ON fragen FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "fragen_insert" ON fragen;
CREATE POLICY "fragen_insert" ON fragen FOR INSERT TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com');

DROP POLICY IF EXISTS "fragen_update" ON fragen;
CREATE POLICY "fragen_update" ON fragen FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com');

DROP POLICY IF EXISTS "fragen_delete" ON fragen;
CREATE POLICY "fragen_delete" ON fragen FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com');

-- ── verlauf ────────────────────────────────────────────────────
-- Fachlich: jede/r Lehrling sieht/schreibt nur den eigenen Quiz-Verlauf
-- (lehrling_id gehört zur eigenen lehrlinge-Zeile), Meisterin sieht/löscht alles
-- (Löschen wird für die Lehrling-Löschen-Kaskade gebraucht).
ALTER TABLE verlauf ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "verlauf_select" ON verlauf;
CREATE POLICY "verlauf_select" ON verlauf FOR SELECT TO authenticated
  USING (
    lehrling_id IN (SELECT id FROM lehrlinge WHERE user_id = auth.uid())
    OR auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com'
  );

DROP POLICY IF EXISTS "verlauf_insert" ON verlauf;
CREATE POLICY "verlauf_insert" ON verlauf FOR INSERT TO authenticated
  WITH CHECK (
    lehrling_id IN (SELECT id FROM lehrlinge WHERE user_id = auth.uid())
    OR auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com'
  );

DROP POLICY IF EXISTS "verlauf_update" ON verlauf;
CREATE POLICY "verlauf_update" ON verlauf FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com');

DROP POLICY IF EXISTS "verlauf_delete" ON verlauf;
CREATE POLICY "verlauf_delete" ON verlauf FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com');

-- ── kompetenz ──────────────────────────────────────────────────
-- Fachlich: identisch zu verlauf — eigene Kompetenzwerte lesen/schreiben,
-- Meisterin sieht/löscht alles (Löschen für Lehrling-Löschen-Kaskade).
ALTER TABLE kompetenz ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kompetenz_select" ON kompetenz;
CREATE POLICY "kompetenz_select" ON kompetenz FOR SELECT TO authenticated
  USING (
    lehrling_id IN (SELECT id FROM lehrlinge WHERE user_id = auth.uid())
    OR auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com'
  );

DROP POLICY IF EXISTS "kompetenz_insert" ON kompetenz;
CREATE POLICY "kompetenz_insert" ON kompetenz FOR INSERT TO authenticated
  WITH CHECK (
    lehrling_id IN (SELECT id FROM lehrlinge WHERE user_id = auth.uid())
    OR auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com'
  );

DROP POLICY IF EXISTS "kompetenz_update" ON kompetenz;
CREATE POLICY "kompetenz_update" ON kompetenz FOR UPDATE TO authenticated
  USING (
    lehrling_id IN (SELECT id FROM lehrlinge WHERE user_id = auth.uid())
    OR auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com'
  )
  WITH CHECK (
    lehrling_id IN (SELECT id FROM lehrlinge WHERE user_id = auth.uid())
    OR auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com'
  );

DROP POLICY IF EXISTS "kompetenz_delete" ON kompetenz;
CREATE POLICY "kompetenz_delete" ON kompetenz FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'email' = 'mirjam.walenta@gmail.com');
