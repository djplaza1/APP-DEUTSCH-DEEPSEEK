function EscrituraPanel(props) {
  const {
    escrituraExerciseHelpId,
    writingMode,
    setWritingMode,
    setWritingDictReveal,
    setWritingCanvasKey,
    ocrHistoryList,
    writingCopyIdx,
    setWritingCopyIdx,
    writingDictSource,
    setWritingDictSource,
    writingDictScriptId,
    setWritingDictScriptId,
    writingScriptOptions,
    writingDictationPool,
    writingDictIdx,
    setWritingDictIdx,
    writingPromptIdx,
    setWritingPromptIdx,
    writingTelcInputMode,
    setWritingTelcInputMode,
    writingTelcTypedText,
    setWritingTelcTypedText,
    handleExerciseEnterSubmit,
    runTelcCoachFromCurrentInput,
    writingTelcIdx,
    setWritingTelcIdx,
    speakRutaDe,
    writingTelcCoach,
    writingLetterIdx,
    setWritingLetterIdx,
    guionData,
    writingGuionWriteIdx,
    setWritingGuionWriteIdx,
    currentVocabList,
    writingVocabIdx,
    setWritingVocabIdx,
    writingGrid,
    setWritingGrid,
    writingStroke,
    setWritingStroke,
    writingCanvasKey,
    writingCompareTarget,
    writingCanvasSnapshot,
    setWritingCanvasSnapshot,
    setOcrHistoryList,
    setWritingTelcLastOcrText,
    runSingleSubmitAction,
  } = props;
  const ExerciseHelpBtn = window.ExerciseHelpBtn || (() => null);
  return (
                      <div className="flex-1 flex flex-col p-3 md:p-6 max-w-4xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto pb-24">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <h1 className="text-2xl md:text-4xl font-black text-rose-100 flex items-center gap-2 md:gap-3">
                                  <Icon name="pen-line" className="w-8 h-8 md:w-10 md:h-10" /> Escritura
                              </h1>
                              <ExerciseHelpBtn helpId={escrituraExerciseHelpId} />
                          </div>
                          <p className="text-stone-300/95 text-xs md:text-sm mb-4 leading-relaxed border-b border-white/10 pb-3">
                              Zona solo para escribir a mano — pensada para <strong className="text-white">tableta con lápiz</strong> (p. ej. Lenovo Tab). El lienzo usa <strong className="text-white">pointer capture</strong> para que el trazo no se pierda al apoyar la mano. Encima del lienzo tienes <strong className="text-white">goma con varios anchos</strong>, marcador fluorescente, subrayado y <strong className="text-white">deshacer el último trazo</strong> sin borrar todo. Activa las <strong className="text-white">líneas</strong> como cuaderno.
                          </p>
                          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                              {[
                                  { id: 'free', label: 'Libre', sub: 'notas / borrador' },
                                  { id: 'copy', label: 'Copia', sub: 'caligrafía' },
                                  { id: 'dictation', label: 'Dictado', sub: 'oír y escribir' },
                                  { id: 'prompt', label: 'Tema', sub: 'redacción' },
                                  { id: 'telc', label: 'TELC', sub: 'carta/email examen' },
                                  { id: 'letters', label: 'Letras DE', sub: 'ÄÖÜß' },
                                  { id: 'guion', label: 'Guion', sub: 'misma historia' },
                                  { id: 'vocab', label: 'Palabra', sub: 'del vocab' }
                              ].map((m) => (
                                  <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => { setWritingMode(m.id); setWritingDictReveal(false); setWritingCanvasKey((k) => k + 1); }}
                                      className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl text-left border transition ${writingMode === m.id ? 'bg-rose-800/90 border-rose-400/50 text-white shadow-lg' : 'bg-black/40 border-white/10 text-gray-400 hover:border-rose-500/40 hover:text-white'}`}
                                  >
                                      <span className="block text-[10px] md:text-xs font-black">{m.label}</span>
                                      <span className="block text-[9px] text-gray-500 md:text-[10px]">{m.sub}</span>
                                  </button>
                              ))}
                          </div>

                          {ocrHistoryList.length > 0 && (
                              <div className="mb-4 rounded-xl border border-indigo-500/35 bg-indigo-950/20 p-3">
                                  <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-2">Historial OCR (últimas {ocrHistoryList.length})</p>
                                  <ul className="space-y-1.5 text-[10px] text-gray-400 max-h-36 overflow-y-auto pr-1">
                                      {ocrHistoryList.map((h) => (
                                          <li key={h.id || h.at} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-1.5">
                                              <span className="text-gray-500 shrink-0">{h.at ? new Date(h.at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                              <span className="text-emerald-300 font-mono font-bold">{h.pct != null ? `${h.pct}%` : 'sin %'}</span>
                                              <span className="w-full text-gray-500 truncate italic">{(h.textSnippet || '').slice(0, 70)}{(h.textSnippet || '').length > 70 ? '…' : ''}</span>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          )}

                          {writingMode === 'free' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4">
                                  <p className="text-rose-200/90 text-sm font-bold mb-1">Página en blanco</p>
                                  <p className="text-[11px] text-gray-500">Escribe lo que quieras: resúmenes, listas, conjugaciones… Usa <strong className="text-gray-300">Borrar</strong> o <strong className="text-gray-300">Guardar PNG</strong> debajo del lienzo.</p>
                              </div>
                          )}

                          {writingMode === 'copy' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  <p className="text-rose-200/90 text-sm font-bold">Copia la frase (caligrafía alemana)</p>
                                  <p className="text-lg md:text-2xl text-white font-medium leading-snug">{WRITING_COPY_DRILLS[writingCopyIdx % WRITING_COPY_DRILLS.length]}</p>
                                  <div className="flex flex-wrap gap-2 pt-2">
                                      <button type="button" onClick={() => runSingleSubmitAction('writing-copy-next', () => { setWritingCopyIdx((i) => (i + 1) % WRITING_COPY_DRILLS.length); setWritingCanvasKey((k) => k + 1); })} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-600/40">Otra frase →</button>
                                  </div>
                              </div>
                          )}

                          {writingMode === 'dictation' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-3">
                                  <p className="text-rose-200/90 text-sm font-bold">Dictado alemán</p>
                                  <p className="text-[11px] text-gray-500">
                                      Escucha (varias veces si hace falta). Escribe en el lienzo lo que oyes. Luego comprueba el texto.
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                          Fuente del dictado
                                          <select
                                              value={writingDictSource}
                                              onChange={(e) => {
                                                  const v = e.target.value;
                                                  setWritingDictSource(v);
                                                  setWritingDictIdx(0);
                                                  setWritingDictReveal(false);
                                              }}
                                              className="mt-1 w-full bg-black/45 border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white font-semibold"
                                          >
                                              <option value="builtin">Base integrada</option>
                                              <option value="current_story">Historia actual</option>
                                              <option value="all_saved">Mezcla de guiones guardados</option>
                                              <option value="one_saved">Un guion concreto</option>
                                          </select>
                                      </label>
                                      {writingDictSource === 'one_saved' && (
                                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                              Guion guardado
                                              <select
                                                  value={writingDictScriptId}
                                                  onChange={(e) => {
                                                      setWritingDictScriptId(e.target.value);
                                                      setWritingDictIdx(0);
                                                      setWritingDictReveal(false);
                                                  }}
                                                  className="mt-1 w-full bg-black/45 border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white font-semibold"
                                              >
                                                  <option value="__current__" disabled>Selecciona un guion…</option>
                                                  {writingScriptOptions.map((s) => (
                                                      <option key={s.id} value={s.id}>{s.title} ({s.count})</option>
                                                  ))}
                                              </select>
                                          </label>
                                      )}
                                  </div>
                                  <p className="text-[10px] text-rose-200/75">
                                      Ítem {Math.min(writingDictIdx + 1, Math.max(1, writingDictationPool.length))} de {Math.max(1, writingDictationPool.length)}
                                      {writingDictationPool[writingDictIdx % Math.max(1, writingDictationPool.length)]?.origin ? ` · ${writingDictationPool[writingDictIdx % Math.max(1, writingDictationPool.length)].origin}` : ''}
                                  </p>
                                  <div className="flex flex-wrap gap-2 items-center">
                                      <button
                                          type="button"
                                          onClick={() => {
                                              if (!writingDictationPool.length) return;
                                              const line = writingDictationPool[writingDictIdx % writingDictationPool.length];
                                              window.speechSynthesis.cancel();
                                              const u = new SpeechSynthesisUtterance(line.de);
                                              u.lang = 'de-DE';
                                              u.rate = 0.88;
                                              window.__mullerApplyPreferredDeVoice(u);
                                              window.speechSynthesis.speak(u);
                                          }}
                                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 font-bold text-sm"
                                      >
                                          <Icon name="volume-2" className="w-4 h-4" /> Escuchar dictado
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => runSingleSubmitAction('writing-dict-next', () => {
                                              if (!writingDictationPool.length) return;
                                              setWritingDictIdx((i) => (i + 1) % writingDictationPool.length);
                                              setWritingDictReveal(false);
                                              setWritingCanvasKey((k) => k + 1);
                                          })}
                                          className="text-xs font-bold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10"
                                      >
                                          Otro dictado
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => setWritingDictReveal((r) => !r)}
                                          className="text-xs font-bold px-3 py-2 rounded-lg bg-amber-900/60 hover:bg-amber-800/80 border border-amber-600/40"
                                      >
                                          {writingDictReveal ? 'Ocultar solución' : 'Mostrar solución'}
                                      </button>
                                  </div>
                                  {writingDictReveal && writingDictationPool.length > 0 && (
                                      <div className="border border-emerald-700/40 rounded-lg p-4 md:p-5 bg-emerald-950/40">
                                          <p className="text-white font-semibold text-lg md:text-2xl leading-snug">
                                              {writingDictationPool[writingDictIdx % writingDictationPool.length].de}
                                          </p>
                                          <p className="text-emerald-200/90 text-sm md:text-base mt-2 italic leading-relaxed">
                                              {writingDictationPool[writingDictIdx % writingDictationPool.length].es || 'Sin traducción disponible en esta línea.'}
                                          </p>
                                      </div>
                                  )}
                              </div>
                          )}

                          {writingMode === 'prompt' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  <p className="text-rose-200/90 text-sm font-bold">Tema para redacción corta</p>
                                  <p className="text-base md:text-lg text-white font-semibold">{WRITING_PROMPTS_DE[writingPromptIdx % WRITING_PROMPTS_DE.length].de}</p>
                                  <p className="text-xs text-gray-500 italic">{WRITING_PROMPTS_DE[writingPromptIdx % WRITING_PROMPTS_DE.length].es}</p>
                                  <button type="button" onClick={() => runSingleSubmitAction('writing-prompt-next', () => { setWritingPromptIdx((i) => (i + 1) % WRITING_PROMPTS_DE.length); setWritingCanvasKey((k) => k + 1); })} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-600/40 mt-2">Otro tema</button>
                              </div>
                          )}

                          {writingMode === 'telc' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-orange-500/30 p-3 md:p-4 space-y-3">
                                  <p className="text-orange-200/95 text-sm font-black flex items-center gap-2">
                                      <Icon name="mail" className="w-4 h-4" /> TELC Schreiben a mano (carta / email)
                                  </p>
                                  <p className="text-[11px] text-gray-500">
                                      Redacta a mano como en examen real con bolígrafo óptico. Cubre todos los puntos del enunciado.
                                  </p>
                                  <div className="rounded-lg border border-orange-500/35 bg-orange-950/25 p-2.5 space-y-2">
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-orange-200">Método de escritura TELC</p>
                                      <div className="flex flex-wrap gap-2">
                                          <button
                                              type="button"
                                              onClick={() => setWritingTelcInputMode('pen')}
                                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${writingTelcInputMode === 'pen' ? 'bg-orange-600 text-white border-orange-300/60' : 'bg-black/40 text-gray-300 border-white/10 hover:text-white'}`}
                                          >
                                              ✍ Lápiz óptico
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => setWritingTelcInputMode('keyboard')}
                                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${writingTelcInputMode === 'keyboard' ? 'bg-orange-600 text-white border-orange-300/60' : 'bg-black/40 text-gray-300 border-white/10 hover:text-white'}`}
                                          >
                                              ⌨ Teclado
                                          </button>
                                      </div>
                                      {writingTelcInputMode === 'keyboard' && (
                                          <textarea
                                              value={writingTelcTypedText}
                                              onChange={(e) => setWritingTelcTypedText(e.target.value)}
                                              onKeyDown={(e) => handleExerciseEnterSubmit(e, 'telc-evaluate', runTelcCoachFromCurrentInput, { requireCtrlOrMeta: true })}
                                              placeholder="Escribe aquí tu carta/email TELC con teclado…"
                                              className="w-full min-h-[140px] bg-black/45 border border-white/15 rounded-xl p-3 text-sm text-white outline-none focus:border-orange-400"
                                          />
                                      )}
                                      {writingTelcInputMode === 'pen' && (
                                          <p className="text-[11px] text-orange-100/90">
                                              Usa el lienzo de abajo y luego pulsa <strong>Evaluar texto TELC</strong> (leerá el OCR).
                                          </p>
                                      )}
                                  </div>
                                  <p className="text-[10px] text-rose-200/75">
                                      Tarea {Math.min(writingTelcIdx + 1, Math.max(1, WRITING_TELC_TASKS.length))} de {Math.max(1, WRITING_TELC_TASKS.length)} · {WRITING_TELC_TASKS[writingTelcIdx % Math.max(1, WRITING_TELC_TASKS.length)]?.level || 'TELC'}
                                  </p>
                                  <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 space-y-2">
                                      <p className="text-[11px] font-black uppercase tracking-wider text-rose-300">{WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].title}</p>
                                      <p className="text-sm md:text-base text-white leading-relaxed">{WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].promptDe}</p>
                                      <p className="text-[11px] text-gray-400 italic">{WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].promptEs}</p>
                                      <div className="rounded-lg border border-emerald-700/35 bg-emerald-950/30 p-2">
                                          <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">Checklist del encargo</p>
                                          <ul className="text-[11px] text-emerald-100/90 space-y-1">
                                              {WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].checklist.map((item, i) => (
                                                  <li key={i}>• {item}</li>
                                              ))}
                                          </ul>
                                      </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                      <button
                                          type="button"
                                          onClick={() => runSingleSubmitAction('telc-next-task', () => {
                                              if (!WRITING_TELC_TASKS.length) return;
                                              setWritingTelcIdx((i) => (i + 1) % WRITING_TELC_TASKS.length);
                                              setWritingCanvasKey((k) => k + 1);
                                          })}
                                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-violet-800 hover:bg-violet-700 border border-violet-500/40"
                                      >
                                          Siguiente tarea TELC
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => speakRutaDe(WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].dePrompt)}
                                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 inline-flex items-center gap-1.5"
                                      >
                                          <Icon name="volume-2" className="w-3.5 h-3.5" /> Escuchar enunciado
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => runSingleSubmitAction('telc-evaluate', runTelcCoachFromCurrentInput)}
                                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 border border-emerald-400/40 inline-flex items-center gap-1.5"
                                      >
                                          <Icon name="clipboard-check" className="w-3.5 h-3.5" /> Evaluar texto TELC
                                      </button>
                                  </div>
                                  {writingTelcCoach && (
                                      <div className="rounded-xl border border-emerald-500/35 bg-emerald-950/25 p-3 space-y-2">
                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                              <p className="text-sm font-black text-emerald-200">TELC Writing Coach</p>
                                              <span className="text-xs font-black text-white bg-black/35 border border-white/10 rounded-full px-2 py-0.5">{writingTelcCoach.total}/{writingTelcCoach.max} · {writingTelcCoach.pct}%</span>
                                          </div>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                                              <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Aufgabe</span><br /><strong className="text-emerald-200">{writingTelcCoach.scoreTask}/5</strong></p>
                                              <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Register</span><br /><strong className="text-emerald-200">{writingTelcCoach.scoreRegister}/5</strong></p>
                                              <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Kohärenz</span><br /><strong className="text-emerald-200">{writingTelcCoach.scoreCohesion}/5</strong></p>
                                              <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Grammatik</span><br /><strong className="text-emerald-200">{writingTelcCoach.scoreGrammar}/5</strong></p>
                                          </div>
                                          <p className="text-[11px] text-emerald-100/95">{writingTelcCoach.suggestionText}</p>
                                      </div>
                                  )}
                              </div>
                          )}

                          {writingMode === 'letters' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  <p className="text-rose-200/90 text-sm font-bold">{LETTER_DRILLS[writingLetterIdx % LETTER_DRILLS.length].title}</p>
                                  <p className="text-xs text-amber-200/80">{LETTER_DRILLS[writingLetterIdx % LETTER_DRILLS.length].sample}</p>
                                  <p className="text-lg md:text-xl text-white tracking-wide font-medium">Práctica: {LETTER_DRILLS[writingLetterIdx % LETTER_DRILLS.length].practice}</p>
                                  <button type="button" onClick={() => runSingleSubmitAction('writing-letters-next', () => { setWritingLetterIdx((i) => (i + 1) % LETTER_DRILLS.length); setWritingCanvasKey((k) => k + 1); })} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-600/40">Siguiente bloque</button>
                              </div>
                          )}

                          {writingMode === 'guion' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  {guionData.length === 0 ? (
                                      <p className="text-gray-500 text-sm">No hay guion. Carga uno en <strong className="text-white">Biblioteca</strong>.</p>
                                  ) : (
                                      <>
                                          <p className="text-rose-200/90 text-sm font-bold">Copia una línea del guion activo</p>
                                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Escena {writingGuionWriteIdx + 1} / {guionData.length} · {guionData[writingGuionWriteIdx]?.speaker || '—'}</p>
                                          <p className="text-lg md:text-xl text-white leading-relaxed">{guionData[writingGuionWriteIdx]?.text}</p>
                                          {guionData[writingGuionWriteIdx]?.translation && <p className="text-xs text-gray-500 italic border-t border-white/10 pt-2">({guionData[writingGuionWriteIdx].translation})</p>}
                                          <div className="flex flex-wrap gap-2 pt-2">
                                              <button type="button" disabled={writingGuionWriteIdx <= 0} onClick={() => runSingleSubmitAction('writing-guion-prev', () => { setWritingGuionWriteIdx((i) => Math.max(0, i - 1)); setWritingCanvasKey((k) => k + 1); })} className="muller-icon-nav inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white border border-white/10 disabled:opacity-30"><Icon name="chevron-left" className="w-3.5 h-3.5 text-white shrink-0" /> Anterior</button>
                                              <button type="button" disabled={writingGuionWriteIdx >= guionData.length - 1} onClick={() => runSingleSubmitAction('writing-guion-next', () => { setWritingGuionWriteIdx((i) => Math.min(guionData.length - 1, i + 1)); setWritingCanvasKey((k) => k + 1); })} className="muller-icon-nav inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white border border-white/10 disabled:opacity-30">Siguiente <Icon name="chevron-right" className="w-3.5 h-3.5 text-white shrink-0" /></button>
                                          </div>
                                      </>
                                  )}
                              </div>
                          )}

                          {writingMode === 'vocab' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  <p className="text-rose-200/90 text-sm font-bold">Repite la palabra / frase del vocabulario</p>
                                  {currentVocabList.length === 0 ? (
                                      <p className="text-gray-500 text-sm">Sin lista de vocabulario aún. Abre <strong className="text-white">Vocab</strong> o carga un guion con vocabulario en <strong className="text-white">Historia</strong>.</p>
                                  ) : (
                                      <>
                                          <p className="text-xl md:text-2xl text-amber-100 font-black">{currentVocabList[writingVocabIdx % currentVocabList.length].de}</p>
                                          <p className="text-sm text-gray-500">{currentVocabList[writingVocabIdx % currentVocabList.length].es}</p>
                                          <button type="button" onClick={() => runSingleSubmitAction('writing-vocab-next', () => { setWritingVocabIdx((i) => (i + 1) % currentVocabList.length); setWritingCanvasKey((k) => k + 1); })} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-900/50 hover:bg-amber-800/70 border border-amber-600/40">Otra palabra</button>
                                      </>
                                  )}
                              </div>
                          )}

                          <div className="flex flex-wrap gap-2 md:gap-3 items-center mb-3 text-[11px] md:text-xs">
                              <label className="flex items-center gap-2 cursor-pointer bg-black/30 px-2 py-1 rounded-lg border border-white/10">
                                  <input type="checkbox" className="accent-rose-500" checked={writingGrid} onChange={(e) => setWritingGrid(e.target.checked)} />
                                  Líneas (cuaderno)
                              </label>
                              <span className="text-gray-500">Grosor lápiz:</span>
                              {[2, 4, 7].map((w) => (
                                  <button key={w} type="button" onClick={() => setWritingStroke(w)} className={`px-2 py-1 rounded-lg font-bold ${writingStroke === w ? 'bg-rose-700 text-white' : 'bg-slate-800 text-gray-400'}`}>{w}px</button>
                              ))}
                          </div>

                          <TabletWritingCanvas
                              padKey={writingCanvasKey}
                              grid={writingGrid}
                              strokeW={writingStroke}
                              compareTarget={writingCompareTarget}
                              snapshotData={writingCanvasSnapshot.data}
                              snapshotPadKey={writingCanvasSnapshot.padKey}
                              onSnapshotChange={(dataUrl) => setWritingCanvasSnapshot({ padKey: writingCanvasKey, data: dataUrl || '' })}
                              onOcrCompared={(payload) => {
                                  const arr = mullerPushOcrHistory(payload);
                                  setOcrHistoryList(arr);
                                  if (writingMode === 'telc') {
                                      setWritingTelcLastOcrText(String(payload && payload.recognizedText ? payload.recognizedText : '').trim());
                                  }
                              }}
                          />
                      </div>
                  );
}
window.EscrituraPanel = EscrituraPanel;