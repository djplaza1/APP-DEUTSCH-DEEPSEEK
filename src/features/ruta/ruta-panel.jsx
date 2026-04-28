function RutaPanel(rawProps) {
  const noop = () => {};
  const p = { ...(rawProps || {}) };
  if (!p.rutaProgress || typeof p.rutaProgress !== 'object') p.rutaProgress = { playTimeMs: 0, lessonsCompleted: 0, completed: {} };
  if (!p.rutaVerbDb || typeof p.rutaVerbDb !== 'object') p.rutaVerbDb = { verbs: [] };
  if (!p.rutaArticleDb || typeof p.rutaArticleDb !== 'object') p.rutaArticleDb = { artikel: [] };
  if (p.rutaSubTab == null) p.rutaSubTab = 'camino';
  if (p.rutaMentor == null) p.rutaMentor = 'lena';
  if (p.rutaFillInput == null) p.rutaFillInput = '';
  if (p.rutaTopicFilter == null) p.rutaTopicFilter = 'all';
  if (p.sfxEpoch == null) p.sfxEpoch = 0;
  if (!Array.isArray(p.placementQuestions)) p.placementQuestions = [];
  if (p.placementIndex == null) p.placementIndex = 0;
  if (!Array.isArray(p.placementAnswers)) p.placementAnswers = [];
  if (!p.rutaPdfPack || typeof p.rutaPdfPack !== 'object') p.rutaPdfPack = { keywords: [], phrases: [] };
  if (!p.rutaPdfGapIdx) p.rutaPdfGapIdx = 0;
  if (p.rutaPdfGapInput == null) p.rutaPdfGapInput = '';
  if (!p.rutaPdfFeedback) p.rutaPdfFeedback = {};
  if (!p.rutaPdfCoachStats) p.rutaPdfCoachStats = {};
  if (!p.celebrationModal) p.celebrationModal = null;
  if (p.coinsUiLabel == null) p.coinsUiLabel = '';
  if (p.userStats == null) p.userStats = {};
  Object.keys(p).forEach((k) => {
    if (k.startsWith('set') && typeof p[k] !== 'function') p[k] = noop;
  });
  const fnz = [
    'runSingleSubmitAction', 'handleExerciseEnterSubmit', 'completeRutaLesson', 'startRutaListen', 'speakRutaDe',
    'startPlacementTest', 'handlePlacementAnswer', 'selectQuestionsForLevel', 'calculateRecommendedLevel', 'finishPlacementWithLevel',
    'checkRutaFillAnswer', 'checkRutaSpeakAnswer', 'saveProgress', 'mergeActivityPoints',
  ];
  fnz.forEach((k) => { if (typeof p[k] !== 'function') p[k] = noop; });
  if (p.activeTab == null) p.activeTab = 'ruta';
  if (p.practiceActive == null) p.practiceActive = false;
  if (p.isListening == null) p.isListening = false;
  if (!p.rutaLevels || !Array.isArray(p.rutaLevels)) {
    p.rutaLevels = (typeof window !== 'undefined' && window.MULLER_RUTA_LEVELS) ? window.MULLER_RUTA_LEVELS : [];
  }
  const {
    activeTab, practiceActive,
    rutaLevels, rutaProgress, rutaSubTab, setRutaSubTab,
    rutaRun, setRutaRun,
    rutaMentor, setRutaMentor,
    rutaFillInput, setRutaFillInput,
    rutaSpeakErr, setRutaSpeakErr,
    rutaTopicFilter, setRutaTopicFilter,
    rutaPdfPack, setRutaPdfPack,
    rutaPdfGapIdx, setRutaPdfGapIdx,
    rutaPdfGapInput, setRutaPdfGapInput,
    rutaPdfFeedback, setRutaPdfFeedback,
    rutaPdfCoachStats, setRutaPdfCoachStats,
    rutaListening, setRutaListening,
    rutaTranscript, setRutaTranscript,
    placementQuestions, setPlacementQuestions,
    placementAnswers, setPlacementAnswers,
    placementIndex, setPlacementIndex,
    placementLevel, setPlacementLevel,
    placementScore, setPlacementScore,
    placementFinished, setPlacementFinished,
    startPlacementTest, handlePlacementAnswer, selectQuestionsForLevel,
    calculateRecommendedLevel, finishPlacementWithLevel,
    checkRutaFillAnswer, checkRutaSpeakAnswer,
    runSingleSubmitAction, handleExerciseEnterSubmit,
    completeRutaLesson, startRutaListen, speakRutaDe,
    rutaVerbDb, rutaArticleDb,
    isListening,
    sfxEpoch, setSfxEpoch,
    celebrationModal, setCelebrationModal,
    saveProgress, mergeActivityPoints, coinsUiLabel, userStats
  } = p;
  const ExerciseHelpBtn = window.ExerciseHelpBtn || (() => null);
  /* ── AVATARES DiceBear + animación CSS ── */
  /* Avatares locales con SVG inline — sin dependencia externa, siempre visibles */
  const RUTA_AVATARS = useMemo(() => [
    { id: 'plaza', name: 'Plaza Müller',  bg: '#2563eb',  fg: '#60a5fa', emoji: '🧑‍🏫' },
    { id: 'laura', name: 'Laura Müller',  bg: '#e11d48',  fg: '#fda4af', emoji: '👩‍🦰' },
    { id: 'anna',  name: 'Anna',          bg: '#16a34a',  fg: '#86efac', emoji: '👩' },
    { id: 'hans',  name: 'Hans',          bg: '#ea580c',  fg: '#fdba74', emoji: '👨' },
    { id: 'maria', name: 'Maria',         bg: '#7c3aed',  fg: '#c4b5fd', emoji: '👩‍🦳' },
  ], []);
  /* Exponer avatares globalmente para b-app2.jsx */
  if (typeof window !== 'undefined') {
    window.__RUTA_AVATARS = RUTA_AVATARS;
    window.__randomExerciseAvatar = () => {
      const ids = ['plaza', 'laura', 'anna', 'hans', 'maria'];
      return ids[Math.floor(Math.random() * ids.length)];
    };
  }
  const [currentAvatarId, setCurrentAvatarId] = useState('plaza');
  const [avatarSpeaking, setAvatarSpeaking] = useState(false);
  const avatarRef = useRef(null);
  const currentAvatar = useMemo(() => RUTA_AVATARS.find(a => a.id === currentAvatarId) || RUTA_AVATARS[0], [currentAvatarId, RUTA_AVATARS]);
  /* Hook: detectar fin de TTS para desactivar animación boca */
  useEffect(() => {
    if (!avatarSpeaking) return;
    const timer = setTimeout(() => setAvatarSpeaking(false), 800);
    return () => clearTimeout(timer);
  }, [avatarSpeaking]);
  /* Componente Avatar */
  const RutaAvatar = useCallback(({ size = 80, avatarId, className = '' }) => {
    const av = RUTA_AVATARS.find(a => a.id === avatarId) || currentAvatar;
    const isSpeaking = avatarSpeaking && avatarId === currentAvatarId;
    const emojiSize = Math.round(size * 0.45);
    return (
      <div className={`relative inline-flex flex-col items-center ${className}`} style={{ width: size, height: size + 20 }}>
        <div className={`rounded-full overflow-hidden border-2 transition-all duration-300 flex items-center justify-center ${isSpeaking ? 'border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105' : 'border-white/20'}`} style={{ width: size, height: size, background: `linear-gradient(135deg, ${av.bg}, ${av.fg || av.bg})` }}>
          <span ref={avatarRef} className={`select-none leading-none transition-all duration-150 ${isSpeaking ? 'animate-ruta-avatar-talk' : ''}`} style={{ fontSize: emojiSize, filter: isSpeaking ? 'brightness(1.2)' : 'none' }}>{av.emoji}</span>
        </div>
        <p className="text-[10px] font-bold text-white/80 mt-1 truncate max-w-[100px] text-center">{av.name}</p>
        {isSpeaking && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
            <span className="w-1 h-2 bg-emerald-400 rounded-full animate-ruta-avatar-bar" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-3 bg-emerald-400 rounded-full animate-ruta-avatar-bar" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1.5 bg-emerald-400 rounded-full animate-ruta-avatar-bar" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    );
  }, [RUTA_AVATARS, currentAvatar, currentAvatarId, avatarSpeaking]);
  /* Helper: seleccionar avatar aleatorio y disparar TTS con animación */
  const speakWithAvatar = useCallback((text, avatarId) => {
    if (!text) return;
    setCurrentAvatarId(avatarId);
    setAvatarSpeaking(true);
    if (typeof speakRutaDe === 'function') speakRutaDe(text);
  }, [speakRutaDe]);
  /* Helper: avatar aleatorio para ejercicios */
  const randomExerciseAvatar = useCallback(() => {
    const ids = ['plaza', 'laura', 'anna', 'hans', 'maria'];
    return ids[Math.floor(Math.random() * ids.length)];
  }, []);
  return (
                      <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                              <div>
                              <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 mb-2"><Icon name="map" className="w-9 h-9 md:w-12 md:h-12 text-fuchsia-400" /> Ruta A0 → C1</h1>
                                  <p className="text-gray-400 text-sm md:text-base max-w-2xl">Camino desde cero: frases, huecos, voz y recompensas. Tecla <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 font-mono text-xs">R</kbd>.</p>
                              </div>
                              <ExerciseHelpBtn helpId="nav_ruta" />
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mb-4 rounded-2xl border border-white/10 bg-black/35 p-4">
                              <span className="text-xs font-bold uppercase text-gray-500">Mentor (voz)</span>
                              {[
                                  { id: 'lena', label: 'Frau Lena', sub: 'voz clara' },
                                  { id: 'tom', label: 'Herr Tom', sub: 'grave' },
                                  { id: 'lina', label: 'Lina', sub: 'aguda' },
                              ].map((m) => (
                                  <button key={m.id} type="button" onClick={() => { setRutaMentor(m.id); window.__mullerPlaySfx && window.__mullerPlaySfx('tick'); }} className={`rounded-xl px-3 py-2 text-left text-xs font-bold border transition ${rutaMentor === m.id ? 'bg-fuchsia-600 border-fuchsia-400 text-white' : 'bg-slate-900/80 border-white/10 text-gray-400 hover:text-white'}`}>
                                      <span className="block">{m.label}</span>
                                      <span className="text-[10px] font-normal opacity-80">{m.sub}</span>
                                  </button>
                              ))}
                              <button type="button" onClick={() => { try { localStorage.setItem('muller_sfx_enabled', (typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled()) ? '0' : '1'); } catch (e) {} setSfxEpoch((x) => x + 1); }} className="ml-auto text-xs font-bold rounded-xl border border-white/15 px-3 py-2 text-gray-300 hover:bg-white/10" title="Acierto, fallo y fanfarria cada 5 aciertos seguidos (5, 10, 15…)">
                                  Sonidos: {sfxEpoch >= 0 && typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled() ? 'ON' : 'OFF'}
                              </button>
                          </div>
                          <p className="text-[11px] text-gray-500 mb-4">Tiempo en Ruta (aprox.): {Math.round((rutaProgress.playTimeMs || 0) / 60000)} min · Lecciones completadas: {rutaProgress.lessonsCompleted || 0}</p>
                          <div className="mb-4 rounded-2xl border border-fuchsia-500/30 bg-gradient-to-r from-slate-900/80 via-fuchsia-950/45 to-slate-900/80 p-3 md:p-4 flex flex-wrap items-center gap-3">
                              <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/20 overflow-hidden bg-gradient-to-br from-amber-200 via-rose-200 to-violet-200 ${rutaListening || isListening ? 'animate-pulse' : ''}`}>
                                  <div className="absolute inset-x-0 bottom-0 h-4 bg-rose-300/70" />
                                  <div className="absolute left-3 top-5 w-2 h-2 rounded-full bg-slate-700" />
                                  <div className="absolute right-3 top-5 w-2 h-2 rounded-full bg-slate-700" />
                                  <div className={`absolute left-1/2 -translate-x-1/2 bottom-2 rounded-full bg-slate-700 ${rutaListening || isListening ? 'w-4 h-2' : 'w-3 h-1'}`} />
                              </div>
                              <div className="min-w-[220px]">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-fuchsia-300">Tutor Ruta</p>
                                  <p className="text-sm font-bold text-white">Entrenador guiado desde cero (A0 → C1)</p>
                                  <p className="text-[11px] text-gray-400">Banco de verbos detectado: <strong className="text-fuchsia-300">{(rutaVerbDb.verbs || []).length}</strong> entradas.</p>
                              </div>
                          </div>
                          {!rutaRun ? (
                              <>
                                  <div className="flex flex-wrap gap-2 mb-6">
                                      {[
                                          { id: 'camino', label: 'Camino' },
                                          { id: 'gramatica', label: 'Gramática' },
                                          { id: 'test', label: 'Test nivel' },
                                          { id: 'pdf', label: 'PDF Coach' },
                                      ].map((t) => (
                                          <button key={t.id} type="button" onClick={() => setRutaSubTab(t.id)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${rutaSubTab === t.id ? 'bg-fuchsia-600 border-fuchsia-400 text-white' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>{t.label}</button>
                                      ))}
                                  </div>
                                  {rutaSubTab === 'camino' && (
                                      <div className="space-y-6">
                                          <div className="rounded-2xl border border-fuchsia-500/25 bg-slate-900/45 p-3 md:p-4">
                                              <p className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-300 mb-2">Sección temática</p>
                                              <div className="flex flex-wrap gap-2">
                                                  {[
                                                      { id: 'all', label: 'Todo' },
                                                      { id: 'presentacion', label: 'Presentación' },
                                                      { id: 'familia', label: 'Familia' },
                                                      { id: 'trabajo', label: 'Trabajo' },
                                                      { id: 'alimentos', label: 'Alimentos' },
                                                      { id: 'vivienda', label: 'Vivienda' },
                                                      { id: 'viajes', label: 'Viajes' },
                                                      { id: 'salud', label: 'Salud' },
                                                      { id: 'tiempo_libre', label: 'Tiempo libre' },
                                                      { id: 'conectores', label: 'Conectores' },
                                                      { id: 'gramatica', label: 'Gramática' }
                                                  ].map((t) => (
                                                      <button key={t.id} type="button" onClick={() => setRutaTopicFilter(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${rutaTopicFilter === t.id ? 'bg-fuchsia-600 border-fuchsia-400 text-white' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>{t.label}</button>
                                                  ))}
                                              </div>
                                          </div>
                                          {(rutaLevels || []).map((lv, levelIdx) => (
                                              <div key={lv.id} className="rounded-2xl border border-fuchsia-500/25 bg-slate-900/50 p-4 md:p-5">
                                                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                                                      <h3 className="text-lg font-black text-white">{lv.title}</h3>
                                                      <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">{lv.badge}</span>
                                                  </div>
                                                  <div className="flex flex-col gap-2">
                                                      {lv.lessons
                                                          .map((lesson, origIdx) => ({ lesson, origIdx }))
                                                          .filter(({ lesson }) => rutaTopicFilter === 'all' || (lesson.topic || '') === rutaTopicFilter)
                                                          .map(({ lesson, origIdx }) => {
                                                          const unlocked = typeof window.mullerRutaIsLessonUnlocked === 'function' && window.mullerRutaIsLessonUnlocked(rutaLevels || [], levelIdx, origIdx, rutaProgress.completed || {});
                                                          const done = !!(rutaProgress.completed && rutaProgress.completed[lesson.id]);
                                                          return (
                                                              <button key={lesson.id} type="button" disabled={!unlocked} onClick={() => { if (!unlocked) return; setRutaRun({ levelIdx, lessonIdx: origIdx, step: 0 }); setRutaFillInput(''); setRutaTranscript(''); setRutaSpeakErr(''); }} className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition ${!unlocked ? 'opacity-40 cursor-not-allowed border-white/5' : done ? 'border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40' : 'border-white/15 bg-black/30 hover:bg-fuchsia-950/40'}`}>
                                                                  <span className="font-bold text-white">{lesson.title}</span>
                                                                  <span className="text-[10px] uppercase tracking-wider text-cyan-300/90">{String(lesson.topic || 'general').replace('_', ' ')}</span>
                                                                  <span className="text-xs font-bold text-amber-300">+{lesson.rewardCoins} · {lesson.rewardXp} XP</span>
                                                                  {done ? <span className="text-xs text-emerald-400">Hecho</span> : unlocked ? <span className="text-xs text-fuchsia-300">Empezar</span> : <span className="text-xs text-gray-500">Bloqueado</span>}
                                                              </button>
                                                          );
                                                      })}
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  )}
                                  {rutaSubTab === 'gramatica' && (
                                      <div className="space-y-4">
                                          <div className="flex justify-end"><ExerciseHelpBtn helpId="ruta_gramatica" /></div>
                                          {(window.MULLER_GRAMMAR_REF || []).map((sec) => (
                                              <div key={sec.level} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:p-5">
                                                  <h3 className="text-fuchsia-300 font-black text-lg mb-1">{sec.level} — {sec.title}</h3>
                                                  <div className="space-y-3 mt-3">
                                                      {sec.blocks.map((b, bi) => (
                                                          <div key={bi} className="rounded-xl border border-white/5 bg-black/25 p-3">
                                                              <p className="text-white font-bold text-sm">{b.t}</p>
                                                              <p className="text-gray-400 text-sm mt-1 leading-relaxed">{b.b}</p>
                                                          </div>
                                                      ))}
                                                  </div>
                                              </div>
                                          ))}
                                          <p className="text-xs text-gray-500">Ampliaremos con más temas y ejemplos conforme añadas contenido al camino.</p>
                                      </div>
                                  )}
  {rutaSubTab === 'pdf' && (
  <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-950/20 p-5 md:p-6 space-y-4">
    {!rutaPdfPack ? (
      <>
        <p className="text-white font-bold text-lg">Ruta desde PDF (Menschen Coach)</p>
        <p className="text-gray-300 text-sm">
          Desde Lectura &gt; PDF estudio, usa "Analizar página" y luego "Enviar a Ruta" para traer vocabulario, frases y ejercicios.
        </p>
      </>
    ) : (
      <>
        {(() => {
          const st = rutaPdfPack && rutaPdfCoachStats ? rutaPdfCoachStats[String(rutaPdfPack.id || '')] : null;
          const dueCount = st && Array.isArray(st.srs) ? st.srs.filter((c) => (Number(c.dueAt) || 0) <= Date.now()).length : 0;
          const dueCard = st && Array.isArray(st.srs) ? (st.srs.filter((c) => (Number(c.dueAt) || 0) <= Date.now()).sort((a, b) => (Number(a.dueAt) || 0) - (Number(b.dueAt) || 0))[0] || null) : null;
          const acc = st && st.attempts ? Math.round((100 * (st.correct || 0)) / Math.max(1, st.attempts)) : 0;
          const topErr = st && st.errorWords ? Object.entries(st.errorWords).sort((a, b) => b[1] - a[1]).slice(0, 5) : [];
          return (
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/25 p-3 space-y-2">
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <p className="text-xs text-indigo-200 font-black uppercase tracking-wider">Menschen Coach Pro</p>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 cursor-pointer">
                    Importar progreso
                    <input type="file" accept="application/json" className="hidden" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) importRutaPdfCoachProgress(f); e.target.value = ''; }} />
                  </label>
                  <button type="button" onClick={exportRutaPdfCoachProgress} className="px-3 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold border border-indigo-400/40">Exportar progreso</button>
                </div>
              </div>
              <p className="text-[11px] text-indigo-100/90">Plan diario: 10 min huecos, 10 min dictado con frases ejemplo, 8 tarjetas SRS ({dueCount} vencidas).</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Intentos</span><br /><strong className="text-white">{st ? (st.attempts || 0) : 0}</strong></p>
                <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Aciertos</span><br /><strong className="text-emerald-300">{st ? (st.correct || 0) : 0}</strong></p>
                <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Precisión</span><br /><strong className="text-cyan-300">{acc}%</strong></p>
                <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">SRS vencidas</span><br /><strong className="text-amber-300">{dueCount}</strong></p>
              </div>
              {dueCard ? (
                <div className="rounded-lg border border-amber-500/30 bg-amber-950/25 p-2 space-y-2">
                  <p className="text-[11px] text-amber-200 font-bold">SRS rápida: {dueCard.de} (box {dueCard.box || 1})</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => runSingleSubmitAction('ruta-pdf-srs-again', () => rateRutaPdfSrsCard(dueCard.de, 'again'))} className="px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-600 text-white text-[11px] font-bold">Otra vez</button>
                    <button type="button" onClick={() => runSingleSubmitAction('ruta-pdf-srs-hard', () => rateRutaPdfSrsCard(dueCard.de, 'hard'))} className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold">Difícil</button>
                    <button type="button" onClick={() => runSingleSubmitAction('ruta-pdf-srs-easy', () => rateRutaPdfSrsCard(dueCard.de, 'easy'))} className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold">Fácil</button>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-gray-400">Sin tarjetas SRS vencidas ahora mismo.</p>
              )}
              {topErr.length > 0 ? <p className="text-[11px] text-rose-200">Errores frecuentes: {topErr.map(([w, n]) => `${w} (${n})`).join(', ')}</p> : <p className="text-[11px] text-gray-400">Sin errores frecuentes todavía.</p>}
            </div>
          );
        })()}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-white font-black">PDF · U{rutaPdfPack.unit || '-'} · L{rutaPdfPack.lesson || '-'} · página {rutaPdfPack.page || '-'}</p>
          <button type="button" onClick={() => { setRutaPdfPack(null); setRutaPdfFeedback(''); setRutaPdfGapInput(''); setRutaPdfGapIdx(0); }} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold border border-white/10">Limpiar bloque</button>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="text-xs text-fuchsia-300 font-black uppercase tracking-wider mb-1">Vocabulario clave</p>
          <p className="text-sm text-white leading-relaxed">{(rutaPdfPack.keywords || []).slice(0, 14).map((k) => k.de).join(', ') || '—'}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="text-xs text-cyan-300 font-black uppercase tracking-wider mb-1">Frases ejemplo</p>
          <ul className="space-y-1 text-sm text-cyan-100">
            {(rutaPdfPack.phrases || []).slice(0, 4).map((ph, i) => (<li key={i}>• {ph}</li>))}
          </ul>
          <button type="button" onClick={() => runSingleSubmitAction('ruta-pdf-mini-telc-send', sendRutaPdfMiniTelcToWriting)} className="mt-2 px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold border border-cyan-400/40">Enviar mini TELC a Escritura</button>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-emerald-300 font-black uppercase tracking-wider">Ejercicio huecos</p>
            <span className="text-[11px] text-emerald-100/80">Ítem {Math.min((rutaPdfGapIdx || 0) + 1, Math.max(1, (rutaPdfPack.exercises && rutaPdfPack.exercises.gaps ? rutaPdfPack.exercises.gaps.length : 1)))}</span>
          </div>
          <p className="text-white font-bold">
            {(rutaPdfPack.exercises && rutaPdfPack.exercises.gaps && rutaPdfPack.exercises.gaps[rutaPdfGapIdx] ? rutaPdfPack.exercises.gaps[rutaPdfGapIdx].prompt : 'Sin ejercicios disponibles')}
          </p>
          <input
            value={rutaPdfGapInput}
            onChange={(e) => setRutaPdfGapInput(e.target.value)}
            onKeyDown={(e) => handleExerciseEnterSubmit(e, 'ruta-pdf-gap-check', checkRutaPdfGap)}
            placeholder="Escribe la palabra que falta"
            className="w-full rounded-lg bg-black/45 border border-emerald-500/35 px-3 py-2 text-white text-sm outline-none focus:border-emerald-400"
          />
          {rutaPdfFeedback ? <p className="text-xs text-amber-200">{rutaPdfFeedback}</p> : null}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => runSingleSubmitAction('ruta-pdf-gap-check', checkRutaPdfGap)} className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black">Comprobar</button>
            <button type="button" onClick={() => runSingleSubmitAction('ruta-pdf-gap-next', () => { const total = Math.max(1, (rutaPdfPack.exercises && rutaPdfPack.exercises.gaps ? rutaPdfPack.exercises.gaps.length : 1)); setRutaPdfGapIdx((i) => (i + 1) % total); setRutaPdfGapInput(''); setRutaPdfFeedback(''); })} className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10">Siguiente hueco</button>
          </div>
        </div>
      </>
    )}
  </div>
)}
  {rutaSubTab === 'test' && (
  <div className="rounded-2xl border border-sky-500/30 bg-sky-950/30 p-5 md:p-6 space-y-4">
    {!placementQuestions.length ? (
      <>
        <p className="text-white font-bold text-lg">Test de nivel adaptativo</p>
        <p className="text-gray-300 text-sm">
          Responde unas preguntas para evaluar tu nivel de alemán. El test se adapta a tus respuestas.
        </p>
        <p className="text-xs text-gray-500">
          El test completo consta de aproximadamente 30 preguntas repartidas en niveles A1, A2, B1 y B2.
        </p>
        <button
          type="button"
          onClick={startPlacementTest}
          className="w-full rounded-xl bg-sky-600 hover:bg-sky-500 font-black py-3 text-white shadow-lg mt-4"
        >
          Comenzar test
        </button>
      </>
    ) : (
      <>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-sky-300">Nivel actual: {placementLevel}</span>
          <span className="text-xs text-gray-400">
            Pregunta {placementIndex + 1} de {placementQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-sky-500 h-2 rounded-full transition-all"
            style={{ width: `${((placementIndex + 1) / placementQuestions.length) * 100}%` }}
          />
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="text-white font-semibold text-lg mb-4">
            {placementQuestions[placementIndex]?.q}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {(placementQuestions[placementIndex]?.opts || []).map((opt, oi) => (
              <button
                key={oi}
                type="button"
                onClick={() => handlePlacementAnswer(oi)}
                className="text-left px-4 py-3 rounded-lg bg-slate-800 hover:bg-sky-900 text-white border border-white/10 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Responde con sinceridad. El test se adapta para encontrar tu nivel real.
        </p>
      </>
    )}
  </div>
)}
                              </>
                          ) : (() => {
                              const L = rutaLevels || [];
                              const lv = L[rutaRun.levelIdx];
                              const lesson = lv && lv.lessons[rutaRun.lessonIdx];
                              if (!lesson) return null;
                              const st = rutaRun.step || 0;
                              return (
                                  <div className="rounded-2xl border border-fuchsia-500/30 bg-black/40 p-5 md:p-8">
                                      <button type="button" onClick={() => { setRutaRun(null); setRutaFillInput(''); setRutaTranscript(''); setRutaSpeakErr(''); }} className="text-sm font-bold text-fuchsia-300 mb-4 hover:text-white">← Volver al camino</button>
                                      <h2 className="text-2xl font-black text-white mb-1">{lesson.title}</h2>
                                      <p className="text-xs text-fuchsia-400/90 mb-6">{lv.badge} · {lv.title}</p>
                                      {st === 0 && (
                                          <>
                                              <p className="text-sm text-violet-200/90 mb-4 rounded-xl bg-violet-950/50 border border-violet-500/25 p-4 leading-relaxed">{lesson.grammarTip}</p>
                                              {lesson.phrases.map((p, i) => {
                                                  const avId = randomExerciseAvatar();
                                                  return (
                                                  <div key={i} className="mb-4 rounded-xl border border-white/10 bg-slate-900/60 p-4">
                                                      <div className="flex items-start gap-4">
                                                          <RutaAvatar size={56} avatarId={avId} className="flex-shrink-0" />
                                                          <div className="flex-1">
                                                              <p className="text-lg font-bold text-white">{p.de}</p>
                                                              <p className="text-sm text-gray-400">{p.es}</p>
                                                              <button type="button" onClick={() => speakWithAvatar(p.de, avId)} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-fuchsia-300 hover:text-white"><Icon name="volume-2" className="w-4 h-4" /> Escuchar</button>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  );
                                              })}
                                              <button type="button" onClick={() => runSingleSubmitAction('ruta-to-fill-step', () => { setRutaRun({ ...rutaRun, step: 1 }); setRutaFillInput(''); setRutaSpeakErr(''); window.__mullerPlaySfx && window.__mullerPlaySfx('tick'); })} className="w-full rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 font-black py-3 text-white shadow-lg">Siguiente: huecos</button>
                                          </>
                                      )}
                                      {st === 1 && lesson.fill && (() => {
                                          const fillAvId = randomExerciseAvatar();
                                          return (
                                          <>
                                              <div className="flex items-start gap-4 mb-4">
                                                  <RutaAvatar size={56} avatarId={fillAvId} className="flex-shrink-0" />
                                                  <div className="flex-1">
                                                      <p className="text-white font-bold mb-3">{lesson.fill.prompt}</p>
                                                      {lesson.fill.hint ? <p className="text-xs text-gray-500 mb-2">Pista: {lesson.fill.hint}</p> : null}
                                                  </div>
                                              </div>
                                              <input value={rutaFillInput} onChange={(e) => setRutaFillInput(e.target.value)} onKeyDown={(e) => handleExerciseEnterSubmit(e, 'ruta-fill-submit', () => { if (checkRutaFillAnswer(lesson)) { setRutaRun({ ...rutaRun, step: 2 }); setRutaTranscript(''); setRutaSpeakErr(''); } })} className="w-full rounded-xl bg-black/50 border border-fuchsia-500/40 px-4 py-3 text-white text-lg mb-3 outline-none focus:border-fuchsia-400" placeholder="Tu respuesta" autoComplete="off" />
                                              {rutaSpeakErr ? <p className="text-amber-200 text-sm mb-2">{rutaSpeakErr}</p> : null}
                                              <button type="button" onClick={() => runSingleSubmitAction('ruta-fill-submit', () => { if (checkRutaFillAnswer(lesson)) { setRutaRun({ ...rutaRun, step: 2 }); setRutaTranscript(''); setRutaSpeakErr(''); } })} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 font-black py-3 text-white">Comprobar y continuar</button>
                                          </>
                                      )})()}
                                      {st === 2 && lesson.speak && (() => {
                                          const spAvId = randomExerciseAvatar();
                                          return (
                                          <>
                                              <div className="flex items-start gap-4 mb-4">
                                                  <RutaAvatar size={64} avatarId={spAvId} className="flex-shrink-0" />
                                                  <div className="flex-1">
                                                      <p className="text-gray-300 mb-2">Lee en voz alta en alemán:</p>
                                                      <p className="text-xl font-bold text-white mb-4 leading-snug">{lesson.speak.target}</p>
                                                  </div>
                                              </div>
                                              <div className="flex flex-wrap gap-2 mb-4">
                                                  <button type="button" onClick={() => speakWithAvatar(lesson.speak.target, spAvId)} className="rounded-xl bg-slate-800 border border-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">Escuchar modelo</button>
                                                  <button type="button" disabled={rutaListening} onClick={startRutaListen} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-500 disabled:opacity-50">{rutaListening ? 'Escuchando…' : 'Grabar'}</button>
                                              </div>
                                              {rutaTranscript ? <p className="text-sm text-emerald-200/90 mb-2">Detectado: {rutaTranscript}</p> : null}
                                              {rutaSpeakErr ? <p className="text-amber-200 text-sm mb-2">{rutaSpeakErr}</p> : null}
                                              <button
                                                  type="button"
                                                  onClick={() => runSingleSubmitAction('ruta-speak-validate', () => {
                                                      if (checkRutaSpeakAnswer(lesson.speak.target)) completeRutaLesson(rutaRun.levelIdx, rutaRun.lessonIdx);
                                                  })}
                                                  className="w-full rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 font-black py-3 text-white shadow-lg"
                                              >
                                                  Validar y completar lección
                                              </button>
                                              <button
                                                  type="button"
                                                  onClick={() => runSingleSubmitAction('ruta-speak-skip', () => {
                                                      setRutaSpeakErr('');
                                                      completeRutaLesson(rutaRun.levelIdx, rutaRun.lessonIdx);
                                                  })}
                                                  className="w-full mt-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold py-2.5 text-gray-200 border border-white/15"
                                              >
                                                  Continuar sin grabar voz
                                              </button>
                                              <p className="text-[11px] text-gray-500 mt-2">Si hoy no puedes usar micrófono, puedes avanzar igualmente y practicar voz después.</p>
                                          </>
                                      )})()}
                                  </div>
                              );
                          })()}
                      </div>
                    );
}
window.RutaPanel = RutaPanel;
