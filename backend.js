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

/* ARC v12.2 — interaction router: important cards are actionable everywhere. */
(() => {
  const ROUTER_VERSION = '12.2';
  const interactiveSelector = 'button,a,input,select,textarea,label,[contenteditable="true"],[onclick]';

  function isNativeAction(target) {
    return !!target?.closest?.(interactiveSelector);
  }

  function makeActionable(node, handler, label) {
    if (!node || node.dataset.arcActionable === '1') return;
    node.dataset.arcActionable = '1';
    node.classList.add('arc-clickable');
    if (!node.hasAttribute('tabindex')) node.tabIndex = 0;
    if (!node.hasAttribute('role')) node.setAttribute('role', 'button');
    if (label) node.setAttribute('aria-label', label);
    node.addEventListener('click', (event) => {
      if (isNativeAction(event.target)) return;
      handler(event);
    });
    node.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (isNativeAction(event.target) && event.target !== node) return;
      event.preventDefault();
      handler(event);
    });
  }

  function ensureStyle() {
    if (document.getElementById('arc-v12-2-click-style')) return;
    const style = document.createElement('style');
    style.id = 'arc-v12-2-click-style';
    style.textContent = `
      .arc-clickable{cursor:pointer;transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease}
      .arc-clickable:hover{border-color:rgba(49,87,232,.32)!important;box-shadow:0 9px 26px rgba(27,31,42,.08)}
      .arc-clickable:focus-visible{outline:3px solid rgba(49,87,232,.24);outline-offset:3px}
      .arc-route-hint{display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:10px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--blue)}
      .arc-card-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
      .day-slot .arc-route-hint{display:block;margin-top:4px}
      .science-card.arc-clickable .arc-route-hint{color:inherit;opacity:.68}
      @media (hover:none){.arc-clickable:hover{transform:none;box-shadow:none}}
    `;
    document.head.appendChild(style);
  }

  function addHint(node, text) {
    if (!node || node.querySelector(':scope > .arc-route-hint')) return;
    const hint = document.createElement('span');
    hint.className = 'arc-route-hint';
    hint.textContent = text;
    node.appendChild(hint);
  }

  function planIndexById(planId) {
    return (window.state?.plans || []).findIndex((plan) => plan.id === planId);
  }

  function editPlanFromAnywhere(planIndex, dayIndex = null) {
    const plans = window.state?.plans || [];
    const plan = plans[planIndex];
    if (!plan || typeof window.editPlan !== 'function') {
      if (typeof window.go === 'function') window.go('plans');
      return;
    }
    if (typeof window.go === 'function') window.go('plans');
    window.editPlan(planIndex);
    if (Number.isInteger(dayIndex)) {
      setTimeout(() => {
        const days = document.querySelectorAll('#builderDays .builder-day');
        const target = days[dayIndex];
        if (!target) return;
        target.scrollIntoView({behavior:'smooth', block:'center'});
        target.animate?.([
          {boxShadow:'0 0 0 0 rgba(49,87,232,0)'},
          {boxShadow:'0 0 0 4px rgba(49,87,232,.18)'},
          {boxShadow:'0 0 0 0 rgba(49,87,232,0)'}
        ], {duration:900});
      }, 90);
    }
  }

  function editPlanById(planId, dayIndex = null) {
    const index = planIndexById(planId);
    if (index >= 0) editPlanFromAnywhere(index, dayIndex);
    else if (typeof window.go === 'function') window.go('plans');
  }

  window.arcEditPlanFromAnywhere = editPlanFromAnywhere;
  window.arcEditPlanById = editPlanById;

  function wrapRender(name, decorator) {
    const original = window[name];
    if (typeof original !== 'function' || original.__arcV122Wrapped) return;
    const wrapped = function(...args) {
      const result = original.apply(this, args);
      try { decorator(...args); } catch (error) { console.warn(`[ARC ${ROUTER_VERSION}] ${name} decoration`, error); }
      return result;
    };
    wrapped.__arcV122Wrapped = true;
    wrapped.__arcOriginal = original;
    window[name] = wrapped;
  }

  function decorateTemplates(filter = 'all') {
    const root = document.getElementById('templateGrid');
    const templates = typeof TEMPLATES !== 'undefined' ? TEMPLATES : [];
    if (!root || !Array.isArray(templates)) return;
    const indices = templates.map((template, index) => ({template,index}))
      .filter(({template}) => filter === 'all' || template.sport === filter)
      .map(({index}) => index);
    [...root.querySelectorAll('.template-card')].forEach((card, visibleIndex) => {
      const templateIndex = indices[visibleIndex];
      if (!Number.isInteger(templateIndex)) return;
      const template = templates[templateIndex];
      const name = window.lang?.() === 'de' ? template.nameDe : template.nameEn;
      makeActionable(card, () => window.useTemplate?.(templateIndex), `${name}: ${window.lang?.()==='de'?'Vorlage bearbeiten':'edit template'}`);
      addHint(card, window.lang?.()==='de' ? 'Anklicken → als Entwurf bearbeiten' : 'Click → edit as draft');
    });
  }

  function decoratePlans() {
    const root = document.getElementById('myPlans');
    if (!root) return;
    [...root.querySelectorAll('.plan-card')].forEach((card, index) => {
      card.classList.add('arc-clickable');
      card.dataset.arcPlanIndex = String(index);
    });
  }

  function decorateTraining() {
    const root = document.getElementById('myWorkouts');
    if (!root || typeof window.flattenWorkouts !== 'function') return;
    const workouts = window.flattenWorkouts();
    [...root.querySelectorAll('.workout-card')].forEach((card, index) => {
      const workout = workouts[index];
      if (!workout) return;
      makeActionable(card, () => editPlanFromAnywhere(workout.pi, workout.di), `${workout.day.name}: ${window.lang?.()==='de'?'Plan bearbeiten':'edit plan'}`);
      addHint(card, window.lang?.()==='de' ? 'Karte anklicken → Plan bearbeiten' : 'Click card → edit plan');
    });
    const manualBox = document.getElementById('manualBox');
    makeActionable(manualBox, () => {
      if (typeof window.toggleManual === 'function') window.toggleManual();
      setTimeout(() => document.getElementById('manualForm')?.scrollIntoView({behavior:'smooth',block:'nearest'}), 40);
    }, window.lang?.()==='de'?'Manuelle Eingabe öffnen':'Open manual entry');
  }

  function decorateWeek() {
    const root = document.getElementById('weekGrid');
    if (!root) return;
    const dayNodes = [...root.querySelectorAll('.day')];
    dayNodes.forEach((dayNode, weekday) => {
      const assignments = (window.state?.week || []).filter((item) => item.weekday === weekday);
      const slots = [...dayNode.querySelectorAll('.day-slot')];
      slots.forEach((slot, index) => {
        const assignment = assignments[index];
        if (!assignment) return;
        makeActionable(slot, (event) => {
          event.stopPropagation?.();
          editPlanById(assignment.planId, assignment.dayIndex);
        }, window.lang?.()==='de'?'Trainingstag im Plan bearbeiten':'Edit workout day in plan');
        addHint(slot, window.lang?.()==='de' ? 'Plan bearbeiten →' : 'Edit plan →');
      });
      makeActionable(dayNode, () => window.openWeekPicker?.(weekday), `${dayNode.querySelector('h3')?.textContent || ''}: ${window.lang?.()==='de'?'Training hinzufügen':'add workout'}`);
    });
  }

  function decorateDashboard() {
    const de = window.lang?.() === 'de';
    const metricRoutes = [
      ['metricSessions', () => window.go?.('training'), de?'Trainings öffnen':'Open workouts'],
      ['metricRpe', () => { window.go?.('training'); setTimeout(()=>document.getElementById('manualBox')?.scrollIntoView({behavior:'smooth'}),80); }, de?'Training & RPE öffnen':'Open training & RPE'],
      ['metricWell', () => { window.go?.('training'); setTimeout(()=>document.getElementById('manualBox')?.scrollIntoView({behavior:'smooth'}),80); }, de?'Recovery-Eingabe öffnen':'Open recovery entry'],
      ['metricPlans', () => window.go?.('plans'), de?'Pläne öffnen':'Open plans']
    ];
    metricRoutes.forEach(([id, handler, label]) => makeActionable(document.getElementById(id)?.closest('.card'), handler, label));

    const todayCard = document.getElementById('todayHeadline')?.closest('.card');
    makeActionable(todayCard, () => {
      const today = typeof window.getTodayAssignments === 'function' ? window.getTodayAssignments()[0] : null;
      if (today?.p) editPlanFromAnywhere((window.state?.plans || []).indexOf(today.p), today.di);
      else window.go?.('week');
    }, de?'Heutigen Plan bearbeiten':'Edit today’s plan');

    const recoveryCard = document.querySelector('#dashboard .grid.g2 .card:not(.dark)');
    makeActionable(recoveryCard, () => {
      window.go?.('training');
      setTimeout(()=>document.getElementById('manualBox')?.scrollIntoView({behavior:'smooth'}),80);
    }, de?'Recovery erfassen':'Log recovery');

    const next = typeof window.flattenWorkouts === 'function' ? window.flattenWorkouts().slice(0,6) : [];
    [...document.querySelectorAll('#dashboardNext .workout-card')].forEach((card,index) => {
      const workout = next[index];
      if (!workout) return;
      if (!card.querySelector('.arc-edit-plan-action')) {
        const actions = document.createElement('div');
        actions.className = 'arc-card-actions';
        const edit = document.createElement('button');
        edit.className = 'btn arc-edit-plan-action';
        edit.textContent = de ? 'Plan bearbeiten' : 'Edit plan';
        edit.onclick = (event) => { event.stopPropagation(); editPlanFromAnywhere(workout.pi, workout.di); };
        actions.appendChild(edit);
        card.appendChild(actions);
      }
      if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
      card.setAttribute('role','button');
      card.classList.add('arc-clickable');
      card.onkeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); }
      };
    });

    document.querySelectorAll('#autoInsights .science-card').forEach((card) => {
      makeActionable(card, () => window.openScienceBasis?.(), de?'Wissenschaftliche Basis öffnen':'Open evidence basis');
      addHint(card, de ? 'Basis öffnen →' : 'Open evidence →');
    });
  }

  function decorateBuilderDays() {
    if (!window.state?.builder) return;
    const days = window.state.builder.days || [];
    days.forEach((day, dayIndex) => {
      const blocks = [...document.querySelectorAll(`#builderBlocks${dayIndex} .block`)];
      blocks.forEach((blockNode, blockIndex) => {
        const block = day.blocks?.[blockIndex];
        if (!block) return;
        const visual = blockNode.querySelector('.block-visual');
        makeActionable(visual, () => window.showExerciseDetail?.(block.exercise), `${window.exName?.(block.exercise)||block.exercise}: ${window.lang?.()==='de'?'Details öffnen':'open details'}`);
      });
    });
  }

  function decorateStaticShortcuts() {
    const de = window.lang?.() === 'de';
    const features = [...document.querySelectorAll('#plans .feature-mini')];
    const handlers = [
      () => { window.go?.('plans'); document.getElementById('myPlans')?.scrollIntoView({behavior:'smooth'}); },
      () => { window.go?.('plans'); document.getElementById('templateGrid')?.scrollIntoView({behavior:'smooth'}); },
      () => document.getElementById('planImportFile')?.click(),
      () => window.go?.('training')
    ];
    const labels = de ? ['Eigene Pläne öffnen','Vorlagen öffnen','Plan importieren','Training öffnen'] : ['Open own plans','Open templates','Import plan','Open training'];
    features.forEach((feature,index) => makeActionable(feature, handlers[index] || (()=>{}), labels[index] || ''));
  }

  function install() {
    if (window.__ARC_INTERACTION_ROUTER_V122__) return;
    window.__ARC_INTERACTION_ROUTER_V122__ = true;
    ensureStyle();
    wrapRender('renderTemplates', decorateTemplates);
    wrapRender('renderPlans', decoratePlans);
    wrapRender('renderTraining', decorateTraining);
    wrapRender('renderWeek', decorateWeek);
    wrapRender('renderDashboard', decorateDashboard);
    wrapRender('renderBuilderDays', decorateBuilderDays);
    decorateStaticShortcuts();
    try { window.renderAll?.(); } catch (error) { console.warn(`[ARC ${ROUTER_VERSION}] initial render`, error); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else setTimeout(install, 0);
})();
