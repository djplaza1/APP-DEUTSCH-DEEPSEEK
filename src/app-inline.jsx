        const { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } = React;

        function App() {
          const [activeTab, setActiveTab] = useState(() => { try { return localStorage.getItem('muller_active_tab_v1') || 'inicio'; } catch { return 'inicio'; } });
          const [showSplash, setShowSplash] = useState(true); 
          const [splashLogoBlink, setSplashLogoBlink] = useState(false);
          const [rutaSubTab, setRutaSubTab] = useState('camino');
          const [rutaProgress, setRutaProgress] = useState(() => (typeof window.mullerRutaLoad === 'function' ? window.mullerRutaLoad() : { completed: {}, placementDone: false, suggestedLevelIdx: 0, playTimeMs: 0, lessonsCompleted: 0 }));
          const [rutaRun, setRutaRun] = useState(null);
          const [rutaVerbDb, setRutaVerbDb] = useState({ meta: null, verbs: [] });
          const [rutaArticleDb, setRutaArticleDb] = useState([]);
          const [rutaTopicFilter, setRutaTopicFilter] = useState('all');
          // --- NUEVOS ESTADOS PARA TEST ADAPTATIVO (30 PREGUNTAS) ---
const [placementQuestions, setPlacementQuestions] = useState([]);
const [placementAnswers, setPlacementAnswers] = useState([]);
const [placementIndex, setPlacementIndex] = useState(0);
const [placementLevel, setPlacementLevel] = useState('A2');
const [placementScore, setPlacementScore] = useState({ correct: 0, total: 0 });
const [placementFinished, setPlacementFinished] = useState(false);
          const [rutaMentor, setRutaMentor] = useState('lena');
          const [rutaFillInput, setRutaFillInput] = useState('');
          const [rutaSpeakErr, setRutaSpeakErr] = useState('');
          const [rutaPdfPack, setRutaPdfPack] = useState(null);
          const [rutaPdfGapIdx, setRutaPdfGapIdx] = useState(0);
          const [rutaPdfGapInput, setRutaPdfGapInput] = useState('');
          const [rutaPdfFeedback, setRutaPdfFeedback] = useState('');
          const [rutaPdfCoachStats, setRutaPdfCoachStats] = useState(() => {
              try {
                  const raw = localStorage.getItem(MULLER_PDF_COACH_STATS_KEY);
                  return raw ? JSON.parse(raw) : {};
              } catch (e) {
                  return {};
              }
          });
          const [celebrationModal, setCelebrationModal] = useState(null);
          const [telcLevel, setTelcLevel] = useState('B1');
          const [diktatMotivationMsg, setDiktatMotivationMsg] = useState('');
          const rutaTabTimerRef = useRef(null);
          const [rutaTranscript, setRutaTranscript] = useState('');
          const [rutaListening, setRutaListening] = useState(false);
          const [readingSource, setReadingSource] = useState('current_story');
          const [readingScriptId, setReadingScriptId] = useState('__current__');
          const [readingTextInput, setReadingTextInput] = useState('');
          const [readingPasteReaderOpen, setReadingPasteReaderOpen] = useState(false);
          const [readingPasteFromPdf, setReadingPasteFromPdf] = useState(false);
          const [readingFontPx, setReadingFontPx] = useState(() => {
              try {
                  const raw = Number(localStorage.getItem(MULLER_READING_FONT_STORAGE));
                  return Number.isFinite(raw) ? mullerClamp(raw, MULLER_READING_FONT_MIN, MULLER_READING_FONT_MAX) : 19;
              } catch (e) {
                  return 19;
              }
          });
          const [readingWordInfo, setReadingWordInfo] = useState(null);
          const [readingFocusMode, setReadingFocusMode] = useState(false);
          const [readingSelectedSnippet, setReadingSelectedSnippet] = useState('');
          const [readingWordAudioBusy, setReadingWordAudioBusy] = useState(false);
          const [readingListening, setReadingListening] = useState(false);
          const [readingTranscript, setReadingTranscript] = useState('');
          const [readingScore, setReadingScore] = useState(null);
          const [readingFeedback, setReadingFeedback] = useState([]);
          const [diagnosticOpen, setDiagnosticOpen] = useState(false);
          const [showSelfCheckPanel, setShowSelfCheckPanel] = useState(false);
          const [sfxEpoch, setSfxEpoch] = useState(0);
          const rutaRecRef = useRef(null);
          const readingRecRef = useRef(null);
          const readingFinalRef = useRef('');
          const readingLiveTranscriptRef = useRef('');
          const readingStopRequestedRef = useRef(false);
          const readingAutoRestartRef = useRef(false);
          const readingRestartTimerRef = useRef(null);
          const readingSessionIdRef = useRef(0);
          const readingTextSurfaceRef = useRef(null);
          const [guionData, setGuionData] = useState(DEFAULT_GUION);
          const [activeScriptTitle, setActiveScriptTitle] = useState("Lektion 17: Kunst");
          const [isDefaultScript, setIsDefaultScript] = useState(true);
          const [sceneIndex, setSceneIndex] = useState(0);
          const [mode, setMode] = useState('dialogue'); 
          const [isPlaying, setIsPlaying] = useState(false);
          const [voicesLoaded, setVoicesLoaded] = useState(false);
          const [playbackRate, setPlaybackRate] = useState(1.0); 
          const [blindMode, setBlindMode] = useState(false); 
          const [lueckentextMode, setLueckentextMode] = useState(false);
          const [declinaMode, setDeclinaMode] = useState(false); 
          const [tempusMode, setTempusMode] = useState(false); 
          const [artikelSniperMode, setArtikelSniperMode] = useState(false); 
          const [fluesternMode, setFluesternMode] = useState(false);
          const [noiseEnabled, setNoiseEnabled] = useState(false); // NUEVO: Ruido de fondo
          const [roleplayChar, setRoleplayChar] = useState('none');
          const [podcastMode, setPodcastMode] = useState(false);
          const [showHistoriaMenu, setShowHistoriaMenu] = useState(false);
          /** Tras el «ßltimo guion, carga el siguiente de Biblioteca (solo tiene efecto al terminar una escena en flujo normal / podcast). */
          const [historiaPlaylistAllScripts, setHistoriaPlaylistAllScripts] = useState(false);
          const [showCurrentTranslation, setShowCurrentTranslation] = useState(false); 
          const [tempusVerbList, setTempusVerbList] = useState([]);
          const [tempusSelectedVerb, setTempusSelectedVerb] = useState(null);
          const [diktatMode, setDiktatMode] = useState(false);
          const [diktatInput, setDiktatInput] = useState("");
          const [showDiktatResult, setShowDiktatResult] = useState(false);
          const [savedScripts, setSavedScripts] = useState([]);
          /** Si practicas un guion guardado en Biblioteca, su id; si no, null (ejemplo, IA o no guardado). Sirve para vincular ∂ÆDistribuir É≈' B1/B2∂Ø. */
          const [activeSavedScriptId, setActiveSavedScriptId] = useState(null);
          const [customVocabLessons, setCustomVocabLessons] = useState([]);
          const [lexikonSearch, setLexikonSearch] = useState('');
          /** tr-es-de | tr-de-es | wiki-de | wiki-es */
          const [lexikonDictKind, setLexikonDictKind] = useState('tr-es-de');
          const [lexikonTransTarget, setLexikonTransTarget] = useState('de');
          const [lexikonResults, setLexikonResults] = useState(null);
          const [lexikonDictLoading, setLexikonDictLoading] = useState(false);
          const [lexikonTransText, setLexikonTransText] = useState('');
          const [lexikonTransOut, setLexikonTransOut] = useState('');
          const [lexikonTransLoading, setLexikonTransLoading] = useState(false);
          const [lexikonSaveLessonId, setLexikonSaveLessonId] = useState('');
          const [lexikonNewLessonTitle, setLexikonNewLessonTitle] = useState('');
          const [lexikonPairDe, setLexikonPairDe] = useState('');
          const [lexikonPairEs, setLexikonPairEs] = useState('');
          const [vocabTitleInput, setVocabTitleInput] = useState("");
          const [vocabTextInput, setVocabTextInput] = useState("");
          const [userStats, setUserStats] = useState({
              username: "Estudiante", isPremium: true,
              xp: 0, streakDays: 1, lastPlayedDate: new Date().toISOString().split('T')[0],
              coins: 150, hearts: 5, 
              diktatAttempts: 0, diktatCorrect: 0,
              pronunciationTotalScore: 0, pronunciationAttempts: 0,
              difficultVocab: [], normalVocab: [], 
              difficultGrammar: [], 
              failedDiktatScenes: [],
              activityLog: [40, 60, 45, 80, 55, 90, 75],
              activityByDay: {}
          });
          const [vocabReviewIndex, setVocabReviewIndex] = useState(0);
          const [showVocabTranslation, setShowVocabTranslation] = useState(false);
          const [currentVocabList, setCurrentVocabList] = useState([]); 
          const [bxCategory, setBxCategory] = useState('mix'); 
          const [bxBankLevel, setBxBankLevel] = useState('b1');
          const [bxIndex, setBxIndex] = useState(0);
          const [bxCurrentList, setBxCurrentList] = useState([]);
          const [bxRemoteDatabases, setBxRemoteDatabases] = useState(() => tryBxSession());
          const [bxUserOverlay, setBxUserOverlay] = useState(() => tryBxUserOverlay());
          const [bxImportText, setBxImportText] = useState('');
          const [bxImportSummary, setBxImportSummary] = useState('');
          const [bxMoveTargetCat, setBxMoveTargetCat] = useState('verbos');
          const [pdfDidacticPack, setPdfDidacticPack] = useState(null);
          const [pdfDidacticPackLibrary, setPdfDidacticPackLibrary] = useState(() => {
              try {
                  const raw = localStorage.getItem(MULLER_PDF_DIDACTIC_LIBRARY_KEY);
                  return raw ? JSON.parse(raw) : [];
              } catch (e) {
                  return [];
              }
          });
          const [chromeAiText, setChromeAiText] = useState('');
          const [chromeAiOut, setChromeAiOut] = useState('');
          const [chromeAiBusy, setChromeAiBusy] = useState(false);
          const [chromeAiLine, setChromeAiLine] = useState('');
          const bxEffectiveDatabases = useMemo(() => mergeBxDatabases(bxRemoteDatabases || BX_DB_FALLBACK, bxUserOverlay), [bxRemoteDatabases, bxUserOverlay]);
          const [practiceActive, setPracticeActive] = useState(null);
          const [practiceIndex, setPracticeIndex] = useState(0);
          const [practiceShowTrans, setPracticeShowTrans] = useState(false);
          const [aiLevel, setAiLevel] = useState('B1');
          const [aiTheme, setAiTheme] = useState('Alltag');
          const [aiCustomWords, setAiCustomWords] = useState("");
          const [isGeneratingStory, setIsGeneratingStory] = useState(false);
          const [isReviewing, setIsReviewing] = useState(false);
          const [reviewIndexPointer, setReviewIndexPointer] = useState(0);
          const [puzzleMode, setPuzzleMode] = useState(false);
          const [puzzleWords, setPuzzleWords] = useState([]);
          const [puzzleAnswer, setPuzzleAnswer] = useState([]);
          const [showPuzzleResult, setShowPuzzleResult] = useState(false);
          const [puzzleLastOk, setPuzzleLastOk] = useState(null);
          const [isListening, setIsListening] = useState(false);
          const [spokenText, setSpokenText] = useState("");
          const [pronunciationScore, setPronunciationScore] = useState(null);
          const [grammarPolizeiMsg, setGrammarPolizeiMsg] = useState("");
          const [pronunciationFeedback, setPronunciationFeedback] = useState([]);
          const [newScriptTitle, setNewScriptTitle] = useState("");
          const [scriptInput, setScriptInput] = useState(`Lukas: Hallo Elena! (∂≠Hola Elena!) [der Tag - el d«a]\nElena: Ja, ich bin froh! (∂≠S«, estoy contenta!) [froh - contento]`);
          const [showLoginModal, setShowLoginModal] = useState(false);
          const [tempUsername, setTempUsername] = useState("");
          const [showTutor, setShowTutor] = useState(false);
          const [tutorMessage, setTutorMessage] = useState("");
          const [showDeathModal, setShowDeathModal] = useState(false);
          const [showGrammarPrompt, setShowGrammarPrompt] = useState(false);
          const [customGrammarInput, setCustomGrammarInput] = useState("");
          const [showHandwriting, setShowHandwriting] = useState(false); // NUEVO: Canvas escritura
          const [showVocabMixModal, setShowVocabMixModal] = useState(false);
          const [mixLessonSelection, setMixLessonSelection] = useState({});
          const [mullerProgresoSnapshot, setMullerProgresoSnapshot] = useState(null);
          const [audiobookPlaying, setAudiobookPlaying] = useState(false);
          const [shadowRate, setShadowRate] = useState(0.88);
          const [shadowShowText, setShadowShowText] = useState(true);
          const [writingMode, setWritingMode] = useState('free');
          const [writingGrid, setWritingGrid] = useState(true);
          const [writingStroke, setWritingStroke] = useState(4);
          const [writingCopyIdx, setWritingCopyIdx] = useState(0);
          const [writingPromptIdx, setWritingPromptIdx] = useState(0);
          const [writingTelcIdx, setWritingTelcIdx] = useState(0);
          const [writingTelcInputMode, setWritingTelcInputMode] = useState('pen');
          const [writingTelcTypedText, setWritingTelcTypedText] = useState('');
          const [writingTelcLastOcrText, setWritingTelcLastOcrText] = useState('');
          const [writingTelcCoach, setWritingTelcCoach] = useState(null);
          const [writingDictIdx, setWritingDictIdx] = useState(0);
          const [writingLetterIdx, setWritingLetterIdx] = useState(0);
          const [writingGuionWriteIdx, setWritingGuionWriteIdx] = useState(0);
          const [writingDictReveal, setWritingDictReveal] = useState(false);
          const [writingDictSource, setWritingDictSource] = useState('builtin');
          const [writingDictScriptId, setWritingDictScriptId] = useState('__current__');
          const [writingCanvasKey, setWritingCanvasKey] = useState(0);
          const [writingCanvasSnapshot, setWritingCanvasSnapshot] = useState({ padKey: 0, data: '' });
          const [writingVocabIdx, setWritingVocabIdx] = useState(0);
          const [ocrHistoryList, setOcrHistoryList] = useState(() => {
              try { return JSON.parse(localStorage.getItem(MULLER_OCR_HIST_KEY) || '[]'); } catch (e) { return []; }
          });
          const [pdfStudyDoc, setPdfStudyDoc] = useState(() => {
              try {
                  const raw = localStorage.getItem(MULLER_PDF_STUDY_STORAGE_KEY);
                  return raw ? JSON.parse(raw) : null;
              } catch (e) {
                  return null;
              }
          });
          const [pdfStudyPageIdx, setPdfStudyPageIdx] = useState(0);
          const [pdfStudyExtracting, setPdfStudyExtracting] = useState(false);
          const [pdfStudyErr, setPdfStudyErr] = useState('');
          const [pdfStudyBusyMsg, setPdfStudyBusyMsg] = useState('');
          const [pdfStudyOcrBusy, setPdfStudyOcrBusy] = useState(false);
          const [pdfStudyLastApplied, setPdfStudyLastApplied] = useState('');
          const [pdfStudyFullscreen, setPdfStudyFullscreen] = useState(false);
          const [pdfStudyFsView, setPdfStudyFsView] = useState('split');
          const [pdfFsScrollPdf, setPdfFsScrollPdf] = useState(false);
          const [pdfOverlayBgUrl, setPdfOverlayBgUrl] = useState('');
          const [pdfOverlayBgBusy, setPdfOverlayBgBusy] = useState(false);
          const [pdfOverlayDims, setPdfOverlayDims] = useState({ w: 0, h: 0 });
          const [pdfSessionBufferOk, setPdfSessionBufferOk] = useState(false);
          const [pdfOverlayZoom, setPdfOverlayZoom] = useState(1);
          const [pdfOverlayTypedOpen, setPdfOverlayTypedOpen] = useState(false);
          const pdfOverlayHostRef = useRef(null);
          const pdfAnnotateAreaRef = useRef(null);
          const pdfOverlayScrollRef = useRef(null);
          const pdfImmersiveFsRef = useRef(null);
          const [pdfStudyInkNonce, setPdfStudyInkNonce] = useState(0);
          const [pdfStudyOcrBatching, setPdfStudyOcrBatching] = useState(false);
          const [pdfStudyNotesByPage, setPdfStudyNotesByPage] = useState(() => {
              try {
                  const raw = localStorage.getItem(MULLER_PDF_NOTES_STORAGE_KEY);
                  const parsed = raw ? JSON.parse(raw) : {};
                  if (!parsed || typeof parsed !== 'object') return {};
                  const values = Object.values(parsed);
                  const looksLegacyFlat = values.length > 0 && values.every((v) => v && typeof v === 'object' && ('drawing' in v || 'typed' in v || 'updatedAt' in v));
                  if (looksLegacyFlat) {
                      return { [MULLER_PDF_NOTES_LEGACY_DOC_ID]: parsed };
                  }
                  return parsed;
              } catch (e) {
                  return {};
              }
          });
          const [pdfStudySavedDocs, setPdfStudySavedDocs] = useState(() => {
              try {
                  const raw = localStorage.getItem(MULLER_PDF_STUDY_LIBRARY_KEY);
                  return raw ? JSON.parse(raw) : [];
              } catch (e) {
                  return [];
              }
          });
          const [pdfStudyBlobUrl, setPdfStudyBlobUrl] = useState('');
          const [ttsPrefsEpoch, setTtsPrefsEpoch] = useState(0);
          const [ttsDeUri, setTtsDeUri] = useState(() => { try { return localStorage.getItem('muller_tts_de') || ''; } catch (e) { return ''; } });
          const [ttsEsUri, setTtsEsUri] = useState(() => { try { return localStorage.getItem('muller_tts_es') || ''; } catch (e) { return ''; } });
          const [showMullerHub, setShowMullerHub] = useState(false);
          const [mullerHubTab, setMullerHubTab] = useState('voices');

          useEffect(() => {
              const validTabs = new Set(['inicio', 'ruta', 'historia', 'lectura', 'shadowing', 'escritura', 'vocabulario', 'entrenamiento', 'bxbank', 'progreso', 'guiones', 'lexikon', 'telc', 'storybuilder', 'historiaspro', 'comunidad']);
              if (!validTabs.has(activeTab)) setActiveTab('inicio');
          }, [activeTab]);

          useEffect(() => {
              return () => {
                  if (!pdfStudyBlobUrl) return;
                  try { URL.revokeObjectURL(pdfStudyBlobUrl); } catch (e) {}
              };
          }, [pdfStudyBlobUrl]);

          useEffect(() => {
              const openSettings = (ev) => {
                  const tab = ev && ev.detail && ev.detail.tab ? String(ev.detail.tab) : 'ajustes';
                  setProfileSettingsTab(tab === 'perfil' || tab === 'atajos' ? tab : 'ajustes');
                  setShowProfileSettingsModal(true);
              };
              window.addEventListener('muller-open-profile-settings', openSettings);
              return () => window.removeEventListener('muller-open-profile-settings', openSettings);
          }, []);

          useEffect(() => {
              let cancelled = false;
              const GIST_VERB_DB = 'https://gist.githubusercontent.com/djplaza1/239d6ac0a999c5729b3cf133627771f7/raw/gistfile1.txt';
              const parseVerbDbPayload = (raw) => {
                  const txt = String(raw || '').trim();
                  if (!txt) return null;
                  const tryParse = (s) => { try { return JSON.parse(s); } catch (e) { return null; } };
                  let data = tryParse(txt);
                  if (!data && txt.startsWith('{') && txt.endsWith(']')) data = tryParse(txt + '\n}');
                  if (!data && txt.startsWith('"id"')) data = tryParse('[{' + txt + '}]');
                  if (!data) return null;
                  const verbs = Array.isArray(data) ? data : (Array.isArray(data.verbs) ? data.verbs : []);
                  if (!verbs.length) return null;
                  return { meta: data.meta || null, verbs };
              };
              const loadVerbDb = async () => {
                  const urls = [
                      `${GIST_VERB_DB}?nocache=${Date.now()}`,
                      './verbos-db.json'
                  ];
                  for (const u of urls) {
                      try {
                          const r = await fetch(u, { cache: 'no-cache' });
                          if (!r.ok) continue;
                          const raw = await r.text();
                          const parsed = parseVerbDbPayload(raw);
                          if (!parsed || !parsed.verbs.length) continue;
                          if (cancelled) return;
                          setRutaVerbDb(parsed);
                          return;
                      } catch (e) {}
                  }
              };
              loadVerbDb();
              return () => { cancelled = true; };
          }, []);
          useEffect(() => {
              let cancelled = false;
              const URL_ART = 'https://gist.githubusercontent.com/djplaza1/a53fde18c901a7f2d86977174b5b9a72/raw/articulos.json';
              fetch(`${URL_ART}?nocache=${Date.now()}`, { cache: 'no-cache' })
                  .then((r) => r.ok ? r.json() : null)
                  .then((data) => {
                      if (cancelled || !Array.isArray(data)) return;
                      setRutaArticleDb(data);
                  })
                  .catch(() => {});
              return () => { cancelled = true; };
          }, []);
          const rutaLevels = useMemo(() => {
              const base = Array.isArray(window.MULLER_RUTA_LEVELS) ? window.MULLER_RUTA_LEVELS : [];
              const curriculumByLevel = {
                  A0: [
                      { title: 'Alfabeto y sonidos base', topic: 'presentacion', grammarTip: 'Prioriza pronunciaci«¸n de vocales largas/cortas y combinaciones ch, sch, ei, ie.', phrases: [{ de: 'Ich hei«Ye Leo.', es: 'Me llamo Leo.' }, { de: 'Das ist Anna.', es: 'Esta es Anna.' }, { de: 'Wir lernen Deutsch.', es: 'Aprendemos alem«≠n.' }], fill: { prompt: 'Completa: Ich ___ Leo.', answer: 'hei«Ye', hint: 'Verbo ∂Æhei«Yen∂Ø, 1∂¶ persona.' }, speak: { target: 'Ich hei«Ye Leo.' } },
                      { title: 'N«ßmeros y datos personales', topic: 'tramites', grammarTip: 'Practica deletrear nombre, edad, tel«∏fono y pa«s.', phrases: [{ de: 'Ich bin 24 Jahre alt.', es: 'Tengo 24 a«Òos.' }, { de: 'Meine Nummer ist null eins sieben.', es: 'Mi n«ßmero es 017.' }, { de: 'Ich komme aus Spanien.', es: 'Vengo de Espa«Òa.' }], fill: { prompt: 'Completa: Ich bin 24 Jahre ___.', answer: 'alt', hint: 'Expresi«¸n fija para la edad.' }, speak: { target: 'Ich bin 24 Jahre alt.' } },
                      { title: 'Aula y objetos cotidianos', topic: 'clase', grammarTip: 'Memoriza sustantivo con art«culo: der Stift, die Tasche, das Heft.', phrases: [{ de: 'Das ist ein Stift.', es: 'Eso es un bol«grafo.' }, { de: 'Die Tasche ist neu.', es: 'La mochila es nueva.' }, { de: 'Wo ist das Heft?', es: '∂®D«¸nde est«≠ el cuaderno?' }], fill: { prompt: 'Completa: Das ist ___ Stift.', answer: 'ein', hint: 'Indefinido masculino.' }, speak: { target: 'Das ist ein Stift.' } },
                      { title: 'Familia inmediata', topic: 'familia', grammarTip: 'Usa posesivos b«≠sicos: mein/meine y dein/deine.', phrases: [{ de: 'Das ist meine Mutter.', es: 'Esta es mi madre.' }, { de: 'Mein Bruder ist hier.', es: 'Mi hermano est«≠ aqu«.' }, { de: 'Hast du Geschwister?', es: '∂®Tienes hermanos?' }], fill: { prompt: 'Completa: Das ist ___ Mutter.', answer: 'meine', hint: 'Sustantivo femenino.' }, speak: { target: 'Das ist meine Mutter.' } },
                      { title: 'Comidas y compras simples', topic: 'alimentos', grammarTip: 'Pide con ∂ÆIch m«Ùchte ...∂Ø + Akkusativ.', phrases: [{ de: 'Ich m«Ùchte Wasser.', es: 'Quiero agua.' }, { de: 'Wir kaufen Brot.', es: 'Compramos pan.' }, { de: 'Der Kaffee ist hei«Y.', es: 'El caf«∏ est«≠ caliente.' }], fill: { prompt: 'Completa: Ich ___ Wasser.', answer: 'm«Ùchte', hint: 'Forma de cortes«a com«ßn.' }, speak: { target: 'Ich m«Ùchte Wasser.' } },
                      { title: 'Rutina m«nima diaria', topic: 'rutina', grammarTip: 'Separable verbs: ∂Æaufstehen∂Ø separa en presente.', phrases: [{ de: 'Ich stehe um sieben auf.', es: 'Me levanto a las siete.' }, { de: 'Ich arbeite am Montag.', es: 'Trabajo el lunes.' }, { de: 'Abends lerne ich.', es: 'Por la noche estudio.' }], fill: { prompt: 'Completa: Ich ___ um sieben auf.', answer: 'stehe', hint: 'Verbo separable ∂Æaufstehen∂Ø.' }, speak: { target: 'Ich stehe um sieben auf.' } }
                  ],
                  A1: [
                      { title: 'Presentarse con detalle', topic: 'presentacion', grammarTip: 'Ampl«a presentaci«¸n con profesi«¸n, ciudad y lenguas.', phrases: [{ de: 'Ich bin Ingenieurin und wohne in Madrid.', es: 'Soy ingeniera y vivo en Madrid.' }, { de: 'Ich spreche Spanisch und etwas Deutsch.', es: 'Hablo espa«Òol y algo de alem«≠n.' }, { de: 'Seit einem Jahr lerne ich Deutsch.', es: 'Desde hace un a«Òo estudio alem«≠n.' }], fill: { prompt: 'Completa: Ich ___ in Madrid.', answer: 'wohne', hint: 'Verbo wohnen.' }, speak: { target: 'Ich spreche Spanisch und etwas Deutsch.' } },
                      { title: 'Casa y habitaciones', topic: 'vivienda', grammarTip: 'Preposiciones de lugar frecuentes: in, auf, unter.', phrases: [{ de: 'Die K«¨che ist klein.', es: 'La cocina es peque«Òa.' }, { de: 'Das Buch liegt auf dem Tisch.', es: 'El libro est«≠ sobre la mesa.' }, { de: 'Wir wohnen in einer Wohnung.', es: 'Vivimos en un piso.' }], fill: { prompt: 'Completa: Das Buch liegt ___ dem Tisch.', answer: 'auf', hint: 'Relaci«¸n ∂Æencima de∂Ø.' }, speak: { target: 'Das Buch liegt auf dem Tisch.' } },
                      { title: 'Trabajo y horarios', topic: 'trabajo', grammarTip: 'Preguntar y responder horarios con ∂Ævon ... bis ...∂Ø.', phrases: [{ de: 'Ich arbeite von neun bis f«¨nf.', es: 'Trabajo de nueve a cinco.' }, { de: 'Wann beginnt dein Kurs?', es: '∂®Cu«≠ndo empieza tu curso?' }, { de: 'Heute habe ich frei.', es: 'Hoy tengo libre.' }], fill: { prompt: 'Completa: Ich arbeite von neun ___ f«¨nf.', answer: 'bis', hint: 'Expresi«¸n de intervalo.' }, speak: { target: 'Ich arbeite von neun bis f«¨nf.' } },
                      { title: 'Restaurante y pedidos', topic: 'alimentos', grammarTip: 'Usa ∂Æich h«œtte gern∂Ø para sonar natural y cort«∏s.', phrases: [{ de: 'Ich h«œtte gern eine Suppe.', es: 'Quisiera una sopa.' }, { de: 'Wir zahlen zusammen.', es: 'Pagamos juntos.' }, { de: 'Die Rechnung, bitte.', es: 'La cuenta, por favor.' }], fill: { prompt: 'Completa: Ich h«œtte ___ eine Suppe.', answer: 'gern', hint: 'Part«cula fija en la f«¸rmula.' }, speak: { target: 'Die Rechnung, bitte.' } },
                      { title: 'Salud y farmacia', topic: 'salud', grammarTip: 'Estructura t«pica: ∂ÆIch habe + s«ntoma∂Ø.', phrases: [{ de: 'Ich habe Kopfschmerzen.', es: 'Tengo dolor de cabeza.' }, { de: 'Ich brauche einen Termin.', es: 'Necesito una cita.' }, { de: 'Nehmen Sie diese Tabletten.', es: 'Tome estas pastillas.' }], fill: { prompt: 'Completa: Ich ___ Kopfschmerzen.', answer: 'habe', hint: 'Verbo haben.' }, speak: { target: 'Ich habe Kopfschmerzen.' } },
                      { title: 'Tiempo libre y planes', topic: 'tiempo_libre', grammarTip: 'Con ∂Æam Wochenende∂Ø y ∂Æmit Freunden∂Ø hablas de ocio.', phrases: [{ de: 'Am Wochenende spiele ich Fu«Yball.', es: 'El fin de semana juego al f«ßtbol.' }, { de: 'Heute Abend gehe ich ins Kino.', es: 'Esta tarde voy al cine.' }, { de: 'Morgen treffe ich Freunde.', es: 'Ma«Òana quedo con amigos.' }], fill: { prompt: 'Completa: Heute Abend ___ ich ins Kino.', answer: 'gehe', hint: 'Verbo gehen, 1∂¶ persona.' }, speak: { target: 'Heute Abend gehe ich ins Kino.' } }
                  ],
                  A2: [
                      { title: 'Narrar pasado con Perfekt', topic: 'gramatica', grammarTip: 'Combina auxiliares haben/sein y participio al final.', phrases: [{ de: 'Letztes Jahr habe ich in Berlin gearbeitet.', es: 'El a«Òo pasado trabaj«∏ en Berl«n.' }, { de: 'Wir sind sp«œt angekommen.', es: 'Llegamos tarde.' }, { de: 'Sie hat viel gelernt.', es: 'Ella ha estudiado mucho.' }], fill: { prompt: 'Completa: Wir sind sp«œt ___.', answer: 'angekommen', hint: 'Participio de ankommen.' }, speak: { target: 'Wir sind sp«œt angekommen.' } },
                      { title: 'Conectores de causa y contraste', topic: 'conectores', grammarTip: 'weil + verbo final; aber/deshalb en frase principal.', phrases: [{ de: 'Ich bleibe zu Hause, weil ich krank bin.', es: 'Me quedo en casa porque estoy enfermo.' }, { de: 'Es regnet, aber wir gehen raus.', es: 'Llueve, pero salimos.' }, { de: 'Ich bin m«¨de, deshalb schlafe ich fr«¨h.', es: 'Estoy cansado, por eso duermo pronto.' }], fill: { prompt: 'Completa: Ich bleibe zu Hause, ___ ich krank bin.', answer: 'weil', hint: 'Conector causal con verbo al final.' }, speak: { target: 'Ich bin m«¨de, deshalb schlafe ich fr«¨h.' } },
                      { title: 'Viajes y transporte', topic: 'viajes', grammarTip: 'Bloques «ßtiles: Fahrkarte, umsteigen, Abfahrt, Ankunft.', phrases: [{ de: 'Wo kann ich eine Fahrkarte kaufen?', es: '∂®D«¸nde puedo comprar un billete?' }, { de: 'Der Zug hat Versp«œtung.', es: 'El tren tiene retraso.' }, { de: 'Wir m«¨ssen in K«Ùln umsteigen.', es: 'Tenemos que hacer transbordo en Colonia.' }], fill: { prompt: 'Completa: Der Zug hat ___.', answer: 'Versp«œtung', hint: 'Retraso.' }, speak: { target: 'Wir m«¨ssen in K«Ùln umsteigen.' } },
                      { title: 'Tr«≠mites y oficina', topic: 'tramites', grammarTip: 'Practica frases formales cortas en ventanilla.', phrases: [{ de: 'Ich m«Ùchte dieses Formular abgeben.', es: 'Quiero entregar este formulario.' }, { de: 'Welche Unterlagen brauche ich?', es: '∂®Qu«∏ documentos necesito?' }, { de: 'K«Ùnnen Sie mir helfen?', es: '∂®Puede ayudarme?' }], fill: { prompt: 'Completa: Welche ___ brauche ich?', answer: 'Unterlagen', hint: 'Documentos.' }, speak: { target: 'Ich m«Ùchte dieses Formular abgeben.' } },
                      { title: 'Relaciones personales', topic: 'familia', grammarTip: 'Opini«¸n b«≠sica: ∂ÆIch finde..., weil...∂Ø', phrases: [{ de: 'Ich finde meinen Job interessant.', es: 'Encuentro mi trabajo interesante.' }, { de: 'Mit meiner Schwester spreche ich oft.', es: 'Hablo mucho con mi hermana.' }, { de: 'Wir verstehen uns gut.', es: 'Nos llevamos bien.' }], fill: { prompt: 'Completa: Wir ___ uns gut.', answer: 'verstehen', hint: 'Verbo separable no, forma plural.' }, speak: { target: 'Wir verstehen uns gut.' } },
                      { title: 'A2 oral pr«≠ctico', topic: 'trabajo', grammarTip: 'Entrena respuestas completas de 2-3 frases.', phrases: [{ de: 'In meiner Firma arbeite ich im Team.', es: 'En mi empresa trabajo en equipo.' }, { de: 'Meine Aufgaben sind klar.', es: 'Mis tareas est«≠n claras.' }, { de: 'Ich m«Ùchte mich verbessern.', es: 'Quiero mejorar.' }], fill: { prompt: 'Completa: Ich arbeite ___ Team.', answer: 'im', hint: 'in + dem = im.' }, speak: { target: 'In meiner Firma arbeite ich im Team.' } }
                  ],
                  B1: [
                      { title: 'Opini«¸n y argumentaci«¸n', topic: 'conectores', grammarTip: 'Conecta ideas con au«Yerdem, jedoch, deshalb.', phrases: [{ de: 'Meiner Meinung nach ist Homeoffice sinnvoll.', es: 'En mi opini«¸n, el teletrabajo tiene sentido.' }, { de: 'Einerseits spart man Zeit, andererseits fehlt Kontakt.', es: 'Por un lado ahorras tiempo, por otro falta contacto.' }, { de: 'Deshalb brauche ich einen Mix.', es: 'Por eso necesito un equilibrio.' }], fill: { prompt: 'Completa: Einerseits ..., ___ ...', answer: 'andererseits', hint: 'Conector correlativo.' }, speak: { target: 'Meiner Meinung nach ist Homeoffice sinnvoll.' } },
                      { title: 'B1 trabajo y CV', topic: 'trabajo', grammarTip: 'Pasado relevante y logros concretos en frases breves.', phrases: [{ de: 'Ich habe drei Jahre im Kundenservice gearbeitet.', es: 'Trabaj«∏ tres a«Òos en atenci«¸n al cliente.' }, { de: 'Ich bin zuverl«œssig und flexibel.', es: 'Soy fiable y flexible.' }, { de: 'Ich m«Ùchte mich beruflich weiterentwickeln.', es: 'Quiero desarrollarme profesionalmente.' }], fill: { prompt: 'Completa: Ich habe drei Jahre im Kundenservice ___.', answer: 'gearbeitet', hint: 'Participio regular.' }, speak: { target: 'Ich m«Ùchte mich beruflich weiterentwickeln.' } },
                      { title: 'Relativs«œtze «ßtiles', topic: 'gramatica', grammarTip: 'der/die/das + verbo al final para a«Òadir informaci«¸n.', phrases: [{ de: 'Das ist der Kollege, der mir hilft.', es: 'Ese es el compa«Òero que me ayuda.' }, { de: 'Die Stadt, in der ich wohne, ist ruhig.', es: 'La ciudad donde vivo es tranquila.' }, { de: 'Ich suche ein Buch, das leicht ist.', es: 'Busco un libro que sea f«≠cil.' }], fill: { prompt: 'Completa: Das ist der Kollege, ___ mir hilft.', answer: 'der', hint: 'Relativo masculino nominativo.' }, speak: { target: 'Die Stadt, in der ich wohne, ist ruhig.' } },
                      { title: 'B1 viajes e incidencias', topic: 'viajes', grammarTip: 'Describe problemas, pide soluci«¸n y confirma pasos.', phrases: [{ de: 'Mein Flug wurde annulliert.', es: 'Mi vuelo fue cancelado.' }, { de: 'K«Ùnnen Sie mir eine Alternative anbieten?', es: '∂®Puede ofrecerme una alternativa?' }, { de: 'Ich brauche eine Best«œtigung per E-Mail.', es: 'Necesito una confirmaci«¸n por correo.' }], fill: { prompt: 'Completa: Mein Flug wurde ___.', answer: 'annulliert', hint: 'Participio de annullieren.' }, speak: { target: 'K«Ùnnen Sie mir eine Alternative anbieten?' } },
                      { title: 'Konjunktiv II cotidiano', topic: 'gramatica', grammarTip: 'Usa w«¨rde + infinitivo para hip«¸tesis y deseos.', phrases: [{ de: 'Ich w«¨rde gern in Deutschland arbeiten.', es: 'Me gustar«a trabajar en Alemania.' }, { de: 'Wenn ich Zeit h«œtte, w«¨rde ich mehr lesen.', es: 'Si tuviera tiempo, leer«a m«≠s.' }, { de: 'K«Ùnnten Sie das bitte wiederholen?', es: '∂®Podr«a repetirlo, por favor?' }], fill: { prompt: 'Completa: Wenn ich Zeit h«œtte, ___ ich mehr lesen.', answer: 'w«¨rde', hint: 'Estructura condicional.' }, speak: { target: 'Wenn ich Zeit h«œtte, w«¨rde ich mehr lesen.' } }
                  ],
                  B2: [
                      { title: 'Debate estructurado B2', topic: 'conectores', grammarTip: 'Estructura: tesis, argumentos, contraargumento, cierre.', phrases: [{ de: 'Ich vertrete die Auffassung, dass ...', es: 'Defiendo la postura de que...' }, { de: 'Zudem sprechen mehrere Gr«¨nde daf«¨r.', es: 'Adem«≠s hay varias razones a favor.' }, { de: 'Dennoch m«¨ssen Risiken ber«¨cksichtigt werden.', es: 'No obstante, deben considerarse riesgos.' }], fill: { prompt: 'Completa: ___ m«¨ssen Risiken ber«¨cksichtigt werden.', answer: 'Dennoch', hint: 'Conector concesivo.' }, speak: { target: 'Ich vertrete die Auffassung, dass digitale Bildung wichtig ist.' } },
                      { title: 'Correo formal y registro', topic: 'tramites', grammarTip: 'Registro formal: Sehr geehrte..., ich m«Ùchte..., mit freundlichen Gr«¨«Yen.', phrases: [{ de: 'Ich m«Ùchte mich «¨ber den Kurs informieren.', es: 'Quiero informarme sobre el curso.' }, { de: 'F«¨r eine R«¨ckmeldung w«œre ich dankbar.', es: 'Agradecer«a una respuesta.' }, { de: 'Mit freundlichen Gr«¨«Yen', es: 'Atentamente' }], fill: { prompt: 'Completa: F«¨r eine R«¨ckmeldung w«œre ich ___.', answer: 'dankbar', hint: 'Adjetivo t«pico en carta formal.' }, speak: { target: 'Ich m«Ùchte mich «¨ber den Kurs informieren.' } },
                      { title: 'Nominalizaci«¸n B2', topic: 'gramatica', grammarTip: 'Convierte verbos en sustantivos para estilo acad«∏mico.', phrases: [{ de: 'Die Entscheidung wurde gestern getroffen.', es: 'La decisi«¸n se tom«¸ ayer.' }, { de: 'Die Verbesserung der Prozesse ist notwendig.', es: 'La mejora de procesos es necesaria.' }, { de: 'Nach der Analyse folgte die Umsetzung.', es: 'Tras el an«≠lisis sigui«¸ la implementaci«¸n.' }], fill: { prompt: 'Completa: Die ___ der Prozesse ist notwendig.', answer: 'Verbesserung', hint: 'Sustantivo de verbessern.' }, speak: { target: 'Die Entscheidung wurde gestern getroffen.' } },
                      { title: 'Comprensi«¸n de noticias', topic: 'trabajo', grammarTip: 'Extrae idea principal, datos y postura del autor.', phrases: [{ de: 'Laut dem Bericht steigt die Inflation.', es: 'Seg«ßn el informe, sube la inflaci«¸n.' }, { de: 'Die Experten fordern schnelle Ma«Ynahmen.', es: 'Los expertos piden medidas r«≠pidas.' }, { de: 'Die Folgen betreffen vor allem Haushalte.', es: 'Las consecuencias afectan sobre todo a los hogares.' }], fill: { prompt: 'Completa: Laut dem Bericht ___ die Inflation.', answer: 'steigt', hint: 'Verbo de la oraci«¸n principal.' }, speak: { target: 'Die Experten fordern schnelle Ma«Ynahmen.' } }
                  ],
                  C1: [
                      { title: 'Matiz y precisi«¸n l«∏xica', topic: 'gramatica', grammarTip: 'Selecciona verbo por intenci«¸n: behaupten, erl«œutern, einr«œumen.', phrases: [{ de: 'Die Autorin r«œumt ein, dass die Daten begrenzt sind.', es: 'La autora reconoce que los datos son limitados.' }, { de: 'Der Bericht legt nahe, dass Reformen n«Ùtig sind.', es: 'El informe sugiere que las reformas son necesarias.' }, { de: 'Er erl«œutert die Ursachen differenziert.', es: 'Explica las causas de forma matizada.' }], fill: { prompt: 'Completa: Der Bericht ___ nahe, dass Reformen n«Ùtig sind.', answer: 'legt', hint: 'Expresi«¸n fija ∂Ænahelegen∂Ø.' }, speak: { target: 'Die Autorin r«œumt ein, dass die Daten begrenzt sind.' } },
                      { title: 'Argumentaci«¸n avanzada C1', topic: 'conectores', grammarTip: 'Conectores de alta precisi«¸n: demzufolge, insofern, wohingegen.', phrases: [{ de: 'Die Ma«Ynahme ist teuer, demzufolge braucht sie klare Ziele.', es: 'La medida es costosa; por consiguiente, necesita metas claras.' }, { de: 'Insofern ist die Kritik nachvollziehbar.', es: 'En ese sentido, la cr«tica es comprensible.' }, { de: 'Wohingegen kurzfristige L«Ùsungen selten nachhaltig sind.', es: 'Mientras que las soluciones a corto plazo rara vez son sostenibles.' }], fill: { prompt: 'Completa: Die Ma«Ynahme ist teuer, ___ braucht sie klare Ziele.', answer: 'demzufolge', hint: 'Conector de consecuencia formal.' }, speak: { target: 'Insofern ist die Kritik nachvollziehbar.' } },
                      { title: 'Presentaci«¸n profesional', topic: 'trabajo', grammarTip: 'Abrir, estructurar y cerrar exposici«¸n con naturalidad.', phrases: [{ de: 'Im Folgenden pr«œsentiere ich drei zentrale Punkte.', es: 'A continuaci«¸n presento tres puntos centrales.' }, { de: 'Abschlie«Yend l«œsst sich festhalten, dass ...', es: 'Para concluir, puede sostenerse que...' }, { de: 'Gern beantworte ich anschlie«Yend Ihre Fragen.', es: 'Con gusto respondo despu«∏s sus preguntas.' }], fill: { prompt: 'Completa: ___ pr«œsentiere ich drei zentrale Punkte.', answer: 'Im Folgenden', hint: 'Inicio formal de exposici«¸n.' }, speak: { target: 'Abschlie«Yend l«œsst sich festhalten, dass nachhaltige Strategien n«Ùtig sind.' } }
                  ]
              };
              const premiumTopicPlan = {
                  A0: ['presentacion', 'pronunciacion', 'numeros', 'clase', 'familia', 'alimentos', 'rutina', 'vivienda', 'viajes', 'salud', 'trabajo', 'tramites'],
                  A1: ['presentacion', 'familia', 'vivienda', 'alimentos', 'compras', 'trabajo', 'rutina', 'tiempo_libre', 'viajes', 'salud', 'tramites', 'conectores'],
                  A2: ['pasado', 'conectores', 'trabajo', 'familia', 'vivienda', 'viajes', 'salud', 'tramites', 'compras', 'tiempo_libre', 'telefonia', 'gramatica'],
                  B1: ['argumentacion', 'trabajo', 'cv', 'entrevista', 'viajes', 'incidencias', 'relativsatz', 'konjunktiv2', 'conectores', 'salud', 'tramites', 'presentacion'],
                  B2: ['debate', 'correo_formal', 'nominalizacion', 'noticias', 'trabajo', 'universidad', 'presentacion', 'conectores', 'pasiva', 'grafico', 'negociacion', 'medios'],
                  C1: ['precision', 'argumentacion', 'registro', 'academico', 'presentacion', 'negociacion', 'conectores', 'resumen', 'analisis', 'matiz', 'retorica', 'debate']
              };
              const topicLabel = {
                  presentacion: 'Presentaci«¸n', pronunciacion: 'Pronunciaci«¸n', numeros: 'N«ßmeros', clase: 'Clase', familia: 'Familia', alimentos: 'Alimentos',
                  rutina: 'Rutina', vivienda: 'Vivienda', viajes: 'Viajes', salud: 'Salud', trabajo: 'Trabajo', tramites: 'Tr«≠mites', compras: 'Compras',
                  tiempo_libre: 'Tiempo libre', conectores: 'Conectores', pasado: 'Pasado', telefonia: 'Tel«∏fono', gramatica: 'Gram«≠tica',
                  argumentacion: 'Argumentaci«¸n', cv: 'CV', entrevista: 'Entrevista', incidencias: 'Incidencias', relativsatz: 'Relativos', konjunktiv2: 'Konjunktiv II',
                  debate: 'Debate', correo_formal: 'Correo formal', nominalizacion: 'Nominalizaci«¸n', noticias: 'Noticias', universidad: 'Universidad', pasiva: 'Pasiva',
                  grafico: 'Describir gr«≠ficos', negociacion: 'Negociaci«¸n', medios: 'Medios', precision: 'Precisi«¸n l«∏xica', registro: 'Registro', academico: 'Acad«∏mico',
                  resumen: 'Resumen', analisis: 'An«≠lisis', matiz: 'Matiz', retorica: 'Ret«¸rica'
              };
              const mkPremiumUnit = (levelKey, topic, idx) => {
                  const label = topicLabel[topic] || topic;
                  const topicForUi = ({ pronunciacion: 'presentacion', numeros: 'tramites', pasado: 'gramatica', telefonia: 'tramites', argumentacion: 'conectores', cv: 'trabajo', entrevista: 'trabajo', incidencias: 'viajes', relativsatz: 'gramatica', konjunktiv2: 'gramatica', debate: 'conectores', correo_formal: 'tramites', nominalizacion: 'gramatica', noticias: 'trabajo', universidad: 'trabajo', pasiva: 'gramatica', grafico: 'trabajo', negociacion: 'trabajo', medios: 'trabajo', precision: 'gramatica', registro: 'gramatica', academico: 'gramatica', resumen: 'gramatica', analisis: 'gramatica', matiz: 'gramatica', retorica: 'conectores' }[topic]) || topic;
                  const sentenceBank = {
                      A0: [{ de: 'Ich bin neu hier.', es: 'Soy nuevo aqui.' }, { de: 'Das ist meine Familie.', es: 'Esta es mi familia.' }, { de: 'Ich lerne jeden Tag.', es: 'Aprendo cada dia.' }],
                      A1: [{ de: 'Ich m«Ùchte im Restaurant bestellen.', es: 'Quiero pedir en el restaurante.' }, { de: 'Am Wochenende treffe ich Freunde.', es: 'El fin de semana quedo con amigos.' }, { de: 'Wir fahren morgen mit dem Zug.', es: 'Viajamos manana en tren.' }],
                      A2: [{ de: 'Letzte Woche habe ich viel gearbeitet.', es: 'La semana pasada trabaje mucho.' }, { de: 'Ich lerne Deutsch, weil ich umziehen m«Ùchte.', es: 'Aprendo aleman porque quiero mudarme.' }, { de: 'K«Ùnnen Sie mir bitte weiterhelfen?', es: 'Puede ayudarme, por favor?' }],
                      B1: [{ de: 'Meiner Meinung nach ist das sinnvoll.', es: 'En mi opinion eso tiene sentido.' }, { de: 'Wenn ich mehr Zeit h«œtte, w«¨rde ich reisen.', es: 'Si tuviera mas tiempo, viajaria.' }, { de: 'Das ist ein Punkt, den wir beachten m«¨ssen.', es: 'Es un punto que debemos considerar.' }],
                      B2: [{ de: 'Die Ma«Ynahme sollte schrittweise umgesetzt werden.', es: 'La medida deberia aplicarse gradualmente.' }, { de: 'Dar«¨ber hinaus sind die Kosten zu ber«¨cksichtigen.', es: 'Ademas hay que considerar los costes.' }, { de: 'Ich beziehe mich auf die vorliegenden Daten.', es: 'Me refiero a los datos disponibles.' }],
                      C1: [{ de: 'Insofern erscheint die Kritik nachvollziehbar.', es: 'En ese sentido, la critica resulta comprensible.' }, { de: 'Der Autor differenziert zwischen Ursache und Wirkung.', es: 'El autor diferencia entre causa y efecto.' }, { de: 'Nichtsdestotrotz bleibt die Kernfrage offen.', es: 'No obstante, la cuestion central sigue abierta.' }]
                  };
                  const sample = sentenceBank[levelKey] || sentenceBank.A1;
                  const answerMap = { A0: 'bin', A1: 'm«Ùchte', A2: 'habe', B1: 'w«¨rde', B2: 'werden', C1: 'bleibt' };
                  return {
                      title: `${label} ∂˙ pr«≠ctica ${idx + 1}`,
                      topic: topicForUi,
                      grammarTip: `Nivel ${levelKey}: bloque de ${label.toLowerCase()} con enfoque comunicativo y correcci«¸n gramatical.`,
                      phrases: [sample[idx % sample.length], sample[(idx + 1) % sample.length], sample[(idx + 2) % sample.length]],
                      fill: { prompt: `Completa (${levelKey}): Ich ___ weiter Deutsch.`, answer: answerMap[levelKey] || 'lerne', hint: `Forma habitual de ${levelKey}.` },
                      speak: { target: sample[idx % sample.length].de }
                  };
              };
              Object.keys(premiumTopicPlan).forEach((levelKey) => {
                  const generated = (premiumTopicPlan[levelKey] || []).map((topic, idx) => mkPremiumUnit(levelKey, topic, idx));
                  const curr = Array.isArray(curriculumByLevel[levelKey]) ? curriculumByLevel[levelKey] : [];
                  curriculumByLevel[levelKey] = [...curr, ...generated];
              });
              const byLevel = { A0: [], A1: [], A2: [], B1: [], B2: [], C1: [] };
              (rutaVerbDb.verbs || []).forEach((v) => {
                  const lv = String(v && v.level ? v.level : '').toUpperCase();
                  if (byLevel[lv]) byLevel[lv].push(v);
              });
              const normalizeRutaLevelKey = (value) => {
                  const s = String(value || '').toUpperCase();
                  if (s.startsWith('A0')) return 'A0';
                  if (s.startsWith('A1')) return 'A1';
                  if (s.startsWith('A2')) return 'A2';
                  if (s.startsWith('B1')) return 'B1';
                  if (s.startsWith('B2')) return 'B2';
                  if (s.startsWith('C1')) return 'C1';
                  return s;
              };
              const mkCurriculumLesson = (levelKey, unit, idx) => ({
                  id: `curr-${levelKey.toLowerCase()}-${idx + 1}`,
                  title: `${levelKey} ∂˙ ${unit.title}`,
                  topic: unit.topic || 'general',
                  rewardCoins: 14 + Math.min(20, idx * 2),
                  rewardXp: 20 + Math.min(26, idx * 2),
                  grammarTip: unit.grammarTip || `Pr«≠ctica guiada ${levelKey}.`,
                  phrases: Array.isArray(unit.phrases) && unit.phrases.length ? unit.phrases.slice(0, 3) : [{ de: 'Ich lerne Deutsch.', es: 'Aprendo alem«≠n.' }],
                  fill: unit.fill || { prompt: 'Completa: Ich ___ Deutsch.', answer: 'lerne', hint: 'Verbo en presente.' },
                  speak: unit.speak || { target: (unit.phrases && unit.phrases[0] && unit.phrases[0].de) || 'Ich lerne Deutsch.' }
              });
              const mkLesson = (levelKey, chunk, idx) => {
                  const topicCycle = ['familia', 'trabajo', 'alimentos', 'viajes', 'vivienda', 'salud', 'tiempo_libre', 'tramites'];
                  const topic = topicCycle[idx % topicCycle.length];
                  const title = `${levelKey} ∂˙ Verbos ${idx + 1}`;
                  const phrases = chunk.slice(0, 3).map((v) => ({
                      de: (v && v.examples && v.examples[0] && v.examples[0].de) || `Ich ${v.lemma}.`,
                      es: (v && v.examples && v.examples[0] && v.examples[0].es) || (v.es || 'É?"')
                  }));
                  const p = chunk[0] || {};
                  return {
                      id: `auto-${levelKey.toLowerCase()}-${idx + 1}`,
                      title,
                      topic,
                      rewardCoins: 16 + Math.min(16, idx),
                      rewardXp: 22 + Math.min(20, idx * 2),
                      grammarTip: `Nivel ${levelKey}: pr«≠ctica de verbos frecuentes y sus formas.`,
                      phrases,
                      fill: {
                          prompt: `Completa: Ich ___ (${p.lemma || 'lernen'}).`,
                          answer: (p.forms && p.forms.praesens && p.forms.praesens.ich) || p.lemma || 'lerne',
                          hint: `Forma de 1∂¶ persona (Pr«œsens) de ∂Æ${p.lemma || 'lernen'}∂Ø.`
                      },
                      speak: { target: (phrases[0] && phrases[0].de) || 'Ich lerne Deutsch.' }
                  };
              };
              const mkLevel = (levelKey, title, badge, sourceVerbs) => {
                  const chunks = [];
                  const size = 8;
                  for (let i = 0; i < sourceVerbs.length; i += size) chunks.push(sourceVerbs.slice(i, i + size));
                  const lessons = chunks.map((c, i) => mkLesson(levelKey, c, i));
                  return { id: `auto-${levelKey.toLowerCase()}`, title, badge, lessons };
              };
              const getArticleByLevel = (levelKey) => (rutaArticleDb || []).filter((a) => {
                  const one = String(a && a.level ? a.level : '').toUpperCase();
                  const many = Array.isArray(a && a.levels) ? a.levels.map((x) => String(x).toUpperCase()) : [];
                  return one === levelKey || many.includes(levelKey);
              });
              const connectorByLevel = {
                  A1: ['und', 'aber', 'oder', 'denn'],
                  A2: ['weil', 'dass', 'wenn', 'deshalb', 'deswegen'],
                  B1: ['obwohl', 'damit', 'trotzdem', 'au«Yerdem', 'danach'],
                  B2: ['w«œhrend', 'sobald', 'falls', 'insofern', 'hingegen'],
                  C1: ['demzufolge', 'folglich', 'somit', 'nichtsdestotrotz', 'infolgedessen']
              };
              const mkArticleLesson = (levelKey, items, idx) => {
                  const topicCycle = ['familia', 'trabajo', 'alimentos', 'vivienda', 'viajes', 'salud'];
                  const topic = topicCycle[idx % topicCycle.length];
                  const sample = items[0] || {};
                  const de = String(sample.de || 'das Buch');
                  const article = de.split(/\s+/)[0] || 'das';
                  return {
                      id: `auto-art-${levelKey.toLowerCase()}-${idx + 1}`,
                      title: `${levelKey} ∂˙ Art«culos ${idx + 1}`,
                      topic,
                      rewardCoins: 15 + idx,
                      rewardXp: 20 + idx * 2,
                      grammarTip: `Nivel ${levelKey}: art«culo + sustantivo y concordancia en frase.`,
                      phrases: items.slice(0, 3).map((x) => ({ de: `${x.de} ist wichtig.`, es: `${x.es || x.de} es importante.` })),
                      fill: { prompt: `Completa: ___ ${de.split(/\s+/).slice(1).join(' ')} ist hier.`, answer: article, hint: 'Piensa en el g«∏nero del sustantivo.' },
                      speak: { target: `${de} ist wichtig.` }
                  };
              };
              const mkConnectorLesson = (levelKey, idx) => {
                  const c = connectorByLevel[levelKey] || [];
                  const con = c[idx % c.length] || 'weil';
                  return {
                      id: `auto-conn-${levelKey.toLowerCase()}-${idx + 1}`,
                      title: `${levelKey} ∂˙ Conectores ${idx + 1}`,
                      topic: 'conectores',
                      rewardCoins: 18 + idx,
                      rewardXp: 24 + idx * 2,
                      grammarTip: `Conector ${con}: practica posici«¸n verbal seg«ßn tipo de oraci«¸n.`,
                      phrases: [
                          { de: `Ich lerne Deutsch, ${con} ich in Deutschland arbeiten m«Ùchte.`, es: `Aprendo alem«≠n, ${con === 'weil' ? 'porque' : 'usando conector'} quiero trabajar en Alemania.` },
                          { de: `${con.charAt(0).toUpperCase() + con.slice(1)} es regnet, bleibe ich zu Hause.`, es: 'Si/como llueve, me quedo en casa.' }
                      ],
                      fill: { prompt: `Completa con conector (${levelKey}): Ich lerne Deutsch, ___ ich reisen will.`, answer: con, hint: 'Usa el conector trabajado en esta lecci«¸n.' },
                      speak: { target: `Ich lerne Deutsch, ${con} ich reisen will.` }
                  };
              };
              const dynamic = [];
              const baseEnriched = (base || []).map((lv) => {
                  const key = normalizeRutaLevelKey((lv && lv.badge) || (lv && lv.title) || '');
                  const extra = (curriculumByLevel[key] || []).map((unit, idx) => mkCurriculumLesson(key, unit, idx));
                  const existingIds = new Set((lv.lessons || []).map((x) => x.id));
                  const mergedLessons = [...(lv.lessons || []), ...extra.filter((x) => !existingIds.has(x.id))];
                  return { ...lv, lessons: mergedLessons };
              });
              const mkMergedLevel = (levelKey, title, badge, sourceVerbs) => {
                  const lv = mkLevel(levelKey, title, badge, sourceVerbs);
                  const curriculumExtra = (curriculumByLevel[levelKey] || []).map((unit, idx) => mkCurriculumLesson(levelKey, unit, idx));
                  lv.lessons.push(...curriculumExtra);
                  const arts = getArticleByLevel(levelKey);
                  for (let i = 0; i < arts.length; i += 10) lv.lessons.push(mkArticleLesson(levelKey, arts.slice(i, i + 10), Math.floor(i / 10)));
                  const cc = connectorByLevel[levelKey] || [];
                  for (let i = 0; i < Math.max(1, Math.ceil(cc.length / 2)); i++) lv.lessons.push(mkConnectorLesson(levelKey, i));
                  return lv;
              };
              if (byLevel.A2.length || getArticleByLevel('A2').length) dynamic.push(mkMergedLevel('A2', 'Nivel A2 ∂˙ Consolidaci«¸n', 'A2', byLevel.A2));
              if (byLevel.B1.length || getArticleByLevel('B1').length) dynamic.push(mkMergedLevel('B1', 'Nivel B1 ∂˙ Intermedio', 'B1', byLevel.B1));
              if (byLevel.B2.length || getArticleByLevel('B2').length) dynamic.push(mkMergedLevel('B2', 'Nivel B2 ∂˙ Avanzado', 'B2', byLevel.B2));
              if (byLevel.C1.length || getArticleByLevel('C1').length) dynamic.push(mkMergedLevel('C1', 'Nivel C1 ∂˙ Dominio', 'C1', byLevel.C1));
              const existingKeys = new Set([...baseEnriched, ...dynamic].map((lv) => normalizeRutaLevelKey((lv && lv.badge) || (lv && lv.title) || '')));
              const fallbackTitles = {
                  A0: { id: 'a0-ext', title: 'Nivel 0 ∂˙ Fundamentos', badge: 'A0' },
                  A1: { id: 'a1-ext', title: 'Nivel A1 ∂˙ Comunicaci«¸n b«≠sica', badge: 'A1' },
                  A2: { id: 'a2-ext', title: 'Nivel A2 ∂˙ Consolidaci«¸n', badge: 'A2' },
                  B1: { id: 'b1-ext', title: 'Nivel B1 ∂˙ Intermedio', badge: 'B1' },
                  B2: { id: 'b2-ext', title: 'Nivel B2 ∂˙ Avanzado', badge: 'B2' },
                  C1: { id: 'c1-ext', title: 'Nivel C1 ∂˙ Dominio', badge: 'C1' }
              };
              Object.keys(curriculumByLevel).forEach((k) => {
                  if (existingKeys.has(k)) return;
                  const meta = fallbackTitles[k];
                  const lessons = (curriculumByLevel[k] || []).map((unit, idx) => mkCurriculumLesson(k, unit, idx));
                  dynamic.push({ id: meta.id, title: meta.title, badge: meta.badge, lessons });
              });
              return [...baseEnriched, ...dynamic];
          }, [rutaVerbDb, rutaArticleDb]);
          useEffect(() => {
              const onToast = (ev) => {
                  const d = (ev && ev.detail) || {};
                  const msg = String(d.message || '').trim();
                  if (!msg) return;
                  const t = { id: Date.now() + Math.random(), message: msg, kind: String(d.kind || 'info') };
                  setToastItems((prev) => [...prev.slice(-3), t]);
                  setTimeout(() => setToastItems((prev) => prev.filter((x) => x.id !== t.id)), 2600);
              };
              window.addEventListener('muller-toast', onToast);
              return () => window.removeEventListener('muller-toast', onToast);
          }, []);
          useEffect(() => {
              try { localStorage.setItem('muller_show_floating_tools', showFloatingTools ? '1' : '0'); } catch (e) {}
              try { window.dispatchEvent(new CustomEvent('muller-floating-tools-updated', { detail: { enabled: !!showFloatingTools } })); } catch (e) {}
          }, [showFloatingTools]);
          useEffect(() => {
              try { localStorage.setItem('muller_reduce_motion', reduceMotionUi ? '1' : '0'); } catch (e) {}
              try {
                  if (reduceMotionUi) document.documentElement.classList.add('muller-reduce-motion');
                  else document.documentElement.classList.remove('muller-reduce-motion');
              } catch (e) {}
          }, [reduceMotionUi]);
          const [uiTheme, setUiTheme] = useState(() => { try { return localStorage.getItem(MULLER_THEME_KEY) || 'dark'; } catch (e) { return 'dark'; } });
          const [showOnboarding, setShowOnboarding] = useState(() => { try { return !localStorage.getItem(MULLER_ONBOARDING_KEY); } catch (e) { return true; } });
          const [onboardingStep, setOnboardingStep] = useState(1);
          const [onboardingNever, setOnboardingNever] = useState(false);
          const [historiaAudioOnly, setHistoriaAudioOnly] = useState(false);
          const [vocabDueFilterOnly, setVocabDueFilterOnly] = useState(false);
          const [showShortcutsModal, setShowShortcutsModal] = useState(false);
          const [userMenuOpen, setUserMenuOpen] = useState(false);
          const userMenuWrapRef = useRef(null);
          const [communitySubTab, setCommunitySubTab] = useState('economia');
          const [showProfileSettingsModal, setShowProfileSettingsModal] = useState(false);
          const [profileSettingsTab, setProfileSettingsTab] = useState('perfil');
          const [showFloatingTools, setShowFloatingTools] = useState(() => { try { return localStorage.getItem('muller_show_floating_tools') !== '0'; } catch (e) { return true; } });
          const [reduceMotionUi, setReduceMotionUi] = useState(() => { try { return localStorage.getItem('muller_reduce_motion') === '1'; } catch (e) { return false; } });
          const [authTick, setAuthTick] = useState(0);
          const [authEmail, setAuthEmail] = useState('');
          const [authPassword, setAuthPassword] = useState('');
          const [authDisplayName, setAuthDisplayName] = useState('');
          const [authBusy, setAuthBusy] = useState(false);
          const [authError, setAuthError] = useState('');
          const [authMode, setAuthMode] = useState('login');
          const [supabaseUser, setSupabaseUser] = useState(null);
          const [supabaseProfile, setSupabaseProfile] = useState(null);
          const cloudApplyingRef = useRef(false);
          const cloudLoadedRef = useRef(false);
          const cloudPushTimerRef = useRef(null);
          const [remoteLeagueRows, setRemoteLeagueRows] = useState(null);
          const [remoteProfiles, setRemoteProfiles] = useState(null);
          const [profileNameDraft, setProfileNameDraft] = useState('');
          const [profileNameBusy, setProfileNameBusy] = useState(false);
          const [profileNameMsg, setProfileNameMsg] = useState('');
          const [toastItems, setToastItems] = useState([]);
          const [walletCoins, setWalletCoins] = useState(null);
          const [walletLoading, setWalletLoading] = useState(false);
          const [walletIsCreator, setWalletIsCreator] = useState(false);
          const [economyMsg, setEconomyMsg] = useState('');
          const [adOpenedAt, setAdOpenedAt] = useState(0);
          const [rewardStatus, setRewardStatus] = useState(null);
          const [premiumStatus, setPremiumStatus] = useState(null);
          const [cloudSyncState, setCloudSyncState] = useState('local');
          const [cloudSyncLabel, setCloudSyncLabel] = useState('Local');
          const [cloudSyncAt, setCloudSyncAt] = useState(null);
          const [storiesProInputMode, setStoriesProInputMode] = useState('es');
          const [storiesProOcrLang, setStoriesProOcrLang] = useState('es');
          const [storiesProSourceText, setStoriesProSourceText] = useState('');
          const [storiesProLevel, setStoriesProLevel] = useState('B1');
          const [storiesProTone, setStoriesProTone] = useState('natural');
          const [storiesProBusy, setStoriesProBusy] = useState(false);
          const [storiesProErr, setStoriesProErr] = useState('');
          const [storiesProResult, setStoriesProResult] = useState(null);
          const unifiedAuth = useMemo(() => {
              void authTick;
              if (mullerSupabaseConfigured() && supabaseUser) {
                  const dn = supabaseProfile && supabaseProfile.display_name
                      ? supabaseProfile.display_name
                      : (supabaseUser.user_metadata && supabaseUser.user_metadata.display_name) || 'Estudiante';
                  return {
                      source: 'supabase',
                      email: supabaseUser.email,
                      displayName: dn,
                      userId: supabaseUser.id,
                  };
              }
              const loc = mullerAuthGetSession();
              if (loc) return { source: 'local', ...loc };
              return null;
          }, [authTick, supabaseUser, supabaseProfile]);
          const isCreatorAccount = useMemo(() => {
              if (walletIsCreator) return true;
              if (!unifiedAuth || !unifiedAuth.email) return false;
              const creatorEmail = String(window.MULLER_CREATOR_EMAIL || '').trim().toLowerCase();
              return !!(creatorEmail && String(unifiedAuth.email || '').toLowerCase() === creatorEmail);
          }, [walletIsCreator, unifiedAuth]);
          const coinsUiLabel = isCreatorAccount ? 'É^z' : userStats.coins;
          const economyReasonText = (reason) => {
              const r = String(reason || '');
              if (r === 'already_claimed_today') return 'Ya has reclamado el bonus diario hoy.';
              if (r === 'daily_limit_reached') return 'L«mite diario de anuncios alcanzado (6/6).';
              if (r === 'cooldown_15m') return 'Debes esperar 15 minutos entre anuncios.';
              if (r === 'invalid_reward_type') return 'Tipo de recompensa inv«≠lido.';
              if (r === 'creator_unlimited') return 'Cuenta creador: saldo ilimitado.';
              if (r === 'ok') return 'Operaci«¸n completada.';
              return r || 'No disponible.';
          };
          const leagueBoard = useMemo(() => {
              const week = mullerIsoWeekMonday();
              const bots = MULLER_BOT_PLAYERS.map((b) => ({
                  id: b.id,
                  name: b.name,
                  isBot: true,
                  isSelf: false,
                  score: mullerBotWeekScore(b.id, week),
                  sub: `${b.tag} ∂˙ ${b.lvl}`,
                  rank: 0,
              }));
              const meScore = mullerLeagueComputeUserScore(userStats);
              const meName = userStats.username || 'Estudiante';
              const ua = unifiedAuth;
              let humans = [];
              if (remoteLeagueRows && Array.isArray(remoteLeagueRows) && remoteLeagueRows.length > 0) {
                  humans = remoteLeagueRows.map((r) => ({
                      id: String(r.user_id),
                      name: r.display_name || 'Estudiante',
                      isBot: false,
                      isSelf: !!(ua && ua.userId && r.user_id === ua.userId),
                      score: Number(r.score) || 0,
                      sub: 'Liga global (Supabase)',
                      rank: 0,
                  }));
                  if (ua && ua.source === 'supabase' && !humans.some((h) => h.isSelf)) {
                      humans.push({
                          id: ua.userId,
                          name: meName,
                          isBot: false,
                          isSelf: true,
                          score: meScore,
                          sub: 'Tu puntuaci«¸n (se sube al jugar)',
                          rank: 0,
                      });
                  }
              } else {
                  humans = [{
                      id: 'local_player',
                      name: meName,
                      isBot: false,
                      isSelf: true,
                      score: meScore,
                      sub: ua ? mullerMaskEmail(ua.email) : 'Invitado (sin cuenta)',
                      rank: 0,
                  }];
              }
                   const rows = [...humans, ...bots].sort((a, b) => b.score - a.score);
              rows.forEach((r, i) => { r.rank = i + 1; });
              return { week, rows };
          }, [userStats, unifiedAuth, remoteLeagueRows]);
          const directoryLocals = useMemo(() => {
              void authTick;
              const m = mullerAccountsLoad();
              return Object.keys(m).map((email) => ({ email, displayName: m[email].displayName, userId: m[email].userId, createdAt: m[email].createdAt }));
          }, [authTick]);
          const [mainDailyGoal, setMainDailyGoal] = useState(() => mullerGetMainDailyGoalCards());
          const [oralQIdx, setOralQIdx] = useState(0);
          const [oralSecs, setOralSecs] = useState(90);
          const [oralDeadline, setOralDeadline] = useState(null);
          const [oralClock, setOralClock] = useState(0);
          const [pwaDeferredPrompt, setPwaDeferredPrompt] = useState(null);
          const [tourStep, setTourStep] = useState(0);
          const [dailyChallenges, setDailyChallenges] = useState(() => {
              try {
                  const k = 'muller_daily_v1_' + new Date().toISOString().slice(0, 10);
                  const j = localStorage.getItem(k);
                  return j ? JSON.parse(j) : { vocab: false, shadow: false, write: false };
              } catch (e) { return { vocab: false, shadow: false, write: false }; }
          });
          const [vocabSrsEpoch, setVocabSrsEpoch] = useState(0);
          const vocabSrsMap = useMemo(() => mullerGetVocabSrsMap(), [vocabSrsEpoch]);
          const vocabSrsDueCount = useMemo(() => {
              if (!currentVocabList.length) return 0;
              return mullerCountVocabSrsDue(currentVocabList, vocabSrsMap);
          }, [currentVocabList, vocabSrsMap]);
          const vocabDisplayList = useMemo(() => {
              if (!vocabDueFilterOnly) return currentVocabList;
              const todayStr = new Date().toISOString().slice(0, 10);
              return currentVocabList.filter((w) => {
                  const rec = vocabSrsMap[mullerVocabSrsKey(w)];
                  if (!rec || !rec.due) return true;
                  return rec.due <= todayStr;
              });
          }, [currentVocabList, vocabDueFilterOnly, vocabSrsMap]);

          const [exerciseHelpId, setExerciseHelpId] = useState(null);
          const historiaExerciseHelpId = useMemo(() => {
              if (podcastMode) return 'historia_podcast';
              if (mode === 'interview') return 'historia_interview';
              if (mode === 'roleplay_wait') return 'historia_roleplay';
              if (mode === 'dialogue' && puzzleMode) return 'historia_puzzle';
              if (mode === 'dialogue' && diktatMode) return 'historia_diktat';
              if (mode === 'dialogue' && lueckentextMode) return 'historia_huecos';
              if (mode === 'dialogue' && artikelSniperMode) return 'historia_artikel';
              if (mode === 'dialogue' && declinaMode) return 'historia_declinar';
              if (mode === 'dialogue' && tempusMode) return 'historia_tempus';
              if (mode === 'dialogue' && blindMode) return 'historia_blind';
              if (mode === 'dialogue') return 'historia_dialogue';
              return 'historia_base';
          }, [mode, podcastMode, puzzleMode, diktatMode, lueckentextMode, artikelSniperMode, declinaMode, tempusMode, blindMode]);
          const escrituraExerciseHelpId = useMemo(() => 'escritura_' + writingMode, [writingMode]);
          const bxExerciseHelpId = useMemo(() => 'bx_' + bxCategory, [bxCategory]);

          useEffect(() => {
              const h = (e) => {
                  const id = e && e.detail && e.detail.id;
                  if (id && MULLER_EXERCISE_HELP[id]) setExerciseHelpId(id);
              };
              window.addEventListener('mullerOpenExerciseHelp', h);
              return () => window.removeEventListener('mullerOpenExerciseHelp', h);
          }, []);

          useEffect(() => {
              if (!exerciseHelpId) return;
              const k = (ev) => { if (ev.key === 'Escape') setExerciseHelpId(null); };
              window.addEventListener('keydown', k);
              return () => window.removeEventListener('keydown', k);
          }, [exerciseHelpId]);

          const ExerciseHelpBtn = ({ helpId, className = '', compact = false, title: titleOverride, ...rest }) => {
              const entry = MULLER_EXERCISE_HELP[helpId];
              if (!entry) return null;
              const t = titleOverride || ('Ayuda: ' + entry.title);
              return (
                  <button type="button" onClick={() => setExerciseHelpId(helpId)} className={`inline-flex items-center justify-center gap-1 rounded-lg border border-white/15 bg-black/30 hover:bg-black/50 px-1.5 py-1 text-[10px] md:text-xs font-bold text-sky-200/95 shrink-0 ${className}`} title={t} aria-label={t} {...rest}>
                      <Icon name="help-circle" className={compact ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5 md:w-4 md:h-4'} />
                      {!compact && <span className="hidden sm:inline">Ayuda</span>}
                  </button>
              );
          };
          window.ExerciseHelpBtn = ExerciseHelpBtn;

          const bxCatTabRef = useRef(null);
          const isPlayingRef = useRef(false);
          const timeoutRef = useRef(null);
          const recognitionRef = useRef(null);
          const spokenTextRef = useRef("");
          const speechFinalRef = useRef("");
          const micIgnoreMouseUntilRef = useRef(0);
          const noiseContextRef = useRef(null);
          const noiseSourceRef = useRef(null);
          const noiseGainRef = useRef(null);
          const submitKeyLockRef = useRef({});
          const pdfStudyBufferRef = useRef(null);
          const pdfStudyDocHandleRef = useRef(null);
          const pdfStudyOcrAbortRef = useRef(false);

          /* Tras cada commit React los <i data-lucide> se restauran; hay que volver a pintar SVG en todo el documento */
          useLayoutEffect(() => {
              const t = requestAnimationFrame(() => {
                  try {
                      if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
                  } catch (e) {}
              });
              return () => cancelAnimationFrame(t);
          });

          useEffect(() => {
              if (!showMullerHub) return;
              try {
                  setTtsDeUri(localStorage.getItem('muller_tts_de') || '');
                  setTtsEsUri(localStorage.getItem('muller_tts_es') || '');
              } catch (e) {}
              try {
                  if (window.speechSynthesis && typeof window.speechSynthesis.getVoices === 'function') {
                      window.speechSynthesis.getVoices();
                  }
              } catch (e) {}
          }, [showMullerHub]);

          useEffect(() => {
              if (!showMullerHub) return;
              const onKey = (e) => { if (e.key === 'Escape') setShowMullerHub(false); };
              window.addEventListener('keydown', onKey);
              return () => window.removeEventListener('keydown', onKey);
          }, [showMullerHub]);

          useEffect(() => {
              const onAb = (e) => setAudiobookPlaying(!!e.detail?.playing);
              window.addEventListener('mullerAudiobookState', onAb);
              return () => window.removeEventListener('mullerAudiobookState', onAb);
          }, []);

          // Cargar datos guardados
          useEffect(() => {
              const savedData = localStorage.getItem('mullerStats');
              if (savedData) setUserStats(JSON.parse(savedData));
              else setShowLoginModal(true);
              const scripts = localStorage.getItem('mullerScripts');
              if (scripts) {
                  try {
                      let arr = JSON.parse(scripts);
                      if (Array.isArray(arr)) {
                          let changed = false;
                          arr = arr.map((s, i) => {
                              if (s && s.id != null && s.id !== '') return s;
                              changed = true;
                              return { ...s, id: 'muller_script_' + Date.now() + '_' + i + '_' + Math.random().toString(36).slice(2, 9) };
                          });
                          if (changed) localStorage.setItem('mullerScripts', JSON.stringify(arr));
                          setSavedScripts(arr);
                      }
                  } catch (e) { setSavedScripts([]); }
              }
              const savedCustomVocab = localStorage.getItem('mullerCustomVocab');
              if(savedCustomVocab) setCustomVocabLessons(JSON.parse(savedCustomVocab));
              setUserStats((prev) => ({ ...prev, streakDays: mullerComputeHonestStreakDays() }));
          }, []);

          const buildCloudSnapshot = useCallback(() => {
              return {
                  userStats,
                  savedScripts,
                  customVocabLessons,
                  prefs: {
                      showFloatingTools,
                      reduceMotionUi,
                      uiTheme,
                  },
                  storiesProDraft: {
                      inputMode: storiesProInputMode,
                      sourceText: storiesProSourceText,
                      level: storiesProLevel,
                      tone: storiesProTone,
                  }
              };
          }, [userStats, savedScripts, customVocabLessons, showFloatingTools, reduceMotionUi, uiTheme, storiesProInputMode, storiesProSourceText, storiesProLevel, storiesProTone]);

          const applyCloudSnapshot = useCallback((payload) => {
              if (!payload || typeof payload !== 'object') return;
              cloudApplyingRef.current = true;
              try {
                  if (payload.userStats && typeof payload.userStats === 'object') {
                      setUserStats(payload.userStats);
                      try { localStorage.setItem('mullerStats', JSON.stringify(payload.userStats)); } catch (e) {}
                  }
                  if (Array.isArray(payload.savedScripts)) {
                      setSavedScripts(payload.savedScripts);
                      try { localStorage.setItem('mullerScripts', JSON.stringify(payload.savedScripts)); } catch (e) {}
                  }
                  if (Array.isArray(payload.customVocabLessons)) {
                      setCustomVocabLessons(payload.customVocabLessons);
                      try { localStorage.setItem('mullerCustomVocab', JSON.stringify(payload.customVocabLessons)); } catch (e) {}
                  }
                  if (payload.prefs && typeof payload.prefs === 'object') {
                      if (typeof payload.prefs.showFloatingTools === 'boolean') setShowFloatingTools(payload.prefs.showFloatingTools);
                      if (typeof payload.prefs.reduceMotionUi === 'boolean') setReduceMotionUi(payload.prefs.reduceMotionUi);
                      if (typeof payload.prefs.uiTheme === 'string') setUiTheme(payload.prefs.uiTheme);
                  }
                  if (payload.storiesProDraft && typeof payload.storiesProDraft === 'object') {
                      if (typeof payload.storiesProDraft.inputMode === 'string') setStoriesProInputMode(payload.storiesProDraft.inputMode);
                      if (typeof payload.storiesProDraft.sourceText === 'string') setStoriesProSourceText(payload.storiesProDraft.sourceText);
                      if (typeof payload.storiesProDraft.level === 'string') setStoriesProLevel(payload.storiesProDraft.level);
                      if (typeof payload.storiesProDraft.tone === 'string') setStoriesProTone(payload.storiesProDraft.tone);
                  }
              } finally {
                  window.setTimeout(() => { cloudApplyingRef.current = false; }, 50);
              }
          }, []);

          useEffect(() => {
              if (activeTab !== 'lexikon') return;
              try {
                  const raw = localStorage.getItem('mullerCustomVocab');
                  if (raw) {
                      const parsed = JSON.parse(raw);
                      if (Array.isArray(parsed)) setCustomVocabLessons(parsed);
                  }
              } catch (e) {}
          }, [activeTab]);

          useEffect(() => {
              if (activeTab !== 'lexikon') return;
              if (customVocabLessons.length > 0 && !lexikonSaveLessonId) {
                  setLexikonSaveLessonId(customVocabLessons[0].id);
              }
          }, [activeTab, customVocabLessons, lexikonSaveLessonId]);

          useEffect(() => {
              const id = setInterval(() => {
                  if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
                  let st = mullerGetStreakTodayStats();
                  const today = new Date().toISOString().slice(0, 10);
                  if (st.date !== today) st = { date: today, vocabRated: 0, points: 0, activeSec: 0 };
                  st.activeSec = (st.activeSec || 0) + 60;
                  mullerSaveStreakTodayStats(st);
                  mullerUpdateQualifyingForStats(st);
                  setUserStats((prev) => ({ ...prev, streakDays: mullerComputeHonestStreakDays() }));
              }, 60000);
              return () => clearInterval(id);
          }, []);

          useEffect(() => { try { localStorage.setItem('muller_active_tab_v1', activeTab); } catch {} }, [activeTab]);

          useEffect(() => {
              if (!showSplash) {
                  setSplashLogoBlink(false);
                  return undefined;
              }
              const t = window.setTimeout(() => setSplashLogoBlink(true), 3000);
              return () => window.clearTimeout(t);
          }, [showSplash]);
          useEffect(() => {
              if (!showSplash) return undefined;
              const autoClose = window.setTimeout(() => setShowSplash(false), 6500);
              return () => window.clearTimeout(autoClose);
          }, [showSplash]);

          useEffect(() => {
              const onKey = (e) => {
                  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
                  if (e.key === '?' || (e.shiftKey && e.key === '/')) {
                      e.preventDefault();
                      setShowShortcutsModal(true);
                  }
                  if (e.key === 'i' || e.key === 'I') {
                      if (!e.ctrlKey && !e.metaKey) { setActiveTab('inicio'); stopAudio(); setPracticeActive(null); }
                  }
                  if (e.key === 'r' || e.key === 'R') {
                      if (!e.ctrlKey && !e.metaKey) { setActiveTab('ruta'); stopAudio(); setPracticeActive(null); }
                  }
                  if (e.key === 'h' || e.key === 'H') {
                      if (!e.ctrlKey && !e.metaKey) { setActiveTab('historia'); setMode('dialogue'); }
                  }
                  if (e.key === 'v' || e.key === 'V') {
                      if (!e.ctrlKey && !e.metaKey) setActiveTab('vocabulario');
                  }
                  if (e.key === 'p' || e.key === 'P') {
                      if (!e.ctrlKey && !e.metaKey) setActiveTab('progreso');
                  }
                  if (e.key === 'm' || e.key === 'M') {
                      if (!e.ctrlKey && !e.metaKey) { setShowMullerHub(true); setMullerHubTab('voices'); }
                  }
                  if (e.key === 'o' || e.key === 'O') {
                      if (!e.ctrlKey && !e.metaKey) { setActiveTab('comunidad'); stopAudio(); setPracticeActive(null); }
                  }
                  if (e.key === 'Escape') { setShowShortcutsModal(false); setUserMenuOpen(false); }
              };
              window.addEventListener('keydown', onKey);
              return () => window.removeEventListener('keydown', onKey);
          }, []);

          useEffect(() => {
              if (activeTab !== 'ruta') return undefined;
              rutaTabTimerRef.current = Date.now();
              return () => {
                  const start = rutaTabTimerRef.current;
                  if (!start) return;
                  const ms = Date.now() - start;
                  setRutaProgress((prev) => {
                      const next = { ...prev, playTimeMs: (prev.playTimeMs || 0) + ms };
                      if (typeof window.mullerRutaSave === 'function') window.mullerRutaSave(next);
                      return next;
                  });
              };
          }, [activeTab]);

          useEffect(() => {
              if (!userMenuOpen) return undefined;
              const close = (e) => {
                  if (userMenuWrapRef.current && !userMenuWrapRef.current.contains(e.target)) setUserMenuOpen(false);
              };
              document.addEventListener('mousedown', close);
              document.addEventListener('touchstart', close, { passive: true });
              return () => {
                  document.removeEventListener('mousedown', close);
                  document.removeEventListener('touchstart', close);
              };
          }, [userMenuOpen]);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client) return undefined;
              client.auth.getSession().then(({ data: { session } }) => {
                  setSupabaseUser(session && session.user ? session.user : null);
              });
              const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
                  setSupabaseUser(session && session.user ? session.user : null);
                  setAuthTick((x) => x + 1);
              });
              return () => { try { subscription.unsubscribe(); } catch (err) {} };
          }, []);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client || !supabaseUser || !supabaseUser.id) {
                  setSupabaseProfile(null);
                  return undefined;
              }
              let cancelled = false;
              client.from('profiles').select('*').eq('id', supabaseUser.id).maybeSingle().then(({ data, error }) => {
                  if (cancelled || error) return;
                  if (data) setSupabaseProfile(data);
              });
              return () => { cancelled = true; };
          }, [supabaseUser]);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client || !supabaseUser || !supabaseUser.id) {
                  setWalletCoins(null);
                  setWalletIsCreator(false);
                  return undefined;
              }
              let cancelled = false;
              setWalletLoading(true);
              client.rpc('muller_get_wallet').then(({ data, error }) => {
                  if (cancelled) return;
                  setWalletLoading(false);
                  if (error || !Array.isArray(data) || !data[0]) return;
                  const row = data[0];
                  setWalletCoins(Number(row.coins || 0));
                  setWalletIsCreator(!!row.is_creator);
              });
              return () => { cancelled = true; };
          }, [supabaseUser, authTick]);

          useEffect(() => {
              if (!unifiedAuth || unifiedAuth.source !== 'supabase') return;
              if (walletCoins == null) return;
              if (isCreatorAccount) return;
              setUserStats((prev) => {
                  if ((Number(prev.coins) || 0) === walletCoins) return prev;
                  const next = { ...prev, coins: walletCoins };
                  try { localStorage.setItem('mullerStats', JSON.stringify(next)); } catch (e) {}
                  return next;
              });
          }, [walletCoins, unifiedAuth, isCreatorAccount]);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client || !supabaseUser || !supabaseUser.id) return undefined;
              const week = mullerIsoWeekMonday();
              const score = mullerLeagueComputeUserScore(userStats);
              const t = window.setTimeout(() => {
                  client.rpc('muller_submit_league_score', {
                      p_week_key: week,
                      p_score: score,
                      p_display_name: userStats.username || 'Estudiante',
                  }).then(() => {});
              }, 2800);
              return () => window.clearTimeout(t);
          }, [userStats, supabaseUser]);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client || activeTab !== 'comunidad' || communitySubTab !== 'ligas') return undefined;
              const week = mullerIsoWeekMonday();
              let cancelled = false;
              client.from('league_scores').select('user_id, week_key, score, display_name, updated_at').eq('week_key', week).order('score', { ascending: false }).limit(80).then(({ data, error }) => {
                  if (cancelled || error) return;
                  setRemoteLeagueRows(data || []);
              });
              return () => { cancelled = true; };
          }, [activeTab, communitySubTab, authTick, supabaseUser]);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client || activeTab !== 'comunidad' || communitySubTab !== 'directorio') return undefined;
              let cancelled = false;
              client.from('profiles').select('id, display_name, updated_at').order('updated_at', { ascending: false }).limit(120).then(({ data, error }) => {
                  if (cancelled || error) return;
                  setRemoteProfiles(data || []);
              });
              return () => { cancelled = true; };
          }, [activeTab, communitySubTab, authTick]);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client || activeTab !== 'comunidad' || communitySubTab !== 'economia' || !supabaseUser) {
                  setRewardStatus(null);
                  setPremiumStatus(null);
                  return undefined;
              }
              let cancelled = false;
              client.rpc('muller_reward_status').then(({ data, error }) => {
                  if (cancelled || error || !Array.isArray(data) || !data[0]) return;
                  setRewardStatus(data[0]);
              });
              client.rpc('muller_get_premium_status').then(({ data, error }) => {
                  if (cancelled || error || !Array.isArray(data) || !data[0]) return;
                  setPremiumStatus(data[0]);
              });
              return () => { cancelled = true; };
          }, [activeTab, communitySubTab, authTick, supabaseUser]);

          useEffect(() => {
              if (!unifiedAuth) {
                  setProfileNameDraft('');
                  setProfileNameMsg('');
                  return;
              }
              setProfileNameDraft(unifiedAuth.displayName || '');
              setProfileNameMsg('');
          }, [unifiedAuth]);

          useEffect(() => {
              if (!mullerSupabaseConfigured()) {
                  setCloudSyncState('local');
                  setCloudSyncLabel('Local');
                  return;
              }
              if (!supabaseUser || !supabaseUser.id) {
                  setCloudSyncState('local');
                  setCloudSyncLabel('Local (sin sesi«¸n)');
                  return;
              }
              setCloudSyncState('syncing');
              setCloudSyncLabel('Supabase conectandoÉ?›');
              const client = mullerGetSupabaseClient();
              if (!client) {
                  setCloudSyncState('error');
                  setCloudSyncLabel('Error Supabase');
                  return;
              }
              let cancelled = false;
              client.from('muller_user_state')
                  .select('payload, updated_at')
                  .eq('user_id', supabaseUser.id)
                  .maybeSingle()
                  .then(({ data, error }) => {
                      if (cancelled) return;
                      if (error) {
                          setCloudSyncState('error');
                          setCloudSyncLabel(mullerCloudSyncErrorLabel(error));
                          if (window.__mullerToast) {
                              const detail = String(error.message || error.code || 'fallo desconocido').slice(0, 140);
                              window.__mullerToast(`Sync nube: ${detail}`, 'error');
                          }
                          return;
                      }
                      if (data && data.payload) {
                          applyCloudSnapshot(data.payload);
                          setCloudSyncAt(data.updated_at || new Date().toISOString());
                      }
                      cloudLoadedRef.current = true;
                      setCloudSyncState('synced');
                      setCloudSyncLabel('Supabase activo');
                  })
                  .catch(() => {
                      if (cancelled) return;
                      setCloudSyncState('error');
                      setCloudSyncLabel('Error de red');
                  });
              return () => { cancelled = true; };
          }, [supabaseUser, applyCloudSnapshot]);

          useEffect(() => {
              if (!mullerSupabaseConfigured() || !supabaseUser || !supabaseUser.id) return undefined;
              if (!cloudLoadedRef.current || cloudApplyingRef.current) return undefined;
              const client = mullerGetSupabaseClient();
              if (!client) return undefined;
              if (cloudPushTimerRef.current) window.clearTimeout(cloudPushTimerRef.current);
              setCloudSyncState('syncing');
              setCloudSyncLabel('SincronizandoÉ?›');
              cloudPushTimerRef.current = window.setTimeout(async () => {
                  try {
                      const payload = buildCloudSnapshot();
                      const nowIso = new Date().toISOString();
                      const { error } = await client.from('muller_user_state').upsert({
                          user_id: supabaseUser.id,
                          payload,
                          updated_at: nowIso
                      }, { onConflict: 'user_id' });
                      if (error) throw error;
                      setCloudSyncState('synced');
                      setCloudSyncLabel('Supabase activo');
                      setCloudSyncAt(nowIso);
                  } catch (err) {
                      setCloudSyncState('error');
                      setCloudSyncLabel('Sync con errores');
                  }
              }, 1200);
              return () => {
                  if (cloudPushTimerRef.current) window.clearTimeout(cloudPushTimerRef.current);
              };
          }, [supabaseUser, buildCloudSnapshot, userStats, savedScripts, customVocabLessons, showFloatingTools, reduceMotionUi, uiTheme, storiesProInputMode, storiesProSourceText, storiesProLevel, storiesProTone]);

          useEffect(() => {
              const onBip = (e) => {
                  e.preventDefault();
                  setPwaDeferredPrompt(e);
              };
              window.addEventListener('beforeinstallprompt', onBip);
              return () => window.removeEventListener('beforeinstallprompt', onBip);
          }, []);

          useEffect(() => {
              if (mode !== 'interview' || !oralDeadline) return;
              const id = setInterval(() => setOralClock((c) => c + 1), 1000);
              return () => clearInterval(id);
          }, [mode, oralDeadline, oralQIdx]);

          const vocabViewKey = vocabDisplayList[vocabReviewIndex] ? mullerVocabSrsKey(vocabDisplayList[vocabReviewIndex]) : '';
          useEffect(() => {
              if (activeTab !== 'vocabulario' || !vocabViewKey) return;
              const w = vocabDisplayList[vocabReviewIndex];
              if (!w) return;
              try {
                  const map = mullerIncrementSrsView(mullerGetVocabSrsMap(), w);
                  mullerSetVocabSrsMap(map);
                  setVocabSrsEpoch((x) => x + 1);
              } catch (err) {}
          }, [vocabReviewIndex, activeTab, vocabViewKey]);

          useEffect(() => {
              if (vocabReviewIndex >= vocabDisplayList.length) setVocabReviewIndex(0);
          }, [vocabDisplayList.length, vocabReviewIndex]);

          useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

          useEffect(() => {
              window.__MULLER_ACTIVE_GUION__ = guionData;
          }, [guionData]);

          useEffect(() => {
              if (activeTab !== 'shadowing') return;
              setSpokenText("");
              setPronunciationScore(null);
              setPronunciationFeedback([]);
              setGrammarPolizeiMsg("");
          }, [sceneIndex, activeTab]);

          const saveProgress = (newStatsUpdates) => {
              const today = new Date().toISOString().split('T')[0];
              let st = mullerGetStreakTodayStats();
              if (st.date !== today) st = { date: today, vocabRated: 0, points: 0, activeSec: 0 };
              const mergedStats = { ...userStats, ...newStatsUpdates, lastPlayedDate: today };
              if (isCreatorAccount) mergedStats.coins = 999999999;
              if (unifiedAuth && unifiedAuth.source === 'supabase' && !isCreatorAccount && walletCoins != null) {
                  mergedStats.coins = walletCoins;
              }
              const dayMap = mergedStats.activityByDay || {};
              st.points = Math.max(st.points || 0, dayMap[today] || 0);
              mullerSaveStreakTodayStats(st);
              mullerUpdateQualifyingForStats(st);
              mergedStats.streakDays = mullerComputeHonestStreakDays();
              const goalCards = mullerGetMainDailyGoalCards();
              if (st.vocabRated >= goalCards) {
                  try {
                      if (localStorage.getItem(MULLER_GOAL_CLAIM_KEY) !== today) {
                          localStorage.setItem(MULLER_GOAL_CLAIM_KEY, today);
                          mergedStats.coins = (mergedStats.coins || 0) + 10;
                      }
                  } catch (e) {}
              }
              setUserStats(mergedStats);
              localStorage.setItem('mullerStats', JSON.stringify(mergedStats));
          };

          const handleRegister = () => {
              if(tempUsername.trim() === "") return;
              saveProgress({ username: tempUsername, isPremium: true });
              setShowLoginModal(false);
          };

          const deductHeart = () => {
              if (userStats.hearts <= 1) { saveProgress({ hearts: 0 }); stopAudio(); setShowDeathModal(true); } 
              else { saveProgress({ hearts: userStats.hearts - 1 }); }
          };

          const buyHearts = () => {
              if (isCreatorAccount) { saveProgress({ hearts: 5 }); setShowDeathModal(false); return; }
              if (unifiedAuth && unifiedAuth.source === 'supabase') {
                  const client = mullerGetSupabaseClient();
                  if (!client) { alert("Supabase no disponible."); return; }
                  client.rpc('muller_spend_coins', { p_amount: 50, p_reason: 'buy_hearts' }).then(({ data, error }) => {
                      if (error || !Array.isArray(data) || !data[0] || !data[0].ok) {
                          alert("No tienes suficientes Monedas (Coins).");
                          return;
                      }
                      const newBalance = Number(data[0].balance || 0);
                      setWalletCoins(newBalance);
                      saveProgress({ hearts: 5, coins: newBalance });
                      setShowDeathModal(false);
                  });
                  return;
              }
              if (userStats.coins >= 50) { saveProgress({ coins: userStats.coins - 50, hearts: 5 }); setShowDeathModal(false); }
              else { alert("No tienes suficientes Monedas (Coins). Completa ejercicios para ganar m«≠s."); }
          };

          const getLast7Days = () => {
              const days = [];
              const dayNames = ['Dom', 'Lun', 'Mar', 'Mi«∏', 'Jue', 'Vie', 'S«≠b'];
              for(let i=6; i>=0; i--) {
                  const d = new Date(); d.setDate(d.getDate() - i);
                  days.push(`${dayNames[d.getDay()]} ${d.getDate()}`);
              }
              return days;
          };

          const mergeActivityPoints = (extra) => {
              const today = new Date().toISOString().slice(0, 10);
              const dayMap = { ...(userStats.activityByDay || {}) };
              dayMap[today] = (dayMap[today] || 0) + extra;
              return dayMap;
          };

          const completeRutaLesson = (levelIdx, lessonIdx) => {
              const levels = rutaLevels || [];
              const lesson = levels[levelIdx] && levels[levelIdx].lessons[lessonIdx];
              if (!lesson) return;
              if (rutaProgress.completed && rutaProgress.completed[lesson.id]) {
                  saveProgress({ xp: userStats.xp + 5, activityByDay: mergeActivityPoints(12) });
                  window.__mullerPlaySfx && window.__mullerPlaySfx('ok');
                  setCelebrationModal({ title: 'Repaso listo', subtitle: lesson.title, xp: 5, coins: 0, recap: true });
                  setRutaRun(null);
                  setRutaFillInput(''); setRutaTranscript(''); setRutaSpeakErr('');
                  return;
              }
              const nextCount = (rutaProgress.lessonsCompleted || 0) + 1;
              let bonus = 0;
              if (nextCount % 3 === 0) bonus = 35;
              const nextProg = {
                  ...rutaProgress,
                  completed: { ...(rutaProgress.completed || {}), [lesson.id]: true },
                  lessonsCompleted: nextCount,
              };
              if (typeof window.mullerRutaSave === 'function') window.mullerRutaSave(nextProg);
              setRutaProgress(nextProg);
              saveProgress({
                  xp: userStats.xp + lesson.rewardXp,
                  coins: userStats.coins + lesson.rewardCoins + bonus,
                  activityByDay: mergeActivityPoints(45),
              });
              window.__mullerPlaySfx && window.__mullerPlaySfx('complete');
              setCelebrationModal({
                  title: '∂≠Lo lograste!',
                  subtitle: lesson.title,
                  xp: lesson.rewardXp,
                  coins: lesson.rewardCoins + bonus,
                  milestone: bonus > 0,
              });
              setRutaRun(null);
              setRutaFillInput(''); setRutaTranscript(''); setRutaSpeakErr('');
          };

      // ========== NUEVO TEST ADAPTATIVO (30 PREGUNTAS) ==========
const startPlacementTest = () => {
  const initialQuestions = selectQuestionsForLevel('A2', 5);
  setPlacementQuestions(initialQuestions);
  setPlacementAnswers(new Array(initialQuestions.length).fill(null));
  setPlacementIndex(0);
  setPlacementLevel('A2');
  setPlacementScore({ correct: 0, total: 0 });
  setPlacementFinished(false);
};

const selectQuestionsForLevel = (level, count) => {
  const allQuestions = window.MULLER_PLACEMENT_QUESTIONS || [];
  const levelQuestions = allQuestions.filter(q => q.level === level);
  const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, levelQuestions.length));
};

const handlePlacementAnswer = (selectedOpt) => {
  const currentQ = placementQuestions[placementIndex];
  if (!currentQ) return;
  
  const isCorrect = (selectedOpt === currentQ.ok);
  
  // Actualizar respuestas
  const newAnswers = [...placementAnswers];
  newAnswers[placementIndex] = selectedOpt;
  setPlacementAnswers(newAnswers);
  
  // Actualizar puntuaci«¸n del nivel actual
  const newScore = {
    correct: placementScore.correct + (isCorrect ? 1 : 0),
    total: placementScore.total + 1
  };
  setPlacementScore(newScore);
  
  // Reproducir sonido de acierto/fallo
  if (window.__mullerNotifyExerciseOutcome) {
    window.__mullerNotifyExerciseOutcome(isCorrect);
  }
  
  // L«¸gica adaptativa
  const performanceRatio = newScore.correct / newScore.total;
  let nextLevel = placementLevel;
  let shouldFinish = false;
  
  if (newScore.total >= 5) {
    if (performanceRatio >= 0.7) {
      // Buen rendimiento: subir de nivel
      if (placementLevel === 'A1') nextLevel = 'A2';
      else if (placementLevel === 'A2') nextLevel = 'B1';
      else if (placementLevel === 'B1') nextLevel = 'B2';
      else if (placementLevel === 'B2') shouldFinish = true;
    } else if (performanceRatio <= 0.3) {
      // Mal rendimiento: bajar de nivel
      if (placementLevel === 'B2') nextLevel = 'B1';
      else if (placementLevel === 'B1') nextLevel = 'A2';
      else if (placementLevel === 'A2') nextLevel = 'A1';
      else if (placementLevel === 'A1') shouldFinish = true;
    } else {
      // Rendimiento intermedio: continuar mismo nivel
      if (newScore.total >= 8) shouldFinish = true;
    }
  }
  
  // Si no hay m«≠s preguntas del nivel, finalizar
  if (placementIndex >= placementQuestions.length - 1) {
    shouldFinish = true;
  }
  
  if (shouldFinish) {
    const recommendedLevel = calculateRecommendedLevel();
    finishPlacementWithLevel(recommendedLevel);
    return;
  }
  
  if (nextLevel !== placementLevel) {
    // Cambiar de nivel
    const newQuestions = selectQuestionsForLevel(nextLevel, 5);
    setPlacementQuestions(newQuestions);
    setPlacementAnswers(new Array(newQuestions.length).fill(null));
    setPlacementIndex(0);
    setPlacementLevel(nextLevel);
    setPlacementScore({ correct: 0, total: 0 });
  } else {
    // Siguiente pregunta mismo nivel
    setPlacementIndex(placementIndex + 1);
  }
};

const calculateRecommendedLevel = () => {
  const ratio = placementScore.total > 0 ? placementScore.correct / placementScore.total : 0;
  if (placementLevel === 'A1' && ratio >= 0.6) return 'A2';
  if (placementLevel === 'A2' && ratio >= 0.6) return 'B1';
  if (placementLevel === 'B1' && ratio >= 0.6) return 'B2';
  return placementLevel;
};

const finishPlacementWithLevel = (finalLevel) => {
  const levelIndexMap = { 'A1': 0, 'A2': 1, 'B1': 2, 'B2': 3 };
  const suggestedIdx = levelIndexMap[finalLevel] || 0;
  
  const next = { ...rutaProgress, placementDone: true, suggestedLevelIdx: suggestedIdx };
  if (typeof window.mullerRutaSave === 'function') window.mullerRutaSave(next);
  setRutaProgress(next);
  setRutaSubTab('camino');
  
  if (window.__mullerPlaySfx) window.__mullerPlaySfx('levelup');
  
  setCelebrationModal({
    title: 'Test de nivel completado',
    subtitle: `Nivel recomendado: ${finalLevel}`,
    xp: 0,
    coins: 20,
    milestone: false,
    placement: true
  });
  
  saveProgress({
    coins: userStats.coins + 20,
    activityByDay: mergeActivityPoints(25)
  });
  
  // Resetear test
  setPlacementQuestions([]);
  setPlacementAnswers([]);
  setPlacementIndex(0);
  setPlacementFinished(false);
};

// ========== FIN NUEVO TEST ADAPTATIVO ==========

          const checkRutaFillAnswer = (lesson) => {
              if (!lesson || !lesson.fill) return false;
              const got = (rutaFillInput || '').trim().toLowerCase().replace(/\s+/g, ' ');
              const exp = String(lesson.fill.answer || '').trim().toLowerCase();
              if (got === exp) { window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true); setRutaSpeakErr(''); return true; }
              window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false);
              setRutaSpeakErr(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Sigue practicando.');
              return false;
          };

          const checkRutaSpeakAnswer = (target) => {
              const a = normalizeGermanSpeechText(rutaTranscript || '');
              const b = normalizeGermanSpeechText(target || '');
              if (!a || !b) { setRutaSpeakErr('Graba de nuevo con el micr«¸fono.'); return false; }
              const dist = levenshteinDistance(a, b);
              const tol = Math.max(2, Math.floor(b.length / 5));
              if (a === b || dist <= tol) { window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true); setRutaSpeakErr(''); return true; }
              window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false);
              setRutaSpeakErr(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Casi É?" prueba otra vez.');
              return false;
          };

          const runSingleSubmitAction = useCallback((actionKey, actionFn) => {
              const now = Date.now();
              const lastTs = submitKeyLockRef.current[actionKey] || 0;
              if (now - lastTs < 350) return;
              submitKeyLockRef.current[actionKey] = now;
              actionFn();
          }, []);

          const handleExerciseEnterSubmit = useCallback((e, actionKey, actionFn, opts = {}) => {
              const { requireCtrlOrMeta = false } = opts;
              if (e.key !== 'Enter') return;
              if (e.repeat) {
                  e.preventDefault();
                  return;
              }
              if (requireCtrlOrMeta) {
                  if (!(e.ctrlKey || e.metaKey)) return;
              } else if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) {
                  return;
              }
              e.preventDefault();
              runSingleSubmitAction(actionKey, actionFn);
          }, [runSingleSubmitAction]);

          const handlePuzzleCheck = useCallback(() => {
              const raw = (guionData[getActualSceneIndex()]?.text || '').trim();
              const norm = (s) => String(s || '').toLowerCase().replace(/[.,!?;:É?›]/g, ' ').replace(/\s+/g, ' ').trim();
              const target = norm(raw.split(/\s+/).filter(Boolean).join(' '));
              const built = norm(puzzleAnswer.map((w) => w.text).join(' '));
              const ok = !!target && built === target;
              if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(ok);
              setPuzzleLastOk(ok);
              setShowPuzzleResult(true);
          }, [guionData, getActualSceneIndex, puzzleAnswer]);

          const handleOralNextQuestion = useCallback(() => {
              setOralQIdx((i) => (i + 1) % MULLER_ORAL_B1_QUESTIONS.length);
              setSpokenText('');
              setOralDeadline(Date.now() + oralSecs * 1000);
              setOralClock(0);
          }, [oralSecs]);

          useEffect(() => {
              if (!(mode === 'dialogue' && puzzleMode)) return;
              const onKey = (e) => {
                  if (showPuzzleResult) {
                      handleExerciseEnterSubmit(e, 'puzzle-next', handleNext);
                      return;
                  }
                  if (puzzleWords.length === 0) {
                      handleExerciseEnterSubmit(e, 'puzzle-check', handlePuzzleCheck);
                  }
              };
              window.addEventListener('keydown', onKey);
              return () => window.removeEventListener('keydown', onKey);
          }, [mode, puzzleMode, showPuzzleResult, puzzleWords.length, handleExerciseEnterSubmit, handlePuzzleCheck, handleNext]);

          useEffect(() => {
              if (!(mode === 'dialogue' && diktatMode && showDiktatResult)) return;
              const onKey = (e) => handleExerciseEnterSubmit(e, 'diktat-next', handleNext);
              window.addEventListener('keydown', onKey);
              return () => window.removeEventListener('keydown', onKey);
          }, [mode, diktatMode, showDiktatResult, handleExerciseEnterSubmit, handleNext]);

          useEffect(() => {
              if (activeTab !== 'ruta') return;
              if (!rutaRun || (rutaRun.step || 0) !== 2) return;
              const lv = (window.RUTA_LEVELS || [])[rutaRun.levelIdx];
              const lesson = lv && lv.lessons && lv.lessons[rutaRun.lessonIdx];
              if (!lesson || !lesson.speak || !lesson.speak.target) return;
              const onKey = (e) => {
                  if (rutaListening) return;
                  handleExerciseEnterSubmit(e, 'ruta-speak-validate', () => {
                      if (checkRutaSpeakAnswer(lesson.speak.target)) completeRutaLesson(rutaRun.levelIdx, rutaRun.lessonIdx);
                  });
              };
              window.addEventListener('keydown', onKey);
              return () => window.removeEventListener('keydown', onKey);
          }, [activeTab, rutaRun, rutaListening, handleExerciseEnterSubmit, checkRutaSpeakAnswer, completeRutaLesson]);

          useEffect(() => {
              if (mode !== 'interview' || !spokenText) return;
              const onKey = (e) => handleExerciseEnterSubmit(e, 'oral-next-question', handleOralNextQuestion);
              window.addEventListener('keydown', onKey);
              return () => window.removeEventListener('keydown', onKey);
          }, [mode, spokenText, handleExerciseEnterSubmit, handleOralNextQuestion]);

          useEffect(() => {
              if (mode !== 'dialogue') return;
              if (podcastMode || puzzleMode || diktatMode || isPlaying) return;
              if (!(lueckentextMode || artikelSniperMode || declinaMode || tempusMode || blindMode)) return;
              if (showTutor || showGrammarPrompt) return;
              const onKey = (e) => {
                  const activeEl = document && document.activeElement;
                  const tag = activeEl && activeEl.tagName ? String(activeEl.tagName).toLowerCase() : '';
                  const isTypingField = !!(activeEl && (activeEl.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select'));
                  if (isTypingField) return;
                  handleExerciseEnterSubmit(e, 'dialogue-mode-next', handleNext);
              };
              window.addEventListener('keydown', onKey);
              return () => window.removeEventListener('keydown', onKey);
          }, [mode, podcastMode, puzzleMode, diktatMode, isPlaying, lueckentextMode, artikelSniperMode, declinaMode, tempusMode, blindMode, showTutor, showGrammarPrompt, handleExerciseEnterSubmit, handleNext]);

          const loadPdfStudyFile = useCallback(async (file) => {
              if (!file) return;
              const pdfReady = await mullerEnsurePdfJsLoaded().catch(() => false);
              if (!pdfReady || !window.pdfjsLib || typeof window.pdfjsLib.getDocument !== 'function') {
                  setPdfStudyErr('PDF no disponible en este navegador.');
                  return;
              }
              try {
                  const nextUrl = URL.createObjectURL(file);
                  setPdfStudyBlobUrl((prev) => {
                      if (prev) {
                          try { URL.revokeObjectURL(prev); } catch (e) {}
                      }
                      return nextUrl;
                  });
              } catch (e) {
                  setPdfStudyBlobUrl('');
              }
              setPdfStudyExtracting(true);
              setPdfStudyErr('');
              setPdfStudyBusyMsg('Leyendo PDFÉ?›');
              setPdfSessionBufferOk(false);
              pdfStudyBufferRef.current = null;
              pdfStudyDocHandleRef.current = null;
              try {
                  window.pdfjsLib.GlobalWorkerOptions.workerSrc = MULLER_PDFJS_WORKER_URL;
                  const buffer = await file.arrayBuffer();
                  pdfStudyBufferRef.current = buffer;
                  setPdfSessionBufferOk(true);
                  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
                  pdfStudyDocHandleRef.current = pdf;
                  const totalPages = Math.max(1, Number(pdf.numPages) || 1);
                  const pages = [];
                  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                      setPdfStudyBusyMsg(`Extrayendo p«≠gina ${pageNum}/${totalPages}É?›`);
                      let text = '';
                      try {
                          const pg = await pdf.getPage(pageNum);
                          const tc = await pg.getTextContent();
                          const raw = (tc.items || []).map((it) => String((it && it.str) || '')).join(' ');
                          text = mullerPdfCleanText(raw);
                      } catch (err) {}
                      const firstSlice = text.slice(0, 400);
                      const meta = mullerPdfGuessUnitLesson(firstSlice);
                      pages.push({
                          page: pageNum,
                          unit: meta.unit,
                          lesson: meta.lesson,
                          text: text.slice(0, MULLER_PDF_STORED_TEXT_MAX),
                          ocrPending: !text
                      });
                      if ((pageNum % MULLER_PDF_EXTRACT_YIELD_EVERY) === 0) {
                          await new Promise((resolve) => setTimeout(resolve, 0));
                      }
                  }
                  const compactPages = pages.slice(0, MULLER_PDF_STORED_PAGES_MAX);
                  const payload = {
                      id: `pdf-${Date.now()}`,
                      name: file.name || 'Libro PDF',
                      size: file.size || 0,
                      totalPages,
                      pages: compactPages,
                      importedAt: new Date().toISOString()
                  };
                  setPdfStudyDoc(payload);
                  setPdfStudyPageIdx(0);
                  try { localStorage.setItem(MULLER_PDF_STUDY_STORAGE_KEY, JSON.stringify(payload)); } catch (e) {}
                  const extractedCount = compactPages.filter((p) => p.text).length;
                  setPdfStudyBusyMsg(`PDF listo: ${extractedCount}/${compactPages.length} p«≠ginas con texto.`);
              } catch (err) {
                  setPdfStudyErr(err && err.message ? err.message : 'No se pudo leer el PDF.');
              } finally {
                  setPdfStudyExtracting(false);
              }
          }, []);

          const runPdfPageOcr = useCallback(async (pageNumber) => {
              if (!pdfStudyDoc) return;
              const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
              const pages = Array.isArray(pdfStudyDoc.pages) ? pdfStudyDoc.pages : [];
              const page = pages[idx];
              if (!page) return;
              if (page.text && page.text.length >= 40) {
                  setPdfStudyBusyMsg('Esta p«≠gina ya tiene texto; OCR no es necesario.');
                  return;
              }
              const ocrReady = await mullerEnsureTesseractLoaded().catch(() => false);
              if (!ocrReady || typeof Tesseract === 'undefined') {
                  setPdfStudyErr('No se pudo cargar OCR (Tesseract).');
                  return;
              }
              const pdfReady = await mullerEnsurePdfJsLoaded().catch(() => false);
              if (!pdfReady || !window.pdfjsLib || typeof window.pdfjsLib.getDocument !== 'function') {
                  setPdfStudyErr('OCR PDF no disponible en este navegador.');
                  return;
              }
              if (!pdfStudyBufferRef.current && !pdfStudyDocHandleRef.current) {
                  setPdfStudyErr('Para OCR real de p«≠gina, vuelve a subir el PDF en esta sesi«¸n.');
                  setPdfStudyBusyMsg('OCR no disponible: falta el PDF en memoria.');
                  return;
              }
              setPdfStudyOcrBusy(true);
              let worker = null;
              let attemptNo = 0;
              const attemptCap = 1 + Math.max(0, Number(MULLER_PDF_OCR_RETRY_MAX) || 0);
              try {
                  setPdfStudyErr('');
                  const safePage = Math.max(1, Number(page.page || pageNumber) || 1);
                  while (attemptNo < attemptCap) {
                      try {
                          setPdfStudyBusyMsg(`Preparando OCR p«≠gina ${safePage}${attemptNo > 0 ? ` (reintento ${attemptNo}/${attemptCap - 1})` : ''}É?›`);
                          window.pdfjsLib.GlobalWorkerOptions.workerSrc = MULLER_PDFJS_WORKER_URL;
                          let pdf = pdfStudyDocHandleRef.current;
                          if (!pdf) {
                              pdf = await window.pdfjsLib.getDocument({ data: pdfStudyBufferRef.current }).promise;
                              pdfStudyDocHandleRef.current = pdf;
                          }
                          const pg = await pdf.getPage(safePage);
                          let ocrText = '';
                          const scales = [1.6, 2.1];
                          for (let attempt = 0; attempt < scales.length; attempt++) {
                              const scale = scales[attempt];
                              const viewport = pg.getViewport({ scale });
                              const canvas = document.createElement('canvas');
                              canvas.width = Math.max(1, Math.floor(viewport.width));
                              canvas.height = Math.max(1, Math.floor(viewport.height));
                              const ctx = canvas.getContext('2d');
                              if (!ctx) throw new Error('No se pudo crear el contexto de imagen para OCR.');
                              await pg.render({ canvasContext: ctx, viewport }).promise;
                              setPdfStudyBusyMsg(`OCR p«≠gina ${safePage}: intento ${attempt + 1}/${scales.length}${attemptNo > 0 ? ` ∂˙ retry ${attemptNo}` : ''}É?›`);
                              worker = await Tesseract.createWorker('deu', 1, {
                                  logger: (m) => {
                                      if (m && m.status === 'recognizing text' && typeof m.progress === 'number') {
                                          setPdfStudyBusyMsg(`OCR p«≠gina ${safePage}: ${Math.round(100 * m.progress)}%`);
                                      }
                                  }
                              });
                              const result = await worker.recognize(canvas);
                              await worker.terminate();
                              worker = null;
                              const raw = result && result.data ? result.data.text : '';
                              ocrText = mullerPdfCleanText(raw);
                              if (ocrText.length >= 24 || attempt === scales.length - 1) break;
                          }
                          if (!ocrText) {
                              setPdfStudyErr('OCR sin texto. Prueba una p«≠gina m«≠s n«tida o con m«≠s contraste.');
                              setPdfStudyBusyMsg(`OCR p«≠gina ${safePage}: sin texto detectado.`);
                              return;
                          }
                          const meta = mullerPdfGuessUnitLesson(ocrText.slice(0, 400));
                          const nextPages = pages.map((p, pIdx) => {
                              if (pIdx !== idx) return p;
                              return {
                                  ...p,
                                  unit: p.unit || meta.unit,
                                  lesson: p.lesson || meta.lesson,
                                  text: ocrText.slice(0, MULLER_PDF_STORED_TEXT_MAX),
                                  ocrPending: false,
                                  ocrUpdatedAt: new Date().toISOString()
                              };
                          });
                          const nextDoc = { ...pdfStudyDoc, pages: nextPages, updatedAt: new Date().toISOString() };
                          setPdfStudyDoc(nextDoc);
                          try { localStorage.setItem(MULLER_PDF_STUDY_STORAGE_KEY, JSON.stringify(nextDoc)); } catch (e) {}
                          setPdfStudyBusyMsg(`OCR completado en p«≠gina ${safePage}.`);
                          return;
                      } catch (attemptErr) {
                          if (worker) {
                              try { await worker.terminate(); } catch (e) {}
                              worker = null;
                          }
                          attemptNo += 1;
                          if (attemptNo >= attemptCap) throw attemptErr;
                          setPdfStudyBusyMsg(`OCR p«≠gina ${safePage}: error temporal, reintentandoÉ?›`);
                          await new Promise((resolve) => setTimeout(resolve, 220));
                      }
                  }
              } catch (err) {
                  setPdfStudyErr(err && err.message ? err.message : 'Error al ejecutar OCR de p«≠gina.');
              } finally {
                  if (worker) {
                      try { await worker.terminate(); } catch (e) {}
                  }
                  setPdfStudyOcrBusy(false);
              }
          }, [pdfStudyDoc]);

          const applyPdfStudyTextToReading = useCallback((pageNumber) => {
              if (!pdfStudyDoc) return;
              const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
              const page = pdfStudyDoc.pages && pdfStudyDoc.pages[idx];
              const txt = page && page.text ? String(page.text).trim() : '';
              if (!txt) {
                  setPdfStudyErr('P«≠gina sin texto extra«do todav«a.');
                  return;
              }
              setReadingSource('paste');
              setReadingTextInput(txt);
              setReadingPasteFromPdf(true);
              setReadingPasteReaderOpen(true);
              setPdfStudyBusyMsg(`P«≠gina ${page.page} enviada a Lectura.`);
              setPdfStudyLastApplied(`Éo" P«≠gina ${page.page} cargada en Lectura`);
          }, [pdfStudyDoc]);

          const clearPdfStudyTextFromReading = useCallback(() => {
              setReadingTextInput('');
              setReadingSource('current_story');
              setReadingPasteFromPdf(false);
              setReadingPasteReaderOpen(false);
              setReadingSelectedSnippet('');
              setReadingWordInfo(null);
              setPdfStudyBusyMsg('Texto quitado de Lectura. Vuelves al guion actual.');
              setPdfStudyLastApplied('Éo" Lectura restaurada al guion actual');
          }, []);

          const applyPdfStudyTextToWriting = useCallback((pageNumber) => {
              if (!pdfStudyDoc) return;
              const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
              const page = pdfStudyDoc.pages && pdfStudyDoc.pages[idx];
              const txt = page && page.text ? String(page.text).trim() : '';
              if (!txt) {
                  setPdfStudyErr('P«≠gina sin texto extra«do todav«a.');
                  return;
              }
              setActiveTab('escritura');
              setWritingMode('telc');
              setWritingTelcInputMode('keyboard');
              setWritingTelcTypedText(txt);
              setPdfStudyBusyMsg(`P«≠gina ${page.page} enviada a Escritura TELC.`);
              setPdfStudyLastApplied(`Éo" P«≠gina ${page.page} cargada en Escritura TELC`);
          }, [pdfStudyDoc]);

          const runPdfDidacticAnalysis = useCallback((pageNumber) => {
              if (!pdfStudyDoc) return;
              const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
              const page = pdfStudyDoc.pages && pdfStudyDoc.pages[idx];
              const txt = page && page.text ? String(page.text).trim() : '';
              if (!txt || txt.length < 40) {
                  setPdfStudyBusyMsg('No hay texto suficiente en esta p«≠gina. Ejecuta OCR o elige otra.');
                  return;
              }
              const normalized = txt.replace(/\s+/g, ' ').trim();
              const sentenceCandidates = normalized
                  .split(/(?<=[.!?])\s+/)
                  .map((s) => s.trim())
                  .filter((s) => s.length >= 28 && s.length <= 180);
              const phrases = Array.from(new Set(sentenceCandidates)).slice(0, 8);
              const words = (normalized.toLowerCase().match(/[a-z«œ«Ù«¨«Y]{4,}/g) || [])
                  .filter((w) => !MULLER_PDF_DIDACTIC_STOPWORDS.has(w));
              const freq = {};
              words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
              const keywords = Object.entries(freq)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 16)
                  .map(([de, count]) => ({ de, es: '', count }));
              const gaps = phrases.slice(0, 6).map((p, i) => {
                  const tokens = p.match(/[A-Za-z«"«-«o«œ«Ù«¨«Y]{4,}/g) || [];
                  let answer = '';
                  for (let t = tokens.length - 1; t >= 0; t--) {
                      const candidate = String(tokens[t] || '').toLowerCase();
                      if (candidate && !MULLER_PDF_DIDACTIC_STOPWORDS.has(candidate)) { answer = candidate; break; }
                  }
                  if (!answer && tokens[0]) answer = String(tokens[0]).toLowerCase();
                  const prompt = answer ? p.replace(new RegExp(`\\b${answer}\\b`, 'i'), '_____') : p;
                  return { id: `gap-${i + 1}`, prompt, answer };
              });
              const compQuestions = phrases.slice(0, 4).map((p, i) => ({
                  id: `comp-${i + 1}`,
                  q: `∂®Qu«∏ idea principal expresa esta frase ${i + 1}?`,
                  context: p
              }));
              const pack = {
                  id: `pdf-did-${Date.now()}`,
                  sourceDocId: pdfStudyDoc.id || '',
                  sourceDocName: pdfStudyDoc.name || 'Libro PDF',
                  page: page.page || (idx + 1),
                  unit: page.unit || '',
                  lesson: page.lesson || '',
                  createdAt: new Date().toISOString(),
                  keywords,
                  phrases,
                  exercises: {
                      gaps,
                      dictation: phrases.slice(0, 5),
                      comprehension: compQuestions,
                      miniTelc: phrases.slice(0, 3)
                  }
              };
              setPdfDidacticPack(pack);
              setPdfStudyBusyMsg(`An«≠lisis did«≠ctico listo (p«≠gina ${pack.page}): ${pack.keywords.length} palabras clave y ${pack.phrases.length} frases.`);
          }, [pdfStudyDoc]);

          const savePdfDidacticPack = useCallback(() => {
              if (!pdfDidacticPack) return;
              setPdfDidacticPackLibrary((prev) => {
                  const arr = Array.isArray(prev) ? prev : [];
                  const key = `${pdfDidacticPack.sourceDocId || ''}::${pdfDidacticPack.page || 1}`;
                  const tagged = { ...pdfDidacticPack, _libraryKey: key, savedAt: new Date().toISOString() };
                  const withoutSame = arr.filter((p) => String((p && p._libraryKey) || '') !== key);
                  const next = [tagged, ...withoutSame].slice(0, 60);
                  try { localStorage.setItem(MULLER_PDF_DIDACTIC_LIBRARY_KEY, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
              setPdfStudyBusyMsg(`Pack did«≠ctico guardado (p«≠gina ${pdfDidacticPack.page}).`);
          }, [pdfDidacticPack]);

          const loadPdfDidacticPackFromLibrary = useCallback((libraryKey) => {
              const arr = Array.isArray(pdfDidacticPackLibrary) ? pdfDidacticPackLibrary : [];
              const hit = arr.find((p) => String((p && p._libraryKey) || '') === String(libraryKey || ''));
              if (!hit) return;
              setPdfDidacticPack(hit);
              setPdfStudyBusyMsg(`Pack did«≠ctico cargado: p${hit.page || '-'}.`);
          }, [pdfDidacticPackLibrary]);

          const removePdfDidacticPackFromLibrary = useCallback((libraryKey) => {
              setPdfDidacticPackLibrary((prev) => {
                  const arr = Array.isArray(prev) ? prev : [];
                  const next = arr.filter((p) => String((p && p._libraryKey) || '') !== String(libraryKey || ''));
                  try { localStorage.setItem(MULLER_PDF_DIDACTIC_LIBRARY_KEY, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
          }, []);

          const clearPdfDidacticPackLibrary = useCallback(() => {
              setPdfDidacticPackLibrary([]);
              try { localStorage.setItem(MULLER_PDF_DIDACTIC_LIBRARY_KEY, JSON.stringify([])); } catch (e) {}
              setPdfStudyBusyMsg('Biblioteca de packs did«≠cticos vaciada.');
          }, []);

          const exportAllPdfCoachData = useCallback(() => {
              const payload = {
                  type: 'muller_pdf_coach_full_export_v1',
                  exportedAt: new Date().toISOString(),
                  didacticPacks: Array.isArray(pdfDidacticPackLibrary) ? pdfDidacticPackLibrary : [],
                  coachStats: rutaPdfCoachStats && typeof rutaPdfCoachStats === 'object' ? rutaPdfCoachStats : {}
              };
              const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `pdf_coach_full_${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
          }, [pdfDidacticPackLibrary, rutaPdfCoachStats]);

          const importAllPdfCoachData = useCallback((file) => {
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                  try {
                      const parsed = JSON.parse(String(ev && ev.target && ev.target.result ? ev.target.result : '{}'));
                      if (!parsed || parsed.type !== 'muller_pdf_coach_full_export_v1') {
                          setPdfStudyErr('Archivo completo de PDF Coach no v«≠lido.');
                          return;
                      }
                      const packs = Array.isArray(parsed.didacticPacks) ? parsed.didacticPacks : [];
                      const stats = parsed.coachStats && typeof parsed.coachStats === 'object' ? parsed.coachStats : {};
                      setPdfDidacticPackLibrary(packs);
                      setRutaPdfCoachStats(stats);
                      try { localStorage.setItem(MULLER_PDF_DIDACTIC_LIBRARY_KEY, JSON.stringify(packs)); } catch (e) {}
                      try { localStorage.setItem(MULLER_PDF_COACH_STATS_KEY, JSON.stringify(stats)); } catch (e) {}
                      setPdfStudyBusyMsg(`Importaci«¸n completa PDF Coach: ${packs.length} packs.`);
                  } catch (err) {
                      setPdfStudyErr('No se pudo importar el backup completo de PDF Coach.');
                  }
              };
              reader.readAsText(file);
          }, []);

          const sendPdfDidacticToVocab = useCallback(() => {
              if (!pdfDidacticPack || !pdfDidacticPack.keywords || pdfDidacticPack.keywords.length === 0) return;
              const lessonTitle = `PDF U${pdfDidacticPack.unit || '-'} L${pdfDidacticPack.lesson || '-'} ∂˙ p${pdfDidacticPack.page}`;
              const words = pdfDidacticPack.keywords.slice(0, 20).map((k) => ({ de: k.de, es: k.es || '(pendiente de traducci«¸n)', diff: 0 }));
              setCustomVocabLessons((prev) => {
                  const arr = Array.isArray(prev) ? prev : [];
                  const hitIdx = arr.findIndex((l) => l && l.title === lessonTitle);
                  let next;
                  if (hitIdx >= 0) {
                      const existing = arr[hitIdx];
                      const seen = new Set((existing.words || []).map((w) => `${w.de}||${w.es}`));
                      const mergedWords = [...(existing.words || [])];
                      words.forEach((w) => {
                          const key = `${w.de}||${w.es}`;
                          if (!seen.has(key)) { seen.add(key); mergedWords.push(w); }
                      });
                      next = arr.map((l, i) => i === hitIdx ? { ...l, words: mergedWords } : l);
                  } else {
                      next = [{ id: `pdfvocab-${Date.now()}`, title: lessonTitle, words }, ...arr];
                  }
                  try { localStorage.setItem('mullerCustomVocab', JSON.stringify(next)); } catch (e) {}
                  return next;
              });
              setPdfStudyLastApplied(`Éo" Did«≠ctica PDF enviada a Vocabulario (${words.length} t«∏rminos).`);
              setPdfStudyBusyMsg('Bloque PDF a«Òadido a Vocabulario.');
          }, [pdfDidacticPack]);

          const sendPdfDidacticToBx = useCallback((targetLevel = 'auto') => {
              if (!pdfDidacticPack) return;
              const lines = [
                  ...(pdfDidacticPack.phrases || []),
                  ...((pdfDidacticPack.keywords || []).slice(0, 12).map((k) => k.de))
              ].filter(Boolean);
              if (!lines.length) return;
              const flat = mullerBibliotecaFlatItems(lines.join('\n'));
              if (!flat.length) return;
              let added = 0;
              setBxUserOverlay((prev) => {
                  const base = normalizeBxPayload(prev);
                  flat.forEach(({ cat, item, seg }) => {
                      const lv = targetLevel === 'auto' ? mullerGuessBibliotecaItemLevel(item, seg) : targetLevel;
                      const key = mullerBxItemKey(item);
                      if ((base[lv][cat] || []).some((x) => mullerBxItemKey(x) === key)) return;
                      base[lv][cat].push({
                          ...item,
                          trick: `PDF did«≠ctico ∂˙ p${pdfDidacticPack.page} ∂˙ ${cat}`,
                          _mullerUser: true,
                          _mullerUid: 'bx_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 11),
                          _mullerCategory: cat
                      });
                      added++;
                  });
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
              setBxImportSummary(`PDF p«≠gina ${pdfDidacticPack.page} enviado a B1/B2 ∂˙ nuevas tarjetas: ${added}`);
              setPdfStudyLastApplied(`Éo" PDF did«≠ctico enviado a Banco B1/B2 (${added}).`);
          }, [pdfDidacticPack]);

          const sendPdfDidacticToRuta = useCallback(() => {
              if (!pdfDidacticPack) return;
              setRutaPdfPack(pdfDidacticPack);
              setRutaPdfGapIdx(0);
              setRutaPdfGapInput('');
              setRutaPdfFeedback('');
              setRutaPdfCoachStats((prev) => {
                  const base = prev && typeof prev === 'object' ? prev : {};
                  const key = String(pdfDidacticPack.id || '');
                  if (!key) return base;
                  const existing = base[key];
                  if (existing) return base;
                  const next = {
                      ...base,
                      [key]: {
                          packId: key,
                          docName: pdfDidacticPack.sourceDocName || 'Libro PDF',
                          page: pdfDidacticPack.page || 1,
                          attempts: 0,
                          correct: 0,
                          errorWords: {},
                          srs: (pdfDidacticPack.keywords || []).slice(0, 14).map((k, i) => ({ de: k.de, box: 1, dueAt: Date.now() + (i % 4) * 3600000 })),
                          updatedAt: new Date().toISOString()
                      }
                  };
                  try { localStorage.setItem(MULLER_PDF_COACH_STATS_KEY, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
              setRutaSubTab('pdf');
              setActiveTab('ruta');
              setPdfStudyLastApplied(`Éo" PDF did«≠ctico enviado a Ruta (p«≠gina ${pdfDidacticPack.page}).`);
          }, [pdfDidacticPack]);

          const checkRutaPdfGap = useCallback(() => {
              if (!rutaPdfPack || !rutaPdfPack.exercises || !Array.isArray(rutaPdfPack.exercises.gaps) || !rutaPdfPack.exercises.gaps.length) return;
              const current = rutaPdfPack.exercises.gaps[Math.max(0, Math.min(rutaPdfPack.exercises.gaps.length - 1, rutaPdfGapIdx))];
              if (!current) return;
              const got = String(rutaPdfGapInput || '').trim().toLowerCase();
              const exp = String(current.answer || '').trim().toLowerCase();
              if (!exp) {
                  setRutaPdfFeedback('Respuesta abierta: compara con la frase original.');
                  return;
              }
              if (got === exp) {
                  setRutaPdfFeedback('Correcto.');
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true);
              } else {
                  setRutaPdfFeedback(`No exacto. Esperado: ${exp}`);
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false);
              }
              const packId = String(rutaPdfPack.id || '');
              if (!packId) return;
              setRutaPdfCoachStats((prev) => {
                  const base = prev && typeof prev === 'object' ? prev : {};
                  const currentStats = base[packId] && typeof base[packId] === 'object' ? base[packId] : { attempts: 0, correct: 0, errorWords: {}, srs: [] };
                  const nextErrorWords = { ...(currentStats.errorWords || {}) };
                  if (got !== exp && exp) nextErrorWords[exp] = (nextErrorWords[exp] || 0) + 1;
                  const nextSrs = Array.isArray(currentStats.srs) ? currentStats.srs.map((card) => {
                      if (!card || String(card.de || '').toLowerCase() !== exp) return card;
                      const isOk = got === exp;
                      const nextBox = isOk ? Math.min(5, (Number(card.box) || 1) + 1) : 1;
                      const nextDue = Date.now() + (isOk ? (nextBox * nextBox * 3600000) : 1800000);
                      return { ...card, box: nextBox, dueAt: nextDue };
                  }) : [];
                  const next = {
                      ...base,
                      [packId]: {
                          ...currentStats,
                          attempts: (Number(currentStats.attempts) || 0) + 1,
                          correct: (Number(currentStats.correct) || 0) + (got === exp ? 1 : 0),
                          errorWords: nextErrorWords,
                          srs: nextSrs,
                          updatedAt: new Date().toISOString()
                      }
                  };
                  try { localStorage.setItem(MULLER_PDF_COACH_STATS_KEY, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
          }, [rutaPdfPack, rutaPdfGapIdx, rutaPdfGapInput]);

          const exportRutaPdfCoachProgress = useCallback(() => {
              if (!rutaPdfPack) return;
              const key = String(rutaPdfPack.id || '');
              const stats = (rutaPdfCoachStats && key && rutaPdfCoachStats[key]) ? rutaPdfCoachStats[key] : null;
              const payload = {
                  type: 'muller_pdf_coach_export_v1',
                  exportedAt: new Date().toISOString(),
                  pack: rutaPdfPack,
                  stats: stats || {},
              };
              const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `pdf_coach_u${rutaPdfPack.unit || 'x'}_l${rutaPdfPack.lesson || 'x'}_p${rutaPdfPack.page || 1}.json`;
              a.click();
              URL.revokeObjectURL(url);
          }, [rutaPdfPack, rutaPdfCoachStats]);

          const importRutaPdfCoachProgress = useCallback((file) => {
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                  try {
                      const parsed = JSON.parse(String(ev && ev.target && ev.target.result ? ev.target.result : '{}'));
                      if (!parsed || parsed.type !== 'muller_pdf_coach_export_v1' || !parsed.pack) {
                          setRutaPdfFeedback('Archivo de progreso PDF no v«≠lido.');
                          return;
                      }
                      const importedPack = parsed.pack;
                      const importedStats = parsed.stats && typeof parsed.stats === 'object' ? parsed.stats : {};
                      setRutaPdfPack(importedPack);
                      setRutaPdfGapIdx(0);
                      setRutaPdfGapInput('');
                      setRutaPdfFeedback('Progreso PDF importado.');
                      setRutaSubTab('pdf');
                      setActiveTab('ruta');
                      const key = String(importedPack.id || '');
                      if (key) {
                          setRutaPdfCoachStats((prev) => {
                              const base = prev && typeof prev === 'object' ? prev : {};
                              const next = { ...base, [key]: importedStats };
                              try { localStorage.setItem(MULLER_PDF_COACH_STATS_KEY, JSON.stringify(next)); } catch (e) {}
                              return next;
                          });
                      }
                  } catch (err) {
                      setRutaPdfFeedback('No se pudo importar el progreso.');
                  }
              };
              reader.readAsText(file);
          }, []);

          const rateRutaPdfSrsCard = useCallback((word, quality) => {
              if (!rutaPdfPack || !word) return;
              const key = String(rutaPdfPack.id || '');
              if (!key) return;
              const qualitySafe = quality === 'easy' ? 'easy' : quality === 'hard' ? 'hard' : 'again';
              setRutaPdfCoachStats((prev) => {
                  const base = prev && typeof prev === 'object' ? prev : {};
                  const st = base[key] && typeof base[key] === 'object' ? base[key] : { srs: [] };
                  const now = Date.now();
                  const nextSrs = Array.isArray(st.srs) ? st.srs.map((c) => {
                      if (!c || String(c.de || '').toLowerCase() !== String(word).toLowerCase()) return c;
                      const currentBox = Math.max(1, Number(c.box) || 1);
                      const nextBox = qualitySafe === 'easy' ? Math.min(6, currentBox + 1) : qualitySafe === 'hard' ? currentBox : 1;
                      const nextDue = qualitySafe === 'easy' ? (now + nextBox * nextBox * 3600000) : qualitySafe === 'hard' ? (now + 2 * 3600000) : (now + 25 * 60000);
                      return { ...c, box: nextBox, dueAt: nextDue, updatedAt: new Date().toISOString() };
                  }) : [];
                  const next = { ...base, [key]: { ...st, srs: nextSrs, updatedAt: new Date().toISOString() } };
                  try { localStorage.setItem(MULLER_PDF_COACH_STATS_KEY, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
          }, [rutaPdfPack]);

          const sendRutaPdfMiniTelcToWriting = useCallback(() => {
              if (!rutaPdfPack || !rutaPdfPack.exercises) return;
              const lines = Array.isArray(rutaPdfPack.exercises.miniTelc) ? rutaPdfPack.exercises.miniTelc : [];
              const prompt = lines.slice(0, 3).join('\n');
              if (!prompt) {
                  setRutaPdfFeedback('No hay mini TELC disponible en este pack.');
                  return;
              }
              setActiveTab('escritura');
              setWritingMode('telc');
              setWritingTelcInputMode('keyboard');
              setWritingTelcTypedText(`Tema (PDF U${rutaPdfPack.unit || '-'} L${rutaPdfPack.lesson || '-'} p${rutaPdfPack.page || '-'})\n\n${prompt}\n\nMi respuesta:\n`);
              setRutaPdfFeedback('Mini TELC enviado a Escritura.');
          }, [rutaPdfPack]);

          const updatePdfStudyPageMeta = useCallback((pageNumber, patch = {}) => {
              if (!pdfStudyDoc) return;
              const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
              const pages = Array.isArray(pdfStudyDoc.pages) ? pdfStudyDoc.pages : [];
              const page = pages[idx];
              if (!page) return;
              const nextPages = pages.map((p, pIdx) => {
                  if (pIdx !== idx) return p;
                  return {
                      ...p,
                      unit: patch && typeof patch.unit === 'string' ? patch.unit.trim() : p.unit,
                      lesson: patch && typeof patch.lesson === 'string' ? patch.lesson.trim() : p.lesson
                  };
              });
              const nextDoc = { ...pdfStudyDoc, pages: nextPages, updatedAt: new Date().toISOString() };
              setPdfStudyDoc(nextDoc);
              try { localStorage.setItem(MULLER_PDF_STUDY_STORAGE_KEY, JSON.stringify(nextDoc)); } catch (e) {}
          }, [pdfStudyDoc]);

          const activePdfPageData = useMemo(() => {
              if (!pdfStudyDoc || !Array.isArray(pdfStudyDoc.pages) || !pdfStudyDoc.pages.length) return {};
              const idx = Math.max(0, Math.min(pdfStudyDoc.pages.length - 1, pdfStudyPageIdx));
              return pdfStudyDoc.pages[idx] || {};
          }, [pdfStudyDoc, pdfStudyPageIdx]);
          const activePdfNotesDocId = useMemo(() => {
              const id = pdfStudyDoc && pdfStudyDoc.id ? String(pdfStudyDoc.id) : '';
              if (id) return id;
              return MULLER_PDF_NOTES_LEGACY_DOC_ID;
          }, [pdfStudyDoc]);
          const activePdfPageNotes = useMemo(() => {
              const page = activePdfPageData && activePdfPageData.page ? Number(activePdfPageData.page) : 0;
              if (!page || !pdfStudyNotesByPage || typeof pdfStudyNotesByPage !== 'object') return { drawing: '', typed: '' };
              const notesByDoc = pdfStudyNotesByPage[activePdfNotesDocId] && typeof pdfStudyNotesByPage[activePdfNotesDocId] === 'object'
                  ? pdfStudyNotesByPage[activePdfNotesDocId]
                  : {};
              const legacyByDoc = pdfStudyNotesByPage[MULLER_PDF_NOTES_LEGACY_DOC_ID] && typeof pdfStudyNotesByPage[MULLER_PDF_NOTES_LEGACY_DOC_ID] === 'object'
                  ? pdfStudyNotesByPage[MULLER_PDF_NOTES_LEGACY_DOC_ID]
                  : {};
              const entry = notesByDoc[String(page)] || legacyByDoc[String(page)] || {};
              return {
                  drawing: typeof entry.drawing === 'string' ? entry.drawing : '',
                  typed: typeof entry.typed === 'string' ? entry.typed : ''
              };
          }, [activePdfPageData, pdfStudyNotesByPage, activePdfNotesDocId]);
          const pdfStudyCanvasPadKey = useMemo(() => {
              const basePage = Math.max(1, Number(activePdfPageData && activePdfPageData.page ? activePdfPageData.page : 1));
              const nonce = Math.max(0, Number(pdfStudyInkNonce) || 0);
              return (basePage * 1000) + nonce;
          }, [activePdfPageData, pdfStudyInkNonce]);

          const updatePdfPageNotes = useCallback((pageNumber, patch = {}) => {
              const safePage = Math.max(1, Number(pageNumber) || 1);
              setPdfStudyNotesByPage((prev) => {
                  const base = prev && typeof prev === 'object' ? prev : {};
                  const docId = activePdfNotesDocId;
                  const byDoc = base[docId] && typeof base[docId] === 'object' ? base[docId] : {};
                  const key = String(safePage);
                  const current = byDoc[key] && typeof byDoc[key] === 'object' ? byDoc[key] : {};
                  const next = {
                      ...base,
                      [docId]: {
                          ...byDoc,
                          [key]: {
                              ...current,
                              drawing: patch && typeof patch.drawing === 'string' ? patch.drawing : (typeof current.drawing === 'string' ? current.drawing : ''),
                              typed: patch && typeof patch.typed === 'string' ? patch.typed : (typeof current.typed === 'string' ? current.typed : ''),
                              updatedAt: new Date().toISOString()
                          }
                      }
                  };
                  try { localStorage.setItem(MULLER_PDF_NOTES_STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
          }, [activePdfNotesDocId]);
          const runPdfOcrBatch = useCallback(async () => {
              if (!pdfStudyDoc || pdfStudyOcrBusy || pdfStudyExtracting || pdfStudyOcrBatching) return;
              const pages = Array.isArray(pdfStudyDoc.pages) ? pdfStudyDoc.pages : [];
              if (!pages.length) return;
              const startPage = Math.max(1, Number(activePdfPageData.page) || 1);
              const fromCurrent = pages.filter((p) => Number(p.page) >= startPage);
              const wrap = [...fromCurrent, ...pages.filter((p) => Number(p.page) < startPage)];
              const targets = wrap
                  .filter((p) => p && Number(p.page) > 0 && (!p.text || String(p.text).trim().length < 40 || p.ocrPending))
                  .slice(0, 12)
                  .map((p) => Number(p.page));
              if (!targets.length) {
                  setPdfStudyBusyMsg('No hay p«≠ginas pendientes de OCR por lotes.');
                  return;
              }
              pdfStudyOcrAbortRef.current = false;
              setPdfStudyOcrBatching(true);
              try {
                  for (let i = 0; i < targets.length; i++) {
                      if (pdfStudyOcrAbortRef.current) {
                          setPdfStudyBusyMsg(`OCR por lotes detenido (${i}/${targets.length}).`);
                          break;
                      }
                      const pg = targets[i];
                      setPdfStudyBusyMsg(`OCR por lotes ${i + 1}/${targets.length} ∂˙ p«≠gina ${pg}É?›`);
                      await runPdfPageOcr(pg);
                      if (((i + 1) % 2) === 0) await new Promise((resolve) => setTimeout(resolve, 0));
                  }
                  if (!pdfStudyOcrAbortRef.current) setPdfStudyBusyMsg(`OCR por lotes completado (${targets.length} p«≠ginas).`);
              } finally {
                  setPdfStudyOcrBatching(false);
                  pdfStudyOcrAbortRef.current = false;
              }
          }, [pdfStudyDoc, pdfStudyOcrBusy, pdfStudyExtracting, pdfStudyOcrBatching, activePdfPageData, runPdfPageOcr]);
          const clearPdfStudyDoc = useCallback(() => {
              setPdfStudyFullscreen(false);
              setPdfStudyDoc(null);
              setPdfStudyPageIdx(0);
              setPdfStudyErr('');
              setPdfStudyBusyMsg('PDF eliminado del panel.');
              setPdfStudyLastApplied('');
              try { localStorage.removeItem(MULLER_PDF_STUDY_STORAGE_KEY); } catch (e) {}
              try {
                  setPdfStudyBlobUrl((prev) => {
                      if (prev) {
                          try { URL.revokeObjectURL(prev); } catch (e) {}
                      }
                      return '';
                  });
              } catch (e) {}
              setPdfSessionBufferOk(false);
              pdfStudyBufferRef.current = null;
              pdfStudyDocHandleRef.current = null;
              pdfStudyOcrAbortRef.current = true;
              setPdfStudyOcrBatching(false);
          }, []);

          const saveCurrentPdfStudyDoc = useCallback(() => {
              if (!pdfStudyDoc) return;
              const pagesCount = Array.isArray(pdfStudyDoc.pages) ? pdfStudyDoc.pages.length : 0;
              const entry = {
                  id: pdfStudyDoc.id || `pdf-${Date.now()}`,
                  name: pdfStudyDoc.name || 'Libro PDF',
                  importedAt: pdfStudyDoc.importedAt || new Date().toISOString(),
                  totalPages: pdfStudyDoc.totalPages || pagesCount,
                  updatedAt: new Date().toISOString(),
                  doc: pdfStudyDoc
              };
              setPdfStudySavedDocs((prev) => {
                  const arr = Array.isArray(prev) ? prev : [];
                  const withoutSame = arr.filter((x) => String(x.id || '') !== String(entry.id));
                  const next = [entry, ...withoutSame].slice(0, 20);
                  try { localStorage.setItem(MULLER_PDF_STUDY_LIBRARY_KEY, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
              setPdfStudyBusyMsg(`PDF guardado en biblioteca: ${entry.name}.`);
          }, [pdfStudyDoc]);

          const loadPdfStudyFromLibrary = useCallback((libraryId) => {
              const arr = Array.isArray(pdfStudySavedDocs) ? pdfStudySavedDocs : [];
              const hit = arr.find((x) => String(x.id || '') === String(libraryId));
              if (!hit || !hit.doc) return;
              setPdfStudyDoc(hit.doc);
              setPdfStudyPageIdx(0);
              setPdfStudyErr('');
              setPdfStudyLastApplied('');
              setPdfStudyBusyMsg(`PDF cargado desde biblioteca: ${hit.name || 'Libro PDF'}.`);
              setPdfSessionBufferOk(false);
              pdfStudyBufferRef.current = null;
              pdfStudyDocHandleRef.current = null;
              pdfStudyOcrAbortRef.current = true;
              setPdfStudyOcrBatching(false);
              try { localStorage.setItem(MULLER_PDF_STUDY_STORAGE_KEY, JSON.stringify(hit.doc)); } catch (e) {}
          }, [pdfStudySavedDocs]);

          const removePdfStudyFromLibrary = useCallback((libraryId) => {
              const id = String(libraryId || '');
              if (!id) return;
              setPdfStudySavedDocs((prev) => {
                  const arr = Array.isArray(prev) ? prev : [];
                  const next = arr.filter((x) => String((x && x.id) || '') !== id);
                  try { localStorage.setItem(MULLER_PDF_STUDY_LIBRARY_KEY, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
              setPdfStudyBusyMsg('PDF eliminado de la biblioteca.');
          }, []);

          const clearPdfStudyLibrary = useCallback(() => {
              setPdfStudySavedDocs([]);
              try { localStorage.setItem(MULLER_PDF_STUDY_LIBRARY_KEY, JSON.stringify([])); } catch (e) {}
              setPdfStudyBusyMsg('Biblioteca PDF vaciada.');
          }, []);

          const openPdfStudyFullscreen = useCallback((pageNumber) => {
              if (!pdfStudyDoc) return;
              const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
              setPdfStudyPageIdx(idx);
              setPdfStudyInkNonce(0);
              setPdfFsScrollPdf(false);
              setPdfOverlayZoom(1);
              setPdfOverlayTypedOpen(false);
              setPdfStudyFullscreen(true);
          }, [pdfStudyDoc]);
          const closePdfStudyFullscreen = useCallback(() => {
              setPdfStudyFullscreen(false);
              setPdfFsScrollPdf(false);
              setPdfOverlayBgUrl('');
              setPdfOverlayBgBusy(false);
              setPdfOverlayDims({ w: 0, h: 0 });
              setPdfOverlayZoom(1);
              setPdfOverlayTypedOpen(false);
          }, []);

          const renderPdfOverlayPageAsync = useCallback(async (pageNum, tw, th) => {
              if (tw < 16 || th < 16) return '';
              const pdfReady = await mullerEnsurePdfJsLoaded().catch(() => false);
              if (!pdfReady || !window.pdfjsLib) return '';
              try {
                  window.pdfjsLib.GlobalWorkerOptions.workerSrc = MULLER_PDFJS_WORKER_URL;
                  let pdf = pdfStudyDocHandleRef.current;
                  if (!pdf && pdfStudyBufferRef.current) {
                      pdf = await window.pdfjsLib.getDocument({ data: pdfStudyBufferRef.current }).promise;
                      pdfStudyDocHandleRef.current = pdf;
                  }
                  if (!pdf) return '';
                  const page = await pdf.getPage(Math.max(1, Number(pageNum) || 1));
                  const v0 = page.getViewport({ scale: 1 });
                  const scale = Math.min(tw / v0.width, th / v0.height) * 0.994;
                  const viewport = page.getViewport({ scale });
                  const rc = document.createElement('canvas');
                  rc.width = Math.max(1, Math.floor(viewport.width));
                  rc.height = Math.max(1, Math.floor(viewport.height));
                  const rctx = rc.getContext('2d', { alpha: false });
                  if (!rctx) return '';
                  rctx.fillStyle = '#f8fafc';
                  rctx.fillRect(0, 0, rc.width, rc.height);
                  const rt = page.render({ canvasContext: rctx, viewport });
                  await (rt && rt.promise ? rt.promise : rt);
                  const out = document.createElement('canvas');
                  out.width = Math.floor(tw);
                  out.height = Math.floor(th);
                  const octx = out.getContext('2d', { alpha: false });
                  if (!octx) return '';
                  octx.fillStyle = '#f1f5f9';
                  octx.fillRect(0, 0, out.width, out.height);
                  const s = Math.min(tw / rc.width, th / rc.height);
                  const dw = rc.width * s;
                  const dh = rc.height * s;
                  const ox = (tw - dw) / 2;
                  const oy = (th - dh) / 2;
                  octx.drawImage(rc, 0, 0, rc.width, rc.height, ox, oy, dw, dh);
                  return out.toDataURL('image/png');
              } catch (e) {
                  return '';
              }
          }, []);

          useEffect(() => {
              if (!pdfStudyFullscreen || pdfStudyFsView !== 'overlay') return;
              const el = pdfAnnotateAreaRef.current;
              if (!el || typeof ResizeObserver === 'undefined') return;
              const ro = new ResizeObserver((entries) => {
                  const cr = entries[0] && entries[0].contentRect;
                  if (!cr) return;
                  const w = Math.floor(cr.width);
                  const h = Math.floor(cr.height);
                  if (w > 8 && h > 8) setPdfOverlayDims({ w, h });
              });
              ro.observe(el);
              return () => { try { ro.disconnect(); } catch (e) {} };
          }, [pdfStudyFullscreen, pdfStudyFsView]);

          useEffect(() => {
              if (pdfStudyFsView !== 'overlay') return;
              setPdfOverlayZoom(1);
          }, [activePdfPageData && activePdfPageData.page, pdfStudyPageIdx, pdfStudyFsView]);

          useEffect(() => {
              if (!pdfStudyFullscreen || pdfStudyFsView !== 'overlay') return;
              const sc = pdfOverlayScrollRef.current;
              if (!sc) return;
              const onWheel = (e) => {
                  if (e.ctrlKey || e.metaKey) {
                      e.preventDefault();
                      setPdfOverlayZoom((z) => {
                          const n = e.deltaY < 0 ? z * 1.09 : z / 1.09;
                          return mullerClamp(n, 0.35, 4);
                      });
                  }
              };
              sc.addEventListener('wheel', onWheel, { passive: false });
              return () => { try { sc.removeEventListener('wheel', onWheel); } catch (err) {} };
          }, [pdfStudyFullscreen, pdfStudyFsView, pdfFsScrollPdf, pdfSessionBufferOk]);

          useEffect(() => {
              if (!pdfStudyFullscreen || pdfStudyFsView !== 'overlay' || pdfFsScrollPdf) {
                  if (!pdfStudyFullscreen) setPdfOverlayBgUrl('');
                  setPdfOverlayBgBusy(false);
                  return;
              }
              if (!pdfSessionBufferOk && !pdfStudyBufferRef.current && !pdfStudyDocHandleRef.current) {
                  setPdfOverlayBgUrl('');
                  setPdfOverlayBgBusy(false);
                  return;
              }
              const w = pdfOverlayDims.w;
              const h = pdfOverlayDims.h;
              if (w < 32 || h < 32) return;
              const num = activePdfPageData && activePdfPageData.page ? Number(activePdfPageData.page) : 1;
              let cancelled = false;
              setPdfOverlayBgBusy(true);
              renderPdfOverlayPageAsync(num, w, h).then((url) => {
                  if (!cancelled) {
                      setPdfOverlayBgUrl(url || '');
                      setPdfOverlayBgBusy(false);
                  }
              });
              return () => { cancelled = true; };
          }, [pdfStudyFullscreen, pdfStudyFsView, pdfFsScrollPdf, pdfOverlayDims, pdfSessionBufferOk, activePdfPageData && activePdfPageData.page, pdfStudyPageIdx, renderPdfOverlayPageAsync]);
          const startRutaListen = async () => {
              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SpeechRecognition) { alert('Para leer en voz alta usa Chrome o Edge en escritorio.'); return; }
              const ok = await mullerEnsureMicPermission({ autoPrompt: true, showToast: true });
              if (!ok) { setRutaSpeakErr('No hay permiso de micr«¸fono. Puedes continuar sin grabar.'); return; }
              try { if (rutaRecRef.current) rutaRecRef.current.stop(); } catch (e) {}
              const rec = new SpeechRecognition();
              rec.lang = 'de-DE';
              rec.interimResults = false;
              rec.maxAlternatives = 1;
              rec.onresult = (e) => {
                  const t = (e.results[0] && e.results[0][0] && e.results[0][0].transcript) ? e.results[0][0].transcript : '';
                  setRutaTranscript(collapseStutterRepeats(t));
                  setRutaListening(false);
              };
              rec.onerror = () => { setRutaListening(false); };
              rec.onend = () => { setRutaListening(false); };
              rutaRecRef.current = rec;
              setRutaListening(true);
              setRutaTranscript('');
              setRutaSpeakErr('');
              rec.start();
          };

          const readingScriptOptions = useMemo(() => {
              return (savedScripts || []).map((s) => ({ id: String(s.id), title: s.title || 'Sin t«tulo' }));
          }, [savedScripts]);

          const readingTargetText = useMemo(() => {
              if (readingSource === 'paste') return String(readingTextInput || '').trim();
              if (readingSource === 'current_story') {
                  return (guionData || []).map((s) => String(s && s.text ? s.text : '').trim()).filter(Boolean).join(' ');
              }
              if (readingSource === 'one_saved') {
                  const picked = (savedScripts || []).find((s) => String(s.id) === String(readingScriptId));
                  if (!picked) return '';
                  try {
                      const rows = JSON.parse(picked.data || '[]');
                      return (rows || []).map((s) => String(s && s.text ? s.text : '').trim()).filter(Boolean).join(' ');
                  } catch (e) { return ''; }
              }
              return '';
          }, [readingSource, readingTextInput, guionData, savedScripts, readingScriptId]);

          const readingProgress = useMemo(() => {
              const targetWords = normalizeGermanSpeechText(readingTargetText || '').split(/\s+/).filter(Boolean);
              const spokenWords = normalizeGermanSpeechText(readingTranscript || '').split(/\s+/).filter(Boolean);
              if (!targetWords.length) return { matched: 0, total: 0, pct: 0 };
              let i = 0;
              while (i < targetWords.length && i < spokenWords.length && targetWords[i] === spokenWords[i]) i++;
              const pct = Math.round((i / targetWords.length) * 100);
              return { matched: i, total: targetWords.length, pct };
          }, [readingTargetText, readingTranscript]);

          const readingWordTokens = useMemo(() => mullerReadingTokenizeText(readingTargetText), [readingTargetText]);
          const readingVerbLookup = useMemo(() => {
              const map = new Map();
              (rutaVerbDb && Array.isArray(rutaVerbDb.verbs) ? rutaVerbDb.verbs : []).forEach((verb) => {
                  if (!verb) return;
                  const lemmaKey = mullerNormalizeGermanWordToken(verb.lemma || verb.id || '');
                  if (lemmaKey && !map.has(lemmaKey)) map.set(lemmaKey, verb);
                  const forms = verb.forms || {};
                  Object.keys(forms).forEach((tenseKey) => {
                      const tense = forms[tenseKey];
                      if (!tense || typeof tense !== 'object') return;
                      Object.values(tense).forEach((v) => {
                          const w = mullerNormalizeGermanWordToken(v);
                          if (w && !map.has(w)) map.set(w, verb);
                      });
                  });
                  const p2 = mullerNormalizeGermanWordToken(verb.partizip2 || '');
                  if (p2 && !map.has(p2)) map.set(p2, verb);
              });
              return map;
          }, [rutaVerbDb]);
          const readingSelectedWord = readingWordInfo ? String(readingWordInfo.word || '') : '';
          const readingVerbInfo = useMemo(() => {
              const key = mullerNormalizeGermanWordToken(readingSelectedWord);
              if (!key) return null;
              const hit = readingVerbLookup.get(key) || null;
              if (hit) {
                  const forms = (hit && hit.forms) || {};
                  const pr = forms.praeteritum && (forms.praeteritum.ich || forms.praeteritum.er_sie_es || forms.praeteritum.wir || forms.praeteritum.sie_Sie || forms.praeteritum.du);
                  const pf = forms.perfekt && (forms.perfekt.ich || forms.perfekt.er_sie_es || forms.perfekt.wir || forms.perfekt.sie_Sie || forms.perfekt.du);
                  return {
                      infinitive: hit.lemma || hit.id || key,
                      translation: hit.es || '',
                      praeteritum: pr || '',
                      perfekt: pf || '',
                      level: hit.level || '',
                      source: 'db'
                  };
              }
              const fallback = resolveTempusVerbInfo(key);
              if (!fallback) return null;
              return {
                  infinitive: fallback.infinitive || key,
                  translation: '',
                  praeteritum: '',
                  perfekt: '',
                  formsHint: fallback.forms || '',
                  source: 'fallback'
              };
          }, [readingSelectedWord, readingVerbLookup]);
          const runReadingWordLookup = useCallback(async (rawWord) => {
              const cleanWord = mullerNormalizeGermanWordToken(rawWord);
              if (!cleanWord) return;
              setReadingWordInfo({ word: cleanWord, loading: true, translation: '', error: '', ts: Date.now() });
              try {
                  const r = await mullerTranslateGtxFull(cleanWord, 'de', 'es');
                  const out = String((r && r.text) || '').trim();
                  if (out) {
                      setReadingWordInfo((prev) => {
                          if (!prev || prev.word !== cleanWord) return prev;
                          return { ...prev, loading: false, translation: out, error: '' };
                      });
                      return;
                  }
              } catch (e) {}
              try {
                  const mm = await mullerTranslateViaMyMemory(cleanWord, 'de|es');
                  setReadingWordInfo((prev) => {
                      if (!prev || prev.word !== cleanWord) return prev;
                      return { ...prev, loading: false, translation: String(mm || '').trim(), error: '' };
                  });
              } catch (e2) {
                  setReadingWordInfo((prev) => {
                      if (!prev || prev.word !== cleanWord) return prev;
                      return { ...prev, loading: false, translation: '', error: 'No se pudo traducir ahora mismo.' };
                  });
              }
          }, []);
          const readingSentences = useMemo(() => {
              const chunks = String(readingTargetText || '').match(/[^.!?É?›\n]+[.!?É?›]?/g) || [];
              return chunks.map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
          }, [readingTargetText]);
          const readingCaptureCurrentSelection = useCallback(() => {
              try {
                  if (typeof window === 'undefined' || typeof window.getSelection !== 'function') return;
                  const host = readingTextSurfaceRef.current;
                  if (!host) return;
                  const sel = window.getSelection();
                  if (!sel || sel.rangeCount === 0) return;
                  const anchorNode = sel.anchorNode;
                  const focusNode = sel.focusNode;
                  if ((anchorNode && !host.contains(anchorNode)) || (focusNode && !host.contains(focusNode))) return;
                  const raw = String(sel.toString() || '');
                  const text = raw.replace(/\s+/g, ' ').trim();
                  if (!text || text.length < 2) return;
                  setReadingSelectedSnippet(text);
              } catch (e) {}
          }, []);
          const readingSpeakText = useCallback((rawText, opts = {}) => {
              const text = String(rawText || '').replace(/\s+/g, ' ').trim();
              if (!text) return false;
              const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
              if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') {
                  if (window.__mullerToast) window.__mullerToast('Tu navegador no soporta reproducci«¸n de voz.', 'error');
                  return false;
              }
              const defaultRate = Number(opts.rate);
              const fallbackRate = Number.isFinite(defaultRate) ? defaultRate : 0.92;
              let finalRate = fallbackRate;
              try {
                  const storedRate = parseFloat(localStorage.getItem(MULLER_TTS_RATE_KEY) || String(fallbackRate));
                  if (Number.isFinite(storedRate) && storedRate >= 0.5 && storedRate <= 1.5) finalRate = storedRate;
              } catch (e) {}
              try {
                  setReadingWordAudioBusy(true);
                  synth.cancel();
                  const utter = new SpeechSynthesisUtterance(text);
                  utter.lang = 'de-DE';
                  utter.rate = finalRate;
                  if (typeof window.__mullerApplyPreferredDeVoice === 'function') window.__mullerApplyPreferredDeVoice(utter);
                  utter.onend = () => setReadingWordAudioBusy(false);
                  utter.onerror = () => setReadingWordAudioBusy(false);
                  synth.speak(utter);
                  return true;
              } catch (e) {
                  setReadingWordAudioBusy(false);
                  if (window.__mullerToast) window.__mullerToast('No se pudo reproducir el audio ahora.', 'error');
                  return false;
              }
          }, []);
          const speakReadingWord = useCallback((rawWord) => {
              const cleanWord = mullerNormalizeGermanWordToken(rawWord);
              if (!cleanWord) return;
              readingSpeakText(cleanWord, { rate: 0.9 });
          }, [readingSpeakText]);
          const speakReadingSentenceWithWord = useCallback((rawWord) => {
              const pickedSnippet = String(readingSelectedSnippet || '').replace(/\s+/g, ' ').trim();
              if (pickedSnippet) {
                  readingSpeakText(pickedSnippet, { rate: 0.92 });
                  return;
              }
              const cleanWord = mullerNormalizeGermanWordToken(rawWord);
              if (!cleanWord) {
                  if (window.__mullerToast) window.__mullerToast('Selecciona una palabra o una frase.', 'info');
                  return;
              }
              const sentence = readingSentences.find((s) => {
                  const tokens = mullerReadingTokenizeText(s);
                  return tokens.some((t) => t.word === cleanWord);
              });
              if (sentence) {
                  readingSpeakText(sentence, { rate: 0.92 });
                  return;
              }
              readingSpeakText(cleanWord, { rate: 0.92 });
          }, [readingSelectedSnippet, readingSentences, readingSpeakText]);
          useEffect(() => {
              try { localStorage.setItem(MULLER_READING_FONT_STORAGE, String(readingFontPx)); } catch (e) {}
          }, [readingFontPx]);
          useEffect(() => {
              setReadingSelectedSnippet('');
          }, [readingTargetText]);
          useEffect(() => {
              if (activeTab !== 'lectura') return undefined;
              const onSelection = () => readingCaptureCurrentSelection();
              document.addEventListener('selectionchange', onSelection);
              return () => document.removeEventListener('selectionchange', onSelection);
          }, [activeTab, readingCaptureCurrentSelection]);

          const readingTipForWord = (w) => {
              const x = String(w || '').toLowerCase();
              if (/[«œ«Ù«¨]/.test(x)) return 'Atenci«¸n a umlauts: «œ (tipo e abierta), «Ù (o redondeada), «¨ (i con labios redondos).';
              if (x.includes('sch')) return 'sch suena como "sh".';
              if (x.includes('ch')) return 'ch no suena como "ch" espa«Òol; en alem«≠n suele ser m«≠s suave/gutural.';
              if (x.includes('ei')) return 'ei suena parecido a "ai".';
              if (x.includes('ie')) return 'ie suena como i larga.';
              if (x.includes('eu') || x.includes('«œu')) return 'eu/«œu suena parecido a "oi".';
              if (x.includes('z')) return 'z suena como "ts".';
              if (x.includes('v')) return 'En alem«≠n muchas veces v suena como "f".';
              return 'Repite lento por s«labas, luego a velocidad normal.';
          };

          const runReadingCompare = (targetText, transcript) => {
              const a = normalizeGermanSpeechText(targetText || '');
              const b = normalizeGermanSpeechText(transcript || '');
              if (!a || !b) { setReadingScore(null); setReadingFeedback([]); return; }
              const aw = a.split(/\s+/).filter(Boolean);
              const bw = b.split(/\s+/).filter(Boolean);
              const feedback = matchGermanWordsSequential(aw, bw);
              const ok = feedback.filter((f) => f.correct).length;
              const pct = aw.length ? Math.round((ok / aw.length) * 100) : 0;
              const enriched = feedback.filter((f) => !f.correct).slice(0, 18).map((f) => ({ ...f, tip: readingTipForWord(f.word) }));
              setReadingScore(pct);
              setReadingFeedback(enriched);
          };
          const finalizeReadingSession = useCallback(() => {
              const finalText = collapseStutterRepeats((readingFinalRef.current || readingLiveTranscriptRef.current || '').trim());
              setReadingTranscript(finalText);
              runReadingCompare(readingTargetText, finalText);
          }, [readingTargetText]);

          const startReadingListen = async () => {
              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SpeechRecognition) { alert('Para lectura en voz alta usa Chrome o Edge.'); return; }
              const ok = await mullerEnsureMicPermission({ autoPrompt: true, showToast: true });
              if (!ok) return;
              try { if (readingRecRef.current) readingRecRef.current.stop(); } catch (e) {}
              if (readingRestartTimerRef.current) {
                  window.clearTimeout(readingRestartTimerRef.current);
                  readingRestartTimerRef.current = null;
              }
              readingStopRequestedRef.current = false;
              readingAutoRestartRef.current = true;
              const sessionId = Date.now();
              readingSessionIdRef.current = sessionId;
              readingFinalRef.current = '';
              readingLiveTranscriptRef.current = '';
              setReadingTranscript('');
              setReadingScore(null);
              setReadingFeedback([]);

              const startCycle = () => {
                  if (readingSessionIdRef.current !== sessionId) return;
                  if (readingStopRequestedRef.current || !readingAutoRestartRef.current) return;
                  const rec = new SpeechRecognition();
                  rec.lang = 'de-DE';
                  rec.continuous = true;
                  rec.interimResults = true;
                  rec.maxAlternatives = 1;
                  rec.onresult = (event) => {
                      if (readingSessionIdRef.current !== sessionId) return;
                      let interim = '';
                      for (let i = event.resultIndex; i < event.results.length; i++) {
                          const r = event.results[i];
                          const t = (r[0] && r[0].transcript) ? String(r[0].transcript).trim() : '';
                          if (!t) continue;
                          if (r.isFinal) readingFinalRef.current = mergeSpeechFinalChunk(readingFinalRef.current, t);
                          else interim = t;
                      }
                      const merged = collapseStutterRepeats((readingFinalRef.current + (interim ? (' ' + interim) : '')).trim());
                      readingLiveTranscriptRef.current = merged;
                      setReadingTranscript(merged);
                  };
                  rec.onerror = (evt) => {
                      if (readingSessionIdRef.current !== sessionId) return;
                      const errType = evt && evt.error ? String(evt.error) : '';
                      if (errType === 'not-allowed' || errType === 'service-not-allowed') {
                          readingStopRequestedRef.current = true;
                          readingAutoRestartRef.current = false;
                          setReadingListening(false);
                          if (window.__mullerToast) window.__mullerToast('Permiso de micr«¸fono no disponible.', 'error');
                      }
                  };
                  rec.onend = () => {
                      if (readingSessionIdRef.current !== sessionId) return;
                      if (readingRecRef.current === rec) readingRecRef.current = null;
                      if (readingStopRequestedRef.current || !readingAutoRestartRef.current) {
                          setReadingListening(false);
                          finalizeReadingSession();
                          return;
                      }
                      readingRestartTimerRef.current = window.setTimeout(() => {
                          startCycle();
                      }, 120);
                  };
                  readingRecRef.current = rec;
                  setReadingListening(true);
                  try {
                      rec.start();
                  } catch (e) {
                      readingRestartTimerRef.current = window.setTimeout(() => {
                          startCycle();
                      }, 260);
                  }
              };
              startCycle();
          };

          const stopReadingListen = () => {
              readingStopRequestedRef.current = true;
              readingAutoRestartRef.current = false;
              if (readingRestartTimerRef.current) {
                  window.clearTimeout(readingRestartTimerRef.current);
                  readingRestartTimerRef.current = null;
              }
              const r = readingRecRef.current;
              if (!r) {
                  setReadingListening(false);
                  finalizeReadingSession();
                  return;
              }
              try { r.stop(); } catch (e) {
                  setReadingListening(false);
                  finalizeReadingSession();
              }
          };
          useEffect(() => {
              if (activeTab === 'lectura') return;
              readingSessionIdRef.current = Date.now();
              readingStopRequestedRef.current = true;
              readingAutoRestartRef.current = false;
              if (readingRestartTimerRef.current) {
                  window.clearTimeout(readingRestartTimerRef.current);
                  readingRestartTimerRef.current = null;
              }
              try { if (readingRecRef.current) readingRecRef.current.stop(); } catch (e) {}
              setReadingListening(false);
          }, [activeTab]);
          useEffect(() => {
              // Evita que una grabaci«¸n de una pesta«Òa siga viva al cambiar a otra.
              try { if (recognitionRef.current) recognitionRef.current.stop(); } catch (e) {}
              try { if (rutaRecRef.current) rutaRecRef.current.stop(); } catch (e) {}
              try { if (readingRecRef.current) readingRecRef.current.stop(); } catch (e) {}
              readingSessionIdRef.current = Date.now();
              readingStopRequestedRef.current = true;
              readingAutoRestartRef.current = false;
              if (readingRestartTimerRef.current) {
                  window.clearTimeout(readingRestartTimerRef.current);
                  readingRestartTimerRef.current = null;
              }
              setIsListening(false);
              setRutaListening(false);
              setReadingListening(false);
          }, [activeTab]);
          useEffect(() => {
              return () => {
                  if (readingRestartTimerRef.current) {
                      window.clearTimeout(readingRestartTimerRef.current);
                      readingRestartTimerRef.current = null;
                  }
              };
          }, []);

          const getWeeklyChartBars = () => {
              const raw = [];
              for (let i = 6; i >= 0; i--) {
                  const d = new Date();
                  d.setDate(d.getDate() - i);
                  const key = d.toISOString().slice(0, 10);
                  raw.push((userStats.activityByDay && userStats.activityByDay[key]) || 0);
              }
              const maxVal = Math.max(...raw, 1);
              const normalized = raw.map((h) => Math.max(5, Math.round((h / maxVal) * 100)));
              const hasReal = raw.some((x) => x > 0);
              if (!hasReal && userStats.activityLog && userStats.activityLog.length >= 7) {
                  return userStats.activityLog.slice(-7).map((v) => Math.max(5, Math.min(100, v)));
              }
              return normalized;
          };

          useEffect(() => {
              if (activeTab !== 'progreso') return;
              const refreshMuller = () => {
                  try {
                      if (typeof getAdvancedDashboard === 'function') setMullerProgresoSnapshot(getAdvancedDashboard());
                  } catch (e) { setMullerProgresoSnapshot(null); }
              };
              refreshMuller();
              window.addEventListener('advancedProgressUpdated', refreshMuller);
              return () => window.removeEventListener('advancedProgressUpdated', refreshMuller);
          }, [activeTab]);

          useEffect(() => {
              if (activeTab !== 'vocabulario') {
                  const allVocab = [];
                  guionData.forEach(scene => { if (scene.vocab) scene.vocab.forEach(v => { if (!allVocab.some(existing => existing.de === v.de)) allVocab.push(v); }); });
                  setCurrentVocabList(mullerSortVocabBySrs(allVocab, mullerGetVocabSrsMap())); setVocabReviewIndex(0); setShowVocabTranslation(false);
              }
          }, [guionData, activeTab]);

          useEffect(() => {
              let cancelled = false;
              fetch('./b1-b2-database.json', { cache: 'no-cache' })
                  .then((r) => { if (!r.ok) throw new Error('bx'); return r.json(); })
                  .then((data) => {
                      if (cancelled) return;
                      const n = normalizeBxPayload(data);
                      setBxRemoteDatabases(n);
                      try { sessionStorage.setItem('muller_b1b2_json_v1', JSON.stringify(data)); } catch (e) {}
                  })
                  .catch(() => {
                      if (cancelled) return;
                      setBxRemoteDatabases((prev) => prev || BX_DB_FALLBACK);
                  });
              return () => { cancelled = true; };
          }, []);

          useEffect(() => {
              const pack = bxEffectiveDatabases;
              const dbToUse = bxBankLevel === 'b1' ? pack.b1 : pack.b2;
              let newList;
              if (bxCategory === 'mix') {
                  newList = [];
                  Object.values(dbToUse).forEach((arr) => { newList = newList.concat(arr); });
                  newList.sort(() => Math.random() - 0.5);
              } else {
                  newList = dbToUse[bxCategory] || [];
              }
              setBxCurrentList(newList);
              const catTabChanged = !bxCatTabRef.current || bxCatTabRef.current.c !== bxCategory || bxCatTabRef.current.t !== activeTab;
              bxCatTabRef.current = { c: bxCategory, t: activeTab };
              if (catTabChanged) setBxIndex(0);
              else setBxIndex((i) => (newList.length === 0 ? 0 : Math.min(i, newList.length - 1)));
          }, [bxCategory, activeTab, bxEffectiveDatabases]);

          useEffect(() => {
              const item = bxCurrentList[bxIndex];
              if (!item || !item._mullerUser) return;
              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
              const src = bxCategory === 'mix' ? (item._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, item._mullerUid)) : bxCategory;
              if (!src) return;
              const others = Object.keys(BX_DB_EMPTY).filter((c) => c !== src);
              setBxMoveTargetCat((prev) => (others.includes(prev) ? prev : others[0] || 'vocabulario'));
          }, [bxIndex, bxCategory, bxCurrentList, bxUserOverlay, activeTab]);

          useEffect(() => {
            const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
            if (!synth) return undefined;
            const handleVoicesChanged = () => setVoicesLoaded(true);
            try {
                if (typeof synth.getVoices === 'function' && synth.getVoices().length > 0) setVoicesLoaded(true);
            } catch (e) {}
            if (typeof synth.addEventListener === 'function') {
                synth.addEventListener('voiceschanged', handleVoicesChanged);
                return () => {
                    try { synth.removeEventListener('voiceschanged', handleVoicesChanged); } catch (e) {}
                };
            }
            const previous = synth.onvoiceschanged;
            synth.onvoiceschanged = handleVoicesChanged;
            return () => {
                try {
                    if (synth.onvoiceschanged === handleVoicesChanged) synth.onvoiceschanged = previous || null;
                } catch (e) {}
            };
          }, []);

          const updateTempusVerbList = (text) => {
              if (!tempusMode || !text) { setTempusVerbList([]); return; }
              const words = text.split(/\s+/);
              const foundVerbs = [];
              const processed = new Set();
              words.forEach(word => {
                  const cleanWord = word.toLowerCase().replace(/[.,!?;:()]/g, '');
                  if (TEMPUS_DICT[cleanWord]) {
                      if (!processed.has(cleanWord)) { foundVerbs.push({ infinitive: cleanWord, forms: TEMPUS_DICT[cleanWord] }); processed.add(cleanWord); }
                  } else if (cleanWord.match(/^(?:[a-z«œ«Ù«¨«Y]+)(?:en|eln|ern)$/i) && cleanWord.length > 3) {
                      const infinitive = cleanWord;
                      if (!processed.has(infinitive)) {
                          const base = infinitive.slice(0, -2);
                          const praet = base + 'te';
                          const perf = 'hat ' + infinitive;
                          foundVerbs.push({ infinitive, forms: `Pr«œt: ${praet} | Perf: ${perf} (regular estimado)` });
                          processed.add(infinitive);
                      }
                  }
              });
              setTempusVerbList(foundVerbs);
          };

          function resolveTempusVerbInfo(rawWord) {
              const clean = String(rawWord || '').toLowerCase().replace(/[.,!?;:()"]/g, '').trim();
              if (!clean) return null;
              if (TEMPUS_DICT[clean]) {
                  const forms = TEMPUS_DICT[clean];
                  const isInf = /(?:en|eln|ern)$/.test(clean);
                  let infinitive = clean;
                  if (!isInf) {
                      const alt = Object.keys(TEMPUS_DICT).find((k) => TEMPUS_DICT[k] === forms && /(?:en|eln|ern)$/.test(k));
                      if (alt) infinitive = alt;
                  }
                  return { touched: clean, infinitive, forms };
              }
              if (/(?:en|eln|ern)$/.test(clean) && clean.length > 3) {
                  const base = clean.slice(0, -2);
                  return { touched: clean, infinitive: clean, forms: `Pr«œt: ${base}te | Perf: hat ${clean} (regular estimado)` };
              }
              return null;
          }

          function inferTempusContextLabel(word) {
              const w = String(word || '').toLowerCase();
              if (!w) return '';
              if (w.startsWith('ge') && (w.endsWith('t') || w.endsWith('en'))) return 'Forma probable: Partizip II (Perfekt/Plusquamperfekt).';
              if (/(te|test|ten|tet)$/.test(w)) return 'Forma probable: Pr«œteritum (regular).';
              if (/(st|t|en)$/.test(w)) return 'Forma probable: Pr«œsens (seg«ßn contexto/persona).';
              return 'Tiempo/persona: revisa contexto de la frase.';
          }

          useEffect(() => {
              const actualIdx = getActualSceneIndex();
              const currentScene = guionData[actualIdx];
              if (currentScene && tempusMode) updateTempusVerbList(currentScene.text);
              else setTempusVerbList([]);
          }, [sceneIndex, isReviewing, tempusMode, guionData]);
          useEffect(() => {
              if (!tempusMode) setTempusSelectedVerb(null);
          }, [tempusMode, sceneIndex, isReviewing]);

          const getVoice = (lang, gender, isOlder = false) => {
            const allVoices = window.speechSynthesis.getVoices();
            if (lang === 'de' && window.__mullerResolveVoice) {
                const pref = window.__mullerResolveVoice('muller_tts_de');
                if (pref) return pref;
            }
            if (lang === 'es' && window.__mullerResolveVoice) {
                const pref = window.__mullerResolveVoice('muller_tts_es');
                if (pref) return pref;
            }
            const langVoices = allVoices.filter(v => v.lang.startsWith(lang));
            if (langVoices.length === 0) return allVoices[0]; 
            const femaleVoices = langVoices.filter(v => /female|woman|Katja|Marlene|Vicki/i.test(v.name));
            const maleVoices = langVoices.filter(v => /male|man|Stefan|Conrad|Klaus/i.test(v.name));
            if (gender === 'female') return femaleVoices.length > 0 ? femaleVoices[0] : langVoices[0];
            if (gender === 'male') {
                if (isOlder && maleVoices.length > 1) return maleVoices[1];
                if (maleVoices.length > 0) return maleVoices[0];
                return langVoices[langVoices.length - 1]; 
            }
            return langVoices[0];
          };

          const speakRutaDe = (text) => {
              if (!text) return;
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance(text);
              u.lang = 'de-DE';
              if (typeof window.__mullerApplyPreferredDeVoice === 'function') window.__mullerApplyPreferredDeVoice(u);
              else {
                  u.voice = rutaMentor === 'tom' ? getVoice('de', 'male') : getVoice('de', 'female');
              }
              if (rutaMentor === 'lena') { u.pitch = 1.12; u.rate = parseFloat(localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') || 0.92; }
              else if (rutaMentor === 'tom') { u.pitch = 0.88; u.rate = 0.9; }
              else { u.pitch = 1.32; u.rate = 0.96; }
              window.speechSynthesis.speak(u);
          };

          const stopAudio = () => { 
              window.speechSynthesis.cancel(); 
              if (timeoutRef.current) clearTimeout(timeoutRef.current); 
              setIsPlaying(false); 
              stopNoise(); // Detener ruido si est«≠ activo
          };

          // Funciones para ruido de fondo
          const startNoise = () => {
              if (!noiseEnabled) return;
              try {
                  const AudioContext = window.AudioContext || window.webkitAudioContext;
                  const ctx = new AudioContext();
                  noiseContextRef.current = ctx;
                  const bufferSize = 4096;
                  const noiseNode = ctx.createScriptProcessor(bufferSize, 1, 1);
                  noiseNode.onaudioprocess = (e) => {
                      const output = e.outputBuffer.getChannelData(0);
                      for (let i = 0; i < bufferSize; i++) {
                          output[i] = (Math.random() * 2 - 1) * 0.15; // Ruido blanco a bajo volumen
                      }
                  };
                  const gainNode = ctx.createGain();
                  gainNode.gain.value = 0.08; // Volumen muy bajo
                  noiseGainRef.current = gainNode;
                  noiseNode.connect(gainNode);
                  gainNode.connect(ctx.destination);
                  noiseSourceRef.current = noiseNode;
              } catch(e) { console.warn("No se pudo iniciar ruido de fondo:", e); }
          };

          const stopNoise = () => {
              if (noiseSourceRef.current) {
                  noiseSourceRef.current.disconnect();
                  noiseSourceRef.current = null;
              }
              if (noiseContextRef.current) {
                  noiseContextRef.current.close();
                  noiseContextRef.current = null;
              }
          };

          useEffect(() => {
              if (noiseEnabled && isPlaying) startNoise();
              else stopNoise();
              return () => stopNoise();
          }, [noiseEnabled, isPlaying]);

          const resetModes = () => { 
              setDiktatInput(""); setShowDiktatResult(false); 
              setSpokenText(""); setPronunciationScore(null); setGrammarPolizeiMsg(""); setPronunciationFeedback([]);
              setShowPuzzleResult(false); setPuzzleLastOk(null); setShowCurrentTranslation(false); 
              initPuzzle(guionData[getActualSceneIndex()]?.text || ""); 
          };
          
          const getActualSceneIndex = () => isReviewing ? userStats.failedDiktatScenes[reviewIndexPointer] : sceneIndex;

          const getNextPlaylistScript = () => {
              if (!savedScripts || savedScripts.length === 0) return null;
              if (isDefaultScript) return savedScripts[0];
              const i = savedScripts.findIndex((s) => String(s.id) === String(activeSavedScriptId));
              if (i < 0) return savedScripts[0];
              if (i + 1 < savedScripts.length) return savedScripts[i + 1];
              return null;
          };

          const proceedToNextStage = () => {
              if (isReviewing) {
                  if (reviewIndexPointer < userStats.failedDiktatScenes.length - 1) { setReviewIndexPointer(p => p + 1); setMode('dialogue'); resetModes(); } 
                  else { saveProgress({ failedDiktatScenes: [] }); setIsReviewing(false); stopAudio(); }
              } else {
                  if (sceneIndex < guionData.length - 1) { setSceneIndex(s => s + 1); setMode('dialogue'); resetModes(); } 
                  else {
                      if (historiaPlaylistAllScripts && !isReviewing) {
                          const nextScr = getNextPlaylistScript();
                          if (nextScr) {
                              loadSavedScript(nextScr);
                              return;
                          }
                      }
                      if (userStats.failedDiktatScenes.length > 0) {
                          alert("∂≠Historia terminada! Tienes fallos pendientes en Diktat. Iniciando Repaso.");
                          setIsReviewing(true); setReviewIndexPointer(0); setMode('dialogue'); resetModes();
                      } else {
                          stopAudio();
                          if (historiaPlaylistAllScripts && savedScripts.length > 0) {
                              alert('∂≠Has escuchado todos los guiones guardados en secuencia!');
                          } else {
                              alert("∂≠Has completado el guion!");
                          }
                      }
                  }
              }
          };

          const handleNext = () => { stopAudio(); proceedToNextStage(); };
          const handlePrev = () => { stopAudio(); if (!isReviewing && sceneIndex > 0) { setSceneIndex(s => s - 1); setMode('dialogue'); resetModes(); } };
          const togglePlay = () => { 
              if (userStats.hearts <= 0) { setShowDeathModal(true); return; }
              if (isPlaying) stopAudio(); else setIsPlaying(true); 
          };

          const initPuzzle = (text) => {
              if (!text) return;
              const words = text.split(/\s+/).map((w, i) => ({ id: i, text: w }));
              setPuzzleWords(words.sort(() => Math.random() - 0.5)); setPuzzleAnswer([]);
          };

          useEffect(() => { if (puzzleMode && activeTab === 'historia') initPuzzle(guionData[getActualSceneIndex()]?.text); }, [sceneIndex, isReviewing, puzzleMode, guionData, activeTab]);

          const handleSaveCustomVocab = () => {
              if (!vocabTitleInput.trim()) { alert("Por favor, dale un t«tulo a la lecci«¸n."); return; }
              if (!vocabTextInput.trim()) { alert("Por favor, pega el vocabulario."); return; }
              const lines = vocabTextInput.split(/\r?\n/);
              let parsedWords = [];
              const cleanStr = (str) => {
                  let s = str.replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, ''); 
                  s = s.replace(/[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]|\u{FE0F}/gu, ''); 
                  return s.trim();
              };
              lines.forEach(line => {
                  let text = line.trim().replace(/É?"/g, '-').replace(/É?"/g, '-');
                  if (!text) return;
                  let isDiff = false;
                  if (text.startsWith('1')) { isDiff = true; text = text.replace(/^1[.\-):\]]*\s*/, '').trim(); }
                  text = text.replace(/^[-*É?Ω+>]\s*/, '').trim();
                  text = text.replace(/^\d+[.\-):\]]+\s*/, '').trim();
                  let de = ""; let es = "";
                  const match = text.match(/(\s+-\s+|\s+=\s+|\t|\s{2,}|={1,})/);
                  if (match) {
                      const sepIndex = text.indexOf(match[0]);
                      de = cleanStr(text.substring(0, sepIndex));
                      es = cleanStr(text.substring(sepIndex + match[0].length));
                  } else {
                      const hyphenMatch = text.match(/(^|\s)-(?!\w)|(?<!\w)-(\s|$)/);
                      if (hyphenMatch) {
                          const sepIndex = text.indexOf(hyphenMatch[0]);
                          de = cleanStr(text.substring(0, sepIndex));
                          es = cleanStr(text.substring(sepIndex + hyphenMatch[0].length));
                      } else {
                          let words = text.split(' ');
                          let splitPoint = 1;
                          if (words.length > 2 && /^(sich|der|die|das|ein|eine)$/i.test(words[0])) splitPoint = 2;
                          if (words.length > splitPoint && words[splitPoint].startsWith('(')) splitPoint++;
                          de = cleanStr(words.slice(0, splitPoint).join(' '));
                          es = cleanStr(words.slice(splitPoint).join(' '));
                          if (!es) es = "???";
                      }
                  }
                  de = de.replace(/^1[.\-):\]]*\s*/, '').trim();
                  es = es.replace(/^1[.\-):\]]*\s*/, '').trim();
                  if (de) parsedWords.push({ de, es, diff: isDiff ? 1 : 0 });
              });
              if (parsedWords.length > 0) {
                  const newLesson = { id: Date.now().toString() + Math.random().toString(36).substring(7), title: vocabTitleInput, words: parsedWords };
                  const updatedLessons = [...customVocabLessons, newLesson];
                  setCustomVocabLessons(updatedLessons);
                  localStorage.setItem('mullerCustomVocab', JSON.stringify(updatedLessons));
                  setVocabTitleInput(""); setVocabTextInput("");
                  alert(`∂≠Genial! Se ha guardado la lecci«¸n "${vocabTitleInput}" con ${parsedWords.length} palabras.`);
              } else { alert("No pude detectar vocabulario v«≠lido. Pega texto para guardar."); }
          };

  const handleSaveScript = () => {
    if (!newScriptTitle.trim()) { alert("Dale un t«tulo al guion primero."); return; }
    try {
        const lines = scriptInput.split('\n');
        const newGuion = [];
        lines.forEach(line => {
            let cleanLine = line.trim();
            if (!cleanLine) return;

            // 1. Extraer Hablante (Nombre:)
            const speakerMatch = cleanLine.match(/^([^:]+):/);
            if (!speakerMatch) return;
            const speaker = speakerMatch[1].trim();
            let content = cleanLine.substring(speakerMatch[0].length).trim();

            // 2. Extraer Redemittel [R]
            let isRedemittel = false;
            if (content.includes('[R]')) {
                isRedemittel = true;
                content = content.replace('[R]', '').trim();
            }

            // 3. Extraer Vocabulario [...]
            let vocab = [];
            const vocabMatch = content.match(/\[(.*?)\]/);
            if (vocabMatch) {
                const vocabPairs = vocabMatch[1].split(',');
                vocabPairs.forEach(pair => {
                    const parts = pair.split('-');
                    if (parts.length >= 2) {
                        const cleanDe = parts[0].trim().replace(/[–Y"Ô–Y"Ê–YYΩÉ?Ω]/g, '');
                        vocab.push({ de: cleanDe, es: parts[1].trim(), diff: 1 });
                    }
                });
                content = content.replace(vocabMatch[0], '').trim();
            }

            // 4. Extraer Traducci«¸n (...)
            let translation = "Traducci«¸n no proporcionada";
            const transMatch = content.match(/\(([^)]+)\)/);
            if (transMatch) {
                translation = transMatch[1].trim();
                content = content.replace(transMatch[0], '').trim();
            }

            // 5. Alem«≠n (limpio de c«rculos para el audio)
            const germanText = content.replace(/[–Y"Ô–Y"Ê–YYΩ]/g, '').trim();

            if (germanText) {
                newGuion.push({ speaker, text: germanText, translation, isRedemittel, vocab });
            }
        });

        if (newGuion.length === 0) throw new Error("Formato no reconocido");

        const scriptObj = { id: Date.now().toString(), title: newScriptTitle, data: JSON.stringify(newGuion), timestamp: Date.now() };
        const newSaved = [...savedScripts, scriptObj].sort((a,b)=>a.title.localeCompare(b.title));
        setSavedScripts(newSaved);
        localStorage.setItem('mullerScripts', JSON.stringify(newSaved));
        try {
            if (typeof caches !== 'undefined') {
                const meta = { lastScriptTitle: newScriptTitle, lastSceneCount: newGuion.length, savedAt: new Date().toISOString() };
                caches.open('muller-offline-user-v1').then((cache) => cache.put(
                    new Request(new URL('./.muller-offline-meta.json', window.location.href).toString()),
                    new Response(JSON.stringify(meta), { headers: { 'Content-Type': 'application/json' } })
                )).catch(function () {});
            }
        } catch (e) {}
        setGuionData(newGuion); setActiveScriptTitle(newScriptTitle); setIsDefaultScript(false);
        setActiveSavedScriptId(String(scriptObj.id));
        setSceneIndex(0); setMode('dialogue'); stopAudio(); resetModes(); setIsReviewing(false);
        setNewScriptTitle(""); setActiveTab('historia');
    } catch (e) { 
        alert("Error al procesar. Aseg«ßrate de usar el formato: Nombre: Texto Alem«≠n. (Traducci«¸n) [vocab-trad]"); 
    }
};

          const handleBxDistribToLevels = (target) => {
              const text = (bxImportText || '').trim() || (scriptInput || '').trim();
              if (!text) { alert('Pega texto en el cuadro de É?oDistribuir a B1/B2É?? o en el guion de arriba.'); return; }
              const flat = mullerBibliotecaFlatItems(text);
              if (flat.length === 0) { alert('No se detectaron frases. Usa formato Nombre: Alem«≠n. (Traducci«¸n) o listas É?oalem«≠n - espa«ÒolÉ?? por l«nea.'); return; }
              const z = () => ({ vocabulario: 0, verbos: 0, preposiciones: 0, conectores: 0, redemittel: 0 });
              let snap = null;
              setBxUserOverlay((prev) => {
                  const base = normalizeBxPayload(prev);
                  const c1 = z();
                  const c2 = z();
                  let nuevos = 0;
                  flat.forEach(({ cat, item, seg }) => {
                      const lv = target === 'auto' ? mullerGuessBibliotecaItemLevel(item, seg) : target;
                      const trickBase = 'Biblioteca ∂˙ ' + cat + (target === 'auto' ? ' ∂˙ nivel estimado ' + lv.toUpperCase() : ' ∂˙ heur«stica local (sin IA)');
                      const it = { ...item, trick: trickBase };
                      const ky = mullerBxItemKey(item);
                      const exists = (base[lv][cat] || []).some((x) => mullerBxItemKey(x) === ky);
                      if (exists) return;
                      base[lv][cat].push({
                          ...it,
                          _mullerUser: true,
                          _mullerUid: 'bx_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 11),
                          _mullerCategory: cat,
                          ...(activeSavedScriptId ? { _mullerSourceScriptId: String(activeSavedScriptId) } : {})
                      });
                      if (lv === 'b2') c2[cat]++; else c1[cat]++;
                      nuevos++;
                  });
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  snap = { c1, c2, nuevos, target, detectados: flat.length };
                  return base;
              });
              const sum = (c) => `vocab ${c.vocabulario}, vb. ${c.verbos}, prep. ${c.preposiciones}, conn. ${c.conectores}, R ${c.redemittel}`;
              if (snap) {
                  if (snap.target === 'auto') {
                      setBxImportSummary(`Nivel autom«≠tico ∂˙ B1: ${sum(snap.c1)} ∂˙ B2: ${sum(snap.c2)} ∂˙ nuevos: ${snap.nuevos} (detectados: ${snap.detectados})`);
                  } else {
                      const c = snap.target === 'b2' ? snap.c2 : snap.c1;
                      setBxImportSummary(`Todo a ${snap.target.toUpperCase()}: ${sum(c)} ∂˙ nuevos: ${snap.nuevos} (detectados: ${snap.detectados})`);
                  }
              }
          };

          const clearBxUserOverlay = () => {
              if (!window.confirm('Esto borra solo lo que a«Òadiste con ∂ÆDistribuir texto∂Ø (tu biblioteca local). Las tarjetas del archivo b1-b2-database.json del proyecto no se quitan: seguir«≠n vi«∏ndose en B1/B2. ∂®Borrar tus aportaciones?')) return;
              const empty = normalizeBxPayload({});
              setBxUserOverlay(empty);
              try {
                  localStorage.removeItem(MULLER_BX_USER_OVERLAY_KEY);
                  localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(empty));
              } catch (e) {}
              setBxImportSummary('');
              setBxIndex(0);
          };

          const clearBxUserLevelAllCategories = (levelKey) => {
              const lab = levelKey === 'b1' ? 'B1' : 'B2';
              if (!window.confirm(`∂®Seguro? Se borrar«≠n TODAS tus aportaciones en ${lab} (vocabulario, verbos, preposiciones, conectores y Redemittel). No se toca el archivo b1-b2-database.json.`)) return;
              setBxUserOverlay((prev) => {
                  const base = normalizeBxPayload(prev);
                  Object.keys(BX_DB_EMPTY).forEach((cat) => { base[levelKey][cat] = []; });
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
              setBxIndex(0);
          };

          const clearBxUserOneCategory = (levelKey, catKey) => {
              const lab = levelKey === 'b1' ? 'B1' : 'B2';
              const name = { vocabulario: 'Vocabulario', verbos: 'Verbos', preposiciones: 'Preposiciones', conectores: 'Conectores', redemittel: 'Redemittel' }[catKey] || catKey;
              if (!window.confirm(`∂®Seguro? Se borran solo tus aportaciones en ∂Æ${name}∂Ø (${lab}). El resto de categor«as y el JSON base no se tocan.`)) return;
              setBxUserOverlay((prev) => {
                  const base = normalizeBxPayload(prev);
                  base[levelKey][catKey] = [];
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
              setBxIndex(0);
          };

          const runLexikonDictionarySearch = async () => {
              const q = lexikonSearch.trim();
              if (!q) { alert('Escribe una palabra o inicio de palabra.'); return; }
              setLexikonDictLoading(true);
              setLexikonResults(null);
              try {
                  if (lexikonDictKind === 'tr-es-de' || lexikonDictKind === 'tr-de-es') {
                      const tl = lexikonDictKind === 'tr-es-de' ? 'de' : 'es';
                      let out = '';
                      let detected = '';
                      const r = await mullerTranslateGtxFull(q, 'auto', tl);
                      out = r.text;
                      detected = r.detected;
                      if (!out) {
                          try {
                              out = await mullerTranslateViaMyMemory(q, tl === 'de' ? 'es|de' : 'de|es');
                          } catch (eM) { /* ignore */ }
                      }
                      setLexikonResults({ dictTranslate: true, query: q, out: out || '', detected, tl, error: false });
                  } else {
                      const wiki = lexikonDictKind === 'wiki-es' ? 'es' : 'de';
                      const url = `https://${wiki}.wiktionary.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=14&namespace=0&format=json&origin=*`;
                      const r = await fetch(url);
                      if (!r.ok) throw new Error('wiki');
                      const data = await r.json();
                      setLexikonResults({ titles: data[1] || [], descriptions: data[2] || [], urls: data[3] || [], wiki });
                  }
              } catch (e) {
                  alert('No se pudo completar la b«ßsqueda (red o bloqueo). Prueba otra vez.');
                  setLexikonResults({ error: true });
              } finally {
                  setLexikonDictLoading(false);
              }
          };

          const runLexikonTranslate = async () => {
              const text = lexikonTransText.trim();
              if (!text) { alert('Escribe un texto o frase.'); return; }
              setLexikonTransLoading(true);
              setLexikonTransOut('');
              const tl = lexikonTransTarget === 'es' ? 'es' : 'de';
              try {
                  const { text: outRaw, detected } = await mullerTranslateGtxFull(text, 'auto', tl);
                  let out = outRaw;
                  if (!out) {
                      try {
                          out = await mullerTranslateViaMyMemory(text, tl === 'de' ? 'es|de' : 'de|es');
                      } catch (eM) { /* ignore */ }
                  }
                  const finalOut = out || '(sin resultado)';
                  setLexikonTransOut(finalOut);
                  mullerLexikonApplyPairsFromTranslate(text, finalOut, detected, tl);
              } catch (e1) {
                  try {
                      let out = await mullerTranslateViaMyMemory(text, tl === 'de' ? 'es|de' : 'de|es');
                      if (!out) out = await mullerTranslateViaMyMemory(text, tl === 'de' ? 'de|es' : 'es|de');
                      const finalOut = out || '(sin resultado)';
                      setLexikonTransOut(finalOut);
                      mullerLexikonApplyPairsFromTranslate(text, finalOut, tl === 'de' ? 'es' : 'de', tl);
                  } catch (e2) {
                      setLexikonTransOut('Error de traducci«¸n. Comprueba la conexi«¸n.');
                  }
              } finally {
                  setLexikonTransLoading(false);
              }
          };

          const runHistoriasProOcr = async (file) => {
              if (!file) return;
              const ocrReady = await mullerEnsureTesseractLoaded().catch(() => false);
              if (!ocrReady || typeof Tesseract === 'undefined') {
                  setStoriesProErr('No se pudo cargar OCR (Tesseract).');
                  return;
              }
              setStoriesProErr('');
              setStoriesProBusy(true);
              try {
                  const worker = await Tesseract.createWorker(storiesProOcrLang === 'de' ? 'deu' : 'spa', 1);
                  const { data: { text } } = await worker.recognize(file);
                  await worker.terminate();
                  const cleaned = mullerStoryClean(text);
                  setStoriesProSourceText(cleaned);
                  setStoriesProInputMode(storiesProOcrLang === 'de' ? 'de' : 'es');
              } catch (err) {
                  setStoriesProErr(err && err.message ? err.message : 'Error leyendo OCR');
              } finally {
                  setStoriesProBusy(false);
              }
          };

          const runHistoriasProGenerate = async () => {
              const src = mullerStoryClean(storiesProSourceText);
              if (!src) {
                  setStoriesProErr('Escribe o carga un texto antes de generar.');
                  return;
              }
              setStoriesProBusy(true);
              setStoriesProErr('');
              try {
                  let deNatural = '';
                  let esBase = '';
                  if (storiesProInputMode === 'es') {
                      esBase = src;
                      deNatural = await mullerTranslateViaGtx(src, 'auto', 'de');
                  } else {
                      deNatural = src;
                      esBase = await mullerTranslateViaGtx(src, 'auto', 'es');
                  }
                  deNatural = mullerStoryStylizeGerman(deNatural, storiesProLevel, storiesProTone);
                  const deSimple = mullerStorySimplifyGerman(deNatural);
                  const scenes = mullerStorySplitScenes(deNatural, esBase);
                  const glossary = mullerStoryGlossary(deNatural);
                  setStoriesProResult({
                      deNatural,
                      deSimple,
                      esBase,
                      scenes,
                      glossary,
                      mode: storiesProInputMode === 'de' ? 'correccion' : 'conversion'
                  });
              } catch (err) {
                  setStoriesProErr(err && err.message ? err.message : 'No se pudo generar la historia.');
              } finally {
                  setStoriesProBusy(false);
              }
          };

          const sendHistoriasProToHistoria = () => {
              if (!storiesProResult || !Array.isArray(storiesProResult.scenes) || storiesProResult.scenes.length === 0) {
                  setStoriesProErr('Primero genera la historia.');
                  return;
              }
              const title = `Historias Pro ∂˙ ${storiesProLevel} ∂˙ ${new Date().toLocaleDateString()}`;
              setGuionData(storiesProResult.scenes);
              setSceneIndex(0);
              setMode('dialogue');
              setShowCurrentTranslation(false);
              setIsDefaultScript(false);
              setActiveScriptTitle(title);
              setActiveSavedScriptId(null);
              setActiveTab('historia');
              stopAudio();
          };

          const appendPairToCustomLesson = (de, es) => {
              const d = String(de || '').trim();
              const e = String(es || '').trim();
              if (!d || !e) { alert('Falta alem«≠n o espa«Òol.'); return; }
              let lessonId = lexikonSaveLessonId;
              if (lessonId === '__new__') {
                  const t = (lexikonNewLessonTitle || '').trim() || `Lexikon ${new Date().toLocaleDateString()}`;
                  const newLesson = { id: Date.now().toString() + Math.random().toString(36).slice(2, 9), title: t, words: [{ de: d, es: e, diff: 0 }] };
                  const updated = [...customVocabLessons, newLesson];
                  setCustomVocabLessons(updated);
                  try { localStorage.setItem('mullerCustomVocab', JSON.stringify(updated)); } catch (err) {}
                  setLexikonSaveLessonId(newLesson.id);
                  setLexikonNewLessonTitle('');
                  alert(`Guardado en nueva lecci«¸n: ∂Æ${t}∂Ø. Puedes practicarla en Vocab.`);
                  return;
              }
              if (!lessonId) { alert('Elige una lecci«¸n o ∂ÆNueva lecci«¸nÉ?›∂Ø.'); return; }
              setCustomVocabLessons((prev) => {
                  let hit = false;
                  const next = prev.map((l) => {
                      if (l.id !== lessonId) return l;
                      hit = true;
                      if (l.words.some((w) => w.de === d && w.es === e)) return l;
                      return { ...l, words: [...l.words, { de: d, es: e, diff: 0 }] };
                  });
                  if (!hit) {
                      alert('No se encontr«¸ esa lecci«¸n.');
                      return prev;
                  }
                  try { localStorage.setItem('mullerCustomVocab', JSON.stringify(next)); } catch (err) {}
                  return next;
              });
              alert('Palabra a«Òadida a la lecci«¸n.');
          };

          const handleBxUserCardDelete = () => {
              const item = bxCurrentList[bxIndex];
              if (!item || !item._mullerUser || !item._mullerUid) return;
              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
              let srcCat = bxCategory === 'mix' ? (item._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, item._mullerUid)) : bxCategory;
              if (!srcCat) {
                  alert('No se encontr«¸ la categor«a de esta tarjeta.');
                  return;
              }
              if (!window.confirm('∂®Eliminar esta tarjeta solo de tu biblioteca local?')) return;
              setBxUserOverlay((prev) => {
                  const base = JSON.parse(JSON.stringify(normalizeBxPayload(prev)));
                  base[level][srcCat] = (base[level][srcCat] || []).filter((x) => x._mullerUid !== item._mullerUid);
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
          };

          const handleBxUserCardMove = () => {
              const item = bxCurrentList[bxIndex];
              if (!item || !item._mullerUser || !item._mullerUid) return;
              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
              let srcCat = bxCategory === 'mix' ? (item._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, item._mullerUid)) : bxCategory;
              if (!srcCat) {
                  alert('No se encontr«¸ la categor«a de origen.');
                  return;
              }
              const toCat = bxMoveTargetCat;
              if (srcCat === toCat) {
                  alert('Elige otra categor«a distinta.');
                  return;
              }
              setBxUserOverlay((prev) => {
                  const base = JSON.parse(JSON.stringify(normalizeBxPayload(prev)));
                  const fromArr = base[level][srcCat] || [];
                  const fi = fromArr.findIndex((x) => x._mullerUid === item._mullerUid);
                  if (fi === -1) return prev;
                  const moved = { ...fromArr[fi], _mullerCategory: toCat };
                  fromArr.splice(fi, 1);
                  if (!base[level][toCat]) base[level][toCat] = [];
                  base[level][toCat].push(moved);
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
          };

          const fillChromeAiFromScene = () => {
              try {
                  const idx = getActualSceneIndex();
                  const scene = guionData[idx];
                  if (!scene || !scene.text) { alert('No hay texto en la escena actual de Historia.'); return; }
                  const block = [scene.text, scene.translation ? '(' + scene.translation + ')' : ''].filter(Boolean).join('\n');
                  setChromeAiText(block);
                  setChromeAiLine('Texto cargado desde la escena ' + (idx + 1) + '.');
              } catch (e) { alert('No se pudo leer el guion.'); }
          };

          const runChromeLocalSummarize = async () => {
              const text = (chromeAiText || '').trim();
              if (text.length < 40) {
                  alert('Pega un texto m«≠s largo o usa É?oCargar escena actualÉ??.');
                  return;
              }
              if (!('Summarizer' in self)) {
                  setChromeAiLine('Tu navegador no expone el resumidor local. Usa Google Chrome 138+ en escritorio con IA integrada. En Edge puede ir detr«≠s de flags; revisa la documentaci«¸n de Built-in AI.');
                  setChromeAiOut('');
                  return;
              }
              setChromeAiBusy(true);
              setChromeAiOut('');
              setChromeAiLine('ComprobandoÉ?›');
              try {
                  const Summarizer = self.Summarizer;
                  const availability = await Summarizer.availability();
                  if (availability === 'unavailable') {
                      setChromeAiLine('El modelo local no est«≠ disponible en este equipo (requisitos de hardware, espacio libre en el perfil de Chrome, o pol«tica).');
                      setChromeAiBusy(false);
                      return;
                  }
                  setChromeAiLine('Preparando modelo local (la primera vez puede descargarse)É?›');
                  const summarizer = await Summarizer.create({
                      type: 'key-points',
                      format: 'markdown',
                      length: 'short',
                      expectedInputLanguages: ['de', 'en'],
                      outputLanguage: 'es',
                      sharedContext: 'Estudiante de alem«≠n TELC; res«ßmenes claros en espa«Òol.',
                      monitor(m) {
                          m.addEventListener('downloadprogress', (e) => {
                              const p = typeof e.loaded === 'number' ? Math.round(e.loaded * 100) : 0;
                              setChromeAiLine('Descarga del modelo en tu PCÉ?› ' + p + '%');
                          });
                      }
                  });
                  setChromeAiLine('Generando resumen (proceso local)É?›');
                  const summary = await summarizer.summarize(text, { context: 'Texto o di«≠logo en alem«≠n para estudio.' });
                  setChromeAiOut(typeof summary === 'string' ? summary : String(summary));
                  setChromeAiLine('Listo: sin enviar datos a los servidores de M«¨ller.');
                  try { if (typeof summarizer.destroy === 'function') summarizer.destroy(); } catch (e2) {}
              } catch (err) {
                  setChromeAiLine('Error: ' + (err && err.message ? err.message : String(err)));
              } finally {
                  setChromeAiBusy(false);
              }
          };

          const loadSavedScript = (script) => {
              setGuionData(JSON.parse(script.data)); setActiveScriptTitle(script.title); setIsDefaultScript(false);
              setActiveSavedScriptId(script && script.id != null ? String(script.id) : null);
              setSceneIndex(0); setMode('dialogue'); stopAudio(); resetModes(); setIsReviewing(false); setActiveTab('historia');
          };

          const loadDefaultGuion = () => {
              try {
                  setGuionData(JSON.parse(JSON.stringify(DEFAULT_GUION)));
              } catch (e) {
                  setGuionData(DEFAULT_GUION);
              }
              setActiveScriptTitle('Lektion 17: Kunst');
              setIsDefaultScript(true);
              setActiveSavedScriptId(null);
              setSceneIndex(0);
              setMode('dialogue');
              stopAudio();
              resetModes();
              setIsReviewing(false);
              setActiveTab('historia');
          };

          const deleteSavedScript = (e, script) => {
              e.preventDefault();
              e.stopPropagation();
              const sid = script && script.id != null ? String(script.id) : '';
              if (!sid) {
                  alert('Este guion no tiene id interno; recarga la p«≠gina y prueba de nuevo.');
                  return;
              }
              if (!window.confirm('∂®Eliminar este guion de la lista?')) return;
              const stripBx = window.confirm(
                  '∂®Quitar tambi«∏n de B1/B2 las frases que a«Òadiste con ∂ÆDistribuir texto∂Ø mientras ten«as cargado este guion en Historia?\n\n' +
                  '(Solo afecta a tarjetas nuevas vinculadas a este guion. Las que enviaste antes sin esta vinculaci«¸n, o el contenido del archivo b1-b2-database.json, no se tocan.)'
              );
              setSavedScripts((prev) => {
                  const next = prev.filter((s) => String(s.id) !== sid);
                  try { localStorage.setItem('mullerScripts', JSON.stringify(next)); } catch (err) {}
                  return next;
              });
              if (stripBx) {
                  setBxUserOverlay((prev) => {
                      const stripped = mullerStripBxOverlayBySourceScriptId(prev, sid);
                      try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(stripped)); } catch (err) {}
                      return stripped;
                  });
                  setBxIndex(0);
                  setBxImportSummary('');
              }
              if (String(activeSavedScriptId) === sid) setActiveSavedScriptId(null);
          };

          const handleGenerateAIStory = () => {
              setIsGeneratingStory(true);
              setTimeout(() => {
                  let wordsArray = aiCustomWords.split(',').map(w => w.trim()).filter(w => w);
                  let mockLongStory = [
                      { speaker: 'Erz«œhler', text: 'Es war ein kalter Morgen in der gro«Yen Stadt.', translation: 'Era una fr«a ma«Òana en la gran ciudad.' },
                      { speaker: 'Lukas', text: 'Ich muss heute so viel erledigen. Wo fange ich an?', translation: 'Tengo tanto que hacer hoy. ∂®Por d«¸nde empiezo?' },
                      { speaker: 'Anna', text: 'Vergiss nicht, dass wir sp«œter zusammen essen gehen.', translation: 'No olvides que luego vamos a comer juntos.' },
                      { speaker: 'Lukas', text: 'Nat«¨rlich nicht! Ich habe den Tisch schon reserviert.', translation: '∂≠Por supuesto que no! Ya he reservado la mesa.' },
                      { speaker: 'Anna', text: 'Das ist wunderbar. Ich freue mich wirklich darauf.', translation: 'Eso es maravilloso. De verdad me alegro de ello.' },
                      { speaker: 'Erz«œhler', text: 'Sp«œter am Abend trafen sie sich im neuen Restaurant.', translation: 'M«≠s tarde en la noche se encontraron en el nuevo restaurante.' },
                      { speaker: 'Kellner', text: 'Guten Abend! Was darf ich Ihnen heute bringen?', translation: '∂≠Buenas tardes! ∂®Qu«∏ les puedo traer hoy?' },
                      { speaker: 'Lukas', text: 'Wir h«œtten gerne die Speisekarte und ein Wasser, bitte.', translation: 'Nos gustar«a la carta y un agua, por favor.' },
                      { speaker: 'Anna', text: 'Und ich h«œtte gerne ein Glas Rotwein.', translation: 'Y a m« me gustar«a una copa de vino tinto.' },
                      { speaker: 'Kellner', text: 'Kommt sofort! Haben Sie schon gew«œhlt?', translation: '∂≠Enseguida! ∂®Ya han elegido?' }
                  ];
                  if (wordsArray.length > 0) {
                      wordsArray.forEach((word, index) => {
                          let i = (index + 1) * 2; 
                          if (i >= mockLongStory.length) i = mockLongStory.length - 1;
                          mockLongStory.splice(i, 0, {
                              speaker: 'Anna', text: `«obrigens, erinnerst du dich an ${word}? Das war eine interessante Erfahrung.`,
                              translation: `Por cierto, ∂®te acuerdas de ${word}? Fue una experiencia interesante.`,
                              vocab: [{ de: word, es: 'Palabra Custom', diff: 1 }]
                          });
                      });
                  }
                  setGuionData(mockLongStory); setActiveScriptTitle(`AI Generated: ${aiLevel} - ${aiTheme}`);
                  setIsDefaultScript(false); setActiveSavedScriptId(null); setSceneIndex(0); setMode('dialogue'); stopAudio(); resetModes(); setIsReviewing(false);
                  setIsGeneratingStory(false); setActiveTab('historia'); setAiCustomWords(""); 
              }, 3000);
          };



          const playSceneAudio = (text, speaker) => {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = 'de-DE';
              if (speaker === 'Lukas') { utterance.voice = getVoice('de', 'male'); utterance.pitch = 1.1; } 
              else if (speaker === 'Elena' || speaker === 'Anna') { utterance.voice = getVoice('de', 'female'); utterance.pitch = 1.2; } 
              else if (speaker.includes('Weber') || speaker === 'Professor' || speaker === 'Erz«œhler') { utterance.voice = getVoice('de', 'male', true); utterance.pitch = 0.8; } 
              else { utterance.voice = getVoice('de', 'male'); }
              utterance.rate = (speaker.includes('Weber') ? 0.9 : 1.0) * playbackRate;
              if (fluesternMode) { utterance.volume = 0.3; utterance.pitch = utterance.pitch * 0.8; } 
              else { utterance.volume = 1.0; }
              return utterance;
          };

          useEffect(() => {
            if (!isPlaying || !voicesLoaded || mode !== 'dialogue' || activeTab !== 'historia') return;
            window.speechSynthesis.cancel(); 
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            const actualIdx = getActualSceneIndex();
            const currentScene = guionData[actualIdx];
            if ((currentScene.speaker === roleplayChar || roleplayChar === 'Todos') && mode === 'dialogue' && !podcastMode) {
                setMode('roleplay_wait'); setIsPlaying(false); return; 
            }
           // Limpiamos el texto de s«mbolos que el motor de voz lee por error (.;)
const audioCleanText = sanitizeHistoriaSpeechText(currentScene.text).replace(/[.;;]/g, '.'); 
const sentenceUtterance = playSceneAudio(audioCleanText, currentScene.speaker);
            let utterances = [sentenceUtterance];
            if (currentScene.vocab && currentScene.vocab.length > 0 && !podcastMode && !diktatMode && !puzzleMode && !declinaMode && !artikelSniperMode) {
                currentScene.vocab.forEach(v => {
                    const uDe = new SpeechSynthesisUtterance(v.de);
                    uDe.lang = 'de-DE'; uDe.voice = getVoice('de', 'female'); uDe.rate = 0.85;
                    utterances.push(uDe);
                    const uEs = new SpeechSynthesisUtterance(v.es);
                    uEs.lang = 'es-ES'; uEs.voice = getVoice('es', 'male'); uEs.rate = 0.9;
                    utterances.push(uEs);
                });
            }
            if (podcastMode) {
                const esUtter = new SpeechSynthesisUtterance(currentScene.translation || "Traducci«¸n no disponible");
                esUtter.lang = 'es-ES'; esUtter.voice = getVoice('es', 'male'); esUtter.rate = 1.0;
                utterances = [sentenceUtterance, esUtter];
            }
            utterances[utterances.length - 1].onend = () => {
                if (!isPlayingRef.current) return;
                if (diktatMode || puzzleMode || declinaMode || artikelSniperMode) { setIsPlaying(false); return; } 
                if (podcastMode) timeoutRef.current = setTimeout(() => proceedToNextStage(), 1500);
                else timeoutRef.current = setTimeout(() => proceedToNextStage(), 800);
            };
            utterances.forEach(u => window.speechSynthesis.speak(u));
            return () => { window.speechSynthesis.cancel(); if (timeoutRef.current) clearTimeout(timeoutRef.current); };
          }, [sceneIndex, mode, isPlaying, voicesLoaded, playbackRate, roleplayChar, diktatMode, puzzleMode, declinaMode, artikelSniperMode, isReviewing, fluesternMode, activeTab, podcastMode, ttsPrefsEpoch]);

          const trySaveGrammarStructure = () => {
              const text = guionData[getActualSceneIndex()].text;
              const translation = guionData[getActualSceneIndex()].translation || "";
              let found = false;
              let newGrammar = [...userStats.difficultGrammar];
              GRAMMAR_PATTERNS.forEach(p => {
                  if (text.match(p.regex)) {
                      if (!newGrammar.some(g => g.base === p.base)) { newGrammar.push({ base: p.base, exampleDe: text, exampleEs: translation }); found = true; }
                  }
              });
              if (found) { saveProgress({ difficultGrammar: newGrammar }); alert("∂≠Estructura autom«≠tica detectada y guardada en tu mazo!"); } 
              else { setShowGrammarPrompt(true); }
          };

          const handleCustomGrammarSave = () => {
              if(!customGrammarInput.trim()) return;
              const text = guionData[getActualSceneIndex()].text;
              const translation = guionData[getActualSceneIndex()].translation || "";
              let newGrammar = [...userStats.difficultGrammar];
              newGrammar.push({ base: customGrammarInput, exampleDe: text, exampleEs: translation });
              saveProgress({ difficultGrammar: newGrammar });
              setShowGrammarPrompt(false); setCustomGrammarInput(""); alert("∂≠Estructura personalizada guardada con «∏xito!");
          };

          const generateTutorFeedback = (text) => {
              let feedback = [];
              const tLower = text.toLowerCase();
              if (tLower.match(/\b(weil|dass|obwohl|wenn|als|damit|ob|bevor|nachdem)\b/i)) feedback.push("–YYú **Nebensatz (Subordinada):** Has usado un conector subordinante. El verbo conjugado va a la «ßltima posici«¸n de la frase.");
              if (tLower.match(/\b(deshalb|deswegen|darum|trotzdem|dann|danach|au«Yerdem)\b/i)) feedback.push("–YYˇ **Hauptsatz (Inversi«¸n):** Conector en Posici«¸n 1. Inmediatamente despu«∏s tiene que ir el verbo (Pos 2), y luego el sujeto.");
              if (tLower.match(/\b(und|aber|oder|denn|sondern)\b/i)) feedback.push("–YYΩ **Conector ADUSO (Posici«¸n 0):** Une dos frases sin alterar el orden normal (Sujeto + Verbo).");
              if (tLower.match(/\b(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\b.*\b(ge[a-z«œ«Ù«¨«Y]+t|ge[a-z«œ«Ù«¨«Y]+en|.+[ie]rt)\b/i)) feedback.push("–Y¯ã˜? **Perfekt:** Auxiliar (haben/sein) en Posici«¸n 2 y Participio al final.");
              if (tLower.match(/\b(wurde|wurdest|wurden|wurdet|war|warst|waren|wart|hatte|hattest|hatten|hattet|gab|musste|konnte|wollte|sollte|durfte)\b/i) && !tLower.match(/\b(worden)\b/i)) feedback.push("–Y"- **Pr«œteritum:** Pasado simple. Usado para verbos auxiliares, modales o narraci«¸n.");
              if (tLower.match(/\b(wurde|worden)\b/i) || (tLower.match(/\b(werden|wird|werden|werdet)\b/i) && tLower.match(/\b(ge[a-z«œ«Ù«¨«Y]+t|ge[a-z«œ«Ù«¨«Y]+en)\b/i))) feedback.push("–Y?>ã˜? **Passiv:** 'Werden' + Participio II. Lo importante es la acci«¸n, no el sujeto.");
              if (tLower.match(/\b(muss|musst|m«¨ssen|kann|kannst|k«Ùnnen|darf|darfst|d«¨rfen|soll|sollst|sollen|will|willst|wollen|m«Ùchte|m«Ùchtest|m«Ùchten)\b/i)) feedback.push("–Y'¶ **Modalverben:** Verbo modal en Pos 2, obliga al verbo principal en Infinitivo al final.");
              if (tLower.match(/\b(an|ein|auf|zu|mit|aus|vor|nach|ab|her|hin|los|teil)\s*[.,!?]*$/i)) feedback.push("Éo'ã˜? **Trennbare Verben:** El prefijo del verbo se ha separado al final de la frase.");
              if (tLower.match(/\b(aus|bei|mit|nach|seit|von|zu|ab)\b/i)) feedback.push("–Y"Ê **Dativo (Preposici«¸n):** Preposici«¸n que rige Dativo estricto.");
              if (tLower.match(/\b(durch|f«¨r|gegen|ohne|um)\b/i)) feedback.push("–Y"Ô **Acusativo (Preposici«¸n):** Preposici«¸n que rige Acusativo estricto.");
              if (tLower.match(/\b(in|an|auf|neben|hinter|«¨ber|unter|vor|zwischen)\b/i)) feedback.push("–YY≠ **Wechselpr«œposition:** Rige Dativo (Wo?) o Acusativo (Wohin?).");
              GRAMMAR_PATTERNS.forEach(p => { if (text.match(p.regex)) feedback.push(`–YOY **Verbo con Preposici«¸n Fija:** ${p.tooltip}.`); });
              return feedback.join("\n\n") || "–YYΩ **Hauptsatz:** Estructura est«≠ndar perfecta.";
          };

          const showAITutor = () => {
              setTutorMessage(generateTutorFeedback(guionData[getActualSceneIndex()].text));
              setShowTutor(true);
          };

          const handleDiktatCheck = () => {
              if (!diktatInput.trim()) { alert("Por favor, escribe lo que has escuchado primero."); return; }
              setShowDiktatResult(true);
              const cleanText = (t) => t.toLowerCase().replace(/[.,!?]/g, '').trim();
              const originalText = cleanText(guionData[getActualSceneIndex()].text);
              const typedText = cleanText(diktatInput);
              if (originalText !== typedText) {
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false);
                  setDiktatMotivationMsg(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Sigue intent«≠ndolo.');
                  if (!isReviewing && !userStats.failedDiktatScenes.includes(sceneIndex)) {
                      saveProgress({ failedDiktatScenes: [...userStats.failedDiktatScenes, sceneIndex], diktatAttempts: userStats.diktatAttempts + 1, activityByDay: mergeActivityPoints(6) });
                  }
                  deductHeart();
              } else {
                  setDiktatMotivationMsg('');
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true);
                  saveProgress({ coins: userStats.coins + 5, diktatCorrect: userStats.diktatCorrect + 1, diktatAttempts: userStats.diktatAttempts + 1, activityByDay: mergeActivityPoints(25) });
              }
          };

          const handleVoiceStart = async (targetText = null, evalOpts = {}) => {
              if (userStats.hearts <= 0 && evalOpts.mode !== 'shadow') { setShowDeathModal(true); return; }
              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SpeechRecognition) { alert("Tu navegador no soporta esta funci«¸n. Usa Google Chrome."); return; }
              const ok = await mullerEnsureMicPermission({ autoPrompt: true, showToast: true });
              if (!ok) {
                  setGrammarPolizeiMsg('Sin permiso de micr«¸fono. Puedes seguir con texto y audio.');
                  return;
              }
              if (recognitionRef.current) {
                  try { recognitionRef.current.stop(); } catch (e) {}
              }
              const recognition = new SpeechRecognition();
              recognition.lang = 'de-DE';
              const mobileStt = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || ''));
              /* continuous: una sola sesi«¸n por pulsaci«¸n; en m«¸vil interimResults=false reduce duplicados del motor */
              recognition.continuous = true;
              recognition.interimResults = !mobileStt;
              recognition.maxAlternatives = mobileStt ? 1 : 3;
              recognitionRef.current = recognition;
              spokenTextRef.current = "";
              speechFinalRef.current = "";
              const opts = { mode: evalOpts.mode || 'default' };
              const pickAlt = (res) => {
                  let alt = res[0];
                  for (let j = 1; j < res.length; j++) {
                      const cj = res[j].confidence;
                      const cb = alt.confidence;
                      if (typeof cj === 'number' && (typeof cb !== 'number' || cj >= cb)) alt = res[j];
                  }
                  return alt;
              };
              recognition.onstart = () => {
                  setIsListening(true);
                  setSpokenText("");
                  speechFinalRef.current = "";
                  spokenTextRef.current = "";
                  setPronunciationScore(null);
                  setGrammarPolizeiMsg("");
                  setPronunciationFeedback([]);
              };
              recognition.onresult = (event) => {
                  const finals = [];
                  let interim = "";
                  for (let i = event.resultIndex; i < event.results.length; i++) {
                      const res = event.results[i];
                      const alt = pickAlt(res);
                      const raw = (alt.transcript || "").trim();
                      if (!raw) continue;
                      if (res.isFinal) finals.push(raw);
                      else interim = raw;
                  }
                  if (finals.length) {
                      if (mobileStt) {
                          if (finals.length === 1) {
                              const f = finals[0];
                              const cur = speechFinalRef.current || "";
                              if (!cur) speechFinalRef.current = f;
                              else if (f.startsWith(cur.trim())) speechFinalRef.current = f;
                              else if (cur.startsWith(f) && f.length < cur.length) { /* mantener frase m«≠s larga */ }
                              else if (f.length >= cur.length && (f.indexOf(cur) >= 0 || cur.indexOf(f) >= 0)) speechFinalRef.current = f.length >= cur.length ? f : cur;
                              else speechFinalRef.current = mergeSpeechFinalChunk(cur, f);
                          } else {
                              const chunk = finals.join(" ").trim();
                              speechFinalRef.current = mergeSpeechFinalChunk(speechFinalRef.current, chunk);
                          }
                      } else {
                          for (const f of finals) {
                              speechFinalRef.current = mergeSpeechFinalChunk(speechFinalRef.current, f);
                          }
                      }
                  }
                  const display = (speechFinalRef.current + (interim ? (speechFinalRef.current ? " " : "") + interim : "")).trim();
                  const cleaned = collapseStutterRepeats(display);
                  spokenTextRef.current = cleaned;
                  setSpokenText(cleaned);
              };
              recognition.onerror = (event) => {
                  console.error("Error de micro:", event.error);
                  setIsListening(false);
                  if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                      alert("Permiso de micr«¸fono denegado. Activa el mic en la barra del navegador.");
                  }
              };
              recognition.onend = () => {
                  setIsListening(false);
                  evaluatePronunciation(targetText, spokenTextRef.current || "", opts);
              };
              try { recognition.start(); } catch (e) {}
          };

          const handleVoiceStop = () => {
              const r = recognitionRef.current;
              if (!r) return;
              try { r.stop(); } catch (e) {}
          };

          const micMouseDownGuard = (fn) => () => {
              if (Date.now() < micIgnoreMouseUntilRef.current) return;
              fn();
          };
          const micTouchStartGuard = (fn) => () => {
              micIgnoreMouseUntilRef.current = Date.now() + 450;
              fn();
          };

          const evaluatePronunciation = (targetText, transcript, opts = {}) => {
              const mode = opts.mode || 'default';
              if (!transcript || transcript.trim() === "") {
                  if (mode === 'shadow') {
                      setGrammarPolizeiMsg("No se detect«¸ voz. Comprueba el micr«¸fono o habla m«≠s cerca.");
                      setPronunciationScore(null);
                      setPronunciationFeedback([]);
                      if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
                  }
                  return;
              }
              const textToCompare = sanitizeHistoriaSpeechText(targetText || guionData[getActualSceneIndex()].text);
              const cleanOrig = normalizeGermanSpeechText(textToCompare);
              const cleanSpoken = normalizeGermanSpeechText(collapseStutterRepeats(transcript));
              if (!cleanOrig) return;
              const distance = levenshteinDistance(cleanOrig, cleanSpoken);
              const maxLength = Math.max(cleanOrig.length, cleanSpoken.length, 1);
              let scorePhrase = Math.round(((maxLength - distance) / maxLength) * 100);
              const origWords = cleanOrig.split(/\s+/).filter(Boolean);
              const spokenWords = cleanSpoken.split(/\s+/).filter(Boolean);
              const feedbackArr = matchGermanWordsSequential(origWords, spokenWords);
              const correctN = feedbackArr.filter((f) => f.correct).length;
              const wordRatio = origWords.length ? correctN / origWords.length : 1;
              let scoreWords = Math.round(wordRatio * 100);
              let score = Math.round(scorePhrase * 0.45 + scoreWords * 0.55);
              let polizeiMsg = "";
              let penalty = false;
              if (mode !== 'shadow' && cleanOrig.includes("wegen des") && cleanSpoken.includes("wegen dem")) {
                  score -= 20;
                  polizeiMsg = "–Ys˘ Grammatik-Polizei: Has external DATIVO en vez de GENITIVO. -1 É?œã˜?";
                  penalty = true;
              }
              const finalScore = score > 100 ? 100 : score < 0 ? 0 : score;
              if (mode === 'shadow') setGrammarPolizeiMsg("");
              else setGrammarPolizeiMsg(polizeiMsg);
              setPronunciationScore(finalScore);
              setPronunciationFeedback(feedbackArr);
              if (mode === 'shadow') {
                  saveProgress({
                      pronunciationAttempts: (userStats.pronunciationAttempts || 0) + 1,
                      pronunciationTotalScore: (userStats.pronunciationTotalScore || 0) + finalScore,
                      ...(finalScore >= 85 ? { coins: userStats.coins + 2, activityByDay: mergeActivityPoints(8) } : {}),
                  });
                  if (window.__mullerNotifyExerciseOutcome) {
                      window.__mullerNotifyExerciseOutcome(finalScore >= 75);
                  }
                  return;
              }
              if (penalty || finalScore < 50) { window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false); deductHeart(); }
              else {
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true);
                  if (finalScore >= 90) saveProgress({ coins: userStats.coins + 5, activityByDay: mergeActivityPoints(12) });
              }
          };

          const playVocabAudio = () => {
              if(vocabDisplayList.length === 0) return;
              window.speechSynthesis.cancel();
              const currentVocab = vocabDisplayList[vocabReviewIndex];
              const cleanDeAudio = currentVocab.de.replace(/^[0-9]+[.\-):\]]*\s*/g, '').replace(/^[a-zA-Z«œ«Ù«¨«Y«"«-«o]{1,10}\s*[.:]\s*/g, '').replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]|\u{FE0F}/gu, '').trim();
              const cleanEsAudio = currentVocab.es.replace(/^[0-9]+[.\-):\]]*\s*/g, '').replace(/^[a-zA-Z«Ò«'«≠«∏««¸«ß«?«%«?«"«s]{1,10}\s*[.:]\s*/g, '').replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]|\u{FE0F}/gu, '').trim();
              const utterDe = new SpeechSynthesisUtterance(cleanDeAudio);
              utterDe.lang = 'de-DE'; utterDe.voice = getVoice('de', 'female'); utterDe.rate = 0.85;
              utterDe.onend = () => {
                  setTimeout(() => { setShowVocabTranslation(true);
                     const utterEs = new SpeechSynthesisUtterance(cleanEsAudio);
                     utterEs.lang = 'es-ES'; utterEs.voice = getVoice('es', 'male'); utterEs.rate = 0.9;
                     window.speechSynthesis.speak(utterEs); }, 500); 
              };
              window.speechSynthesis.speak(utterDe);
          };

          const handleVocabDifficulty = (level) => {
            const currentWord = vocabDisplayList[vocabReviewIndex];
            if (!currentWord) return;
            let newDiff = [...userStats.difficultVocab];
            let newNorm = [...userStats.normalVocab];
            if (level === 'hard') { if (!newDiff.some(w => w.de === currentWord.de)) newDiff.push(currentWord); } 
            else if (level === 'normal') { if (!newNorm.some(w => w.de === currentWord.de)) newNorm.push(currentWord); }
            if (window.__mullerNotifyExerciseOutcome) {
                window.__mullerNotifyExerciseOutcome(level === 'easy' || level === 'normal');
            }
            mullerBumpVocabStreakRating();
            saveProgress({ difficultVocab: newDiff, normalVocab: newNorm, activityByDay: mergeActivityPoints(15) });
            try {
                const nextMap = mullerApplyVocabSrsRating(mullerGetVocabSrsMap(), currentWord, level);
                mullerSetVocabSrsMap(nextMap);
                setVocabSrsEpoch((e) => e + 1);
            } catch (e) {}
            if (vocabReviewIndex < vocabDisplayList.length - 1) { setVocabReviewIndex(prev => prev + 1); setShowVocabTranslation(false); } 
            else {
                window.__mullerPlaySfx && window.__mullerPlaySfx('complete');
                setCelebrationModal({ title: '∂≠Lista completada!', subtitle: 'Has repasado todas las tarjetas de esta sesi«¸n.', xp: 15, coins: 10 });
                saveProgress({ xp: userStats.xp + 15, coins: userStats.coins + 10, activityByDay: mergeActivityPoints(35) });
                setActiveTab('guiones');
            }
          };

          const startPractice = (type) => {
              if (type === 'diff' && (!userStats.difficultVocab || userStats.difficultVocab.length === 0)) { alert("Tu mazo de Vocabulario Dif«cil est«≠ vac«o."); return; }
              if (type === 'norm' && (!userStats.normalVocab || userStats.normalVocab.length === 0)) { alert("Tu mazo de Vocabulario Normal est«≠ vac«o."); return; }
              if (type === 'grammar' && (!userStats.difficultGrammar || userStats.difficultGrammar.length === 0)) { alert("Tu mazo de Gram«≠tica est«≠ vac«o."); return; }
              setPracticeActive(type); setPracticeIndex(0); setPracticeShowTrans(false);
          };

          const playPracticeAudio = (text) => {
              window.speechSynthesis.cancel();
              const utterDe = new SpeechSynthesisUtterance(text);
              utterDe.lang = 'de-DE'; utterDe.voice = getVoice('de', 'male'); utterDe.rate = 0.9;
              window.speechSynthesis.speak(utterDe);
          };

          const nextPracticeWord = () => {
              if (practiceShowTrans && window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
              const list = practiceActive === 'diff' ? userStats.difficultVocab : (practiceActive === 'norm' ? userStats.normalVocab : userStats.difficultGrammar);
              if (practiceIndex < list.length - 1) { setPracticeIndex(practiceIndex + 1); setPracticeShowTrans(false); saveProgress({ activityByDay: mergeActivityPoints(6) }); } 
              else {
                  window.__mullerPlaySfx && window.__mullerPlaySfx('complete');
                  setCelebrationModal({ title: '∂≠Sesi«¸n de mazos!', subtitle: '+20 XP ∂˙ +5 monedas', xp: 20, coins: 5 });
                  saveProgress({ xp: userStats.xp + 20, coins: userStats.coins + 5, activityByDay: mergeActivityPoints(30) });
                  setPracticeActive(null);
              }
          };

          const getArticleVisual = (word) => {
            if (!word) return null;
            if (word.startsWith('der ')) return <span className="text-blue-400 mr-2">–Y"Ê</span>;
            if (word.startsWith('die ')) return <span className="text-red-400 mr-2">–Y"Ô</span>;
            if (word.startsWith('das ')) return <span className="text-green-400 mr-2">–YYΩ</span>;
            return null;
          };

          const renderHighlightedText = (text, vocabList) => {
            let htmlText = text;
            if (artikelSniperMode) { const artRegex = /\b(der|die|das|den|dem|des)\b/gi; htmlText = htmlText.replace(artRegex, `<span class="bg-red-800/40 text-red-200 border-b border-red-500/60 px-2 mx-0.5 rounded-sm font-bold shadow-sm">[ ??? ]</span>`); }
            if (declinaMode) { const declRegex = /\b(d|ein|kein|mein|dein|sein|ihr|unser|euer)(er|en|em|es|e|as|ie)\b/gi; htmlText = htmlText.replace(declRegex, `$1<span class="text-pink-300 font-mono bg-pink-800/30 border-b border-pink-500/60 px-1 mx-0.5 rounded shadow-sm">[ _ ]</span>`); }
            if (vocabList && vocabList.length > 0) {
                const sortedVocab = [...vocabList].sort((a, b) => b.de.length - a.de.length);
                sortedVocab.forEach(v => {
                   let searchWord = v.de.replace(/^(der|die|das|sich)\s/i, '').trim();
                   const safeWord = searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                   const regex = new RegExp(`(?![^<]*>)(^|[^a-z«œ«Ù«¨«YA-Z«"«-«o†ßz])(${safeWord})([^a-z«œ«Ù«¨«YA-Z«"«-«o†ßz]|$)`, 'gi');
                   if (lueckentextMode) htmlText = htmlText.replace(regex, `$1<span class="bg-gray-800 text-transparent border-b border-yellow-500/70 rounded px-3 mx-1 select-none" title="${v.es}">[ ??? ]</span>$3`);
                   else htmlText = htmlText.replace(regex, `$1<span class="bg-amber-500/20 text-amber-100 border-b border-amber-400/60 px-1 mx-0.5 rounded-sm font-bold shadow-sm" title="Traducci«¸n: ${v.es}">$2</span>$3`);
                });
            }
            GRAMMAR_PATTERNS.forEach(p => { htmlText = htmlText.replace(p.regex, `<span class="bg-cyan-800/40 text-cyan-200 border-b border-cyan-400/60 px-1 mx-0.5 rounded-sm shadow-sm" title="${p.tooltip}">$1</span>`); });
            if (tempusMode) {
                Object.keys(TEMPUS_DICT).forEach(verb => {
                    const safeVerb = verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`(?![^<]*>)\\b(${safeVerb})\\b`, 'gi');
                    htmlText = htmlText.replace(regex, `<span class="tempus-clickable text-blue-100 font-bold underline decoration-blue-400/70 decoration-2 underline-offset-4 cursor-pointer px-0.5 rounded" data-tempus-verb="$1" title="Toca para ver infinitivo y tiempos">$1</span>`);
                });
                const genericInfRegex = /(?![^<]*>)\b([a-z«œ«Ù«¨«Y]{4,}(?:en|eln|ern))\b/gi;
                htmlText = htmlText.replace(genericInfRegex, `<span class="tempus-clickable text-blue-100 font-bold underline decoration-blue-400/70 decoration-2 underline-offset-4 cursor-pointer px-0.5 rounded" data-tempus-verb="$1" title="Toca para ver infinitivo y tiempos">$1</span>`);
            }
            const connRegex = new RegExp(`(?![^<]*>)\\b(${CONN_LIST.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(connRegex, `<span class="text-purple-300 font-bold underline decoration-purple-500/70 decoration-2 underline-offset-4" title="Conector">$1</span>`);
            const datRegex = new RegExp(`(?![^<]*>)\\b(${PREP_DAT.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(datRegex, `<span class="text-blue-300 font-bold underline decoration-blue-500/70 decoration-2 underline-offset-4" title="Preposici«¸n Dativo (Est«≠tico)">$1</span>`);
            const akkRegex = new RegExp(`(?![^<]*>)\\b(${PREP_AKK.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(akkRegex, `<span class="text-red-300 font-bold underline decoration-red-500/70 decoration-2 underline-offset-4" title="Preposici«¸n Acusativo (Movimiento)">$1</span>`);
            const wechRegex = new RegExp(`(?![^<]*>)\\b(${PREP_WECHSEL.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(wechRegex, `<span class="text-yellow-500/90 font-bold underline decoration-yellow-600/70 decoration-2 underline-offset-4" title="Wechselpr«œposition (Mixta)">$1</span>`);
            return (
                <div
                    className="leading-loose inline"
                    onClick={(e) => {
                        if (!tempusMode) return;
                        const t = e && e.target && e.target.closest ? e.target.closest('[data-tempus-verb]') : null;
                        if (!t) return;
                        const picked = t.getAttribute('data-tempus-verb');
                        const info = resolveTempusVerbInfo(picked);
                        if (info) setTempusSelectedVerb(info);
                    }}
                    dangerouslySetInnerHTML={{ __html: htmlText }}
                />
            );
          };

          const renderDiktatDiff = (original, typed) => {
              const cleanWord = (w) => w.toLowerCase().replace(/[.,!?]/g, '').trim();
              const origWords = original.split(/\s+/).filter(w=>w);
              const typedWords = typed.split(/\s+/).filter(w=>w);
              return (
                  <div className="flex flex-wrap gap-2 text-2xl md:text-3xl font-medium justify-center bg-gray-900 p-4 md:p-6 rounded-xl border border-gray-700 leading-loose w-full">
                      {origWords.map((word, i) => {
                          const tWord = typedWords[i] || "";
                          const isCorrect = cleanWord(word) === cleanWord(tWord);
                          if (isCorrect) return <span key={i} className="text-green-400">{word}</span>;
                          else return (
                              <div key={i} className="flex flex-col items-center mx-1">
                                  <span className="text-red-400 line-through decoration-red-500 text-base md:text-xl opacity-70">{tWord || "___"}</span>
                                  <span className="text-green-300 border-b border-green-500 font-bold bg-green-900/30 px-1 rounded text-sm md:text-base">{word}</span>
                              </div>
                          );
                      })}
                  </div>
              );
          };

          const exportToAnki = (type) => {
            let csvContent = "data:text/csv;charset=utf-8,";
            if (type === 'vocab_diff') {
                if (!userStats.difficultVocab || userStats.difficultVocab.length === 0) { alert("Vac«o."); return; }
                userStats.difficultVocab.forEach((v) => { csvContent += `"${v.de}","${v.es}<br><small>TELC B1</small>","Dificil"\r\n`; });
            } else if (type === 'vocab_norm') {
                if (!userStats.normalVocab || userStats.normalVocab.length === 0) { alert("Vac«o."); return; }
                userStats.normalVocab.forEach((v) => { csvContent += `"${v.de}","${v.es}<br><small>TELC B1</small>","Repaso"\r\n`; });
            } else {
                if (!userStats.difficultGrammar || userStats.difficultGrammar.length === 0) { alert("Vac«o."); return; }
                userStats.difficultGrammar.forEach((g) => { csvContent += `"${g.base} (Verbo+Prep)","${g.exampleDe}<br><small>${g.exampleEs}</small>","Dificil"\r\n`; });
            }
            const encodedUri = encodeURI(csvContent); const link = document.createElement("a"); link.setAttribute("href", encodedUri); 
            link.setAttribute("download", `Anki_${type}_B1.csv`);
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
          };

          const exportScriptPDF = () => {
            const printWindow = window.open('', '_blank');
            if (!printWindow) { alert("Permite las ventanas emergentes para generar el PDF."); return; }
            const escPdf = (s) => String(s ?? '')
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const genDate = new Date().toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
            const totalScenes = guionData.length;
            let htmlContent = `
                <html>
                <head>
                    <title>Guion: ${escPdf(activeScriptTitle)}</title>
                    <style>
                        body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; padding: 28px; line-height: 1.55; max-width: 920px; margin: 0 auto; }
                        h1 { color: #b91c1c; text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 12px; font-size: 26px; }
                        .meta { text-align: center; color: #64748b; margin-bottom: 8px; font-size: 13px; }
                        .meta strong { color: #475569; }
                        h2 { color: #1e3a8a; border-bottom: 2px solid #93c5fd; padding-bottom: 5px; margin-top: 36px; font-size: 18px; }
                        .scene { margin-bottom: 28px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.06); page-break-inside: avoid; }
                        .scene-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
                        .scene-num { font-size: 12px; font-weight: 800; color: #94a3b8; letter-spacing: 0.06em; text-transform: uppercase; }
                        .speaker { font-weight: 900; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; }
                        .badge-redem { font-size: 11px; background: linear-gradient(90deg,#f97316,#eab308); color: white; padding: 3px 10px; border-radius: 999px; font-weight: 800; }
                        .block-de { margin-bottom: 14px; }
                        .label-row { font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
                        .label-es { color: #047857; }
                        .text-de { font-size: 19px; font-weight: 700; margin: 0; color: #0f172a; line-height: 1.45; }
                        .block-es { background: linear-gradient(90deg, #ecfdf5 0%, #f8fafc 100%); border-left: 4px solid #059669; padding: 12px 14px; border-radius: 0 8px 8px 0; margin-top: 4px; }
                        .text-es { font-size: 16px; color: #166534; margin: 0; line-height: 1.5; font-style: normal; font-weight: 500; }
                        .text-es-empty { color: #94a3b8; font-style: italic; font-weight: 400; }
                        .vocab-box { font-size: 12px; color: #92400e; background: #fffbeb; padding: 8px 12px; border-radius: 6px; margin-top: 12px; font-weight: 600; border: 1px solid #fcd34d; line-height: 1.4; }
                        .hl-vocab { background-color: #fef08a; border-bottom: 2px solid #eab308; padding: 0 4px; border-radius: 2px; }
                        .hl-conn { color: #7e22ce; text-decoration: underline; text-decoration-color: #a855f7; text-decoration-thickness: 2px; }
                        .hl-dat { color: #1d4ed8; text-decoration: underline; text-decoration-color: #3b82f6; text-decoration-thickness: 2px; }
                        .hl-akk { color: #b91c1c; text-decoration: underline; text-decoration-color: #ef4444; text-decoration-thickness: 2px; }
                        .hl-wech { color: #d97706; text-decoration: underline; text-decoration-color: #f59e0b; text-decoration-thickness: 2px; }
                        .hl-verbprep { background-color: #cffafe; border-bottom: 2px solid #06b6d4; padding: 0 4px; border-radius: 2px; color: #0891b2; }
                        .tempus-tag { font-size: 10px; color: #4338ca; font-family: ui-monospace, monospace; background: #e0e7ff; padding: 2px 6px; border-radius: 4px; border: 1px solid #a5b4fc; margin-left: 4px; font-weight: 500; }
                        .grammar-summary { background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; margin-top: 28px; page-break-inside: avoid; }
                        .legend { background: #f1f5f9; padding: 16px 18px; border-radius: 10px; margin-top: 32px; font-size: 12px; color: #475569; border: 1px solid #e2e8f0; page-break-inside: avoid; }
                        .legend h3 { margin: 0 0 10px 0; font-size: 14px; color: #0f172a; }
                        .legend ul { margin: 0; padding-left: 18px; }
                        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #64748b; }
                        @media print { body { padding: 16px; } .scene { box-shadow: none; } }
                    </style>
                </head>
                <body>
                    <h1>–Y"o ${escPdf(activeScriptTitle)}</h1>
                    <p class="meta"><strong>M«¨ller</strong> ∂˙ Entrenador alem«≠n TELC ∂˙ ${escPdf(genDate)} ∂˙ ${totalScenes} escena${totalScenes === 1 ? '' : 's'}</p>
            `;
            let uniqueGrammarRules = new Set();
            guionData.forEach((scene, sceneIdx) => {
                let deText = scene.text;
                const feedback = generateTutorFeedback(deText);
                if (feedback && !feedback.includes("Estructura est«≠ndar perfecta")) {
                    feedback.split('\n\n').forEach(f => uniqueGrammarRules.add(f));
                }
                if (scene.vocab) {
                    const sortedVocab = [...scene.vocab].sort((a, b) => b.de.length - a.de.length);
                    sortedVocab.forEach(v => {
                        let searchWord = v.de.replace(/^(der|die|das|sich)\s/i, '').trim();
                        const safeWord = searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const regex = new RegExp(`(?![^<]*>)(^|[^a-z«œ«Ù«¨«YA-Z«"«-«o†ßz])(${safeWord})([^a-z«œ«Ù«¨«YA-Z«"«-«o†ßz]|$)`, 'gi');
                        deText = deText.replace(regex, `$1<span class="hl-vocab">$2</span>$3`);
                    });
                }
                GRAMMAR_PATTERNS.forEach(p => { deText = deText.replace(p.regex, `<span class="hl-verbprep">$1</span>`); });
                Object.keys(TEMPUS_DICT).forEach(verb => {
                    const safeVerb = verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`(?![^<]*>)\\b(${safeVerb})\\b`, 'gi');
                    deText = deText.replace(regex, `$1 <span class="tempus-tag">(${TEMPUS_DICT[verb]})</span>`);
                });
                const connRegex = new RegExp(`(?![^<]*>)\\b(${CONN_LIST.join('|')})\\b`, 'gi');
                deText = deText.replace(connRegex, `<span class="hl-conn">$1</span>`);
                const datRegex = new RegExp(`(?![^<]*>)\\b(${PREP_DAT.join('|')})\\b`, 'gi');
                deText = deText.replace(datRegex, `<span class="hl-dat">$1</span>`);
                const akkRegex = new RegExp(`(?![^<]*>)\\b(${PREP_AKK.join('|')})\\b`, 'gi');
                deText = deText.replace(akkRegex, `<span class="hl-akk">$1</span>`);
                const wechRegex = new RegExp(`(?![^<]*>)\\b(${PREP_WECHSEL.join('|')})\\b`, 'gi');
                deText = deText.replace(wechRegex, `<span class="hl-wech">$1</span>`);
                const tr = scene.translation && String(scene.translation).trim();
                const trBlock = tr
                    ? `<div class="block-es"><div class="label-row label-es">Espa«Òol ∂˙ traducci«¸n</div><p class="text-es">${escPdf(tr)}</p></div>`
                    : `<div class="block-es"><div class="label-row label-es">Espa«Òol ∂˙ traducci«¸n</div><p class="text-es text-es-empty">(Sin traducci«¸n en esta l«nea del guion É?" puedes a«Òadirla en Biblioteca al editar.)</p></div>`;
                const vocabHtml = scene.vocab && scene.vocab.length > 0
                    ? `<div class="vocab-box">–Y"- Vocabulario: ${scene.vocab.map((v) => `${escPdf(v.de)} É≈' ${escPdf(v.es)}`).join(' ∂˙ ')}</div>`
                    : '';
                htmlContent += `
                    <div class="scene">
                        <div class="scene-head">
                            <span class="scene-num">Szene ${sceneIdx + 1} / ${totalScenes}</span>
                            <span class="speaker">${escPdf(scene.speaker)}</span>
                            ${scene.isRedemittel ? '<span class="badge-redem">Redemittel</span>' : ''}
                        </div>
                        <div class="block-de">
                            <div class="label-row">Deutsch</div>
                            <div class="text-de">${deText}</div>
                        </div>
                        ${trBlock}
                        ${vocabHtml}
                    </div>
                `;
            });
            if (uniqueGrammarRules.size > 0) {
                htmlContent += `<div class="grammar-summary"><h2>–Yıˇ An«≠lisis Gramatical del Guion</h2><ul>`;
                uniqueGrammarRules.forEach(rule => { let cleanRule = rule.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); htmlContent += `<li>${cleanRule}</li>`; });
                htmlContent += `</ul></div>`;
            }
            htmlContent += `
                <div class="legend">
                    <h3>Leyenda de marcas en el alem«≠n</h3>
                    <ul>
                        <li><strong>Resaltado amarillo:</strong> «tems del vocabulario de la escena.</li>
                        <li><strong>Cyan (fondo):</strong> verbos con preposici«¸n detectados.</li>
                        <li><strong>Subrayados de color:</strong> conectores; preposiciones con Dativ / Akkusativ / Wechsel.</li>
                        <li><strong>Etiquetas moradas (Tempus):</strong> referencia de formas verbales (Pr«œt/Perf).</li>
                    </ul>
                </div>
                <div class="footer">M«¨ller ∂˙ TELC ∂˙ ∂≠Viel Erfolg beim Deutschlernen!</div>
                </body></html>`;
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            setTimeout(() => { try { printWindow.focus(); printWindow.print(); } catch (e) {} }, 150);
          };

          const exportProgressPDF = () => {
            const printWindow = window.open('', '_blank');
            if (!printWindow) { alert("Por favor, permite las ventanas emergentes (pop-ups) en tu navegador para generar el PDF."); return; }
            const htmlContent = `
                <html><head><title>Mi Resumen de Alem«≠n - Profesor M«¨ller</title><style>body { font-family: 'Segoe UI', sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; } h1 { color: #2563eb; text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 15px; } h2 { color: #0f172a; margin-top: 40px; } table { width: 100%; border-collapse: collapse; margin-top: 15px; } th, td { border: 1px solid #94a3b8; padding: 12px; } th { background-color: #f1f5f9; } .diff { color: #dc2626; font-weight: bold; } .norm { color: #2563eb; } .grammar-base { color: #0891b2; }</style></head><body>
                <h1>–Y"s Resumen de Estudio - B1/B2</h1>
                <div><h2>–Y"Ô Vocabulario Dif«cil</h2>${userStats.difficultVocab?.length ? `<table><tr><th>Alem«≠n</th><th>Espa«Òol</th></tr>${userStats.difficultVocab.map(v => `<tr><td class="diff">${v.de}</td><td>${v.es}</td></tr>`).join('')}</table>` : '<p>Vac«o.</p>'}</div>
                <div><h2>–Y"Ê Vocabulario Normal</h2>${userStats.normalVocab?.length ? `<table><tr><th>Alem«≠n</th><th>Espa«Òol</th></tr>${userStats.normalVocab.map(v => `<tr><td class="norm">${v.de}</td><td>${v.es}</td></tr>`).join('')}</table>` : '<p>Vac«o.</p>'}</div>
                <div><h2>–Yıˇ Reglas Gramaticales</h2>${userStats.difficultGrammar?.length ? `<table><tr><th>Regla</th><th>Ejemplo</th><th>Traducci«¸n</th></tr>${userStats.difficultGrammar.map(g => `<tr><td class="grammar-base">${g.base}</td><td><i>"${g.exampleDe}"</i></td><td>${g.exampleEs}</td></tr>`).join('')}</table>` : '<p>Vac«o.</p>'}</div>
                </body></html>
            `;
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            setTimeout(() => { try { printWindow.focus(); printWindow.print(); } catch (e) {} }, 150);
          };

          // COLORES DE FONDO SUAVIZADOS (Correcci«¸n) + temas UI
          const getBgColor = () => {
              if (uiTheme === 'light') {
                  if (activeTab === 'inicio') return 'bg-slate-100';
                  if (activeTab === 'ruta') return 'bg-fuchsia-50';
                  if (activeTab === 'progreso') return 'bg-indigo-100';
                  if (activeTab === 'guiones') return 'bg-slate-100';
                  if (activeTab === 'vocabulario') return 'bg-amber-50';
                  if (activeTab === 'entrenamiento') return 'bg-fuchsia-50';
                  if (activeTab === 'lexikon') return 'bg-slate-100';
                  if (activeTab === 'bxbank') return 'bg-slate-100';
                  if (activeTab === 'storybuilder') return 'bg-indigo-100';
                  if (activeTab === 'historiaspro') return 'bg-emerald-50';
                  if (activeTab === 'shadowing') return 'bg-teal-50';
                  if (activeTab === 'lectura') return 'bg-sky-50';
                  if (activeTab === 'escritura') return 'bg-stone-100';
                  if (activeTab === 'telc') return 'bg-slate-100';
                  if (activeTab === 'comunidad') return 'bg-violet-50';
                  return 'bg-slate-50';
              }
              if (uiTheme === 'hc') return 'bg-black';
              if (activeTab === 'ruta') return 'bg-fuchsia-950/90';
              if (activeTab === 'comunidad') return 'bg-violet-950';
              if (activeTab === 'telc') return 'bg-slate-950';
              if (activeTab === 'inicio') return 'bg-slate-950';
              if (activeTab === 'progreso') return 'bg-indigo-950';
              if (activeTab === 'guiones') return 'bg-slate-900';
              if (activeTab === 'vocabulario') return 'bg-amber-950/70'; // Suavizado
              if (activeTab === 'entrenamiento') return 'bg-fuchsia-950/85';
              if (activeTab === 'lexikon') return 'bg-slate-900';
              if (activeTab === 'bxbank') return 'bg-slate-900'; // Suavizado
              if (activeTab === 'storybuilder') return 'bg-indigo-950'; // Suavizado
              if (activeTab === 'historiaspro') return 'bg-emerald-950/80';
              if (activeTab === 'shadowing') return 'bg-teal-950/90';
              if (activeTab === 'lectura') return 'bg-sky-950/90';
              if (activeTab === 'escritura') return 'bg-stone-950';
              if (fluesternMode) return 'bg-zinc-900 filter contrast-125 sepia-50'; 
              if (isReviewing || practiceActive) return 'bg-gray-900'; // Suavizado
              const speaker = guionData[getActualSceneIndex()]?.speaker;
              if (speaker === 'Lukas') return 'bg-slate-900';
              if (speaker === 'Elena' || speaker === 'Anna') return 'bg-slate-800'; // Suavizado
              if (speaker?.includes('Weber') || speaker === 'Professor') return 'bg-emerald-950';
              return 'bg-gray-900'; 
          };
          const themeShellClass = uiTheme === 'light' ? 'muller-theme-light' : uiTheme === 'hc' ? 'muller-theme-hc' : '';

          const currentPracticeList = practiceActive === 'diff' ? userStats.difficultVocab : (practiceActive === 'norm' ? userStats.normalVocab : userStats.difficultGrammar);
          const currentPracticeItem = currentPracticeList ? currentPracticeList[practiceIndex] : null;


          // Componente de escritura a mano (canvas)

          const writingScriptOptions = useMemo(() => {
              const out = [];
              if (Array.isArray(savedScripts)) {
                  savedScripts.forEach((s) => {
                      try {
                          const rows = JSON.parse(s.data || '[]');
                          const count = Array.isArray(rows) ? rows.filter((r) => r && typeof r.text === 'string' && r.text.trim()).length : 0;
                          out.push({ id: String(s.id), title: s.title || 'Sin t«tulo', count });
                      } catch (e) {
                          out.push({ id: String(s.id), title: s.title || 'Sin t«tulo', count: 0 });
                      }
                  });
              }
              return out;
          }, [savedScripts]);

          const writingDictationPool = useMemo(() => {
              const fromScenes = (scenes, originLabel) => {
                  if (!Array.isArray(scenes)) return [];
                  return scenes
                      .filter((s) => s && typeof s.text === 'string' && s.text.trim() && typeof s.translation === 'string' && s.translation.trim())
                      .map((s, idx) => ({
                          de: String(s.text).trim(),
                          es: String(s.translation).trim(),
                          origin: originLabel,
                          idx
                      }));
              };
              if (writingDictSource === 'builtin') {
                  return WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
              }
              if (writingDictSource === 'current_story') {
                  const rows = fromScenes(guionData, activeScriptTitle || 'Historia actual');
                  return rows.length ? rows : WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
              }
              if (writingDictSource === 'all_saved') {
                  const rows = [];
                  (savedScripts || []).forEach((s) => {
                      try {
                          const scenes = JSON.parse(s.data || '[]');
                          rows.push(...fromScenes(scenes, s.title || 'Guion guardado'));
                      } catch (e) {}
                  });
                  return rows.length ? rows : WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
              }
              if (writingDictSource === 'one_saved') {
                  const sid = String(writingDictScriptId || '');
                  const picked = (savedScripts || []).find((s) => String(s.id) === sid);
                  if (!picked) return WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
                  try {
                      const scenes = JSON.parse(picked.data || '[]');
                      const rows = fromScenes(scenes, picked.title || 'Guion guardado');
                      return rows.length ? rows : WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
                  } catch (e) {
                      return WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
                  }
              }
              return WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
          }, [writingDictSource, writingDictScriptId, guionData, activeScriptTitle, savedScripts]);

          const writingCompareTarget = useMemo(() => {
              if (activeTab !== 'escritura') return null;
              if (writingMode === 'copy') return WRITING_COPY_DRILLS[writingCopyIdx % WRITING_COPY_DRILLS.length];
              if (writingMode === 'dictation') {
                  if (!writingDictationPool.length) return null;
                  return writingDictationPool[writingDictIdx % writingDictationPool.length].de;
              }
              if (writingMode === 'telc' && WRITING_TELC_TASKS.length) return WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].dePrompt;
              if (writingMode === 'letters') return LETTER_DRILLS[writingLetterIdx % LETTER_DRILLS.length].practice;
              if (writingMode === 'guion' && guionData.length) return guionData[Math.min(writingGuionWriteIdx, guionData.length - 1)]?.text || null;
              if (writingMode === 'vocab' && currentVocabList.length) return currentVocabList[writingVocabIdx % currentVocabList.length].de;
              return null;
          }, [activeTab, writingMode, writingCopyIdx, writingDictIdx, writingLetterIdx, writingGuionWriteIdx, writingVocabIdx, guionData, currentVocabList, writingDictationPool, writingTelcIdx]);
          const getSelfCheckItems = useCallback(() => {
              const items = [
                  { id: 'mic-api', label: 'Micr«¸fono API', ok: !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') },
                  { id: 'tts-api', label: 'Voz TTS', ok: !!(window.speechSynthesis && typeof window.speechSynthesis.speak === 'function') },
                  { id: 'stories', label: 'Texto disponible', ok: String(readingTargetText || '').trim().length > 0 },
                  { id: 'lectura-mic', label: 'Lectura continua', ok: !readingListening || !!readingAutoRestartRef.current },
                  { id: 'telc-mode', label: 'TELC activo', ok: writingMode === 'telc' || WRITING_TELC_TASKS.length > 0 },
                  { id: 'telc-input', label: 'TELC teclado/l«≠piz', ok: writingMode !== 'telc' || ['pen', 'keyboard'].includes(writingTelcInputMode) }
              ];
              return items;
          }, [readingTargetText, readingListening, writingMode, writingTelcInputMode]);
          const runTelcWritingCoach = useCallback((rawText, task) => {
              setWritingTelcCoach(mullerBuildTelcWritingCoach(rawText, task, normalizeGermanSpeechText));
          }, []);
          const runTelcCoachFromCurrentInput = useCallback(() => {
              if (!WRITING_TELC_TASKS.length) return;
              const task = WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length];
              const sourceText = writingTelcInputMode === 'keyboard' ? writingTelcTypedText : writingTelcLastOcrText;
              runTelcWritingCoach(sourceText, task);
          }, [writingTelcIdx, writingTelcInputMode, writingTelcTypedText, writingTelcLastOcrText, runTelcWritingCoach]);
          useEffect(() => {
              if (writingMode !== 'telc') return;
              setWritingTelcCoach(null);
          }, [writingMode, writingTelcIdx, writingTelcInputMode]);

          const persistDailyPatch = (patch) => {
              const k = 'muller_daily_v1_' + new Date().toISOString().slice(0, 10);
              setDailyChallenges((prev) => {
                  const next = { ...prev, ...patch };
                  try { localStorage.setItem(k, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
          };
          const claimDailyStamp = (key) => {
              if (dailyChallenges[key]) return;
              persistDailyPatch({ [key]: true });
              saveProgress({ coins: userStats.coins + 5, activityByDay: mergeActivityPoints(12) });
          };

          const finishOnboarding = () => {
              try { localStorage.setItem(MULLER_ONBOARDING_KEY, '1'); } catch (e) {}
              setShowOnboarding(false);
              setOnboardingStep(1);
          };

          const sortedDeVoices = useMemo(() => {
              try {
                  return window.speechSynthesis.getVoices()
                      .filter((v) => v.lang && v.lang.toLowerCase().startsWith('de'))
                      .sort((a, b) => (window.__mullerRankVoiceNatural(b) || 0) - (window.__mullerRankVoiceNatural(a) || 0));
              } catch (e) { return []; }
          }, [voicesLoaded, showMullerHub, ttsPrefsEpoch]);
          const sortedEsVoices = useMemo(() => {
              try {
                  return window.speechSynthesis.getVoices()
                      .filter((v) => v.lang && v.lang.toLowerCase().startsWith('es'))
                      .sort((a, b) => (window.__mullerRankVoiceNatural(b) || 0) - (window.__mullerRankVoiceNatural(a) || 0));
              } catch (e) { return []; }
          }, [voicesLoaded, showMullerHub, ttsPrefsEpoch]);
          const healthSnapshot = useMemo(() => {
              const listeningBusy = !!(isListening || rutaListening || readingListening);
              let micOk = false;
              try {
                  micOk = !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function');
              } catch (e) { micOk = false; }
              let voiceCount = 0;
              try {
                  if (window.speechSynthesis && typeof window.speechSynthesis.getVoices === 'function') {
                      voiceCount = window.speechSynthesis.getVoices().length || 0;
                  }
              } catch (e) { voiceCount = 0; }
              const savedScriptsCount = Array.isArray(savedScripts) ? savedScripts.length : 0;
              const storyScenesCount = Array.isArray(guionData) ? guionData.length : 0;
              const micLabel = micOk
                  ? (listeningBusy ? 'Disponible (activo)' : 'Disponible')
                  : 'No soportado';
              const ok = micOk && voiceCount > 0 && (savedScriptsCount > 0 || storyScenesCount > 0);
              return {
                  ok,
                  micOk,
                  micLabel,
                  voiceCount,
                  savedScriptsCount,
                  storyScenesCount,
                  listeningBusy
              };
          }, [isListening, rutaListening, readingListening, savedScripts, guionData, voicesLoaded]);

          const oralLeftSec = (mode === 'interview' && oralDeadline)
              ? Math.max(0, Math.ceil((oralDeadline - Date.now()) / 1000))
              : null;
          void oralClock;
          const activeSectionMeta = useMemo(() => {
              const map = {
                  inicio: { icon: 'layout-dashboard', title: 'Inicio', desc: 'Panel r«≠pido y continuidad', tone: 'border-indigo-500/35 bg-indigo-900/25 text-indigo-200' },
                  ruta: { icon: 'map', title: 'Ruta', desc: 'Camino A1-A2 guiado', tone: 'border-fuchsia-500/35 bg-fuchsia-900/25 text-fuchsia-200' },
                  historia: { icon: 'play', title: 'Historia', desc: 'Escucha, modos y simulaci«¸n oral', tone: 'border-blue-500/35 bg-blue-900/25 text-blue-200' },
                  lectura: { icon: 'mic', title: 'Lectura', desc: 'Leer en voz alta y comparar', tone: 'border-sky-500/35 bg-sky-900/25 text-sky-200' },
                  shadowing: { icon: 'audio-lines', title: 'Shadowing', desc: 'Fluidez y pronunciaci«¸n', tone: 'border-teal-500/35 bg-teal-900/25 text-teal-200' },
                  escritura: { icon: 'pen-line', title: 'Escritura', desc: 'Canvas, dictado y OCR', tone: 'border-rose-500/35 bg-rose-900/25 text-rose-200' },
                  vocabulario: { icon: 'book-open', title: 'Vocabulario', desc: 'SRS y recall activo', tone: 'border-amber-500/35 bg-amber-900/25 text-amber-200' },
                  entrenamiento: { icon: 'graduation-cap', title: 'Entrenamiento', desc: 'Art«culos, prep. y simulacro', tone: 'border-fuchsia-500/35 bg-fuchsia-900/25 text-fuchsia-200' },
                  bxbank: { icon: bxBankLevel === 'b1' ? 'target' : 'layers', title: bxBankLevel === 'b1' ? 'Banco B1' : 'Banco B2', desc: 'Frases y estructuras por nivel', tone: bxBankLevel === 'b1' ? 'border-emerald-500/35 bg-emerald-900/25 text-emerald-200' : 'border-sky-500/35 bg-sky-900/25 text-sky-200' },
                  progreso: { icon: 'bar-chart', title: 'Progreso', desc: 'M«∏tricas, export y objetivos', tone: 'border-yellow-500/35 bg-yellow-900/25 text-yellow-200' },
                  guiones: { icon: 'file-text', title: 'Biblioteca', desc: 'Guiones y distribuci«¸n', tone: 'border-purple-500/35 bg-purple-900/25 text-purple-200' },
                  lexikon: { icon: 'library', title: 'Lexikon', desc: 'Diccionario y traducci«¸n', tone: 'border-cyan-500/35 bg-cyan-900/25 text-cyan-200' },
                  telc: { icon: 'clipboard-check', title: 'TELC', desc: 'Gu«a por niveles A1-C2', tone: 'border-orange-500/35 bg-orange-900/25 text-orange-200' },
                  storybuilder: { icon: 'sparkles', title: 'IA', desc: 'Generaci«¸n y resumen de contenido', tone: 'border-fuchsia-500/35 bg-fuchsia-900/25 text-fuchsia-200' },
                  historiaspro: { icon: 'feather', title: 'Historias Pro', desc: 'ES/DE/OCR y estilizaci«¸n', tone: 'border-emerald-500/35 bg-emerald-900/25 text-emerald-200' },
                  comunidad: { icon: 'trophy', title: 'Comunidad', desc: 'Econom«a, directorio y liga', tone: 'border-violet-500/35 bg-violet-900/25 text-violet-200' },
              };
              return map[activeTab] || { icon: 'layout-dashboard', title: 'Inicio', desc: 'Panel r«≠pido y continuidad', tone: 'border-indigo-500/35 bg-indigo-900/25 text-indigo-200' };
          }, [activeTab, bxBankLevel]);
          const activeModeBadge = useMemo(() => {
              if (activeTab === 'historia') {
                  if (mode === 'interview') return 'Modo oral B1';
                  if (podcastMode) return 'Modo podcast';
                  if (historiaAudioOnly) return 'Solo audio';
                  if (diktatMode) return 'Diktat';
                  if (puzzleMode) return 'Puzzle';
              }
              if (activeTab === 'vocabulario' && vocabSrsDueCount > 0) return `${vocabSrsDueCount} SRS pendientes`;
              if (activeTab === 'entrenamiento') return 'Simulacro y pr«≠ctica avanzada';
              if (activeTab === 'bxbank') return bxBankLevel === 'b1' ? 'Banco B1 activo' : 'Banco B2 activo';
              return null;
          }, [activeTab, mode, podcastMode, historiaAudioOnly, diktatMode, puzzleMode, vocabSrsDueCount, bxBankLevel]);
          const activeSectionHint = useMemo(() => {
              const h = {
                  inicio: 'Sugerencia: abre Entrenamiento si quieres pr«≠ctica tipo examen.',
                  ruta: 'Sugerencia: completa lecci«¸n + huecos + voz para cerrar ciclo.',
                  historia: 'Sugerencia: escucha, repite y luego activa Diktat para consolidar.',
                  lectura: 'Sugerencia: lee completo, luego revisa solo las palabras en rojo.',
                  shadowing: 'Sugerencia: empieza con velocidad media y sube a normal.',
                  escritura: 'Sugerencia: usa modo dictado + OCR para detectar fallos.',
                  vocabulario: 'Sugerencia: marca F«≠cil solo si recuerdas sin mirar traducci«¸n.',
                  entrenamiento: 'Sugerencia: alterna categor«a d«∏bil y simulacro corto.',
                  bxbank: 'Sugerencia: usa MIX y luego guarda tarjetas clave en escritura.',
                  progreso: 'Sugerencia: exporta backup antes de cambios grandes.',
                  guiones: 'Sugerencia: distribuye texto al Banco B1/B2 para ampliar mazos.',
                  lexikon: 'Sugerencia: guarda pares «ßtiles y rep«≠salos en vocabulario.',
                  telc: 'Sugerencia: elige nivel y combina con simulacro en Entrenamiento.',
                  storybuilder: 'Sugerencia: guarda siempre el guion generado en Biblioteca.',
                  historiaspro: 'Sugerencia: genera en A2/B1 y env«a escenas a Historia.',
                  comunidad: 'Sugerencia: revisa econom«a y liga al final de cada sesi«¸n.',
              };
              return h[activeTab] || '';
          }, [activeTab]);
          const lecturaPanelProps = {
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
          };

          return (
            <div className={`flex flex-col muller-main-fill h-[100svh] max-h-[100svh] w-full font-sans md:rounded-xl overflow-x-hidden md:overflow-hidden shadow-2xl relative transition-colors duration-500 muller-theme-bg ${reduceMotionUi ? 'muller-reduce-motion' : ''} ${themeShellClass} ${uiTheme === 'light' ? 'text-slate-900' : 'text-white'} ${getBgColor()}`}>

              {showSplash && (
                  <div className="fixed inset-0 z-[300] overflow-hidden" role="dialog" aria-modal="true" aria-label="Pantalla de inicio Profesor Plaza M«¨ller" onClick={() => setShowSplash(false)}>
                      <div className="absolute inset-0 flex flex-col">
                          <div className="flex-1" style={{ background: 'linear-gradient(180deg, #000000 0%, #000000 33%, #DD0000 33%, #DD0000 67%, #FFCE00 67%, #FFCE00 100%)' }} aria-hidden="true" />
                          <div className="h-[160px] md:h-[192px] bg-white border-y-2 border-black/20 shadow-[0_8px_25px_rgba(0,0,0,0.25)] flex items-stretch px-2 md:px-4">
                              <button
                                  type="button"
                                  onClick={() => setShowSplash(false)}
                                  className={`shrink-0 rounded-none p-0 bg-transparent border-0 h-full w-[160px] md:w-[192px] flex items-center justify-center ${splashLogoBlink ? 'animate-pulse ring-4 ring-amber-400/75' : ''}`}
                                  aria-label="Entrar a la aplicaci«¸n pulsando el logo"
                                  title="Pulsa el logo para entrar"
                              >
                                  <img
                                      src="./icons/profesor-plaza-muller-logo.jpg"
                                      alt="Logo Profesor Plaza M«¨ller"
                                      className="h-full w-full object-cover"
                                  />
                              </button>
                              <div className="ml-2 md:ml-3 flex-1 h-full flex items-center justify-center overflow-hidden">
                                  <p className="w-full text-center text-black font-black uppercase tracking-[0.04em] whitespace-nowrap text-[clamp(1.35rem,5.4vw,4.15rem)] leading-none">
                                      PROFESOR PLAZA M«oLLER
                                  </p>
                              </div>
                          </div>
                          <div className="flex-1" style={{ background: 'linear-gradient(180deg, #AA151B 0%, #AA151B 33%, #F1BF00 33%, #F1BF00 67%, #AA151B 67%, #AA151B 100%)' }} aria-hidden="true" />
                      </div>
                  </div>
              )}
              
              {/* SUPERIOR NAV BAR */}
              <div className="muller-top-nav fixed top-0 left-0 right-0 w-full bg-gradient-to-b from-zinc-900/95 via-black/90 to-black/95 backdrop-blur-xl border-b border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.35)] p-1.5 md:p-3 pt-[max(0.35rem,env(safe-area-inset-top,0px))] flex flex-col gap-1.5 md:gap-2 items-stretch z-20">
                  <div className="flex flex-col gap-1.5 md:gap-2 w-full min-w-0 md:flex-1">
                      <div className="muller-nav-row gap-1.5 md:gap-2 bg-zinc-950/85 p-1 md:p-1.5 rounded-2xl ring-1 ring-white/[0.1] w-full touch-manipulation">
                      <button onClick={()=>{setActiveTab('inicio'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'inicio' ? 'bg-indigo-600 text-white shadow-[0_0_18px_rgba(79,70,229,0.5)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="layout-dashboard" className="w-4 h-4 md:w-5 md:h-5" /> Inicio</button>
                      <button onClick={()=>{setActiveTab('ruta'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'ruta' ? 'bg-fuchsia-600 text-white shadow-[0_0_18px_rgba(192,38,211,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="map" className="w-4 h-4 md:w-5 md:h-5" /> Ruta</button>
                      <button onClick={()=>{setActiveTab('historia'); setMode('dialogue'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'historia' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="play" className="w-4 h-4 md:w-5 md:h-5" /> Historia</button>
                      <button onClick={()=>{setActiveTab('lectura'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'lectura' ? 'bg-sky-600 text-white shadow-[0_0_20px_rgba(14,165,233,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="mic" className="w-4 h-4 md:w-5 md:h-5" /> Lectura</button>
                      <button onClick={()=>{setActiveTab('shadowing'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'shadowing' ? 'bg-teal-600 text-white shadow-[0_0_18px_rgba(13,148,136,0.5)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="audio-lines" className="w-4 h-4 md:w-5 md:h-5" /> Shadowing</button>
                      <button onClick={()=>{setActiveTab('escritura'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'escritura' ? 'bg-rose-700 text-white shadow-[0_0_18px_rgba(190,18,60,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="pen-line" className="w-4 h-4 md:w-5 md:h-5" /> Escritura</button>
                      <button onClick={()=>{setActiveTab('vocabulario'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'vocabulario' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.4)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="book-open" className="w-4 h-4 md:w-5 md:h-5" /> Vocab{vocabSrsDueCount > 0 ? <span className="ml-0.5 min-w-[1.1rem] px-1 rounded-full bg-white/20 text-[10px] font-black leading-none py-0.5" title="Tarjetas prioritarias SRS en la lista actual">{vocabSrsDueCount > 99 ? '99+' : vocabSrsDueCount}</span> : null}</button>
                      <button onClick={()=>{setActiveTab('entrenamiento'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'entrenamiento' ? 'bg-fuchsia-600 text-white shadow-[0_0_18px_rgba(192,38,211,0.6)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="graduation-cap" className="w-4 h-4 md:w-5 md:h-5" /> Entrena</button>
                      <button onClick={()=>{setActiveTab('bxbank'); setBxBankLevel('b1'); stopAudio(); setPracticeActive(null); setBxCategory('mix');}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'bxbank' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.8)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="target" className="w-4 h-4 md:w-5 md:h-5" /> Banco B1/B2</button>
                      </div>
                      {activeTab === 'bxbank' ? (
                          <div className="flex items-center gap-1 rounded-xl bg-black/35 border border-white/10 px-2 py-1 w-fit">
                              <button type="button" onClick={() => setBxBankLevel('b1')} className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${bxBankLevel === 'b1' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'}`}>B1</button>
                              <button type="button" onClick={() => setBxBankLevel('b2')} className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${bxBankLevel === 'b2' ? 'bg-sky-600 text-white' : 'text-gray-300 hover:text-white'}`}>B2</button>
                          </div>
                      ) : null}
                  </div>
                  
                  <div className={`flex items-center gap-1.5 md:gap-3 w-full pb-0.5 md:pb-0 justify-end ${userMenuOpen ? 'overflow-visible' : 'overflow-x-auto'}`}>
                      <div className="hidden md:flex items-center gap-1.5 shrink-0 self-start md:self-auto">
                          <button type="button" onClick={() => window.__MULLER_OPEN_EXERCISE_HELP && window.__MULLER_OPEN_EXERCISE_HELP('nav_inicio')} className="text-[10px] font-black text-amber-200/90 hover:text-white underline underline-offset-2 px-2 py-1 rounded-lg border border-white/10 hover:bg-white/10" title="Ayuda contextual r«≠pida">
                              Ayuda
                          </button>
                          <span className="inline-flex flex-col items-center gap-0.5">
                              <button type="button" aria-label="Centro M«¨ller: voces, plan del d«a y ayuda" onClick={() => { setShowMullerHub(true); setMullerHubTab('voices'); }} className="bg-gradient-to-br from-sky-600 to-indigo-900 hover:from-sky-500 hover:to-indigo-800 text-white p-2 rounded-full shadow-lg ring-2 ring-white/15 transition" title="Voces del sistema, plan del d«a, retos y tour">
                                  <Icon name="layout-dashboard" className="w-5 h-5" />
                              </button>
                          </span>
                      </div>
                      
                      <div className="flex items-center gap-2 md:gap-3 bg-black/60 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-white/20 whitespace-nowrap">
                          <div className="relative flex items-center mr-1 md:mr-2 border-r border-white/20 pr-2 md:pr-3" ref={userMenuWrapRef}>
                              <button
                                  type="button"
                                  id="muller-user-menu-trigger"
                                  aria-haspopup="menu"
                                  aria-expanded={userMenuOpen}
                                  aria-controls="muller-user-menu"
                                  onClick={() => setUserMenuOpen((o) => !o)}
                                  className="flex items-center gap-1.5 min-h-[2.25rem] rounded-lg pl-0.5 pr-1.5 py-0.5 -my-0.5 text-left touch-manipulation hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80"
                                  title="Men«ß de cuenta"
                              >
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-900 text-sm font-black text-white ring-1 ring-white/20">
                                      {(String(userStats.username || 'E').trim().charAt(0) || '?').toUpperCase()}
                                  </span>
                                  <span className="flex min-w-0 flex-col items-start leading-tight">
                                      <span className="flex max-w-[7.5rem] items-center gap-1 truncate text-[11px] font-bold uppercase tracking-wide text-amber-400 md:max-w-[9rem]">
                                          {userStats.isPremium ? <Icon name="crown" className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" /> : <Icon name="user-circle" className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" />}
                                          <span className="truncate">{userStats.username || 'Estudiante'}</span>
                                      </span>
                                      <span className="hidden text-[9px] font-semibold normal-case tracking-normal text-gray-500 sm:inline">Sync: {cloudSyncLabel}</span>
                                  </span>
                                  <Icon name="chevron-down" className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition md:h-4 md:w-4 ${userMenuOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {userMenuOpen && (
                                  <div
                                      id="muller-user-menu"
                                      role="menu"
                                      aria-labelledby="muller-user-menu-trigger"
                                      className="absolute right-0 top-[calc(100%+6px)] z-[130] min-w-[15rem] max-w-[min(18rem,calc(100vw-1.5rem))] rounded-xl border border-white/12 bg-zinc-950/98 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl ring-1 ring-white/5"
                                  >
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setProfileSettingsTab('perfil');
                                              setShowProfileSettingsModal(true);
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="user-circle" className="h-4 w-4 shrink-0 text-amber-400" /> Perfil / cuenta
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setProfileSettingsTab('ajustes');
                                              setShowProfileSettingsModal(true);
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="settings" className="h-4 w-4 shrink-0 text-sky-400" /> Ajustes premium
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setActiveTab('progreso');
                                              stopAudio();
                                              setPracticeActive(null);
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="bar-chart" className="h-4 w-4 shrink-0 text-yellow-400" /> Progreso y exportar PDF/Anki
                                      </button>
                                      <div className="my-1 border-t border-white/10" role="separator" />
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              window.dispatchEvent(new Event('muller-export-full-backup'));
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="download" className="h-4 w-4 shrink-0 text-sky-400" /> Exportar backup (JSON)
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              const el = document.getElementById('muller-backup-file-input');
                                              if (el) el.click();
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="upload" className="h-4 w-4 shrink-0 text-indigo-400" /> Importar datosÉ?›
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setShowMullerHub(true);
                                              setMullerHubTab('tips');
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="lightbulb" className="h-4 w-4 shrink-0 text-amber-300" /> Consejos y tour
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setShowShortcutsModal(true);
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="keyboard" className="h-4 w-4 shrink-0 text-gray-300" /> Atajos de teclado
                                      </button>
                                  </div>
                              )}
                          </div>
                          <span className="flex items-center gap-1 font-black text-red-500 text-xs md:text-sm"><Icon name="heart" className="w-3 h-3 md:w-4 md:h-4 fill-current" /> {userStats.hearts}</span>
                          <span className="flex items-center gap-1 font-black text-yellow-400 text-xs md:text-sm"><Icon name="coins" className="w-3 h-3 md:w-4 md:h-4 fill-current" /> {coinsUiLabel}</span>
                      </div>
                      {activeTab === 'historia' && (
                          <div className="flex relative">
                              <button type="button" onClick={() => setShowHistoriaMenu(v => !v)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border whitespace-nowrap ${showHistoriaMenu ? 'bg-blue-700 border-blue-500 text-white' : 'bg-black/50 border-white/20 text-gray-200 hover:bg-white/10'}`}>
                                  <Icon name="sliders-horizontal" className="w-3.5 h-3.5" /> Opciones Historia
                              </button>
                              {showHistoriaMenu && (
                                  <>
                                      <div className="fixed inset-0 z-[199] bg-black/60" onClick={() => setShowHistoriaMenu(false)} />
                                      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-3 flex flex-col gap-1.5 w-[90vw] max-w-xs">
                                          <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest px-1 pb-0.5">Opciones Historia</p>
                                          <button onClick={()=>{setPodcastMode(v=>!v); setBlindMode(false); setDiktatMode(false); setPuzzleMode(false); setHistoriaAudioOnly(false); setShowHistoriaMenu(false);}} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left ${podcastMode ? 'bg-indigo-600 text-white' : 'text-gray-200 hover:bg-white/10'}`}>
                                              <Icon name="car" className="w-4 h-4 shrink-0" /> Podcast
                                          </button>
                                          <button type="button" disabled={savedScripts.length === 0} onClick={() => { setHistoriaPlaylistAllScripts(v=>!v); setShowHistoriaMenu(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left ${historiaPlaylistAllScripts ? 'bg-fuchsia-700 text-white' : 'text-gray-200 hover:bg-white/10'} ${savedScripts.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                                              <Icon name="repeat" className="w-4 h-4 shrink-0" /> Todos los guiones
                                          </button>
                                          <button type="button" onClick={() => { setHistoriaAudioOnly(v=>!v); if (!historiaAudioOnly) setPodcastMode(false); setShowHistoriaMenu(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left ${historiaAudioOnly ? 'bg-violet-600 text-white' : 'text-gray-200 hover:bg-white/10'}`}>
                                              <Icon name="headphones" className="w-4 h-4 shrink-0" /> Solo audio
                                          </button>
                                          <div className="my-0.5 border-t border-white/10" />
                                          <button type="button" onClick={() => { setActiveTab('historia'); setMode('interview'); setOralQIdx(0); setOralDeadline(Date.now() + oralSecs * 1000); setOralClock(0); stopAudio(); setPodcastMode(false); setHistoriaAudioOnly(false); setShowHistoriaMenu(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-emerald-200 hover:bg-emerald-900/50 transition w-full text-left">
                                              <Icon name="mic" className="w-4 h-4 shrink-0" /> Oral B1
                                          </button>
                                          <button type="button" onClick={() => setShowHistoriaMenu(false)} className="mt-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white/50 hover:bg-white/10 transition w-full">
                                              Cerrar
                                          </button>
                                      </div>
                                  </>
                              )}
                          </div>
                      )}
                  </div>
              </div>

              <div className="w-full border-b border-white/[0.08] bg-black/35 backdrop-blur-md px-3 md:px-4 py-2 md:py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border shrink-0 ${activeSectionMeta.tone}`}>
                          <Icon name={activeSectionMeta.icon} className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-wider text-cyan-300 truncate">M«¨ller ∂˙ secci«¸n activa</p>
                          <p className="text-sm font-bold text-white truncate">{activeSectionMeta.title} <span className="text-gray-400 font-semibold">∂˙ {activeSectionMeta.desc}</span></p>
                          {activeSectionHint ? <p className="text-[10px] text-gray-500 truncate">{activeSectionHint}</p> : null}
                      </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap md:justify-end">
                      {activeModeBadge ? <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-500/35 bg-amber-900/30 text-amber-200">{activeModeBadge}</span> : null}
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-rose-500/35 bg-rose-950/40 text-rose-200">É?œã˜? {userStats.hearts}</span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-500/35 bg-amber-950/40 text-amber-200">–Y¶T {coinsUiLabel}</span>
                      <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('muller-open-profile-settings', { detail: { tab: 'ajustes' } }))} className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-sky-500/35 bg-sky-900/30 text-sky-200 hover:bg-sky-800/40 transition">Ajustes</button>
                  </div>
              </div>

              {toastItems.length > 0 && (
                  <div className="fixed top-24 right-3 z-[170] flex flex-col gap-2 max-w-[min(92vw,360px)]">
                      {toastItems.map((t) => (
                          <div key={t.id} className={`muller-glass-card rounded-xl px-3 py-2 text-xs font-bold ${t.kind === 'error' ? 'border-red-500/45 text-red-100 bg-red-900/35' : t.kind === 'success' ? 'border-emerald-500/45 text-emerald-100 bg-emerald-900/35' : 'text-sky-100'}`}>
                              {t.message}
                          </div>
                      ))}
                  </div>
              )}

              {/* MODAL LOGIN */}
              
              {showLoginModal && (
                  <div className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-center items-center p-4 md:p-8 animate-in zoom-in duration-300">
                      <div className="bg-slate-900 border border-amber-500 p-6 md:p-8 rounded-2xl max-w-md w-full shadow-[0_0_40px_rgba(245,158,11,0.3)] text-center">
                          <Icon name="crown" className="w-12 h-12 md:w-16 md:h-16 text-amber-500 mx-auto mb-4" />
                          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">Cuenta VIP</h1>
                          <input type="text" placeholder="Ej: SuperKlaus" className="w-full bg-black/50 border border-gray-600 p-3 md:p-4 rounded-xl text-white font-bold text-center mb-6 outline-none focus:border-amber-500 text-sm md:text-base" value={tempUsername} onChange={(e)=>setTempUsername(e.target.value)} />
                          <button onClick={handleRegister} className="w-full bg-amber-600 hover:bg-amber-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-black text-lg md:text-xl shadow-xl transition">Empezar a Estudiar</button>
                      </div>
                  </div>
              )}

              {/* MODAL MUERTE */}
              {showDeathModal && (
                  <div className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-center items-center p-4 md:p-8 animate-in zoom-in duration-300">
                      <Icon name="heart" className="w-20 h-20 md:w-24 md:h-24 text-red-600 mb-4 md:mb-6 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]" />
                      <h1 className="text-3xl md:text-5xl font-black text-white mb-4 text-center">∂≠Te has quedado sin vidas!</h1>
                      <div className="flex gap-4">
                          <button onClick={buyHearts} className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 md:px-8 py-3 md:py-4 rounded-xl font-black text-base md:text-xl shadow-xl flex items-center gap-2"><Icon name="coins" className="w-5 h-5 md:w-6 md:h-6" /> Comprar 5 É?œã˜? (50 Coins)</button>
                      </div>
                  </div>
              )}

      
              {showShortcutsModal && (
                  <div className="fixed inset-0 z-[129] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowShortcutsModal(false)} role="presentation">
                      <div className="bg-slate-900 border border-white/15 rounded-2xl p-5 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                          <h3 className="text-lg font-black text-white mb-3">Atajos de teclado</h3>
                          <ul className="text-sm text-gray-400 space-y-2">
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">?</kbd> É?" esta ayuda</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">I</kbd> É?" Inicio</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">R</kbd> É?" Ruta (A0É≈'C1)</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">H</kbd> É?" Historia</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">V</kbd> É?" Vocabulario</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">P</kbd> É?" Progreso</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">M</kbd> É?" Centro M«¨ller</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">O</kbd> É?" Comunidad (cuenta, directorio, liga)</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">Esc</kbd> É?" cerrar modales</li>
                          </ul>
                          <button type="button" className="mt-4 w-full py-2 rounded-xl bg-slate-700 font-bold text-sm" onClick={() => setShowShortcutsModal(false)}>Cerrar</button>
                      </div>
                  </div>
              )}

              {showVocabMixModal && (
                  <div className="absolute inset-0 z-[60] bg-black/90 flex flex-col justify-center items-center p-4 md:p-8 animate-in zoom-in duration-300">
                      <div className="bg-slate-900 border border-purple-600/50 p-4 md:p-6 rounded-2xl max-w-md w-full shadow-2xl max-h-[85vh] overflow-y-auto">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <h2 className="text-lg md:text-xl font-black text-purple-200 flex items-center gap-2"><Icon name="shuffle" className="w-5 h-5 md:w-6 md:h-6" /> Mezclar lecciones</h2>
                              <ExerciseHelpBtn helpId="guiones_mix" compact />
                          </div>
                          <p className="text-xs text-gray-400 mb-4">Marca las lecciones que quieres incluir y pulsa Mezclar.</p>
                          <div className="flex flex-col gap-2 mb-4">
                              {customVocabLessons.map((lesson) => (
                                  <label key={lesson.id} className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-gray-700 cursor-pointer hover:border-purple-500">
                                      <input type="checkbox" className="accent-purple-500 w-4 h-4" checked={!!mixLessonSelection[lesson.id]} onChange={(e) => setMixLessonSelection((prev) => ({ ...prev, [lesson.id]: e.target.checked }))} />
                                      <span className="text-sm text-white font-bold">{lesson.title}</span>
                                      <span className="text-[10px] text-gray-500 ml-auto">{lesson.words.length} pal.</span>
                                  </label>
                              ))}
                          </div>
                          <div className="flex gap-2">
                              <button onClick={() => setShowVocabMixModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl font-bold text-sm">Cancelar</button>
                              <button onClick={() => {
                                  const selected = customVocabLessons.filter((l) => mixLessonSelection[l.id]);
                                  if (selected.length === 0) { alert("Selecciona al menos una lecci«¸n."); return; }
                                  let words = [];
                                  selected.forEach((lesson) => { words = words.concat(lesson.words); });
                                  words.sort(() => Math.random() - 0.5);
                                  const diffWords = words.filter((w) => w.diff === 1);
                                  const final = mullerSortVocabBySrs([...words, ...diffWords], mullerGetVocabSrsMap());
                                  setCurrentVocabList(final);
                                  setActiveScriptTitle("Mezcla personalizada");
                                  setVocabReviewIndex(0);
                                  setShowVocabTranslation(false);
                                  setShowVocabMixModal(false);
                                  setActiveTab('vocabulario');
                              }} className="flex-1 bg-purple-600 hover:bg-purple-500 py-2 rounded-xl font-bold text-sm">Mezclar e ir a Vocab</button>
                          </div>
                      </div>
                  </div>
              )}

              {showMullerHub && (
                  <div className="fixed inset-0 z-[85] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6" onClick={() => setShowMullerHub(false)} role="presentation">
                      <div role="dialog" aria-modal="true" aria-labelledby="muller-hub-title" className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                          <h2 id="muller-hub-title" className="sr-only">Centro M«¨ller</h2>
                          <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-black/40 items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                  {[
                                      { id: 'voices', label: 'Voces' },
                                      { id: 'tips', label: 'Ayuda' },
                                      { id: 'chromeai', label: 'IA Chrome' },
                                  ].map((t) => (
                                      <button key={t.id} type="button" onClick={() => setMullerHubTab(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${mullerHubTab === t.id ? 'bg-sky-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>{t.label}</button>
                                  ))}
                              </div>
                              <ExerciseHelpBtn helpId="hub_centro" compact className="!border-sky-500/30" />
                          </div>
                          <div className="p-4 md:p-5 overflow-y-auto text-sm">
                              {mullerHubTab === 'voices' && (
                                  <div className="space-y-4">
                                      <p className="text-xs text-gray-400">Las voces <strong className="text-white">neural / premium</strong> (si las trae tu navegador) suelen sonar m«≠s naturales. Todo es <strong className="text-white">gratis</strong>: usa el motor de voz del sistema (Chrome/Edge suelen traer m«≠s opciones).</p>
                                      <button
                                          type="button"
                                          className="text-[10px] font-bold text-sky-400 hover:text-white underline underline-offset-2"
                                          onClick={() => {
                                              window.speechSynthesis.getVoices();
                                              setTtsPrefsEpoch((x) => x + 1);
                                          }}
                                      >
                                          Recargar lista de voces
                                      </button>
                                      <div>
                                          <label className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Alem«≠n (Historias, Shadowing, B1/B2É?›)</label>
                                          <select
                                              className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white text-xs"
                                              value={ttsDeUri}
                                              onChange={(e) => {
                                                  const v = e.target.value;
                                                  setTtsDeUri(v);
                                                  if (v) localStorage.setItem('muller_tts_de', v);
                                                  else localStorage.removeItem('muller_tts_de');
                                                  setTtsPrefsEpoch((x) => x + 1);
                                                  window.speechSynthesis.cancel();
                                              }}
                                          >
                                              <option value="">Predeterminada (autom«≠tica M«¨ller)</option>
                                              {sortedDeVoices.map((v) => {
                                                  const uri = v.voiceURI || v.name;
                                                  return (
                                                  <option key={uri + v.name} value={uri}>{v.name} ∂˙ {v.lang}{window.__mullerRankVoiceNatural(v) >= 20 ? ' É~.' : ''}</option>
                                                  );
                                              })}
                                          </select>
                                          <button
                                              type="button"
                                              className="mt-2 text-xs font-bold text-sky-300 hover:text-white"
                                              onClick={() => {
                                                  const u = new SpeechSynthesisUtterance('Guten Tag, ich «¨be Deutsch mit Professor M«¨ller.');
                                                  u.lang = 'de-DE';
                                                  window.__mullerApplyPreferredDeVoice(u);
                                                  u.rate = parseFloat(localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') || 0.92;
                                                  window.speechSynthesis.cancel();
                                                  window.speechSynthesis.speak(u);
                                              }}
                                          >
                                              É-Ù Probar voz alemana
                                          </button>
                                      </div>
                                      <div>
                                          <label className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Espa«Òol (traducciones en podcast / vocab)</label>
                                          <select
                                              className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white text-xs"
                                              value={ttsEsUri}
                                              onChange={(e) => {
                                                  const v = e.target.value;
                                                  setTtsEsUri(v);
                                                  if (v) localStorage.setItem('muller_tts_es', v);
                                                  else localStorage.removeItem('muller_tts_es');
                                                  setTtsPrefsEpoch((x) => x + 1);
                                              }}
                                          >
                                              <option value="">Predeterminada (autom«≠tica)</option>
                                              {sortedEsVoices.map((v) => {
                                                  const uri = v.voiceURI || v.name;
                                                  return (
                                                  <option key={uri + v.name} value={uri}>{v.name} ∂˙ {v.lang}</option>
                                                  );
                                              })}
                                          </select>
                                          <button
                                              type="button"
                                              className="mt-2 text-xs font-bold text-amber-300 hover:text-white"
                                              onClick={() => {
                                                  const u = new SpeechSynthesisUtterance('Hola, repaso vocabulario y traducciones.');
                                                  u.lang = 'es-ES';
                                                  window.__mullerApplyPreferredEsVoice(u);
                                                  window.speechSynthesis.cancel();
                                                  window.speechSynthesis.speak(u);
                                              }}
                                          >
                                              É-Ù Probar voz espa«Òol
                                          </button>
                                      </div>
                                      <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                                          <p className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">Velocidad TTS (preset)</p>
                                          <div className="flex flex-wrap gap-2">
                                              {[
                                                  { id: 'slow', label: 'Lenta', rate: '0.78' },
                                                  { id: 'normal', label: 'Normal', rate: '0.92' },
                                                  { id: 'exam', label: 'Examen', rate: '1.0' },
                                              ].map((p) => (
                                                  <button key={p.id} type="button" className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${(typeof window !== 'undefined' && (localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') === p.rate) ? 'bg-violet-600 border-violet-400 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`} onClick={() => { try { localStorage.setItem(MULLER_TTS_RATE_KEY, p.rate); } catch (e) {} setTtsPrefsEpoch((x) => x + 1); }}>
                                                      {p.label} ({p.rate})
                                                  </button>
                                              ))}
                                          </div>
                                          <p className="text-[10px] text-gray-500">Historias, simulacro oral y pruebas de voz usan esta base (ajusta el slider de escena si hace falta).</p>
                                      </div>
                                      <div className="border-t border-white/10 pt-4 mt-2 space-y-2">
                                          <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Tema visual</p>
                                          <div className="flex flex-wrap gap-2">
                                              {[
                                                  { id: 'dark', label: 'Oscuro' },
                                                  { id: 'light', label: 'Claro' },
                                                  { id: 'hc', label: 'Alto contraste' },
                                              ].map((t) => (
                                                  <button key={t.id} type="button" onClick={() => { setUiTheme(t.id); try { localStorage.setItem(MULLER_THEME_KEY, t.id); } catch (e) {} }} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${uiTheme === t.id ? 'bg-cyan-600 border-cyan-300 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`}>{t.label}</button>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                              )}
                              {mullerHubTab === 'tips' && (
                                  <div className="space-y-3 text-xs text-gray-300">
                                      <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Atajos de teclado (fuera de campos de texto)</p>
                                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">?</kbd> o <kbd className="px-1 rounded bg-black/50 border border-white/20">Shift+/</kbd> É?" ayuda de atajos</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">I</kbd> É?" Inicio (panel principal)</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">H</kbd> É?" pesta«Òa Historia</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">V</kbd> É?" Vocab</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">P</kbd> É?" Progreso</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">M</kbd> É?" Centro M«¨ller</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">Esc</kbd> É?" cierra paneles / ayuda</li>
                                      </ul>
                                      <p>Usa <strong className="text-white">Chrome o Edge</strong> para m«≠s voces y mejor reconocimiento de voz.</p>
                                      <p><strong className="text-white">GitHub Pages</strong> requiere HTTPS; el micr«¸fono funciona al permitir permisos.</p>
                                      <p>Si la lista sale vac«a, pulsa <strong className="text-white">Recargar lista de voces</strong> en la pesta«Òa Voces o recarga la p«≠gina.</p>
                                      <p><kbd className="px-1 py-0.5 rounded bg-black/50 border border-white/20 text-[10px]">Esc</kbd> cierra este panel.</p>
                                      <button type="button" onClick={() => { setTourStep(1); setShowMullerHub(false); }} className="w-full py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 font-bold text-xs">Repetir tour guiado (5 pasos)</button>
                                  </div>
                              )}
                              {mullerHubTab === 'chromeai' && (
                                  <div className="space-y-3 text-xs text-gray-300">
                                      <ExerciseHelpBtn helpId="hub_chrome_ai" compact className="!border-violet-500/40" />
                                      <p className="text-[11px] leading-relaxed text-gray-400">
                                          Esto usa la <strong className="text-white">IA integrada de Google Chrome</strong>: el modelo se <strong className="text-white">descarga en tu PC</strong> y luego puede funcionar <strong className="text-white">sin depender de nuestro servidor</strong>. No es la É?ogaler«aÉ?? de Edge: Microsoft Edge puede tener funciones parecidas <strong className="text-gray-300">con flags</strong>.
                                      </p>
                                      <p className="text-[10px] text-gray-500">
                                          Requisitos t«picos: Chrome de escritorio reciente, espacio libre en disco, modelo descargable desde Chrome. Documentaci«¸n:{' '}
                                          <a className="text-sky-400 underline hover:text-white" href="https://developer.chrome.com/docs/ai/built-in" target="_blank" rel="noopener noreferrer">Built-in AI (Chrome)</a>
                                          {' ∂˙ '}
                                          <a className="text-sky-400 underline hover:text-white" href="https://developer.chrome.com/docs/ai/summarizer-api" target="_blank" rel="noopener noreferrer">Summarizer API</a>
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                          <button type="button" onClick={fillChromeAiFromScene} className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-[11px] border border-white/10">Cargar escena actual (Historia)</button>
                                          <button type="button" disabled={chromeAiBusy} onClick={runChromeLocalSummarize} className="px-3 py-2 rounded-xl bg-violet-700 hover:bg-violet-600 disabled:opacity-50 font-bold text-[11px] border border-violet-500/40">Resumir con IA local</button>
                                      </div>
                                      <textarea
                                          className="w-full min-h-[100px] bg-black/50 border border-white/15 rounded-lg p-2 text-white font-mono text-[11px] outline-none focus:border-violet-500"
                                          placeholder="Pega aqu« un texto en alem«≠n (guion, art«culoÉ?›) o usa É?oCargar escenaÉ??."
                                          value={chromeAiText}
                                          onChange={(e) => setChromeAiText(e.target.value)}
                                      />
                                      {chromeAiLine ? <p className="text-[10px] text-amber-200/90">{chromeAiLine}</p> : null}
                                      {chromeAiOut ? (
                                          <div className="bg-black/40 border border-violet-800/40 rounded-xl p-3 text-[11px] text-gray-200 whitespace-pre-wrap max-h-48 overflow-y-auto">{chromeAiOut}</div>
                                      ) : null}
                                  </div>
                              )}
                          </div>
                          <div className="p-3 border-t border-white/10 flex justify-end">
                              <button type="button" onClick={() => setShowMullerHub(false)} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 font-bold text-sm">Cerrar</button>
                          </div>
                      </div>
                  </div>
              )}

              {tourStep >= 1 && tourStep <= 5 && (() => {
                  const steps = [
                      { t: 'Bienvenido al Entrenador M«¨ller', d: 'Historia es el centro: escenas, audio y modos (Diktat, quizÉ?›). Usa las pesta«Òas arriba para cambiar de actividad.' },
                      { t: 'Voces naturales (gratis)', d: 'Pulsa el icono del panel azul: elige voz alemana y espa«Òol del sistema. Prueba con el bot«¸n É?oProbar vozÉ??.' },
                      { t: 'Vocab y Progreso', d: 'F«≠cil/Normal/Dif«cil programa repaso espaciado (SRS). En Progreso ves mazos y exportas a Anki.' },
                      { t: 'Entrenamiento avanzado', d: 'Entrenamiento concentra art«culos, verbos y preposiciones con seguimiento de precisi«¸n.' },
                      { t: 'Shadowing, Escritura y B1/B2', d: 'Shadowing entrena pronunciaci«¸n; Escritura incluye OCR; B1/B2 son frases modelo. ∂≠Viel Erfolg!' },
                  ];
                  const item = steps[tourStep - 1];
                  const i = tourStep - 1;
                  return (
                  <div className="fixed inset-0 z-[90] bg-black/80 flex items-center justify-center p-4" onClick={() => setTourStep(0)}>
                      <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                          <h3 className="text-lg font-black text-white mb-2">{item.t}</h3>
                          <p className="text-sm text-gray-400 mb-4">{item.d}</p>
                          <div className="flex gap-2 justify-between items-center">
                              <button type="button" className="text-xs text-gray-500" onClick={() => setTourStep(0)}>Saltar</button>
                              <button type="button" className="px-4 py-2 rounded-lg bg-sky-600 font-bold text-sm" onClick={() => (i < 4 ? setTourStep(tourStep + 1) : setTourStep(0))}>{i < 4 ? 'Siguiente' : 'Listo'}</button>
                          </div>
                          <p className="text-[10px] text-gray-600 mt-3 text-center">{tourStep}/5</p>
                      </div>
                  </div>
                  );
              })()}

              {exerciseHelpId && MULLER_EXERCISE_HELP[exerciseHelpId] && (
                  <div className="fixed inset-0 z-[125] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setExerciseHelpId(null)} role="presentation">
                      <div role="dialog" aria-modal="true" aria-labelledby="exercise-help-title" className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl p-5 md:p-6" onClick={(e) => e.stopPropagation()}>
                          <h3 id="exercise-help-title" className="text-lg font-black text-white mb-2 pr-6">{MULLER_EXERCISE_HELP[exerciseHelpId].title}</h3>
                          <p className="text-sm text-gray-300 leading-relaxed mb-4">{MULLER_EXERCISE_HELP[exerciseHelpId].what}</p>
                          <p className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">Consejos</p>
                          <ul className="list-disc list-inside text-sm text-gray-400 space-y-2 mb-6">
                              {MULLER_EXERCISE_HELP[exerciseHelpId].tips.map((t, i) => (
                                  <li key={i}>{t}</li>
                              ))}
                          </ul>
                          <button type="button" className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm" onClick={() => setExerciseHelpId(null)}>Cerrar</button>
                          <p className="text-[10px] text-gray-600 mt-3 text-center"><kbd className="px-1 py-0.5 rounded bg-black/50 border border-white/20">Esc</kbd> tambi«∏n cierra</p>
                      </div>
                  </div>
              )}

              <nav className="muller-mobile-bottom-nav" aria-label="Navegacion principal">
                  <button type="button" onClick={() => { setActiveTab('progreso'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'progreso' ? 'is-active' : ''}><Icon name="bar-chart" className="w-4 h-4" />Progreso</button>
                  <button type="button" onClick={() => { setActiveTab('guiones'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'guiones' ? 'is-active' : ''}><Icon name="file-text" className="w-4 h-4" />Biblioteca</button>
                  <button type="button" onClick={() => { setActiveTab('lexikon'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'lexikon' ? 'is-active' : ''}><Icon name="library" className="w-4 h-4" />Lexikon</button>
                  <button type="button" onClick={() => { setActiveTab('telc'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'telc' ? 'is-active' : ''}><Icon name="clipboard-check" className="w-4 h-4" />TELC</button>
                  <button type="button" onClick={() => { setActiveTab('storybuilder'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'storybuilder' ? 'is-active' : ''}><Icon name="sparkles" className="w-4 h-4" />IA</button>
                  <button type="button" onClick={() => { setActiveTab('historiaspro'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'historiaspro' ? 'is-active' : ''}><Icon name="feather" className="w-4 h-4" />Pro</button>
                  <button type="button" onClick={() => { setActiveTab('comunidad'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'comunidad' ? 'is-active' : ''}><Icon name="trophy" className="w-4 h-4" />Comunidad</button>
              </nav>

              {/* CONTENIDO PRINCIPAL */}
              <div className={`muller-app-main flex-1 overflow-y-auto relative flex flex-col hide-scrollbar pt-[var(--muller-mobile-header-h)] pb-[calc(var(--muller-mobile-bottom-nav-h)+max(0.5rem,env(safe-area-inset-bottom,0px)))] ${activeTab === 'historia' && mode !== 'quiz' && mode !== 'interview' && !practiceActive ? 'muller-main-historia-pb' : ''} ${uiTheme === 'light' ? 'text-slate-900' : ''}`}>
                  {activeTab === 'inicio' && !practiceActive && window.InicioPanel && (
                      <InicioPanel
                          healthSnapshot={healthSnapshot}
                          showSelfCheckPanel={showSelfCheckPanel}
                          setShowSelfCheckPanel={setShowSelfCheckPanel}
                          getSelfCheckItems={getSelfCheckItems}
                          vocabSrsDueCount={vocabSrsDueCount}
                          setActiveTab={setActiveTab}
                          setMode={setMode}
                          stopAudio={stopAudio}
                          setPracticeActive={setPracticeActive}
                          setVocabDueFilterOnly={setVocabDueFilterOnly}
                          setBxBankLevel={setBxBankLevel}
                          setBxCategory={setBxCategory}
                          setShowMullerHub={setShowMullerHub}
                          setMullerHubTab={setMullerHubTab}
                          setTourStep={setTourStep}
                      />
                  )}
                  {activeTab === 'lectura' && !practiceActive && window.LecturaPanel && (
                      <LecturaPanel {...lecturaPanelProps} />
                  )}
                  {activeTab === 'historia' && !practiceActive && window.HistoriaPanel && (
                      <HistoriaPanel
                          historiaExerciseHelpId={historiaExerciseHelpId}
                          isDefaultScript={isDefaultScript}
                          activeSavedScriptId={activeSavedScriptId}
                          loadDefaultGuion={loadDefaultGuion}
                          loadSavedScript={loadSavedScript}
                          savedScripts={savedScripts}
                          activeScriptTitle={activeScriptTitle}
                          mode={mode}
                          podcastMode={podcastMode}
                          setFluesternMode={setFluesternMode}
                          fluesternMode={fluesternMode}
                          setNoiseEnabled={setNoiseEnabled}
                          noiseEnabled={noiseEnabled}
                          setDiktatMode={setDiktatMode}
                          diktatMode={diktatMode}
                          setBlindMode={setBlindMode}
                          blindMode={blindMode}
                          setLueckentextMode={setLueckentextMode}
                          lueckentextMode={lueckentextMode}
                          setPuzzleMode={setPuzzleMode}
                          puzzleMode={puzzleMode}
                          setDeclinaMode={setDeclinaMode}
                          declinaMode={declinaMode}
                          setArtikelSniperMode={setArtikelSniperMode}
                          artikelSniperMode={artikelSniperMode}
                          resetModes={resetModes}
                          stopAudio={stopAudio}
                          setTempusMode={setTempusMode}
                          tempusMode={tempusMode}
                          roleplayChar={roleplayChar}
                          setRoleplayChar={setRoleplayChar}
                          historiaPlaylistAllScripts={historiaPlaylistAllScripts}
                          oralQIdx={oralQIdx}
                          setOralSecs={setOralSecs}
                          oralSecs={oralSecs}
                          setOralDeadline={setOralDeadline}
                          setOralClock={setOralClock}
                          oralLeftSec={oralLeftSec}
                          micMouseDownGuard={micMouseDownGuard}
                          handleVoiceStart={handleVoiceStart}
                          handleVoiceStop={handleVoiceStop}
                          micTouchStartGuard={micTouchStartGuard}
                          isListening={isListening}
                          spokenText={spokenText}
                          pronunciationFeedback={pronunciationFeedback}
                          runSingleSubmitAction={runSingleSubmitAction}
                          handleOralNextQuestion={handleOralNextQuestion}
                          setMode={setMode}
                          setSpokenText={setSpokenText}
                          saveProgress={saveProgress}
                          mergeActivityPoints={mergeActivityPoints}
                          getActualSceneIndex={getActualSceneIndex}
                          guionData={guionData}
                          renderHighlightedText={renderHighlightedText}
                          setShowCurrentTranslation={setShowCurrentTranslation}
                          showCurrentTranslation={showCurrentTranslation}
                          playSceneAudio={playSceneAudio}
                          sanitizeHistoriaSpeechText={sanitizeHistoriaSpeechText}
                          grammarPolizeiMsg={grammarPolizeiMsg}
                          pronunciationScore={pronunciationScore}
                          handleNext={handleNext}
                          puzzleAnswer={puzzleAnswer}
                          setPuzzleAnswer={setPuzzleAnswer}
                          puzzleWords={puzzleWords}
                          setPuzzleWords={setPuzzleWords}
                          showPuzzleResult={showPuzzleResult}
                          puzzleLastOk={puzzleLastOk}
                          handlePuzzleCheck={handlePuzzleCheck}
                          setIsPlaying={setIsPlaying}
                          togglePlay={togglePlay}
                          isPlaying={isPlaying}
                          isReviewing={isReviewing}
                          diktatInput={diktatInput}
                          setDiktatInput={setDiktatInput}
                          handleExerciseEnterSubmit={handleExerciseEnterSubmit}
                          handleDiktatCheck={handleDiktatCheck}
                          showDiktatResult={showDiktatResult}
                          renderDiktatDiff={renderDiktatDiff}
                          diktatMotivationMsg={diktatMotivationMsg}
                          historiaAudioOnly={historiaAudioOnly}
                          sceneIndex={sceneIndex}
                          handlePrev={handlePrev}
                          playbackRate={playbackRate}
                          setPlaybackRate={setPlaybackRate}
                          setHistoriaAudioOnly={setHistoriaAudioOnly}
                          tempusVerbList={tempusVerbList}
                          tempusSelectedVerb={tempusSelectedVerb}
                          inferTempusContextLabel={inferTempusContextLabel}
                          showAITutor={showAITutor}
                          trySaveGrammarStructure={trySaveGrammarStructure}
                          showTutor={showTutor}
                          setShowTutor={setShowTutor}
                          tutorMessage={tutorMessage}
                          showGrammarPrompt={showGrammarPrompt}
                          setShowGrammarPrompt={setShowGrammarPrompt}
                          customGrammarInput={customGrammarInput}
                          setCustomGrammarInput={setCustomGrammarInput}
                          handleCustomGrammarSave={handleCustomGrammarSave}
                      />
                  )}
                  {activeTab === 'escritura' && !practiceActive && window.EscrituraPanel && (
                      <EscrituraPanel
                          escrituraExerciseHelpId={escrituraExerciseHelpId}
                          writingMode={writingMode}
                          setWritingMode={setWritingMode}
                          setWritingDictReveal={setWritingDictReveal}
                          setWritingCanvasKey={setWritingCanvasKey}
                          ocrHistoryList={ocrHistoryList}
                          writingCopyIdx={writingCopyIdx}
                          setWritingCopyIdx={setWritingCopyIdx}
                          writingDictSource={writingDictSource}
                          setWritingDictSource={setWritingDictSource}
                          writingDictScriptId={writingDictScriptId}
                          setWritingDictScriptId={setWritingDictScriptId}
                          writingScriptOptions={writingScriptOptions}
                          writingDictationPool={writingDictationPool}
                          writingDictIdx={writingDictIdx}
                          setWritingDictIdx={setWritingDictIdx}
                          writingPromptIdx={writingPromptIdx}
                          setWritingPromptIdx={setWritingPromptIdx}
                          writingTelcInputMode={writingTelcInputMode}
                          setWritingTelcInputMode={setWritingTelcInputMode}
                          writingTelcTypedText={writingTelcTypedText}
                          setWritingTelcTypedText={setWritingTelcTypedText}
                          handleExerciseEnterSubmit={handleExerciseEnterSubmit}
                          runTelcCoachFromCurrentInput={runTelcCoachFromCurrentInput}
                          writingTelcIdx={writingTelcIdx}
                          setWritingTelcIdx={setWritingTelcIdx}
                          speakRutaDe={speakRutaDe}
                          writingTelcCoach={writingTelcCoach}
                          writingLetterIdx={writingLetterIdx}
                          setWritingLetterIdx={setWritingLetterIdx}
                          guionData={guionData}
                          writingGuionWriteIdx={writingGuionWriteIdx}
                          setWritingGuionWriteIdx={setWritingGuionWriteIdx}
                          currentVocabList={currentVocabList}
                          writingVocabIdx={writingVocabIdx}
                          setWritingVocabIdx={setWritingVocabIdx}
                          writingGrid={writingGrid}
                          setWritingGrid={setWritingGrid}
                          writingStroke={writingStroke}
                          setWritingStroke={setWritingStroke}
                          writingCanvasKey={writingCanvasKey}
                          writingCompareTarget={writingCompareTarget}
                          writingCanvasSnapshot={writingCanvasSnapshot}
                          setWritingCanvasSnapshot={setWritingCanvasSnapshot}
                          setOcrHistoryList={setOcrHistoryList}
                          setWritingTelcLastOcrText={setWritingTelcLastOcrText}
                          runSingleSubmitAction={runSingleSubmitAction}
                      />
                  )}
                  {activeTab === 'comunidad' && !practiceActive && window.ComunidadPanel && (
                      <ComunidadPanel
                          communitySubTab={communitySubTab}
                          setCommunitySubTab={setCommunitySubTab}
                          unifiedAuth={unifiedAuth}
                          isCreatorAccount={isCreatorAccount}
                          profileNameDraft={profileNameDraft}
                          setProfileNameDraft={setProfileNameDraft}
                          profileNameBusy={profileNameBusy}
                          setProfileNameBusy={setProfileNameBusy}
                          profileNameMsg={profileNameMsg}
                          setProfileNameMsg={setProfileNameMsg}
                          setSupabaseUser={setSupabaseUser}
                          setSupabaseProfile={setSupabaseProfile}
                          saveProgress={saveProgress}
                          setAuthTick={setAuthTick}
                          mullerAuthLogout={mullerAuthLogout}
                          setAuthPassword={setAuthPassword}
                          authMode={authMode}
                          setAuthMode={setAuthMode}
                          authError={authError}
                          setAuthError={setAuthError}
                          authEmail={authEmail}
                          setAuthEmail={setAuthEmail}
                          authPassword={authPassword}
                          authDisplayName={authDisplayName}
                          setAuthDisplayName={setAuthDisplayName}
                          authBusy={authBusy}
                          setAuthBusy={setAuthBusy}
                          userStats={userStats}
                          walletCoins={walletCoins}
                          rewardStatus={rewardStatus}
                          walletLoading={walletLoading}
                          economyMsg={economyMsg}
                          setEconomyMsg={setEconomyMsg}
                          setWalletCoins={setWalletCoins}
                          economyReasonText={economyReasonText}
                          adOpenedAt={adOpenedAt}
                          setAdOpenedAt={setAdOpenedAt}
                          premiumStatus={premiumStatus}
                          supabaseUser={supabaseUser}
                          remoteProfiles={remoteProfiles}
                          directoryLocals={directoryLocals}
                          leagueBoard={leagueBoard}
                          mullerMaskEmail={mullerMaskEmail}
                          mullerGetSupabaseClient={mullerGetSupabaseClient}
                          mullerAccountsLoad={mullerAccountsLoad}
                          mullerAccountsSave={mullerAccountsSave}
                          mullerAuthRegister={mullerAuthRegister}
                          mullerAuthLogin={mullerAuthLogin}
                      />
                  )}
                  {window.OnboardingModal && (
                      <OnboardingModal
                          showOnboarding={showOnboarding}
                          onboardingStep={onboardingStep}
                          finishOnboarding={finishOnboarding}
                          onboardingNever={onboardingNever}
                          setOnboardingNever={setOnboardingNever}
                          setOnboardingStep={setOnboardingStep}
                      />
                  )}
                  {window.ProfileSettingsModal && (
                      <ProfileSettingsModal
                          showProfileSettingsModal={showProfileSettingsModal}
                          setShowProfileSettingsModal={setShowProfileSettingsModal}
                          profileSettingsTab={profileSettingsTab}
                          setProfileSettingsTab={setProfileSettingsTab}
                          userStats={userStats}
                          coinsUiLabel={coinsUiLabel}
                          unifiedAuth={unifiedAuth}
                          mullerMaskEmail={mullerMaskEmail}
                          profileNameDraft={profileNameDraft}
                          setProfileNameDraft={setProfileNameDraft}
                          profileNameBusy={profileNameBusy}
                          setProfileNameBusy={setProfileNameBusy}
                          setProfileNameMsg={setProfileNameMsg}
                          saveProgress={saveProgress}
                          setAuthTick={setAuthTick}
                          setSupabaseProfile={setSupabaseProfile}
                          supabaseUser={supabaseUser}
                          profileNameMsg={profileNameMsg}
                          mullerGetSupabaseClient={mullerGetSupabaseClient}
                          mullerAccountsLoad={mullerAccountsLoad}
                          mullerAccountsSave={mullerAccountsSave}
                          setSupabaseUser={setSupabaseUser}
                          mullerAuthLogout={mullerAuthLogout}
                          setAuthPassword={setAuthPassword}
                          authMode={authMode}
                          setAuthMode={setAuthMode}
                          authError={authError}
                          setAuthError={setAuthError}
                          authEmail={authEmail}
                          setAuthEmail={setAuthEmail}
                          authPassword={authPassword}
                          setAuthDisplayName={setAuthDisplayName}
                          authDisplayName={authDisplayName}
                          authBusy={authBusy}
                          setAuthBusy={setAuthBusy}
                          mullerAuthRegister={mullerAuthRegister}
                          mullerAuthLogin={mullerAuthLogin}
                          setUiTheme={setUiTheme}
                          uiTheme={uiTheme}
                          MULLER_THEME_KEY={MULLER_THEME_KEY}
                          setSfxEpoch={setSfxEpoch}
                          sfxEpoch={sfxEpoch}
                          noiseEnabled={noiseEnabled}
                          setNoiseEnabled={setNoiseEnabled}
                          MULLER_TTS_RATE_KEY={MULLER_TTS_RATE_KEY}
                          setTtsPrefsEpoch={setTtsPrefsEpoch}
                          setShowFloatingTools={setShowFloatingTools}
                          showFloatingTools={showFloatingTools}
                          setReduceMotionUi={setReduceMotionUi}
                          reduceMotionUi={reduceMotionUi}
                          setPodcastMode={setPodcastMode}
                          podcastMode={podcastMode}
                          setHistoriaAudioOnly={setHistoriaAudioOnly}
                          historiaAudioOnly={historiaAudioOnly}
                          MULLER_ONBOARDING_KEY={MULLER_ONBOARDING_KEY}
                          setShowOnboarding={setShowOnboarding}
                          setOnboardingNever={setOnboardingNever}
                          setShowMullerHub={setShowMullerHub}
                          setMullerHubTab={setMullerHubTab}
                      />
                  )}

                  {activeTab === 'telc' && !practiceActive && (() => {
                      const telcPack = (window.MULLER_TELC_BY_LEVEL && window.MULLER_TELC_BY_LEVEL[telcLevel]) || (window.MULLER_TELC_BY_LEVEL && window.MULLER_TELC_BY_LEVEL.B1);
                      const tc = uiTheme === 'light' ? 'text-slate-800 border-orange-200 bg-white/90' : 'text-gray-200 border-orange-900/40 bg-black/35';
                      const tcMuted = uiTheme === 'light' ? 'text-slate-600' : 'text-gray-400';
                      const tcHeading = uiTheme === 'light' ? 'text-slate-900' : 'text-white';
                      const lvBtnOff = uiTheme === 'light' ? 'bg-slate-200/90 border-slate-300 text-slate-600 hover:bg-slate-300' : 'bg-black/30 border-white/10 text-gray-400 hover:text-white';
                      return (
                      <div className={`p-4 md:p-8 max-w-3xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto pb-24 ${uiTheme === 'light' ? 'text-slate-900' : ''}`}>
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                              <h1 className={`text-2xl md:text-4xl font-black flex items-center gap-2 ${uiTheme === 'light' ? 'text-orange-800' : 'text-orange-300'}`}><Icon name="clipboard-check" className="w-8 h-8 md:w-10 md:h-10" /> TELC ∂˙ Gu«a y examen</h1>
                              <ExerciseHelpBtn helpId="nav_telc" />
                          </div>
                          <p className={`text-sm mb-4 leading-relaxed ${tcMuted}`}>Orientaci«¸n educativa por nivel (CEFR). No es un modelo oficial de examen: para convocatorias y modelos actuales usa <a href="https://www.telc.net" target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline ${uiTheme === 'light' ? 'text-orange-700' : 'text-orange-400'}`}>telc.net</a> y tu centro.</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lv) => (
                                  <button key={lv} type="button" onClick={() => setTelcLevel(lv)} className={`px-3 py-2 rounded-xl text-sm font-black border transition ${telcLevel === lv ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : lvBtnOff}`}>{lv}</button>
                              ))}
                          </div>
                          <div className={`rounded-2xl border p-4 md:p-6 mb-6 ${tc}`}>
                              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${uiTheme === 'light' ? 'text-orange-600' : 'text-orange-400/90'}`}>Nivel seleccionado</p>
                              <h2 className={`text-xl md:text-2xl font-black mb-2 ${tcHeading}`}>{telcPack.label}</h2>
                              <p className={`text-sm leading-relaxed ${tcMuted}`}>{telcPack.summary}</p>
                          </div>
                          <div className="space-y-5 text-sm mb-8">
                              {(telcPack.sections || []).map((sec, si) => (
                                  <section key={si} className={`rounded-2xl border p-4 md:p-6 ${tc}`}>
                                      <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tcHeading}`}><Icon name="book-open" className={`w-5 h-5 shrink-0 ${uiTheme === 'light' ? 'text-orange-600' : 'text-orange-400'}`} /> {sec.title}</h3>
                                      <ul className="list-disc list-inside space-y-1.5">
                                          {(sec.items || []).map((line, li) => (
                                              <li key={li} className={uiTheme === 'light' ? 'text-slate-700' : ''}>{line}</li>
                                          ))}
                                      </ul>
                                  </section>
                              ))}
                          </div>
                          <h2 className={`text-lg font-black mb-3 ${tcHeading}`}>D«a del examen (todos los niveles)</h2>
                          <div className={`space-y-6 text-sm ${uiTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                              <section className={`rounded-2xl border p-4 md:p-6 ${tc}`}>
                                  <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tcHeading}`}><Icon name="briefcase" className="w-5 h-5" /> Qu«∏ llevar</h3>
                                  <ul className="list-disc list-inside space-y-1.5">
                                      <li>Documento de identidad v«≠lido (mismo que al registrarte).</li>
                                      <li>Confirmaci«¸n / hoja de inscripci«¸n al examen (si el centro la envi«¸).</li>
                                      <li>L«≠piz negro o azul y goma (si el centro permite escritura a mano).</li>
                                      <li>Reloj anal«¸gico silencioso si te ayuda (sin smartwatch en sala).</li>
                                      <li>Llegada con margen: localiza ba«Òos y aula el d«a anterior si puedes.</li>
                                  </ul>
                              </section>
                              <section className={`rounded-2xl border p-4 md:p-6 ${tc}`}>
                                  <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tcHeading}`}><Icon name="clock" className="w-5 h-5" /> Tiempos orientativos</h3>
                                  <ul className="list-disc list-inside space-y-1.5">
                                      <li>Lectura: varias tareas seguidas É?" gestiona el reloj desde el primer minuto.</li>
                                      <li>Escritura: planifica unos minutos de borrador antes de escribir en limpio.</li>
                                      <li>Oral: suele haber preparaci«¸n corta; usa notas solo si el formato lo permite.</li>
                                      <li>Escucha: en muchos centros una sola emisi«¸n É?" lee las preguntas antes del audio.</li>
                                  </ul>
                              </section>
                              <section className={`rounded-2xl border p-4 md:p-6 ${tc}`}>
                                  <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tcHeading}`}><Icon name="lightbulb" className="w-5 h-5" /> Consejos</h3>
                                  <ul className="list-disc list-inside space-y-1.5">
                                      <li>Descansa bien; el cansancio penaliza sobre todo la escucha.</li>
                                      <li>Si no entiendes una instrucci«¸n, pide aclaraci«¸n corta en alem«≠n.</li>
                                      <li>En la redacci«¸n: coherencia y conectores antes que vocabulario raro.</li>
                                  </ul>
                              </section>
                          </div>
                          <div className={`rounded-xl border border-dashed border-orange-500/35 p-4 mb-6 text-xs ${uiTheme === 'light' ? 'bg-orange-50 text-slate-600' : 'bg-orange-950/20 text-gray-400'}`}>
                              Pr«≠ctica tipo test: abre la pesta«Òa <strong className={uiTheme === 'light' ? 'text-fuchsia-700' : 'text-fuchsia-300'}>Entrenamiento</strong> (art«culos, verbos+prep., preposiciones) y el simulacro con cron«¸metro si est«≠ disponible en tu versi«¸n.
                          </div>
                          <div className="flex flex-wrap gap-3 mt-2">
                              <button type="button" onClick={() => {
                                  const lines = [
                                      `Checklist TELC É?" M«¨ller ∂˙ nivel ${telcLevel}`,
                                      telcPack.label,
                                      telcPack.summary,
                                      '',
                                      'Qu«∏ llevar: DNI/documento, confirmaci«¸n, l«≠pices, llegada temprana.',
                                      'Tiempos: gestionar lectura; planificar escritura; oral con preparaci«¸n; escucha «ßnica.',
                                      'Consejos: descanso, pedir aclaraciones, coherencia en la redacci«¸n.',
                                  ];
                                  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
                                  const a = document.createElement('a');
                                  a.href = URL.createObjectURL(blob);
                                  a.download = `telc_checklist_${telcLevel}_${new Date().toISOString().slice(0, 10)}.txt`;
                                  a.click();
                                  URL.revokeObjectURL(a.href);
                              }} className="px-4 py-2 rounded-xl bg-orange-700 hover:bg-orange-600 font-bold text-sm border border-orange-500/40">Exportar checklist (.txt)</button>
                              <button type="button" onClick={() => {
                                  const w = window.open('', '_blank');
                                  if (!w) return;
                                  w.document.write(`<html><head><title>TELC M«¨ller ${telcLevel}</title></head><body style="font-family:sans-serif;padding:24px;max-width:640px;"><h1>TELC ∂˙ ${telcLevel}</h1><p>${telcPack.summary}</p><p>Usa Ctrl+P para PDF.</p><h2>Checklist</h2><ul><li>Documento</li><li>Confirmaci«¸n</li><li>Material de escritura</li></ul></body></html>`);
                                  w.document.close();
                                  w.print();
                              }} className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm border border-white/10">Imprimir / PDF (navegador)</button>
                          </div>
                      </div>
                      );
                  })()}

                  {/* STORY BUILDER (sin cambios) */}
                  {activeTab === 'storybuilder' && (
                      <div className="p-4 md:p-8 max-w-3xl mx-auto w-full animate-in fade-in duration-500 flex flex-col justify-start md:justify-center min-h-full">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              <h1 className="text-2xl md:text-4xl font-black flex items-center gap-2 md:gap-3 text-fuchsia-400"><Icon name="sparkles" className="w-6 h-6 md:w-10 md:h-10" /> AI Story Builder</h1>
                              <ExerciseHelpBtn helpId="storybuilder" />
                          </div>
                          <p className="text-fuchsia-200 mb-6 md:mb-8 text-base md:text-lg">Crea historias a medida generadas por IA utilizando el nivel y vocabulario exacto que quieres repasar.</p>
                          <p className="text-[11px] text-fuchsia-400/80 mb-4 max-w-xl leading-relaxed border border-fuchsia-800/40 rounded-xl p-3 bg-black/20">Nota: la IA integrada aqu« es simulada en el navegador (sin coste). Si conectas un proveedor de IA externo, ser«a opcional y con <strong className="text-fuchsia-200">clave aportada por ti</strong> É?" no hay IA de pago centralizada en esta app.</p>
                          {!isGeneratingStory ? (
                              <div className="bg-fuchsia-900/40 p-4 md:p-8 rounded-2xl md:rounded-3xl border-2 border-fuchsia-500/50 shadow-2xl flex flex-col gap-4 md:gap-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                      <div>
                                          <label className="text-fuchsia-300 font-bold mb-2 block uppercase tracking-widest text-xs md:text-sm">Nivel del Idioma:</label>
                                          <div className="flex gap-2 flex-wrap">
                                              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
                                                  <button key={lvl} onClick={()=>setAiLevel(lvl)} className={`px-2 md:px-4 py-1 md:py-2 rounded-xl font-black text-xs md:text-sm transition ${aiLevel === lvl ? 'bg-fuchsia-500 text-white shadow-lg scale-105' : 'bg-black/50 text-gray-400 hover:bg-fuchsia-900/50'}`}>{lvl}</button>
                                              ))}
                                          </div>
                                      </div>
                                      <div>
                                          <label className="text-fuchsia-300 font-bold mb-2 block uppercase tracking-widest text-xs md:text-sm">Tem«≠tica:</label>
                                          <select className="w-full bg-black/50 border border-fuchsia-800 p-2 md:p-3 rounded-xl text-white outline-none focus:border-fuchsia-400 text-sm md:text-base" value={aiTheme} onChange={(e)=>setAiTheme(e.target.value)}>
                                              <option value="Alltag">Vida Cotidiana (Alltag)</option>
                                              <option value="Krimi">Polic«aca (Krimi)</option>
                                              <option value="Beruf">Trabajo / Entrevista (Beruf)</option>
                                              <option value="Reise">Viaje y Vacaciones (Reise)</option>
                                              <option value="Abenteuer">Aventura (Abenteuer)</option>
                                              <option value="SciFi">Ciencia Ficci«¸n (SciFi)</option>
                                              <option value="Romantik">Romance (Romantik)</option>
                                              <option value="Horror">Terror (Horror)</option>
                                              <option value="Geschichte">Hist«¸rico (Geschichte)</option>
                                              <option value="Kom«Ùdie">Comedia (Kom«Ùdie)</option>
                                          </select>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="text-fuchsia-300 font-bold mb-2 block uppercase tracking-widest text-xs md:text-sm flex items-center justify-between">
                                          <span>Palabras Clave (Opcional)</span>
                                          <span className="text-[10px] md:text-xs font-normal text-fuchsia-400/70 bg-fuchsia-950 px-2 py-0.5 rounded">Separadas por comas</span>
                                      </label>
                                      <textarea className="w-full h-20 md:h-24 bg-black/50 border border-fuchsia-800 p-3 md:p-4 rounded-xl text-white outline-none focus:border-fuchsia-400 resize-none font-mono text-xs md:text-sm" placeholder="Ej: der Apfel, wandern, gef«œhrlich, sich erinnern an..." value={aiCustomWords} onChange={(e)=>setAiCustomWords(e.target.value)} />
                                  </div>
                                  <button onClick={handleGenerateAIStory} className="mt-2 w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white px-6 md:px-8 py-3 md:py-5 rounded-xl md:rounded-2xl font-black text-lg md:text-2xl shadow-[0_0_30px_rgba(217,70,239,0.4)] flex items-center justify-center gap-2 md:gap-3 transition transform hover:scale-105"><Icon name="brain" className="w-5 h-5 md:w-7 md:h-7" /> Generar Historia M«≠gica</button>
                              </div>
                          ) : (
                              <div className="flex flex-col items-center justify-center h-48 md:h-64 gap-4 md:gap-6 animate-pulse">
                                  <Icon name="brain" className="w-12 h-12 md:w-20 md:h-20 text-fuchsia-500" />
                                  <h2 className="text-lg md:text-2xl font-bold text-fuchsia-300 text-center">La IA del Profesor M«¨ller est«≠ escribiendo un guion...</h2>
                              </div>
                          )}
                      </div>
                  )}

                  {activeTab === 'historiaspro' && !practiceActive && (
                      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                              <div>
                                  <h1 className="text-2xl md:text-4xl font-black flex items-center gap-2 md:gap-3 text-emerald-300"><Icon name="feather" className="w-7 h-7 md:w-10 md:h-10" /> Historias Pro</h1>
                                  <p className="text-sm text-emerald-100/80 mt-1">Escribe en espa«Òol/alem«≠n o sube manuscrito (OCR), y obt«∏n versi«¸n natural por nivel, simplificada, glosario y escenas para `Historia`.</p>
                              </div>
                              <div className={`text-xs px-3 py-2 rounded-xl border ${cloudSyncState === 'synced' ? 'bg-emerald-900/40 border-emerald-500/35 text-emerald-200' : cloudSyncState === 'syncing' ? 'bg-sky-900/35 border-sky-500/35 text-sky-200' : cloudSyncState === 'error' ? 'bg-rose-900/40 border-rose-500/40 text-rose-200' : 'bg-black/30 border-white/10 text-gray-300'}`}>
                                  Sync: {cloudSyncLabel}{cloudSyncAt ? ` ∂˙ ${new Date(cloudSyncAt).toLocaleTimeString()}` : ''}
                              </div>
                          </div>

                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                              <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 md:p-5 space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                      {[
                                          { id: 'es', label: 'Entrada espa«Òol' },
                                          { id: 'de', label: 'Entrada alem«≠n (corregir)' },
                                          { id: 'ocr', label: 'OCR manuscrito' },
                                      ].map((x) => (
                                          <button key={x.id} type="button" onClick={() => setStoriesProInputMode(x.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${storiesProInputMode === x.id ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-black/30 border-white/10 text-gray-300'}`}>{x.label}</button>
                                      ))}
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                      <label className="text-xs text-gray-400">
                                          Nivel de salida
                                          <select className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2 py-2 text-white" value={storiesProLevel} onChange={(e) => setStoriesProLevel(e.target.value)}>
                                              {['A2', 'B1', 'B2', 'C1'].map((lv) => <option key={lv} value={lv}>{lv}</option>)}
                                          </select>
                                      </label>
                                      <label className="text-xs text-gray-400">
                                          Estilo
                                          <select className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2 py-2 text-white" value={storiesProTone} onChange={(e) => setStoriesProTone(e.target.value)}>
                                              <option value="natural">Natural</option>
                                              <option value="formal">Formal</option>
                                          </select>
                                      </label>
                                  </div>
                                  {storiesProInputMode === 'ocr' && (
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                                          <div className="flex items-center gap-2 mb-2">
                                              <label className="text-xs text-gray-400">Idioma OCR:</label>
                                              <select className="bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-xs text-white" value={storiesProOcrLang} onChange={(e) => setStoriesProOcrLang(e.target.value)}>
                                                  <option value="es">Espa«Òol</option>
                                                  <option value="de">Alem«≠n</option>
                                              </select>
                                          </div>
                                          <input type="file" accept="image/*" onChange={(e) => runHistoriasProOcr(e.target.files && e.target.files[0])} className="w-full text-xs text-gray-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-emerald-700 file:text-white" />
                                      </div>
                                  )}
                                  <textarea value={storiesProSourceText} onChange={(e) => setStoriesProSourceText(e.target.value)} className="w-full h-52 bg-black/45 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-emerald-500 resize-y" placeholder={storiesProInputMode === 'de' ? 'Escribe tu historia en alem«≠n para correcci«¸n/estilizaci«¸nÉ?›' : 'Escribe tu historia en espa«ÒolÉ?›'} />
                                  {storiesProErr ? <p className="text-xs text-rose-300">{storiesProErr}</p> : null}
                                  <div className="flex flex-wrap gap-2">
                                      <button type="button" disabled={storiesProBusy} onClick={runHistoriasProGenerate} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 font-bold text-sm">{storiesProBusy ? 'ProcesandoÉ?›' : 'Generar Historias Pro'}</button>
                                      <button type="button" disabled={!storiesProResult} onClick={sendHistoriasProToHistoria} className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 font-bold text-sm">Enviar escenas a Historia</button>
                                  </div>
                              </section>

                              <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 md:p-5 space-y-3">
                                  {!storiesProResult ? (
                                      <p className="text-sm text-gray-400">Genera una historia para ver salida natural, versi«¸n simplificada, glosario y escenas pr«≠cticas.</p>
                                  ) : (
                                      <>
                                          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/25 p-3">
                                              <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 mb-1">Alem«≠n natural ({storiesProLevel})</p>
                                              <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{storiesProResult.deNatural}</p>
                                          </div>
                                          <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-3">
                                              <p className="text-[11px] uppercase tracking-wider font-bold text-sky-300 mb-1">Versi«¸n simplificada</p>
                                              <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{storiesProResult.deSimple}</p>
                                          </div>
                                          <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-3">
                                              <p className="text-[11px] uppercase tracking-wider font-bold text-violet-300 mb-1">Glosario r«≠pido</p>
                                              <div className="flex flex-wrap gap-2">
                                                  {(storiesProResult.glossary || []).map((g, i) => <span key={i} className="text-xs rounded-md px-2 py-1 bg-black/35 border border-white/10 text-gray-200">{g.de}</span>)}
                                              </div>
                                          </div>
                                          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                                              <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2">Escenas para Historia</p>
                                              <ul className="space-y-1.5 text-sm text-gray-300 max-h-40 overflow-y-auto">
                                                  {(storiesProResult.scenes || []).map((s, i) => <li key={i}><span className="font-bold text-emerald-300">{s.speaker}:</span> {s.text}</li>)}
                                              </ul>
                                          </div>
                                      </>
                                  )}
                              </section>
                          </div>
                      </div>
                  )}

                  {/* ENTRENAMIENTO DASHBOARD (sin cambios) */}
                  {practiceActive && currentPracticeItem && (
                      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-in zoom-in">
                         <button onClick={() => setPracticeActive(null)} className="absolute top-4 left-4 md:top-8 md:left-8 text-gray-400 hover:text-white flex items-center gap-2 font-bold text-sm md:text-base"><Icon name="chevron-left" className="w-4 h-4 md:w-5 md:h-5" /> Volver</button>
                         <div className="flex flex-wrap items-center justify-center gap-2 mb-6 md:mb-8">
                             <h2 className="text-2xl md:text-3xl font-black text-amber-500 uppercase tracking-widest"><Icon name="brain" className="w-6 h-6 md:w-8 md:h-8 inline mr-2" /> Entrenamiento R«≠pido</h2>
                             <ExerciseHelpBtn helpId="practice_mazos" />
                         </div>
                         <div className="w-full max-w-2xl bg-black/40 p-6 md:p-12 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
                             <button onClick={() => playPracticeAudio(practiceActive === 'grammar' ? currentPracticeItem.base : currentPracticeItem.de)} className="bg-white/10 p-3 md:p-4 rounded-full mb-4 md:mb-6 hover:bg-white/20 transition"><Icon name="volume-2" className="w-6 h-6 md:w-8 md:h-8" /></button>
                             {practiceActive === 'grammar' ? (
                                 <h1 className="text-3xl md:text-5xl font-black text-cyan-400 text-center mb-6 md:mb-8">{currentPracticeItem.base}</h1>
                             ) : (
                                 <h1 className="text-4xl md:text-7xl font-black text-white text-center mb-6 md:mb-8 flex items-center justify-center flex-wrap">{getArticleVisual(currentPracticeItem.de)}{currentPracticeItem.de}</h1>
                             )}
                             {!practiceShowTrans ? (
                                 <button onClick={() => setPracticeShowTrans(true)} className="bg-blue-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold text-xl md:text-2xl shadow-xl hover:bg-blue-500 transition">Revelar</button>
                             ) : (
                                 <div className="flex flex-col items-center w-full animate-in slide-in-from-bottom-4">
                                     {practiceActive === 'grammar' ? (
                                         <div className="bg-black/60 p-4 md:p-6 rounded-xl md:rounded-2xl w-full mb-6 md:mb-8 text-center border border-cyan-800/50">
                                             <p className="text-lg md:text-2xl text-white mb-2 italic">"{currentPracticeItem.exampleDe}"</p>
                                             <p className="text-base md:text-xl text-cyan-200">({currentPracticeItem.exampleEs})</p>
                                         </div>
                                     ) : (
                                         <h2 className="text-2xl md:text-4xl font-bold text-gray-300 text-center mb-6 md:mb-8 bg-black/60 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl w-full">{currentPracticeItem.es}</h2>
                                     )}
                                     <button onClick={nextPracticeWord} className="bg-green-600 w-full py-3 md:py-4 rounded-xl font-bold text-xl md:text-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-green-500">Siguiente <Icon name="arrow-right" className="w-5 h-5 md:w-6 md:h-6" /></button>
                                 </div>
                             )}
                         </div>
                         <p className="mt-4 md:mt-6 text-gray-500 font-bold text-sm md:text-base">Tarjeta {practiceIndex + 1} de {currentPracticeList.length}</p>
                      </div>
                  )}

                  {activeTab === 'entrenamiento' && !practiceActive && (
                      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                              <div>
                                  <h1 className="text-2xl md:text-4xl font-black text-fuchsia-200 flex items-center gap-2 md:gap-3"><Icon name="graduation-cap" className="w-8 h-8 md:w-10 md:h-10" /> Entrenamiento avanzado</h1>
                                  <p className="text-xs md:text-sm text-fuchsia-100/80 mt-1">Centro principal de pr«≠ctica: art«culos, verbos con preposici«¸n, preposiciones y simulacro TELC.</p>
                              </div>
                              <ExerciseHelpBtn helpId="advanced_menu" />
                          </div>
                          <AdvancedPracticePanelFinal embedded />
                      </div>
                  )}

                  {/* B1 / B2 (sin cambios) */}
                  {activeTab === 'bxbank' && !practiceActive && (
                      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500 flex flex-col min-h-full">
                          <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-start md:items-center mb-6 md:mb-8 border-b border-sky-900/50 pb-4 md:pb-6 gap-4">
                              <div className="min-w-0 flex-1 md:max-w-[min(100%,28rem)]">
                                  <h1 className={`text-2xl md:text-4xl font-black flex items-center gap-2 md:gap-3 ${bxBankLevel === 'b1' ? 'text-emerald-400' : 'text-sky-400'}`}>
                                      {bxBankLevel === 'b1' ? <Icon name="target" className="w-8 h-8 md:w-10 md:h-10" /> : <Icon name="layers" className="w-8 h-8 md:w-10 md:h-10" />} 
                                      {bxBankLevel === 'b1' ? 'Banco B1 ∂˙ Fundamentos' : 'Banco B2 ∂˙ Meisterklasse'}
                                  </h1>
                                  <p className="text-gray-300 text-xs md:text-sm mt-1">{bxBankLevel === 'b1' ? 'Domina las bases absolutas.' : 'Estructuras avanzadas de nativos.'}</p>
                                  <p className="text-[10px] text-gray-500 mt-1">Tarjetas desde <code className="text-amber-200/90">b1-b2-database.json</code> m«≠s lo que a«Òadas desde <strong className="text-gray-400">Biblioteca É≈' Distribuir texto É≈' B1/B2</strong> (local).</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 justify-end">
                                  <div className="flex gap-1 md:gap-2 flex-wrap bg-black/40 p-1 md:p-2 rounded-xl border border-white/10">
                                      <button onClick={()=>setBxCategory('vocabulario')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'vocabulario' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Vocabulario</button>
                                      <button onClick={()=>setBxCategory('verbos')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'verbos' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Verbos</button>
                                      <button onClick={()=>setBxCategory('preposiciones')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'preposiciones' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Prep.</button>
                                      <button onClick={()=>setBxCategory('conectores')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'conectores' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Conectores</button>
                                      <button onClick={()=>setBxCategory('redemittel')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'redemittel' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Redemittel</button>
                                      <button onClick={()=>setBxCategory('mix')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center gap-1 shadow-lg border border-white/20 ${bxCategory === 'mix' ? 'ring-1 md:ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}><Icon name="shuffle" className="w-3 h-3 md:w-4 md:h-4" /> MIX</button>
                                  </div>
                                  <ExerciseHelpBtn helpId={bxExerciseHelpId} title={'Ayuda: categor«a ' + bxCategory} />
                              </div>
                              <div className="w-full md:basis-full flex flex-wrap items-center gap-2 mt-1 md:mt-0 pt-3 border-t border-white/10 md:order-last">
                                  <span className="text-[10px] font-bold text-rose-300/95 uppercase tracking-wider w-full sm:w-auto">Mis aportaciones (Biblioteca)</span>
                                  {bxBankLevel === 'b1' ? (
                                      <button type="button" onClick={() => clearBxUserLevelAllCategories('b1')} className="text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-600/40">Borrar todo B1</button>
                                  ) : (
                                      <button type="button" onClick={() => clearBxUserLevelAllCategories('b2')} className="text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-600/40">Borrar todo B2</button>
                                  )}
                                  {bxCategory !== 'mix' ? (
                                      <button type="button" onClick={() => clearBxUserOneCategory(bxBankLevel === 'b1' ? 'b1' : 'b2', bxCategory)} className="text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-amber-100 border border-amber-600/35">
                                          Borrar solo: {bxCategory === 'vocabulario' ? 'Vocabulario' : bxCategory === 'verbos' ? 'Verbos' : bxCategory === 'preposiciones' ? 'Prep.' : bxCategory === 'conectores' ? 'Conectores' : 'Redemittel'}
                                      </button>
                                  ) : (
                                      <span className="text-[9px] text-gray-500">Elige una categor«a (no MIX) para borrar solo esa subpesta«Òa.</span>
                                  )}
                              </div>
                          </div>
                          <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-3xl mx-auto">
                              {bxCurrentList.length > 0 ? (
                                  <>
                                      <div className={`absolute top-0 right-0 px-2 md:px-4 py-0.5 md:py-1 rounded-full font-bold border uppercase text-[10px] md:text-xs tracking-widest ${bxBankLevel === 'b1' ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500/30' : 'bg-sky-900/50 text-sky-300 border-sky-500/30'}`}>
                                          {bxCategory === 'mix' ? 'Modo Mix (Aleatorio)' : bxCategory}
                                      </div>
                                      <div className={`w-full bg-slate-900/90 p-4 md:p-10 rounded-2xl md:rounded-3xl border-2 shadow-2xl mt-6 md:mt-8 ${bxBankLevel === 'b1' ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'border-sky-500/50 shadow-[0_0_40px_rgba(14,165,233,0.3)]'}`}>
                                          <p className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-[10px] md:text-sm"><Icon name="languages" className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />{bxBankLevel === 'b1' ? 'B«≠sico / Com«ßn:' : 'Nivel B1:'}</p>
                                          <p className="text-base md:text-2xl text-white/60 mb-4 md:mb-8 decoration-red-500/50 decoration-2">"{bxCurrentList[bxIndex]?.b1}"</p>
                                          <p className={`font-black mb-2 uppercase tracking-widest text-[10px] md:text-sm ${bxBankLevel === 'b1' ? 'text-emerald-400' : 'text-sky-400'}`}><Icon name="trophy" className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />{bxBankLevel === 'b1' ? 'Mejor / Nivel B1 Real:' : 'Nivel B2/C1:'}</p>
                                          <p className="text-xl md:text-5xl font-black text-white mb-3 md:mb-4 leading-tight">"{bxCurrentList[bxIndex]?.b2}"</p>
                                          <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 font-medium">({bxCurrentList[bxIndex]?.es})</p>
                                          <div className="bg-black/40 p-3 md:p-4 rounded-xl border border-white/10 flex gap-2 md:gap-3">
                                              <Icon name="brain" className="w-5 h-5 md:w-6 md:h-6 text-amber-400 flex-shrink-0 mt-0.5 md:mt-1" />
                                              <p className="text-xs md:text-sm text-gray-200 leading-relaxed"><strong className="text-amber-400 uppercase tracking-wide">La L«¸gica del Profesor:</strong> <br/> {bxCurrentList[bxIndex]?.trick}</p>
                                          </div>
                                          {bxCurrentList[bxIndex]?._mullerUser ? (
                                              <div className="mt-4 md:mt-5 flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 items-stretch sm:items-center border-t border-white/10 pt-4">
                                                  <span className="text-[10px] font-bold text-emerald-400/90 uppercase tracking-wider">Tu biblioteca</span>
                                                  <button type="button" onClick={handleBxUserCardDelete} className="text-xs md:text-sm bg-red-900/70 hover:bg-red-800 text-red-100 px-3 py-2 rounded-xl font-bold border border-red-700/50">Eliminar tarjeta</button>
                                                  <div className="flex flex-wrap items-center gap-2">
                                                      <span className="text-[10px] text-gray-500">Mover a</span>
                                                      <select value={bxMoveTargetCat} onChange={(e) => setBxMoveTargetCat(e.target.value)} className="bg-black/60 border border-gray-600 text-white text-xs md:text-sm rounded-lg px-2 py-1.5 outline-none focus:border-emerald-500">
                                                          {Object.keys(BX_DB_EMPTY).filter((c) => {
                                                              const it = bxCurrentList[bxIndex];
                                                              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
                                                              const src = bxCategory === 'mix' ? (it._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, it._mullerUid)) : bxCategory;
                                                              return c !== src;
                                                          }).map((c) => (
                                                              <option key={c} value={c}>{c === 'vocabulario' ? 'Vocabulario' : c === 'verbos' ? 'Verbos' : c === 'preposiciones' ? 'Prep.' : c === 'conectores' ? 'Conectores' : 'Redemittel'}</option>
                                                          ))}
                                                      </select>
                                                      <button type="button" onClick={handleBxUserCardMove} className="text-xs md:text-sm bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 px-3 py-2 rounded-xl font-bold border border-emerald-600/50">Mover aqu«</button>
                                                  </div>
                                              </div>
                                          ) : null}
                                      </div>
                                      <div className="flex gap-3 md:gap-4 mt-6 md:mt-8 w-full max-w-sm justify-between">
                                          <button type="button" onClick={() => setBxIndex(i => i > 0 ? i - 1 : bxCurrentList.length - 1)} className="muller-icon-nav bg-gray-800 hover:bg-gray-700 text-white p-3 md:p-4 rounded-full transition border border-white/15"><Icon name="chevron-left" className="w-5 h-5 md:w-6 md:h-6 text-white" /></button>
                                          <button onClick={() => { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(bxCurrentList[bxIndex].b2); u.lang = 'de-DE'; window.__mullerApplyPreferredDeVoice(u); window.speechSynthesis.speak(u); }} className={`text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold shadow-lg flex items-center gap-2 flex-1 justify-center text-sm md:text-base ${bxBankLevel === 'b1' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-sky-600 hover:bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.5)]'}`}><Icon name="volume-2" className="w-5 h-5 md:w-6 md:h-6" /> Escuchar</button>
                                          <button type="button" onClick={() => setBxIndex(i => i < bxCurrentList.length - 1 ? i + 1 : 0)} className="muller-icon-nav bg-gray-800 hover:bg-gray-700 text-white p-3 md:p-4 rounded-full transition border border-white/15"><Icon name="chevron-right" className="w-5 h-5 md:w-6 md:h-6 text-white" /></button>
                                      </div>
                                      <p className="text-gray-500 font-bold mt-4 text-xs md:text-sm">Tarjeta {bxIndex + 1} / {bxCurrentList.length}</p>
                                  </>
                              ) : (
                                  <div className="text-gray-500 font-bold text-base md:text-xl">Categor«a sin datos (Selecciona otra).</div>
                              )}
                          </div>
                      </div>
                  )}

                  {activeTab === 'lexikon' && !practiceActive && (
                      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto pb-24">
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                              <h1 className="text-2xl md:text-4xl font-black text-cyan-300 flex items-center gap-2 md:gap-3">
                                  <Icon name="library" className="w-8 h-8 md:w-10 md:h-10" /> Lexikon
                              </h1>
                              <ExerciseHelpBtn helpId="nav_lexikon" />
                          </div>
                          <p className="text-gray-400 text-xs md:text-sm mb-6 border-b border-white/10 pb-4">Traducci«¸n de palabras o frases (detecci«¸n autom«≠tica del idioma de origen) y opci«¸n de solo Wiktionary. Los textos salen por internet; puedes guardar pares en las mismas lecciones que en <strong className="text-amber-200">Biblioteca É≈' Vocab</strong>.</p>

                          <div className="rounded-2xl border border-cyan-700/40 bg-slate-900/80 p-4 md:p-6 mb-6 shadow-xl">
                              <h2 className="text-lg font-black text-cyan-200 mb-3 flex items-center gap-2"><Icon name="search" className="w-5 h-5" /> Palabra o frase</h2>
                              <p className="text-[11px] text-gray-500 mb-3">Elige primero si quieres <strong className="text-gray-300">traducci«¸n</strong> (recomendado para espa«Òol É≈' alem«≠n) o solo enlaces a <strong className="text-gray-300">Wiktionary</strong> (definiciones en un idioma).</p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                  <input type="text" value={lexikonSearch} onChange={(e) => setLexikonSearch(e.target.value)} placeholder="Palabra o fraseÉ?›" className="flex-1 min-w-[160px] bg-black/50 border border-cyan-800/60 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-cyan-500" onKeyDown={(e) => handleExerciseEnterSubmit(e, 'lexikon-dict-search', runLexikonDictionarySearch)} />
                                  <select value={lexikonDictKind} onChange={(e) => setLexikonDictKind(e.target.value)} className="bg-black/50 border border-cyan-800/60 rounded-xl px-3 py-2 text-white text-sm outline-none max-w-[min(100%,220px)]">
                                      <option value="tr-es-de">Traducci«¸n: ES É≈' DE</option>
                                      <option value="tr-de-es">Traducci«¸n: DE É≈' ES</option>
                                      <option value="wiki-de">Solo Wiktionary (alem«≠n)</option>
                                      <option value="wiki-es">Solo Wiktionary (espa«Òol)</option>
                                  </select>
                                  <button type="button" disabled={lexikonDictLoading} onClick={() => runSingleSubmitAction('lexikon-dict-search', runLexikonDictionarySearch)} className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 font-bold text-sm disabled:opacity-50">{lexikonDictLoading ? 'É?›' : 'Buscar'}</button>
                              </div>
                              {lexikonResults && lexikonResults.dictTranslate && !lexikonResults.error ? (
                                  <div className="rounded-xl bg-cyan-950/40 border border-cyan-600/25 p-4 space-y-2">
                                      <p className="text-white text-base md:text-lg"><span className="text-gray-400 font-bold text-xs uppercase mr-2">Entrada</span><strong>{lexikonResults.query}</strong></p>
                                      <p className="text-cyan-100 text-lg md:text-2xl font-bold leading-snug">{lexikonResults.out || 'É?"'}</p>
                                      {lexikonResults.detected ? (
                                          <p className="text-[10px] text-gray-500">Idioma detectado (aprox.): {lexikonResults.detected} É≈' {lexikonResults.tl === 'de' ? 'alem«≠n' : 'espa«Òol'}</p>
                                      ) : null}
                                      <div className="flex flex-wrap gap-2 pt-1">
                                          {lexikonResults.tl === 'de' && lexikonResults.out ? (
                                              <a href={`https://de.wiktionary.org/wiki/${encodeURIComponent((lexikonResults.out.split(/[\s,.;]+/)[0] || '').replace(/^[\s"'∂Æ∂Ø]+|[\s"'∂Ø]+$/g, ''))}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs font-bold underline">Wiktionary DE (1.∂¶ palabra del resultado)</a>
                                          ) : null}
                                          <button type="button" onClick={() => { setLexikonTransText(lexikonSearch); setLexikonTransTarget(lexikonDictKind === 'tr-es-de' ? 'de' : 'es'); setLexikonTransOut(''); }} className="text-[10px] font-bold text-amber-300 hover:text-white">Copiar a traductor abajo</button>
                                      </div>
                                  </div>
                              ) : lexikonResults && !lexikonResults.error && (lexikonResults.titles || []).length > 0 ? (
                                  <ul className="space-y-2 text-sm">
                                      {(lexikonResults.titles || []).map((t, i) => (
                                          <li key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-white/5 pb-2">
                                              <span className="text-white font-bold">{t}</span>
                                              <div className="flex gap-2 flex-wrap">
                                                  {lexikonResults.urls && lexikonResults.urls[i] ? (
                                                      <a href={lexikonResults.urls[i]} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs font-bold underline">Abrir entrada</a>
                                                  ) : null}
                                                  <button type="button" onClick={() => { setLexikonTransText(t); setLexikonTransOut(''); }} className="text-[10px] font-bold text-amber-300 hover:text-white">É≈' Traductor</button>
                                              </div>
                                          </li>
                                      ))}
                                  </ul>
                              ) : lexikonResults && !lexikonResults.error && !lexikonResults.dictTranslate ? (
                                  <p className="text-gray-500 text-sm">Sin resultados. Prueba otra graf«a.</p>
                              ) : null}
                          </div>

                          <div className="rounded-2xl border border-indigo-700/40 bg-slate-900/80 p-4 md:p-6 mb-6 shadow-xl">
                              <h2 className="text-lg font-black text-indigo-200 mb-3 flex items-center gap-2"><Icon name="languages" className="w-5 h-5" /> Traductor (DE É≈" ES)</h2>
                              <p className="text-[11px] text-gray-500 mb-2">Elige el idioma de <strong className="text-gray-300">salida</strong>; el origen se detecta solo (evita que una palabra espa«Òola se traduzca mal por empate DE/ES).</p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                  <button type="button" onClick={() => setLexikonTransTarget('de')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${lexikonTransTarget === 'de' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black/40 border-white/15 text-gray-400'}`}>É≈' Alem«≠n</button>
                                  <button type="button" onClick={() => setLexikonTransTarget('es')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${lexikonTransTarget === 'es' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black/40 border-white/15 text-gray-400'}`}>É≈' Espa«Òol</button>
                              </div>
                              <textarea value={lexikonTransText} onChange={(e) => setLexikonTransText(e.target.value)} placeholder="Frase o palabra (cualquier registro)É?›" className="w-full min-h-[100px] bg-black/50 border border-indigo-800/60 rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500 mb-3" />
                              <button type="button" disabled={lexikonTransLoading} onClick={runLexikonTranslate} className="mb-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm disabled:opacity-50">{lexikonTransLoading ? 'TraduciendoÉ?›' : 'Traducir'}</button>
                              {lexikonTransOut ? (
                                  <div className="rounded-xl bg-indigo-950/50 border border-indigo-600/30 p-4 mb-4">
                                      <p className="text-[10px] font-bold text-indigo-300 uppercase mb-1">Resultado</p>
                                      <p className="text-white text-lg md:text-xl leading-relaxed whitespace-pre-wrap">{lexikonTransOut}</p>
                                  </div>
                              ) : null}
                              <div className="border-t border-white/10 pt-4 space-y-3">
                                  <p className="text-[10px] font-bold text-amber-300 uppercase">Guardar par en lecci«¸n (Vocab)</p>
                                  <div className="flex flex-wrap gap-2 items-center">
                                      <select value={lexikonSaveLessonId} onChange={(e) => setLexikonSaveLessonId(e.target.value)} className="bg-black/60 border border-amber-800/60 text-white text-sm rounded-lg px-3 py-2 outline-none flex-1 min-w-[180px]">
                                          <option value="">É?" Elige lecci«¸n É?"</option>
                                          <option value="__new__">+ Nueva lecci«¸nÉ?›</option>
                                          {customVocabLessons.map((l) => (
                                              <option key={l.id} value={l.id}>{l.title} ({l.words?.length || 0} pal.)</option>
                                          ))}
                                      </select>
                                      {lexikonSaveLessonId === '__new__' ? (
                                          <input type="text" value={lexikonNewLessonTitle} onChange={(e) => setLexikonNewLessonTitle(e.target.value)} placeholder="T«tulo nueva lecci«¸n" className="bg-black/50 border border-amber-800/60 rounded-lg px-3 py-2 text-white text-sm flex-1 min-w-[140px]" />
                                      ) : null}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                      <label className="flex-1 min-w-[120px] text-[10px] text-gray-500 block">Alem«≠n<input type="text" value={lexikonPairDe} onChange={(e) => setLexikonPairDe(e.target.value)} className="mt-0.5 w-full bg-black/50 border border-emerald-800/50 rounded-lg px-2 py-1.5 text-sm text-emerald-100" placeholder="der BahnhofÉ?›" /></label>
                                      <label className="flex-1 min-w-[120px] text-[10px] text-gray-500 block">Espa«Òol<input type="text" value={lexikonPairEs} onChange={(e) => setLexikonPairEs(e.target.value)} className="mt-0.5 w-full bg-black/50 border border-sky-800/50 rounded-lg px-2 py-1.5 text-sm text-sky-100" placeholder="la estaci«¸nÉ?›" /></label>
                                  </div>
                                  <button type="button" onClick={() => appendPairToCustomLesson(lexikonPairDe, lexikonPairEs)} className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 font-bold text-sm border border-amber-500/40">Guardar par DE / ES en la lecci«¸n</button>
                                  <p className="text-[10px] text-gray-500">Usa el orden detectado (arriba) o traduce antes de guardar. Puedes abrir la lecci«¸n en Vocab É≈' Practicar.</p>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* PROGRESO (con botones de sincronizaci«¸n a«Òadidos en barra) */}
                  {activeTab === 'progreso' && !practiceActive && (
                      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                              <div className="rounded-2xl border border-sky-500/35 bg-gradient-to-br from-sky-950/70 to-slate-900/80 p-4 md:p-5 shadow-xl">
                                  <h2 className="text-xs font-black text-sky-300 uppercase tracking-wider mb-3 flex items-center gap-2"><Icon name="calendar" className="w-4 h-4" /> Plan de hoy</h2>
                                  <div className="grid gap-2">
                                      <button type="button" className="py-2 px-3 rounded-xl bg-blue-900/40 border border-blue-500/25 text-left text-xs hover:bg-blue-900/60 transition" onClick={() => { setActiveTab('historia'); setMode('dialogue'); stopAudio(); setPracticeActive(null); }}>1. Historia É?" escenas en voz alta o podcast</button>
                                      <button type="button" className="py-2 px-3 rounded-xl bg-teal-900/40 border border-teal-500/25 text-left text-xs hover:bg-teal-900/60 transition" onClick={() => { setActiveTab('shadowing'); stopAudio(); setPracticeActive(null); }}>2. Shadowing É?" misma escena + pronunciaci«¸n</button>
                                      <button type="button" className="py-2 px-3 rounded-xl bg-amber-900/40 border border-amber-500/25 text-left text-xs hover:bg-amber-900/60 transition" onClick={() => { setActiveTab('vocabulario'); stopAudio(); setPracticeActive(null); }}>3. Vocab É?" tarjetas</button>
                                      <button type="button" className="py-2 px-3 rounded-xl bg-purple-900/40 border border-purple-500/25 text-left text-xs hover:bg-purple-900/60 transition" onClick={() => { setActiveTab('entrenamiento'); stopAudio(); setPracticeActive(null); }}>4. Entrenamiento avanzado</button>
                                      <button type="button" className="py-2 px-3 rounded-xl bg-rose-900/40 border border-rose-500/25 text-left text-xs hover:bg-rose-900/60 transition" onClick={() => { setActiveTab('escritura'); setWritingMode('dictation'); stopAudio(); setPracticeActive(null); }}>5. Escritura É?" dictado + OCR</button>
                                  </div>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider pt-3 mb-2">Retos del d«a (+5 monedas, una vez al d«a)</p>
                                  <div className="flex flex-wrap gap-2">
                                      <button type="button" disabled={dailyChallenges.vocab} onClick={() => claimDailyStamp('vocab')} className={`text-xs font-bold px-2 py-1.5 rounded-lg ${dailyChallenges.vocab ? 'bg-gray-800 text-gray-500' : 'bg-amber-700 hover:bg-amber-600 text-white'}`}>{dailyChallenges.vocab ? 'Éo" Vocab' : 'He practicado vocab'}</button>
                                      <button type="button" disabled={dailyChallenges.shadow} onClick={() => claimDailyStamp('shadow')} className={`text-xs font-bold px-2 py-1.5 rounded-lg ${dailyChallenges.shadow ? 'bg-gray-800 text-gray-500' : 'bg-teal-700 hover:bg-teal-600 text-white'}`}>{dailyChallenges.shadow ? 'Éo" Shadow' : 'He hecho shadowing'}</button>
                                      <button type="button" disabled={dailyChallenges.write} onClick={() => claimDailyStamp('write')} className={`text-xs font-bold px-2 py-1.5 rounded-lg ${dailyChallenges.write ? 'bg-gray-800 text-gray-500' : 'bg-rose-700 hover:bg-rose-600 text-white'}`}>{dailyChallenges.write ? 'Éo" Escritura' : 'He escrito / OCR'}</button>
                                  </div>
                                  <button type="button" onClick={() => setTourStep(1)} className="w-full mt-3 py-2 rounded-xl bg-indigo-800 hover:bg-indigo-700 font-bold text-xs border border-indigo-500/30">Iniciar tour guiado (5 pasos)</button>
                              </div>
                              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-yellow-950/20 p-4 md:p-5 shadow-xl">
                                  <h2 className="text-xs font-black text-amber-200 uppercase tracking-wider mb-3">Resumen r«≠pido</h2>
                                  <div className="space-y-2 text-xs text-gray-300">
                                      <p><span className="text-white font-bold">Racha (honesta):</span> {userStats.streakDays} d«as</p>
                                      <p className="text-[10px] text-gray-500 leading-snug">Cuenta solo si hubo actividad m«nima: É%æ{MULLER_STREAK_MIN_VOCAB_RATINGS} tarjetas de vocab calificadas, o É%æ{MULLER_STREAK_MIN_ACTIVITY_POINTS} puntos, o É%æ{Math.round(MULLER_STREAK_MIN_ACTIVE_SEC / 60)} min con la app (timer).</p>
                                      <p><span className="text-white font-bold">Monedas:</span> {coinsUiLabel}</p>
                                      <p><span className="text-emerald-300 font-bold">SRS vocabulario:</span> {Object.keys(vocabSrsMap).length} tarjetas (este dispositivo)</p>
                                      <p><span className="text-white font-bold">Pronunciaci«¸n:</span> {userStats.pronunciationAttempts || 0} intentos</p>
                                      <p><span className="text-white font-bold">Diktat:</span> {userStats.diktatCorrect || 0} / {userStats.diktatAttempts || 0}</p>
                                      <p className="text-[10px] text-gray-500 pt-1">Exporta PDF desde el bot«¸n de abajo.</p>
                                  </div>
                              </div>
                          </div>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                              <div className="flex flex-wrap items-center gap-2">
                                  <h1 className="text-2xl md:text-4xl font-black flex items-center gap-2 md:gap-3 text-yellow-500"><Icon name="award" className="w-8 h-8 md:w-10 md:h-10" /> Dashboard Profesional B1</h1>
                                  <ExerciseHelpBtn helpId="progreso_dashboard" />
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={exportProgressPDF} className="bg-gray-800 hover:bg-gray-700 text-white px-4 md:px-5 py-2 md:py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition border border-gray-600 text-xs md:text-sm"><Icon name="file-down" className="w-4 h-4 md:w-5 md:h-5" /> Imprimir Resumen</button>
                              </div>
                          </div>
                          <div className="bg-gray-800/80 p-4 md:p-6 rounded-2xl border border-gray-700 shadow-xl mb-6 md:mb-8">
                              <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2"><Icon name="trending-up" className="w-5 h-5 md:w-6 md:h-6 text-green-400" /> Actividad Semanal</h2>
                              <p className="text-[10px] md:text-xs text-gray-500 mb-2">Basada en tus sesiones reales (vocab, diktat, pr«≠ctica). Si un d«a est«≠ vac«o, la barra es baja.</p>
                              <div className="flex items-end justify-between gap-1 md:gap-2 h-[120px] md:h-[200px] mt-4 pt-4 border-t border-gray-700 relative">
                                  {getWeeklyChartBars().map((val, i) => (
                                      <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end">
                                          <div className="w-full bg-blue-500 rounded-t-md transition-all duration-500 group-hover:bg-blue-400 relative shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{height: `${Math.max(val, 5)}%`}}>
                                              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-blue-200 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">{val}%</span>
                                          </div>
                                          <span className="text-[8px] md:text-[10px] text-gray-400 mt-1 md:mt-2 font-mono uppercase tracking-tighter whitespace-nowrap hidden md:block">{getLast7Days()[i]}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          {mullerProgresoSnapshot && (
                              <div className="bg-gradient-to-r from-purple-950/80 to-indigo-950/80 p-4 md:p-6 rounded-2xl border border-purple-700/50 shadow-xl mb-6 md:mb-8">
                                  <h2 className="text-base md:text-lg font-bold text-purple-200 mb-3 flex items-center gap-2"><Icon name="graduation-cap" className="w-5 h-5 md:w-6 md:h-6" /> Entrenamiento M«¨ller (avanzado)</h2>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 text-xs md:text-sm">
                                      <div className="bg-black/30 rounded-lg p-2 text-center border border-white/10"><span className="text-gray-400 block">Intentos</span><span className="font-black text-white text-lg">{mullerProgresoSnapshot.totalAttempts}</span></div>
                                      <div className="bg-black/30 rounded-lg p-2 text-center border border-white/10"><span className="text-gray-400 block">Precisi«¸n</span><span className="font-black text-emerald-300 text-lg">{mullerProgresoSnapshot.accuracy}%</span></div>
                                      <div className="bg-black/30 rounded-lg p-2 text-center border border-white/10"><span className="text-gray-400 block">Hoy</span><span className="font-black text-cyan-300 text-lg">{mullerProgresoSnapshot.todayAttempts}/{mullerProgresoSnapshot.dailyGoal}</span></div>
                                      <div className="bg-black/30 rounded-lg p-2 text-center border border-white/10"><span className="text-gray-400 block">Racha</span><span className="font-black text-orange-300 text-lg">{mullerProgresoSnapshot.streakDays} d</span></div>
                                  </div>
                                  <p className="text-[10px] text-gray-500 mt-3">Abre la pesta«Òa Entrenamiento para practicar art«culos, verbos y preposiciones.</p>
                              </div>
                          )}
                          <p className="text-xs text-emerald-200/90 mb-4 flex flex-wrap items-center gap-2"><Icon name="timer" className="w-4 h-4" /> Repaso espaciado (SRS): <strong>{Object.keys(vocabSrsMap).length}</strong> palabras con fecha de repaso ∂˙ se ordenan solas al abrir una lecci«¸n. Solo en este navegador.</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                              <div className="bg-gray-900 p-4 md:p-6 rounded-2xl border border-red-900/50 flex flex-col relative group">
                                  <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 text-red-500"><Icon name="target" className="w-5 h-5 md:w-6 md:h-6" /> Vocab. Dif«cil</h2>
                                  <ul className="space-y-1 md:space-y-2 flex-1 overflow-y-auto pr-2 mb-3 md:mb-4 max-h-32 md:max-h-40">
                                      {!userStats.difficultVocab || userStats.difficultVocab.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">Vac«o.</p> : 
                                       userStats.difficultVocab.map((v, i) => <li key={i} className="bg-black/40 p-1 md:p-2 rounded border border-red-900/30 text-xs md:text-sm flex justify-between"><span className="text-red-400 font-bold text-xs md:text-sm">{v.de}</span><span className="text-gray-400 text-right w-1/2 truncate text-xs md:text-sm">{v.es}</span></li>)
                                      }
                                  </ul>
                                  <div className="flex gap-2">
                                      <button onClick={() => startPractice('diff')} className="flex-1 bg-red-600 hover:bg-red-500 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition">Practicar Ahora</button>
                                      <button onClick={() => exportToAnki('vocab_diff')} className="bg-red-900 hover:bg-red-800 p-1.5 md:p-2 rounded-lg transition" title="Exportar Anki"><Icon name="download" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                  </div>
                              </div>
                              <div className="bg-gray-900 p-4 md:p-6 rounded-2xl border border-blue-900/50 flex flex-col">
                                  <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 text-blue-400"><Icon name="book-open" className="w-5 h-5 md:w-6 md:h-6" /> Vocab. Normal</h2>
                                  <ul className="space-y-1 md:space-y-2 flex-1 overflow-y-auto pr-2 mb-3 md:mb-4 max-h-32 md:max-h-40">
                                      {!userStats.normalVocab || userStats.normalVocab.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">Vac«o.</p> : 
                                       userStats.normalVocab.map((v, i) => <li key={i} className="bg-black/40 p-1 md:p-2 rounded border border-blue-900/30 text-xs md:text-sm flex justify-between"><span className="text-blue-300 font-bold text-xs md:text-sm">{v.de}</span><span className="text-gray-400 text-right w-1/2 truncate text-xs md:text-sm">{v.es}</span></li>)
                                      }
                                  </ul>
                                  <div className="flex gap-2">
                                      <button onClick={() => startPractice('norm')} className="flex-1 bg-blue-600 hover:bg-blue-500 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition">Practicar Ahora</button>
                                      <button onClick={() => exportToAnki('vocab_norm')} className="bg-blue-900 hover:bg-blue-800 p-1.5 md:p-2 rounded-lg transition" title="Exportar Anki"><Icon name="download" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                  </div>
                              </div>
                              <div className="bg-gray-900 p-4 md:p-6 rounded-2xl border border-cyan-900/50 flex flex-col">
                                  <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 text-cyan-400"><Icon name="brain" className="w-5 h-5 md:w-6 md:h-6" /> Gram«≠tica</h2>
                                  <ul className="space-y-1 md:space-y-2 flex-1 overflow-y-auto pr-2 mb-3 md:mb-4 max-h-32 md:max-h-40">
                                      {!userStats.difficultGrammar || userStats.difficultGrammar.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">Vac«o.</p> : 
                                       userStats.difficultGrammar.map((g, i) => <li key={i} className="bg-black/40 p-1 md:p-2 rounded border border-cyan-900/30 text-xs flex flex-col"><span className="text-cyan-400 font-bold text-xs md:text-sm mb-0.5 md:mb-1">{g.base}</span><span className="text-gray-400 truncate text-[10px] md:text-xs">"{g.exampleDe}"</span></li>)
                                      }
                                  </ul>
                                  <div className="flex gap-2">
                                      <button onClick={() => startPractice('grammar')} className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition">Practicar Ahora</button>
                                      <button onClick={() => exportToAnki('grammar')} className="bg-cyan-900 hover:bg-cyan-800 p-1.5 md:p-2 rounded-lg transition" title="Exportar Anki"><Icon name="download" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* BIBLIOTECA (con checkboxes para mezcla) */}
                  {activeTab === 'guiones' && !practiceActive && (
                      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6 md:gap-8 min-h-full animate-in fade-in">
                          <div className="flex-[2] bg-gray-800/50 p-4 md:p-6 rounded-2xl border border-gray-700 flex flex-col max-h-full overflow-y-auto hide-scrollbar">
                              <div className="bg-purple-900/30 border border-purple-500/50 p-4 md:p-5 rounded-xl mb-4 md:mb-6">
                                  <h3 className="text-purple-300 font-bold flex items-center gap-2 mb-2 text-sm md:text-base"><Icon name="sparkles" className="w-4 h-4 md:w-5 md:h-5" /> Instrucciones para la IA</h3>
                                  <p className="text-xs md:text-sm text-gray-300 mb-3">Copia este prompt en tu IA favorita para que te genere di«≠logos perfectos y compatibles con el Entrenador M«¨ller.</p>
                                  <div className="bg-black/60 p-2 md:p-3 rounded-lg flex items-start gap-2 border border-purple-800/50 relative group">
       <p className="text-[10px] md:text-xs font-mono text-purple-200 select-all pr-6 md:pr-8">
    "Eres un profesor de alem«≠n experto en TELC B1. Genera un di«≠logo EXTENSO (sin l«mite de l«neas) sobre [TEMA]. IMPORTANTE: marca los Redemittel clave solo con [R] al final de la l«nea alemana. No uses la palabra N«¨tzlich ni s«mbolos raros.<br/><br/>Formato: Nombre: Frase en alem«≠n. (Traducci«¸n) [palabra - traducci«¸n] [R]"
</p>
<button 
    className="absolute top-1 right-1 text-gray-400 hover:text-white bg-gray-800 p-1 rounded-md opacity-0 group-hover:opacity-100 transition" 
    onClick={() => navigator.clipboard.writeText(`Eres un profesor de alem«≠n experto en TELC B1. Genera un di«≠logo EXTENSO (sin l«mite de l«neas) sobre [TEMA]. IMPORTANTE: marca los Redemittel clave solo con [R] al final de la l«nea alemana. No uses la palabra N«¨tzlich ni s«mbolos raros.\n\nFormato: Nombre: Frase en alem«≠n. (Traducci«¸n) [palabra - traducci«¸n] [R]`)}
>
    <Icon name="copy" className="w-3 h-3 md:w-4 md:h-4" />
</button>
                                  </div>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 md:mb-4">
                              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-purple-400"><Icon name="edit-3" className="w-5 h-5 md:w-6 md:h-6" /> A«Òadir Guion Copiado</h2>
                              <ExerciseHelpBtn helpId="guiones_import" compact />
                          </div>
                              <input type="text" placeholder="Ej: Lektion 17: Die Reise..." className="w-full bg-black/50 border border-gray-600 p-2 md:p-3 rounded-lg text-white mb-3 md:mb-4 outline-none focus:border-purple-500 text-sm md:text-base" value={newScriptTitle} onChange={(e) => setNewScriptTitle(e.target.value)} />
                              <textarea className="w-full flex-1 min-h-[120px] md:min-h-[150px] bg-black/50 border border-gray-600 p-3 md:p-4 rounded-lg text-white font-mono text-xs md:text-sm mb-3 md:mb-4 outline-none focus:border-purple-500 resize-none" placeholder="Pega aqu« el resultado de la IA..." value={scriptInput} onChange={(e) => setScriptInput(e.target.value)} />
                              <button onClick={handleSaveScript} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 md:py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg text-sm md:text-base"><Icon name="save" className="w-4 h-4 md:w-5 md:h-5" /> Guardar y Estudiar</button>

                              <div className="mt-6 md:mt-8 border-t border-gray-600/80 pt-5 md:pt-6">
                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                      <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-emerald-300"><Icon name="layout-grid" className="w-5 h-5 md:w-6 md:h-6" /> Distribuir texto É≈' B1 / B2</h2>
                                      <ExerciseHelpBtn helpId="guiones_bx_distrib" compact />
                                  </div>
                                  <p className="text-[11px] md:text-xs text-gray-400 mb-3 leading-relaxed">Pega un guion (<code className="text-gray-300">Nombre:</code> É?›), listas <code className="text-gray-300">alem«≠n - espa«Òol</code> o l«neas sueltas. La app clasifica cada trozo en <strong className="text-gray-200">vocabulario, verbos, preposiciones, conectores o Redemittel</strong> y, con <strong className="text-gray-200">nivel autom«≠tico</strong>, estima si va a B1 o B2 (heur«stica local, no IA). Si el cuadro est«≠ vac«o, se usa el texto del guion de arriba. Tus aportaciones se guardan en el navegador y se <strong className="text-gray-200">mezclan</strong> con las tarjetas del archivo <code className="text-gray-300">b1-b2-database.json</code> (esas no se borran con el bot«¸n rojo).</p>
                                  <p className="text-[10px] md:text-xs text-indigo-300/90 mb-3 leading-relaxed bg-indigo-950/25 border border-indigo-500/20 rounded-lg px-3 py-2">Si en <strong className="text-white">Historia</strong> ten«as cargado un guion <strong className="text-white">guardado en esta lista</strong>, al pulsar Distribuir las frases quedan <strong className="text-white">vinculadas a ese guion</strong>. Al borrar el guion con la papelera, te preguntamos si quieres quitar tambi«∏n esas tarjetas en B1/B2. Lo que enviaste con el ejemplo por defecto o sin guion cargado no se vincula («ßsalo ∂ÆBorrar mis aportaciones∂Ø para vaciar todo lo tuyo).</p>
                                  <textarea className="w-full min-h-[100px] md:min-h-[120px] bg-black/50 border border-emerald-800/60 p-3 rounded-lg text-white font-mono text-xs md:text-sm mb-3 outline-none focus:border-emerald-500 resize-none" placeholder="Pega aqu« o d«∏jalo vac«o para usar el cuadro del guion de arribaÉ?›" value={bxImportText} onChange={(e) => setBxImportText(e.target.value)} />
                                  <div className="flex flex-wrap gap-2 mb-3">
                                      <button type="button" onClick={() => handleBxDistribToLevels('auto')} className="flex-1 min-w-[200px] bg-gradient-to-r from-emerald-700 to-sky-700 hover:opacity-95 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm shadow-lg">É≈' Nivel autom«≠tico (B1 o B2 por frase)</button>
                                      <button type="button" onClick={() => handleBxDistribToLevels('b1')} className="flex-1 min-w-[120px] bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm">É≈' Todo a B1</button>
                                      <button type="button" onClick={() => handleBxDistribToLevels('b2')} className="flex-1 min-w-[120px] bg-sky-800 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm">É≈' Todo a B2</button>
                                  </div>
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                      <button type="button" onClick={clearBxUserOverlay} className="text-xs md:text-sm text-red-400 hover:text-red-300 underline">Borrar mis aportaciones B1/B2</button>
                                      {bxImportSummary ? <p className="text-[10px] md:text-xs text-emerald-200/90 flex-1 text-right">{bxImportSummary}</p> : null}
                                  </div>
                              </div>
                          </div>
                          <div className="w-full md:w-1/3 flex flex-col gap-4 max-h-[600px] md:max-h-full">
                              <div className="bg-gray-900 p-4 md:p-5 rounded-2xl border border-gray-800 flex flex-col shrink-0 h-1/3 min-h-[180px] md:min-h-[200px]">
                                  <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2 text-gray-200"><Icon name="file-text" className="w-5 h-5 md:w-6 md:h-6" /> Tus Guiones</h2>
                                  <div className="flex-1 overflow-y-auto space-y-2 pr-2 hide-scrollbar">
                                      {savedScripts.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">No hay guiones guardados.</p> : null}
                                      {savedScripts.map(script => (
                                          <div key={script.id} className="bg-black/40 p-3 md:p-4 rounded-lg border border-gray-700 hover:border-purple-500 cursor-pointer transition flex justify-between items-center group">
                                              <div onClick={() => loadSavedScript(script)} className="flex-1">
                                                  <p className="font-bold text-white group-hover:text-purple-400 truncate text-sm md:text-base">{script.title}</p>
                                                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">Click para cargar</p>
                                              </div>
                                              <button type="button" title="Eliminar guion" onClick={(e) => deleteSavedScript(e, script)} className="text-gray-500 hover:text-red-500 p-1 md:p-2 shrink-0 rounded-lg hover:bg-red-950/40"><Icon name="trash-2" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                              <div className="bg-amber-900/20 p-4 md:p-5 rounded-2xl border border-amber-800/50 flex flex-col flex-1 min-h-0">
                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                      <h2 className="text-lg md:text-xl font-bold text-amber-400 flex items-center gap-2"><Icon name="library" className="w-5 h-5 md:w-6 md:h-6" /> A«Òadir Vocabulario</h2>
                                      <ExerciseHelpBtn helpId="guiones_vocab_custom" compact />
                                  </div>
                                  <div className="bg-black/40 p-2 md:p-3 rounded-xl border border-amber-900/50 mb-3 md:mb-4 flex flex-col gap-2 shrink-0">
                                      <div className="flex gap-2 items-center">
                                          <input type="text" placeholder="T«tulo (Ej: Lektion 12)" className="w-2/3 bg-black/50 border border-amber-800 p-1.5 md:p-2 rounded-lg text-white text-xs md:text-sm outline-none focus:border-amber-500" value={vocabTitleInput} onChange={(e) => setVocabTitleInput(e.target.value)} />
                                          <button onClick={handleSaveCustomVocab} className="w-1/3 bg-amber-600 hover:bg-amber-500 text-white py-1.5 md:py-2 rounded-lg font-bold text-xs transition shadow-lg flex justify-center items-center gap-1"><Icon name="save" className="w-3 h-3 md:w-4 md:h-4" /> Guardar</button>
                                      </div>
                                      <p className="text-[10px] text-amber-700/90 mb-1">Paquetes de ejemplo en el repo: <code className="text-amber-200">vocab-packs/reise-mini.json</code> É?" abre el archivo, copia las l«neas <code className="text-amber-200">de/es</code> o pega una lista: <code className="text-amber-200">der Bahnhof - la estaci«¸n</code> por l«nea.</p>
                                  <textarea className="w-full h-12 md:h-14 bg-black/50 border border-amber-800 p-2 rounded-lg text-white font-mono text-[10px] md:text-xs outline-none focus:border-amber-500 resize-none" placeholder="Pega aqu« tu lista...&#10;der Apfel - la manzana" value={vocabTextInput} onChange={(e) => setVocabTextInput(e.target.value)} />
                                  </div>
                                  <div className="flex-1 overflow-y-auto space-y-2 pr-2 hide-scrollbar">
                                      {customVocabLessons.length === 0 ? <p className="text-gray-500 text-xs italic">Tus lecciones guardadas aparecer«≠n aqu«.</p> : null}
                                      {customVocabLessons.map(lesson => (
                                          <div key={lesson.id} className="bg-black/40 p-2 md:p-3 rounded-lg border border-amber-900/50 hover:border-amber-500 transition flex flex-col gap-2 md:gap-3 group">
                                              <div className="flex-1">
                                                  <p className="font-bold text-amber-100 text-xs md:text-sm truncate">{lesson.title}</p>
                                                  <p className="text-[10px] text-amber-600 mt-0.5">{lesson.words.length} palabras</p>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                  <button onClick={(e) => { e.stopPropagation(); let practiceList = [...lesson.words]; practiceList.sort(() => Math.random() - 0.5); let diffWords = lesson.words.filter(w => w.diff === 1); if(diffWords.length > 0) { let extraShuffled = [...diffWords].sort(() => Math.random() - 0.5); practiceList = [...practiceList, ...extraShuffled]; } setCurrentVocabList(mullerSortVocabBySrs(practiceList, mullerGetVocabSrsMap())); setActiveScriptTitle(lesson.title); setVocabReviewIndex(0); setShowVocabTranslation(false); setActiveTab('vocabulario'); }} className="bg-amber-600 hover:bg-amber-500 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold shadow-lg flex-1 flex justify-center items-center gap-1 md:gap-2 transition"><Icon name="play" className="w-3 h-3 md:w-4 md:h-4" /> Practicar</button>
                                                  <button onClick={(e) => { e.stopPropagation(); const newLessons = customVocabLessons.filter(l => l.id !== lesson.id); setCustomVocabLessons(newLessons); localStorage.setItem('mullerCustomVocab', JSON.stringify(newLessons)); }} className="text-gray-500 hover:text-red-500 bg-gray-900 p-1 rounded-lg border border-gray-700 transition"><Icon name="trash-2" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                                  <button onClick={() => {
                                      if (customVocabLessons.length === 0) { alert("No hay lecciones guardadas."); return; }
                                      const init = {};
                                      customVocabLessons.forEach((l) => { init[l.id] = true; });
                                      setMixLessonSelection(init);
                                      setShowVocabMixModal(true);
                                  }} className="mt-3 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                                      <Icon name="shuffle" className="w-4 h-4" /> Practicar mezcla seleccionada
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* VOCABULARIO (con bot«¸n de escritura a mano) */}
                  {activeTab === 'vocabulario' && !practiceActive && (
                      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in relative">
                          <div className="absolute top-3 right-3 md:top-6 md:right-8 z-10 flex flex-col items-end gap-2"><ExerciseHelpBtn helpId="vocab_active_recall" />
                              <label className="flex items-center gap-2 text-[10px] font-bold text-amber-900/80 bg-white/20 px-2 py-1 rounded-lg border border-amber-900/20 cursor-pointer"><input type="checkbox" className="accent-amber-600" checked={vocabDueFilterOnly} onChange={(e) => { setVocabDueFilterOnly(e.target.checked); setVocabReviewIndex(0); }} /> Solo vencidas / nuevas hoy</label>
                          </div>
                          <h1 className="absolute top-4 md:top-8 text-lg md:text-2xl font-black text-amber-900/40 uppercase tracking-widest hidden md:block">Active Recall - {activeScriptTitle}</h1>
                          {vocabSrsDueCount > 0 ? (
                              <p className="absolute top-12 md:top-[4.25rem] left-1/2 -translate-x-1/2 max-w-lg text-center text-[10px] md:text-xs text-amber-900/70 font-bold px-3 hidden md:block">SRS: {vocabSrsDueCount} tarjetas prioritarias en esta lista (nuevas o tocadas hoy)</p>
                          ) : null}
                          <div className="w-full max-w-md mb-4 mt-10 md:mt-6 px-3">
                              <p className="text-[10px] font-bold text-amber-900/60 uppercase mb-1">Objetivo diario (tarjetas calificadas)</p>
                              <div className="flex items-center gap-2">
                                  <input type="range" min="3" max="60" step="1" value={mainDailyGoal} onChange={(e) => { const n = parseInt(e.target.value, 10); setMainDailyGoal(n); try { localStorage.setItem(MULLER_MAIN_GOAL_KEY, String(n)); } catch (err) {} }} className="flex-1 accent-amber-600" />
                                  <span className="text-xs font-mono font-bold text-amber-950 w-8">{mainDailyGoal}</span>
                              </div>
                              <div className="h-2 rounded-full bg-black/20 mt-2 overflow-hidden border border-amber-900/20">
                                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${Math.min(100, (mullerGetStreakTodayStats().vocabRated / Math.max(1, mainDailyGoal)) * 100)}%` }} />
                              </div>
                              <p className="text-[9px] text-amber-900/50 mt-1">Hoy: {mullerGetStreakTodayStats().vocabRated || 0}/{mainDailyGoal} ∂˙ al completar el objetivo +10 monedas (una vez al d«a)</p>
                          </div>
                          {vocabDisplayList.length === 0 ? (
                              <div className="text-center text-amber-900/60 font-bold text-base md:text-2xl">{vocabDueFilterOnly ? 'No hay tarjetas vencidas en esta lista.' : 'Este guion no tiene vocabulario configurado.'}</div>
                          ) : (
                              <div className="max-w-2xl w-full flex flex-col items-center gap-6 md:gap-10">
                                  <button onClick={playVocabAudio} className="bg-white/20 hover:bg-white/30 text-amber-950 p-3 md:p-4 rounded-full transition shadow-lg mb-2 md:mb-4"><Icon name="volume-2" className="w-8 h-8 md:w-10 md:h-10" /></button>
                                  <h1 className="text-4xl md:text-8xl font-black text-slate-900 text-center drop-shadow-md flex items-center justify-center flex-wrap gap-1">{getArticleVisual(vocabDisplayList[vocabReviewIndex].de)}{vocabDisplayList[vocabReviewIndex].de}</h1>
                                  {!showVocabTranslation ? (
                                      <div className="flex gap-4">
                                          <button onClick={() => setShowVocabTranslation(true)} className="mt-6 md:mt-8 bg-slate-900 hover:bg-slate-800 text-white px-8 md:px-10 py-3 md:py-5 rounded-2xl font-bold text-2xl md:text-3xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition transform hover:scale-105 border-b-4 border-slate-700">Revelar –Y'?</button>
                                          <button onClick={() => setShowHandwriting(true)} className="mt-6 md:mt-8 bg-indigo-600 hover:bg-indigo-500 text-white px-6 md:px-8 py-3 md:py-5 rounded-2xl font-bold text-xl md:text-2xl shadow-lg transition transform hover:scale-105 border-b-4 border-indigo-800 flex items-center gap-2"><Icon name="edit" className="w-6 h-6" /> Escribir a mano</button>
                                      </div>
                                  ) : (
                                      <div className="flex flex-col items-center gap-6 md:gap-8 w-full animate-in slide-in-from-bottom-8">
                                          <h2 className="text-2xl md:text-5xl font-bold text-slate-800 text-center bg-white/60 px-4 md:px-10 py-3 md:py-6 rounded-2xl md:rounded-3xl shadow-inner border border-white/40 w-full">{vocabDisplayList[vocabReviewIndex].es}</h2>
                                          <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
                                              <button onClick={() => handleVocabDifficulty('easy')} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg transition">F«≠cil (Descartar)</button>
                                              <button onClick={() => handleVocabDifficulty('normal')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg transition">Normal</button>
                                              <button onClick={() => handleVocabDifficulty('hard')} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg border-2 border-red-400 transition">Dif«cil</button>
                                          </div>
                                          <p className="text-[10px] md:text-xs text-slate-800/80 text-center max-w-md leading-snug">Cada opci«¸n actualiza el calendario SRS (intervalos tipo Anki/SM-2): m«≠s espacio si fue f«≠cil, repaso antes si fue dif«cil.</p>
                                      </div>
                                  )}
                                  <p className="text-amber-900/60 font-bold mt-4 md:mt-8 bg-white/20 px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-amber-900/20 text-xs md:text-sm">Palabra {vocabReviewIndex + 1} de {vocabDisplayList.length}</p>
                                  {(() => {
                                      const w = vocabDisplayList[vocabReviewIndex];
                                      if (!w) return null;
                                      const s = vocabSrsMap[mullerVocabSrsKey(w)];
                                      const vc = s && typeof s.viewCount === 'number' ? s.viewCount : 0;
                                      const rc = s && typeof s.ratedCount === 'number' ? s.ratedCount : 0;
                                      return (
                                          <div className="text-[10px] text-amber-900/70 -mt-2 text-center max-w-lg space-y-0.5">
                                              {s && s.due ? <p>Pr«¸ximo repaso: <strong className="text-amber-950">{s.due}</strong> ∂˙ intervalo {s.interval} d ∂˙ EF {typeof s.easeFactor === 'number' ? s.easeFactor.toFixed(2) : 'É?"'}</p> : <p className="text-amber-900/50">Sin calificar a«ßn en SRS</p>}
                                              <p>Vistas: <strong>{vc}</strong> ∂˙ Calificaciones: <strong>{rc}</strong></p>
                                          </div>
                                      );
                                  })()}
                              </div>
                          )}
                          {showHandwriting && <HandwritingPad onClose={() => setShowHandwriting(false)} />}
                      </div>
                  )}

                  {activeTab === 'shadowing' && !practiceActive && (
                      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-3xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <h1 className="text-2xl md:text-4xl font-black text-teal-100 flex items-center gap-2 md:gap-3">
                                  <Icon name="audio-lines" className="w-8 h-8 md:w-10 md:h-10" /> Shadowing
                              </h1>
                              <ExerciseHelpBtn helpId="shadowing_main" />
                          </div>
                          <p className="text-teal-50/90 text-sm md:text-base mb-6 leading-relaxed">
                              Escucha el modelo en alem«≠n (voz del sistema), luego repite en voz alta siguiendo el ritmo y la entonaci«¸n. Es la t«∏cnica de <strong className="text-white">shadowing</strong> para ganar fluidez y pronunciaci«¸n tipo TELC.
                          </p>
                          {guionData.length === 0 ? (
                              <p className="text-gray-400 text-center py-12">No hay guion cargado. Abre <strong>Biblioteca</strong> y carga un guion.</p>
                          ) : (
                              <>
                                  {(() => {
                                      const si = Math.min(Math.max(0, sceneIndex), guionData.length - 1);
                                      const scene = guionData[si];
                                      const playModel = () => {
                                          if (!scene?.text) return;
                                          window.speechSynthesis.cancel();
                                          const u = new SpeechSynthesisUtterance(sanitizeHistoriaSpeechText(scene.text));
                                          u.lang = 'de-DE';
                                          u.rate = Math.min(1.15, Math.max(0.65, shadowRate));
                                          window.__mullerApplyPreferredDeVoice(u);
                                          window.speechSynthesis.speak(u);
                                      };
                                      return (
                                          <>
                                              <div className="bg-black/45 border border-teal-500/35 rounded-2xl p-4 md:p-6 mb-4 shadow-inner">
                                                  <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-2">Escena {si + 1} / {guionData.length} ∂˙ {scene?.speaker || 'É?"'}</p>
                                                  {shadowShowText ? (
                                                      <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">{scene?.text}</p>
                                                  ) : (
                                                      <p className="text-gray-500 italic text-lg">Texto oculto É?" escucha el modelo y repite de memoria (shadowing ciego).</p>
                                                  )}
                                                  {shadowShowText && scene?.translation && (
                                                      <p className="text-gray-400 mt-3 text-sm italic border-t border-white/10 pt-3">({scene.translation})</p>
                                                  )}
                                              </div>
                                              <div className="flex flex-wrap gap-2 mb-4 items-center">
                                                  <span className="text-xs text-gray-400 w-full sm:w-auto">Velocidad del modelo:</span>
                                                  {[0.75, 0.88, 1].map((r) => (
                                                      <button key={r} type="button" onClick={() => setShadowRate(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${shadowRate === r ? 'bg-teal-600 text-white ring-1 ring-white/25' : 'bg-gray-800/90 text-gray-300 hover:bg-gray-700'}`}>{r === 0.75 ? 'Lenta' : r === 0.88 ? 'Media' : 'Normal'}</button>
                                                  ))}
                                                  <button type="button" onClick={() => setShadowShowText(!shadowShowText)} className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-800 text-amber-100 border border-amber-700/40 hover:bg-gray-700">{shadowShowText ? 'Ocultar texto' : 'Mostrar texto'}</button>
                                              </div>
                                              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                                  <button type="button" onClick={playModel} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg transition">
                                                      <Icon name="volume-2" className="w-5 h-5" /> Escuchar modelo
                                                  </button>
                                                  <button type="button" onClick={playModel} className="flex-1 bg-teal-900/85 hover:bg-teal-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-teal-500/30 transition">
                                                      <Icon name="repeat" className="w-5 h-5" /> Repetir audio
                                                  </button>
                                              </div>
                                              <p className="text-center text-gray-500 text-xs mb-4">Despu«∏s de escuchar: habla al mismo tiempo o justo despu«∏s; prioriza fluidez, no perfecci«¸n.</p>
                                              <div className="rounded-2xl border border-teal-500/30 bg-black/35 p-4 md:p-5 mb-5">
                                                  <p className="text-xs font-bold text-teal-300 mb-1 flex items-center gap-2"><Icon name="mic" className="w-4 h-4" /> Comprobar pronunciaci«¸n</p>
                                                  <p className="text-[10px] text-gray-500 mb-3">El navegador transcribe tu alem«≠n y lo compara con el texto del guion (sin juzgar acento puro). Mant«∏n pulsado el micr«¸fono mientras lees la frase; suelta para ver el resultado. <span className="text-teal-400/90">En Shadowing no pierdes vidas.</span></p>
                                                  <div className="flex flex-col items-center gap-3">
                                                      <button type="button" aria-label="Mant«∏n pulsado y lee en voz alta para comprobar pronunciaci«¸n" onMouseDown={micMouseDownGuard(() => scene?.text && handleVoiceStart(scene.text, { mode: 'shadow' }))} onMouseUp={handleVoiceStop} onMouseLeave={handleVoiceStop} onTouchStart={micTouchStartGuard(() => scene?.text && handleVoiceStart(scene.text, { mode: 'shadow' }))} onTouchEnd={handleVoiceStop} className={`rounded-full p-5 md:p-6 text-white transition shadow-xl select-none touch-manipulation ${isListening ? 'bg-red-500 animate-pulse ring-4 ring-red-400/35 shadow-[0_0_32px_rgba(239,68,68,0.55)] border-2 border-white/35' : 'muller-mic-hold-btn ring-4 ring-teal-300/35 shadow-[0_0_28px_rgba(20,184,166,0.45)]'}`} title="Mant«∏n pulsado y lee en voz alta">
                                                          <Icon name="mic" className="w-10 h-10 md:w-12 md:h-12 text-white relative z-[1]" />
                                                      </button>
                                                      <span className="text-[10px] text-gray-500">Mant«∏n pulsado ∂˙ suelta para evaluar</span>
                                                      {grammarPolizeiMsg && (
                                                          <p className="text-amber-200/90 text-xs text-center bg-amber-950/40 border border-amber-700/30 rounded-lg px-3 py-2 w-full">{grammarPolizeiMsg}</p>
                                                      )}
                                                      {spokenText && (
                                                          <div className="w-full text-center mt-1">
                                                              <p className="text-yellow-200/95 font-mono text-sm md:text-base mb-2 break-words">"{spokenText}"</p>
                                                              {pronunciationFeedback.length > 0 && (
                                                                  <div className="flex flex-wrap gap-1 justify-center my-2 bg-black/40 p-2 rounded-xl border border-white/10">
                                                                      {pronunciationFeedback.map((item, idx) => (
                                                                          <span key={idx} className={`text-xs font-bold px-2 py-0.5 rounded ${item.correct ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-600/30' : 'bg-red-900/50 text-red-300 border border-red-600/30'}`}>{item.word}</span>
                                                                      ))}
                                                                  </div>
                                                              )}
                                                              {pronunciationScore !== null && (
                                                                  <div className="flex items-center justify-center gap-2 mt-2">
                                                                      <div className="flex-1 max-w-xs bg-gray-800 rounded-full h-2.5 overflow-hidden">
                                                                          <div className={`h-full rounded-full transition-all duration-700 ${pronunciationScore >= 85 ? 'bg-emerald-500' : pronunciationScore >= 55 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${pronunciationScore}%` }} />
                                                                      </div>
                                                                      <span className="font-black text-white text-sm md:text-lg tabular-nums">{pronunciationScore}%</span>
                                                                  </div>
                                                              )}
                                                              <p className="text-[10px] text-gray-500 mt-2">&gt;85%: verde ∂˙ 55É?"84%: mejorable ∂˙ &lt;55%: repite tras escuchar el modelo</p>
                                                          </div>
                                                      )}
                                                  </div>
                                              </div>
                                              <div className="flex gap-3 justify-center flex-wrap">
                                                  <button type="button" disabled={si <= 0} onClick={() => setSceneIndex((s) => Math.max(0, s - 1))} className="muller-icon-nav inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 font-bold text-white disabled:opacity-30 disabled:pointer-events-none border border-white/10"><Icon name="chevron-left" className="w-5 h-5 text-white" /> Anterior</button>
                                                  <button type="button" disabled={si >= guionData.length - 1} onClick={() => setSceneIndex((s) => Math.min(guionData.length - 1, s + 1))} className="muller-icon-nav inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 font-bold text-white disabled:opacity-30 disabled:pointer-events-none border border-white/10">Siguiente <Icon name="chevron-right" className="w-5 h-5 text-white" /></button>
                                              </div>
                                          </>
                                      );
                                  })()}
                              </>
                          )}
                      </div>
                  )}

              
        
                  {celebrationModal && (
                      <div className="fixed inset-0 z-[280] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" role="dialog" aria-modal="true">
                          <div className="relative max-w-md w-full rounded-[2rem] border border-white/20 bg-gradient-to-br from-fuchsia-900/95 via-violet-950/95 to-indigo-950/95 p-8 shadow-[0_0_80px_rgba(236,72,153,0.35)] text-center overflow-hidden animate-in zoom-in-95 duration-300">
                              <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(251,113,133,0.5), transparent 50%), radial-gradient(circle at 70% 80%, rgba(99,102,241,0.45), transparent 45%)' }} aria-hidden="true" />
                              <div className="relative z-10">
                                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg ring-4 ring-amber-300/40">
                                      <Icon name="trophy" className="w-10 h-10 text-white" />
                                  </div>
                                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{celebrationModal.title}</h2>
                                  <p className="text-fuchsia-100/90 text-sm md:text-base mb-6">{celebrationModal.subtitle}</p>
                                  <div className="flex flex-wrap justify-center gap-3 text-sm font-bold">
                                      {celebrationModal.xp > 0 ? <span className="rounded-full bg-white/15 px-4 py-2">+{celebrationModal.xp} XP</span> : null}
                                      {celebrationModal.coins > 0 ? <span className="rounded-full bg-amber-500/30 px-4 py-2 text-amber-100">+{celebrationModal.coins} monedas</span> : null}
                                      {celebrationModal.milestone ? <span className="rounded-full bg-emerald-500/30 px-4 py-2 text-emerald-100">Bonus ∂˙ 3 lecciones</span> : null}
                                      {celebrationModal.placement ? <span className="rounded-full bg-sky-500/30 px-4 py-2 text-sky-100">Test completado</span> : null}
                                      {celebrationModal.recap ? <span className="rounded-full bg-violet-500/25 px-4 py-2 text-violet-100">Repaso</span> : null}
                                  </div>
                                  <button type="button" className="mt-8 w-full rounded-xl bg-white text-violet-950 font-black py-3 hover:bg-fuchsia-100 transition" onClick={() => setCelebrationModal(null)}>∂≠Genial!</button>
                              </div>
                          </div>
                      </div>
                  )}

           

                   {activeTab === 'ruta' && !practiceActive && (
                      <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                              <div>
                              <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 mb-2"><Icon name="map" className="w-9 h-9 md:w-12 md:h-12 text-fuchsia-400" /> Ruta A0 É≈' C1</h1>
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
                              <button type="button" onClick={() => { try { localStorage.setItem('muller_sfx_enabled', (typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled()) ? '0' : '1'); } catch (e) {} setSfxEpoch((x) => x + 1); }} className="ml-auto text-xs font-bold rounded-xl border border-white/15 px-3 py-2 text-gray-300 hover:bg-white/10" title="Acierto, fallo y fanfarria cada 5 aciertos seguidos (5, 10, 15É?›)">
                                  Sonidos: {sfxEpoch >= 0 && typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled() ? 'ON' : 'OFF'}
                              </button>
                          </div>
                          <p className="text-[11px] text-gray-500 mb-4">Tiempo en Ruta (aprox.): {Math.round((rutaProgress.playTimeMs || 0) / 60000)} min ∂˙ Lecciones completadas: {rutaProgress.lessonsCompleted || 0}</p>
                          <div className="mb-4 rounded-2xl border border-fuchsia-500/30 bg-gradient-to-r from-slate-900/80 via-fuchsia-950/45 to-slate-900/80 p-3 md:p-4 flex flex-wrap items-center gap-3">
                              <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/20 overflow-hidden bg-gradient-to-br from-amber-200 via-rose-200 to-violet-200 ${rutaListening || isListening ? 'animate-pulse' : ''}`}>
                                  <div className="absolute inset-x-0 bottom-0 h-4 bg-rose-300/70" />
                                  <div className="absolute left-3 top-5 w-2 h-2 rounded-full bg-slate-700" />
                                  <div className="absolute right-3 top-5 w-2 h-2 rounded-full bg-slate-700" />
                                  <div className={`absolute left-1/2 -translate-x-1/2 bottom-2 rounded-full bg-slate-700 ${rutaListening || isListening ? 'w-4 h-2' : 'w-3 h-1'}`} />
                              </div>
                              <div className="min-w-[220px]">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-fuchsia-300">Tutor Ruta</p>
                                  <p className="text-sm font-bold text-white">Entrenador guiado desde cero (A0 É≈' C1)</p>
                                  <p className="text-[11px] text-gray-400">Banco de verbos detectado: <strong className="text-fuchsia-300">{(rutaVerbDb.verbs || []).length}</strong> entradas.</p>
                              </div>
                          </div>
                          {!rutaRun ? (
                              <>
                                  <div className="flex flex-wrap gap-2 mb-6">
                                      {[
                                          { id: 'camino', label: 'Camino' },
                                          { id: 'gramatica', label: 'Gram«≠tica' },
                                          { id: 'test', label: 'Test nivel' },
                                          { id: 'pdf', label: 'PDF Coach' },
                                      ].map((t) => (
                                          <button key={t.id} type="button" onClick={() => setRutaSubTab(t.id)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${rutaSubTab === t.id ? 'bg-fuchsia-600 border-fuchsia-400 text-white' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>{t.label}</button>
                                      ))}
                                  </div>
                                  {rutaSubTab === 'camino' && (
                                      <div className="space-y-6">
                                          <div className="rounded-2xl border border-fuchsia-500/25 bg-slate-900/45 p-3 md:p-4">
                                              <p className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-300 mb-2">Secci«¸n tem«≠tica</p>
                                              <div className="flex flex-wrap gap-2">
                                                  {[
                                                      { id: 'all', label: 'Todo' },
                                                      { id: 'presentacion', label: 'Presentaci«¸n' },
                                                      { id: 'familia', label: 'Familia' },
                                                      { id: 'trabajo', label: 'Trabajo' },
                                                      { id: 'alimentos', label: 'Alimentos' },
                                                      { id: 'vivienda', label: 'Vivienda' },
                                                      { id: 'viajes', label: 'Viajes' },
                                                      { id: 'salud', label: 'Salud' },
                                                      { id: 'tiempo_libre', label: 'Tiempo libre' },
                                                      { id: 'conectores', label: 'Conectores' },
                                                      { id: 'gramatica', label: 'Gram«≠tica' }
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
                                                                  <span className="text-xs font-bold text-amber-300">+{lesson.rewardCoins} ∂˙ {lesson.rewardXp} XP</span>
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
                                                  <h3 className="text-fuchsia-300 font-black text-lg mb-1">{sec.level} É?" {sec.title}</h3>
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
                                          <p className="text-xs text-gray-500">Ampliaremos con m«≠s temas y ejemplos conforme a«Òadas contenido al camino.</p>
                                      </div>
                                  )}
  {rutaSubTab === 'pdf' && (
  <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-950/20 p-5 md:p-6 space-y-4">
    {!rutaPdfPack ? (
      <>
        <p className="text-white font-bold text-lg">Ruta desde PDF (Menschen Coach)</p>
        <p className="text-gray-300 text-sm">
          Desde Lectura &gt; PDF estudio, usa "Analizar p«≠gina" y luego "Enviar a Ruta" para traer vocabulario, frases y ejercicios.
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
                <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Precisi«¸n</span><br /><strong className="text-cyan-300">{acc}%</strong></p>
                <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">SRS vencidas</span><br /><strong className="text-amber-300">{dueCount}</strong></p>
              </div>
              {dueCard ? (
                <div className="rounded-lg border border-amber-500/30 bg-amber-950/25 p-2 space-y-2">
                  <p className="text-[11px] text-amber-200 font-bold">SRS r«≠pida: {dueCard.de} (box {dueCard.box || 1})</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => runSingleSubmitAction('ruta-pdf-srs-again', () => rateRutaPdfSrsCard(dueCard.de, 'again'))} className="px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-600 text-white text-[11px] font-bold">Otra vez</button>
                    <button type="button" onClick={() => runSingleSubmitAction('ruta-pdf-srs-hard', () => rateRutaPdfSrsCard(dueCard.de, 'hard'))} className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold">Dif«cil</button>
                    <button type="button" onClick={() => runSingleSubmitAction('ruta-pdf-srs-easy', () => rateRutaPdfSrsCard(dueCard.de, 'easy'))} className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold">F«≠cil</button>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-gray-400">Sin tarjetas SRS vencidas ahora mismo.</p>
              )}
              {topErr.length > 0 ? <p className="text-[11px] text-rose-200">Errores frecuentes: {topErr.map(([w, n]) => `${w} (${n})`).join(', ')}</p> : <p className="text-[11px] text-gray-400">Sin errores frecuentes todav«a.</p>}
            </div>
          );
        })()}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-white font-black">PDF ∂˙ U{rutaPdfPack.unit || '-'} ∂˙ L{rutaPdfPack.lesson || '-'} ∂˙ p«≠gina {rutaPdfPack.page || '-'}</p>
          <button type="button" onClick={() => { setRutaPdfPack(null); setRutaPdfFeedback(''); setRutaPdfGapInput(''); setRutaPdfGapIdx(0); }} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold border border-white/10">Limpiar bloque</button>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="text-xs text-fuchsia-300 font-black uppercase tracking-wider mb-1">Vocabulario clave</p>
          <p className="text-sm text-white leading-relaxed">{(rutaPdfPack.keywords || []).slice(0, 14).map((k) => k.de).join(', ') || 'É?"'}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="text-xs text-cyan-300 font-black uppercase tracking-wider mb-1">Frases ejemplo</p>
          <ul className="space-y-1 text-sm text-cyan-100">
            {(rutaPdfPack.phrases || []).slice(0, 4).map((ph, i) => (<li key={i}>É?Ω {ph}</li>))}
          </ul>
          <button type="button" onClick={() => runSingleSubmitAction('ruta-pdf-mini-telc-send', sendRutaPdfMiniTelcToWriting)} className="mt-2 px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold border border-cyan-400/40">Enviar mini TELC a Escritura</button>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-emerald-300 font-black uppercase tracking-wider">Ejercicio huecos</p>
            <span className="text-[11px] text-emerald-100/80">«?tem {Math.min((rutaPdfGapIdx || 0) + 1, Math.max(1, (rutaPdfPack.exercises && rutaPdfPack.exercises.gaps ? rutaPdfPack.exercises.gaps.length : 1)))}</span>
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
          Responde unas preguntas para evaluar tu nivel de alem«≠n. El test se adapta a tus respuestas.
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
            {placementQuestions[placementIndex]?.opts.map((opt, oi) => (
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
                                      <button type="button" onClick={() => { setRutaRun(null); setRutaFillInput(''); setRutaTranscript(''); setRutaSpeakErr(''); }} className="text-sm font-bold text-fuchsia-300 mb-4 hover:text-white">É≈? Volver al camino</button>
                                      <h2 className="text-2xl font-black text-white mb-1">{lesson.title}</h2>
                                      <p className="text-xs text-fuchsia-400/90 mb-6">{lv.badge} ∂˙ {lv.title}</p>
                                      {st === 0 && (
                                          <>
                                              <p className="text-sm text-violet-200/90 mb-4 rounded-xl bg-violet-950/50 border border-violet-500/25 p-4 leading-relaxed">{lesson.grammarTip}</p>
                                              {lesson.phrases.map((p, i) => (
                                                  <div key={i} className="mb-4 rounded-xl border border-white/10 bg-slate-900/60 p-4">
                                                      <p className="text-lg font-bold text-white">{p.de}</p>
                                                      <p className="text-sm text-gray-400">{p.es}</p>
                                                      <button type="button" onClick={() => speakRutaDe(p.de)} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-fuchsia-300 hover:text-white"><Icon name="volume-2" className="w-4 h-4" /> Escuchar</button>
                                                  </div>
                                              ))}
                                              <button type="button" onClick={() => runSingleSubmitAction('ruta-to-fill-step', () => { setRutaRun({ ...rutaRun, step: 1 }); setRutaFillInput(''); setRutaSpeakErr(''); window.__mullerPlaySfx && window.__mullerPlaySfx('tick'); })} className="w-full rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 font-black py-3 text-white shadow-lg">Siguiente: huecos</button>
                                          </>
                                      )}
                                      {st === 1 && lesson.fill && (
                                          <>
                                              <p className="text-white font-bold mb-3">{lesson.fill.prompt}</p>
                                              {lesson.fill.hint ? <p className="text-xs text-gray-500 mb-2">Pista: {lesson.fill.hint}</p> : null}
                                              <input value={rutaFillInput} onChange={(e) => setRutaFillInput(e.target.value)} onKeyDown={(e) => handleExerciseEnterSubmit(e, 'ruta-fill-submit', () => { if (checkRutaFillAnswer(lesson)) { setRutaRun({ ...rutaRun, step: 2 }); setRutaTranscript(''); setRutaSpeakErr(''); } })} className="w-full rounded-xl bg-black/50 border border-fuchsia-500/40 px-4 py-3 text-white text-lg mb-3 outline-none focus:border-fuchsia-400" placeholder="Tu respuesta" autoComplete="off" />
                                              {rutaSpeakErr ? <p className="text-amber-200 text-sm mb-2">{rutaSpeakErr}</p> : null}
                                              <button type="button" onClick={() => runSingleSubmitAction('ruta-fill-submit', () => { if (checkRutaFillAnswer(lesson)) { setRutaRun({ ...rutaRun, step: 2 }); setRutaTranscript(''); setRutaSpeakErr(''); } })} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 font-black py-3 text-white">Comprobar y continuar</button>
                                          </>
                                      )}
                                      {st === 2 && lesson.speak && (
                                          <>
                                              <p className="text-gray-300 mb-2">Lee en voz alta en alem«≠n:</p>
                                              <p className="text-xl font-bold text-white mb-4 leading-snug">{lesson.speak.target}</p>
                                              <div className="flex flex-wrap gap-2 mb-4">
                                                  <button type="button" onClick={() => speakRutaDe(lesson.speak.target)} className="rounded-xl bg-slate-800 border border-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">Escuchar modelo</button>
                                                  <button type="button" disabled={rutaListening} onClick={startRutaListen} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-500 disabled:opacity-50">{rutaListening ? 'EscuchandoÉ?›' : 'Grabar'}</button>
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
                                                  Validar y completar lecci«¸n
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
                                              <p className="text-[11px] text-gray-500 mt-2">Si hoy no puedes usar micr«¸fono, puedes avanzar igualmente y practicar voz despu«∏s.</p>
                                          </>
                                      )}
                                  </div>
                              );
                          })()}
                      </div>
                  )}
              </div>

              {/* REPRODUCTOR CONTROLES INFERIORES */}
              {activeTab === 'historia' && mode !== 'quiz' && mode !== 'interview' && !practiceActive && (
                  <div className="muller-historia-player-bar bg-gray-950 p-3 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 border-t border-gray-800 z-20">
                      <div className="flex flex-col text-xs md:text-sm text-gray-400 w-full sm:w-auto text-center sm:text-left">
                        <span className="font-bold text-white text-sm md:text-base truncate sm:max-w-[200px]">{activeScriptTitle}</span>
                        <span>Szene {isReviewing ? reviewIndexPointer + 1 : sceneIndex + 1} von {isReviewing ? userStats.failedDiktatScenes.length : guionData.length} {isReviewing && "(Repaso)"}</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 md:gap-6 w-full sm:w-auto">
                        <button onClick={() => runSingleSubmitAction('player-prev', handlePrev)} className={`muller-icon-nav p-2 md:p-3 bg-gray-900 rounded-full transition text-white border border-gray-700 shadow-md ${isReviewing || podcastMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`} disabled={podcastMode}><Icon name="chevron-left" className="w-4 h-4 md:w-6 md:h-6 text-white" /></button>
                        <button onClick={togglePlay} className={`p-3 md:p-6 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${isPlaying ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                            {isPlaying ? <Icon name="square" className="w-5 h-5 md:w-8 md:h-8 fill-current" /> : <Icon name="play" className="w-5 h-5 md:w-8 md:h-8 ml-0.5 md:ml-1 fill-current" />}
                        </button>
                        <button type="button" onClick={() => { try { if (window.__mullerAudiobook && typeof window.__mullerAudiobook.toggle === 'function') window.__mullerAudiobook.toggle(); } catch (e) {} }} className={`p-2 md:p-3 rounded-full transition text-white border border-gray-700 shadow-md ${audiobookPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-amber-700 hover:bg-amber-600'}`} title={audiobookPlaying ? 'Detener audiolibro' : 'Audiolibro: reproduce todo el gui«¸n'}>
                            <Icon name={audiobookPlaying ? 'square' : 'headphones'} className="w-4 h-4 md:w-6 md:h-6 text-white" />
                        </button>
                        <button onClick={() => runSingleSubmitAction('player-next', handleNext)} className={`muller-icon-nav p-2 md:p-3 bg-gray-900 rounded-full transition text-white border border-gray-700 shadow-md ${podcastMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`} disabled={podcastMode}><Icon name="chevron-right" className="w-4 h-4 md:w-6 md:h-6 text-white" /></button>
                      </div>
                      <button type="button" onClick={exportScriptPDF} className="flex bg-red-700 hover:bg-red-600 border border-red-500 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-white font-bold items-center gap-2 shadow-lg transition text-xs md:text-sm shrink-0" title="PDF con alem«≠n, traducci«¸n al espa«Òol, vocabulario y an«≠lisis"><Icon name="file-down" className="w-3 h-3 md:w-4 md:h-4" /> PDF Guion</button>
                      <div className="flex items-center justify-center gap-2 md:gap-3 bg-black/50 px-2 md:px-4 py-1 md:py-2 rounded-xl border border-gray-800 w-full sm:w-auto">
                          <Icon name="sliders" className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                          <input type="range" min="0.50" max="1.50" step="0.01" value={playbackRate} onChange={(e) => setPlaybackRate(parseFloat(e.target.value))} className="w-20 md:w-32 accent-blue-500 cursor-pointer"/>
                          <span className="text-white font-mono font-bold text-xs md:text-sm w-10 md:w-12 text-right">x{playbackRate.toFixed(2)}</span>
                      </div>
                  </div>
              )}

              {pwaDeferredPrompt && (
                  <div className="muller-pwa-banner">
                      <span className="text-sm text-gray-100 pr-2 leading-snug"><strong className="text-white">Instalar M«¨ller</strong> É?" se abre pantalla completa como app. En Chrome/Edge: &quot;A«Òadir a pantalla de inicio&quot;. En Safari (iPhone/iPad): compartir É≈' &quot;A«Òadir a pantalla de inicio&quot;.</span>
                      <div className="flex items-center gap-2 ml-auto">
                          <button type="button" className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 font-bold text-sm text-white" onClick={async () => {
                              try {
                                  await pwaDeferredPrompt.prompt();
                              } catch (e) {}
                              setPwaDeferredPrompt(null);
                          }}>Instalar</button>
                          <button type="button" className="text-xs text-gray-400 hover:text-white underline" onClick={() => setPwaDeferredPrompt(null)}>Ahora no</button>
                      </div>
                  </div>
              )}
              {pdfStudyDoc && !pdfStudyFullscreen ? (
                  <button
                      type="button"
                      onClick={() => openPdfStudyFullscreen(activePdfPageData.page || 1)}
                      className="fixed bottom-20 right-4 z-[110] px-3 py-2 rounded-xl border border-cyan-400/45 bg-cyan-900/75 hover:bg-cyan-800/80 text-cyan-100 text-xs font-black shadow-xl backdrop-blur"
                      title="Abrir PDF Coach desde cualquier pesta«Òa"
                  >
                      PDF Coach
                  </button>
              ) : null}
              {pdfStudyFullscreen && pdfStudyDoc ? (
                  <div className="fixed inset-0 z-[120] bg-black/95 flex flex-col h-[100dvh] max-h-[100dvh] min-h-0">
                      <div className="flex items-center justify-between gap-3 px-3 md:px-5 py-3 border-b border-white/10 bg-slate-950/95">
                          <div className="min-w-0">
                              <p className="text-xs md:text-sm font-black text-cyan-100 truncate">PDF Coach ∂˙ {pdfStudyDoc.name || 'Libro PDF'}</p>
                              <p className="text-[10px] md:text-xs text-cyan-300/80">P«≠gina {activePdfPageData.page || 1}/{pdfStudyDoc.totalPages || (pdfStudyDoc.pages || []).length || 1}</p>
                          </div>
                          <div className="flex items-center gap-2">
                              <button
                                  type="button"
                                  onClick={() => setPdfStudyInkNonce((k) => k + 1)}
                                  className="px-2.5 py-1.5 rounded-lg border border-amber-500/45 bg-amber-900/45 hover:bg-amber-800/60 text-[11px] font-bold text-amber-100"
                              >
                                  Nuevo lienzo
                              </button>
                              <button
                                  type="button"
                                  onClick={closePdfStudyFullscreen}
                                  className="px-3 py-1.5 rounded-lg border border-rose-500/45 bg-rose-900/50 hover:bg-rose-800/60 text-[11px] font-black text-white"
                              >
                                  Cerrar Éo
                              </button>
                          </div>
                      </div>
                      {pdfStudyFsView === 'overlay' ? (
                      <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-slate-950" ref={pdfImmersiveFsRef}>
                          <div className="shrink-0 flex flex-wrap items-center gap-2 px-2 py-2 border-b border-cyan-500/35 bg-slate-950/95">
                              <span className="text-[10px] font-black text-cyan-200 uppercase">Vista</span>
                              {[
                                  { id: 'split', label: 'Dividida' },
                                  { id: 'stack', label: 'PDF grande' },
                                  { id: 'overlay', label: 'Anotar en PDF' },
                              ].map((m) => (
                                  <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => {
                                          setPdfStudyFsView(m.id);
                                          if (m.id !== 'overlay') setPdfFsScrollPdf(false);
                                      }}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${pdfStudyFsView === m.id ? 'border-emerald-400/70 bg-emerald-900/50 text-emerald-100' : 'border-white/10 bg-slate-900/60 text-cyan-100/80 hover:bg-slate-800/80'}`}
                                  >
                                      {m.label}
                                  </button>
                              ))}
                              <button type="button" onClick={() => setPdfFsScrollPdf((v) => !v)} className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-400/50 bg-amber-950/60 text-amber-100">
                                  {pdfFsScrollPdf ? 'Dibujar' : 'Desplazar PDF'}
                              </button>
                              <button type="button" onClick={() => setPdfOverlayZoom(1)} className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-500/50 bg-slate-800/80 text-slate-100">100%</button>
                              <button type="button" onClick={() => setPdfOverlayZoom((z) => mullerClamp(z / 1.2, 0.35, 4))} className="px-2 py-1 rounded border border-cyan-500/40 text-[11px] font-black text-cyan-100">É^'</button>
                              <span className="text-[10px] font-mono text-cyan-200 tabular-nums min-w-[3rem] text-center">{Math.round(pdfOverlayZoom * 100)}%</span>
                              <button type="button" onClick={() => setPdfOverlayZoom((z) => mullerClamp(z * 1.2, 0.35, 4))} className="px-2 py-1 rounded border border-cyan-500/40 text-[11px] font-black text-cyan-100">+</button>
                              <button type="button" onClick={() => { try { if (document.fullscreenElement) { document.exitFullscreen(); } else if (pdfImmersiveFsRef.current && pdfImmersiveFsRef.current.requestFullscreen) { pdfImmersiveFsRef.current.requestFullscreen(); } } catch (e) {} }} className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-indigo-500/50 bg-indigo-950/60 text-indigo-100">É>Ù Pantalla</button>
                              <button type="button" onClick={() => setPdfOverlayTypedOpen((o) => !o)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${pdfOverlayTypedOpen ? 'border-rose-400/70 bg-rose-900/50 text-rose-100' : 'border-rose-500/35 bg-rose-950/40 text-rose-200'}`}>Notas teclado</button>
                              <span className="text-[9px] text-cyan-500/80 hidden lg:inline">Ctrl+rueda: zoom</span>
                          </div>
                          <div className="shrink-0 flex flex-wrap items-center gap-2 px-2 py-1.5 border-b border-white/10 bg-slate-900/90">
                              <button type="button" onClick={() => setPdfStudyPageIdx((i) => Math.max(0, i - 1))} disabled={pdfStudyPageIdx <= 0} className="px-2.5 py-1.5 rounded-lg border border-white/15 bg-slate-800/80 disabled:opacity-40 text-[10px] font-bold text-white">É≈? P«≠g.</button>
                              <button type="button" onClick={() => setPdfStudyPageIdx((i) => Math.min(Math.max(0, (pdfStudyDoc.pages || []).length - 1), i + 1))} disabled={pdfStudyPageIdx >= Math.max(0, (pdfStudyDoc.pages || []).length - 1)} className="px-2.5 py-1.5 rounded-lg border border-white/15 bg-slate-800/80 disabled:opacity-40 text-[10px] font-bold text-white">P«≠g. É≈'</button>
                              <button type="button" onClick={() => setPdfStudyInkNonce((k) => k + 1)} className="px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-900/40 text-[10px] font-bold text-amber-100">Lienzo nuevo</button>
                              <button type="button" onClick={() => runPdfPageOcr(activePdfPageData.page || 1)} disabled={pdfStudyOcrBusy} className="px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-900/45 text-[10px] font-bold text-amber-100 disabled:opacity-45">OCR</button>
                              <details className="text-[10px] text-cyan-200 ml-auto min-w-0 max-w-md">
                                  <summary className="cursor-pointer font-bold">Texto de la p«≠gina</summary>
                                  <textarea value={activePdfPageData.text || ''} readOnly className="mt-1 w-full max-h-24 bg-black/50 border border-cyan-500/30 rounded p-2 text-[10px] text-cyan-50" />
                              </details>
                          </div>
                          <div ref={pdfAnnotateAreaRef} className="flex-1 min-h-0 w-full relative bg-black">
                              {pdfFsScrollPdf && pdfStudyBlobUrl ? (
                                  <div ref={pdfOverlayScrollRef} className="absolute inset-0 overflow-auto">
                                      <iframe title="PDF desplazar" src={`${pdfStudyBlobUrl}#page=${activePdfPageData.page || 1}&view=FitH`} className="w-full h-full min-h-full border-0" />
                                  </div>
                              ) : pdfStudyBlobUrl ? (
                                  <div ref={pdfOverlayScrollRef} className="absolute inset-0 overflow-auto touch-pan-x touch-pan-y overscroll-contain">
                                      {pdfOverlayDims.w > 8 && pdfOverlayDims.h > 8 ? (
                                          <div className="relative" style={{ width: Math.max(1, Math.floor(pdfOverlayDims.w * pdfOverlayZoom)), height: Math.max(1, Math.floor(pdfOverlayDims.h * pdfOverlayZoom)) }}>
                                              <div ref={pdfOverlayHostRef} className="absolute top-0 left-0" style={{ width: pdfOverlayDims.w, height: pdfOverlayDims.h, transform: `scale(${pdfOverlayZoom})`, transformOrigin: 'top left' }}>
                                                  {pdfSessionBufferOk && pdfOverlayBgBusy ? <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 text-cyan-100 text-xs font-bold p-2">Generando PDF.jsÉ?›</div> : null}
                                                  {!pdfSessionBufferOk ? (
                                                      <>
                                                          <iframe title="ref" src={`${pdfStudyBlobUrl}#page=${activePdfPageData.page || 1}&view=FitH`} className="absolute inset-0 w-full h-full border-0 z-0 pointer-events-none" />
                                                          <div className="absolute top-1 left-1 right-1 z-10 rounded border border-amber-500/50 bg-amber-950/90 px-2 py-1 text-[9px] text-amber-100">Vuelve a subir el PDF en esta sesi«¸n para alinear (sin memoria en buffer).</div>
                                                      </>
                                                  ) : null}
                                                  <div className="absolute inset-0 z-[3] flex h-full min-h-0 flex-col" style={{ pointerEvents: 'auto' }}>
                                                      <TabletWritingCanvas padKey={pdfStudyCanvasPadKey} grid={false} strokeW={4} compareTarget={activePdfPageData.text || ''} snapshotData={activePdfPageNotes.drawing} snapshotPadKey={pdfStudyCanvasPadKey} onSnapshotChange={(dataUrl) => updatePdfPageNotes(activePdfPageData.page || 1, { drawing: dataUrl || '' })} onOcrCompared={() => {}} overlayMode hideOcrUi backgroundImageData={pdfSessionBufferOk && pdfOverlayBgUrl ? pdfOverlayBgUrl : ''} />
                                                  </div>
                                              </div>
                                          </div>
                                      ) : (
                                          <div className="flex h-[50vh] items-center justify-center text-cyan-200 text-sm p-4">Cargando vistaÉ?›</div>
                                      )}
                                  </div>
                              ) : (
                                  <div className="absolute inset-0 flex items-center justify-center p-4 text-amber-100 text-sm">Necesitas un PDF con vista previa.</div>
                              )}
                          </div>
                          {pdfOverlayTypedOpen ? (
                              <div className="shrink-0 max-h-[38vh] overflow-y-auto border-t border-rose-500/40 bg-slate-950/95 p-2 md:p-3">
                                  <p className="text-[10px] font-bold text-rose-200 mb-1">Notas teclado (fuera del trazo) ∂˙ misma p«≠gina</p>
                                  <textarea value={activePdfPageNotes.typed || ''} onChange={(e) => updatePdfPageNotes(activePdfPageData.page || 1, { typed: e.target.value })} placeholder="Notas, dudas, vocabularioÉ?›" className="w-full min-h-[88px] bg-black/45 border border-rose-500/30 rounded-lg p-2 text-xs text-white" />
                              </div>
                          ) : null}
                      </div>
                      ) : (
                      <div className={`flex-1 min-h-0 overflow-y-auto p-3 md:p-5 gap-4 bg-gradient-to-b from-slate-950 to-slate-900 ${pdfStudyFsView === 'split' ? 'grid grid-cols-1 xl:grid-cols-2' : 'grid grid-cols-1'}`}>
                          <div className="col-span-1 xl:col-span-2 flex flex-wrap items-center gap-2 -mt-0.5 pb-2 border-b border-cyan-500/20">
                              <span className="text-[10px] font-black text-cyan-200/95 uppercase tracking-wider">Vista</span>
                              {[
                                  { id: 'split', label: 'Dividida' },
                                  { id: 'stack', label: 'PDF grande' },
                                  { id: 'overlay', label: 'Anotar en PDF' },
                              ].map((m) => (
                                  <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => {
                                          setPdfStudyFsView(m.id);
                                          if (m.id !== 'overlay') setPdfFsScrollPdf(false);
                                      }}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${pdfStudyFsView === m.id ? 'border-emerald-400/70 bg-emerald-900/50 text-emerald-100' : 'border-white/10 bg-slate-900/60 text-cyan-100/80 hover:bg-slate-800/80'}`}
                                  >
                                      {m.label}
                                  </button>
                              ))}
                              {pdfStudyFsView === 'overlay' ? (
                                  <button
                                      type="button"
                                      onClick={() => setPdfFsScrollPdf((v) => !v)}
                                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-400/50 bg-amber-950/60 text-amber-100"
                                  >
                                      {pdfFsScrollPdf ? 'Éo? Dibujar' : 'É≈" Desplazar PDF'}
                                  </button>
                              ) : null}
                              <span className="text-[9px] text-cyan-500/80 hidden sm:inline">Modo anotar: trazo alineado con PDF.js si el PDF est«≠ en memoria. ∂ÆDesplazar∂Ø = mover el visor (iframe).</span>
                          </div>
                          <section className="rounded-2xl border border-cyan-500/25 bg-black/35 p-3 md:p-4 space-y-3 min-h-0">
                              <div className="flex flex-wrap items-center gap-2">
                                  <button
                                      type="button"
                                      onClick={() => setPdfStudyPageIdx((i) => Math.max(0, i - 1))}
                                      disabled={pdfStudyPageIdx <= 0}
                                      className="px-3 py-1.5 rounded-lg border border-white/15 bg-slate-900/70 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-white"
                                  >
                                      É≈? P«≠gina
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => setPdfStudyPageIdx((i) => Math.min(Math.max(0, (pdfStudyDoc.pages || []).length - 1), i + 1))}
                                      disabled={pdfStudyPageIdx >= Math.max(0, (pdfStudyDoc.pages || []).length - 1)}
                                      className="px-3 py-1.5 rounded-lg border border-white/15 bg-slate-900/70 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-white"
                                  >
                                      P«≠gina É≈'
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => runPdfPageOcr(activePdfPageData.page || 1)}
                                      disabled={pdfStudyOcrBusy}
                                      className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-900/45 hover:bg-amber-800/55 disabled:opacity-45 text-xs font-bold text-amber-100"
                                  >
                                      {pdfStudyOcrBusy ? 'OCRÉ?›' : 'OCR p«≠gina'}
                                  </button>
                                  <button
                                      type="button"
                                      onClick={runPdfOcrBatch}
                                      disabled={pdfStudyExtracting || pdfStudyOcrBusy || pdfStudyOcrBatching}
                                      className="px-3 py-1.5 rounded-lg border border-fuchsia-500/40 bg-fuchsia-900/45 hover:bg-fuchsia-800/55 disabled:opacity-45 text-xs font-bold text-fuchsia-100"
                                  >
                                      {pdfStudyOcrBatching ? 'OCR lotesÉ?›' : 'OCR 12 p«≠ginas'}
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => { pdfStudyOcrAbortRef.current = true; }}
                                      disabled={!pdfStudyOcrBatching}
                                      className="px-3 py-1.5 rounded-lg border border-gray-500/35 bg-gray-900/55 hover:bg-gray-800/60 disabled:opacity-45 text-xs font-bold text-gray-100"
                                  >
                                      Detener OCR
                                  </button>
                              </div>
                              {pdfStudyFsView === 'overlay' && pdfStudyBlobUrl ? (
                                  <div
                                      ref={pdfOverlayHostRef}
                                      className="relative w-full h-[min(78vh,860px)] min-h-[min(52vh,520px)] rounded-xl border border-white/10 overflow-hidden bg-slate-900/40"
                                  >
                                      {pdfFsScrollPdf ? (
                                          <iframe
                                              title="PDF estudio É?" desplazar"
                                              src={`${pdfStudyBlobUrl}#page=${activePdfPageData.page || 1}&view=FitH`}
                                              className="absolute inset-0 w-full h-full border-0"
                                          />
                                      ) : (
                                          <>
                                              {pdfSessionBufferOk && pdfOverlayBgBusy ? (
                                                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 text-cyan-100 text-xs md:text-sm font-bold px-4 text-center">Generando imagen con PDF.js (vista alineada)É?›</div>
                                              ) : null}
                                              {!pdfSessionBufferOk ? (
                                                  <>
                                                      <iframe
                                                          title="PDF estudio É?" referencia"
                                                          src={`${pdfStudyBlobUrl}#page=${activePdfPageData.page || 1}&view=FitH`}
                                                          className="absolute inset-0 w-full h-full border-0 z-0 pointer-events-none"
                                                      />
                                                      <div className="absolute top-2 left-2 right-2 z-10 rounded-lg bg-amber-950/90 border border-amber-500/50 px-2 py-1.5 text-[10px] text-amber-100 leading-snug">
                                                          Sin PDF en memoria (p. ej. cargado solo desde biblioteca). <strong>Sube el archivo otra vez</strong> o abre el PDF reci«∏n subido para alinear anotaci«¸n y p«≠gina con PDF.js.
                                                      </div>
                                                  </>
                                              ) : null}
                                              <div className="absolute inset-0 z-[3] flex h-full min-h-0 flex-col" style={{ pointerEvents: 'auto' }}>
                                                  <TabletWritingCanvas
                                                      padKey={pdfStudyCanvasPadKey}
                                                      grid={false}
                                                      strokeW={4}
                                                      compareTarget={activePdfPageData.text || ''}
                                                      snapshotData={activePdfPageNotes.drawing}
                                                      snapshotPadKey={pdfStudyCanvasPadKey}
                                                      onSnapshotChange={(dataUrl) => updatePdfPageNotes(activePdfPageData.page || 1, { drawing: dataUrl || '' })}
                                                      onOcrCompared={() => {}}
                                                      overlayMode
                                                      hideOcrUi
                                                      backgroundImageData={pdfSessionBufferOk && pdfOverlayBgUrl ? pdfOverlayBgUrl : ''}
                                                  />
                                              </div>
                                          </>
                                      )}
                                  </div>
                              ) : pdfStudyBlobUrl ? (
                                  <div className="rounded-xl border border-white/10 overflow-hidden bg-black/45">
                                      <iframe
                                          title="PDF estudio fullscreen"
                                          src={`${pdfStudyBlobUrl}#page=${activePdfPageData.page || 1}&view=FitH`}
                                          className={`w-full border-0 ${pdfStudyFsView === 'stack' ? 'h-[min(74vh,880px)] min-h-[52vh]' : 'h-[52vh] md:h-[64vh]'}`}
                                      />
                                  </div>
                              ) : (
                                  <div className="rounded-xl border border-amber-600/35 bg-amber-950/35 p-3">
                                      <p className="text-xs text-amber-100">Vista PDF no disponible en esta sesi«¸n. Vuelve a subir el PDF para ver el documento completo aqu«.</p>
                                  </div>
                              )}
                              <textarea
                                  value={activePdfPageData.text || ''}
                                  readOnly
                                  className="w-full h-32 bg-black/45 border border-cyan-500/25 rounded-xl p-3 text-xs text-cyan-50"
                                  placeholder="Texto detectado de esta p«≠gina."
                              />
                          </section>
                          <section className="rounded-2xl border border-rose-500/25 bg-black/35 p-3 md:p-4 space-y-3 min-h-0">
                              {pdfStudyFsView === 'overlay' ? (
                                  <>
                                      <p className="text-xs font-black text-rose-200 uppercase tracking-wider">Notas teclado (misma p«≠gina)</p>
                                      <p className="text-[10px] text-rose-300/80">El trazo del modo ∂ÆAnotar en PDF∂Ø se guarda autom«≠ticamente con la p«≠gina (local). Cambia a ∂ÆDividida∂Ø si prefieres el lienzo al lado.</p>
                                  </>
                              ) : (
                                  <>
                                      <p className="text-xs font-black text-rose-200 uppercase tracking-wider">Notas de estudio por p«≠gina (stylus + teclado)</p>
                                      <TabletWritingCanvas
                                          padKey={pdfStudyCanvasPadKey}
                                          grid={true}
                                          strokeW={4}
                                          compareTarget={activePdfPageData.text || ''}
                                          snapshotData={activePdfPageNotes.drawing}
                                          snapshotPadKey={pdfStudyCanvasPadKey}
                                          onSnapshotChange={(dataUrl) => updatePdfPageNotes(activePdfPageData.page || 1, { drawing: dataUrl || '' })}
                                          onOcrCompared={() => {}}
                                      />
                                  </>
                              )}
                              <label className="block text-[11px] font-bold text-rose-200 uppercase tracking-wider">
                                  Notas r«≠pidas (teclado)
                                  <textarea
                                      value={activePdfPageNotes.typed || ''}
                                      onChange={(e) => updatePdfPageNotes(activePdfPageData.page || 1, { typed: e.target.value })}
                                      placeholder="Ejemplos, dudas, vocabulario clave, errores t«picosÉ?›"
                                      className="mt-1 w-full min-h-[120px] bg-black/45 border border-rose-500/30 rounded-xl p-3 text-xs text-white normal-case"
                                  />
                              </label>
                          </section>
                      </div>
                      )}
                  </div>
              ) : null}
            </div>
          );
        }

        // ========== COMPONENTES FLOTANTES (Sincronizaci«¸n y Permiso Micr«¸fono) ==========
        function FloatingButtons() {
            const [lastBackupIso, setLastBackupIso] = React.useState(() => localStorage.getItem('muller_last_backup_iso'));

            const requestMicPermission = async () => {
                try {
                    const ok = await window.mullerRequestMicPermission && window.mullerRequestMicPermission({ autoPrompt: true, showToast: true });
                    if (!ok) return;
                    window.__mullerToast && window.__mullerToast('Micr«¸fono concedido. Ya puedes usar reconocimiento de voz.', 'success');
                } catch (err) {
                    window.__mullerToast && window.__mullerToast('No se pudo obtener permiso del micr«¸fono.', 'error');
                }
            };

            const exportData = React.useCallback(() => {
                const allLocalData = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (!key) continue;
                    allLocalData[key] = localStorage.getItem(key);
                }
                const backupTimestamp = new Date().toISOString();
                localStorage.setItem('muller_last_backup_iso', backupTimestamp);
                setLastBackupIso(backupTimestamp);
                const dataToExport = {
                    allLocalStorage: allLocalData,
                    version: '4.0',
                    exportDate: backupTimestamp
                };
                const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `muller_progreso_${new Date().toISOString().slice(0,19)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                window.__mullerToast && window.__mullerToast('Backup total exportado. Gu«≠rdalo para sincronizar.', 'success');
            }, []);

            React.useEffect(() => {
                const onFull = () => exportData();
                window.addEventListener('muller-export-full-backup', onFull);
                return () => window.removeEventListener('muller-export-full-backup', onFull);
            }, [exportData]);

            const importData = (event) => {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.type === 'muller_partial_v1' && data.part === 'srs') {
                            localStorage.setItem('muller_vocab_srs_v1', JSON.stringify(data.muller_vocab_srs_v1 || {}));
                            window.__mullerToast && window.__mullerToast('SRS importado. RecargandoÉ?›', 'success');
                            window.location.reload();
                            return;
                        }
                        if (data.type === 'muller_partial_v1' && data.part === 'decks') {
                            const cur = JSON.parse(localStorage.getItem('mullerStats') || '{}');
                            const merged = { ...cur, difficultVocab: data.difficultVocab || cur.difficultVocab, normalVocab: data.normalVocab || cur.normalVocab, difficultGrammar: data.difficultGrammar || cur.difficultGrammar };
                            localStorage.setItem('mullerStats', JSON.stringify(merged));
                            window.__mullerToast && window.__mullerToast('Mazos importados. RecargandoÉ?›', 'success');
                            window.location.reload();
                            return;
                        }
                        if (data.allLocalStorage && typeof data.allLocalStorage === 'object') {
                            localStorage.clear();
                            Object.entries(data.allLocalStorage).forEach(([key, value]) => {
                                localStorage.setItem(key, value);
                            });
                            setLastBackupIso(localStorage.getItem('muller_last_backup_iso'));
                        } else if (data.allMullerData && typeof data.allMullerData === 'object') {
                            Object.entries(data.allMullerData).forEach(([key, value]) => {
                                localStorage.setItem(key, value);
                            });
                            setLastBackupIso(localStorage.getItem('muller_last_backup_iso'));
                        } else {
                            if (data.userStats) localStorage.setItem('mullerStats', JSON.stringify(data.userStats));
                            if (data.savedScripts) localStorage.setItem('mullerScripts', JSON.stringify(data.savedScripts));
                            if (data.customVocabLessons) localStorage.setItem('mullerCustomVocab', JSON.stringify(data.customVocabLessons));
                        }
                        window.__mullerToast && window.__mullerToast('Datos importados correctamente. RecargandoÉ?›', 'success');
                        window.location.reload();
                    } catch(err) { window.__mullerToast && window.__mullerToast('Archivo inv«≠lido.', 'error'); }
                };
                reader.readAsText(file);
            };

            const exportSrsOnly = () => {
                try {
                    const raw = localStorage.getItem('muller_vocab_srs_v1');
                    const map = raw ? JSON.parse(raw) : {};
                    const payload = { type: 'muller_partial_v1', part: 'srs', muller_vocab_srs_v1: map, exportDate: new Date().toISOString() };
                    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `muller_srs_only_${new Date().toISOString().slice(0, 19)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    window.__mullerToast && window.__mullerToast('Exportado solo SRS.', 'success');
                } catch (err) { window.__mullerToast && window.__mullerToast('No se pudo exportar SRS.', 'error'); }
            };

            const exportDecksOnly = () => {
                try {
                    const stats = JSON.parse(localStorage.getItem('mullerStats') || '{}');
                    const payload = {
                        type: 'muller_partial_v1',
                        part: 'decks',
                        exportDate: new Date().toISOString(),
                        difficultVocab: stats.difficultVocab || [],
                        normalVocab: stats.normalVocab || [],
                        difficultGrammar: stats.difficultGrammar || []
                    };
                    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `muller_mazos_${new Date().toISOString().slice(0, 19)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    window.__mullerToast && window.__mullerToast('Exportados mazos (dif«cil/normal/gram«≠tica).', 'success');
                } catch (err) { window.__mullerToast && window.__mullerToast('No se pudo exportar mazos.', 'error'); }
            };

            const showSyncHelp = () => {
                alert(
                    "–Y"" Sincronizaci«¸n TOTAL gratis:\n\n" +
                    "1) En tu dispositivo actual pulsa Exportar.\n" +
                    "2) Sube el archivo .json a Google Drive.\n" +
                    "3) En otro dispositivo descarga ese .json.\n" +
                    "4) Pulsa Importar en la app.\n" +
                    "5) Recarga la p«≠gina.\n\n" +
                    "Esto copia TODO el estado guardado de la aplicaci«¸n."
                );
            };

            React.useEffect(() => {
                const onImport = () => {
                    const el = document.getElementById('muller-backup-file-input');
                    if (el) el.click();
                };
                const onSrs = () => exportSrsOnly();
                const onDecks = () => exportDecksOnly();
                const onHelp = () => showSyncHelp();
                const onMic = () => requestMicPermission();
                window.addEventListener('muller-open-backup-import', onImport);
                window.addEventListener('muller-export-srs-only', onSrs);
                window.addEventListener('muller-export-decks-only', onDecks);
                window.addEventListener('muller-show-sync-help', onHelp);
                window.addEventListener('muller-request-mic', onMic);
                return () => {
                    window.removeEventListener('muller-open-backup-import', onImport);
                    window.removeEventListener('muller-export-srs-only', onSrs);
                    window.removeEventListener('muller-export-decks-only', onDecks);
                    window.removeEventListener('muller-show-sync-help', onHelp);
                    window.removeEventListener('muller-request-mic', onMic);
                };
            }, [exportDecksOnly, exportSrsOnly]);

            React.useEffect(() => {
                let enable = false;
                try { enable = localStorage.getItem(MULLER_MIC_PERMISSION_PREF_KEY) !== '0'; } catch (e) {}
                if (!enable) return undefined;
                const t = window.setTimeout(() => { requestMicPermission(); }, 600);
                return () => window.clearTimeout(t);
            }, []);

            return (
                <>
                    <input id="muller-backup-file-input" type="file" accept=".json" onChange={importData} className="hidden" />
                </>
            );
        }

      const hidePreboot = () => {
        const el = document.getElementById('muller-preboot');
        if (!el) return;
        el.classList.add('is-hidden');
        window.setTimeout(() => {
          try { if (el && el.parentNode) el.parentNode.removeChild(el); } catch (e) {}
        }, 260);
      };
      const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <MullerErrorBoundary>
                <>
                    <App />
                    <FloatingButtons />
                    <AdvancedPracticePanelFinal />
                </>
            </MullerErrorBoundary>
        );
      window.requestAnimationFrame(() => window.requestAnimationFrame(hidePreboot));
      
window.App = App;




