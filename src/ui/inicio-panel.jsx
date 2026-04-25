function InicioPanel(props) {
    const {
        healthSnapshot,
        showSelfCheckPanel,
        setShowSelfCheckPanel,
        getSelfCheckItems,
        vocabSrsDueCount,
        setActiveTab,
        setMode,
        stopAudio,
        setPracticeActive,
        setVocabDueFilterOnly,
        setBxBankLevel,
        setBxCategory,
        setShowMullerHub,
        setMullerHubTab,
        setTourStep,
    } = props;
    return (
                      <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="mb-6 md:mb-8">
                              <h1 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3 mb-2"><Icon name="layout-dashboard" className="w-10 h-10 md:w-14 md:h-14 text-indigo-400" /> Inicio</h1>
                              <p className="text-gray-400 text-sm md:text-base max-w-2xl">Elige qué practicar. Tecla <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 font-mono text-xs">I</kbd> para volver aquí.</p>
                          </div>
                          <div className="mb-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/35 p-4">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                  <p className="text-cyan-200 font-black text-sm flex items-center gap-2"><Icon name="stethoscope" className="w-4 h-4" /> Diagnóstico rápido</p>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${healthSnapshot.ok ? 'bg-emerald-800/60 text-emerald-200 border border-emerald-500/40' : 'bg-amber-900/60 text-amber-200 border border-amber-500/40'}`}>{healthSnapshot.ok ? 'Estado: OK' : 'Revisar'}</span>
                              </div>
                              <div className="mb-2 flex items-center gap-2">
                                  <button
                                      type="button"
                                      onClick={() => setShowSelfCheckPanel((v) => !v)}
                                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-cyan-400/45 bg-cyan-900/30 text-cyan-100 hover:bg-cyan-800/40"
                                  >
                                      {showSelfCheckPanel ? 'Ocultar autochequeo' : 'Autochequeo guiado'}
                                  </button>
                                  <span className="text-[10px] text-cyan-200/80">Comprueba rápido que todo lo crítico está OK.</span>
                              </div>
                              {showSelfCheckPanel && (
                                  <div className="mb-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                                      {getSelfCheckItems().map((it) => (
                                          <div key={it.id} className={`rounded-lg border px-2.5 py-1.5 ${it.ok ? 'border-emerald-500/35 bg-emerald-950/25 text-emerald-200' : 'border-amber-500/35 bg-amber-950/30 text-amber-100'}`}>
                                              <span className="font-bold">{it.ok ? '✓' : '⚠'} {it.label}</span>
                                          </div>
                                      ))}
                                  </div>
                              )}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                                  <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
                                      <p className="text-gray-400">Micrófono</p>
                                      <p className={`font-bold ${healthSnapshot.micOk ? 'text-emerald-300' : 'text-amber-300'}`}>{healthSnapshot.micLabel}</p>
                                  </div>
                                  <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
                                      <p className="text-gray-400">Voces TTS</p>
                                      <p className={`font-bold ${healthSnapshot.voiceCount > 0 ? 'text-emerald-300' : 'text-amber-300'}`}>{healthSnapshot.voiceCount > 0 ? `${healthSnapshot.voiceCount} disponibles` : 'Sin voces cargadas'}</p>
                                  </div>
                                  <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
                                      <p className="text-gray-400">Guiones</p>
                                      <p className={`font-bold ${(healthSnapshot.savedScriptsCount > 0 || healthSnapshot.storyScenesCount > 0) ? 'text-emerald-300' : 'text-amber-300'}`}>{healthSnapshot.savedScriptsCount} guardados · {healthSnapshot.storyScenesCount} escenas</p>
                                  </div>
                                  <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
                                      <p className="text-gray-400">Estado sesión</p>
                                      <p className={`font-bold ${healthSnapshot.listeningBusy ? 'text-fuchsia-300' : 'text-emerald-300'}`}>{healthSnapshot.listeningBusy ? 'Mic activo' : 'En reposo'}</p>
                                  </div>
                              </div>
                          </div>
                          {vocabSrsDueCount > 0 ? (
                              <button type="button" onClick={() => { setActiveTab('vocabulario'); setVocabDueFilterOnly(true); stopAudio(); setPracticeActive(null); }} className="w-full mb-4 text-left rounded-2xl border border-amber-500/40 bg-amber-950/50 p-4 hover:bg-amber-900/55 transition shadow-[0_0_24px_rgba(245,158,11,0.12)]">
                                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2"><Icon name="bell-ring" className="w-4 h-4" /> Pendientes de repaso (SRS)</p>
                                  <p className="text-white font-black text-2xl mt-1">{vocabSrsDueCount} tarjetas</p>
                                  <p className="text-[11px] text-gray-400 mt-1">Ir a Vocab con filtro de vencidas / prioridad</p>
                              </button>
                          ) : null}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                              {[
                                  { id: 'ruta', label: 'Ruta A0→C1', sub: 'Desde cero, gramática, test', icon: 'map', go: () => { setActiveTab('ruta'); } },
                                  { id: 'historia', label: 'Historia', sub: 'Guion, audio, modos', icon: 'play', go: () => { setActiveTab('historia'); setMode('dialogue'); } },
                                  { id: 'vocab', label: 'Vocabulario', sub: 'SRS y tarjetas', icon: 'book-open', go: () => setActiveTab('vocabulario') },
                                  { id: 'shadow', label: 'Shadowing', sub: 'Pronunciación', icon: 'audio-lines', go: () => setActiveTab('shadowing') },
                                  { id: 'escritura', label: 'Escritura', sub: 'OCR y dictado', icon: 'pen-line', go: () => setActiveTab('escritura') },
                                  { id: 'b1', label: 'Banco B1', sub: 'Frases modelo', icon: 'target', go: () => { setActiveTab('bxbank'); setBxBankLevel('b1'); setBxCategory('mix'); } },
                                  { id: 'b2', label: 'Banco B2', sub: 'Registro alto', icon: 'layers', go: () => { setActiveTab('bxbank'); setBxBankLevel('b2'); setBxCategory('mix'); } },
                                  { id: 'progreso', label: 'Progreso', sub: 'Plan del día y estadísticas', icon: 'bar-chart', go: () => setActiveTab('progreso') },
                                  { id: 'bib', label: 'Biblioteca', sub: 'Guiones y listas', icon: 'file-text', go: () => setActiveTab('guiones') },
                                  { id: 'lex', label: 'Lexikon', sub: 'Diccionario y traductor', icon: 'library', go: () => setActiveTab('lexikon') },
                                  { id: 'hpro', label: 'Historias Pro', sub: 'ES/DE/OCR + estilo', icon: 'feather', go: () => setActiveTab('historiaspro') },
                                  { id: 'com', label: 'Comunidad', sub: 'Cuenta, directorio, liga', icon: 'trophy', go: () => setActiveTab('comunidad') },
                              ].map((c) => (
                                  <button key={c.id} type="button" onClick={() => { stopAudio(); setPracticeActive(null); c.go(); }} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/85 hover:bg-slate-800/95 p-4 text-left transition shadow-lg ring-1 ring-white/[0.04]">
                                      <span className="rounded-xl bg-black/45 p-2.5 border border-white/10 shrink-0"><Icon name={c.icon} className="w-6 h-6 text-indigo-300" /></span>
                                      <span className="min-w-0">
                                          <span className="block font-black text-white text-lg leading-tight">{c.label}</span>
                                          <span className="text-xs text-gray-500">{c.sub}</span>
                                      </span>
                                  </button>
                              ))}
                          </div>
                          <div className="mt-8 flex flex-wrap gap-3">
                              <button type="button" onClick={() => { setShowMullerHub(true); setMullerHubTab('voices'); }} className="px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 font-bold text-sm border border-sky-500/40 shadow-lg">Centro Müller (voces · temas · IA Chrome)</button>
                              <button type="button" onClick={() => setTourStep(1)} className="px-4 py-2.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 font-bold text-sm border border-indigo-500/40 shadow-lg">Tour guiado (5 pasos)</button>
                          </div>
                  </div>
    );
}

window.InicioPanel = InicioPanel;