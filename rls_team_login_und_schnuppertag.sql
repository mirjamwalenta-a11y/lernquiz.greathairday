-- ════════════════════════════════════════════════════════════
--  Lernquiz: Login auf gemeinsamen Team-Zugang umgestellt
--  + Schnuppertag-Tabellen auf "nur Inhaberin" verschärft
--
--  1) LOGIN
--  lernquiz.html meldet Personen jetzt über denselben Team-Login an wie
--  team.html / Mitarbeiterhandbuch_App.html / salon-checklist.html /
--  abwesenheiten.html (echte E-Mail + Passwort, teamapp_persons), statt über
--  einen eigenen Name+PIN-Login mit synthetischer E-Mail
--  (<name>.lernquiz@greathairday.at). Die Rolle aus teamapp_persons
--  entscheidet automatisch: 'inhaberin' → Meisterin-Ansicht, sonst → das
--  passende Profil in der bestehenden Tabelle `lehrlinge` (Zuordnung per
--  Namensabgleich, wie bereits in Abwesenheiten umgesetzt).
--
--  `lehrlinge`/`kompetenz`/`verlauf` sind in diesem Repo nicht als SQL
--  vorhanden (vermutlich per Dashboard angelegt) — ihre RLS bleibt hier
--  bewusst unangetastet, da sie laut Team weiterhin für alle Mitarbeiter:innen
--  gleichermaßen zugänglich sein sollen. Bitte bei Gelegenheit mit
--  Dashboard-Zugriff gegenprüfen, ob dort RLS überhaupt aktiv ist.
--
--  Die bisherige Konto-Erstellung für neue Lehrlinge (Meisterin-Bereich,
--  "+ Lehrling anlegen") wurde NICHT verändert — sie legt weiterhin einen
--  eigenen Auth-Account mit PIN an. Das ist unschädlich, aber überflüssig
--  geworden: Sobald eine Person bereits einen normalen Team-Login hat
--  (E-Mail/Passwort über team.html), reicht für den Lernquiz-Zugang ein
--  `lehrlinge`-Eintrag mit demselben Namen — kein zweiter Account nötig.
--  Das Aufräumen dieses Admin-Formulars ist bewusst nicht Teil dieser
--  Änderung (nicht angefragt).
--
--  2) SCHNUPPERTAG — bereits vorhandene RLS in supabase_setup.sql
--  ("nur_auth", FOR ALL TO authenticated USING (true)) erlaubte bisher jeder
--  angemeldeten Person Zugriff auf schnuppertage/probezeiten/-wochen/
--  -feedback — auch jedem Lehrling im selben Supabase-Projekt. Laut
--  Entscheidung "Schnuppertag ist nur für die Inhaberin" wird das jetzt auf
--  teamapp_ist_inhaberin() (aus der Team-Migration
--  20260912120000_rls_rollenbasiert_team_handbuch_checkliste.sql, gleiches
--  Projekt wrxlaltgtgkdomklgrlj) beschränkt.
--
--  VORAUSSETZUNG: teamapp_ist_inhaberin() muss bereits existieren (siehe
--  oben). Sicher mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "nur_auth" ON schnuppertage;
CREATE POLICY "nur_inhaberin" ON schnuppertage
  FOR ALL TO authenticated USING (public.teamapp_ist_inhaberin()) WITH CHECK (public.teamapp_ist_inhaberin());

DROP POLICY IF EXISTS "nur_auth" ON probezeiten;
CREATE POLICY "nur_inhaberin" ON probezeiten
  FOR ALL TO authenticated USING (public.teamapp_ist_inhaberin()) WITH CHECK (public.teamapp_ist_inhaberin());

DROP POLICY IF EXISTS "nur_auth" ON probezeit_wochen;
CREATE POLICY "nur_inhaberin" ON probezeit_wochen
  FOR ALL TO authenticated USING (public.teamapp_ist_inhaberin()) WITH CHECK (public.teamapp_ist_inhaberin());

DROP POLICY IF EXISTS "nur_auth" ON probezeit_monats_feedback;
CREATE POLICY "nur_inhaberin" ON probezeit_monats_feedback
  FOR ALL TO authenticated USING (public.teamapp_ist_inhaberin()) WITH CHECK (public.teamapp_ist_inhaberin());
