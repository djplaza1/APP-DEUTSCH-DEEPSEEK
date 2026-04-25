   
   function LecturaPanel(props) {
  const {
    activeTab, practiceActive,
    readingSource, setReadingSource,
    readingScriptId, setReadingScriptId,
    readingTextInput, setReadingTextInput,
    readingPasteReaderOpen, setReadingPasteReaderOpen,
    readingPasteFromPdf, setReadingPasteFromPdf,
    readingFontPx, setReadingFontPx,
    readingWordInfo, setReadingWordInfo,
    readingFocusMode, setReadingFocusMode,
    readingSelectedSnippet, setReadingSelectedSnippet,
    readingWordAudioBusy, setReadingWordAudioBusy,
    readingListening, setReadingListening,
    readingTranscript, setReadingTranscript,
    readingScore, setReadingScore,
    readingFeedback, setReadingFeedback,
    readingTargetText,
    readingScriptOptions,
    readingProgress,
    readingWordTokens,
    readingVerbInfo,
    readingSelectedWord,
    readingSentences,
    readingCaptureCurrentSelection,
    readingSpeakText,
    speakReadingWord,
    speakReadingSentenceWithWord,
    readingTipForWord,
    runReadingWordLookup,
    startReadingListen,
    stopReadingListen,
    finalizeReadingSession,
    runReadingCompare,
    readingTextSurfaceRef,
    stopAudio, saveProgress, mergeActivityPoints,
    clearPdfStudyTextFromReading,
    loadPdfStudyFile,
    pdfStudySavedDocs,
    loadPdfStudyFromLibrary,
    removePdfStudyFromLibrary,
    clearPdfStudyLibrary,
    saveCurrentPdfStudyDoc,
    clearPdfStudyDoc,
    pdfStudyDoc,
    pdfStudyPageIdx, setPdfStudyPageIdx,
    pdfStudyErr,
    pdfStudyBusyMsg,
    pdfStudyExtracting,
    pdfStudyOcrBusy,
    pdfStudyOcrBatching,
    activePdfPageData,
    applyPdfStudyTextToReading,
    applyPdfStudyTextToWriting,
    openPdfStudyFullscreen,
    runPdfPageOcr,
    runPdfOcrBatch,
    pdfStudyOcrAbortRef,
    pdfStudyLastApplied,
    updatePdfStudyPageMeta,
    runSingleSubmitAction,
    runPdfDidacticAnalysis,
    sendPdfDidacticToRuta,
    sendPdfDidacticToBx,
    sendPdfDidacticToVocab,
    savePdfDidacticPack,
    exportAllPdfCoachData,
    importAllPdfCoachData,
    pdfDidacticPackLibrary,
    loadPdfDidacticPackFromLibrary,
    pdfDidacticPack,
    removePdfDidacticPackFromLibrary,
    clearPdfDidacticPackLibrary,
  } = props;
  return (
                      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <h1 className="text-2xl md:text-4xl font-black text-sky-100 flex items-center gap-2 md:gap-3">
                                  <Icon name="mic" className="w-8 h-8 md:w-10 md:h-10" /> Lectura en voz alta
                              </h1>
                          </div>
                          <p className="text-sky-50/90 text-sm md:text-base mb-4 leading-relaxed">
                              Lee un texto completo y compara tu producción con el original. Puedes usar la historia actual, un guion guardado o pegar un texto manualmente.
                              Toca cualquier palabra para ver traducción al español y, si es verbo, pasado y Perfekt.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                              <label className="text-xs font-bold text-sky-200/90 uppercase tracking-wider">
                                  Fuente
                                  <select
                                      value={readingSource}
                                      onChange={(e) => {
                                          const v = e.target.value;
                                          setReadingSource(v);
                                          if (v !== 'paste') {
                                              setReadingPasteFromPdf(false);
                                              setReadingPasteReaderOpen(false);
                                          }
                                      }}
                                      className="mt-1 w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white normal-case"
                                  >
                                      <option value="current_story">Historia actual</option>
                                      <option value="one_saved">Guion guardado</option>
                                      <option value="paste">Texto pegado o PDF (Lectura)</option>
                                  </select>
                              </label>
                              {readingSource === 'one_saved' && (
                                  <label className="text-xs font-bold text-sky-200/90 uppercase tracking-wider md:col-span-2">
                                      Guion
                                      <select value={readingScriptId} onChange={(e) => setReadingScriptId(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white normal-case">
                                          <option value="__current__" disabled>Selecciona un guion…</option>
                                          {readingScriptOptions.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                                      </select>
                                  </label>
                              )}
                          </div>
                          {readingSource === 'paste' && (
                              <div className="mb-3 rounded-xl border border-sky-500/30 bg-sky-950/20 p-3 space-y-2">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                      <p className="text-xs font-bold text-sky-200">
                                          {readingPasteFromPdf ? 'Texto desde PDF (editable)' : 'Texto libre o pegado'}
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                          <button
                                              type="button"
                                              onClick={() => setReadingPasteReaderOpen(true)}
                                              className="px-3 py-1.5 rounded-lg border border-emerald-500/50 bg-emerald-900/50 text-xs font-bold text-emerald-100 hover:bg-emerald-800/60"
                                          >
                                              Ver en grande
                                          </button>
                                          {readingPasteFromPdf ? (
                                              <button
                                                  type="button"
                                                  onClick={clearPdfStudyTextFromReading}
                                                  className="px-3 py-1.5 rounded-lg border border-slate-500/50 bg-slate-900/55 text-xs font-bold text-slate-100 hover:bg-slate-800/65"
                                              >
                                                  Quitar de Lectura
                                              </button>
                                          ) : null}
                                      </div>
                                  </div>
                                  <textarea
                                      value={readingTextInput}
                                      onChange={(e) => setReadingTextInput(e.target.value)}
                                      placeholder="Pega o edita tu texto en alemán…"
                                      className="w-full min-h-[min(42vh,22rem)] max-h-[min(55vh,32rem)] overflow-y-auto bg-black/40 border border-sky-500/35 rounded-xl p-3 md:p-4 text-sm md:text-[15px] leading-relaxed text-white"
                                  />
                              </div>
                          )}

                          {readingSource === 'paste' && readingPasteReaderOpen && (
                              <div
                                  className="fixed inset-0 z-[240] flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm"
                                  role="dialog"
                                  aria-modal="true"
                                  aria-labelledby="muller-reading-reader-title"
                                  onClick={(e) => { if (e.target === e.currentTarget) setReadingPasteReaderOpen(false); }}
                              >
                                  <div
                                      className="relative w-full max-w-4xl max-h-[min(92vh,900px)] flex flex-col rounded-2xl border border-sky-500/40 bg-slate-950 shadow-2xl shadow-sky-900/40"
                                      onClick={(e) => e.stopPropagation()}
                                  >
                                      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-white/10 bg-slate-900/80 rounded-t-2xl">
                                          <h2 id="muller-reading-reader-title" className="text-base md:text-lg font-black text-sky-100 pr-2">
                                              Texto para leer{readingPasteFromPdf ? ' (desde PDF)' : ''}
                                          </h2>
                                          <div className="flex flex-wrap gap-2">
                                              {readingPasteFromPdf ? (
                                                  <button
                                                      type="button"
                                                      onClick={clearPdfStudyTextFromReading}
                                                      className="px-3 py-2 rounded-xl border border-orange-500/45 bg-orange-950/50 text-xs font-bold text-orange-100 hover:bg-orange-900/60"
                                                  >
                                                      Quitar de Lectura
                                                  </button>
                                              ) : null}
                                              <button
                                                  type="button"
                                                  onClick={() => setReadingPasteReaderOpen(false)}
                                                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-sm font-black text-white"
                                              >
                                                  Cerrar
                                              </button>
                                          </div>
                                      </div>
                                      <div
                                          className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 text-white whitespace-pre-wrap leading-relaxed"
                                          style={{ fontSize: `clamp(17px, 2.8vw, ${Math.min(26, (readingFontPx || 19) + 5)}px)` }}
                                      >
                                          {(readingTextInput && String(readingTextInput).trim()) ? String(readingTextInput) : 'Sin texto todavía.'}
                                      </div>
                                      <p className="px-4 pb-3 text-[11px] text-slate-400 border-t border-white/5 pt-2">
                                          Cierra este recuadro para usar diccionario por palabra, audio y evaluación en el panel de abajo.
                                      </p>
                                  </div>
                              </div>
                          )}

                          <div className="rounded-xl bg-black/35 border border-sky-500/25 p-3 mb-4">
                              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                                  <p className="text-[11px] text-sky-200/80">Texto objetivo</p>
                                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-sky-500/35 bg-sky-950/40 px-2 py-1">
                                      <button
                                          type="button"
                                          onClick={() => setReadingFocusMode((v) => !v)}
                                          className={`px-2 py-0.5 text-[10px] font-bold rounded border ${readingFocusMode ? 'border-emerald-300/70 text-emerald-100 bg-emerald-900/45' : 'border-sky-400/40 text-sky-100 hover:bg-sky-900/60'}`}
                                      >
                                          {readingFocusMode ? 'Modo lectura: ON' : 'Modo lectura'}
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => setReadingFontPx((v) => mullerClamp(v - MULLER_READING_FONT_STEP, MULLER_READING_FONT_MIN, MULLER_READING_FONT_MAX))}
                                          className="px-2 py-0.5 text-xs font-black rounded bg-sky-900/70 hover:bg-sky-800 text-sky-100"
                                          aria-label="Reducir tamaño de texto"
                                      >
                                          A-
                                      </button>
                                      <span className="text-[10px] font-bold text-sky-200 tabular-nums">{readingFontPx}px</span>
                                      <button
                                          type="button"
                                          onClick={() => setReadingFontPx((v) => mullerClamp(v + MULLER_READING_FONT_STEP, MULLER_READING_FONT_MIN, MULLER_READING_FONT_MAX))}
                                          className="px-2 py-0.5 text-xs font-black rounded bg-sky-900/70 hover:bg-sky-800 text-sky-100"
                                          aria-label="Aumentar tamaño de texto"
                                      >
                                          A+
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => setReadingFontPx(19)}
                                          className="px-2 py-0.5 text-[10px] font-bold rounded border border-sky-400/50 text-sky-100 hover:bg-sky-900/60"
                                      >
                                          Reset
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => readingSelectedWord && speakReadingWord(readingSelectedWord)}
                                          disabled={!readingSelectedWord || readingWordAudioBusy}
                                          className="px-2 py-0.5 text-[10px] font-bold rounded border border-cyan-400/55 text-cyan-100 hover:bg-cyan-900/50 disabled:opacity-40"
                                      >
                                          🔊 Palabra
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => speakReadingSentenceWithWord(readingSelectedWord)}
                                          disabled={(!readingSelectedWord && !readingSelectedSnippet) || readingWordAudioBusy}
                                          className="px-2 py-0.5 text-[10px] font-bold rounded border border-teal-400/55 text-teal-100 hover:bg-teal-900/50 disabled:opacity-40"
                                      >
                                          🔊 {readingSelectedSnippet ? 'Frase sel.' : 'Frase'}
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => setReadingSelectedSnippet('')}
                                          disabled={!readingSelectedSnippet}
                                          className="px-2 py-0.5 text-[10px] font-bold rounded border border-slate-400/45 text-slate-200 hover:bg-slate-800/70 disabled:opacity-35"
                                      >
                                          Limpiar frase
                                      </button>
                                  </div>
                              </div>
                          <p className="text-[11px] text-sky-200/80 mb-2">
                              Puedes seleccionar una frase con el dedo o ratón y usar 🔊 Frase para reproducir solo esa parte.
                          </p>
                          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/25 p-3 mb-3 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-[11px] font-black text-cyan-200 uppercase tracking-wider">PDF estudio (premium · MVP)</p>
                                  <span className="text-[10px] text-cyan-100/75">Texto por página + OCR fallback</span>
                              </div>
                              <div className="flex flex-wrap gap-2 items-center">
                                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-cyan-400/35 bg-black/35 text-xs font-bold text-cyan-100 cursor-pointer">
                                      <input
                                          type="file"
                                          accept="application/pdf"
                                          className="hidden"
                                          onChange={(e) => {
                                              const f = e.target.files && e.target.files[0];
                                              if (f) loadPdfStudyFile(f);
                                              e.target.value = '';
                                          }}
                                      />
                                      {pdfStudyExtracting ? '⏳ Procesando PDF…' : '📄 Subir PDF'}
                                  </label>
                                  {pdfStudySavedDocs.length > 0 && (
                                      <>
                                          <select
                                              value="__none__"
                                              onChange={(e) => {
                                                  const id = e.target.value;
                                                  if (id && id !== '__none__') loadPdfStudyFromLibrary(id);
                                                  e.target.value = '__none__';
                                              }}
                                              className="bg-black/45 border border-cyan-500/35 rounded-lg px-2 py-2 text-xs text-white"
                                          >
                                              <option value="__none__">Biblioteca PDF…</option>
                                              {pdfStudySavedDocs.map((d) => (
                                                  <option key={d.id} value={d.id}>
                                                      {d.name} · {d.totalPages || 0}p
                                                  </option>
                                              ))}
                                          </select>
                                          <button
                                              type="button"
                                              onClick={() => {
                                                  if (!pdfStudyDoc || !pdfStudyDoc.id) return;
                                                  removePdfStudyFromLibrary(pdfStudyDoc.id);
                                              }}
                                              disabled={!pdfStudyDoc || !pdfStudyDoc.id}
                                              className="px-3 py-2 rounded-lg border border-orange-500/35 bg-orange-900/40 hover:bg-orange-800/50 disabled:opacity-45 text-xs font-bold text-orange-100"
                                          >
                                              Borrar guardado
                                          </button>
                                          <button
                                              type="button"
                                              onClick={clearPdfStudyLibrary}
                                              className="px-3 py-2 rounded-lg border border-amber-600/35 bg-amber-950/45 hover:bg-amber-900/55 text-xs font-bold text-amber-100"
                                          >
                                              Vaciar biblioteca
                                          </button>
                                      </>
                                  )}
                                  {pdfStudyDoc && (
                                      <>
                                          <select
                                              value={Math.max(1, (activePdfPageData.page || 1))}
                                              onChange={(e) => setPdfStudyPageIdx(Math.max(0, Number(e.target.value) - 1))}
                                              className="bg-black/45 border border-cyan-500/35 rounded-lg px-2 py-2 text-xs text-white"
                                          >
                                              {(pdfStudyDoc.pages || []).map((p) => (
                                                  <option key={p.page} value={p.page}>
                                                      Página {p.page}{p.unit ? ` · U:${p.unit}` : ''}{p.lesson ? ` · L:${p.lesson}` : ''}{p.ocrPending ? ' · OCR pendiente' : ''}
                                                  </option>
                                              ))}
                                          </select>
                                          <button
                                              type="button"
                                              onClick={() => runPdfPageOcr(activePdfPageData.page || 1)}
                                              disabled={pdfStudyOcrBusy || pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-amber-500/35 bg-amber-900/40 hover:bg-amber-800/50 disabled:opacity-45 text-xs font-bold text-amber-100"
                                          >
                                              {pdfStudyOcrBusy ? 'OCR…' : 'OCR página'}
                                          </button>
                                          <button
                                              type="button"
                                              onClick={runPdfOcrBatch}
                                              disabled={pdfStudyExtracting || pdfStudyOcrBusy || pdfStudyOcrBatching}
                                              className="px-3 py-2 rounded-lg border border-fuchsia-500/35 bg-fuchsia-900/40 hover:bg-fuchsia-800/50 disabled:opacity-45 text-xs font-bold text-fuchsia-100"
                                          >
                                              {pdfStudyOcrBatching ? 'OCR lotes…' : 'OCR 12 páginas'}
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => { pdfStudyOcrAbortRef.current = true; }}
                                              disabled={!pdfStudyOcrBatching}
                                              className="px-3 py-2 rounded-lg border border-gray-500/35 bg-gray-900/45 hover:bg-gray-800/55 disabled:opacity-45 text-xs font-bold text-gray-100"
                                          >
                                              Detener OCR
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => applyPdfStudyTextToReading(activePdfPageData.page || 1)}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-emerald-500/35 bg-emerald-900/40 hover:bg-emerald-800/50 disabled:opacity-45 text-xs font-bold text-emerald-100"
                                          >
                                              Usar en Lectura
                                          </button>
                                          <button
                                              type="button"
                                              onClick={clearPdfStudyTextFromReading}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-slate-500/35 bg-slate-900/45 hover:bg-slate-800/55 disabled:opacity-45 text-xs font-bold text-slate-100"
                                          >
                                              Quitar de Lectura
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => applyPdfStudyTextToWriting(activePdfPageData.page || 1)}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-rose-500/35 bg-rose-900/40 hover:bg-rose-800/50 disabled:opacity-45 text-xs font-bold text-rose-100"
                                          >
                                              Usar en Escritura
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => openPdfStudyFullscreen(activePdfPageData.page || 1)}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-indigo-500/35 bg-indigo-900/45 hover:bg-indigo-800/55 disabled:opacity-45 text-xs font-bold text-indigo-100"
                                          >
                                              Abrir PDF completo
                                          </button>
                                          <button
                                              type="button"
                                              onClick={saveCurrentPdfStudyDoc}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-sky-500/35 bg-sky-900/45 hover:bg-sky-800/55 disabled:opacity-45 text-xs font-bold text-sky-100"
                                          >
                                              Guardar PDF
                                          </button>
                                          <button
                                              type="button"
                                              onClick={clearPdfStudyDoc}
                                              disabled={pdfStudyExtracting || pdfStudyOcrBusy}
                                              className="px-3 py-2 rounded-lg border border-red-500/35 bg-red-900/45 hover:bg-red-800/55 disabled:opacity-45 text-xs font-bold text-red-100"
                                          >
                                              Quitar PDF
                                          </button>
                                      </>
                                  )}
                              </div>
                              {pdfStudyErr ? <p className="text-[11px] text-red-300">{pdfStudyErr}</p> : null}
                              {pdfStudyBusyMsg ? <p className="text-[11px] text-cyan-100/80">{pdfStudyBusyMsg}</p> : null}
                              {pdfStudyDoc && (
                                  <div className="text-[10px] text-cyan-100/80 space-y-1">
                                      <p><strong className="text-cyan-200">Libro:</strong> {pdfStudyDoc.name} · {pdfStudyDoc.totalPages} páginas</p>
                                      <p><strong className="text-cyan-200">Unidad:</strong> {activePdfPageData.unit || '—'} · <strong className="text-cyan-200">Lección:</strong> {activePdfPageData.lesson || '—'} · <strong className="text-cyan-200">Página:</strong> {activePdfPageData.page || '—'}</p>
                                      {pdfStudyLastApplied ? <p className="text-emerald-300/90">{pdfStudyLastApplied}</p> : null}
                                  </div>
                              )}
                              {pdfStudyDoc && activePdfPageData.page ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <label className="text-[10px] font-bold text-cyan-200/90 uppercase tracking-wider">
                                          Unidad (manual)
                                          <input
                                              value={activePdfPageData.unit || ''}
                                              onChange={(e) => updatePdfStudyPageMeta(activePdfPageData.page || 1, { unit: e.target.value })}
                                              placeholder="Ej: 3"
                                              className="mt-1 w-full bg-black/45 border border-cyan-500/30 rounded-lg px-2 py-1.5 text-xs text-white normal-case"
                                          />
                                      </label>
                                      <label className="text-[10px] font-bold text-cyan-200/90 uppercase tracking-wider">
                                          Lección (manual)
                                          <input
                                              value={activePdfPageData.lesson || ''}
                                              onChange={(e) => updatePdfStudyPageMeta(activePdfPageData.page || 1, { lesson: e.target.value })}
                                              placeholder="Ej: A"
                                              className="mt-1 w-full bg-black/45 border border-cyan-500/30 rounded-lg px-2 py-1.5 text-xs text-white normal-case"
                                          />
                                      </label>
                                  </div>
                              ) : null}
                              {pdfStudyDoc && (
                                  <textarea
                                      value={activePdfPageData.text || ''}
                                      readOnly
                                      className="w-full h-28 bg-black/35 border border-cyan-500/25 rounded-xl p-3 text-xs md:text-sm text-cyan-50"
                                      placeholder="Sin texto extraído en esta página todavía."
                                  />
                              )}
                              {pdfStudyDoc && (
                                  <div className="rounded-xl border border-fuchsia-500/30 bg-fuchsia-950/25 p-3 space-y-2">
                                      <div className="flex flex-wrap gap-2 items-center">
                                          <p className="text-[11px] font-black text-fuchsia-200 uppercase tracking-wider">PDF didáctico (Fase B)</p>
                                          <button
                                              type="button"
                                              onClick={() => runSingleSubmitAction('pdf-didactic-analyze', () => runPdfDidacticAnalysis(activePdfPageData.page || 1))}
                                              className="px-3 py-1.5 rounded-lg border border-fuchsia-400/40 bg-fuchsia-900/50 hover:bg-fuchsia-800/60 text-[11px] font-bold text-fuchsia-100"
                                          >
                                              Analizar página
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => runSingleSubmitAction('pdf-didactic-to-ruta', sendPdfDidacticToRuta)}
                                              disabled={!pdfDidacticPack}
                                              className="px-3 py-1.5 rounded-lg border border-white/20 bg-black/45 hover:bg-black/60 disabled:opacity-45 text-[11px] font-bold text-white"
                                          >
                                              Enviar a Ruta
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => runSingleSubmitAction('pdf-didactic-to-bx', () => sendPdfDidacticToBx('auto'))}
                                              disabled={!pdfDidacticPack}
                                              className="px-3 py-1.5 rounded-lg border border-cyan-400/40 bg-cyan-900/45 hover:bg-cyan-800/55 disabled:opacity-45 text-[11px] font-bold text-cyan-100"
                                          >
                                              Enviar a Banco B1-B2
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => runSingleSubmitAction('pdf-didactic-to-vocab', sendPdfDidacticToVocab)}
                                              disabled={!pdfDidacticPack}
                                              className="px-3 py-1.5 rounded-lg border border-amber-400/40 bg-amber-900/45 hover:bg-amber-800/55 disabled:opacity-45 text-[11px] font-bold text-amber-100"
                                          >
                                              Enviar a Vocabulario
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => runSingleSubmitAction('pdf-didactic-save-pack', savePdfDidacticPack)}
                                              disabled={!pdfDidacticPack}
                                              className="px-3 py-1.5 rounded-lg border border-emerald-400/40 bg-emerald-900/45 hover:bg-emerald-800/55 disabled:opacity-45 text-[11px] font-bold text-emerald-100"
                                          >
                                              Guardar pack
                                          </button>
                                          <button
                                              type="button"
                                              onClick={exportAllPdfCoachData}
                                              className="px-3 py-1.5 rounded-lg border border-indigo-400/40 bg-indigo-900/45 hover:bg-indigo-800/55 text-[11px] font-bold text-indigo-100"
                                          >
                                              Exportar todo
                                          </button>
                                          <label className="px-3 py-1.5 rounded-lg border border-slate-400/30 bg-slate-900/55 hover:bg-slate-800/65 text-[11px] font-bold text-slate-100 cursor-pointer">
                                              Importar todo
                                              <input type="file" accept="application/json" className="hidden" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) importAllPdfCoachData(f); e.target.value = ''; }} />
                                          </label>
                                      </div>
                                      {pdfDidacticPackLibrary.length > 0 ? (
                                          <div className="flex flex-wrap gap-2 items-center">
                                              <select
                                                  value="__none__"
                                                  onChange={(e) => {
                                                      const key = e.target.value;
                                                      if (key && key !== '__none__') loadPdfDidacticPackFromLibrary(key);
                                                      e.target.value = '__none__';
                                                  }}
                                                  className="bg-black/45 border border-fuchsia-500/35 rounded-lg px-2 py-1.5 text-[11px] text-white"
                                              >
                                                  <option value="__none__">Biblioteca packs didácticos…</option>
                                                  {pdfDidacticPackLibrary.map((p) => (
                                                      <option key={p._libraryKey || p.id} value={p._libraryKey || ''}>
                                                          {p.sourceDocName || 'PDF'} · p{p.page || 1} · U{p.unit || '-'} L{p.lesson || '-'}
                                                      </option>
                                                  ))}
                                              </select>
                                              <button
                                                  type="button"
                                                  onClick={() => { if (pdfDidacticPack && pdfDidacticPack._libraryKey) removePdfDidacticPackFromLibrary(pdfDidacticPack._libraryKey); }}
                                                  disabled={!pdfDidacticPack || !pdfDidacticPack._libraryKey}
                                                  className="px-3 py-1.5 rounded-lg border border-rose-400/40 bg-rose-900/45 hover:bg-rose-800/55 disabled:opacity-45 text-[11px] font-bold text-rose-100"
                                              >
                                                  Quitar pack
                                              </button>
                                              <button
                                                  type="button"
                                                  onClick={clearPdfDidacticPackLibrary}
                                                  className="px-3 py-1.5 rounded-lg border border-orange-400/40 bg-orange-900/45 hover:bg-orange-800/55 text-[11px] font-bold text-orange-100"
                                              >
                                                  Vaciar packs
                                              </button>
                                          </div>
                                      ) : null}
                                      {pdfDidacticPack && Number(pdfDidacticPack.page || 0) === Number(activePdfPageData.page || 0) ? (
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                                              <div className="rounded-lg border border-fuchsia-400/25 bg-black/30 p-2">
                                                  <p className="font-bold text-fuchsia-200 mb-1">Vocabulario clave</p>
                                                  <p className="text-fuchsia-100/90">{(pdfDidacticPack.keywords || []).slice(0, 10).map((k) => k.de).join(', ') || '—'}</p>
                                              </div>
                                              <div className="rounded-lg border border-fuchsia-400/25 bg-black/30 p-2">
                                                  <p className="font-bold text-fuchsia-200 mb-1">Frases ejemplo</p>
                                                  <p className="text-fuchsia-100/90">{(pdfDidacticPack.phrases || []).slice(0, 2).join('  ·  ') || '—'}</p>
                                              </div>
                                          </div>
                                      ) : null}
                                  </div>
                              )}
                          </div>
                              
                          {readingFocusMode && (
                                  <p className="text-[11px] text-emerald-200/90 mb-2">
                                      Modo lectura activo: se ocultan resultados de evaluación para concentrarte en comprensión + diccionario.
                                  </p>
                              )}
                              {readingTargetText ? (
                                  <div
                                      ref={readingTextSurfaceRef}
                                      className="text-white leading-relaxed whitespace-pre-wrap"
                                      onMouseUp={readingCaptureCurrentSelection}
                                      onTouchEnd={readingCaptureCurrentSelection}
                                      onKeyUp={readingCaptureCurrentSelection}
                                      style={{ fontSize: `${readingFontPx}px`, lineHeight: 1.65, userSelect: 'text', WebkitUserSelect: 'text' }}
                                  >
                                      {readingWordTokens.map((token, idx) => {
                                          if (!token.clickable) return <span key={`s-${idx}`}>{token.text}</span>;
                                          const isActive = token.word === readingSelectedWord;
                                          return (
                                              <span
                                                  key={`w-${idx}`}
                                                  role="button"
                                                  tabIndex={0}
                                                  className={`reading-word-token ${isActive ? 'is-active' : ''}`}
                                                  onClick={() => runReadingWordLookup(token.word)}
                                                  onKeyDown={(e) => {
                                                      if (e.key === 'Enter' || e.key === ' ') {
                                                          e.preventDefault();
                                                          runReadingWordLookup(token.word);
                                                      }
                                                  }}
                                                  title="Tocar para ver traducción y tiempos"
                                              >
                                                  {token.text}
                                              </span>
                                          );
                                      })}
                                  </div>
                              ) : (
                                  <p className="text-sm md:text-base text-white leading-relaxed whitespace-pre-wrap">No hay texto disponible para comparar.</p>
                              )}
                              {readingSelectedSnippet && (
                                  <div className="mt-2 rounded-lg border border-teal-500/30 bg-teal-950/25 px-2.5 py-2">
                                      <p className="text-[11px] text-teal-100">
                                          Frase seleccionada: <span className="text-white">{readingSelectedSnippet.length > 160 ? `${readingSelectedSnippet.slice(0, 160)}…` : readingSelectedSnippet}</span>
                                      </p>
                                  </div>
                              )}
                          </div>

                          {readingWordInfo && (
                              <div className="rounded-xl bg-cyan-950/35 border border-cyan-500/30 p-3 mb-4 space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                      <p className="text-cyan-200 font-black text-sm">Palabra: <span className="text-white">{readingWordInfo.word}</span></p>
                                      {readingWordInfo.loading && <span className="text-[10px] font-bold text-cyan-300 animate-pulse">Buscando…</span>}
                                  </div>
                                  {readingWordInfo.translation && (
                                      <p className="text-sm text-cyan-100">
                                          <span className="font-bold text-cyan-300">Traducción:</span> {readingWordInfo.translation}
                                      </p>
                                  )}
                                  {!readingWordInfo.loading && !readingWordInfo.translation && (
                                      <p className="text-xs text-cyan-200/80">No se obtuvo traducción automática para esta palabra.</p>
                                  )}
                                  {readingWordInfo.error && <p className="text-xs text-red-300">{readingWordInfo.error}</p>}
                                  {readingVerbInfo && (
                                      <div className="rounded-lg bg-black/25 border border-white/10 p-2.5">
                                          <p className="text-xs text-emerald-300 font-black mb-1">
                                              Verbo detectado{readingVerbInfo.level ? ` · ${readingVerbInfo.level}` : ''}
                                          </p>
                                          <p className="text-xs text-emerald-100">Infinitivo: <strong>{readingVerbInfo.infinitive}</strong></p>
                                          {(readingVerbInfo.translation && !readingWordInfo.translation) && (
                                              <p className="text-xs text-emerald-100">ES: {readingVerbInfo.translation}</p>
                                          )}
                                          {readingVerbInfo.praeteritum && <p className="text-xs text-emerald-100">Pasado (Präteritum): {readingVerbInfo.praeteritum}</p>}
                                          {readingVerbInfo.perfekt && <p className="text-xs text-emerald-100">Perfekt: {readingVerbInfo.perfekt}</p>}
                                          {!readingVerbInfo.praeteritum && !readingVerbInfo.perfekt && readingVerbInfo.formsHint && (
                                              <p className="text-xs text-emerald-100">{readingVerbInfo.formsHint}</p>
                                          )}
                                      </div>
                                  )}
                              </div>
                          )}

                          <div className="flex flex-wrap gap-3 items-center mb-3">
                              <button type="button" onClick={startReadingListen} disabled={readingListening || !readingTargetText} className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 font-black text-sm">🎤 Empezar lectura</button>
                              <button type="button" onClick={stopReadingListen} disabled={!readingListening} className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-40 font-black text-sm">⏹ Parar y evaluar</button>
                              <span className={`text-xs font-bold ${readingListening ? 'text-emerald-300 animate-pulse' : 'text-gray-500'}`}>{readingListening ? 'Escuchando…' : 'Micrófono en espera'}</span>
                          </div>
                          {!readingFocusMode && readingListening && readingProgress.total > 0 && (
                              <p className="text-[11px] text-sky-200/75 -mt-1 mb-3">Progreso lectura: {readingProgress.matched}/{readingProgress.total} palabras ({readingProgress.pct}%).</p>
                          )}
                          {!readingFocusMode && readingTranscript && (
                              <div className="rounded-xl bg-amber-950/35 border border-amber-600/30 p-3 mb-3">
                                  <p className="text-[11px] text-amber-200/80 mb-1">Tu lectura detectada</p>
                                  <p className="text-sm text-amber-100">{readingTranscript}</p>
                              </div>
                          )}
                          {!readingFocusMode && readingScore !== null && (
                              <div className="rounded-xl bg-sky-950/35 border border-sky-500/30 p-3 mb-3">
                                  <div className="flex items-center gap-2">
                                      <div className="flex-1 h-2.5 rounded-full bg-black/40 overflow-hidden">
                                          <div className={`h-full ${readingScore >= 85 ? 'bg-emerald-500' : readingScore >= 60 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${readingScore}%` }} />
                                      </div>
                                      <span className="text-white font-black text-sm">{readingScore}%</span>
                                  </div>
                              </div>
                          )}
                          {!readingFocusMode && readingFeedback.length > 0 && (
                              <div className="rounded-xl bg-black/35 border border-red-500/30 p-3 space-y-2">
                                  <p className="text-red-200 font-bold text-sm">Palabras a mejorar</p>
                                  {readingFeedback.map((f, i) => (
                                      <div key={i} className="text-xs md:text-sm border border-white/10 rounded-lg p-2 bg-white/5">
                                          <p className="text-red-200 font-bold">{f.word}</p>
                                          <p className="text-gray-300 mt-0.5">{f.tip}</p>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
  );
}

window.LecturaPanel = LecturaPanel;