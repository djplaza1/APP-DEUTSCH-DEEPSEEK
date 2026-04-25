function ProfileSettingsModal(props) {
    const {
        showProfileSettingsModal,
        setShowProfileSettingsModal,
        profileSettingsTab,
        setProfileSettingsTab,
        userStats,
        coinsUiLabel,
        unifiedAuth,
        mullerMaskEmail,
        profileNameDraft,
        setProfileNameDraft,
        profileNameBusy,
        setProfileNameBusy,
        setProfileNameMsg,
        saveProgress,
        setAuthTick,
        setSupabaseProfile,
        supabaseUser,
        profileNameMsg,
        mullerGetSupabaseClient,
        mullerAccountsLoad,
        mullerAccountsSave,
        setSupabaseUser,
        mullerAuthLogout,
        setAuthPassword,
        authMode,
        setAuthMode,
        authError,
        setAuthError,
        authEmail,
        setAuthEmail,
        authPassword,
        setAuthDisplayName,
        authDisplayName,
        authBusy,
        setAuthBusy,
        mullerAuthRegister,
        mullerAuthLogin,
        setUiTheme,
        uiTheme,
        MULLER_THEME_KEY,
        setSfxEpoch,
        sfxEpoch,
        noiseEnabled,
        setNoiseEnabled,
        MULLER_TTS_RATE_KEY,
        setTtsPrefsEpoch,
        setShowFloatingTools,
        showFloatingTools,
        setReduceMotionUi,
        reduceMotionUi,
        setPodcastMode,
        podcastMode,
        setHistoriaAudioOnly,
        historiaAudioOnly,
        MULLER_ONBOARDING_KEY,
        setShowOnboarding,
        setOnboardingNever,
        setShowMullerHub,
        setMullerHubTab,
    } = props;
    return (
        showProfileSettingsModal && (
                  <div className="fixed inset-0 z-[140] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowProfileSettingsModal(false)} role="presentation">
                      <div className="bg-slate-900 border border-sky-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Perfil y ajustes">
                          <div className="flex items-center justify-between gap-2 p-4 border-b border-white/10 bg-black/35">
                              <h2 className="text-lg md:text-2xl font-black text-white flex items-center gap-2"><Icon name="settings" className="w-5 h-5 md:w-6 md:h-6 text-sky-300" /> Perfil y ajustes premium</h2>
                              <button type="button" onClick={() => setShowProfileSettingsModal(false)} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/20 text-gray-300 hover:bg-white/10">Cerrar</button>
                          </div>
                          <div className="p-3 border-b border-white/10 flex flex-wrap gap-2 bg-black/20">
                              {[
                                  { id: 'perfil', label: 'Perfil' },
                                  { id: 'ajustes', label: 'Ajustes' },
                                  { id: 'atajos', label: 'Atajos' },
                              ].map((t) => (
                                  <button key={t.id} type="button" onClick={() => setProfileSettingsTab(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${profileSettingsTab === t.id ? 'bg-sky-600 border-sky-400 text-white' : 'bg-slate-800 border-white/10 text-gray-400 hover:text-white'}`}>{t.label}</button>
                              ))}
                          </div>
                          <div className="p-4 md:p-5 overflow-y-auto max-h-[calc(90vh-8.5rem)]">
                              {profileSettingsTab === 'perfil' && (
                                  <div className="space-y-4">
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                          <div><p className="text-gray-500">Usuario</p><p className="font-black text-white truncate">{userStats.username || 'Estudiante'}</p></div>
                                          <div><p className="text-gray-500">Vidas</p><p className="font-black text-red-300">{userStats.hearts}</p></div>
                                          <div><p className="text-gray-500">Monedas</p><p className="font-black text-amber-300">{coinsUiLabel}</p></div>
                                          <div><p className="text-gray-500">Racha</p><p className="font-black text-orange-300">{userStats.streakDays || 0} días</p></div>
                                      </div>
                                      {unifiedAuth ? (
                                          <div className="space-y-3">
                                              <p className="text-sm text-emerald-300 font-bold">Sesión iniciada · {unifiedAuth.source === 'supabase' ? 'Supabase' : 'Local'}</p>
                                              <p className="text-xs text-gray-400">Email: {mullerMaskEmail(unifiedAuth.email)}</p>
                                              <div className="rounded-xl border border-white/10 bg-black/25 p-3 space-y-2">
                                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">Cambiar nombre visible</label>
                                                  <div className="flex flex-col sm:flex-row gap-2">
                                                      <input type="text" value={profileNameDraft} onChange={(e) => setProfileNameDraft(e.target.value)} className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500" placeholder="Ej: SuperKlaus" />
                                                      <button type="button" disabled={profileNameBusy} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-bold text-sm"
                                                          onClick={async () => {
                                                              const nextName = String(profileNameDraft || '').trim();
                                                              if (!nextName) { setProfileNameMsg('Escribe un nombre válido.'); return; }
                                                              setProfileNameBusy(true); setProfileNameMsg('');
                                                              try {
                                                                  if (unifiedAuth.source === 'supabase') {
                                                                      const client = mullerGetSupabaseClient();
                                                                      if (!client || !supabaseUser) throw new Error('Supabase no disponible');
                                                                      const { error: e1 } = await client.auth.updateUser({ data: { display_name: nextName } });
                                                                      if (e1) throw new Error(e1.message);
                                                                      const { error: e2 } = await client.from('profiles').upsert({ id: supabaseUser.id, display_name: nextName, updated_at: new Date().toISOString() }, { onConflict: 'id' });
                                                                      if (e2) throw new Error(e2.message);
                                                                      setSupabaseProfile((p) => ({ ...(p || {}), id: supabaseUser.id, display_name: nextName, updated_at: new Date().toISOString() }));
                                                                  } else {
                                                                      const map = mullerAccountsLoad(); const em = unifiedAuth.email;
                                                                      if (map[em]) { map[em].displayName = nextName; mullerAccountsSave(map); }
                                                                  }
                                                                  saveProgress({ username: nextName }); setAuthTick((x) => x + 1); setProfileNameMsg('Nombre actualizado.');
                                                              } catch (err) {
                                                                  setProfileNameMsg('No se pudo actualizar: ' + (err && err.message ? err.message : 'error'));
                                                              } finally { setProfileNameBusy(false); }
                                                          }}>{profileNameBusy ? 'Guardando…' : 'Guardar nombre'}</button>
                                                  </div>
                                                  {profileNameMsg ? <p className="text-xs text-gray-400">{profileNameMsg}</p> : null}
                                              </div>
                                              <button type="button" className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm border border-white/10"
                                                  onClick={async () => {
                                                      const client = mullerGetSupabaseClient();
                                                      if (unifiedAuth.source === 'supabase' && client) { try { await client.auth.signOut(); } catch (err) {} setSupabaseUser(null); setSupabaseProfile(null); }
                                                      mullerAuthLogout(); setAuthTick((x) => x + 1); setAuthPassword(''); setShowProfileSettingsModal(false);
                                                  }}>Cerrar sesión</button>
                                          </div>
                                      ) : (
                                          <div className="space-y-3">
                                              <div className="flex gap-2">
                                                  <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${authMode === 'login' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-500'}`}>Entrar</button>
                                                  <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${authMode === 'register' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-500'}`}>Registro gratis</button>
                                              </div>
                                              {authError ? <p className="text-sm text-red-400 font-semibold">{authError}</p> : null}
                                              <input type="email" autoComplete="email" className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="Email" />
                                              <input type="password" autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Contraseña (mín. 6)" />
                                              {authMode === 'register' ? <input type="text" className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authDisplayName} onChange={(e) => setAuthDisplayName(e.target.value)} placeholder="Nombre visible" /> : null}
                                              <button type="button" disabled={authBusy} className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-black text-white"
                                                  onClick={async () => {
                                                      setAuthBusy(true); setAuthError('');
                                                      const errMap = { CRYPTO_UNAVAILABLE: 'Necesitas https o localhost para registrar con cifrado seguro.', EMAIL_INVALID: 'Introduce un email válido.', PASS_SHORT: 'La contraseña debe tener al menos 6 caracteres.', EMAIL_TAKEN: 'Ese email ya está registrado en este dispositivo.', BAD_CREDENTIALS: 'Email o contraseña incorrectos.' };
                                                      try {
                                                          const client = mullerGetSupabaseClient();
                                                          if (client) {
                                                              const em = authEmail.trim();
                                                              if (authMode === 'register') {
                                                                  const dn = (authDisplayName || userStats.username || 'Estudiante').trim();
                                                                  const { data, error } = await client.auth.signUp({ email: em, password: authPassword, options: { data: { display_name: dn } } });
                                                                  if (error) throw new Error(error.message);
                                                                  saveProgress({ username: dn });
                                                                  if (data.session && data.session.user) setSupabaseUser(data.session.user); else if (data.user) setSupabaseUser(data.user);
                                                              } else {
                                                                  const { data, error } = await client.auth.signInWithPassword({ email: em, password: authPassword });
                                                                  if (error) throw new Error(error.message);
                                                                  if (data.user) { setSupabaseUser(data.user); const meta = data.user.user_metadata && data.user.user_metadata.display_name; if (meta) saveProgress({ username: String(meta) }); }
                                                              }
                                                          } else if (authMode === 'register') { const acc = await mullerAuthRegister(authEmail, authPassword, authDisplayName || userStats.username); saveProgress({ username: acc.displayName }); }
                                                          else { const acc = await mullerAuthLogin(authEmail, authPassword); saveProgress({ username: acc.displayName }); }
                                                          setAuthPassword(''); setAuthTick((x) => x + 1); setShowProfileSettingsModal(false);
                                                      } catch (err) { setAuthError(errMap[err.message] || err.message || 'Error'); }
                                                      finally { setAuthBusy(false); }
                                                  }}>{authBusy ? '…' : authMode === 'register' ? 'Crear cuenta' : 'Entrar'}</button>
                                          </div>
                                      )}
                                  </div>
                              )}
                              {profileSettingsTab === 'ajustes' && (
                                  <div className="space-y-4">
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                                          <p className="text-xs font-bold uppercase tracking-widest text-sky-300 mb-2">Tema global</p>
                                          <div className="flex flex-wrap gap-2">
                                              {[{ id: 'dark', label: 'Oscuro' }, { id: 'light', label: 'Claro' }, { id: 'hc', label: 'Alto contraste' }].map((t) => (
                                                  <button key={t.id} type="button" onClick={() => { setUiTheme(t.id); try { localStorage.setItem(MULLER_THEME_KEY, t.id); } catch (e) {} }} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${uiTheme === t.id ? 'bg-cyan-600 border-cyan-300 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`}>{t.label}</button>
                                              ))}
                                          </div>
                                      </div>
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                                          <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-300 mb-2">Audio y voz</p>
                                          <div className="flex flex-wrap gap-2 mb-3">
                                              <button type="button" onClick={() => { try { localStorage.setItem('muller_sfx_enabled', (typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled()) ? '0' : '1'); } catch (e) {} setSfxEpoch((x) => x + 1); }} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/15 bg-slate-800 text-gray-200">Sonidos: {sfxEpoch >= 0 && typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled() ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => setNoiseEnabled(!noiseEnabled)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${noiseEnabled ? 'bg-amber-600 border-amber-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Ruido examen: {noiseEnabled ? 'ON' : 'OFF'}</button>
                                          </div>
                                          <p className="text-[11px] text-gray-500 mb-2">Velocidad TTS global</p>
                                          <div className="flex flex-wrap gap-2">
                                              {[{ id: 'Lenta', rate: '0.82' }, { id: 'Normal', rate: '0.92' }, { id: 'Examen', rate: '1.00' }].map((p) => (
                                                  <button key={p.id} type="button" className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${(typeof window !== 'undefined' && (localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') === p.rate) ? 'bg-violet-600 border-violet-400 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`} onClick={() => { try { localStorage.setItem(MULLER_TTS_RATE_KEY, p.rate); } catch (e) {} setTtsPrefsEpoch((x) => x + 1); }}>{p.id}</button>
                                              ))}
                                          </div>
                                      </div>
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                                          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-2">Preferencias de uso</p>
                                          <div className="flex flex-wrap gap-2">
                                              <button type="button" onClick={() => setShowFloatingTools((v) => !v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${showFloatingTools ? 'bg-cyan-700 border-cyan-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Herramientas rápidas (Ajustes): {showFloatingTools ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => setReduceMotionUi((v) => !v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${reduceMotionUi ? 'bg-emerald-700 border-emerald-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Reducir animaciones: {reduceMotionUi ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => setPodcastMode((v) => !v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${podcastMode ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Podcast: {podcastMode ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => setHistoriaAudioOnly((v) => !v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${historiaAudioOnly ? 'bg-violet-600 border-violet-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Solo audio: {historiaAudioOnly ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => { try { localStorage.setItem(MULLER_ONBOARDING_KEY, '1'); } catch (e) {} setShowOnboarding(false); setOnboardingNever(true); }} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/15 bg-slate-800 text-gray-300">Desactivar onboarding</button>
                                              <button type="button" onClick={() => { setShowMullerHub(true); setMullerHubTab('voices'); setShowProfileSettingsModal(false); }} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-sky-500/30 bg-sky-900/30 text-sky-200">Más ajustes de voces…</button>
                                          </div>
                                      </div>
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                                          <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-2">Respaldo y sincronización</p>
                                          <div className="flex flex-wrap gap-2">
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-export-full-backup'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-sky-500/35 bg-sky-900/35 text-sky-200">Exportar backup total</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-open-backup-import'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-500/35 bg-indigo-900/35 text-indigo-200">Importar backup</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-export-srs-only'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/35 bg-emerald-900/35 text-emerald-200">Exportar solo SRS</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-export-decks-only'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-500/35 bg-amber-900/35 text-amber-200">Exportar solo mazos</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-show-sync-help'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-teal-500/35 bg-teal-900/35 text-teal-200">Guía de sincronización</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-request-mic'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-green-500/35 bg-green-900/35 text-green-200">Permiso de micrófono</button>
                                          </div>
                                      </div>
                                  </div>
                              )}
                              {profileSettingsTab === 'atajos' && (
                                  <div className="space-y-2 text-sm text-gray-300">
                                      <p><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">?</kbd> Ayuda rápida</p>
                                      <p><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">I</kbd> Inicio · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">R</kbd> Ruta · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">H</kbd> Historia</p>
                                      <p><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">V</kbd> Vocab · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">P</kbd> Progreso · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">M</kbd> Centro Müller</p>
                                      <p><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">Esc</kbd> Cerrar modales</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              )
    );
}
window.ProfileSettingsModal = ProfileSettingsModal;
