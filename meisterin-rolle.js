// Meisterinnen-Rolle prüfen – auch ohne Netz.
// Die Rolle wird IMMER am Server geprüft (RPC ist_meisterin). Ist kein Netz da,
// gilt die zuletzt am Server bestätigte Rolle DIESES Kontos (gemerkt mit der
// Nutzer-ID). Das steuert nur, welcher Bildschirm angezeigt wird: Die Daten
// selbst sind weiter per RLS am Server geschützt, offline sieht man nur, was
// dieses Konto vorher mit Netz geladen hat. Antwortet der Server „nein“, wird
// die gemerkte Rolle sofort gelöscht.
(function () {
  var KEY = 'lq-meisterin-rolle';
  function netzFehler(e) {
    if (!navigator.onLine) return true;
    var t = String((e && (e.message || e.details || e.name)) || e || '');
    return /fetch|network|netzwerk|load failed|timeout|RetryableFetch/i.test(t);
  }
  window.lqNetzFehler = netzFehler;
  window.lqIstMeisterin = async function (client) {
    var uid = null;
    try { var s = (await client.auth.getSession()).data.session; uid = s && s.user && s.user.id; } catch (e) { /* egal */ }
    if (!uid) return false;
    try {
      var r = await client.rpc('ist_meisterin');
      if (!r.error) {
        var ok = r.data === true;
        try { if (ok) localStorage.setItem(KEY, uid); else localStorage.removeItem(KEY); } catch (e) { /* egal */ }
        return ok;
      }
      if (!netzFehler(r.error)) return false;
    } catch (e) {
      if (!netzFehler(e)) return false;
    }
    try { return localStorage.getItem(KEY) === uid; } catch (e) { return false; }
  };
})();
