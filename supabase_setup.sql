-- ════════════════════════════════════════════════════════════
--  A Great Hair Day · Schnuppertag & Probezeit
--  Supabase SQL — einmal im SQL-Editor ausführen
-- ════════════════════════════════════════════════════════════

-- 1. Schnuppertage (Eignungstest-Ergebnisse)
CREATE TABLE IF NOT EXISTS schnuppertage (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  datum         date NOT NULL,
  punkte_gesamt integer DEFAULT 0,
  punkte_detail jsonb,          -- { mathe, aw, geschichte, geschicklichkeit, rollenspiel }
  entscheidung  text DEFAULT 'offen',  -- 'ja' | 'nein' | 'offen'
  werte         jsonb,          -- Schieberegler + offene Fragen
  erstellt_am   timestamptz DEFAULT now()
);

-- 2. Probezeiten (3-Monats-Pläne)
CREATE TABLE IF NOT EXISTS probezeiten (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name                text NOT NULL,
  beginn              date NOT NULL,
  ende                date,
  wochentag           text DEFAULT 'Donnerstag',
  status              text DEFAULT 'laufend',  -- 'laufend' | 'bestanden' | 'abgebrochen'
  entscheidung        text,       -- 'lehrvertrag' | 'verlaengern' | 'abbruch'
  notizen_abschluss   text,
  erstellt_am         timestamptz DEFAULT now()
);

-- 3. Wöchentliche Feedback-Einträge
CREATE TABLE IF NOT EXISTS probezeit_wochen (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  probezeit_id    uuid REFERENCES probezeiten(id) ON DELETE CASCADE,
  woche           integer NOT NULL,   -- 1–12
  monat           integer NOT NULL,   -- 1–3
  fachliches      integer DEFAULT 0,  -- 0–5
  teamverhalten   integer DEFAULT 0,
  kundenkontakt   integer DEFAULT 0,
  puenktlichkeit  integer DEFAULT 0,
  lernbereitschaft integer DEFAULT 0,
  notiz           text,
  erstellt_am     timestamptz DEFAULT now()
);

-- 4. Monats-Feedback (Ende Monat 1, 2, 3)
CREATE TABLE IF NOT EXISTS probezeit_monats_feedback (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  probezeit_id uuid REFERENCES probezeiten(id) ON DELETE CASCADE,
  monat        integer NOT NULL,   -- 1–3
  notiz        text,
  status       text,   -- 'weiter' | 'gespraech' | 'abbruch'
  erstellt_am  timestamptz DEFAULT now()
);

-- ════════════════════════════════════════════════════════════
--  Row Level Security (RLS) — nur Meisterin darf lesen/schreiben
-- ════════════════════════════════════════════════════════════

ALTER TABLE schnuppertage ENABLE ROW LEVEL SECURITY;
ALTER TABLE probezeiten ENABLE ROW LEVEL SECURITY;
ALTER TABLE probezeit_wochen ENABLE ROW LEVEL SECURITY;
ALTER TABLE probezeit_monats_feedback ENABLE ROW LEVEL SECURITY;

-- Einfachste Lösung: nur eingeloggte User (= Meisterin)
CREATE POLICY "nur_auth" ON schnuppertage FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "nur_auth" ON probezeiten FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "nur_auth" ON probezeit_wochen FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "nur_auth" ON probezeit_monats_feedback FOR ALL TO authenticated USING (true) WITH CHECK (true);
