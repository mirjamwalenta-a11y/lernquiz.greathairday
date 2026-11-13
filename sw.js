// Service Worker dieser App: macht sie offline nutzbar.
// Die eigentliche Logik (Dateien merken, Supabase-Daten merken, Änderungen
// ohne Netz in einer Warteschlange sammeln und nachschicken, Konfliktregel
// „nichts überschreiben“) steckt zentral in ghd-offline-sw.js im Repo
// abwesenheiten-ghd und gilt für alle Great-Hair-Day-Apps gleich.
// Neue Seiten/Dateien dieser App hier bei `vorab` ergänzen.
self.GHD_OFFLINE = {
  app: 'lernquiz',
  version: '2026-11-13e',
  start: './lerntool.html',
  vorab: [
    './',
    './lernquiz.html',
    './lerntool.html',
    './zwischenpruefung.html',
    './beratung-formwirkung.html',
    './englisch-salon.html',
    './meisterin.html',
    './schnittdesigner.html',
    './schnittwerkstatt.html',
    './schnuppertag.html',
    './werkzeugkunde.html',
    './farblabor.html',
    './spickzettel.html',
    './rechtliches.html',
    './farb-zeiten.js',
    './quiz-verlauf.js',
    './lern-leiste.js',
    './lern-themen.js',
    './woernis-tipps.js',
    './lern-stil.css',
    './fonts/poppins.css',
    './fonts/poppins/poppins-latin-400-italic.woff2',
    './fonts/poppins/poppins-latin-400-normal.woff2',
    './fonts/poppins/poppins-latin-500-normal.woff2',
    './fonts/poppins/poppins-latin-600-normal.woff2',
    './fonts/poppins/poppins-latin-700-normal.woff2',
    './fonts/poppins/poppins-latin-800-normal.woff2',
    './fonts/poppins/poppins-latin-ext-400-italic.woff2',
    './fonts/poppins/poppins-latin-ext-400-normal.woff2',
    './fonts/poppins/poppins-latin-ext-500-normal.woff2',
    './fonts/poppins/poppins-latin-ext-600-normal.woff2',
    './fonts/poppins/poppins-latin-ext-700-normal.woff2',
    './fonts/poppins/poppins-latin-ext-800-normal.woff2',
    './meisterin-rolle.js',
    './rechtliches-fuss.js',
    './manifest-lernquiz.json',
    './manifest-lerntool.json',
    './manifest-lernen.json',
    './customcolor_logo_customcolor_background.png',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
    'https://mirjamwalenta-a11y.github.io/abwesenheiten-ghd/icon-512.png'
  ]
};
importScripts('https://mirjamwalenta-a11y.github.io/abwesenheiten-ghd/ghd-offline-sw.js');
