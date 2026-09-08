/* ARC cloud backend bridge
   - Supabase Auth
   - per-user JSON state sync with RLS
   - profile/onboarding data
   - optional real-time cross-device sync
*/
(() => {
  let sb = null;
  let currentUser = null;
  let syncTimer = null;
  let realtimeChannel = null;
  let applyingRemote = false;
  let cloudConfigured = false;

  const cfg = window.ARC_CONFIG || {};
  const key = cfg.supabasePublishableKey || cfg.supabaseAnonKey || '';

  function el(id) { return document.getElementById(id); }
  function status(text, kind='') {
    const node = el('cloudStatus');
    if (node) {
      node.textContent = text;
      node.className = `small ${kind === 'ok' ? '' : 'muted'}`;
    }
  }
  function authMessage(text, error=false) {
    const node = el('authMessage');
    if (!node) return;
    node.textContent = text;
    node.className = `notice ${error ? 'danger' : 'success'}`;
    node.classList.toggle('hidden', !text);
  }
  function hasMeaningfulGuestData(s) {
    return !!((s?.sessions?.length || 0) + (s?.plans?.length || 0) + (s?.week?.length || 0) + (s?.customExercises?.length || 0));
  }
  function neutralState() {
    if (typeof emptyState === 'function') return emptyState();
    return { plan: [], sessions: [], customExercises: [], draftExercises: [], settings: {email:'', signedIn:false, profile:{}} };
  }

  async function getCloudState() {
    if (!sb || !currentUser) return null;
    const { data, error } = await sb.from('user_app_state').select('state,revision,updated_at').eq('user_id', currentUser.id).maybeSingle();
    if (error) throw error;
    return data;
  }

  async function pushCloudState(force=false) {
    if (!sb || !currentUser || applyingRemote) return;
    const payload = JSON.parse(JSON.stringify(state));
    payload.settings = payload.settings || {};
    payload.settings.email = currentUser.email || '';
    payload.settings.signedIn = true;
    const { error } = await sb.from('user_app_state').upsert({
      user_id: currentUser.id,
      state: payload,
      revision: Date.now(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) {
      console.error(error);
      status('Sync-Fehler');
      if (force) throw error;
    } else {
      status('Cloud synchronisiert', 'ok');
    }
  }

  function queueSync() {
    if (!cloudConfigured || !currentUser || applyingRemote) return;
    clearTimeout(syncTimer);
    status('Synchronisiert …');
    syncTimer = setTimeout(() => pushCloudState(false), 700);
  }

  async function applyCloudState(row) {
    if (!row?.state) return;
    applyingRemote = true;
    state = row.state;
    state.settings = state.settings || {};
    state.settings.email = currentUser?.email || state.settings.email || '';
    state.settings.signedIn = !!currentUser;
    localStorage.setItem('arcStateV5', JSON.stringify(state));
    if (typeof renderAll === 'function') renderAll();
    applyingRemote = false;
  }

  function subscribeRealtime() {
    if (!sb || !currentUser) return;
    if (realtimeChannel) sb.removeChannel(realtimeChannel);
    realtimeChannel = sb.channel(`arc-state-${currentUser.id}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'user_app_state', filter: `user_id=eq.${currentUser.id}`
      }, async (payload) => {
        const incoming = payload.new;
        if (!incoming?.state) return;
        await applyCloudState(incoming);
      })
      .subscribe();
  }

  async function loadProfile() {
    if (!sb || !currentUser) return null;
    const { data, error } = await sb.from('profiles').select('*').eq('id', currentUser.id).maybeSingle();
    if (error) throw error;
    return data;
  }

  async function updateProfileFromForm() {
    if (!sb || !currentUser) return authMessage('Bitte zuerst anmelden.', true);
    const sports = [...document.querySelectorAll('input[name="profileSport"]:checked')].map(x => x.value);
    const profile = {
      id: currentUser.id,
      display_name: el('profileName')?.value?.trim() || null,
      training_level: el('profileLevel')?.value || 'beginner',
      primary_goal: el('profileGoal')?.value || 'general_fitness',
      sports,
      units: el('profileUnits')?.value || 'metric',
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    };
    const { error } = await sb.from('profiles').upsert(profile, { onConflict: 'id' });
    if (error) return authMessage(error.message, true);
    state.settings = state.settings || {};
    state.settings.profile = profile;
    localStorage.setItem('arcStateV5', JSON.stringify(state));
    queueSync();
    authMessage('Profil gespeichert. Pläne und automatische Empfehlungen passen sich an deine Angaben an.');
    renderProfileContext(profile);
  }

  function renderProfileContext(profile) {
    const goalMap = {
      general_fitness:'Allgemeine Fitness', strength:'Kraft', muscle:'Muskelaufbau', endurance:'Ausdauer',
      hybrid:'Hybrid Fitness', skill:'Skills / Calisthenics', rehab:'Reha / Belastbarkeit'
    };
    const goalText = profile?.primary_goal ? goalMap[profile.primary_goal] || profile.primary_goal : 'Noch kein Ziel hinterlegt';
    const sportsText = profile?.sports?.length ? profile.sports.join(' · ') : 'Noch keine Sportarten ausgewählt';
  }

  async function refreshAccountUI() {
    const signed = !!currentUser;
    if (el('loginStatus')) el('loginStatus').textContent = signed ? `Angemeldet: ${currentUser.email || 'Account'}` : 'Nicht angemeldet';
    if (el('accountEmail') && signed) el('accountEmail').value = currentUser.email || '';
    if (el('signOutBtn')) el('signOutBtn').classList.toggle('hidden', !signed);
    if (el('accountProfilePanel')) el('accountProfilePanel').classList.toggle('hidden', !signed);
    if (el('guestImportBtn')) el('guestImportBtn').classList.toggle('hidden', !signed || !hasMeaningfulGuestData(JSON.parse(localStorage.getItem('arcGuestBackup') || 'null')));
    if (!signed) {
      status(cloudConfigured ? 'Cloud bereit · nicht angemeldet' : 'Lokaler Gastmodus');
      renderProfileContext(null);
      return;
    }
    status('Cloud verbunden', 'ok');
    try {
      const profile = await loadProfile();
      if (profile) {
        if (el('profileName')) el('profileName').value = profile.display_name || '';
        if (el('profileLevel')) el('profileLevel').value = profile.training_level || 'beginner';
        if (el('profileGoal')) el('profileGoal').value = profile.primary_goal || 'general_fitness';
        if (el('profileUnits')) el('profileUnits').value = profile.units || 'metric';
        document.querySelectorAll('input[name="profileSport"]').forEach(x => x.checked = (profile.sports || []).includes(x.value));
        renderProfileContext(profile);
      }
    } catch (e) { console.error(e); }
  }

  async function onSignedIn(user) {
    currentUser = user;
    const localBefore = JSON.parse(localStorage.getItem('arcStateV5') || localStorage.getItem('arcState') || 'null');
    if (localBefore && !localBefore.settings?.signedIn && hasMeaningfulGuestData(localBefore)) {
      localStorage.setItem('arcGuestBackup', JSON.stringify(localBefore));
    }
    const remote = await getCloudState();
    if (remote?.state) {
      await applyCloudState(remote);
    } else {
      state = neutralState();
      state.settings = state.settings || {};
      state.settings.email = user.email || '';
      state.settings.signedIn = true;
      localStorage.setItem('arcStateV5', JSON.stringify(state));
      if (typeof renderAll === 'function') renderAll();
      await pushCloudState(true);
    }
    subscribeRealtime();
    await refreshAccountUI();
  }

  async function signUp() {
    if (!sb) return authMessage('Cloud ist noch nicht konfiguriert.', true);
    const email = el('accountEmail')?.value?.trim();
    const password = el('accountPassword')?.value || '';
    if (!email || password.length < 8) return authMessage('Bitte E-Mail und mindestens 8 Zeichen Passwort eingeben.', true);
    const redirect = location.origin === 'null' ? undefined : `${location.origin}${location.pathname}`;
    const { data, error } = await sb.auth.signUp({ email, password, options: redirect ? { emailRedirectTo: redirect } : undefined });
    if (error) return authMessage(error.message, true);
    if (data.session) await onSignedIn(data.user);
    authMessage(data.session ? 'Account erstellt und angemeldet.' : 'Account erstellt. Bitte bestätige gegebenenfalls die E-Mail.');
  }

  async function signIn() {
    if (!sb) return authMessage('Cloud ist noch nicht konfiguriert.', true);
    const email = el('accountEmail')?.value?.trim();
    const password = el('accountPassword')?.value || '';
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return authMessage(error.message, true);
    await onSignedIn(data.user);
    authMessage('Anmeldung erfolgreich. Deine Cloud-Daten wurden geladen.');
  }

  async function signOut() {
    if (!sb) return;
    await pushCloudState(false);
    await sb.auth.signOut();
    currentUser = null;
    if (realtimeChannel) sb.removeChannel(realtimeChannel);
    realtimeChannel = null;
    state = neutralState();
    localStorage.setItem('arcStateV5', JSON.stringify(state));
    if (typeof renderAll === 'function') renderAll();
    await refreshAccountUI();
    authMessage('Abgemeldet. Die Plattform ist wieder im neutralen Gastmodus.');
  }

  async function importGuestIntoAccount() {
    if (!currentUser) return authMessage('Bitte zuerst anmelden.', true);
    const backup = JSON.parse(localStorage.getItem('arcGuestBackup') || 'null');
    if (!backup) return authMessage('Keine Gastdaten gefunden.', true);
    state = backup;
    state.settings = state.settings || {};
    state.settings.email = currentUser.email || '';
    state.settings.signedIn = true;
    localStorage.setItem('arcStateV5', JSON.stringify(state));
    if (typeof renderAll === 'function') renderAll();
    await pushCloudState(true);
    localStorage.removeItem('arcGuestBackup');
    authMessage('Gastdaten wurden in diesen Account übernommen.');
  }

  async function init() {
    cloudConfigured = !!(cfg.supabaseUrl && key && window.supabase?.createClient);
    if (!cloudConfigured) {
      status('Lokaler Gastmodus · Backend noch nicht konfiguriert');
      renderProfileContext(null);
      return;
    }
    sb = window.supabase.createClient(cfg.supabaseUrl, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    const { data: { session } } = await sb.auth.getSession();
    if (session?.user) await onSignedIn(session.user); else await refreshAccountUI();
    sb.auth.onAuthStateChange(async (event, sessionNow) => {
      if (event === 'SIGNED_IN' && sessionNow?.user && sessionNow.user.id !== currentUser?.id) await onSignedIn(sessionNow.user);
      if (event === 'SIGNED_OUT') {
        currentUser = null;
        await refreshAccountUI();
      }
    });
  }

  // Make existing app persistence cloud-aware without changing every feature.
  if (typeof persist === 'function') {
    const localPersist = persist;
    persist = function() {
      localPersist();
      queueSync();
    };
  }

  // Replace prototype account actions.
  window.arcSignUp = signUp;
  window.arcSignIn = signIn;
  window.arcSignOut = signOut;
  window.arcSaveProfile = updateProfileFromForm;
  window.arcImportGuest = importGuestIntoAccount;
  window.ARC_BACKEND = { init, queueSync, pushCloudState, get user(){return currentUser}, get configured(){return cloudConfigured} };

  // Override Account render from the prototype, preserving generic state.
  if (typeof renderAccount === 'function') {
    renderAccount = function() {
      const signed = !!currentUser;
      if (el('loginStatus')) el('loginStatus').textContent = signed ? `Angemeldet: ${currentUser.email || 'Account'}` : 'Nicht angemeldet';
      if (el('signOutBtn')) el('signOutBtn').classList.toggle('hidden', !signed);
      if (el('accountProfilePanel')) el('accountProfilePanel').classList.toggle('hidden', !signed);
      if (el('accountEmail') && signed) el('accountEmail').value = currentUser.email || '';
    };
  }

  window.addEventListener('online', () => pushCloudState(false));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') pushCloudState(false); });
  window.addEventListener('DOMContentLoaded', init);
})();
