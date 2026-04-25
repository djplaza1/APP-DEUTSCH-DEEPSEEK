function ComunidadPanel(props) {
  const {
    communitySubTab,
    setCommunitySubTab,
    unifiedAuth,
    isCreatorAccount,
    profileNameDraft,
    setProfileNameDraft,
    profileNameBusy,
    setProfileNameBusy,
    profileNameMsg,
    setProfileNameMsg,
    setSupabaseUser,
    setSupabaseProfile,
    saveProgress,
    setAuthTick,
    mullerAuthLogout,
    setAuthPassword,
    authMode,
    setAuthMode,
    authError,
    setAuthError,
    authEmail,
    setAuthEmail,
    authPassword,
    authDisplayName,
    setAuthDisplayName,
    authBusy,
    setAuthBusy,
    userStats,
    walletCoins,
    rewardStatus,
    walletLoading,
    economyMsg,
    setEconomyMsg,
    setWalletCoins,
    economyReasonText,
    adOpenedAt,
    setAdOpenedAt,
    premiumStatus,
    supabaseUser,
    remoteProfiles,
    directoryLocals,
    leagueBoard,
    mullerMaskEmail,
    mullerGetSupabaseClient,
    mullerAccountsLoad,
    mullerAccountsSave,
    mullerAuthRegister,
    mullerAuthLogin,
  } = props;
  const ExerciseHelpBtn = window.ExerciseHelpBtn || (() => null);
  const mullerSupabaseConfigured = window.mullerSupabaseConfigured || (() => false);
  return (
                      <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                              <div>
                                  <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 mb-2"><Icon name="trophy" className="w-9 h-9 md:w-12 md:h-12 text-violet-400" /> Comunidad</h1>
                                  <p className="text-gray-400 text-sm md:text-base max-w-2xl">
                                      {mullerSupabaseConfigured()
                                          ? 'Modo Supabase activo: directorio y liga global (plan gratuito). Si no hay URL/key, todo sigue en local.'
                                          : 'Cuenta local o Supabase (gratis): configura URL y clave anon en index.html y el SQL del proyecto. Liga semanal con bots simulados.'}
                                  </p>
                              </div>
                              <ExerciseHelpBtn helpId="nav_comunidad" />
                          </div>
                          <div className="flex flex-wrap gap-2 mb-6">
                              {[
                                  { id: 'economia', label: 'Economía' },
                                  { id: 'directorio', label: 'Directorio' },
                                  { id: 'ligas', label: 'Liga / ranking' },
                              ].map((t) => (
                                  <button
                                      key={t.id}
                                      type="button"
                                      onClick={() => setCommunitySubTab(t.id)}
                                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${communitySubTab === t.id ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_16px_rgba(124,58,237,0.35)]' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}
                                  >
                                      {t.label}
                                  </button>
                              ))}
                          </div>
                          <p className="text-[11px] text-gray-500 mb-4">Cuenta y ajustes se gestionan ahora desde el menú de usuario (arriba derecha) o el botón flotante de ajustes.</p>

                          {communitySubTab === 'cuenta' && (
                              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 md:p-6 shadow-xl">
                                  {unifiedAuth ? (
                                      <div className="space-y-4">
                                          <p className="text-white font-bold text-lg flex items-center gap-2"><Icon name="check-circle" className="w-5 h-5 text-emerald-400" /> Sesión iniciada</p>
                                          <p className="text-[11px] font-bold uppercase tracking-wider text-violet-400">{unifiedAuth.source === 'supabase' ? 'Cuenta Supabase (nube · gratis)' : 'Cuenta solo en este navegador'}</p>
                                          {isCreatorAccount ? <p className="text-[11px] font-black uppercase tracking-wider text-amber-400">Modo Creador: monedas ilimitadas</p> : null}
                                          <p className="text-sm text-gray-400"><span className="text-gray-300 font-semibold">Nombre:</span> {unifiedAuth.displayName}</p>
                                          <p className="text-sm text-gray-400"><span className="text-gray-300 font-semibold">Email:</span> {mullerMaskEmail(unifiedAuth.email)}</p>
                                          <div className="rounded-xl border border-white/10 bg-black/25 p-3 space-y-2">
                                              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">Cambiar nombre visible</label>
                                              <div className="flex flex-col sm:flex-row gap-2">
                                                  <input
                                                      type="text"
                                                      value={profileNameDraft}
                                                      onChange={(e) => setProfileNameDraft(e.target.value)}
                                                      className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500"
                                                      placeholder="Ej: SuperKlaus"
                                                  />
                                                  <button
                                                      type="button"
                                                      disabled={profileNameBusy}
                                                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-bold text-sm"
                                                      onClick={async () => {
                                                          const nextName = String(profileNameDraft || '').trim();
                                                          if (!nextName) { setProfileNameMsg('Escribe un nombre válido.'); return; }
                                                          setProfileNameBusy(true);
                                                          setProfileNameMsg('');
                                                          try {
                                                              if (unifiedAuth.source === 'supabase') {
                                                                  const client = mullerGetSupabaseClient();
                                                                  if (!client || !supabaseUser) throw new Error('Supabase no disponible');
                                                                  const { error: e1 } = await client.auth.updateUser({ data: { display_name: nextName } });
                                                                  if (e1) throw new Error(e1.message);
                                                                  const { error: e2 } = await client.from('profiles').upsert({
                                                                      id: supabaseUser.id,
                                                                      display_name: nextName,
                                                                      updated_at: new Date().toISOString(),
                                                                  }, { onConflict: 'id' });
                                                                  if (e2) throw new Error(e2.message);
                                                                  setSupabaseProfile((p) => ({ ...(p || {}), id: supabaseUser.id, display_name: nextName, updated_at: new Date().toISOString() }));
                                                              } else {
                                                                  const map = mullerAccountsLoad();
                                                                  const em = unifiedAuth.email;
                                                                  if (map[em]) {
                                                                      map[em].displayName = nextName;
                                                                      mullerAccountsSave(map);
                                                                  }
                                                              }
                                                              saveProgress({ username: nextName });
                                                              setAuthTick((x) => x + 1);
                                                              setProfileNameMsg('Nombre actualizado.');
                                                          } catch (err) {
                                                              setProfileNameMsg('No se pudo actualizar: ' + (err && err.message ? err.message : 'error'));
                                                          } finally {
                                                              setProfileNameBusy(false);
                                                          }
                                                      }}
                                                  >
                                                      {profileNameBusy ? 'Guardando…' : 'Guardar nombre'}
                                                  </button>
                                              </div>
                                              {profileNameMsg ? <p className="text-xs text-gray-400">{profileNameMsg}</p> : null}
                                          </div>
                                          <button
                                              type="button"
                                              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm border border-white/10"
                                              onClick={async () => {
                                                  const client = mullerGetSupabaseClient();
                                                  if (unifiedAuth.source === 'supabase' && client) {
                                                      try { await client.auth.signOut(); } catch (err) {}
                                                      setSupabaseUser(null);
                                                      setSupabaseProfile(null);
                                                  }
                                                  mullerAuthLogout();
                                                  setAuthTick((x) => x + 1);
                                                  setAuthPassword('');
                                              }}
                                          >
                                              Cerrar sesión
                                          </button>
                                      </div>
                                  ) : (
                                      <div className="space-y-4">
                                          <div className="flex gap-2">
                                              <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${authMode === 'login' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-500'}`}>Entrar</button>
                                              <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${authMode === 'register' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-500'}`}>Registro gratis</button>
                                          </div>
                                          {authError ? <p className="text-sm text-red-400 font-semibold">{authError}</p> : null}
                                          <label className="block text-xs font-bold text-gray-500 uppercase">Email</label>
                                          <input type="email" autoComplete="email" className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                                          <label className="block text-xs font-bold text-gray-500 uppercase">Contraseña (mín. 6)</label>
                                          <input type="password" autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
                                          {authMode === 'register' ? (
                                              <>
                                                  <label className="block text-xs font-bold text-gray-500 uppercase">Nombre visible</label>
                                                  <input type="text" className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authDisplayName} onChange={(e) => setAuthDisplayName(e.target.value)} placeholder="Ej: SuperKlaus" />
                                              </>
                                          ) : null}
                                          <button
                                              type="button"
                                              disabled={authBusy}
                                              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-black text-white"
                                              onClick={async () => {
                                                  setAuthBusy(true);
                                                  setAuthError('');
                                                  const errMap = {
                                                      CRYPTO_UNAVAILABLE: 'Necesitas https o localhost para registrar con cifrado seguro.',
                                                      EMAIL_INVALID: 'Introduce un email válido.',
                                                      PASS_SHORT: 'La contraseña debe tener al menos 6 caracteres.',
                                                      EMAIL_TAKEN: 'Ese email ya está registrado en este dispositivo.',
                                                      BAD_CREDENTIALS: 'Email o contraseña incorrectos.',
                                                  };
                                                  try {
                                                      const client = mullerGetSupabaseClient();
                                                      if (client) {
                                                          const em = authEmail.trim();
                                                          if (authMode === 'register') {
                                                              const dn = (authDisplayName || userStats.username || 'Estudiante').trim();
                                                              const { data, error } = await client.auth.signUp({
                                                                  email: em,
                                                                  password: authPassword,
                                                                  options: { data: { display_name: dn } },
                                                              });
                                                              if (error) throw new Error(error.message);
                                                              saveProgress({ username: dn });
                                                              if (data.session && data.session.user) {
                                                                  setSupabaseUser(data.session.user);
                                                                  try {
                                                                      await client.from('profiles').upsert({
                                                                          id: data.session.user.id,
                                                                          display_name: dn,
                                                                          updated_at: new Date().toISOString(),
                                                                      }, { onConflict: 'id' });
                                                                  } catch (pe) {}
                                                              } else if (data.user) {
                                                                  setSupabaseUser(data.user);
                                                              }
                                                              if (!data.session) {
                                                                  alert('Si Supabase pide confirmar el email, revisa tu bandeja. En Authentication → Providers → Email puedes desactivar “Confirm email” para pruebas. El perfil se crea al confirmar.');
                                                              }
                                                          } else {
                                                              const { data, error } = await client.auth.signInWithPassword({ email: em, password: authPassword });
                                                              if (error) throw new Error(error.message);
                                                              if (data.user) {
                                                                  setSupabaseUser(data.user);
                                                                  const meta = data.user.user_metadata && data.user.user_metadata.display_name;
                                                                  if (meta) saveProgress({ username: String(meta) });
                                                              }
                                                          }
                                                      } else if (authMode === 'register') {
                                                          const acc = await mullerAuthRegister(authEmail, authPassword, authDisplayName || userStats.username);
                                                          saveProgress({ username: acc.displayName });
                                                      } else {
                                                          const acc = await mullerAuthLogin(authEmail, authPassword);
                                                          saveProgress({ username: acc.displayName });
                                                      }
                                                      setAuthPassword('');
                                                      setAuthTick((x) => x + 1);
                                                  } catch (err) {
                                                      setAuthError(errMap[err.message] || err.message || 'Error');
                                                  } finally {
                                                      setAuthBusy(false);
                                                  }
                                              }}
                                          >
                                              {authBusy ? '…' : authMode === 'register' ? 'Crear cuenta' : 'Entrar'}
                                          </button>
                                          <p className="text-[11px] text-gray-500 leading-relaxed">
                                              {mullerGetSupabaseClient()
                                                  ? 'Con Supabase la contraseña va por Auth seguro de Supabase (gratis). Sin URL/key en index.html se usa cuenta local con PBKDF2 en el dispositivo.'
                                                  : 'Sin Supabase configurado: la contraseña se procesa con PBKDF2 solo en tu dispositivo; no hay servidor.'}
                                          </p>
                                      </div>
                                  )}
                              </div>
                          )}

                          {communitySubTab === 'economia' && (
                              <div className="space-y-6">
                                  <div className="rounded-2xl border border-amber-500/25 bg-slate-900/80 p-5">
                                      <h2 className="text-lg font-black text-white mb-2 flex items-center gap-2"><Icon name="coins" className="w-5 h-5 text-amber-400" /> Economía de monedas</h2>
                                      <p className="text-xs text-gray-500 mb-3">
                                          {mullerGetSupabaseClient()
                                              ? 'Modo seguro: bonus/gastos pasan por RPC en Supabase con límites diarios y cooldown. Evita monedas infinitas por trucos del cliente.'
                                              : 'Sin Supabase: modo local de pruebas. Para anti-trampas real usa Supabase activo.'}
                                      </p>
                                      <p className="text-sm text-gray-300">
                                          <span className="font-bold text-white">Saldo actual:</span> {isCreatorAccount ? '∞ (Creador)' : (walletCoins != null ? walletCoins : userStats.coins)}
                                      </p>
                                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                                          <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-1.5">
                                              <span className="text-gray-500">Bonus diario:</span> <span className="font-bold text-white">{rewardStatus ? (rewardStatus.daily_bonus_claimed ? 'Reclamado' : 'Disponible') : '—'}</span>
                                          </div>
                                          <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-1.5">
                                              <span className="text-gray-500">Anuncios hoy:</span> <span className="font-bold text-white">{rewardStatus ? rewardStatus.ad_claims_today : '—'}</span>
                                          </div>
                                          <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-1.5">
                                              <span className="text-gray-500">Restantes:</span> <span className="font-bold text-white">{rewardStatus ? rewardStatus.ad_remaining_today : '—'}</span>
                                          </div>
                                      </div>
                                      {rewardStatus && Number(rewardStatus.ad_cooldown_seconds || 0) > 0 ? (
                                          <p className="text-[11px] text-indigo-300 mt-2">Cooldown anuncio: {Math.ceil(Number(rewardStatus.ad_cooldown_seconds || 0) / 60)} min</p>
                                      ) : null}
                                      {walletLoading ? <p className="text-xs text-gray-500 mt-1">Sincronizando wallet…</p> : null}
                                      {economyMsg ? <p className="text-xs text-gray-400 mt-2">{economyMsg}</p> : null}
                                  </div>

                                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                                      <h3 className="text-base font-black text-white mb-3">Formas de conseguir monedas</h3>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-emerald-500/35 bg-emerald-900/25 hover:bg-emerald-900/40 p-3"
                                              onClick={async () => {
                                                  const client = mullerGetSupabaseClient();
                                                  if (!client) { setEconomyMsg('Activa Supabase para bonus seguro.'); return; }
                                                  const { data, error } = await client.rpc('muller_claim_reward', { p_reward_type: 'daily_bonus' });
                                                  if (error || !Array.isArray(data) || !data[0]) { setEconomyMsg('Error reclamando bonus diario.'); return; }
                                                  const row = data[0];
                                                  setWalletCoins(Number(row.balance || 0));
                                                  if (Number(row.granted || 0) > 0) setEconomyMsg('Bonus diario reclamado: +' + row.granted + ' monedas.');
                                                  else setEconomyMsg(economyReasonText(row.reason));
                                                  setAuthTick((x) => x + 1);
                                              }}
                                          >
                                              <p className="text-sm font-black text-emerald-300">Bonus diario (+40)</p>
                                              <p className="text-xs text-gray-400 mt-1">1 vez al día por usuario.</p>
                                          </button>
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-sky-500/35 bg-sky-900/20 hover:bg-sky-900/35 p-3"
                                              onClick={() => {
                                                  const u = String(window.MULLER_REWARDED_AD_URL || '').trim();
                                                  if (!u) { setEconomyMsg('Configura window.MULLER_REWARDED_AD_URL con tu enlace de anuncio/landing monetizada.'); return; }
                                                  window.open(u, '_blank', 'noopener,noreferrer');
                                                  setAdOpenedAt(Date.now());
                                                  setEconomyMsg('Anuncio abierto. Luego pulsa "Cobrar anuncio".');
                                              }}
                                          >
                                              <p className="text-sm font-black text-sky-300">Ver anuncio recompensado</p>
                                              <p className="text-xs text-gray-400 mt-1">Abre tu enlace monetizado en nueva pestaña.</p>
                                          </button>
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-indigo-500/35 bg-indigo-900/20 hover:bg-indigo-900/35 p-3"
                                              onClick={async () => {
                                                  const client = mullerGetSupabaseClient();
                                                  if (!client) { setEconomyMsg('Activa Supabase para cobro seguro de anuncios.'); return; }
                                                  if (!adOpenedAt || (Date.now() - adOpenedAt > 2 * 60 * 60 * 1000)) {
                                                      setEconomyMsg('Primero abre un anuncio recompensado y cobra dentro de 2 horas.');
                                                      return;
                                                  }
                                                  const { data, error } = await client.rpc('muller_claim_reward', { p_reward_type: 'ad_reward' });
                                                  if (error || !Array.isArray(data) || !data[0]) { setEconomyMsg('Error cobrando anuncio.'); return; }
                                                  const row = data[0];
                                                  setWalletCoins(Number(row.balance || 0));
                                                  if (Number(row.granted || 0) > 0) setEconomyMsg('Cobrado anuncio: +' + row.granted + ' monedas.');
                                                  else setEconomyMsg(economyReasonText(row.reason));
                                                  setAuthTick((x) => x + 1);
                                              }}
                                          >
                                              <p className="text-sm font-black text-indigo-300">Cobrar anuncio (+18)</p>
                                              <p className="text-xs text-gray-400 mt-1">Máx 6/día y cooldown de 15 min (backend).</p>
                                          </button>
                                          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                                              <p className="text-sm font-black text-white">Gana jugando</p>
                                              <p className="text-xs text-gray-400 mt-1">Racha diaria, sesiones completas y práctica oral ya suman. Próximo paso: migrar TODAS las recompensas a RPC para blindaje total.</p>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="rounded-2xl border border-fuchsia-500/30 bg-slate-900/80 p-5">
                                      <h3 className="text-base font-black text-white mb-2 flex items-center gap-2"><Icon name="gem" className="w-5 h-5 text-fuchsia-400" /> Premium mensual</h3>
                                      <p className="text-xs text-gray-500 mb-3">Monetización simple: botón de pago externo + estado premium en Supabase. Para activación automática real necesitarás webhook (paso siguiente).</p>
                                      <p className="text-sm text-gray-300 mb-3">
                                          Estado: <span className="font-bold text-white">
                                              {premiumStatus ? (premiumStatus.is_active ? 'Activo' : 'Inactivo') : '—'}
                                          </span>
                                          {premiumStatus && premiumStatus.expires_at ? <span className="text-xs text-gray-500 ml-2">hasta {String(premiumStatus.expires_at).slice(0, 10)}</span> : null}
                                      </p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-fuchsia-500/35 bg-fuchsia-900/20 hover:bg-fuchsia-900/35 p-3"
                                              onClick={() => {
                                                  const u = String(window.MULLER_PREMIUM_CHECKOUT_URL || '').trim();
                                                  if (!u) { setEconomyMsg('Configura window.MULLER_PREMIUM_CHECKOUT_URL con tu checkout mensual.'); return; }
                                                  window.open(u, '_blank', 'noopener,noreferrer');
                                                  setEconomyMsg('Checkout premium abierto.');
                                              }}
                                          >
                                              <p className="text-sm font-black text-fuchsia-300">Suscribirme mensual</p>
                                              <p className="text-xs text-gray-400 mt-1">Abre tu página de cobro (Stripe/PayPal/etc).</p>
                                          </button>
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-violet-500/35 bg-violet-900/20 hover:bg-violet-900/35 p-3"
                                              onClick={async () => {
                                                  const client = mullerGetSupabaseClient();
                                                  if (!client || !supabaseUser) { setEconomyMsg('Necesitas sesión Supabase.'); return; }
                                                  const until = new Date(Date.now() + 30 * 86400000).toISOString();
                                                  const { error } = await client.from('muller_premium_subscriptions').upsert({
                                                      user_id: supabaseUser.id,
                                                      plan: 'monthly',
                                                      status: 'active',
                                                      started_at: new Date().toISOString(),
                                                      expires_at: until,
                                                      updated_at: new Date().toISOString(),
                                                  }, { onConflict: 'user_id' });
                                                  if (error) { setEconomyMsg('No se pudo activar premium: ' + error.message); return; }
                                                  setEconomyMsg('Premium activado 30 días (modo manual de pruebas).');
                                                  setAuthTick((x) => x + 1);
                                              }}
                                          >
                                              <p className="text-sm font-black text-violet-300">Ya pagué (activar 30d)</p>
                                              <p className="text-xs text-gray-400 mt-1">Botón temporal para test hasta conectar webhook.</p>
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {communitySubTab === 'directorio' && (
                              <div className="space-y-6">
                                  {mullerSupabaseConfigured() ? (
                                      <div className="rounded-2xl border border-emerald-500/25 bg-slate-900/80 p-5 overflow-x-auto">
                                          <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2"><Icon name="globe" className="w-5 h-5 text-emerald-400" /> Directorio global (Supabase)</h2>
                                          {remoteProfiles === null ? (
                                              <div className="space-y-2 py-2">
                                                  <div className="muller-skeleton h-4 w-40 rounded" />
                                                  <div className="muller-skeleton h-4 w-full rounded" />
                                                  <div className="muller-skeleton h-4 w-5/6 rounded" />
                                              </div>
                                          ) : remoteProfiles.length === 0 ? (
                                              <p className="text-sm text-gray-500">Aún no hay filas en <code className="text-emerald-400/90">profiles</code>. Ejecuta el SQL del proyecto y registra un usuario.</p>
                                          ) : (
                                              <table className="w-full text-sm text-left">
                                                  <thead><tr className="text-gray-500 border-b border-white/10"><th className="py-2 pr-2">Nombre</th><th className="py-2">Actualizado</th></tr></thead>
                                                  <tbody>
                                                      {remoteProfiles.map((row) => (
                                                          <tr key={row.id} className="border-b border-white/5 text-gray-300">
                                                              <td className="py-2 pr-2 font-bold text-white">{row.display_name || '—'}</td>
                                                              <td className="py-2 text-xs text-gray-500">{row.updated_at ? String(row.updated_at).slice(0, 10) : '—'}</td>
                                                          </tr>
                                                      ))}
                                                  </tbody>
                                              </table>
                                          )}
                                      </div>
                                  ) : null}
                                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 overflow-x-auto">
                                      <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2"><Icon name="users" className="w-5 h-5 text-violet-400" /> Cuentas en este navegador (sin Supabase)</h2>
                                      {directoryLocals.length === 0 ? (
                                          <p className="text-sm text-gray-500">Aún no hay registros. Crea una cuenta en la pestaña «Cuenta».</p>
                                      ) : (
                                          <table className="w-full text-sm text-left">
                                              <thead><tr className="text-gray-500 border-b border-white/10"><th className="py-2 pr-2">Nombre</th><th className="py-2 pr-2">Email</th><th className="py-2">Alta</th></tr></thead>
                                              <tbody>
                                                  {directoryLocals.map((row) => (
                                                      <tr key={row.email} className="border-b border-white/5 text-gray-300">
                                                          <td className="py-2 pr-2 font-bold text-white">{row.displayName}</td>
                                                          <td className="py-2 pr-2">{mullerMaskEmail(row.email)}</td>
                                                          <td className="py-2 text-xs text-gray-500">{row.createdAt ? String(row.createdAt).slice(0, 10) : '—'}</td>
                                                      </tr>
                                                  ))}
                                              </tbody>
                                          </table>
                                      )}
                                  </div>
                                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 overflow-x-auto">
                                      <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2"><Icon name="bot" className="w-5 h-5 text-fuchsia-400" /> Bots de práctica (liga)</h2>
                                      <p className="text-xs text-gray-500 mb-3">Competidores simulados con puntuación semanal. No son usuarios reales.</p>
                                      <table className="w-full text-sm text-left">
                                          <thead><tr className="text-gray-500 border-b border-white/10"><th className="py-2 pr-2">Nombre</th><th className="py-2 pr-2">Ciudad / nivel</th><th className="py-2">Rol</th></tr></thead>
                                          <tbody>
                                              {MULLER_BOT_PLAYERS.map((b) => (
                                                  <tr key={b.id} className="border-b border-white/5 text-gray-300">
                                                      <td className="py-2 pr-2 font-bold text-fuchsia-200">{b.name}</td>
                                                      <td className="py-2 pr-2">{b.tag} · {b.lvl}</td>
                                                      <td className="py-2"><span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-500/30">Bot</span></td>
                                                  </tr>
                                              ))}
                                          </tbody>
                                      </table>
                                  </div>
                              </div>
                          )}

                          {communitySubTab === 'ligas' && (
                              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 md:p-6 overflow-x-auto shadow-xl">
                                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                      <h2 className="text-lg font-black text-white flex items-center gap-2"><Icon name="medal" className="w-6 h-6 text-amber-400" /> Liga semanal Müller</h2>
                                      <span className="text-xs font-mono text-gray-500">Semana (lun): {leagueBoard.week}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-4">
                                      {mullerSupabaseConfigured()
                                          ? 'Puntuación global: se sube a Supabase (tabla league_scores) mientras practicas. Los bots son simulados y se mezclan en la tabla.'
                                          : 'Tu puntuación usa XP, monedas, racha, dictados y práctica oral. Los bots tienen puntuación simulada por semana (cambia cada lunes).'}
                                  </p>
                                  <table className="w-full text-sm">
                                      <thead>
                                          <tr className="text-gray-500 border-b border-white/10 text-left">
                                              <th className="py-2 pr-2 w-10">#</th>
                                              <th className="py-2 pr-2">Participante</th>
                                              <th className="py-2 pr-2 hidden sm:table-cell">Detalle</th>
                                              <th className="py-2 text-right">Pts</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {leagueBoard.rows.map((r) => (
                                              <tr key={r.id} className={`border-b border-white/5 ${r.isSelf ? 'bg-violet-900/25' : ''}`}>
                                                  <td className="py-2.5 pr-2 font-black text-gray-500">{r.rank}</td>
                                                  <td className="py-2.5 pr-2">
                                                      <span className="font-bold text-white">{r.name}</span>
                                                      {r.isBot ? <span className="ml-2 text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-fuchsia-900/40 text-fuchsia-300">Bot</span> : null}
                                                      {r.isSelf ? <span className="ml-2 text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-violet-800/60 text-violet-200">Tú</span> : null}
                                                  </td>
                                                  <td className="py-2.5 pr-2 text-gray-500 text-xs hidden sm:table-cell">{r.sub}</td>
                                                  <td className="py-2.5 text-right font-black text-amber-300 tabular-nums">{r.score}</td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          )}
                      </div>
                  );
}
window.ComunidadPanel = ComunidadPanel;