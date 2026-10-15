-- ════════════════════════════════════════════════════════════════════════
-- Schnuppertag-Test ohne Login abschicken (Bewerber-Link ?modus=lehrling)
-- Supabase-Projekt wrxlaltgtgkdomklgrlj. Voraussetzung: 20261010_rls_lernquiz_aktuell.sql
--
-- Befund 2026-10-15: Seit 20261010 darf auf public.schnuppertage nur noch die
-- Meisterin schreiben (schnuppertage_meisterin). Bewerber:innen haben keinen
-- Login → „Test abschicken“ scheiterte mit „new row violates row-level
-- security policy“. Der Test ließ sich nicht speichern.
--
-- Lösung (wie ghd_ereignis_melden_oeffentlich): eine eng begrenzte
-- SECURITY DEFINER-Funktion. Sie kann NUR eine neue Zeile anlegen, nichts
-- lesen, ändern oder löschen. Entscheidung ist immer „offen“, Praktik-Punkte
-- immer 0, Datum immer heute; Texte werden gekürzt, Schieberegler auf 1–5
-- begrenzt. Gegen Massen-Einträge: höchstens 30 Bewerber-Tests pro Stunde.
-- Es wird KEINE anon-Regel auf der Tabelle angelegt (CLAUDE.md, Regel 1).
-- Mehrfach ausführbar.
-- ════════════════════════════════════════════════════════════════════════

create or replace function public.schnuppertag_test_einreichen(
  p_name   text,
  p_wissen integer,
  p_werte  jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name   text := left(nullif(trim(p_name), ''), 120);
  v_wissen integer := greatest(0, least(coalesce(p_wissen, 0), 100));
  v_werte  jsonb := '{}'::jsonb;
  v_key    text;
  v_zahl   integer;
begin
  if v_name is null then
    raise exception 'Name fehlt';
  end if;

  if (select count(*) from public.schnuppertage
       where erstellt_am > now() - interval '1 hour'
         and werte ->> 'abgeschickt_von_lehrling' = 'true') >= 30 then
    raise exception 'Zu viele Einsendungen – bitte später nochmal versuchen';
  end if;

  -- Schieberegler: nur bekannte Felder, Wert 1–5
  foreach v_key in array array['freundlichkeit','team','wissensdurst','freude','puenktlichkeit','kritik'] loop
    begin
      v_zahl := (p_werte ->> v_key)::integer;
    exception when others then
      v_zahl := null;
    end;
    v_werte := v_werte || jsonb_build_object(v_key, greatest(1, least(coalesce(v_zahl, 3), 5)));
  end loop;

  -- Offene Fragen: nur bekannte Felder, gekürzt
  foreach v_key in array array['oq1','oq2','oq3','oq4','oq5'] loop
    v_werte := v_werte || jsonb_build_object(v_key, left(coalesce(p_werte ->> v_key, ''), 2000));
  end loop;

  v_werte := v_werte || jsonb_build_object('notizen', '', 'abgeschickt_von_lehrling', true);

  insert into public.schnuppertage (name, datum, punkte_gesamt, punkte_detail, entscheidung, werte)
  values (
    v_name,
    current_date,
    v_wissen,
    jsonb_build_object('wissen', v_wissen, 'praktik', 0, 'geschicklichkeit', 0, 'rollenspiel', 0,
                       'hinweis', 'Praktik noch nicht bewertet'),
    'offen',
    v_werte
  );
end;
$$;

revoke all on function public.schnuppertag_test_einreichen(text, integer, jsonb) from public;
grant execute on function public.schnuppertag_test_einreichen(text, integer, jsonb) to anon, authenticated;
