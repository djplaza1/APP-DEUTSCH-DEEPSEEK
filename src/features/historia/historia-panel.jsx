function HistoriaPanel(rawProps) {
  const noop = () => {};
  const defaultGuion = (typeof window !== 'undefined' && window.__DEFAULT_GUION__ && window.__DEFAULT_GUION__.length)
    ? window.__DEFAULT_GUION__
    : [{ speaker: 'Lukas', text: 'Carga un guion o espera a que se conecte el estado de la app.', translation: '', vocab: [] }];

  const D = {
    historiaExerciseHelpId: 'historia_main',
    isDefaultScript: true,
    activeSavedScriptId: null,
    loadDefaultGuion: noop,
    loadSavedScript: noop,
    savedScripts: [],
    activeScriptTitle: 'Lektion 17',
    mode: 'dialogue',
    podcastMode: false,
    setFluesternMode: noop,
    fluesternMode: false,
    setNoiseEnabled: noop,
    noiseEnabled: false,
    setDiktatMode: noop,
    diktatMode: false,
    setBlindMode: noop,
    blindMode: false,
    setLueckentextMode: noop,
    lueckentextMode: false,
    setPuzzleMode: noop,
    puzzleMode: false,
    setDeclinaMode: noop,
    declinaMode: false,
    setArtikelSniperMode: noop,
    artikelSniperMode: false,
    resetModes: noop,
    stopAudio: noop,
    setTempusMode: noop,
    tempusMode: false,
    roleplayChar: 'none',
    setRoleplayChar: noop,
    historiaPlaylistAllScripts: false,
    oralQIdx: 0,
    setOralSecs: noop,
    oralSecs: 90,
    setOralDeadline: noop,
    setOralClock: noop,
    oralLeftSec: null,
    micMouseDownGuard: (fn) => () => { if (typeof fn === 'function') fn(); },
    handleVoiceStart: noop,
    handleVoiceStop: noop,
    micTouchStartGuard: (fn) => () => { if (typeof fn === 'function') fn(); },
    isListening: false,
    spokenText: '',
    pronunciationFeedback: [],
    runSingleSubmitAction: (_id, fn) => { if (typeof fn === 'function') fn(); },
    handleOralNextQuestion: noop,
    setMode: noop,
    setSpokenText: noop,
    saveProgress: noop,
    mergeActivityPoints: () => ({}),
    getActualSceneIndex: () => 0,
    guionData: defaultGuion,
    renderHighlightedText: (t) => t,
    setShowCurrentTranslation: noop,
    showCurrentTranslation: false,
    playSceneAudio: () => new SpeechSynthesisUtterance(''),
    sanitizeHistoriaSpeechText: (t) => String(t == null ? '' : t),
    grammarPolizeiMsg: null,
    pronunciationScore: null,
    handleNext: noop,
    puzzleAnswer: [],
    setPuzzleAnswer: noop,
    puzzleWords: [],
    setPuzzleWords: noop,
    showPuzzleResult: false,
    puzzleLastOk: false,
    handlePuzzleCheck: noop,
    setIsPlaying: noop,
    togglePlay: noop,
    isPlaying: false,
    isReviewing: false,
    diktatInput: '',
    setDiktatInput: noop,
    handleExerciseEnterSubmit: noop,
    handleDiktatCheck: noop,
    showDiktatResult: false,
    renderDiktatDiff: () => null,
    diktatMotivationMsg: null,
    historiaAudioOnly: false,
    sceneIndex: 0,
    handlePrev: noop,
    playbackRate: 1,
    setPlaybackRate: noop,
    setHistoriaAudioOnly: noop,
    tempusVerbList: [],
    tempusSelectedVerb: null,
    inferTempusContextLabel: () => '',
    showAITutor: noop,
    trySaveGrammarStructure: noop,
    showTutor: false,
    setShowTutor: noop,
    tutorMessage: '',
    showGrammarPrompt: false,
    setShowGrammarPrompt: noop,
    customGrammarInput: '',
    setCustomGrammarInput: noop,
    handleCustomGrammarSave: noop,
  };
  const props = { ...D, ...(rawProps || {}) };
  if (rawProps) {
    const forceArr = (k) => { if (rawProps[k] === null) props[k] = D[k]; };
    ['savedScripts', 'guionData', 'pronunciationFeedback', 'puzzleAnswer', 'puzzleWords', 'tempusVerbList'].forEach(forceArr);
  }
  props.savedScripts = Array.isArray(props.savedScripts) ? props.savedScripts : [];
  props.guionData = (props.guionData && props.guionData.length) ? props.guionData : defaultGuion;
  props.pronunciationFeedback = Array.isArray(props.pronunciationFeedback) ? props.pronunciationFeedback : [];
  props.puzzleAnswer = Array.isArray(props.puzzleAnswer) ? props.puzzleAnswer : [];
  props.puzzleWords = Array.isArray(props.puzzleWords) ? props.puzzleWords : [];
  props.tempusVerbList = Array.isArray(props.tempusVerbList) ? props.tempusVerbList : [];
  if (typeof props.getActualSceneIndex !== 'function') props.getActualSceneIndex = () => 0;
  if (typeof props.renderHighlightedText !== 'function') {
    props.renderHighlightedText = (t, v) => t;
  }
  if (typeof props.renderDiktatDiff !== 'function') props.renderDiktatDiff = () => null;
  if (typeof props.inferTempusContextLabel !== 'function') props.inferTempusContextLabel = () => '';
  if (typeof props.playSceneAudio !== 'function') props.playSceneAudio = () => new SpeechSynthesisUtterance('');
  if (typeof props.sanitizeHistoriaSpeechText !== 'function') props.sanitizeHistoriaSpeechText = (t) => String(t == null ? '' : t);
  if (typeof props.micMouseDownGuard !== 'function') props.micMouseDownGuard = (fn) => () => { if (typeof fn === 'function') fn(); };
  if (typeof props.micTouchStartGuard !== 'function') props.micTouchStartGuard = (fn) => () => { if (typeof fn === 'function') fn(); };
  if (typeof props.runSingleSubmitAction !== 'function') props.runSingleSubmitAction = (_id, fn) => { if (typeof fn === 'function') fn(); };

  const {
    historiaExerciseHelpId,
    isDefaultScript,
    activeSavedScriptId,
    loadDefaultGuion,
    loadSavedScript,
    savedScripts,
    activeScriptTitle,
    mode,
    podcastMode,
    setFluesternMode,
    fluesternMode,
    setNoiseEnabled,
    noiseEnabled,
    setDiktatMode,
    diktatMode,
    setBlindMode,
    blindMode,
    setLueckentextMode,
    lueckentextMode,
    setPuzzleMode,
    puzzleMode,
    setDeclinaMode,
    declinaMode,
    setArtikelSniperMode,
    artikelSniperMode,
    resetModes,
    stopAudio,
    setTempusMode,
    tempusMode,
    roleplayChar,
    setRoleplayChar,
    historiaPlaylistAllScripts,
    oralQIdx,
    setOralSecs,
    oralSecs,
    setOralDeadline,
    setOralClock,
    oralLeftSec,
    micMouseDownGuard,
    handleVoiceStart,
    handleVoiceStop,
    micTouchStartGuard,
    isListening,
    spokenText,
    pronunciationFeedback,
    runSingleSubmitAction,
    handleOralNextQuestion,
    setMode,
    setSpokenText,
    saveProgress,
    mergeActivityPoints,
    getActualSceneIndex,
    guionData,
    renderHighlightedText,
    setShowCurrentTranslation,
    showCurrentTranslation,
    playSceneAudio,
    sanitizeHistoriaSpeechText,
    grammarPolizeiMsg,
    pronunciationScore,
    handleNext,
    puzzleAnswer,
    setPuzzleAnswer,
    puzzleWords,
    setPuzzleWords,
    showPuzzleResult,
    puzzleLastOk,
    handlePuzzleCheck,
    setIsPlaying,
    togglePlay,
    isPlaying,
    isReviewing,
    diktatInput,
    setDiktatInput,
    handleExerciseEnterSubmit,
    handleDiktatCheck,
    showDiktatResult,
    renderDiktatDiff,
    diktatMotivationMsg,
    historiaAudioOnly,
    sceneIndex,
    handlePrev,
    playbackRate,
    setPlaybackRate,
    setHistoriaAudioOnly,
    tempusVerbList,
    tempusSelectedVerb,
    inferTempusContextLabel,
    showAITutor,
    trySaveGrammarStructure,
    showTutor,
    setShowTutor,
    tutorMessage,
    showGrammarPrompt,
    setShowGrammarPrompt,
    customGrammarInput,
    setCustomGrammarInput,
    handleCustomGrammarSave,
  } = props;
  const guionList = Array.isArray(guionData) ? guionData : [];
  const getScene = () => {
    if (!guionList.length) return { speaker: '—', text: '', translation: '', vocab: [], isRedemittel: false };
    const i = Math.min(Math.max(0, getActualSceneIndex()), guionList.length - 1);
    return guionList[i] || guionList[0];
  };
  const callHighlight = (text, voc) => renderHighlightedText(text, Array.isArray(voc) ? voc : []);
  const ExerciseHelpBtn = window.ExerciseHelpBtn || (() => null);
  return (
                     <div className="flex-1 flex flex-col relative w-full min-h-full justify-center items-center p-3 md:p-8">
                        <div className="absolute top-2 left-2 z-[12] flex flex-col gap-2 items-start max-w-[min(100%,min(420px,96vw))]">
                            <div className="flex flex-wrap gap-1 items-center">
                                <ExerciseHelpBtn helpId={historiaExerciseHelpId} />
                                <ExerciseHelpBtn helpId="historia_herramientas" compact className="!text-amber-200/95 !border-amber-500/25" title="Barra de herramientas (Diktat, huecos, artículos…)" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-2 py-1.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">Guion</span>
                                <select
                                    className="bg-zinc-900/90 text-white text-[11px] md:text-xs font-bold rounded-lg px-2 py-1.5 border border-white/15 outline-none max-w-[220px] md:max-w-[280px]"
                                    value={isDefaultScript ? '__default__' : (activeSavedScriptId ? String(activeSavedScriptId) : '__other__')}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if (v === '__default__') loadDefaultGuion();
                                        else if (v === '__other__') return;
                                        else {
                                            const s = (savedScripts || []).find((x) => String(x.id) === v);
                                            if (s) loadSavedScript(s);
                                        }
                                    }}
                                >
                                    <option value="__default__">Ejemplo integrado (Lektion 17)</option>
                                    {(savedScripts || []).map((s) => (
                                        <option key={String(s.id)} value={String(s.id)}>{s.title || 'Sin título'}</option>
                                    ))}
                                    {!isDefaultScript && !activeSavedScriptId ? (
                                        <option value="__other__">{activeScriptTitle} (actual, no guardado)</option>
                                    ) : null}
                                </select>
                            </div>
                        </div>
                        {mode !== 'quiz' && mode !== 'interview' && !podcastMode && (
                            <div className="absolute top-2 right-2 flex flex-wrap items-center gap-1 md:gap-2 bg-black/60 p-1 rounded-xl border border-white/10 backdrop-blur-md z-10 max-w-[95%] justify-end">
                                <button onClick={() => setFluesternMode(!fluesternMode)} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${fluesternMode ? 'bg-zinc-600 text-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-gray-300 hover:bg-white/10'}`} title="Modo Flüstern"><Icon name="ear" className="w-3 h-3 md:w-4 md:h-4" /> Flüstern</button>
                                <button onClick={() => setNoiseEnabled(!noiseEnabled)} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${noiseEnabled ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-gray-300 hover:bg-white/10'}`} title="Ruido de fondo (examen)"><Icon name="volume-2" className="w-3 h-3 md:w-4 md:h-4" /> Ruido</button>
                                <button onClick={() => {setDiktatMode(!diktatMode); setBlindMode(false); setLueckentextMode(false); setPuzzleMode(false); setDeclinaMode(false); setArtikelSniperMode(false); resetModes(); stopAudio();}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${diktatMode ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="edit" className="w-3 h-3 md:w-4 md:h-4" /> Diktat</button>
                                <button onClick={() => {setLueckentextMode(!lueckentextMode); setDiktatMode(false); setPuzzleMode(false); setArtikelSniperMode(false);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${lueckentextMode ? 'bg-amber-500 text-black' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="edit-3" className="w-3 h-3 md:w-4 md:h-4" /> Huecos</button>
                                <button onClick={() => {setArtikelSniperMode(!artikelSniperMode); setDiktatMode(false); setLueckentextMode(false);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${artikelSniperMode ? 'bg-red-800 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="target" className="w-3 h-3 md:w-4 md:h-4" /> Artículos</button>
                                <button onClick={() => {setDeclinaMode(!declinaMode); setDiktatMode(false);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${declinaMode ? 'bg-pink-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="wand-2" className="w-3 h-3 md:w-4 md:h-4" /> Declinar</button>
                                <button onClick={() => {setTempusMode(!tempusMode);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${tempusMode ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="clock" className="w-3 h-3 md:w-4 md:h-4" /> Tempus</button>
                                <button onClick={() => {setPuzzleMode(!puzzleMode); setDiktatMode(false); setBlindMode(false); setDeclinaMode(false); setArtikelSniperMode(false); resetModes(); stopAudio();}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${puzzleMode ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="puzzle" className="w-3 h-3 md:w-4 md:h-4" /> Satzbau</button>
                                <button onClick={() => {setBlindMode(!blindMode); setDiktatMode(false); setPuzzleMode(false);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${blindMode ? 'bg-blue-400 text-black' : 'text-gray-300 hover:bg-white/10'}`}>{blindMode ? <Icon name="eye-off" className="w-3 h-3 md:w-4 md:h-4" /> : <Icon name="eye" className="w-3 h-3 md:w-4 md:h-4" />} Oído</button>
                                <div className="flex items-center gap-0.5 md:gap-1 pl-1 md:pl-2 border-l border-white/20">
                                    <Icon name="mic-off" className={`w-3 h-3 md:w-4 md:h-4 ${roleplayChar !== 'none' ? 'text-red-400' : 'text-gray-400'}`} />
                                    <select className="bg-transparent text-[10px] md:text-xs text-white font-bold outline-none cursor-pointer" value={roleplayChar} onChange={(e) => setRoleplayChar(e.target.value)}>
                                        <option value="none" className="text-black">No mutear</option>
                                        <option value="Todos" className="text-black font-bold">Mutear TODOS</option>
                                        <option value="Lukas" className="text-black">Lukas</option>
                                        <option value="Elena" className="text-black">Elena</option>
                                        <option value="Herr Weber" className="text-black">Weber</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {podcastMode && (
                            <div className="absolute top-2 right-2 bg-indigo-600/30 text-indigo-200 border border-indigo-500/50 px-2 md:px-4 py-1 md:py-2 rounded-full font-bold flex flex-col sm:flex-row items-start sm:items-center gap-0.5 sm:gap-2 animate-pulse z-10 text-[10px] md:text-sm max-w-[min(96%,280px)] sm:max-w-none text-left">
                                <span className="flex items-center gap-1 md:gap-2"><Icon name="car" className="w-3 h-3 md:w-5 md:h-5 shrink-0" /> Modo Podcast</span>
                                {historiaPlaylistAllScripts && (savedScripts || []).length > 0 ? <span className="text-indigo-100/90 font-semibold normal-case">+ Todos los guiones (siguiente al terminar)</span> : null}
                            </div>
                        )}

                        {mode === 'interview' ? (
                            (() => {
                                const QLIST = (typeof MULLER_ORAL_B1_QUESTIONS !== 'undefined' && MULLER_ORAL_B1_QUESTIONS && MULLER_ORAL_B1_QUESTIONS.length)
                                    ? MULLER_ORAL_B1_QUESTIONS
                                    : [{ de: 'Frage', es: 'Pregunta', model: 'Antwort' }];
                                const q = QLIST[oralQIdx % QLIST.length];
                                const modelDe = q.model || '';
                                return (
                            <div className="max-w-4xl w-full flex flex-col items-center justify-center animate-in zoom-in duration-500 p-4">
                                <div className="bg-emerald-900 text-emerald-200 border border-emerald-500 px-3 md:px-6 py-1 md:py-2 rounded-full font-bold flex items-center gap-2 mb-4 md:mb-6 text-xs md:text-sm"><Icon name="message-square" className="w-4 h-4 md:w-5 md:h-5" /> Mündliche Prüfung Teil 2 · {oralQIdx + 1}/{QLIST.length}</div>
                                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Tiempo por respuesta</span>
                                    {[60, 90, 120].map((s) => (
                                        <button key={s} type="button" onClick={() => { setOralSecs(s); setOralDeadline(Date.now() + s * 1000); setOralClock(0); }} className={`px-2 py-1 rounded-lg text-xs font-bold border ${oralSecs === s ? 'bg-emerald-700 border-emerald-400 text-white' : 'bg-black/40 border-white/15 text-gray-400'}`}>{s}s</button>
                                    ))}
                                </div>
                                <div className={`w-full max-w-xl mb-4 rounded-2xl border px-4 py-3 text-center font-bold text-2xl md:text-4xl tabular-nums ${oralLeftSec !== null && oralLeftSec <= 15 ? 'border-amber-500 bg-amber-950/40 text-amber-200' : 'border-emerald-600/50 bg-black/30 text-emerald-200'}`}>
                                    {oralLeftSec !== null ? `${Math.floor(oralLeftSec / 60)}:${String(oralLeftSec % 60).padStart(2, '0')}` : '—'}
                                </div>
                                <h2 className="text-base md:text-2xl text-gray-300 font-bold mb-2 uppercase tracking-widest text-center">Prüfer/in fragt:</h2>
                                <h1 className="text-lg md:text-3xl font-medium text-white text-center mb-2 px-2 leading-snug border-l-4 border-emerald-500 pl-3 bg-emerald-950/30 py-3 rounded-r-xl">"{q.de}"</h1>
                                <p className="text-sm text-gray-500 italic mb-6 text-center max-w-2xl">({q.es})</p>
                                <div className="flex flex-col items-center gap-3 md:gap-4 w-full bg-black/40 p-4 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
                                    <button type="button" onClick={() => { const u = new SpeechSynthesisUtterance(q.de); u.lang = 'de-DE'; window.__mullerApplyPreferredDeVoice(u); u.rate = parseFloat(localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') || 0.92; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }} className="w-full max-w-md py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-sm border border-white/10 flex items-center justify-center gap-2"><Icon name="volume-2" className="w-5 h-5" /> Escuchar pregunta</button>
                                    <button type="button" onMouseDown={micMouseDownGuard(() => handleVoiceStart(modelDe))} onMouseUp={handleVoiceStop} onMouseLeave={handleVoiceStop} onTouchStart={micTouchStartGuard(() => handleVoiceStart(modelDe))} onTouchEnd={handleVoiceStop} className={`rounded-full p-8 md:p-12 text-white transition transform hover:scale-105 shadow-xl select-none touch-manipulation ${isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500'}`}><Icon name="mic" className="w-14 h-14 md:w-20 md:h-20" /></button>
                                    <p className="text-gray-400 font-bold mt-1 text-center text-xs md:text-sm">Mantén pulsado para responder (se compara con una frase modelo B1)</p>
                                    {spokenText && (
                                        <div className="text-center w-full mt-4 md:mt-6">
                                            <p className="text-yellow-300 font-medium text-base md:text-2xl mb-3 md:mb-4">"{spokenText}"</p>
                                            {(pronunciationFeedback || []).length > 0 && (
                                                <div className="flex flex-wrap gap-1 md:gap-2 justify-center my-3 md:my-4 bg-black/50 p-2 md:p-4 rounded-xl border border-white/10">
                                                    {(pronunciationFeedback || []).map((item, idx) => (
                                                        <span key={idx} className={`text-xs md:text-lg font-bold px-1 md:px-2 py-0.5 md:py-1 rounded ${item.correct ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-red-900/50 text-red-400 border border-red-500/30 line-through decoration-red-500'}`}>{item.word}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                                <button type="button" onClick={() => runSingleSubmitAction('oral-next-question', handleOralNextQuestion)} className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm">Siguiente pregunta</button>
                                                <button type="button" onClick={() => { setMode('dialogue'); setOralDeadline(null); setSpokenText(''); saveProgress({ activityByDay: mergeActivityPoints(20) }); }} className="bg-white text-black px-4 py-2 rounded-xl font-black text-sm hover:bg-gray-200">Salir del simulacro</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                                );
                            })()
                        ) : mode === 'roleplay_wait' ? (
                            <div className="max-w-4xl w-full flex flex-col items-center justify-center gap-4 md:gap-6 animate-in zoom-in duration-300 p-4">
                                <div className="bg-red-600 text-white px-3 md:px-6 py-1 md:py-2 rounded-full font-bold flex items-center gap-2 text-xs md:text-sm"><Icon name="mic-off" className="w-4 h-4 md:w-5 md:h-5" /> {roleplayChar === 'Todos' ? "Modo Lectura" : "Tu turno (Roleplay)"}</div>
                                <h1 className="text-xl md:text-5xl font-medium text-white text-center leading-snug break-words w-full max-w-full px-1">
                                    {callHighlight(getScene().text, getScene().vocab)}
                                    {getScene().isRedemittel && <span className="inline-flex items-center justify-center ml-2 md:ml-3 mb-1 md:mb-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[8px] md:text-xs font-black px-1 md:px-2 py-0.5 md:py-1 rounded shadow-lg animate-pulse whitespace-nowrap"><Icon name="flame" className="w-2 h-2 md:w-3 md:h-3 mr-0.5 md:mr-1" /> ÚTIL</span>}
                                </h1>
                                {!showCurrentTranslation ? (
                                    <button onClick={() => setShowCurrentTranslation(true)} className="text-gray-500 hover:text-white transition text-xs md:text-sm font-bold flex items-center gap-1 mt-2 border border-gray-700 rounded-full px-2 md:px-3 py-0.5 md:py-1"><Icon name="eye" className="w-3 h-3 md:w-4 md:h-4" /> Ver Traducción</button>
                                ) : (
                                    <div className="bg-white/10 text-gray-300 italic px-3 md:px-6 py-1 md:py-2 rounded-lg border border-white/20 mt-2 text-base md:text-xl animate-in slide-in-from-top-2 text-center">"{getScene().translation}"</div>
                                )}
                                <div className="flex flex-col items-center gap-3 md:gap-4 w-full mt-3 md:mt-4 bg-black/40 p-4 md:p-6 rounded-xl border border-white/10">
                                    <div className="flex gap-4 md:gap-8 justify-center items-center">
                                        <button onClick={() => { window.speechSynthesis.cancel(); window.speechSynthesis.speak(playSceneAudio(sanitizeHistoriaSpeechText(getScene().text), getScene().speaker)); }} className="flex flex-col items-center text-gray-400 hover:text-white transition">
                                            <div className="bg-gray-800 p-2 md:p-4 rounded-full mb-1 md:mb-2"><Icon name="volume-2" className="w-5 h-5 md:w-8 md:h-8" /></div><span className="text-[10px] md:text-sm font-bold">1. Escuchar</span>
                                        </button>
                                        <button type="button" onMouseDown={micMouseDownGuard(() => handleVoiceStart())} onMouseUp={handleVoiceStop} onMouseLeave={handleVoiceStop} onTouchStart={micTouchStartGuard(() => handleVoiceStart())} onTouchEnd={handleVoiceStop} className={`flex flex-col items-center transition transform select-none touch-manipulation ${isListening ? 'text-red-400 scale-110' : 'text-blue-400 hover:text-blue-300'}`}>
                                            <div className={`p-2 md:p-4 rounded-full mb-1 md:mb-2 shadow-xl ${isListening ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-blue-600 text-white'}`}><Icon name="mic" className="w-5 h-5 md:w-8 md:h-8" /></div><span className="text-[10px] md:text-sm font-bold">2. Mantener</span>
                                        </button>
                                    </div>
                                    {spokenText && (
                                        <div className="text-center w-full mt-4 md:mt-6">
                                            <p className="text-yellow-300 font-mono text-base md:text-xl mb-2">"{spokenText}"</p>
                                            {(pronunciationFeedback || []).length > 0 && (
                                                <div className="flex flex-wrap gap-1 md:gap-2 justify-center my-3 md:my-4 bg-black/50 p-2 md:p-4 rounded-xl border border-white/10">
                                                    {(pronunciationFeedback || []).map((item, idx) => (
                                                        <span key={idx} className={`text-xs md:text-lg font-bold px-1 md:px-2 py-0.5 md:py-1 rounded ${item.correct ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-red-900/50 text-red-400 border border-red-500/30 line-through decoration-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}>{item.word}</span>
                                                    ))}
                                                </div>
                                            )}
                                            {grammarPolizeiMsg && <p className="text-red-400 font-bold mb-3 md:mb-4 bg-red-900/30 p-1 md:p-2 rounded text-xs md:text-sm">{grammarPolizeiMsg}</p>}
                                            {pronunciationScore !== null && (
                                                <div className="flex items-center justify-center gap-2 md:gap-3">
                                                    <div className="w-full bg-gray-800 rounded-full h-2 md:h-4 max-w-md"><div className={`h-2 md:h-4 rounded-full transition-all duration-1000 ${pronunciationScore >= 90 ? 'bg-green-500' : pronunciationScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${pronunciationScore}%`}}></div></div>
                                                    <span className="font-bold text-sm md:text-xl">{pronunciationScore}%</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => runSingleSubmitAction('oral-continue', handleNext)} className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-xl font-black text-base md:text-lg hover:bg-gray-200 transition shadow-xl mt-2 w-full md:w-auto">Continuar ➔</button>
                            </div>
                        ) : mode === 'dialogue' && puzzleMode ? (
                            <div className="max-w-4xl w-full flex flex-col gap-4 md:gap-6 animate-in fade-in relative mt-6 md:mt-8 items-center p-4">
                                <span className="uppercase tracking-widest text-xs md:text-sm font-bold text-white/70 bg-indigo-900/50 border border-indigo-500/50 px-3 md:px-5 py-1 md:py-2 rounded-full flex items-center gap-2"><Icon name="puzzle" className="w-3 h-3 md:w-4 md:h-4" /> Satzbau Puzzle: {getScene().speaker}</span>
                                {!showPuzzleResult ? (
                                    <div className="flex flex-col items-center gap-4 md:gap-8 w-full mt-2 md:mt-4">
                                        <div className="min-h-[80px] md:min-h-[100px] w-full bg-black/40 border-2 border-dashed border-indigo-500/50 rounded-xl p-2 md:p-4 flex flex-wrap gap-1 md:gap-2 items-center justify-center">
                                            {(puzzleAnswer || []).map(pw => <button key={pw.id} onClick={() => { setPuzzleAnswer((puzzleAnswer || []).filter(w => w.id !== pw.id)); setPuzzleWords([...(puzzleWords || []), pw]); }} className="bg-indigo-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-bold text-sm md:text-xl">{pw.text}</button>)}
                                        </div>
                                        <div className="flex flex-wrap gap-2 md:gap-3 justify-center w-full bg-black/20 p-3 md:p-6 rounded-xl">
                                            {(puzzleWords || []).map(pw => <button key={pw.id} onClick={() => { setPuzzleWords((puzzleWords || []).filter(w => w.id !== pw.id)); setPuzzleAnswer([...(puzzleAnswer || []), pw]); }} className="bg-gray-800 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-bold text-sm md:text-xl">{pw.text}</button>)}
                                        </div>
                                        <div className="flex gap-3 md:gap-4 w-full md:w-auto justify-center">
                                            <button onClick={() => { setIsPlaying(true); togglePlay(); setIsPlaying(true); }} className="bg-gray-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm"><Icon name="volume-2" className="w-3 h-3 md:w-5 md:h-5" /> Pista</button>
                                            <button onClick={() => runSingleSubmitAction('puzzle-check', handlePuzzleCheck)} disabled={(puzzleWords || []).length > 0} className={`px-4 md:px-8 py-2 md:py-3 rounded-lg font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm ${(puzzleWords || []).length === 0 ? 'bg-green-600' : 'bg-gray-800'}`}><Icon name="check-circle" className="w-3 h-3 md:w-5 md:h-5" /> Comprobar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full text-center flex flex-col items-center gap-4 md:gap-6">
                                        {puzzleLastOk ? (
                                            <h1 className="text-xl md:text-4xl font-medium text-white bg-green-900/40 p-4 md:p-6 rounded-xl border border-green-500/30 w-full max-w-full break-words leading-snug">{callHighlight(getScene().text, getScene().vocab)}</h1>
                                        ) : (
                                            <div className="w-full max-w-full space-y-3">
                                                <p className="text-red-200 font-black text-lg md:text-2xl bg-red-950/50 border border-red-500/40 rounded-xl px-4 py-3">Orden incorrecto — compara con la solución:</p>
                                                <h1 className="text-xl md:text-4xl font-medium text-white bg-amber-950/40 p-4 md:p-6 rounded-xl border border-amber-600/30 w-full max-w-full break-words leading-snug">{callHighlight(getScene().text, getScene().vocab)}</h1>
                                            </div>
                                        )}
                                        <button onClick={() => runSingleSubmitAction('puzzle-next', handleNext)} className="bg-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold mt-2 md:mt-4 flex items-center gap-2 w-full md:w-auto justify-center text-sm md:text-base">Siguiente ➔</button>
                                    </div>
                                )}
                            </div>
                        ) : mode === 'dialogue' && diktatMode ? (
                            <div className="max-w-4xl w-full flex flex-col gap-4 md:gap-6 animate-in fade-in relative mt-6 md:mt-8 items-center p-4">
                                {isReviewing && <div className="absolute -top-8 md:-top-12 text-red-500 font-black animate-pulse text-xs md:text-xl">⚠️ REPASO OBLIGATORIO (SRS)</div>}
                                <span className="uppercase tracking-widest text-xs md:text-sm font-bold bg-black/30 px-3 md:px-5 py-1 md:py-2 rounded-full border border-white/10">{getScene().speaker} spricht...</span>
                                {!showDiktatResult ? (
                                    <>
                                        <p className="text-base md:text-xl text-blue-200 font-bold mb-1 md:mb-2">✍️ Escribe lo que oyes:</p>
                                        <textarea className="w-full h-24 md:h-32 bg-black/50 border-2 border-blue-500/50 rounded-xl p-3 md:p-4 text-base md:text-2xl text-white outline-none" value={diktatInput} onChange={(e) => setDiktatInput(e.target.value)} onKeyDown={(e) => handleExerciseEnterSubmit(e, 'diktat-check', handleDiktatCheck, { requireCtrlOrMeta: true })} autoFocus />
                                        <div className="flex gap-3 md:gap-4 w-full md:w-auto justify-center">
                                            <button onClick={() => { setIsPlaying(true); togglePlay(); setIsPlaying(true); }} className="bg-gray-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold flex items-center gap-2 flex-1 md:flex-none justify-center text-xs md:text-sm"><Icon name="volume-2" className="w-3 h-3 md:w-5 md:h-5" /> Audio</button>
                                            <button onClick={() => runSingleSubmitAction('diktat-check', handleDiktatCheck)} className="bg-green-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-bold flex items-center gap-2 flex-1 md:flex-none justify-center text-xs md:text-sm"><Icon name="check-circle" className="w-3 h-3 md:w-5 md:h-5" /> Corregir</button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full text-center flex flex-col items-center gap-4 md:gap-6">
                                        {renderDiktatDiff(getScene().text, diktatInput)}
                                        {diktatMotivationMsg ? (
                                            <p className="text-amber-100/95 text-sm md:text-base font-semibold max-w-lg rounded-2xl border border-amber-500/35 bg-amber-950/50 px-4 py-3 shadow-lg">{diktatMotivationMsg}</p>
                                        ) : null}
                                        <button onClick={() => runSingleSubmitAction('diktat-next', handleNext)} className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold mt-2 md:mt-4 flex items-center gap-2 w-full md:w-auto justify-center text-sm md:text-base">Siguiente ➔</button>
                                    </div>
                                )}
                            </div>
                        ) : mode === 'dialogue' && historiaAudioOnly && !podcastMode && !puzzleMode && !diktatMode && !isReviewing ? (
                            <div className="max-w-3xl w-full flex flex-col items-center justify-center flex-1 py-8 md:py-16 px-4 gap-8 md:gap-10 animate-in fade-in">
                                <p className="text-violet-300 font-black text-xs uppercase tracking-[0.2em]">Solo audio · manos libres</p>
                                <p className="text-3xl md:text-5xl font-black text-center text-white leading-tight">{getScene()?.speaker || '—'}</p>
                                <p className="text-gray-500 text-sm font-mono">Szene {sceneIndex + 1} / {guionList.length} · {activeScriptTitle}</p>
                                <div className="flex items-center justify-center gap-6 md:gap-10 w-full">
                                    <button type="button" onClick={handlePrev} className="muller-icon-nav p-5 md:p-6 rounded-full bg-gray-800 border border-white/10 hover:bg-gray-700 transition text-white" disabled={podcastMode}><Icon name="chevron-left" className="w-8 h-8 md:w-10 md:h-10 text-white" /></button>
                                    <button type="button" onClick={togglePlay} className={`p-8 md:p-12 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.45)] transition text-white ${isPlaying ? 'bg-red-600' : 'bg-blue-600'}`}><Icon name={isPlaying ? 'square' : 'play'} className="w-12 h-12 md:w-16 md:h-16 fill-current text-white" /></button>
                                    <button type="button" onClick={handleNext} className="muller-icon-nav p-5 md:p-6 rounded-full bg-gray-800 border border-white/10 hover:bg-gray-700 transition text-white" disabled={podcastMode}><Icon name="chevron-right" className="w-8 h-8 md:w-10 md:h-10 text-white" /></button>
                                </div>
                                <div className="flex items-center justify-center gap-2 md:gap-3 bg-black/50 px-4 py-2 rounded-xl border border-white/10 w-full max-w-sm">
                                    <Icon name="sliders" className="w-4 h-4 text-gray-400" />
                                    <input type="range" min="0.50" max="1.50" step="0.01" value={playbackRate} onChange={(e) => setPlaybackRate(parseFloat(e.target.value))} className="flex-1 accent-blue-500" />
                                    <span className="text-white font-mono text-sm w-12 text-right">x{playbackRate.toFixed(2)}</span>
                                </div>
                                <button type="button" onClick={() => setHistoriaAudioOnly(false)} className="text-sm font-bold text-sky-300 hover:text-white underline underline-offset-4">Mostrar guion completo</button>
                            </div>
                        ) : mode === 'dialogue' && (
                            <div className="max-w-4xl w-full flex flex-col gap-3 md:gap-6 animate-in fade-in relative mt-4 md:mt-8 p-3 md:p-0">
                                {isReviewing && <div className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 text-red-500 font-black animate-pulse text-xs md:text-xl w-full text-center">⚠️ REPASO OBLIGATORIO (SRS)</div>}
                                <span className="uppercase tracking-widest text-[10px] md:text-sm font-bold bg-black/30 px-2 md:px-4 py-0.5 md:py-1.5 rounded-full self-start border border-white/10">{getScene().speaker}</span>
                                
                                <h1 className={`text-2xl md:text-5xl font-medium text-white shadow-sm transition-all duration-300 leading-snug break-words w-full max-w-full ${blindMode ? 'blur-md hover:blur-none cursor-pointer' : ''}`}>
                                    {callHighlight(getScene().text, getScene().vocab)}
                                    {getScene().isRedemittel && <span className="inline-flex items-center justify-center ml-2 md:ml-3 mb-1 md:mb-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[8px] md:text-xs font-black px-1 md:px-2 py-0.5 md:py-1 rounded shadow-lg animate-pulse whitespace-nowrap"><Icon name="flame" className="w-2 h-2 md:w-3 md:h-3 mr-0.5 md:mr-1" /> ÚTIL</span>}
                                </h1>

                                {tempusMode && tempusVerbList.length > 0 && (
                                    <div className="tempus-panel mt-3 md:mt-4 p-2 md:p-3 bg-blue-950/60 border border-blue-500/40 rounded-xl w-full">
                                        <p className="text-blue-300 font-bold text-xs md:text-sm mb-1 md:mb-2 flex items-center gap-2"><Icon name="clock" className="w-3 h-3 md:w-4 md:h-4" /> Tempus - Formas verbales:</p>
                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {(tempusVerbList || []).map((verb, idx) => (
                                                <div key={idx} className="bg-black/50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-blue-400/50">
                                                    <span className="font-bold text-blue-200 text-xs md:text-sm">{verb.infinitive}</span>
                                                    <span className="text-blue-300 text-[10px] md:text-xs ml-1 md:ml-2">→ {verb.forms}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {tempusSelectedVerb && (
                                            <div className="mt-3 rounded-lg border border-sky-500/35 bg-sky-950/35 p-3">
                                                <p className="text-[10px] md:text-xs text-sky-300 uppercase tracking-wider font-black">Verbo tocado: {tempusSelectedVerb.touched}</p>
                                                <p className="text-white font-bold text-sm md:text-base mt-1">Infinitivo: {tempusSelectedVerb.infinitive}</p>
                                                <p className="text-sky-100/90 text-xs md:text-sm mt-1 leading-relaxed">{tempusSelectedVerb.forms}</p>
                                                <p className="text-sky-300/90 text-[10px] md:text-xs mt-1">{inferTempusContextLabel(tempusSelectedVerb.touched)}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <div className="flex gap-2 md:gap-4 items-center">
                                    <span className="text-[8px] md:text-xs font-mono text-gray-500 flex flex-wrap gap-1 md:gap-2">
                                        <span className="text-purple-300 underline decoration-purple-500/70">Conector</span>
                                        <span className="text-blue-300 underline decoration-blue-500/70">Dativo</span>
                                        <span className="text-red-300 underline decoration-red-500/70">Acusativo</span>
                                        <span className="text-yellow-500/90 underline decoration-yellow-600/70">Mixta</span>
                                    </span>
                                </div>

                                {!showCurrentTranslation ? (
                                    <button onClick={() => setShowCurrentTranslation(true)} className="text-gray-500 hover:text-white transition text-[10px] md:text-sm font-bold flex items-center gap-1 w-max border border-gray-700 rounded-full px-2 md:px-3 py-0.5 md:py-1 mt-1 md:mt-2"><Icon name="eye" className="w-3 h-3 md:w-4 md:h-4" /> Ver Traducción</button>
                                ) : (
                                    <div className="bg-white/10 text-gray-300 italic px-3 md:px-6 py-1 md:py-2 rounded-lg border border-white/20 w-max max-w-full text-base md:text-xl animate-in slide-in-from-top-2">"{getScene().translation}"</div>
                                )}

                                {(declinaMode || artikelSniperMode) && !isPlaying && (
                                    <div className="absolute -bottom-8 md:-bottom-12 left-1/2 -translate-x-1/2 text-pink-400 font-bold animate-pulse text-xs md:text-lg w-full text-center">Piensa la respuesta y pulsa Play o ➔ para continuar.</div>
                                )}
                                
                                {!isPlaying && !podcastMode && (
                                    <div className="absolute right-0 top-0 md:-right-16 md:top-1/2 md:-translate-y-1/2 flex flex-col gap-2 md:gap-4">
                                        <button onClick={showAITutor} className="bg-blue-600 text-white p-1.5 md:p-3 rounded-full border border-blue-400 shadow-lg flex items-center justify-center group" title="Tutor IA">
                                            <Icon name="help-circle" className="w-4 h-4 md:w-6 md:h-6" />
                                        </button>
                                        <button onClick={trySaveGrammarStructure} className="bg-cyan-600 text-white p-1.5 md:p-3 rounded-full border border-cyan-400 shadow-lg flex items-center justify-center group" title="Guardar Gramática">
                                            <Icon name="save" className="w-4 h-4 md:w-6 md:h-6" />
                                        </button>
                                    </div>
                                )}

                                {showTutor && (
                                    <div className="absolute inset-0 z-50 bg-black/95 p-4 md:p-8 flex flex-col justify-center items-center rounded-2xl">
                                        <div className="bg-slate-900 border-2 border-blue-500 p-4 md:p-8 rounded-2xl max-w-2xl w-full shadow-[0_0_30px_rgba(59,130,246,0.5)] overflow-y-auto max-h-[80vh]">
                                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                                <h2 className="text-xl md:text-3xl font-black text-blue-400 flex items-center gap-2 md:gap-3"><Icon name="brain" className="w-6 h-6 md:w-8 md:h-8" /> Tutor IA</h2>
                                                <button onClick={() => setShowTutor(false)} className="text-gray-400 hover:text-white"><Icon name="x" className="w-6 h-6 md:w-8 md:h-8" /></button>
                                            </div>
                                            <div className="text-base md:text-xl text-white space-y-3 md:space-y-6 leading-relaxed whitespace-pre-wrap font-medium">
                                                {tutorMessage}
                                            </div>
                                            <button onClick={() => setShowTutor(false)} className="mt-6 md:mt-8 w-full bg-blue-600 hover:bg-blue-500 py-2 md:py-4 rounded-xl font-bold text-base md:text-xl">Entstanden (Entendido)</button>
                                        </div>
                                    </div>
                                )}

                                {showGrammarPrompt && (
                                    <div className="absolute inset-0 z-50 bg-black/90 p-4 flex flex-col justify-center items-center rounded-2xl animate-in zoom-in">
                                        <div className="bg-cyan-950 border-2 border-cyan-500 p-4 md:p-8 rounded-2xl max-w-lg w-full shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                                            <h2 className="text-lg md:text-2xl font-black text-cyan-400 flex items-center gap-2 md:gap-3 mb-3 md:mb-4"><Icon name="save" className="w-5 h-5 md:w-6 md:h-6" /> Guardar Manual</h2>
                                            <p className="text-cyan-100 mb-4 md:mb-6 text-xs md:text-sm">No he detectado ninguna regla automática en esta frase. ¿Qué gramática quieres guardar en tus Flashcards?</p>
                                            <p className="text-gray-400 italic mb-2 text-[10px] md:text-xs">Frase actual: "{getScene().text}"</p>
                                            <input type="text" placeholder="Ej: Nebensatz con weil" className="w-full bg-black/50 border border-cyan-800 p-2 md:p-3 rounded-lg text-white outline-none focus:border-cyan-400 mb-4 md:mb-6 text-xs md:text-sm" value={customGrammarInput} onChange={(e)=>setCustomGrammarInput(e.target.value)} autoFocus />
                                            <div className="flex gap-3 md:gap-4">
                                                <button onClick={()=>setShowGrammarPrompt(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 md:py-3 rounded-xl font-bold text-xs md:text-base">Cancelar</button>
                                                <button onClick={handleCustomGrammarSave} className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-2 md:py-3 rounded-xl font-bold shadow-lg text-xs md:text-base">Guardar ➔</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                     </div>
                  );
}
window.HistoriaPanel = HistoriaPanel;