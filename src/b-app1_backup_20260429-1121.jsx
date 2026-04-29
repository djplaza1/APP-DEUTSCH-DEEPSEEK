        function App() {
          const [activeTab, setActiveTab] = useState(() => { try { return localStorage.getItem('muller_active_tab_v1') || 'inicio'; } catch { return 'inicio'; } });
          const [showSplash, setShowSplash] = useState(false); 
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
          const [celebrationModal, setCelebrationModal] = useState(null);
          const [telcLevel, setTelcLevel] = useState('B1');
          const [diktatMotivationMsg, setDiktatMotivationMsg] = useState('');
          const rutaTabTimerRef = useRef(null);
          const [rutaTranscript, setRutaTranscript] = useState('');
          const [rutaListening, setRutaListening] = useState(false);
          const [rutaTutorTalking, setRutaTutorTalking] = useState(false);
          const [rutaPodcastUI, setRutaPodcastUI] = useState(null);
          const [rutaFillTip, setRutaFillTip] = useState('');
          const rutaPodcastPlaybackRef = useRef({ cancelled: false, line: 0, ex: null });
          const [readingSource, setReadingSource] = useState('current_story');
          const [readingScriptId, setReadingScriptId] = useState('__current__');
          const [readingTextInput, setReadingTextInput] = useState('');
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
          const rutaAutoSpeakRef = useRef('');
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
          /** Tras el último guion, carga el siguiente de Biblioteca (solo tiene efecto al terminar una escena en flujo normal / podcast). */
          const [historiaPlaylistAllScripts, setHistoriaPlaylistAllScripts] = useState(false);
          const [showCurrentTranslation, setShowCurrentTranslation] = useState(false); 
          const [tempusVerbList, setTempusVerbList] = useState([]);
          const [tempusSelectedVerb, setTempusSelectedVerb] = useState(null);
          const [diktatMode, setDiktatMode] = useState(false);
          const [diktatInput, setDiktatInput] = useState("");
          const [showDiktatResult, setShowDiktatResult] = useState(false);
          const [savedScripts, setSavedScripts] = useState([]);
          /** Si practicas un guion guardado en Biblioteca, su id; si no, null (ejemplo, IA o no guardado). Sirve para vincular «Distribuir → B1/B2». */
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
          const [scriptInput, setScriptInput] = useState(`Lukas: Hallo Elena! (¡Hola Elena!) [der Tag - el día]\nElena: Ja, ich bin froh! (¡Sí, estoy contenta!) [froh - contento]`);
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
          const [pdfStudyInkNonce, setPdfStudyInkNonce] = useState(0);
          const [pdfStudyNotesByPage, setPdfStudyNotesByPage] = useState(() => {
              try {
                  const raw = localStorage.getItem(MULLER_PDF_NOTES_STORAGE_KEY);
                  return raw ? JSON.parse(raw) : {};
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
                      { title: 'Alfabeto y sonidos base', topic: 'presentacion', grammarTip: 'Prioriza pronunciación de vocales largas/cortas y combinaciones ch, sch, ei, ie.', phrases: [{ de: 'Ich heiße Leo.', es: 'Me llamo Leo.' }, { de: 'Das ist Anna.', es: 'Esta es Anna.' }, { de: 'Wir lernen Deutsch.', es: 'Aprendemos alemán.' }], fill: { prompt: 'Completa: Ich ___ Leo.', answer: 'heiße', hint: 'Verbo «heißen», 1ª persona.' }, speak: { target: 'Ich heiße Leo.' } },
                      { title: 'Números y datos personales', topic: 'tramites', grammarTip: 'Practica deletrear nombre, edad, teléfono y país.', phrases: [{ de: 'Ich bin 24 Jahre alt.', es: 'Tengo 24 años.' }, { de: 'Meine Nummer ist null eins sieben.', es: 'Mi número es 017.' }, { de: 'Ich komme aus Spanien.', es: 'Vengo de España.' }], fill: { prompt: 'Completa: Ich bin 24 Jahre ___.', answer: 'alt', hint: 'Expresión fija para la edad.' }, speak: { target: 'Ich bin 24 Jahre alt.' } },
                      { title: 'Aula y objetos cotidianos', topic: 'clase', grammarTip: 'Memoriza sustantivo con artículo: der Stift, die Tasche, das Heft.', phrases: [{ de: 'Das ist ein Stift.', es: 'Eso es un bolígrafo.' }, { de: 'Die Tasche ist neu.', es: 'La mochila es nueva.' }, { de: 'Wo ist das Heft?', es: '¿Dónde está el cuaderno?' }], fill: { prompt: 'Completa: Das ist ___ Stift.', answer: 'ein', hint: 'Indefinido masculino.' }, speak: { target: 'Das ist ein Stift.' } },
                      { title: 'Familia inmediata', topic: 'familia', grammarTip: 'Usa posesivos básicos: mein/meine y dein/deine.', phrases: [{ de: 'Das ist meine Mutter.', es: 'Esta es mi madre.' }, { de: 'Mein Bruder ist hier.', es: 'Mi hermano está aquí.' }, { de: 'Hast du Geschwister?', es: '¿Tienes hermanos?' }], fill: { prompt: 'Completa: Das ist ___ Mutter.', answer: 'meine', hint: 'Sustantivo femenino.' }, speak: { target: 'Das ist meine Mutter.' } },
                      { title: 'Comidas y compras simples', topic: 'alimentos', grammarTip: 'Pide con «Ich möchte ...» + Akkusativ.', phrases: [{ de: 'Ich möchte Wasser.', es: 'Quiero agua.' }, { de: 'Wir kaufen Brot.', es: 'Compramos pan.' }, { de: 'Der Kaffee ist heiß.', es: 'El café está caliente.' }], fill: { prompt: 'Completa: Ich ___ Wasser.', answer: 'möchte', hint: 'Forma de cortesía común.' }, speak: { target: 'Ich möchte Wasser.' } },
                      { title: 'Rutina mínima diaria', topic: 'rutina', grammarTip: 'Separable verbs: «aufstehen» separa en presente.', phrases: [{ de: 'Ich stehe um sieben auf.', es: 'Me levanto a las siete.' }, { de: 'Ich arbeite am Montag.', es: 'Trabajo el lunes.' }, { de: 'Abends lerne ich.', es: 'Por la noche estudio.' }], fill: { prompt: 'Completa: Ich ___ um sieben auf.', answer: 'stehe', hint: 'Verbo separable «aufstehen».' }, speak: { target: 'Ich stehe um sieben auf.' } }
                  ],
                  A1: [
                      { title: 'Presentarse con detalle', topic: 'presentacion', grammarTip: 'Amplía presentación con profesión, ciudad y lenguas.', phrases: [{ de: 'Ich bin Ingenieurin und wohne in Madrid.', es: 'Soy ingeniera y vivo en Madrid.' }, { de: 'Ich spreche Spanisch und etwas Deutsch.', es: 'Hablo español y algo de alemán.' }, { de: 'Seit einem Jahr lerne ich Deutsch.', es: 'Desde hace un año estudio alemán.' }], fill: { prompt: 'Completa: Ich ___ in Madrid.', answer: 'wohne', hint: 'Verbo wohnen.' }, speak: { target: 'Ich spreche Spanisch und etwas Deutsch.' } },
                      { title: 'Casa y habitaciones', topic: 'vivienda', grammarTip: 'Preposiciones de lugar frecuentes: in, auf, unter.', phrases: [{ de: 'Die Küche ist klein.', es: 'La cocina es pequeña.' }, { de: 'Das Buch liegt auf dem Tisch.', es: 'El libro está sobre la mesa.' }, { de: 'Wir wohnen in einer Wohnung.', es: 'Vivimos en un piso.' }], fill: { prompt: 'Completa: Das Buch liegt ___ dem Tisch.', answer: 'auf', hint: 'Relación «encima de».' }, speak: { target: 'Das Buch liegt auf dem Tisch.' } },
                      { title: 'Trabajo y horarios', topic: 'trabajo', grammarTip: 'Preguntar y responder horarios con «von ... bis ...».', phrases: [{ de: 'Ich arbeite von neun bis fünf.', es: 'Trabajo de nueve a cinco.' }, { de: 'Wann beginnt dein Kurs?', es: '¿Cuándo empieza tu curso?' }, { de: 'Heute habe ich frei.', es: 'Hoy tengo libre.' }], fill: { prompt: 'Completa: Ich arbeite von neun ___ fünf.', answer: 'bis', hint: 'Expresión de intervalo.' }, speak: { target: 'Ich arbeite von neun bis fünf.' } },
                      { title: 'Restaurante y pedidos', topic: 'alimentos', grammarTip: 'Usa «ich hätte gern» para sonar natural y cortés.', phrases: [{ de: 'Ich hätte gern eine Suppe.', es: 'Quisiera una sopa.' }, { de: 'Wir zahlen zusammen.', es: 'Pagamos juntos.' }, { de: 'Die Rechnung, bitte.', es: 'La cuenta, por favor.' }], fill: { prompt: 'Completa: Ich hätte ___ eine Suppe.', answer: 'gern', hint: 'Partícula fija en la fórmula.' }, speak: { target: 'Die Rechnung, bitte.' } },
                      { title: 'Salud y farmacia', topic: 'salud', grammarTip: 'Estructura típica: «Ich habe + síntoma».', phrases: [{ de: 'Ich habe Kopfschmerzen.', es: 'Tengo dolor de cabeza.' }, { de: 'Ich brauche einen Termin.', es: 'Necesito una cita.' }, { de: 'Nehmen Sie diese Tabletten.', es: 'Tome estas pastillas.' }], fill: { prompt: 'Completa: Ich ___ Kopfschmerzen.', answer: 'habe', hint: 'Verbo haben.' }, speak: { target: 'Ich habe Kopfschmerzen.' } },
                      { title: 'Tiempo libre y planes', topic: 'tiempo_libre', grammarTip: 'Con «am Wochenende» y «mit Freunden» hablas de ocio.', phrases: [{ de: 'Am Wochenende spiele ich Fußball.', es: 'El fin de semana juego al fútbol.' }, { de: 'Heute Abend gehe ich ins Kino.', es: 'Esta tarde voy al cine.' }, { de: 'Morgen treffe ich Freunde.', es: 'Mañana quedo con amigos.' }], fill: { prompt: 'Completa: Heute Abend ___ ich ins Kino.', answer: 'gehe', hint: 'Verbo gehen, 1ª persona.' }, speak: { target: 'Heute Abend gehe ich ins Kino.' } }
                  ],
                  A2: [
                      { title: 'Narrar pasado con Perfekt', topic: 'gramatica', grammarTip: 'Combina auxiliares haben/sein y participio al final.', phrases: [{ de: 'Letztes Jahr habe ich in Berlin gearbeitet.', es: 'El año pasado trabajé en Berlín.' }, { de: 'Wir sind spät angekommen.', es: 'Llegamos tarde.' }, { de: 'Sie hat viel gelernt.', es: 'Ella ha estudiado mucho.' }], fill: { prompt: 'Completa: Wir sind spät ___.', answer: 'angekommen', hint: 'Participio de ankommen.' }, speak: { target: 'Wir sind spät angekommen.' } },
                      { title: 'Conectores de causa y contraste', topic: 'conectores', grammarTip: 'weil + verbo final; aber/deshalb en frase principal.', phrases: [{ de: 'Ich bleibe zu Hause, weil ich krank bin.', es: 'Me quedo en casa porque estoy enfermo.' }, { de: 'Es regnet, aber wir gehen raus.', es: 'Llueve, pero salimos.' }, { de: 'Ich bin müde, deshalb schlafe ich früh.', es: 'Estoy cansado, por eso duermo pronto.' }], fill: { prompt: 'Completa: Ich bleibe zu Hause, ___ ich krank bin.', answer: 'weil', hint: 'Conector causal con verbo al final.' }, speak: { target: 'Ich bin müde, deshalb schlafe ich früh.' } },
                      { title: 'Viajes y transporte', topic: 'viajes', grammarTip: 'Bloques útiles: Fahrkarte, umsteigen, Abfahrt, Ankunft.', phrases: [{ de: 'Wo kann ich eine Fahrkarte kaufen?', es: '¿Dónde puedo comprar un billete?' }, { de: 'Der Zug hat Verspätung.', es: 'El tren tiene retraso.' }, { de: 'Wir müssen in Köln umsteigen.', es: 'Tenemos que hacer transbordo en Colonia.' }], fill: { prompt: 'Completa: Der Zug hat ___.', answer: 'Verspätung', hint: 'Retraso.' }, speak: { target: 'Wir müssen in Köln umsteigen.' } },
                      { title: 'Trámites y oficina', topic: 'tramites', grammarTip: 'Practica frases formales cortas en ventanilla.', phrases: [{ de: 'Ich möchte dieses Formular abgeben.', es: 'Quiero entregar este formulario.' }, { de: 'Welche Unterlagen brauche ich?', es: '¿Qué documentos necesito?' }, { de: 'Können Sie mir helfen?', es: '¿Puede ayudarme?' }], fill: { prompt: 'Completa: Welche ___ brauche ich?', answer: 'Unterlagen', hint: 'Documentos.' }, speak: { target: 'Ich möchte dieses Formular abgeben.' } },
                      { title: 'Relaciones personales', topic: 'familia', grammarTip: 'Opinión básica: «Ich finde..., weil...»', phrases: [{ de: 'Ich finde meinen Job interessant.', es: 'Encuentro mi trabajo interesante.' }, { de: 'Mit meiner Schwester spreche ich oft.', es: 'Hablo mucho con mi hermana.' }, { de: 'Wir verstehen uns gut.', es: 'Nos llevamos bien.' }], fill: { prompt: 'Completa: Wir ___ uns gut.', answer: 'verstehen', hint: 'Verbo separable no, forma plural.' }, speak: { target: 'Wir verstehen uns gut.' } },
                      { title: 'A2 oral práctico', topic: 'trabajo', grammarTip: 'Entrena respuestas completas de 2-3 frases.', phrases: [{ de: 'In meiner Firma arbeite ich im Team.', es: 'En mi empresa trabajo en equipo.' }, { de: 'Meine Aufgaben sind klar.', es: 'Mis tareas están claras.' }, { de: 'Ich möchte mich verbessern.', es: 'Quiero mejorar.' }], fill: { prompt: 'Completa: Ich arbeite ___ Team.', answer: 'im', hint: 'in + dem = im.' }, speak: { target: 'In meiner Firma arbeite ich im Team.' } }
                  ],
                  B1: [
                      { title: 'Opinión y argumentación', topic: 'conectores', grammarTip: 'Conecta ideas con außerdem, jedoch, deshalb.', phrases: [{ de: 'Meiner Meinung nach ist Homeoffice sinnvoll.', es: 'En mi opinión, el teletrabajo tiene sentido.' }, { de: 'Einerseits spart man Zeit, andererseits fehlt Kontakt.', es: 'Por un lado ahorras tiempo, por otro falta contacto.' }, { de: 'Deshalb brauche ich einen Mix.', es: 'Por eso necesito un equilibrio.' }], fill: { prompt: 'Completa: Einerseits ..., ___ ...', answer: 'andererseits', hint: 'Conector correlativo.' }, speak: { target: 'Meiner Meinung nach ist Homeoffice sinnvoll.' } },
                      { title: 'B1 trabajo y CV', topic: 'trabajo', grammarTip: 'Pasado relevante y logros concretos en frases breves.', phrases: [{ de: 'Ich habe drei Jahre im Kundenservice gearbeitet.', es: 'Trabajé tres años en atención al cliente.' }, { de: 'Ich bin zuverlässig und flexibel.', es: 'Soy fiable y flexible.' }, { de: 'Ich möchte mich beruflich weiterentwickeln.', es: 'Quiero desarrollarme profesionalmente.' }], fill: { prompt: 'Completa: Ich habe drei Jahre im Kundenservice ___.', answer: 'gearbeitet', hint: 'Participio regular.' }, speak: { target: 'Ich möchte mich beruflich weiterentwickeln.' } },
                      { title: 'Relativsätze útiles', topic: 'gramatica', grammarTip: 'der/die/das + verbo al final para añadir información.', phrases: [{ de: 'Das ist der Kollege, der mir hilft.', es: 'Ese es el compañero que me ayuda.' }, { de: 'Die Stadt, in der ich wohne, ist ruhig.', es: 'La ciudad donde vivo es tranquila.' }, { de: 'Ich suche ein Buch, das leicht ist.', es: 'Busco un libro que sea fácil.' }], fill: { prompt: 'Completa: Das ist der Kollege, ___ mir hilft.', answer: 'der', hint: 'Relativo masculino nominativo.' }, speak: { target: 'Die Stadt, in der ich wohne, ist ruhig.' } },
                      { title: 'B1 viajes e incidencias', topic: 'viajes', grammarTip: 'Describe problemas, pide solución y confirma pasos.', phrases: [{ de: 'Mein Flug wurde annulliert.', es: 'Mi vuelo fue cancelado.' }, { de: 'Können Sie mir eine Alternative anbieten?', es: '¿Puede ofrecerme una alternativa?' }, { de: 'Ich brauche eine Bestätigung per E-Mail.', es: 'Necesito una confirmación por correo.' }], fill: { prompt: 'Completa: Mein Flug wurde ___.', answer: 'annulliert', hint: 'Participio de annullieren.' }, speak: { target: 'Können Sie mir eine Alternative anbieten?' } },
                      { title: 'Konjunktiv II cotidiano', topic: 'gramatica', grammarTip: 'Usa würde + infinitivo para hipótesis y deseos.', phrases: [{ de: 'Ich würde gern in Deutschland arbeiten.', es: 'Me gustaría trabajar en Alemania.' }, { de: 'Wenn ich Zeit hätte, würde ich mehr lesen.', es: 'Si tuviera tiempo, leería más.' }, { de: 'Könnten Sie das bitte wiederholen?', es: '¿Podría repetirlo, por favor?' }], fill: { prompt: 'Completa: Wenn ich Zeit hätte, ___ ich mehr lesen.', answer: 'würde', hint: 'Estructura condicional.' }, speak: { target: 'Wenn ich Zeit hätte, würde ich mehr lesen.' } }
                  ],
                  B2: [
                      { title: 'Debate estructurado B2', topic: 'conectores', grammarTip: 'Estructura: tesis, argumentos, contraargumento, cierre.', phrases: [{ de: 'Ich vertrete die Auffassung, dass ...', es: 'Defiendo la postura de que...' }, { de: 'Zudem sprechen mehrere Gründe dafür.', es: 'Además hay varias razones a favor.' }, { de: 'Dennoch müssen Risiken berücksichtigt werden.', es: 'No obstante, deben considerarse riesgos.' }], fill: { prompt: 'Completa: ___ müssen Risiken berücksichtigt werden.', answer: 'Dennoch', hint: 'Conector concesivo.' }, speak: { target: 'Ich vertrete die Auffassung, dass digitale Bildung wichtig ist.' } },
                      { title: 'Correo formal y registro', topic: 'tramites', grammarTip: 'Registro formal: Sehr geehrte..., ich möchte..., mit freundlichen Grüßen.', phrases: [{ de: 'Ich möchte mich über den Kurs informieren.', es: 'Quiero informarme sobre el curso.' }, { de: 'Für eine Rückmeldung wäre ich dankbar.', es: 'Agradecería una respuesta.' }, { de: 'Mit freundlichen Grüßen', es: 'Atentamente' }], fill: { prompt: 'Completa: Für eine Rückmeldung wäre ich ___.', answer: 'dankbar', hint: 'Adjetivo típico en carta formal.' }, speak: { target: 'Ich möchte mich über den Kurs informieren.' } },
                      { title: 'Nominalización B2', topic: 'gramatica', grammarTip: 'Convierte verbos en sustantivos para estilo académico.', phrases: [{ de: 'Die Entscheidung wurde gestern getroffen.', es: 'La decisión se tomó ayer.' }, { de: 'Die Verbesserung der Prozesse ist notwendig.', es: 'La mejora de procesos es necesaria.' }, { de: 'Nach der Analyse folgte die Umsetzung.', es: 'Tras el análisis siguió la implementación.' }], fill: { prompt: 'Completa: Die ___ der Prozesse ist notwendig.', answer: 'Verbesserung', hint: 'Sustantivo de verbessern.' }, speak: { target: 'Die Entscheidung wurde gestern getroffen.' } },
                      { title: 'Comprensión de noticias', topic: 'trabajo', grammarTip: 'Extrae idea principal, datos y postura del autor.', phrases: [{ de: 'Laut dem Bericht steigt die Inflation.', es: 'Según el informe, sube la inflación.' }, { de: 'Die Experten fordern schnelle Maßnahmen.', es: 'Los expertos piden medidas rápidas.' }, { de: 'Die Folgen betreffen vor allem Haushalte.', es: 'Las consecuencias afectan sobre todo a los hogares.' }], fill: { prompt: 'Completa: Laut dem Bericht ___ die Inflation.', answer: 'steigt', hint: 'Verbo de la oración principal.' }, speak: { target: 'Die Experten fordern schnelle Maßnahmen.' } }
                  ],
                  C1: [
                      { title: 'Matiz y precisión léxica', topic: 'gramatica', grammarTip: 'Selecciona verbo por intención: behaupten, erläutern, einräumen.', phrases: [{ de: 'Die Autorin räumt ein, dass die Daten begrenzt sind.', es: 'La autora reconoce que los datos son limitados.' }, { de: 'Der Bericht legt nahe, dass Reformen nötig sind.', es: 'El informe sugiere que las reformas son necesarias.' }, { de: 'Er erläutert die Ursachen differenziert.', es: 'Explica las causas de forma matizada.' }], fill: { prompt: 'Completa: Der Bericht ___ nahe, dass Reformen nötig sind.', answer: 'legt', hint: 'Expresión fija «nahelegen».' }, speak: { target: 'Die Autorin räumt ein, dass die Daten begrenzt sind.' } },
                      { title: 'Argumentación avanzada C1', topic: 'conectores', grammarTip: 'Conectores de alta precisión: demzufolge, insofern, wohingegen.', phrases: [{ de: 'Die Maßnahme ist teuer, demzufolge braucht sie klare Ziele.', es: 'La medida es costosa; por consiguiente, necesita metas claras.' }, { de: 'Insofern ist die Kritik nachvollziehbar.', es: 'En ese sentido, la crítica es comprensible.' }, { de: 'Wohingegen kurzfristige Lösungen selten nachhaltig sind.', es: 'Mientras que las soluciones a corto plazo rara vez son sostenibles.' }], fill: { prompt: 'Completa: Die Maßnahme ist teuer, ___ braucht sie klare Ziele.', answer: 'demzufolge', hint: 'Conector de consecuencia formal.' }, speak: { target: 'Insofern ist die Kritik nachvollziehbar.' } },
                      { title: 'Presentación profesional', topic: 'trabajo', grammarTip: 'Abrir, estructurar y cerrar exposición con naturalidad.', phrases: [{ de: 'Im Folgenden präsentiere ich drei zentrale Punkte.', es: 'A continuación presento tres puntos centrales.' }, { de: 'Abschließend lässt sich festhalten, dass ...', es: 'Para concluir, puede sostenerse que...' }, { de: 'Gern beantworte ich anschließend Ihre Fragen.', es: 'Con gusto respondo después sus preguntas.' }], fill: { prompt: 'Completa: ___ präsentiere ich drei zentrale Punkte.', answer: 'Im Folgenden', hint: 'Inicio formal de exposición.' }, speak: { target: 'Abschließend lässt sich festhalten, dass nachhaltige Strategien nötig sind.' } }
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
                  presentacion: 'Presentación', pronunciacion: 'Pronunciación', numeros: 'Números', clase: 'Clase', familia: 'Familia', alimentos: 'Alimentos',
                  rutina: 'Rutina', vivienda: 'Vivienda', viajes: 'Viajes', salud: 'Salud', trabajo: 'Trabajo', tramites: 'Trámites', compras: 'Compras',
                  tiempo_libre: 'Tiempo libre', conectores: 'Conectores', pasado: 'Pasado', telefonia: 'Teléfono', gramatica: 'Gramática',
                  argumentacion: 'Argumentación', cv: 'CV', entrevista: 'Entrevista', incidencias: 'Incidencias', relativsatz: 'Relativos', konjunktiv2: 'Konjunktiv II',
                  debate: 'Debate', correo_formal: 'Correo formal', nominalizacion: 'Nominalización', noticias: 'Noticias', universidad: 'Universidad', pasiva: 'Pasiva',
                  grafico: 'Describir gráficos', negociacion: 'Negociación', medios: 'Medios', precision: 'Precisión léxica', registro: 'Registro', academico: 'Académico',
                  resumen: 'Resumen', analisis: 'Análisis', matiz: 'Matiz', retorica: 'Retórica'
              };
              const mkPremiumUnit = (levelKey, topic, idx) => {
                  const label = topicLabel[topic] || topic;
                  const topicForUi = ({ pronunciacion: 'presentacion', numeros: 'tramites', pasado: 'gramatica', telefonia: 'tramites', argumentacion: 'conectores', cv: 'trabajo', entrevista: 'trabajo', incidencias: 'viajes', relativsatz: 'gramatica', konjunktiv2: 'gramatica', debate: 'conectores', correo_formal: 'tramites', nominalizacion: 'gramatica', noticias: 'trabajo', universidad: 'trabajo', pasiva: 'gramatica', grafico: 'trabajo', negociacion: 'trabajo', medios: 'trabajo', precision: 'gramatica', registro: 'gramatica', academico: 'gramatica', resumen: 'gramatica', analisis: 'gramatica', matiz: 'gramatica', retorica: 'conectores' }[topic]) || topic;
                  const sentenceBank = {
                      A0: [{ de: 'Ich bin neu hier.', es: 'Soy nuevo aqui.' }, { de: 'Das ist meine Familie.', es: 'Esta es mi familia.' }, { de: 'Ich lerne jeden Tag.', es: 'Aprendo cada dia.' }],
                      A1: [{ de: 'Ich möchte im Restaurant bestellen.', es: 'Quiero pedir en el restaurante.' }, { de: 'Am Wochenende treffe ich Freunde.', es: 'El fin de semana quedo con amigos.' }, { de: 'Wir fahren morgen mit dem Zug.', es: 'Viajamos manana en tren.' }],
                      A2: [{ de: 'Letzte Woche habe ich viel gearbeitet.', es: 'La semana pasada trabaje mucho.' }, { de: 'Ich lerne Deutsch, weil ich umziehen möchte.', es: 'Aprendo aleman porque quiero mudarme.' }, { de: 'Können Sie mir bitte weiterhelfen?', es: 'Puede ayudarme, por favor?' }],
                      B1: [{ de: 'Meiner Meinung nach ist das sinnvoll.', es: 'En mi opinion eso tiene sentido.' }, { de: 'Wenn ich mehr Zeit hätte, würde ich reisen.', es: 'Si tuviera mas tiempo, viajaria.' }, { de: 'Das ist ein Punkt, den wir beachten müssen.', es: 'Es un punto que debemos considerar.' }],
                      B2: [{ de: 'Die Maßnahme sollte schrittweise umgesetzt werden.', es: 'La medida deberia aplicarse gradualmente.' }, { de: 'Darüber hinaus sind die Kosten zu berücksichtigen.', es: 'Ademas hay que considerar los costes.' }, { de: 'Ich beziehe mich auf die vorliegenden Daten.', es: 'Me refiero a los datos disponibles.' }],
                      C1: [{ de: 'Insofern erscheint die Kritik nachvollziehbar.', es: 'En ese sentido, la critica resulta comprensible.' }, { de: 'Der Autor differenziert zwischen Ursache und Wirkung.', es: 'El autor diferencia entre causa y efecto.' }, { de: 'Nichtsdestotrotz bleibt die Kernfrage offen.', es: 'No obstante, la cuestion central sigue abierta.' }]
                  };
                  const sample = sentenceBank[levelKey] || sentenceBank.A1;
                  const answerMap = { A0: 'bin', A1: 'möchte', A2: 'habe', B1: 'würde', B2: 'werden', C1: 'bleibt' };
                  return {
                      title: `${label} · práctica ${idx + 1}`,
                      topic: topicForUi,
                      grammarTip: `Nivel ${levelKey}: bloque de ${label.toLowerCase()} con enfoque comunicativo y corrección gramatical.`,
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
                  title: `${levelKey} · ${unit.title}`,
                  topic: unit.topic || 'general',
                  rewardCoins: 14 + Math.min(20, idx * 2),
                  rewardXp: 20 + Math.min(26, idx * 2),
                  grammarTip: unit.grammarTip || `Práctica guiada ${levelKey}.`,
                  phrases: Array.isArray(unit.phrases) && unit.phrases.length ? unit.phrases.slice(0, 3) : [{ de: 'Ich lerne Deutsch.', es: 'Aprendo alemán.' }],
                  fill: unit.fill || { prompt: 'Completa: Ich ___ Deutsch.', answer: 'lerne', hint: 'Verbo en presente.' },
                  speak: unit.speak || { target: (unit.phrases && unit.phrases[0] && unit.phrases[0].de) || 'Ich lerne Deutsch.' }
              });
              const mkLesson = (levelKey, chunk, idx) => {
                  const topicCycle = ['familia', 'trabajo', 'alimentos', 'viajes', 'vivienda', 'salud', 'tiempo_libre', 'tramites'];
                  const topic = topicCycle[idx % topicCycle.length];
                  const title = `${levelKey} · Verbos ${idx + 1}`;
                  const phrases = chunk.slice(0, 3).map((v) => ({
                      de: (v && v.examples && v.examples[0] && v.examples[0].de) || `Ich ${v.lemma}.`,
                      es: (v && v.examples && v.examples[0] && v.examples[0].es) || (v.es || '—')
                  }));
                  const p = chunk[0] || {};
                  return {
                      id: `auto-${levelKey.toLowerCase()}-${idx + 1}`,
                      title,
                      topic,
                      rewardCoins: 16 + Math.min(16, idx),
                      rewardXp: 22 + Math.min(20, idx * 2),
                      grammarTip: `Nivel ${levelKey}: práctica de verbos frecuentes y sus formas.`,
                      phrases,
                      fill: {
                          prompt: `Completa: Ich ___ (${p.lemma || 'lernen'}).`,
                          answer: (p.forms && p.forms.praesens && p.forms.praesens.ich) || p.lemma || 'lerne',
                          hint: `Forma de 1ª persona (Präsens) de «${p.lemma || 'lernen'}».`
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
                  B1: ['obwohl', 'damit', 'trotzdem', 'außerdem', 'danach'],
                  B2: ['während', 'sobald', 'falls', 'insofern', 'hingegen'],
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
                      title: `${levelKey} · Artículos ${idx + 1}`,
                      topic,
                      rewardCoins: 15 + idx,
                      rewardXp: 20 + idx * 2,
                      grammarTip: `Nivel ${levelKey}: artículo + sustantivo y concordancia en frase.`,
                      phrases: items.slice(0, 3).map((x) => ({ de: `${x.de} ist wichtig.`, es: `${x.es || x.de} es importante.` })),
                      fill: { prompt: `Completa: ___ ${de.split(/\s+/).slice(1).join(' ')} ist hier.`, answer: article, hint: 'Piensa en el género del sustantivo.' },
                      speak: { target: `${de} ist wichtig.` }
                  };
              };
              const mkConnectorLesson = (levelKey, idx) => {
                  const c = connectorByLevel[levelKey] || [];
                  const con = c[idx % c.length] || 'weil';
                  return {
                      id: `auto-conn-${levelKey.toLowerCase()}-${idx + 1}`,
                      title: `${levelKey} · Conectores ${idx + 1}`,
                      topic: 'conectores',
                      rewardCoins: 18 + idx,
                      rewardXp: 24 + idx * 2,
                      grammarTip: `Conector ${con}: practica posición verbal según tipo de oración.`,
                      phrases: [
                          { de: `Ich lerne Deutsch, ${con} ich in Deutschland arbeiten möchte.`, es: `Aprendo alemán, ${con === 'weil' ? 'porque' : 'usando conector'} quiero trabajar en Alemania.` },
                          { de: `${con.charAt(0).toUpperCase() + con.slice(1)} es regnet, bleibe ich zu Hause.`, es: 'Si/como llueve, me quedo en casa.' }
                      ],
                      fill: { prompt: `Completa con conector (${levelKey}): Ich lerne Deutsch, ___ ich reisen will.`, answer: con, hint: 'Usa el conector trabajado en esta lección.' },
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
              if (byLevel.A2.length || getArticleByLevel('A2').length) dynamic.push(mkMergedLevel('A2', 'Nivel A2 · Consolidación', 'A2', byLevel.A2));
              if (byLevel.B1.length || getArticleByLevel('B1').length) dynamic.push(mkMergedLevel('B1', 'Nivel B1 · Intermedio', 'B1', byLevel.B1));
              if (byLevel.B2.length || getArticleByLevel('B2').length) dynamic.push(mkMergedLevel('B2', 'Nivel B2 · Avanzado', 'B2', byLevel.B2));
              if (byLevel.C1.length || getArticleByLevel('C1').length) dynamic.push(mkMergedLevel('C1', 'Nivel C1 · Dominio', 'C1', byLevel.C1));
              const existingKeys = new Set([...baseEnriched, ...dynamic].map((lv) => normalizeRutaLevelKey((lv && lv.badge) || (lv && lv.title) || '')));
              const fallbackTitles = {
                  A0: { id: 'a0-ext', title: 'Nivel 0 · Fundamentos', badge: 'A0' },
                  A1: { id: 'a1-ext', title: 'Nivel A1 · Comunicación básica', badge: 'A1' },
                  A2: { id: 'a2-ext', title: 'Nivel A2 · Consolidación', badge: 'A2' },
                  B1: { id: 'b1-ext', title: 'Nivel B1 · Intermedio', badge: 'B1' },
                  B2: { id: 'b2-ext', title: 'Nivel B2 · Avanzado', badge: 'B2' },
                  C1: { id: 'c1-ext', title: 'Nivel C1 · Dominio', badge: 'C1' }
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
          const coinsUiLabel = isCreatorAccount ? '∞' : userStats.coins;
          const economyReasonText = (reason) => {
              const r = String(reason || '');
              if (r === 'already_claimed_today') return 'Ya has reclamado el bonus diario hoy.';
              if (r === 'daily_limit_reached') return 'Límite diario de anuncios alcanzado (6/6).';
              if (r === 'cooldown_15m') return 'Debes esperar 15 minutos entre anuncios.';
              if (r === 'invalid_reward_type') return 'Tipo de recompensa inválido.';
              if (r === 'creator_unlimited') return 'Cuenta creador: saldo ilimitado.';
              if (r === 'ok') return 'Operación completada.';
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
                  sub: `${b.tag} · ${b.lvl}`,
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
                          sub: 'Tu puntuación (se sube al jugar)',
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
                  setCloudSyncLabel('Local (sin sesión)');
                  return;
              }
              setCloudSyncState('syncing');
              setCloudSyncLabel('Supabase conectando⬦');
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
              setCloudSyncLabel('Sincronizando⬦');
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
              else { alert("No tienes suficientes Monedas (Coins). Completa ejercicios para ganar más."); }
          };

          const getLast7Days = () => {
              const days = [];
              const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
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

          const RUTA_SECTION_EXERCISES = 14;
          const RUTA_REVIEW_RATIO = 0.07;
          const RUTA_MIN_ACCURACY_TO_UNLOCK_NEXT_LEVEL = 0.7;
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

          const RUTA_MAX_EXERCISE_ATTEMPTS = 3;

          const rutaExerciseTypeByLevel = {
              A0: ['read', 'translate_de', 'fill', 'read', 'fill', 'speak', 'read', 'fill', 'translate_es', 'fill', 'speak', 'fill', 'podcast', 'audio_story'],
              A1: ['read', 'fill', 'order', 'translate_de', 'speak', 'read', 'fill', 'order', 'fill', 'speak', 'translate_es', 'read', 'podcast', 'audio_story'],
              A2: ['read', 'fill', 'speak', 'order', 'translate_de', 'speak', 'read', 'fill', 'speak', 'order', 'read', 'translate_es', 'podcast', 'audio_story'],
              B1: ['fill', 'speak', 'order', 'fill', 'translate_de', 'fill', 'read', 'speak', 'fill', 'order', 'read', 'translate_es', 'podcast', 'audio_story'],
              B2: ['fill', 'speak', 'connector', 'read', 'translate_de', 'fill', 'connector', 'fill', 'read', 'speak', 'fill', 'translate_es', 'podcast', 'audio_story'],
              C1: ['speak', 'connector', 'speak', 'fill', 'read', 'translate_de', 'fill', 'speak', 'fill', 'read', 'speak', 'translate_es', 'podcast', 'audio_story']
          };

          const shouldShowHintForLevel = (levelKey, idx) => {
              if (levelKey === 'A0' || levelKey === 'A1') return true;
              if (levelKey === 'A2') return idx % 2 === 0;
              if (levelKey === 'B1') return idx % 3 === 0;
              return false;
          };

          const rutaLexiconByLevel = {
              A0: {
                  connectors: ['und', 'aber', 'oder', 'denn'],
                  adverbs: ['heute', 'morgen', 'hier', 'dort'],
                  adjectives: ['gut', 'klein', 'groß', 'neu'],
                  verbs: ['sein', 'haben', 'heißen', 'kommen']
              },
              A1: {
                  connectors: ['weil', 'deshalb', 'und', 'aber'],
                  adverbs: ['heute', 'morgen', 'oft', 'gern'],
                  adjectives: ['wichtig', 'einfach', 'schnell', 'langsam'],
                  verbs: ['sein', 'haben', 'heißen', 'kommen', 'lernen', 'wohnen', 'arbeiten', 'spielen']
              },
              A2: {
                  connectors: ['weil', 'obwohl', 'deshalb', 'trotzdem'],
                  adverbs: ['gestern', 'immer', 'manchmal', 'bereits'],
                  adjectives: ['praktisch', 'nützlich', 'kompliziert', 'klar'],
                  verbs: ['gehen', 'fahren', 'lesen', 'schreiben', 'kaufen', 'treffen']
              },
              B1: {
                  connectors: ['obwohl', 'damit', 'außerdem', 'dennoch'],
                  adverbs: ['regelmäßig', 'kürzlich', 'zunächst', 'danach'],
                  adjectives: ['zuverlässig', 'flexibel', 'relevant', 'effektiv'],
                  verbs: ['verstehen', 'erklären', 'verbessern', 'weiterentwickeln']
              },
              B2: {
                  connectors: ['während', 'hingegen', 'insofern', 'folglich'],
                  adverbs: ['grundsätzlich', 'zunehmend', 'teilweise', 'vorwiegend'],
                  adjectives: ['nachhaltig', 'präzise', 'komplex', 'wesentlich'],
                  verbs: ['umsetzen', 'analysieren', 'berücksichtigen', 'differenzieren']
              },
              C1: {
                  connectors: ['nichtsdestotrotz', 'demzufolge', 'infolgedessen', 'hingegen'],
                  adverbs: ['überwiegend', 'folglich', 'durchaus', 'insbesondere'],
                  adjectives: ['differenziert', 'belastbar', 'kohärent', 'fundiert'],
                  verbs: ['behaupten', 'erläutern', 'einräumen', 'konkretisieren']
              }
          };

          const rutaStopWords = new Set(['ich', 'du', 'er', 'sie', 'wir', 'ihr', 'und', 'oder', 'aber', 'der', 'die', 'das', 'ein', 'eine', 'ist', 'sind', 'bin', 'im', 'in', 'zu', 'mit', 'von', 'am', 'an']);
          const PERSONS = ['ich', 'du', 'er_sie_es', 'wir', 'ihr', 'sie_Sie'];
          const PERSON_LABELS = { ich: 'ich', du: 'du', er_sie_es: 'er/sie/es', wir: 'wir', ihr: 'ihr', sie_Sie: 'sie/Sie' };
          const PERSON_LABELS_ES = { ich: 'yo', du: 'tú', er_sie_es: 'él o ella', wir: 'nosotros', ihr: 'vosotros', sie_Sie: 'ellos o usted' };

          const sanitizeRutaSpanishForUi = (rawEs, germanRefLine) => {
              let s = String(rawEs || '').trim();
              if (!s) return '';
              s = s.replace(/\s*\(persona:\s*[^)]+\)/gi, '');
              s = s.replace(/\s*\((?:ich|du|er|wir|ihr|sie|Sie|er\/sie\/es)\)/gi, '');
              s = s.replace(/\s*—\s*[A-Za-zÄÖÜäöüß].*$/g, '');
              s = s.replace(/\s+/g, ' ').trim();
              const de = String(germanRefLine || '').replace(/[.,!?;:()"']/g, ' ');
              if (de.length > 8) {
                  const deWords = new Set(de.split(/\s+/).filter((w) => w.length > 2).map((w) => w.toLowerCase()));
                  const tokens = (s.match(/\b[A-Za-zÄÖÜäöüß]+\b/g) || []).filter((w) => w.length > 2);
                  const overlap = tokens.filter((w) => deWords.has(w.toLowerCase())).length;
                  if (tokens.length >= 4 && overlap >= Math.min(tokens.length, 4)) return '';
              }
              return s;
          };

          const rutaSpanishMeaningLine = (srcPhrase, sourceSentence, srcFill) => {
              let raw = (srcPhrase && srcPhrase.es) || (srcFill && srcFill.promptEs) || '';
              raw = String(raw).trim();
              raw = raw.replace(/\s*\(persona:\s*ich\)/gi, ' (yo)');
              raw = raw.replace(/\s*\(persona:\s*du\)/gi, ' (tú)');
              raw = raw.replace(/\s*\(persona:\s*er\/sie\/es\)/gi, ' (él o ella)');
              raw = raw.replace(/\s*\(persona:\s*wir\)/gi, ' (nosotros)');
              raw = raw.replace(/\s*\(persona:\s*ihr\)/gi, ' (vosotros)');
              raw = raw.replace(/\s*\(persona:\s*sie\/Sie\)/gi, ' (ellos o usted)');
              raw = raw.replace(/\s*\(persona:\s*[^)]+\)/gi, '');
              const cleaned = sanitizeRutaSpanishForUi(raw, sourceSentence);
              if (cleaned) return cleaned;
              return 'Escribe la respuesta según el sentido de la frase en alemán (arriba). Evita mezclar palabras alemanas en la traducción si escribes en español.';
          };
          const chooseGapWord = (sentence) => {
              const words = String(sentence || '').replace(/[.,!?;:()"]/g, ' ').split(/\s+/).map((w) => w.trim()).filter(Boolean);
              const candidates = words.filter((w) => w.length >= 4 && !rutaStopWords.has(w.toLowerCase()));
              return (candidates[0] || words.find((w) => w.length >= 2) || '').trim();
          };
          const expandGermanAccept = (w) => {
              const s = String(w || '').trim();
              if (!s) return [];
              const low = s.toLowerCase();
              const out = new Set([s, low, low.charAt(0).toUpperCase() + low.slice(1)]);
              if (/ä|ö|ü|ß/.test(low)) {
                  out.add(low.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss'));
              }
              return [...out].filter(Boolean);
          };
          const buildGapHint = (sentence, answer) => {
              const a = String(answer || '').trim();
              const snip = String(sentence).replace(/_____/g, '…').replace(/\s+/g, ' ').trim().slice(0, 96);
              if (!a) return '';
              return `Pista alineada con el hueco: ${a.length} letras; encaja en el contexto: «${snip}».`;
          };
          const makeGapExercise = (sentence, meaningEs, hintBase, fromReview, id) => {
              const answer = chooseGapWord(sentence);
              if (!answer) return null;
              const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const prompt = sentence.replace(new RegExp(`\\b${escaped}\\b`), '_____');
              const contextual = buildGapHint(sentence, answer);
              const mergedHint = (hintBase && String(hintBase).trim().length > 8) ? `${String(hintBase).trim()} · ${contextual}` : contextual;
              return {
                  id,
                  type: 'fill',
                  prompt,
                  promptEs: String(meaningEs || '').trim(),
                  answer,
                  acceptedAnswers: expandGermanAccept(answer),
                  hint: mergedHint,
                  betterFormNote: `En contexto neutro lo más natural es: «${answer}».`,
                  fromReview: !!fromReview
              };
          };
          const personCycle = (idx) => PERSONS[idx % PERSONS.length];
          const conjugateFor = (verbEntry, person) => {
              if (!verbEntry || !verbEntry.forms || !verbEntry.forms.praesens) return null;
              return verbEntry.forms.praesens[person] || null;
          };
          const buildVerbSentence = (verbEntry, person, adverb) => {
              if (!verbEntry || !verbEntry.lemma) return null;
              const conj = conjugateFor(verbEntry, person);
              if (!conj) return null;
              const subj = person === 'ich' ? 'Ich' : person === 'du' ? 'du' : person === 'er_sie_es' ? 'er' : person === 'wir' ? 'Wir' : person === 'ihr' ? 'ihr' : 'Sie';
              const adv = adverb || '';
              const es = verbEntry.es || '';
              const fullDe = adv ? `${subj} ${conj} ${adv}.` : `${subj} ${conj}.`;
              const subjEsHint = PERSON_LABELS_ES[person] || '';
              const fullEs = es ? `${es}${subjEsHint ? ` (${subjEsHint})` : ''}` : (subjEsHint ? `Perspectiva gramatical: ${subjEsHint}.` : '');
              return { de: fullDe, es: fullEs, conj, person };
          };

          /* ── GENERADOR PROGRAMÁTICO DE CONJUGACIONES (RUTA) ── */
          /* Genera frases únicas para cada nivel usando patrones de conjugación */
          const RUTA_VERB_PATTERNS = {
               /* Verbos modales + auxiliares (irregulares) */
               modal: [
                   { inf: 'können', es: 'poder', pr: { i: 'kann', d: 'kannst', e: 'kann', w: 'können', i2: 'könnt', s: 'können' }, pt: { i: 'konnte', d: 'konntest', e: 'konnte', w: 'konnten', i2: 'konntet', s: 'konnten' }, pp: 'gekonnt' },
                   { inf: 'müssen', es: 'tener que', pr: { i: 'muss', d: 'musst', e: 'muss', w: 'müssen', i2: 'müsst', s: 'müssen' }, pt: { i: 'musste', d: 'musstest', e: 'musste', w: 'mussten', i2: 'musstet', s: 'mussten' }, pp: 'gemusst' },
                   { inf: 'dürfen', es: 'poder (permiso)', pr: { i: 'darf', d: 'darfst', e: 'darf', w: 'dürfen', i2: 'dürft', s: 'dürfen' }, pt: { i: 'durfte', d: 'durftest', e: 'durfte', w: 'durften', i2: 'durftet', s: 'durften' }, pp: 'gedurft' },
                   { inf: 'wollen', es: 'querer', pr: { i: 'will', d: 'willst', e: 'will', w: 'wollen', i2: 'wollt', s: 'wollen' }, pt: { i: 'wollte', d: 'wolltest', e: 'wollte', w: 'wollten', i2: 'wolltet', s: 'wollten' }, pp: 'gewollt' },
                   { inf: 'sollen', es: 'deber', pr: { i: 'soll', d: 'sollst', e: 'soll', w: 'sollen', i2: 'sollt', s: 'sollen' }, pt: { i: 'sollte', d: 'solltest', e: 'sollte', w: 'sollten', i2: 'solltet', s: 'sollten' }, pp: 'gesollt' },
                   { inf: 'mögen', es: 'gustar', pr: { i: 'mag', d: 'magst', e: 'mag', w: 'mögen', i2: 'mögt', s: 'mögen' }, pt: { i: 'mochte', d: 'mochtest', e: 'mochte', w: 'mochten', i2: 'mochtet', s: 'mochten' }, pp: 'gemocht' },
                   { inf: 'wissen', es: 'saber', pr: { i: 'weiß', d: 'weißt', e: 'weiß', w: 'wissen', i2: 'wisst', s: 'wissen' }, pt: { i: 'wusste', d: 'wusstest', e: 'wusste', w: 'wussten', i2: 'wusstet', s: 'wussten' }, pp: 'gewusst' },
                   { inf: 'brauchen', es: 'necesitar', pr: { i: 'brauche', d: 'brauchst', e: 'braucht', w: 'brauchen', i2: 'braucht', s: 'brauchen' }, pt: { i: 'brauchte', d: 'brauchtest', e: 'brauchte', w: 'brauchten', i2: 'brauchtet', s: 'brauchten' }, pp: 'gebraucht' },
                   { inf: 'werden', es: 'volverse/futuro', pr: { i: 'werde', d: 'wirst', e: 'wird', w: 'werden', i2: 'werdet', s: 'werden' }, pt: { i: 'wurde', d: 'wurdest', e: 'wurde', w: 'wurden', i2: 'wurdet', s: 'wurden' }, pp: 'geworden' },
                   { inf: 'lassen', es: 'dejar/permitir', pr: { i: 'lasse', d: 'lässt', e: 'lässt', w: 'lassen', i2: 'lasst', s: 'lassen' }, pt: { i: 'ließ', d: 'ließest', e: 'ließ', w: 'ließen', i2: 'ließt', s: 'ließen' }, pp: 'gelassen' },
                   { inf: 'heißen', es: 'llamarse', pr: { i: 'heiße', d: 'heißt', e: 'heißt', w: 'heißen', i2: 'heißt', s: 'heißen' }, pt: { i: 'hieß', d: 'hießest', e: 'hieß', w: 'hießen', i2: 'hießt', s: 'hießen' }, pp: 'geheißen' },
                   { inf: 'tun', es: 'hacer', pr: { i: 'tue', d: 'tust', e: 'tut', w: 'tun', i2: 'tut', s: 'tun' }, pt: { i: 'tat', d: 'tatest', e: 'tat', w: 'taten', i2: 'tatet', s: 'taten' }, pp: 'getan' }
               ],
              /* Verbos regulares con prefijos separables */
              trennbar: [
                  { inf: 'aufstehen', es: 'levantarse', stamm: 'steh', prEnd: 'e/st/t/en/t/en', pp: 'aufgestanden' },
                  { inf: 'einkaufen', es: 'comprar', stamm: 'kauf', prEnd: 'e/st/t/en/t/en', pp: 'eingekauft' },
                  { inf: 'mitkommen', es: 'acompañar', stamm: 'komm', prEnd: 'e/st/t/en/t/en', pp: 'mitgekommen' },
                  { inf: 'anfangen', es: 'empezar', stamm: 'fang', prEnd: 'e/st/t/en/t/en', pp: 'angefangen' },
                  { inf: 'ausgehen', es: 'salir', stamm: 'geh', prEnd: 'e/st/t/en/t/en', pp: 'ausgegangen' },
                  { inf: 'vorbereiten', es: 'preparar', stamm: 'bereit', prEnd: 'e/est/t/en/t/en', pp: 'vorbereitet' },
                  { inf: 'zuhören', es: 'escuchar', stamm: 'hör', prEnd: 'e/st/t/en/t/en', pp: 'zugehört' },
                  { inf: 'fernsehen', es: 'ver TV', stamm: 'seh', prEnd: 'e/st/t/en/t/en', pp: 'ferngesehen' },
                  { inf: 'stattfinden', es: 'tener lugar', stamm: 'find', prEnd: 'e/st/t/en/t/en', pp: 'stattgefunden' },
                  { inf: 'teilnehmen', es: 'participar', stamm: 'nehm', prEnd: 'e/st/t/en/t/en', pp: 'teilgenommen' },
                  { inf: 'abholen', es: 'recoger', stamm: 'hol', prEnd: 'e/st/t/en/t/en', pp: 'abgeholt' },
                  { inf: 'anrufen', es: 'llamar', stamm: 'ruf', prEnd: 'e/st/t/en/t/en', pp: 'angerufen' },
                  { inf: 'aufräumen', es: 'ordenar', stamm: 'räum', prEnd: 'e/st/t/en/t/en', pp: 'aufgeräumt' },
                  { inf: 'auspacken', es: 'desembalar', stamm: 'pack', prEnd: 'e/st/t/en/t/en', pp: 'ausgepackt' },
                  { inf: 'einladen', es: 'invitar', stamm: 'lad', prEnd: 'e/st/t/en/t/en', pp: 'eingeladen' },
                  { inf: 'mitbringen', es: 'traer', stamm: 'bring', prEnd: 'e/st/t/en/t/en', pp: 'mitgebracht' },
                  { inf: 'nachdenken', es: 'reflexionar', stamm: 'denk', prEnd: 'e/st/t/en/t/en', pp: 'nachgedacht' },
                  { inf: 'vorschlagen', es: 'proponer', stamm: 'schlag', prEnd: 'e/st/t/en/t/en', pp: 'vorgeschlagen' },
                  { inf: 'zumachen', es: 'cerrar', stamm: 'mach', prEnd: 'e/st/t/en/t/en', pp: 'zugemacht' },
                  { inf: 'zurückkommen', es: 'volver', stamm: 'komm', prEnd: 'e/st/t/en/t/en', pp: 'zurückgekommen' }
              ],
              /* Verbos con preposición fija */
              prep: [
                  { inf: 'denken an', es: 'pensar en', pr: { i: 'denke', d: 'denkst', e: 'denkt', w: 'denken', i2: 'denkt', s: 'denken' }, pp: 'gedacht' },
                  { inf: 'warten auf', es: 'esperar', pr: { i: 'warte', d: 'wartest', e: 'wartet', w: 'warten', i2: 'wartet', s: 'warten' }, pp: 'gewartet' },
                  { inf: 'sich freuen auf', es: 'alegrarse por', pr: { i: 'freue', d: 'freust', e: 'freut', w: 'freuen', i2: 'freut', s: 'freuen' }, pp: 'gefreut' },
                  { inf: 'sich kümmern um', es: 'ocuparse de', pr: { i: 'kümmere', d: 'kümmerst', e: 'kümmert', w: 'kümmern', i2: 'kümmert', s: 'kümmern' }, pp: 'gekümmert' },
                  { inf: 'sich interessieren für', es: 'interesarse por', pr: { i: 'interessiere', d: 'interessierst', e: 'interessiert', w: 'interessieren', i2: 'interessiert', s: 'interessieren' }, pp: 'interessiert' },
                  { inf: 'glauben an', es: 'creer en', pr: { i: 'glaube', d: 'glaubst', e: 'glaubt', w: 'glauben', i2: 'glaubt', s: 'glauben' }, pp: 'geglaubt' },
                  { inf: 'sich erinnern an', es: 'recordar', pr: { i: 'erinnere', d: 'erinnerst', e: 'erinnert', w: 'erinnern', i2: 'erinnert', s: 'erinnern' }, pp: 'erinnert' },
                  { inf: 'bestehen auf', es: 'insistir en', pr: { i: 'bestehe', d: 'bestehst', e: 'besteht', w: 'bestehen', i2: 'besteht', s: 'bestehen' }, pp: 'bestanden' },
                  { inf: 'sich gewöhnen an', es: 'acostumbrarse a', pr: { i: 'gewöhne', d: 'gewöhnst', e: 'gewöhnt', w: 'gewöhnen', i2: 'gewöhnt', s: 'gewöhnen' }, pp: 'gewöhnt' },
                  { inf: 'leiden unter', es: 'sufrir por', pr: { i: 'leide', d: 'leidest', e: 'leidet', w: 'leiden', i2: 'leidet', s: 'leiden' }, pp: 'gelitten' },
                  { inf: 'sich beschweren über', es: 'quejarse de', pr: { i: 'beschwere', d: 'beschwerst', e: 'beschwert', w: 'beschweren', i2: 'beschwert', s: 'beschweren' }, pp: 'beschwert' },
                  { inf: 'sich entscheiden für', es: 'decidirse por', pr: { i: 'entscheide', d: 'entscheidest', e: 'entscheidet', w: 'entscheiden', i2: 'entscheidet', s: 'entscheiden' }, pp: 'entschieden' },
                  { inf: 'sich verabschieden von', es: 'despedirse de', pr: { i: 'verabschiede', d: 'verabschiedest', e: 'verabschiedet', w: 'verabschieden', i2: 'verabschiedet', s: 'verabschieden' }, pp: 'verabschiedet' },
                  { inf: 'sich konzentrieren auf', es: 'concentrarse en', pr: { i: 'konzentriere', d: 'konzentrierst', e: 'konzentriert', w: 'konzentrieren', i2: 'konzentriert', s: 'konzentrieren' }, pp: 'konzentriert' },
                  { inf: 'sich vorbereiten auf', es: 'prepararse para', pr: { i: 'bereite vor', d: 'bereitest vor', e: 'bereitet vor', w: 'bereiten vor', i2: 'bereitet vor', s: 'bereiten vor' }, pp: 'vorbereitet' },
                  { inf: 'abhängen von', es: 'depender de', pr: { i: 'hänge ab', d: 'hängst ab', e: 'hängt ab', w: 'hängen ab', i2: 'hängt ab', s: 'hängen ab' }, pp: 'abgehangen' },
                  { inf: 'sich sehnen nach', es: 'anhelar', pr: { i: 'sehne', d: 'sehnst', e: 'sehnt', w: 'sehnen', i2: 'sehnt', s: 'sehnen' }, pp: 'gesehnt' },
                  { inf: 'sich fürchten vor', es: 'temer a', pr: { i: 'fürchte', d: 'fürchtest', e: 'fürchtet', w: 'fürchten', i2: 'fürchtet', s: 'fürchten' }, pp: 'gefürchtet' }
              ],
              /* Verbos irregulares con cambio vocálico */
              stark: [
                  { inf: 'sprechen', es: 'hablar', pr: { i: 'spreche', d: 'sprichst', e: 'spricht', w: 'sprechen', i2: 'sprecht', s: 'sprechen' }, pt: { i: 'sprach', d: 'sprachst', e: 'sprach', w: 'sprachen', i2: 'spracht', s: 'sprachen' }, pp: 'gesprochen' },
                  { inf: 'sehen', es: 'ver', pr: { i: 'sehe', d: 'siehst', e: 'sieht', w: 'sehen', i2: 'seht', s: 'sehen' }, pt: { i: 'sah', d: 'sahst', e: 'sah', w: 'sahen', i2: 'saht', s: 'sahen' }, pp: 'gesehen' },
                  { inf: 'essen', es: 'comer', pr: { i: 'esse', d: 'isst', e: 'isst', w: 'essen', i2: 'esst', s: 'essen' }, pt: { i: 'aß', d: 'aßest', e: 'aß', w: 'aßen', i2: 'aßt', s: 'aßen' }, pp: 'gegessen' },
                  { inf: 'geben', es: 'dar', pr: { i: 'gebe', d: 'gibst', e: 'gibt', w: 'geben', i2: 'gebt', s: 'geben' }, pt: { i: 'gab', d: 'gabst', e: 'gab', w: 'gaben', i2: 'gabt', s: 'gaben' }, pp: 'gegeben' },
                  { inf: 'nehmen', es: 'tomar', pr: { i: 'nehme', d: 'nimmst', e: 'nimmt', w: 'nehmen', i2: 'nehmt', s: 'nehmen' }, pt: { i: 'nahm', d: 'nahmst', e: 'nahm', w: 'nahmen', i2: 'nahmt', s: 'nahmen' }, pp: 'genommen' },
                  { inf: 'fahren', es: 'conducir', pr: { i: 'fahre', d: 'fährst', e: 'fährt', w: 'fahren', i2: 'fahrt', s: 'fahren' }, pt: { i: 'fuhr', d: 'fuhrst', e: 'fuhr', w: 'fuhren', i2: 'fuhrt', s: 'fuhren' }, pp: 'gefahren' },
                  { inf: 'schlafen', es: 'dormir', pr: { i: 'schlafe', d: 'schläfst', e: 'schläft', w: 'schlafen', i2: 'schlaft', s: 'schlafen' }, pt: { i: 'schlief', d: 'schliefst', e: 'schlief', w: 'schliefen', i2: 'schlieft', s: 'schliefen' }, pp: 'geschlafen' },
                  { inf: 'laufen', es: 'correr', pr: { i: 'laufe', d: 'läufst', e: 'läuft', w: 'laufen', i2: 'lauft', s: 'laufen' }, pt: { i: 'lief', d: 'liefst', e: 'lief', w: 'liefen', i2: 'lieft', s: 'liefen' }, pp: 'gelaufen' },
                  { inf: 'lesen', es: 'leer', pr: { i: 'lese', d: 'liest', e: 'liest', w: 'lesen', i2: 'lest', s: 'lesen' }, pt: { i: 'las', d: 'lasest', e: 'las', w: 'lasen', i2: 'last', s: 'lasen' }, pp: 'gelesen' },
                  { inf: 'schreiben', es: 'escribir', pr: { i: 'schreibe', d: 'schreibst', e: 'schreibt', w: 'schreiben', i2: 'schreibt', s: 'schreiben' }, pt: { i: 'schrieb', d: 'schriebst', e: 'schrieb', w: 'schrieben', i2: 'schriebt', s: 'schrieben' }, pp: 'geschrieben' },
                  { inf: 'finden', es: 'encontrar', pr: { i: 'finde', d: 'findest', e: 'findet', w: 'finden', i2: 'findet', s: 'finden' }, pt: { i: 'fand', d: 'fandest', e: 'fand', w: 'fanden', i2: 'fandet', s: 'fanden' }, pp: 'gefunden' },
                  { inf: 'helfen', es: 'ayudar', pr: { i: 'helfe', d: 'hilfst', e: 'hilft', w: 'helfen', i2: 'helft', s: 'helfen' }, pt: { i: 'half', d: 'halfst', e: 'half', w: 'halfen', i2: 'halft', s: 'halfen' }, pp: 'geholfen' },
                  { inf: 'treffen', es: 'quedar', pr: { i: 'treffe', d: 'triffst', e: 'trifft', w: 'treffen', i2: 'trefft', s: 'treffen' }, pt: { i: 'traf', d: 'trafst', e: 'traf', w: 'trafen', i2: 'traft', s: 'trafen' }, pp: 'getroffen' },
                  { inf: 'tragen', es: 'llevar', pr: { i: 'trage', d: 'trägst', e: 'trägt', w: 'tragen', i2: 'tragt', s: 'tragen' }, pt: { i: 'trug', d: 'trugst', e: 'trug', w: 'trugen', i2: 'trugt', s: 'trugen' }, pp: 'getragen' },
                  { inf: 'halten', es: 'sostener', pr: { i: 'halte', d: 'hältst', e: 'hält', w: 'halten', i2: 'haltet', s: 'halten' }, pt: { i: 'hielt', d: 'hieltest', e: 'hielt', w: 'hielten', i2: 'hieltet', s: 'hielten' }, pp: 'gehalten' },
                  { inf: 'kommen', es: 'venir', pr: { i: 'komme', d: 'kommst', e: 'kommt', w: 'kommen', i2: 'kommt', s: 'kommen' }, pt: { i: 'kam', d: 'kamst', e: 'kam', w: 'kamen', i2: 'kamt', s: 'kamen' }, pp: 'gekommen' },
                  { inf: 'gehen', es: 'ir', pr: { i: 'gehe', d: 'gehst', e: 'geht', w: 'gehen', i2: 'geht', s: 'gehen' }, pt: { i: 'ging', d: 'gingst', e: 'ging', w: 'gingen', i2: 'gingt', s: 'gingen' }, pp: 'gegangen' },
                  { inf: 'bleiben', es: 'quedarse', pr: { i: 'bleibe', d: 'bleibst', e: 'bleibt', w: 'bleiben', i2: 'bleibt', s: 'bleiben' }, pt: { i: 'blieb', d: 'bliebst', e: 'blieb', w: 'blieben', i2: 'bliebt', s: 'blieben' }, pp: 'geblieben' },
                  { inf: 'heißen', es: 'llamarse', pr: { i: 'heiße', d: 'heißt', e: 'heißt', w: 'heißen', i2: 'heißt', s: 'heißen' }, pt: { i: 'hieß', d: 'hießest', e: 'hieß', w: 'hießen', i2: 'hießt', s: 'hießen' }, pp: 'geheißen' },
                  { inf: 'singen', es: 'cantar', pr: { i: 'singe', d: 'singst', e: 'singt', w: 'singen', i2: 'singt', s: 'singen' }, pt: { i: 'sang', d: 'sangst', e: 'sang', w: 'sangen', i2: 'sangt', s: 'sangen' }, pp: 'gesungen' },
                  { inf: 'trinken', es: 'beber', pr: { i: 'trinke', d: 'trinkst', e: 'trinkt', w: 'trinken', i2: 'trinkt', s: 'trinken' }, pt: { i: 'trank', d: 'trankst', e: 'trank', w: 'tranken', i2: 'trankt', s: 'tranken' }, pp: 'getrunken' },
                  { inf: 'schwimmen', es: 'nadar', pr: { i: 'schwimme', d: 'schwimmst', e: 'schwimmt', w: 'schwimmen', i2: 'schwimmt', s: 'schwimmen' }, pt: { i: 'schwamm', d: 'schwammst', e: 'schwamm', w: 'schwammen', i2: 'schwammt', s: 'schwammen' }, pp: 'geschwommen' },
                  { inf: 'fliegen', es: 'volar', pr: { i: 'fliege', d: 'fliegst', e: 'fliegt', w: 'fliegen', i2: 'fliegt', s: 'fliegen' }, pt: { i: 'flog', d: 'flogst', e: 'flog', w: 'flogen', i2: 'flogt', s: 'flogen' }, pp: 'geflogen' },
                  { inf: 'ziehen', es: 'tirar/mudarse', pr: { i: 'ziehe', d: 'ziehst', e: 'zieht', w: 'ziehen', i2: 'zieht', s: 'ziehen' }, pt: { i: 'zog', d: 'zogst', e: 'zog', w: 'zogen', i2: 'zogt', s: 'zogen' }, pp: 'gezogen' },
                  { inf: 'liegen', es: 'estar tumbado', pr: { i: 'liege', d: 'liegst', e: 'liegt', w: 'liegen', i2: 'liegt', s: 'liegen' }, pt: { i: 'lag', d: 'lagst', e: 'lag', w: 'lagen', i2: 'lagt', s: 'lagen' }, pp: 'gelegen' },
                  { inf: 'sitzen', es: 'estar sentado', pr: { i: 'sitze', d: 'sitzt', e: 'sitzt', w: 'sitzen', i2: 'sitzt', s: 'sitzen' }, pt: { i: 'saß', d: 'saßest', e: 'saß', w: 'saßen', i2: 'saßt', s: 'saßen' }, pp: 'gesessen' },
                  { inf: 'stehen', es: 'estar de pie', pr: { i: 'stehe', d: 'stehst', e: 'steht', w: 'stehen', i2: 'steht', s: 'stehen' }, pt: { i: 'stand', d: 'standst', e: 'stand', w: 'standen', i2: 'standet', s: 'standen' }, pp: 'gestanden' },
                  { inf: 'vergessen', es: 'olvidar', pr: { i: 'vergesse', d: 'vergisst', e: 'vergisst', w: 'vergessen', i2: 'vergesst', s: 'vergessen' }, pt: { i: 'vergaß', d: 'vergaßest', e: 'vergaß', w: 'vergaßen', i2: 'vergaßt', s: 'vergaßen' }, pp: 'vergessen' },
                  { inf: 'gewinnen', es: 'ganar', pr: { i: 'gewinne', d: 'gewinnst', e: 'gewinnt', w: 'gewinnen', i2: 'gewinnt', s: 'gewinnen' }, pt: { i: 'gewann', d: 'gewannst', e: 'gewann', w: 'gewannen', i2: 'gewannnt', s: 'gewannen' }, pp: 'gewonnen' },
                  { inf: 'bitten', es: 'rogar/pedir', pr: { i: 'bitte', d: 'bittest', e: 'bittet', w: 'bitten', i2: 'bittet', s: 'bitten' }, pt: { i: 'bat', d: 'batest', e: 'bat', w: 'baten', i2: 'batet', s: 'baten' }, pp: 'gebeten' },
                  { inf: 'raten', es: 'aconsejar', pr: { i: 'rate', d: 'rätst', e: 'rät', w: 'raten', i2: 'ratet', s: 'raten' }, pt: { i: 'riet', d: 'rietst', e: 'riet', w: 'rieten', i2: 'rietet', s: 'rieten' }, pp: 'geraten' },
                  { inf: 'werfen', es: 'lanzar', pr: { i: 'werfe', d: 'wirfst', e: 'wirft', w: 'werfen', i2: 'werft', s: 'werfen' }, pt: { i: 'warf', d: 'warfst', e: 'warf', w: 'warfen', i2: 'warft', s: 'warfen' }, pp: 'geworfen' },
                  { inf: 'sterben', es: 'morir', pr: { i: 'sterbe', d: 'stirbst', e: 'stirbt', w: 'sterben', i2: 'sterbt', s: 'sterben' }, pt: { i: 'starb', d: 'starbst', e: 'starb', w: 'starben', i2: 'starbt', s: 'starben' }, pp: 'gestorben' },
                  { inf: 'wachsen', es: 'crecer', pr: { i: 'wachse', d: 'wächst', e: 'wächst', w: 'wachsen', i2: 'wachst', s: 'wachsen' }, pt: { i: 'wuchs', d: 'wuchsest', e: 'wuchs', w: 'wuchsen', i2: 'wuchst', s: 'wuchsen' }, pp: 'gewachsen' }
              ],
              /* Verbos regulares comunes */
              regular: [
                  { inf: 'lernen', es: 'aprender', stamm: 'lern' }, { inf: 'arbeiten', es: 'trabajar', stamm: 'arbeit' },
                  { inf: 'spielen', es: 'jugar', stamm: 'spiel' }, { inf: 'wohnen', es: 'vivir', stamm: 'wohn' },
                  { inf: 'kochen', es: 'cocinar', stamm: 'koch' }, { inf: 'reisen', es: 'viajar', stamm: 'reis' },
                  { inf: 'tanzen', es: 'bailar', stamm: 'tanz' }, { inf: 'malen', es: 'pintar', stamm: 'mal' },
                  { inf: 'bauen', es: 'construir', stamm: 'bau' }, { inf: 'putzen', es: 'limpiar', stamm: 'putz' },
                  { inf: 'hören', es: 'oír', stamm: 'hör' }, { inf: 'sagen', es: 'decir', stamm: 'sag' },
                  { inf: 'machen', es: 'hacer', stamm: 'mach' }, { inf: 'kaufen', es: 'comprar', stamm: 'kauf' },
                  { inf: 'brauchen', es: 'necesitar', stamm: 'brauch' }, { inf: 'zeigen', es: 'mostrar', stamm: 'zeig' },
                  { inf: 'fragen', es: 'preguntar', stamm: 'frag' }, { inf: 'antworten', es: 'responder', stamm: 'antwort' },
                  { inf: 'wünschen', es: 'desear', stamm: 'wünsch' }, { inf: 'feiern', es: 'celebrar', stamm: 'feier' },
                  { inf: 'lachen', es: 'reír', stamm: 'lach' }, { inf: 'weinen', es: 'llorar', stamm: 'wein' },
                  { inf: 'öffnen', es: 'abrir', stamm: 'öffn' }, { inf: 'schließen', es: 'cerrar', stamm: 'schließ' },
                  { inf: 'klingeln', es: 'sonar', stamm: 'klingel' }, { inf: 'lächeln', es: 'sonreír', stamm: 'lächel' },
                  { inf: 'atmen', es: 'respirar', stamm: 'atm' }, { inf: 'zeichnen', es: 'dibujar', stamm: 'zeichn' },
                  { inf: 'rechnen', es: 'calcular', stamm: 'rechn' }, { inf: 'bedeuten', es: 'significar', stamm: 'bedeut' },
                  { inf: 'handeln', es: 'actuar/comerciar', stamm: 'handel' }, { inf: 'zweifeln', es: 'dudar', stamm: 'zweifel' },
                  { inf: 'wandern', es: 'senderismo', stamm: 'wander' }, { inf: 'retten', es: 'salvar', stamm: 'rett' },
                  { inf: 'setzen', es: 'colocar', stamm: 'setz' }, { inf: 'stellen', es: 'poner de pie', stamm: 'stell' },
                  { inf: 'legen', es: 'poner tumbado', stamm: 'leg' }, { inf: 'füllen', es: 'llenar', stamm: 'füll' },
                  { inf: 'wechseln', es: 'cambiar', stamm: 'wechsel' }, { inf: 'mieten', es: 'alquilar', stamm: 'miet' },
                  { inf: 'verdienen', es: 'ganar dinero', stamm: 'verdien' }, { inf: 'erzählen', es: 'contar/narrar', stamm: 'erzähl' },
                  { inf: 'erklären', es: 'explicar', stamm: 'erklär' }, { inf: 'bestellen', es: 'pedir', stamm: 'bestell' },
                  { inf: 'bezahlen', es: 'pagar', stamm: 'bezahl' }, { inf: 'glauben', es: 'creer', stamm: 'glaub' },
                  { inf: 'probieren', es: 'probar', stamm: 'probier' }, { inf: 'studieren', es: 'estudiar uni', stamm: 'studier' },
                  { inf: 'passieren', es: 'suceder', stamm: 'passier' }, { inf: 'diskutieren', es: 'discutir', stamm: 'diskutier' },
                  { inf: 'trainieren', es: 'entrenar', stamm: 'trainier' }, { inf: 'reparieren', es: 'reparar', stamm: 'reparier' },
                  { inf: 'telefonieren', es: 'telefonear', stamm: 'telefonier' }, { inf: 'fotografieren', es: 'fotografiar', stamm: 'fotografier' }
              ]
          };
          /* Conjuga un verbo regular dado su raíz y persona */
          const conjugateRegular = (stamm, person) => {
              if (person === 'ich') return stamm + 'e';
              if (person === 'du') return stamm + (stamm.endsWith('t') ? 'est' : 'st');
              if (person === 'er_sie_es') return stamm + (stamm.endsWith('t') ? 'et' : 't');
              if (person === 'wir') return stamm + 'en';
              if (person === 'ihr') return stamm + (stamm.endsWith('t') ? 'et' : 't');
              return stamm + 'en';
          };
          /* Conjuga un verbo separable (prefijo + verbo) */
          const conjugateTrennbar = (inf, stamm, person) => {
              const [prefix, ...rest] = inf.split(/(?<=^[a-zäöü]+)(?=[A-Z])/);
              const verbPart = rest.join('') || stamm;
              const conj = conjugateRegular(verbPart, person);
              return prefix ? `${conj} ${prefix}` : conj;
          };
          /* Genera una frase única a partir de un verbo y contexto */
          const generateUniqueVerbPhrase = (verb, person, tense, adverb, nounPhrase) => {
              const persons = ['ich', 'du', 'er_sie_es', 'wir', 'ihr', 'sie_Sie'];
              const p = person || persons[Math.floor(Math.random() * persons.length)];
              const subj = p === 'ich' ? 'Ich' : p === 'du' ? 'Du' : p === 'er_sie_es' ? 'Er' : p === 'wir' ? 'Wir' : p === 'ihr' ? 'Ihr' : 'Sie';
              const adv = adverb || '';
              const noun = nounPhrase || '';
              let conj = '';
              let es = verb.es || '';
              const t = tense || 'praesens';
              /* Determinar conjugación según tiempo verbal */
              if (t === 'praeteritum' && verb.pt) {
                  conj = verb.pt[p] || verb.pt.i || '';
                  es = es ? `${es} (Präteritum)` : '(Präteritum)';
              } else if (t === 'perfekt' && verb.pp) {
                  /* Perfekt: auxiliar haben/sein + Partizip II al final */
                  const auxVerb = (verb.inf && (verb.inf === 'gehen' || verb.inf === 'kommen' || verb.inf === 'fahren' || verb.inf === 'laufen' || verb.inf === 'fliegen' || verb.inf === 'schwimmen' || verb.inf === 'bleiben' || verb.inf === 'sterben' || verb.inf === 'wachsen' || verb.inf === 'reisen' || verb.inf === 'wandern')) ? 'sein' : 'haben';
                  const auxConj = auxVerb === 'sein'
                      ? { i: 'bin', d: 'bist', e: 'ist', w: 'sind', i2: 'seid', s: 'sind' }[p] || 'ist'
                      : { i: 'habe', d: 'hast', e: 'hat', w: 'haben', i2: 'habt', s: 'haben' }[p] || 'hat';
                  const pp = verb.pp;
                  if (verb.inf && verb.inf.match(/^(auf|ein|mit|an|aus|vor|zu|fern|statt|teil)/)) {
                      /* Trennbar: prefijo + ge + stamm + t/en */
                      const prefix = verb.inf.match(/^(auf|ein|mit|an|aus|vor|zu|fern|statt|teil)/)[0];
                      const stamm = verb.stamm || verb.inf.replace(/^(auf|ein|mit|an|aus|vor|zu|fern|statt|teil)/, '');
                      const ppForm = prefix + 'ge' + stamm + (stamm.endsWith('t') ? 'et' : 't');
                      conj = `${auxConj} ${ppForm}`;
                  } else {
                      conj = `${auxConj} ${pp}`;
                  }
                  es = es ? `${es} (Perfekt)` : '(Perfekt)';
              } else {
                  /* Präsens (default) */
                  if (verb.pr) {
                      conj = verb.pr[p] || verb.pr.i || '';
                  } else if (verb.stamm) {
                      conj = conjugateRegular(verb.stamm, p);
                  }
              }
              if (!conj) return null;
              let de = '';
              if (verb.inf && verb.inf.includes(' ')) {
                  /* Verbo con preposición fija: "denken an" */
                  const [v, prep] = verb.inf.split(' ');
                  if (t === 'perfekt' && verb.pp) {
                      de = adv ? `${subj} ${conj} ${adv} ${prep} ${noun}.` : `${subj} ${conj} ${prep} ${noun}.`;
                  } else {
                      de = adv ? `${subj} ${conj} ${adv} ${prep} ${noun}.` : `${subj} ${conj} ${prep} ${noun}.`;
                  }
              } else if (verb.inf && verb.inf.match(/^(auf|ein|mit|an|aus|vor|zu|fern|statt|teil)/)) {
                  /* Verbo separable */
                  if (t === 'perfekt') {
                      /* Ya conjugado como aux + pp, el prefijo ya está incluido */
                      de = adv ? `${subj} ${conj} ${adv} ${noun}.` : `${subj} ${conj} ${noun}.`;
                  } else {
                      const conjSep = conjugateTrennbar(verb.inf, verb.stamm || verb.inf.replace(/^(auf|ein|mit|an|aus|vor|zu|fern|statt|teil)/, ''), p);
                      de = adv ? `${subj} ${conjSep} ${adv} ${noun}.` : `${subj} ${conjSep} ${noun}.`;
                  }
              } else {
                  de = adv ? `${subj} ${conj} ${adv} ${noun}.` : `${subj} ${conj} ${noun}.`;
              }
              de = de.replace(/\s+/g, ' ').trim();
              const personEs = { ich: 'yo', du: 'tú', er_sie_es: 'él/ella', wir: 'nosotros', ihr: 'vosotros', sie_Sie: 'ellos/Ud.' }[p] || p;
              const fullEs = es ? `${es} (${personEs})` : `(forma verbal: ${personEs})`;
              return { de, es: fullEs, conj, person: p, verb: verb.inf || '' };
          };
          /* Banco de adverbios y complementos por nivel */
          const RUTA_ADVERB_BANK = {
              A0: ['heute', 'jetzt', 'hier', 'dort', 'auch', 'sehr', 'schon', 'gleich', 'noch', 'nicht', 'gern', 'vielleicht', 'da', 'weg', 'fast', 'bitte', 'schön', 'links', 'rechts', 'oben', 'unten', 'innen', 'außen', 'vorn', 'hinten', 'mitten', 'nebenan', 'drinnen', 'draußen', 'vorbei', 'her', 'hin', 'alle', 'gern', 'nie'],
              A1: ['heute', 'jetzt', 'hier', 'dort', 'auch', 'sehr', 'oft', 'manchmal', 'immer', 'gern', 'viel', 'schon', 'gleich', 'noch', 'nicht', 'vielleicht', 'da', 'weg', 'fast', 'zusammen', 'allein', 'lange', 'früh', 'spät', 'richtig', 'schon', 'noch', 'nie', 'immer', 'oft', 'manchmal', 'selten', 'täglich', 'abends', 'morgens', 'nachts'],
              A2: ['heute', 'oft', 'manchmal', 'immer', 'gern', 'viel', 'schon', 'gestern', 'morgen', 'bald', 'endlich', 'regelmäßig', 'täglich', 'selten', 'früh', 'spät', 'lange', 'zusammen', 'allein', 'richtig', 'wirklich', 'einfach', 'schnell', 'langsam', 'leider', 'hoffentlich', 'natürlich', 'wahrscheinlich', 'plötzlich', 'deshalb', 'deswegen', 'trotzdem', 'allerdings', 'außerdem', 'jedenfalls'],
              B1: ['gestern', 'morgen', 'bald', 'endlich', 'regelmäßig', 'täglich', 'selten', 'vorher', 'nachher', 'deshalb', 'trotzdem', 'allerdings', 'außerdem', 'jedenfalls', 'wirklich', 'einfach', 'schnell', 'langsam', 'leider', 'hoffentlich', 'natürlich', 'wahrscheinlich', 'plötzlich', 'deswegen', 'trotz', 'ungefähr', 'mindestens', 'höchstens', 'kaum', 'bereits', 'inzwischen', 'mittlerweile', 'anschließend', 'zunächst', 'schließlich'],
              B2: ['vorher', 'nachher', 'deshalb', 'trotzdem', 'allerdings', 'außerdem', 'jedenfalls', 'inzwischen', 'mittlerweile', 'keinesfalls', 'dementsprechend', 'folglich', 'deswegen', 'ungefähr', 'mindestens', 'höchstens', 'kaum', 'bereits', 'anschließend', 'zunächst', 'schließlich', 'jeweils', 'insgesamt', 'gegebenenfalls', 'möglicherweise', 'zweifellos', 'demgegenüber', 'demnach', 'infolgedessen', 'unterdessen', 'nichtsdestotrotz', 'insofern', 'demzufolge'],
              C1: ['inzwischen', 'mittlerweile', 'keinesfalls', 'dementsprechend', 'folglich', 'nichtsdestotrotz', 'insofern', 'demzufolge', 'wohingegen', 'gleichermaßen', 'anschließend', 'zunächst', 'schließlich', 'jeweils', 'insgesamt', 'gegebenenfalls', 'möglicherweise', 'zweifellos', 'demgegenüber', 'demnach', 'infolgedessen', 'unterdessen', 'nichtsdestoweniger', 'infolge', 'demgemäß', 'dahingehend', 'diesbezüglich', 'instande', 'keineswegs', 'ohnedies', 'infolgedessen', 'demgemäß', 'dahingehend', 'diesbezüglich']
          };
          /* Banco de sustantivos/complementos por nivel (Nominativ, Akkusativ, Dativ, Genitiv) */
          const RUTA_NOUN_BANK = {
              A0: ['das Buch', 'der Stift', 'die Tasche', 'das Heft', 'der Tisch', 'die Lampe', 'der Ball', 'die Blume', 'das Brot', 'der Hund', 'die Katze', 'das Haus', 'der Baum', 'die Sonne', 'das Kind', 'der Freund', 'die Mutter', 'der Vater', 'das Spiel', 'die Tür', 'der Apfel', 'die Milch', 'das Wasser', 'der Teller', 'die Gabel', 'das Messer', 'der Löffel', 'die Tasse', 'das Glas', 'der Stuhl'],
              A1: ['einen Kaffee', 'das Wasser', 'den Hund', 'die Musik', 'das Haus', 'die Arbeit', 'die Schule', 'den Film', 'den Freund', 'die Familie', 'das Auto', 'den Bus', 'die Stadt', 'das Geld', 'den Tisch', 'die Wohnung', 'das Zimmer', 'den Park', 'die Straße', 'den Lehrer', 'die Lehrerin', 'das Essen', 'den Computer', 'die Tasche', 'das Handy', 'den Bahnhof', 'die Post', 'das Kino', 'den Markt', 'die Kirche'],
              A2: ['den Zug', 'die Fahrkarte', 'das Formular', 'die Wohnung', 'den Termin', 'die Rechnung', 'den Urlaub', 'die Prüfung', 'den Arzt', 'die Apotheke', 'das Krankenhaus', 'den Flughafen', 'die Verspätung', 'das Ticket', 'den Koffer', 'die Reise', 'das Hotel', 'den Pass', 'die Adresse', 'den Brief', 'die Firma', 'das Büro', 'den Kollegen', 'die Besprechung', 'das Meeting', 'den Vertrag', 'die Unterschrift', 'das Dokument', 'den Antrag', 'die Bestätigung'],
              B1: ['das Projekt', 'die Entscheidung', 'den Vertrag', 'die Bewerbung', 'das Meeting', 'die Erfahrung', 'den Fortschritt', 'die Lösung', 'den Vorschlag', 'die Diskussion', 'das Ergebnis', 'den Bericht', 'die Präsentation', 'das Seminar', 'den Kurs', 'die Prüfungsangst', 'das Studium', 'den Abschluss', 'die Karriere', 'den Job', 'die Fähigkeit', 'das Vorstellungsgespräch', 'den Lebenslauf', 'die Qualifikation', 'das Zeugnis', 'den Nachweis', 'die Ausbildung', 'das Praktikum', 'den Arbeitgeber', 'die Selbstständigkeit'],
              B2: ['die Maßnahme', 'den Bericht', 'die Analyse', 'die Strategie', 'die Entwicklung', 'die Verhandlung', 'die Zusammenarbeit', 'den Prozess', 'die Optimierung', 'das Konzept', 'den Entwurf', 'die Umsetzung', 'das Verfahren', 'den Standard', 'die Richtlinie', 'das Protokoll', 'den Beschluss', 'die Evaluation', 'das Audit', 'den Qualitätsnachweis', 'die Dokumentation', 'den Workflow', 'die Schnittstelle', 'das Modul', 'den Algorithmus', 'die Datenbank', 'das Framework', 'den Quellcode', 'die Architektur', 'die Spezifikation'],
              C1: ['die Reform', 'die These', 'die Argumentation', 'die Differenzierung', 'die Evaluation', 'die Implementierung', 'die Korrelation', 'die Spezifikation', 'die Abstraktion', 'den Diskurs', 'die Synthese', 'das Paradigma', 'den Konsens', 'die Divergenz', 'das Theorem', 'den Präzedenzfall', 'die Konklusion', 'das Postulat', 'den Widerspruch', 'die Kohärenz', 'die Validität', 'den Indikator', 'die Relevanz', 'das Kriterium', 'den Kontext', 'die Perspektive', 'das Phänomen', 'den Mechanismus', 'die Komplexität', 'die Ambivalenz']
          };
          /* Genera N frases únicas para un nivel dado, alternando tiempos verbales */
          const generateUniquePhrasesForLevel = (levelKey, count, usedSet) => {
              const phrases = [];
              const lk = levelKey === 'A0' ? 'A0' : levelKey === 'A1' ? 'A1' : levelKey === 'A2' ? 'A2' : levelKey === 'B1' ? 'B1' : levelKey === 'B2' ? 'B2' : 'C1';
              const adverbs = RUTA_ADVERB_BANK[lk] || RUTA_ADVERB_BANK.A2;
              const nouns = RUTA_NOUN_BANK[lk] || RUTA_NOUN_BANK.A2;
              const persons = ['ich', 'du', 'er_sie_es', 'wir', 'ihr', 'sie_Sie'];
              const verbCategories = lk === 'A0' || lk === 'A1' ? ['regular', 'modal'] : lk === 'A2' ? ['regular', 'modal', 'trennbar'] : lk === 'B1' ? ['regular', 'modal', 'trennbar', 'stark', 'prep'] : ['regular', 'modal', 'trennbar', 'stark', 'prep'];
              /* Tiempos verbales disponibles según nivel */
              const tenses = lk === 'A0' || lk === 'A1' ? ['praesens'] : lk === 'A2' ? ['praesens', 'perfekt'] : ['praesens', 'praeteritum', 'perfekt'];
              const allVerbs = [];
              verbCategories.forEach(cat => {
                  const list = RUTA_VERB_PATTERNS[cat] || [];
                  list.forEach(v => allVerbs.push({ ...v, cat }));
              });
              if (!allVerbs.length) return phrases;
              let attempts = 0;
              const maxAttempts = count * 10;
              while (phrases.length < count && attempts < maxAttempts) {
                  attempts++;
                  const v = allVerbs[Math.floor(Math.random() * allVerbs.length)];
                  const p = persons[Math.floor(Math.random() * persons.length)];
                  const adv = adverbs[Math.floor(Math.random() * adverbs.length)];
                  const noun = nouns[Math.floor(Math.random() * nouns.length)];
                  /* Alternar tiempos: praesens, praeteritum, perfekt según nivel */
                  const tense = tenses[Math.floor(Math.random() * tenses.length)];
                  const result = generateUniqueVerbPhrase(v, p, tense, adv, noun);
                  if (result && result.de && !usedSet.has(result.de)) {
                      usedSet.add(result.de);
                      phrases.push({ de: result.de, es: result.es, source: 'generator' });
                  }
              }
              return phrases;
          };

          const buildRutaExercisePlan = useCallback((levels, levelIdx, lessonIdx, bxDb) => {

              const lv = levels && levels[levelIdx];
              const lesson = lv && lv.lessons && lv.lessons[lessonIdx];
              if (!lesson) return [];
              const levelKey = normalizeRutaLevelKey((lv && lv.badge) || (lv && lv.title) || '');
              const levelLexicon = rutaLexiconByLevel[levelKey] || rutaLexiconByLevel.A2;
              const safePhrases = Array.isArray(lesson.phrases) && lesson.phrases.length
                  ? lesson.phrases
                  : [{ de: 'Ich lerne Deutsch.', es: 'Aprendo alemán.' }];
              const safeFill = lesson.fill || { prompt: 'Completa: Ich ___ Deutsch.', promptEs: 'Completa: Yo ___ alemán.', answer: 'lerne', hint: 'Verbo en presente.' };
              const safeSpeak = lesson.speak || { target: safePhrases[0].de };

              const previousLessons = [];
              for (let li = 0; li <= levelIdx; li++) {
                  const block = levels[li];
                  if (!block || !Array.isArray(block.lessons)) continue;
                  const maxIdx = li === levelIdx ? lessonIdx - 1 : block.lessons.length - 1;
                  for (let lj = 0; lj <= maxIdx; lj++) {
                      if (block.lessons[lj]) previousLessons.push(block.lessons[lj]);
                  }
              }
              const reviewPool = previousLessons.filter((l) => Array.isArray(l.phrases) && l.phrases.length);
              const levelVerbSamples = (rutaVerbDb && Array.isArray(rutaVerbDb.verbs) ? rutaVerbDb.verbs : [])
                  .filter((v) => normalizeRutaLevelKey(v.level || '') === levelKey)
                  .slice(0, 24);
              const levelArticleSamples = (Array.isArray(rutaArticleDb) ? rutaArticleDb : [])
                  .filter((a) => {
                      const one = normalizeRutaLevelKey(a && a.level);
                      const many = Array.isArray(a && a.levels) ? a.levels.map((x) => normalizeRutaLevelKey(x)) : [];
                      return one === levelKey || many.includes(levelKey);
                  })
                  .slice(0, 24);

              const phrasePool = [];
              const pushUniquePhrase = (de, es, sourceTag) => {
                  const txt = String(de || '').trim();
                  if (!txt) return;
                  if (phrasePool.some((p) => p.de === txt)) return;
                  phrasePool.push({ de: txt, es: String(es || ''), source: sourceTag || 'lesson' });
              };
              safePhrases.forEach((p) => pushUniquePhrase(p.de, p.es, 'lesson'));
              reviewPool.forEach((l) => (l.phrases || []).forEach((p) => pushUniquePhrase(p.de, p.es, 'review')));
              levelVerbSamples.forEach((v, idx) => {
                  const ex = v && Array.isArray(v.examples) && v.examples.length ? v.examples[0] : null;
                  if (ex && ex.de) pushUniquePhrase(ex.de, ex.es || '', 'verb');
                  else if (v && v.lemma) {
                      const person = personCycle(idx);
                      const adv = levelLexicon.adverbs[idx % levelLexicon.adverbs.length];
                      const built = buildVerbSentence(v, person, adv);
                      if (built) {
                          pushUniquePhrase(built.de, built.es, 'verb');
                          const conjugated = built.conj;
                          const label = PERSON_LABELS[person] || person;
                          const genPhrase = built.de;
                          const genEs = built.es;
                          if (!genPhrase.includes('_____')) {
                              const gapSentence = genPhrase.replace(conjugated, '_____');
                              if (gapSentence !== genPhrase) {
                                  pushUniquePhrase(gapSentence + ' (' + label + ')', genEs ? `${genEs} (${PERSON_LABELS_ES[person] || label})` : '', 'verb-gap');
                              }
                          }
                      }
                  }
              });
              levelArticleSamples.forEach((a, idx) => {
                  const conn = levelLexicon.connectors[idx % levelLexicon.connectors.length];
                  const adj = levelLexicon.adjectives[idx % levelLexicon.adjectives.length];
                  const noun = String(a.de || '').trim();
                  if (!noun) return;
                  const artPerson = personCycle(idx + 3);
                  const artSubj = artPerson === 'ich' ? 'ich' : artPerson === 'du' ? 'du' : artPerson === 'er_sie_es' ? 'man' : artPerson === 'wir' ? 'wir' : artPerson === 'ihr' ? 'ihr' : 'man';
                  const artVerb = artPerson === 'er_sie_es' || artPerson === 'sie_Sie' ? 'benutzt' : artPerson === 'ich' ? 'benutze' : artPerson === 'du' ? 'benutzt' : artPerson === 'wir' ? 'benutzen' : artPerson === 'ihr' ? 'benutzt' : 'benutzt';
                  pushUniquePhrase(`${noun} ist ${adj}, ${conn} ${artSubj} es ${artVerb}.`, a.es || noun, 'article');
              });

              /* ── Inyectar vocabulario desde los bancos editables (bxDb) ── */
              if (bxDb && typeof bxDb === 'object') {
                  const bxLevel = levelKey === 'A0' || levelKey === 'A1' || levelKey === 'A2' ? 'b1' : 'b2';
                  const bank = bxDb[bxLevel];
                  if (bank && typeof bank === 'object') {
                      const bxWords = new Set();
                      /* vocabulario → frases completas */
                      (bank.vocabulario || []).forEach((item) => {
                          const de = String(item.b1 || item.b2 || '').trim();
                          const es = String(item.es || '').trim();
                          const trick = String(item.trick || '').trim();
                          if (de && de.length > 3 && !de.includes('geladen') && !de.includes('fehlt') && !de.includes('Coloca') && !de.includes('Amplía')) {
                              bxWords.add(de);
                              pushUniquePhrase(de, es || trick || '', 'bx-vocab');
                              if (de.includes('(') && de.includes(')')) {
                                  const clean = de.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
                                  if (clean && clean.length > 3) pushUniquePhrase(clean, es || trick || '', 'bx-vocab');
                              }
                          }
                      });
                      /* verbos → frases conjugadas variando persona */
                      (bank.verbos || []).forEach((item, idx) => {
                          const infinitive = String(item.b1 || item.b2 || '').trim();
                          const es = String(item.es || '').trim();
                          if (!infinitive || bxWords.has(infinitive)) return;
                          bxWords.add(infinitive);
                          const person = personCycle(idx);
                          const subj = person === 'ich' ? 'Ich' : person === 'du' ? 'Du' : person === 'er_sie_es' ? 'Er' : person === 'wir' ? 'Wir' : person === 'ihr' ? 'Ihr' : 'Sie';
                          const adv = levelLexicon.adverbs[idx % levelLexicon.adverbs.length];
                          const conj = person === 'ich' ? infinitive.replace(/en$/, 'e') : person === 'du' ? infinitive.replace(/en$/, 'st') : person === 'er_sie_es' ? infinitive.replace(/en$/, 't') : person === 'wir' ? infinitive : person === 'ihr' ? infinitive.replace(/en$/, 't') : infinitive;
                          const phraseDe = adv ? `${subj} ${conj} ${adv}.` : `${subj} ${conj}.`;
                          const personEs = PERSON_LABELS_ES[person] || person;
                          pushUniquePhrase(phraseDe, es ? `${es} (${personEs})` : '', 'bx-verb');
                          if (!phraseDe.includes('_____')) {
                              const gapSentence = phraseDe.replace(conj, '_____');
                              if (gapSentence !== phraseDe) {
                                  pushUniquePhrase(gapSentence + ' (' + person + ')', es ? `${es} (${personEs})` : '', 'bx-verb-gap');
                              }
                          }
                      });
                      /* preposiciones → frases cortas */
                      (bank.preposiciones || []).forEach((item, idx) => {
                          const de = String(item.b1 || item.b2 || '').trim();
                          const es = String(item.es || '').trim();
                          if (!de || bxWords.has(de)) return;
                          bxWords.add(de);
                          const person = personCycle(idx + 1);
                          const subj2 = person === 'ich' ? 'Ich' : person === 'du' ? 'Du' : 'Man';
                          const conj2 = person === 'ich' ? 'denke' : person === 'du' ? 'denkst' : 'denkt';
                          pushUniquePhrase(`${subj2} ${conj2} ${de}.`, es || '', 'bx-prep');
                      });
                      /* conectores → frases */
                      (bank.conectores || []).forEach((item, idx) => {
                          const de = String(item.b1 || item.b2 || '').trim();
                          const es = String(item.es || '').trim();
                          if (!de || bxWords.has(de)) return;
                          bxWords.add(de);
                          const adj2 = levelLexicon.adjectives[idx % levelLexicon.adjectives.length];
                          pushUniquePhrase(`Das ist wichtig, ${de} ${adj2}.`, es || '', 'bx-conn');
                      });
                      /* redemittel → frases útiles */
                      (bank.redemittel || []).forEach((item) => {
                          const de = String(item.b1 || item.b2 || '').trim();
                          const es = String(item.es || '').trim();
                          if (!de || de.length < 4 || bxWords.has(de)) return;
                          bxWords.add(de);
                          pushUniquePhrase(de, es || '', 'bx-redemittel');
                      });
                  }
              }
              /* ── Fin inyección bxDb ── */
              /* ── GENERADOR FANTASMA: inyectar frases únicas generadas por nivel ── */
              /* Usar un Set GLOBAL que persista entre lecciones del mismo nivel */
              if (!window.__RUTA_USED_PHRASES) window.__RUTA_USED_PHRASES = new Set();
              const globalUsedSet = window.__RUTA_USED_PHRASES;
              /* Sembrar el globalUsedSet con las frases ya existentes en el pool */
              phrasePool.forEach(p => globalUsedSet.add(p.de));
              const generatedCount = Math.max(100, 200 - phrasePool.length);
              if (generatedCount > 0) {
                  const generated = generateUniquePhrasesForLevel(levelKey, generatedCount, globalUsedSet);
                  generated.forEach(g => pushUniquePhrase(g.de, g.es, 'generator'));
                  /* Inyectar frases generadas directamente en lesson.phrases, lesson.fill, lesson.speak */
                  if (generated.length >= 3) {
                      lesson.phrases = generated;
                      lesson.fill = {
                          prompt: generated[0].de.replace(/\b\w+\b/, '_____'),
                          promptEs: generated[0].es,
                          answer: generated[0].de.match(/\b\w+\b/)?.[0] || 'lerne',
                          hint: 'Completa la frase.'
                      };
                      lesson.speak = { target: generated[1].de };
                  }
              }
              if (phrasePool.length === 0) pushUniquePhrase('Ich lerne Deutsch.', 'Aprendo alemán.', 'fallback');

              const total = RUTA_SECTION_EXERCISES;
              const reviewCount = Math.max(0, Math.round(total * RUTA_REVIEW_RATIO));
              const reviewSlots = new Set(Array.from({ length: reviewCount }, (_, i) => Math.floor(((i + 1) * total) / (reviewCount + 1))));
              const typeSequence = rutaExerciseTypeByLevel[levelKey] || rutaExerciseTypeByLevel.A2;

              const extractDeClean = (de) => {
                  let s = String(de || '').split('—')[0].trim();
                  s = s.replace(/\s*\([^)]*\)\s*$/, '').trim();
                  return s.replace(/\s+/g, ' ').trim();
              };
              /* ── Bancos de historias temáticas para conversaciones fluidas ── */
              const STORY_SCENES = {
                  park: {
                      title: 'Im Park',
                      scenes: [
                          { a: 'Schönes Wetter heute, oder?', b: 'Ja, perfekt für einen Spaziergang im Park.', es: 'Hace buen tiempo hoy, ¿verdad? Sí, perfecto para pasear por el parque.' },
                          { a: 'Sieh mal, die Kinder spielen Fußball.', b: 'Die sind ja richtig gut! Mein Sohn spielt auch gern Fußball.', es: 'Mira, los niños juegan al fútbol. ¡Son muy buenos! A mi hijo también le gusta jugar al fútbol.' },
                          { a: 'Wie alt ist dein Sohn?', b: 'Er ist acht Jahre alt und geht in die zweite Klasse.', es: '¿Cuántos años tiene tu hijo? Tiene ocho años y va a segundo curso.' },
                          { a: 'Meine Tochter ist zehn. Sie tanzt lieber als Fußball zu spielen.', b: 'Tanzen ist auch eine schöne Aktivität. Macht sie Ballett?', es: 'Mi hija tiene diez. Prefiere bailar a jugar al fútbol. Bailar también es una bonita actividad. ¿Hace ballet?' },
                          { a: 'Ja, zweimal pro Woche. Die Übungen sind anstrengend, aber sie liebt es.', b: 'Das ist wichtig, dass Kinder Sport treiben. Es hält sie gesund.', es: 'Sí, dos veces por semana. Los ejercicios son agotadores, pero le encanta. Es importante que los niños hagan deporte. Los mantiene sanos.' },
                          { a: 'Stimmt. Bewegung an der frischen Luft ist das Beste.', b: 'Ganz genau. Sollen wir uns morgen wieder hier treffen?', es: 'Cierto. El ejercicio al aire libre es lo mejor. Exactamente. ¿Quedamos mañana aquí otra vez?' },
                          { a: 'Gerne! Ich bringe Kaffee mit.', b: 'Und ich besorge etwas zu essen. Bis morgen!', es: '¡Con gusto! Traeré café. Y yo traeré algo de comer. ¡Hasta mañana!' }
                      ]
                  },
                  cafe: {
                      title: 'Im Café',
                      scenes: [
                          { a: 'Was möchtest du trinken?', b: 'Ich hätte gern einen Cappuccino, bitte.', es: '¿Qué quieres beber? Quisiera un capuchino, por favor.' },
                          { a: 'Ich nehme einen Tee mit Zitrone. Hast du schon den Kuchen gesehen?', b: 'Ja, der sieht lecker aus! Vielleicht probiere ich ein Stück Apfelkuchen.', es: 'Tomaré un té con limón. ¿Has visto ya la tarta? Sí, ¡tiene buena pinta! Quizá pruebe un trozo de tarta de manzana.' },
                          { a: 'Gute Wahl. Ich mag den Schokoladenkuchen hier sehr.', b: 'Letztes Mal war ich mit meiner Kollegin hier. Sie hat mir den Laden empfohlen.', es: 'Buena elección. A mí me gusta mucho la tarta de chocolate aquí. La última vez vine con mi compañera de trabajo. Ella me recomendó este sitio.' },
                          { a: 'Die Atmosphäre ist wirklich gemütlich. Perfekt zum Lernen oder Lesen.', b: 'Ja, und das Personal ist auch sehr freundlich. Kommst du oft hierher?', es: 'El ambiente es realmente acogedor. Perfecto para estudiar o leer. Sí, y el personal también es muy amable. ¿Vienes a menudo aquí?' },
                          { a: 'Einmal pro Woche, meistens am Samstagvormittag.', b: 'Dann sehen wir uns bestimmt mal wieder. Ich wohne gleich um die Ecke.', es: 'Una vez por semana, normalmente los sábados por la mañana. Entonces seguro que nos vemos de nuevo. Vivo justo a la vuelta de la esquina.' }
                      ]
                  },
                  kino: {
                      title: 'Im Kino',
                      scenes: [
                          { a: 'Welchen Film möchtest du sehen?', b: 'Ich habe gehört, der neue Science-Fiction-Film soll spannend sein.', es: '¿Qué película quieres ver? He oído que la nueva de ciencia ficción es emocionante.' },
                          { a: 'Den möchte ich auch sehen! Die Kritiken sind sehr gut.', b: 'Perfekt. Ich hole die Tickets online, dann müssen wir nicht anstehen.', es: '¡Esa también quiero verla! Las críticas son muy buenas. Perfecto. Sacaré las entradas online, así no tendremos que hacer cola.' },
                          { a: 'Gute Idee. Sollen wir Popcorn und Getränke kaufen?', b: 'Ja, aber nicht zu viel. Ich möchte nicht während des Films auf die Toilette müssen.', es: 'Buena idea. ¿Compramos palomitas y bebidas? Sí, pero no demasiado. No quiero tener que ir al baño durante la película.' },
                          { a: 'Stimmt. Übrigens, der Film dauert zweieinhalb Stunden.', b: 'Das ist okay. Danach können wir noch etwas essen gehen, wenn du magst.', es: 'Cierto. Por cierto, la película dura dos horas y media. Está bien. Después podemos ir a cenar algo, si quieres.' },
                          { a: 'Gerne! Ich kenne ein gutes Restaurant in der Nähe.', b: 'Super. Dann lass uns losgehen, der Film fängt bald an.', es: '¡Con gusto! Conozco un buen restaurante cerca. Súper. Entonces vamos, la película empieza pronto.' }
                      ]
                  },
                  reisen: {
                      title: 'Reiseplanung',
                      scenes: [
                          { a: 'Hast du schon Pläne für den nächsten Urlaub?', b: 'Ja, ich möchte nach Österreich reisen. Die Berge dort sind wunderschön.', es: '¿Ya tienes planes para las próximas vacaciones? Sí, quiero viajar a Austria. Las montañas allí son preciosas.' },
                          { a: 'Österreich ist wirklich schön. Ich war letztes Jahr in Salzburg.', b: 'Oh, Salzburg soll eine tolle Stadt sein. Warst du auch in den Alpen?', es: 'Austria es realmente bonita. Estuve el año pasado en Salzburgo. Oh, Salzburgo debe ser una ciudad genial. ¿Estuviste también en los Alpes?' },
                          { a: 'Ja, wir haben eine Wanderung gemacht. Die Aussicht war atemberaubend.', b: 'Das klingt fantastisch! Ich werde auf jeden Fall wandern gehen.', es: 'Sí, hicimos una excursión. Las vistas eran impresionantes. ¡Suena fantástico! Definitivamente iré a hacer senderismo.' },
                          { a: 'Du solltest auch traditionelles Essen probieren. Die österreichische Küche ist köstlich.', b: 'Gute Idee! Ich liebe Käsespätzle und Apfelstrudel.', es: 'Deberías probar también la comida tradicional. La cocina austriaca es deliciosa. ¡Buena idea! Me encantan los käsespätzle y el strudel de manzana.' },
                          { a: 'Dann wünsche ich dir eine tolle Reise!', b: 'Vielen Dank! Ich freue mich schon sehr darauf.', es: '¡Entonces te deseo un buen viaje! ¡Muchas gracias! Ya tengo muchas ganas.' }
                      ]
                  },
                  einkaufen: {
                      title: 'Beim Einkaufen',
                      scenes: [
                          { a: 'Entschuldigung, können Sie mir helfen? Ich suche die Abteilung für Obst.', b: 'Ja, natürlich. Die Obstabteilung ist hinten links, neben den Milchprodukten.', es: 'Disculpe, ¿puede ayudarme? Busco la sección de fruta. Sí, claro. La sección de fruta está al fondo a la izquierda, junto a los lácteos.' },
                          { a: 'Vielen Dank! Ich brauche auch noch Brot.', b: 'Das Brot finden Sie in der Bäckerei, direkt am Eingang.', es: '¡Muchas gracias! También necesito pan. El pan lo encontrará en la panadería, justo en la entrada.' },
                          { a: 'Perfekt. Ich möchte heute Abend eine Gemüsesuppe kochen.', b: 'Das klingt lecker! Ich koche auch gern. Probieren Sie es mit frischen Kräutern, das gibt mehr Geschmack.', es: 'Perfecto. Quiero cocinar una sopa de verduras esta noche. ¡Suena delicioso! A mí también me gusta cocinar. Pruébelo con hierbas frescas, le da más sabor.' },
                          { a: 'Guter Tipp! Ich nehme Petersilie und Schnittlauch mit.', b: 'Ausgezeichnet. Wenn Sie noch Fragen haben, ich bin gleich an der Kasse.', es: '¡Buen consejo! Llevaré perejil y cebollino. Excelente. Si tiene más preguntas, estaré en la caja.' }
                      ]
                  },
                  arbeit: {
                      title: 'Im Büro',
                      scenes: [
                          { a: 'Guten Morgen! Wie war dein Wochenende?', b: 'Sehr erholsam, ich war mit Freunden im Grünen. Und deins?', es: '¡Buenos días! ¿Qué tal tu fin de semana? Muy relajante, estuve con amigos en el campo. ¿Y el tuyo?' },
                          { a: 'Auch schön. Ich habe am Samstag ein neues Projekt angefangen.', b: 'Ein neues Projekt? Klingt interessant. Worum geht es?', es: 'También bien. El sábado empecé un nuevo proyecto. ¿Un nuevo proyecto? Suena interesante. ¿De qué se trata?' },
                          { a: 'Es geht um die Entwicklung einer neuen App für unsere Kunden.', b: 'Das ist ja spannend! Brauchst du Unterstützung dabei?', es: 'Trata sobre el desarrollo de una nueva aplicación para nuestros clientes. ¡Qué emocionante! ¿Necesitas ayuda con ello?' },
                          { a: 'Ja, vielleicht kannst du mir bei der Datenbank helfen.', b: 'Gerne! Ich habe Erfahrung mit Datenbanken. Lass uns heute Nachmittag darüber sprechen.', es: 'Sí, quizá puedas ayudarme con la base de datos. ¡Con gusto! Tengo experiencia con bases de datos. Hablemos esta tarde sobre ello.' },
                          { a: 'Perfekt. Ich bereite die Unterlagen vor und schicke sie dir vor dem Meeting.', b: 'Super, dann bin ich bestens vorbereitet. Bis später!', es: 'Perfecto. Prepararé los documentos y te los enviaré antes de la reunión. Súper, así estaré muy bien preparado. ¡Hasta luego!' }
                      ]
                  },
                  restaurant: {
                      title: 'Im Restaurant',
                      scenes: [
                          { a: 'Guten Abend! Einen Tisch für zwei Personen, bitte.', b: 'Guten Abend! Hier entlang, ich zeige Ihnen Ihren Platz.', es: '¡Buenas tardes! Una mesa para dos, por favor. ¡Buenas tardes! Por aquí, les enseño su sitio.' },
                          { a: 'Die Speisekarte ist sehr vielfältig. Was nimmst du?', b: 'Ich denke, ich nehme das Schnitzel mit Pommes. Und du?', es: 'La carta es muy variada. ¿Qué vas a tomar? Creo que tomaré el schnitzel con patatas fritas. ¿Y tú?' },
                          { a: 'Ich bin noch unentschlossen. Vielleicht den Fischteller.', b: 'Der Fischteller soll hier ausgezeichnet sein. Die Portionen sind auch groß.', es: 'Todavía no lo he decidido. Quizá el plato de pescado. El plato de pescado debe ser excelente aquí. Las raciones también son grandes.' },
                          { a: 'Dann nehme ich den Fischteller. Möchtest du einen Salat als Vorspeise?', b: 'Gerne! Wir teilen uns einen gemischten Salat.', es: 'Entonces tomaré el plato de pescado. ¿Quieres una ensalada de entrante? ¡Con gusto! Compartimos una ensalada variada.' },
                          { a: 'Das Essen war wirklich hervorragend. Sollen wir ein Dessert bestellen?', b: 'Ich bin leider zu satt. Aber vielleicht einen Espresso?', es: 'La comida ha sido realmente excelente. ¿Pedimos un postre? Por desgracia estoy demasiado lleno. ¿Pero quizá un espresso?' }
                      ]
                  },
                  schule: {
                      title: 'In der Sprachschule',
                      scenes: [
                          { a: 'Hallo! Bist du neu im Deutschkurs?', b: 'Ja, heute ist mein erster Tag. Ich bin ein bisschen nervös.', es: '¡Hola! ¿Eres nuevo en el curso de alemán? Sí, hoy es mi primer día. Estoy un poco nervioso.' },
                          { a: 'Keine Sorge, der Kurs ist sehr entspannt. Die Lehrerin erklärt alles gut.', b: 'Das beruhigt mich. Ich habe schon ein bisschen Deutsch gelernt, aber ich möchte fließender sprechen.', es: 'No te preocupes, el curso es muy relajado. La profesora lo explica todo bien. Eso me tranquiliza. Ya he aprendido un poco de alemán, pero quiero hablar con más fluidez.' },
                          { a: 'Das schaffst du! Am besten übst du jeden Tag ein bisschen.', b: 'Ja, ich versuche, jeden Tag zehn neue Wörter zu lernen.', es: '¡Lo conseguirás! Lo mejor es practicar un poco cada día. Sí, intento aprender diez palabras nuevas cada día.' },
                          { a: 'Das ist eine gute Methode. Ich lese auch gern einfache Artikel auf Deutsch.', b: 'Das ist ein guter Tipp! Welche Zeitung empfiehlst du?', es: 'Es un buen método. A mí también me gusta leer artículos sencillos en alemán. ¡Es un buen consejo! ¿Qué periódico recomiendas?' },
                          { a: 'Ich lese oft die Nachrichten auf der Website der Deutschen Welle.', b: 'Die werde ich mir auch ansehen. Danke für den Tipp!', es: 'A menudo leo las noticias en la página web de Deutsche Welle. También las echaré un vistazo. ¡Gracias por el consejo!' }
                      ]
                  }
              };
              const STORY_TOPIC_KEYS = Object.keys(STORY_SCENES);
              const buildRutaLongAudioPlan = (phrasePoolItems, connectorPool, variant) => {
                  const pool = phrasePoolItems
                      .map((p) => ({ de: extractDeClean(p.de), es: sanitizeRutaSpanishForUi(p.es || '', extractDeClean(p.de)) }))
                      .filter((p) => p.de.length > 12);
                  if (pool.length < 4) return null;
                  /* Elegir una historia temática aleatoria */
                  const topicKey = STORY_TOPIC_KEYS[Math.floor(Math.random() * STORY_TOPIC_KEYS.length)];
                  const scene = STORY_SCENES[topicKey];
                  const lines = [];
                  let totalChars = 0;
                  /* Introducción según variante */
                  const introText = variant === 'story'
                      ? `Heute erleben wir eine kleine Geschichte: ${scene.title}.`
                      : `Willkommen zu einem Gespräch: ${scene.title}.`;
                  lines.push({ speaker: 'A', text: introText });
                  totalChars += introText.length + 4;
                  /* Insertar las líneas de la historia temática */
                  const sceneLines = scene.scenes;
                  for (let i = 0; i < sceneLines.length; i++) {
                      const s = sceneLines[i];
                      lines.push({ speaker: 'A', text: s.a });
                      totalChars += s.a.length + 4;
                      lines.push({ speaker: 'B', text: s.b });
                      totalChars += s.b.length + 4;
                  }
                  /* Si aún no llegamos a 1000 caracteres, añadir frases del pool como extensión natural */
                  let poolIdx = 0;
                  while (totalChars < 1000 && lines.length < 40) {
                      const p = pool[poolIdx % pool.length];
                      poolIdx++;
                      if (!p) break;
                      const sp = lines.length % 2 === 0 ? 'A' : 'B';
                      const body = p.de.replace(/\.$/, '') + '.';
                      /* Solo añadir si no es demasiado larga y no está ya repetida */
                      if (body.length > 15 && !lines.some(l => l.text === body)) {
                          lines.push({ speaker: sp, text: body });
                          totalChars += body.length + 4;
                      }
                  }
                  const n = lines.length;
                  /* Generar checkpoints variados */
                  const pos = [Math.max(4, Math.floor(n * 0.25)), Math.max(8, Math.floor(n * 0.50)), Math.max(12, Math.floor(n * 0.75))];
                  const uniqPos = [...new Set(pos)].filter((x) => x >= 3 && x < n).slice(0, 3);
                  const checkpointTypes = ['mc_word', 'mc_question', 'fill', 'true_false'];
                  const checkpoints = uniqPos.map((afterLineIdx, cix) => {
                      const prevLine = lines[afterLineIdx - 1] || lines[0];
                      const prevLine2 = lines[Math.max(0, afterLineIdx - 2)] || lines[0];
                      const cpType = checkpointTypes[cix % checkpointTypes.length];
                      const sceneEs = scene.scenes[Math.min(cix, scene.scenes.length - 1)]?.es || '';
                      if (cpType === 'mc_word') {
                          /* Elegir palabra del contexto */
                          const key = (chooseGapWord(prevLine.text) || 'wichtig').replace(/[.,!?]/g, '');
                          const d1 = (chooseGapWord(pool[(poolIdx + 1 + cix) % pool.length]?.de || '') || connectorPool[0] || 'Wetter').replace(/[.,!?]/g, '');
                          const d2 = (chooseGapWord(pool[(poolIdx + 2 + cix) % pool.length]?.de || '') || connectorPool[2] || 'Arbeit').replace(/[.,!?]/g, '');
                          const correct = key.length > 2 ? key : 'wichtig';
                          const opts = [...new Set([correct, d1, d2].filter(Boolean))].slice(0, 3);
                          /* Rellenar si faltan opciones */
                          while (opts.length < 3) {
                              const fallback = ['wichtig', 'richtig', 'schön', 'genau', 'klar', 'super'][opts.length];
                              if (!opts.includes(fallback)) opts.push(fallback);
                          }
                          opts.sort(() => Math.random() - 0.5);
                          return {
                              afterLineIdx,
                              cpType: 'mc',
                              promptEs: `¿Qué palabra alemana encaja mejor en lo que acabas de escuchar? Contexto: ${sceneEs.slice(0, 120)}`,
                              options: opts,
                              answer: correct,
                              acceptedAnswers: expandGermanAccept(correct),
                              hint: `Último intento: la palabra correcta tiene ${correct.length} letras y empieza por «${correct.slice(0, 2)}».`,
                              softNote: `En contexto formal se usaría «${correct}».`
                          };
                      } else if (cpType === 'mc_question') {
                          /* Pregunta de comprensión sobre lo escuchado */
                          const qaBank = [
                              { q: '¿De qué están hablando principalmente?', a: scene.title, d1: 'Über das Wetter', d2: 'Über die Arbeit' },
                              { q: '¿Qué actividad mencionan?', a: chooseGapWord(prevLine.text) || 'Spaziergang', d1: 'Schwimmen', d2: 'Lesen' },
                              { q: '¿Cómo describen la situación?', a: chooseGapWord(prevLine2.text) || 'schön', d1: 'schlecht', d2: 'langweilig' },
                              { q: '¿Qué planean hacer?', a: chooseGapWord(prevLine.text) || 'treffen', d1: 'arbeiten', d2: 'schlafen' }
                          ];
                          const qa = qaBank[cix % qaBank.length];
                          const opts = [qa.a, qa.d1, qa.d2].filter(Boolean);
                          /* Asegurar 3 opciones */
                          while (opts.length < 3) {
                              const fb = ['vielleicht', 'natürlich', 'wirklich'][opts.length];
                              if (!opts.includes(fb)) opts.push(fb);
                          }
                          opts.sort(() => Math.random() - 0.5);
                          return {
                              afterLineIdx,
                              cpType: 'mc',
                              promptEs: qa.q + ' (elige la opción más adecuada)',
                              options: opts,
                              answer: qa.a,
                              acceptedAnswers: expandGermanAccept(qa.a),
                              hint: `Pista: presta atención al tema principal de la conversación.`,
                              softNote: `La respuesta más precisa es «${qa.a}».`
                          };
                      } else if (cpType === 'fill') {
                          /* Rellenar hueco en una frase del diálogo */
                          const sourceLine = prevLine.text;
                          const gapWord = (chooseGapWord(sourceLine) || 'ist').replace(/[.,!?]/g, '');
                          const escaped = gapWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                          const prompt = sourceLine.replace(new RegExp(`\\b${escaped}\\b`), '_____');
                          const d1 = (chooseGapWord(pool[(poolIdx + 3 + cix) % pool.length]?.de || '') || 'geht').replace(/[.,!?]/g, '');
                          const d2 = (chooseGapWord(pool[(poolIdx + 4 + cix) % pool.length]?.de || '') || 'macht').replace(/[.,!?]/g, '');
                          const opts = [...new Set([gapWord, d1, d2].filter(Boolean))].slice(0, 3);
                          while (opts.length < 3) {
                              const fb = ['sagt', 'kommt', 'bleibt'][opts.length];
                              if (!opts.includes(fb)) opts.push(fb);
                          }
                          opts.sort(() => Math.random() - 0.5);
                          return {
                              afterLineIdx,
                              cpType: 'fill',
                              promptEs: `Completa la frase que acabas de oír: «${prompt}»`,
                              options: opts,
                              answer: gapWord,
                              acceptedAnswers: expandGermanAccept(gapWord),
                              hint: `La palabra que falta tiene ${gapWord.length} letras.`,
                              softNote: `La forma correcta es «${gapWord}».`
                          };
                      } else {
                          /* Verdadero/Falso con 3 opciones (Richtig, Falsch, Nicht klar) */
                          const tfStatements = [
                              { stmt: `Die Personen sprechen über ${scene.title.toLowerCase()}.`, correct: 'Richtig' },
                              { stmt: `Die Personen sind sich nicht einig.`, correct: 'Falsch' },
                              { stmt: `Das Gespräch findet am Abend statt.`, correct: 'Falsch' },
                              { stmt: `Die Stimmung ist freundlich.`, correct: 'Richtig' }
                          ];
                          const tf = tfStatements[cix % tfStatements.length];
                          const tfOpts = ['Richtig', 'Falsch', 'Nicht klar'];
                          return {
                              afterLineIdx,
                              cpType: 'true_false',
                              promptEs: `¿Es correcta esta afirmación sobre lo que has escuchado? "${tf.stmt}"`,
                              options: tfOpts,
                              answer: tf.correct,
                              acceptedAnswers: [tf.correct, tf.correct.toLowerCase()],
                              hint: `Piensa en el tono general de la conversación.`,
                              softNote: `La respuesta es «${tf.correct}».`
                          };
                      }
                  });
                  return { lines, checkpoints, approxSeconds: 92 };
              };

              const plan = [];
              for (let i = 0; i < total; i++) {
                  const mode = typeSequence[i % typeSequence.length];
                  const useReview = reviewPool.length > 0 && reviewSlots.has(i);
                  const srcLesson = useReview ? reviewPool[i % reviewPool.length] : lesson;
                  const srcPhrases = useReview
                      ? ((Array.isArray(srcLesson.phrases) && srcLesson.phrases.length ? srcLesson.phrases : safePhrases))
                      : phrasePool;
                  const srcPhrase = srcPhrases[i % srcPhrases.length] || safePhrases[0];
                  const sourceSentence = String(srcPhrase.de || '').trim() || 'Ich lerne Deutsch.';
                  const srcFill = srcLesson.fill || safeFill;
                  const srcSpeak = srcLesson.speak || { target: sourceSentence || safeSpeak.target };
                  const connectorPool = levelKey === 'C1'
                      ? ['demzufolge', 'folglich', 'nichtsdestotrotz', 'insofern']
                      : levelKey === 'B2'
                          ? ['während', 'sobald', 'falls', 'hingegen']
                          : ['weil', 'deshalb', 'aber', 'trotzdem'];
                  const meaningEs = rutaSpanishMeaningLine(srcPhrase, sourceSentence, srcFill);
                  const answerDeClean = sourceSentence.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
                  const answerEsClean = sanitizeRutaSpanishForUi(srcPhrase.es || '', sourceSentence) || String(srcPhrase.es || '').trim();

                  if (mode === 'read') {
                      plan.push({
                          id: `${srcLesson.id || lesson.id}-read-${i}`,
                          type: 'read',
                          de: sourceSentence,
                          fromReview: useReview
                      });
                  } else if (mode === 'translate_de') {
                      plan.push({
                          id: `${srcLesson.id || lesson.id}-tr-de-${i}`,
                          type: 'translate_de',
                          prompt: meaningEs,
                          answer: answerDeClean,
                          acceptedAnswers: expandGermanAccept(answerDeClean),
                          hint: shouldShowHintForLevel(levelKey, i) ? (srcFill.hint || safeFill.hint || '') : '',
                          fromReview: useReview
                      });
                  } else if (mode === 'translate_es') {
                      if (answerEsClean) {
                          const esAcc = new Set([answerEsClean, answerEsClean.toLowerCase(), answerEsClean.replace(/^¿/, '').replace(/\?$/, '').trim()]);
                          /* Expandir "/" en la respuesta española: si contiene "/", aceptar cada parte por separado */
                          if (answerEsClean.includes('/')) {
                              answerEsClean.split('/').map(p => p.trim()).filter(Boolean).forEach(p => {
                                  esAcc.add(p);
                                  esAcc.add(p.toLowerCase());
                                  esAcc.add(p.replace(/^¿/, '').replace(/\?$/, '').trim());
                              });
                          }
                          plan.push({
                              id: `${srcLesson.id || lesson.id}-tr-es-${i}`,
                              type: 'translate_es',
                              promptDe: answerDeClean,
                              answer: answerEsClean,
                              acceptedAnswers: [...esAcc].filter(Boolean),
                              hint: shouldShowHintForLevel(levelKey, i) ? (srcFill.hint || safeFill.hint || '') : '',
                              fromReview: useReview
                          });
                      } else {
                          plan.push({
                              id: `${srcLesson.id || lesson.id}-read-trfallback-${i}`,
                              type: 'read',
                              de: sourceSentence,
                              es: '',
                              esDisplay: meaningEs || '',
                              fromReview: useReview
                          });
                      }
                  } else if (mode === 'fill') {
                      const gap = makeGapExercise(
                          sourceSentence,
                          meaningEs,
                          shouldShowHintForLevel(levelKey, i) ? (srcFill.hint || safeFill.hint || '') : '',
                          useReview,
                          `${srcLesson.id || lesson.id}-fill-${i}`
                      );
                      if (gap) {
                          plan.push(gap);
                      } else {
                          const fa = srcFill.answer || safeFill.answer;
                          const fp = srcFill.prompt || safeFill.prompt;
                          plan.push({
                              id: `${srcLesson.id || lesson.id}-fill-fallback-${i}`,
                              type: 'fill',
                              prompt: fp,
                              promptEs: meaningEs || srcFill.promptEs || safeFill.promptEs || '',
                              answer: fa,
                              acceptedAnswers: expandGermanAccept(fa),
                              hint: (shouldShowHintForLevel(levelKey, i) ? (srcFill.hint || safeFill.hint || '') : '') || buildGapHint(fp, fa),
                              betterFormNote: `En examen prioriza: «${fa}».`,
                              fromReview: useReview
                          });
                      }
                  } else {
                      if (mode === 'podcast') {
                          const pod = buildRutaLongAudioPlan(phrasePool, connectorPool, 'dialog');
                          if (pod) {
                              plan.push({
                                  id: `${srcLesson.id || lesson.id}-podcast-${i}`,
                                  type: 'podcast',
                                  title: ['Podcast Ruta', 'Diálogo guiado', 'Práctica auditiva', 'Conversación dirigida', 'Ejercicio de escucha'][i % 5] + ' (~90 s) · Pausas y preguntas',
                                  podcast: pod,
                                  fromReview: useReview
                              });
                          } else {
                              plan.push({
                                  id: `${srcLesson.id || lesson.id}-read-podfallback-${i}`,
                                  type: 'read',
                                  de: sourceSentence,
                                  fromReview: useReview
                              });
                          }
                          continue;
                      }
                      if (mode === 'audio_story') {
                          const story = buildRutaLongAudioPlan(phrasePool, connectorPool, 'story');
                          if (story) {
                              plan.push({
                                  id: `${srcLesson.id || lesson.id}-audio-story-${i}`,
                                  type: 'audio_story',
                                  title: ['Historia oral', 'Relato guiado', 'Narración auditiva', 'Cuento dirigido', 'Ejercicio de historia'][i % 5] + ' (~90 s) · Pausas y preguntas',
                                  podcast: story,
                                  fromReview: useReview
                              });
                          } else {
                              plan.push({
                                  id: `${srcLesson.id || lesson.id}-read-storyfallback-${i}`,
                                  type: 'read',
                                  de: sourceSentence,
                                  fromReview: useReview
                              });
                          }
                          continue;
                      }
                      if (mode === 'order') {
                          const base = sourceSentence;
                          const distractorA = base.replace(/\bich\b/i, 'wir');
                          const distractorB = base.split(' ').reverse().join(' ');
                          const opts = [base, distractorA, distractorB].sort(() => Math.random() - 0.5);
                          plan.push({
                              id: `${srcLesson.id || lesson.id}-order-${i}`,
                              type: 'order',
                              prompt: 'Selecciona el orden correcto de la frase:',
                              options: opts,
                              answer: base,
                              acceptedAnswers: [base, base.replace(/\s+/g, ' ').trim()],
                              fromReview: useReview
                          });
                          continue;
                      }
                      if (mode === 'connector') {
                          const connector = connectorPool[i % connectorPool.length];
                          const core = sourceSentence.replace(/[.?!]$/, '').trim();
                          const sentence = `${core}, ${connector} ich besser sprechen kann.`;
                          const options = [...new Set([connector, ...connectorPool.filter((c) => c !== connector).slice(0, 3)])].sort(() => Math.random() - 0.5);
                          plan.push({
                              id: `${srcLesson.id || lesson.id}-connector-${i}`,
                              type: 'connector',
                              prompt: sentence.replace(connector, '_____'),
                              options,
                              answer: connector,
                              acceptedAnswers: expandGermanAccept(connector),
                              hint: `Pista alineada: el hueco enlaza «${core.slice(0, 72)}…» con una conexión lógica al segundo miembro.`,
                              fromReview: useReview
                          });
                          continue;
                      }
                      plan.push({
                          id: `${srcLesson.id || lesson.id}-speak-${i}`,
                          type: 'speak',
                          target: (srcSpeak && srcSpeak.target) || sourceSentence || safeSpeak.target,
                          fromReview: useReview
                      });
                  }
              }
              return plan;
          }, []);

          const startRutaLesson = useCallback((levelIdx, lessonIdx) => {
              const levels = rutaLevels || [];
              const lesson = levels[levelIdx] && levels[levelIdx].lessons && levels[levelIdx].lessons[lessonIdx];
              if (!lesson) return;
              const plan = buildRutaExercisePlan(levels, levelIdx, lessonIdx, bxEffectiveDatabases);
              if (!plan.length) return;
              clearRutaPodcastPlayback();
              setRutaFillTip('');
              setRutaRun({
                  levelIdx,
                  lessonIdx,
                  levelKey: normalizeRutaLevelKey((levels[levelIdx] && levels[levelIdx].badge) || (levels[levelIdx] && levels[levelIdx].title) || ''),
                  step: 0,
                  exerciseIdx: 0,
                  exerciseTotal: plan.length,
                  exercisePlan: plan,
                  score: { correct: 0, total: 0, reviewCorrect: 0, reviewTotal: 0 },
                  exerciseAttempts: 0,
                  rutaLastChanceHint: '',
                  forcedReveal: false,
                  podcastHadFailure: false
              });
              setRutaFillInput('');
              setRutaTranscript('');
              setRutaSpeakErr('');
          }, [buildRutaExercisePlan, rutaLevels]);

          const completeRutaLesson = (levelIdx, lessonIdx, runScore) => {
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
              const score = runScore || { correct: 0, total: 0, reviewCorrect: 0, reviewTotal: 0 };
              const levelKey = String((levels[levelIdx] && levels[levelIdx].badge) || (levels[levelIdx] && levels[levelIdx].title) || `L${levelIdx}`).toUpperCase();
              const prevLevelScore = (rutaProgress.levelScores && rutaProgress.levelScores[levelKey]) || { correct: 0, total: 0, reviewCorrect: 0, reviewTotal: 0 };
              const mergedLevelScore = {
                  correct: (prevLevelScore.correct || 0) + (score.correct || 0),
                  total: (prevLevelScore.total || 0) + (score.total || 0),
                  reviewCorrect: (prevLevelScore.reviewCorrect || 0) + (score.reviewCorrect || 0),
                  reviewTotal: (prevLevelScore.reviewTotal || 0) + (score.reviewTotal || 0),
              };
              const accuracy = mergedLevelScore.total > 0 ? Math.round((mergedLevelScore.correct / mergedLevelScore.total) * 100) : 0;
              let bonus = 0;
              if (nextCount % 3 === 0) bonus = 35;
              if ((score.total || 0) >= RUTA_SECTION_EXERCISES && ((score.correct || 0) / Math.max(1, score.total || 0)) >= 0.85) bonus += 15;
              if ((score.reviewTotal || 0) > 0 && ((score.reviewCorrect || 0) / Math.max(1, score.reviewTotal || 0)) >= 0.7) bonus += 10;
              const nextProg = {
                  ...rutaProgress,
                  completed: { ...(rutaProgress.completed || {}), [lesson.id]: true },
                  lessonsCompleted: nextCount,
                  levelScores: { ...(rutaProgress.levelScores || {}), [levelKey]: mergedLevelScore }
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
                  title: '¡Lo lograste!',
                  subtitle: `${lesson.title} · Precisión ${score.total ? Math.round((score.correct / score.total) * 100) : 0}%`,
                  xp: lesson.rewardXp,
                  coins: lesson.rewardCoins + bonus,
                  milestone: bonus > 0,
                  note: `Nivel ${levelKey}: ${accuracy}% acumulado (mínimo ${Math.round(RUTA_MIN_ACCURACY_TO_UNLOCK_NEXT_LEVEL * 100)}% para desbloquear el siguiente nivel)`
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
  
  // Actualizar puntuación del nivel actual
  const newScore = {
    correct: placementScore.correct + (isCorrect ? 1 : 0),
    total: placementScore.total + 1
  };
  setPlacementScore(newScore);
  
  // Reproducir sonido de acierto/fallo
  if (window.__mullerNotifyExerciseOutcome) {
    window.__mullerNotifyExerciseOutcome(isCorrect);
  }
  
  // Lógica adaptativa
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
  
  // Si no hay más preguntas del nivel, finalizar
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

          const normalizeRutaTypedLine = (s) => String(s || '').trim().toLowerCase().replace(/[.,!?¡¿;:]/g, '').replace(/['"«»]/g, '').replace(/\s+/g, ' ');

          const checkRutaTranslateClose = (gotRaw, expectedRaw, mode) => {
              const a = normalizeRutaTypedLine(gotRaw);
              const b = normalizeRutaTypedLine(expectedRaw);
              if (!a || !b) return false;
              if (a === b) return true;
              /* Si la respuesta contiene "/", aceptar cualquiera de las partes */
              if (b.includes('/')) {
                  const parts = b.split('/').map(p => p.trim()).filter(Boolean);
                  for (const part of parts) {
                      if (a === normalizeRutaTypedLine(part)) return true;
                      const dPart = levenshteinDistance(a, normalizeRutaTypedLine(part));
                      const tolPart = mode === 'de' ? Math.max(1, Math.floor(part.length / 6)) : Math.max(2, Math.floor(part.length / 4));
                      if (dPart <= tolPart) return true;
                  }
              }
              /* También expandir "/" en la respuesta del usuario (por si escribe ambas separadas por /) */
              if (a.includes('/')) {
                  const aParts = a.split('/').map(p => p.trim()).filter(Boolean);
                  for (const aPart of aParts) {
                      if (checkRutaTranslateClose(aPart, b, mode)) return true;
                  }
              }
              const dist = levenshteinDistance(a, b);
              const tol = mode === 'de' ? Math.max(1, Math.floor(b.length / 6)) : Math.max(3, Math.floor(b.length / 4));
              return dist <= tol;
          };

          const checkRutaTranslateExercise = (exercise) => {
              if (!exercise) return false;
              const mode = exercise.type === 'translate_de' ? 'de' : 'es';
              const got = rutaFillInput || '';
              if (checkRutaTranslateClose(got, exercise.answer, mode)) return true;
              const bag = Array.isArray(exercise.acceptedAnswers) ? exercise.acceptedAnswers : [];
              for (let j = 0; j < bag.length; j++) {
                  if (checkRutaTranslateClose(got, bag[j], mode)) return true;
              }
              return false;
          };

          const checkRutaMcAnswer = (opt, exercise) => {
              if (!exercise) return { ok: false, soft: false };
              const o = String(opt || '').trim().toLowerCase().replace(/\s+/g, ' ');
              const primary = String(exercise.answer || '').trim().toLowerCase().replace(/\s+/g, ' ');
              const bag = new Set([primary, ...(Array.isArray(exercise.acceptedAnswers) ? exercise.acceptedAnswers.map((x) => String(x).trim().toLowerCase().replace(/\s+/g, ' ')) : [])].filter(Boolean));
              if (bag.has(o)) return { ok: true, soft: false };
              for (const c of bag) {
                  if (!c) continue;
                  const d = levenshteinDistance(o, c);
                  const tol = Math.max(1, Math.floor(c.length / 7));
                  if (d <= tol) return { ok: true, soft: true };
              }
              return { ok: false, soft: false };
          };

          const checkRutaFillAnswer = (exercise) => {
              if (!exercise) return false;
              const got = (rutaFillInput || '').trim().toLowerCase().replace(/\s+/g, ' ');
              const bag = new Set([String(exercise.answer || '').trim().toLowerCase(), ...(Array.isArray(exercise.acceptedAnswers) ? exercise.acceptedAnswers.map((x) => String(x).trim().toLowerCase()) : [])].filter(Boolean));
              /* Expandir "/" en el bag: si una respuesta contiene "/", aceptar cualquiera de las partes */
              const expandSlash = (w) => {
                  const out = new Set([w]);
                  if (w.includes('/')) {
                      w.split('/').map(p => p.trim()).filter(Boolean).forEach(p => out.add(p));
                  }
                  return out;
              };
              /* Añadir variantes umlaut para cada palabra del bag */
              const expandUmlaut = (w) => {
                  const out = new Set([w]);
                  if (/ä/.test(w)) out.add(w.replace(/ä/g, 'ae'));
                  if (/ö/.test(w)) out.add(w.replace(/ö/g, 'oe'));
                  if (/ü/.test(w)) out.add(w.replace(/ü/g, 'ue'));
                  if (/ß/.test(w)) out.add(w.replace(/ß/g, 'ss'));
                  if (/ae/.test(w)) out.add(w.replace(/ae/g, 'ä'));
                  if (/oe/.test(w)) out.add(w.replace(/oe/g, 'ö'));
                  if (/ue/.test(w)) out.add(w.replace(/ue/g, 'ü'));
                  if (/ss/.test(w)) out.add(w.replace(/ss/g, 'ß'));
                  return out;
              };
              const expandedBag = new Set();
              bag.forEach((w) => { expandSlash(w).forEach((v) => { expandUmlaut(v).forEach((u) => expandedBag.add(u)); }); });
              let hit = false;
              let fuzzy = false;
              for (const x of expandedBag) {
                  if (got === x) { hit = true; break; }
              }
              if (!hit) {
                  for (const x of expandedBag) {
                      if (!x) continue;
                      const d = levenshteinDistance(got, x);
                      if (d <= Math.max(1, Math.floor(x.length / 6))) { hit = true; fuzzy = true; break; }
                  }
              }
              if (hit) {
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true);
                  setRutaSpeakErr('');
                  setRutaFillTip(fuzzy ? (exercise.betterFormNote || `Correcto. En examen prioriza: «${exercise.answer}».`) : '');
                  return true;
              }
              window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false);
              setRutaFillTip('');
              setRutaSpeakErr(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Sigue practicando.');
              return false;
          };

          const checkRutaSpeakAnswer = (target, levelKey) => {
              const a = normalizeGermanSpeechText(rutaTranscript || '');
              const b = normalizeGermanSpeechText(target || '');
              if (!a || !b) { setRutaSpeakErr('Graba de nuevo con el micrófono.'); return false; }
              const dist = levenshteinDistance(a, b);
              const key = normalizeRutaLevelKey(levelKey || '');
              const factor = (key === 'A0' || key === 'A1') ? 4 : (key === 'A2' ? 5 : (key === 'B1' ? 6 : 7));
              const tol = Math.max(1, Math.floor(b.length / factor));
              if (a === b || dist <= tol) { window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true); setRutaSpeakErr(''); return true; }
              window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false);
              setRutaSpeakErr(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Casi — prueba otra vez.');
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

          const loadPdfStudyFile = useCallback(async (file) => {
              if (!file) return;
              if (!window.pdfjsLib || typeof window.pdfjsLib.getDocument !== 'function') {
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
              setPdfStudyBusyMsg('Leyendo PDF⬦');
              pdfStudyBufferRef.current = null;
              pdfStudyDocHandleRef.current = null;
              try {
                  window.pdfjsLib.GlobalWorkerOptions.workerSrc = MULLER_PDFJS_WORKER_URL;
                  const buffer = await file.arrayBuffer();
                  pdfStudyBufferRef.current = buffer;
                  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
                  pdfStudyDocHandleRef.current = pdf;
                  const totalPages = Math.max(1, Number(pdf.numPages) || 1);
                  const pages = [];
                  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                      setPdfStudyBusyMsg(`Extrayendo página ${pageNum}/${totalPages}⬦`);
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
                  setPdfStudyBusyMsg(`PDF listo: ${extractedCount}/${compactPages.length} páginas con texto.`);
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
                  setPdfStudyBusyMsg('Esta página ya tiene texto; OCR no es necesario.');
                  return;
              }
              if (typeof Tesseract === 'undefined') {
                  setPdfStudyErr('No se pudo cargar OCR (Tesseract).');
                  return;
              }
              if (!window.pdfjsLib || typeof window.pdfjsLib.getDocument !== 'function') {
                  setPdfStudyErr('OCR PDF no disponible en este navegador.');
                  return;
              }
              if (!pdfStudyBufferRef.current && !pdfStudyDocHandleRef.current) {
                  setPdfStudyErr('Para OCR real de página, vuelve a subir el PDF en esta sesión.');
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
                          setPdfStudyBusyMsg(`Preparando OCR página ${safePage}${attemptNo > 0 ? ` (reintento ${attemptNo}/${attemptCap - 1})` : ''}⬦`);
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
                              setPdfStudyBusyMsg(`OCR página ${safePage}: intento ${attempt + 1}/${scales.length}${attemptNo > 0 ? ` · retry ${attemptNo}` : ''}⬦`);
                              worker = await Tesseract.createWorker('deu', 1, {
                                  logger: (m) => {
                                      if (m && m.status === 'recognizing text' && typeof m.progress === 'number') {
                                          setPdfStudyBusyMsg(`OCR página ${safePage}: ${Math.round(100 * m.progress)}%`);
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
                              setPdfStudyErr('OCR sin texto. Prueba una página más nítida o con más contraste.');
                              setPdfStudyBusyMsg(`OCR página ${safePage}: sin texto detectado.`);
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
                          setPdfStudyBusyMsg(`OCR completado en página ${safePage}.`);
                          return;
                      } catch (attemptErr) {
                          if (worker) {
                              try { await worker.terminate(); } catch (e) {}
                              worker = null;
                          }
                          attemptNo += 1;
                          if (attemptNo >= attemptCap) throw attemptErr;
                          setPdfStudyBusyMsg(`OCR página ${safePage}: error temporal, reintentando⬦`);
                          await new Promise((resolve) => setTimeout(resolve, 220));
                      }
                  }
              } catch (err) {
                  setPdfStudyErr(err && err.message ? err.message : 'Error al ejecutar OCR de página.');
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
                  setPdfStudyErr('Página sin texto extraído todavía.');
                  return;
              }
              setReadingSource('paste');
              setReadingTextInput(txt);
              setPdfStudyBusyMsg(`Página ${page.page} enviada a Lectura.`);
              setPdfStudyLastApplied(`✓ Página ${page.page} cargada en Lectura`);
          }, [pdfStudyDoc]);

          const applyPdfStudyTextToWriting = useCallback((pageNumber) => {
              if (!pdfStudyDoc) return;
              const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
              const page = pdfStudyDoc.pages && pdfStudyDoc.pages[idx];
              const txt = page && page.text ? String(page.text).trim() : '';
              if (!txt) {
                  setPdfStudyErr('Página sin texto extraído todavía.');
                  return;
              }
              setActiveTab('escritura');
              setWritingMode('telc');
              setWritingTelcInputMode('keyboard');
              setWritingTelcTypedText(txt);
              setPdfStudyBusyMsg(`Página ${page.page} enviada a Escritura TELC.`);
              setPdfStudyLastApplied(`✓ Página ${page.page} cargada en Escritura TELC`);
          }, [pdfStudyDoc]);

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
          const activePdfPageNotes = useMemo(() => {
              const page = activePdfPageData && activePdfPageData.page ? Number(activePdfPageData.page) : 0;
              if (!page || !pdfStudyNotesByPage || typeof pdfStudyNotesByPage !== 'object') return { drawing: '', typed: '' };
              const entry = pdfStudyNotesByPage[String(page)] || {};
              return {
                  drawing: typeof entry.drawing === 'string' ? entry.drawing : '',
                  typed: typeof entry.typed === 'string' ? entry.typed : ''
              };
          }, [activePdfPageData, pdfStudyNotesByPage]);
          const pdfStudyCanvasPadKey = useMemo(() => {
              const basePage = Math.max(1, Number(activePdfPageData && activePdfPageData.page ? activePdfPageData.page : 1));
              const nonce = Math.max(0, Number(pdfStudyInkNonce) || 0);
              return (basePage * 1000) + nonce;
          }, [activePdfPageData, pdfStudyInkNonce]);

          const updatePdfPageNotes = useCallback((pageNumber, patch = {}) => {
              const safePage = Math.max(1, Number(pageNumber) || 1);
              setPdfStudyNotesByPage((prev) => {
                  const base = prev && typeof prev === 'object' ? prev : {};
                  const key = String(safePage);
                  const current = base[key] && typeof base[key] === 'object' ? base[key] : {};
                  const next = {
                      ...base,
                      [key]: {
                          ...current,
                          drawing: patch && typeof patch.drawing === 'string' ? patch.drawing : (typeof current.drawing === 'string' ? current.drawing : ''),
                          typed: patch && typeof patch.typed === 'string' ? patch.typed : (typeof current.typed === 'string' ? current.typed : ''),
                          updatedAt: new Date().toISOString()
                      }
                  };
                  try { localStorage.setItem(MULLER_PDF_NOTES_STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
          }, []);
          const clearPdfStudyDoc = useCallback(() => {
              setPdfStudyFullscreen(false);
              setPdfStudyDoc(null);
              setPdfStudyPageIdx(0);
              setPdfStudyErr('');
              setPdfStudyBusyMsg('PDF eliminado del panel.');
              setPdfStudyLastApplied('');
              setPdfStudyNotesByPage({});
              try { localStorage.removeItem(MULLER_PDF_STUDY_STORAGE_KEY); } catch (e) {}
              try { localStorage.removeItem(MULLER_PDF_NOTES_STORAGE_KEY); } catch (e) {}
              try {
                  setPdfStudyBlobUrl((prev) => {
                      if (prev) {
                          try { URL.revokeObjectURL(prev); } catch (e) {}
                      }
                      return '';
                  });
              } catch (e) {}
              pdfStudyBufferRef.current = null;
              pdfStudyDocHandleRef.current = null;
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
              pdfStudyBufferRef.current = null;
              pdfStudyDocHandleRef.current = null;
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
              setPdfStudyFullscreen(true);
          }, [pdfStudyDoc]);
          const closePdfStudyFullscreen = useCallback(() => {
              setPdfStudyFullscreen(false);
          }, []);
          const startRutaListen = async () => {
              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SpeechRecognition) { alert('Para leer en voz alta usa Chrome o Edge en escritorio.'); return; }
              const ok = await mullerEnsureMicPermission({ autoPrompt: true, showToast: true });
              if (!ok) { setRutaSpeakErr('No hay permiso de micrófono. Puedes continuar sin grabar.'); return; }
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
              return (savedScripts || []).map((s) => ({ id: String(s.id), title: s.title || 'Sin título' }));
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
              const chunks = String(readingTargetText || '').match(/[^.!?⬦\n]+[.!?⬦]?/g) || [];
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
                  if (window.__mullerToast) window.__mullerToast('Tu navegador no soporta reproducción de voz.', 'error');
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
              if (/[äöü]/.test(x)) return 'Atención a umlauts: ä (tipo e abierta), ö (o redondeada), ü (i con labios redondos).';
              if (x.includes('sch')) return 'sch suena como "sh".';
              if (x.includes('ch')) return 'ch no suena como "ch" español; en alemán suele ser más suave/gutural.';
              if (x.includes('ei')) return 'ei suena parecido a "ai".';
              if (x.includes('ie')) return 'ie suena como i larga.';
              if (x.includes('eu') || x.includes('äu')) return 'eu/äu suena parecido a "oi".';
              if (x.includes('z')) return 'z suena como "ts".';
              if (x.includes('v')) return 'En alemán muchas veces v suena como "f".';
              return 'Repite lento por sílabas, luego a velocidad normal.';
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
                          if (window.__mullerToast) window.__mullerToast('Permiso de micrófono no disponible.', 'error');
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
              // Evita que una grabación de una pestaña siga viva al cambiar a otra.
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
                  } else if (cleanWord.match(/^(?:[a-zäöüß]+)(?:en|eln|ern)$/i) && cleanWord.length > 3) {
                      const infinitive = cleanWord;
                      if (!processed.has(infinitive)) {
                          const base = infinitive.slice(0, -2);
                          const praet = base + 'te';
                          const perf = 'hat ' + infinitive;
                          foundVerbs.push({ infinitive, forms: `Prät: ${praet} | Perf: ${perf} (regular estimado)` });
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
                  return { touched: clean, infinitive: clean, forms: `Prät: ${base}te | Perf: hat ${clean} (regular estimado)` };
              }
              return null;
          }

          function inferTempusContextLabel(word) {
              const w = String(word || '').toLowerCase();
              if (!w) return '';
              if (w.startsWith('ge') && (w.endsWith('t') || w.endsWith('en'))) return 'Forma probable: Partizip II (Perfekt/Plusquamperfekt).';
              if (/(te|test|ten|tet)$/.test(w)) return 'Forma probable: Präteritum (regular).';
              if (/(st|t|en)$/.test(w)) return 'Forma probable: Präsens (según contexto/persona).';
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

          const speakRutaDe = (text, opts = {}) => {
              if (!text) return;
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance(text);
              u.lang = 'de-DE';
              u.onstart = () => setRutaTutorTalking(true);
              u.onend = () => {
                  setRutaTutorTalking(false);
                  if (typeof opts.onEnd === 'function') {
                      try { opts.onEnd(); } catch (e) {}
                  }
              };
              u.onerror = () => {
                  setRutaTutorTalking(false);
                  if (typeof opts.onError === 'function') opts.onError();
              };
              if (typeof window.__mullerApplyPreferredDeVoice === 'function') window.__mullerApplyPreferredDeVoice(u);
              else {
                  u.voice = rutaMentor === 'tom' ? getVoice('de', 'male') : getVoice('de', 'female');
              }
              if (rutaMentor === 'lena') { u.pitch = 1.12; u.rate = parseFloat(localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') || 0.92; }
              else if (rutaMentor === 'tom') { u.pitch = 0.88; u.rate = 0.9; }
              else { u.pitch = 1.32; u.rate = 0.96; }
              window.speechSynthesis.speak(u);
          };

          const speakRutaEs = (text, opts = {}) => {
              if (!text) return;
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance(text);
              u.lang = 'es-ES';
              u.onstart = () => setRutaTutorTalking(true);
              u.onend = () => {
                  setRutaTutorTalking(false);
                  if (typeof opts.onEnd === 'function') {
                      try { opts.onEnd(); } catch (e) {}
                  }
              };
              u.onerror = () => {
                  setRutaTutorTalking(false);
                  if (typeof opts.onError === 'function') opts.onError();
              };
              const all = window.speechSynthesis.getVoices();
              const esList = all.filter((v) => (v.lang || '').toLowerCase().startsWith('es'));
              const spain = esList.find((v) => /es[-_]es/i.test(v.lang || '')) || esList.find((v) => /España|Spain|Castellano/i.test((v.name || '') + (v.lang || ''))) || getVoice('es', 'female');
              u.voice = spain || esList[0] || all[0];
              u.rate = 0.9;
              u.pitch = 1.02;
              window.speechSynthesis.speak(u);
          };

          const clearRutaPodcastPlayback = () => {
              rutaPodcastPlaybackRef.current = { cancelled: true, line: 0, ex: null };
              window.speechSynthesis.cancel();
              setRutaPodcastUI(null);
          };

          const playRutaPodcastLine = () => {
              const ctx = rutaPodcastPlaybackRef.current;
              if (!ctx || !ctx.ex || !ctx.ex.podcast || ctx.cancelled) return;
              const { lines, checkpoints } = ctx.ex.podcast;
              const i = ctx.line;
              if (i >= lines.length) {
                  setRutaPodcastUI({ phase: 'done' });
                  setRutaRun((r) => (r ? { ...r, step: 2 } : r));
                  return;
              }
              const line = lines[i];
              const spoken = line.text;
              speakRutaDe(spoken, {
                  onEnd: () => {
                      if (rutaPodcastPlaybackRef.current.cancelled) return;
                      const next = i + 1;
                      const cp = (checkpoints || []).find((c) => c.afterLineIdx === next);
                      if (cp) {
                          rutaPodcastPlaybackRef.current.line = next;
                          setRutaPodcastUI({ phase: 'question', checkpoint: cp });
                          return;
                      }
                      rutaPodcastPlaybackRef.current.line = next;
                      setRutaPodcastUI({ phase: 'playing', line: next, checkpoint: null });
                      setTimeout(() => playRutaPodcastLine(), 160);
                  }
              });
          };

          const beginRutaPodcastFromExercise = (ex) => {
              if (!ex || !ex.podcast) return;
              rutaPodcastPlaybackRef.current = { cancelled: false, line: 0, ex };
              setRutaRun((r) => (r ? { ...r, podcastHadFailure: false, exerciseAttempts: 0, rutaLastChanceHint: '' } : r));
              setRutaPodcastUI({ phase: 'playing', line: 0, checkpoint: null });
              playRutaPodcastLine();
          };

          const resumeRutaPodcastAfterCheckpoint = () => {
              rutaPodcastPlaybackRef.current.cancelled = false;
              setRutaRun((r) => (r ? { ...r, exerciseAttempts: 0, rutaLastChanceHint: '' } : r));
              setRutaPodcastUI({ phase: 'playing', line: rutaPodcastPlaybackRef.current.line, checkpoint: null });
              setTimeout(() => playRutaPodcastLine(), 120);
          };

          useEffect(() => {
              const ex = rutaRun && Array.isArray(rutaRun.exercisePlan) ? rutaRun.exercisePlan[rutaRun.exerciseIdx || 0] : null;
              if (!ex) {
                  rutaAutoSpeakRef.current = '';
                  setRutaTutorTalking(false);
                  return;
              }
              const isLegacyAudio = (ex.type === 'podcast' || ex.type === 'audio_story') && !ex.podcast;
              const shouldAutoSpeak = (rutaRun.step || 0) === 0 && (ex.type === 'read' || ex.type === 'speak' || ex.type === 'translate_es' || isLegacyAudio);
              if (!shouldAutoSpeak) return;
              const key = `${ex.id}:${rutaRun.step || 0}`;
              if (rutaAutoSpeakRef.current === key) return;
              rutaAutoSpeakRef.current = key;
              const phrase = ex.type === 'speak'
                  ? ex.target
                  : ex.type === 'translate_es'
                      ? (ex.promptDe || '')
                      : isLegacyAudio
                          ? (Array.isArray(ex.transcript) ? ex.transcript.join(' ') : '')
                          : ex.de;
              if (phrase) speakRutaDe(phrase);
          }, [rutaRun && rutaRun.exerciseIdx, rutaRun && rutaRun.step, rutaRun && rutaRun.exercisePlan]);

          const stopAudio = () => { 
              window.speechSynthesis.cancel(); 
              if (timeoutRef.current) clearTimeout(timeoutRef.current); 
              setIsPlaying(false); 
              stopNoise(); // Detener ruido si está activo
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
                          alert("¡Historia terminada! Tienes fallos pendientes en Diktat. Iniciando Repaso.");
                          setIsReviewing(true); setReviewIndexPointer(0); setMode('dialogue'); resetModes();
                      } else {
                          stopAudio();
                          if (historiaPlaylistAllScripts && savedScripts.length > 0) {
                              alert('¡Has escuchado todos los guiones guardados en secuencia!');
                          } else {
                              alert("¡Has completado el guion!");
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
              if (!vocabTitleInput.trim()) { alert("Por favor, dale un título a la lección."); return; }
              if (!vocabTextInput.trim()) { alert("Por favor, pega el vocabulario."); return; }
              const lines = vocabTextInput.split(/\r?\n/);
              let parsedWords = [];
              const cleanStr = (str) => {
                  let s = str.replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, ''); 
                  s = s.replace(/[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]|\u{FE0F}/gu, ''); 
                  return s.trim();
              };
              lines.forEach(line => {
                  let text = line.trim().replace(/–/g, '-').replace(/—/g, '-');
                  if (!text) return;
                  let isDiff = false;
                  if (text.startsWith('1')) { isDiff = true; text = text.replace(/^1[.\-):\]]*\s*/, '').trim(); }
                  text = text.replace(/^[-*⬢+>]\s*/, '').trim();
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
                  alert(`¡Genial! Se ha guardado la lección "${vocabTitleInput}" con ${parsedWords.length} palabras.`);
              } else { alert("No pude detectar vocabulario válido. Pega texto para guardar."); }
          };

  const handleSaveScript = () => {
    if (!newScriptTitle.trim()) { alert("Dale un título al guion primero."); return; }
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
                        const cleanDe = parts[0].trim().replace(/[🔴🔵🟢•]/g, '');
                        vocab.push({ de: cleanDe, es: parts[1].trim(), diff: 1 });
                    }
                });
                content = content.replace(vocabMatch[0], '').trim();
            }

            // 4. Extraer Traducción (...)
            let translation = "Traducción no proporcionada";
            const transMatch = content.match(/\(([^)]+)\)/);
            if (transMatch) {
                translation = transMatch[1].trim();
                content = content.replace(transMatch[0], '').trim();
            }

            // 5. Alemán (limpio de círculos para el audio)
            const germanText = content.replace(/[🔴🔵🟢]/g, '').trim();

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
        alert("Error al procesar. Asegúrate de usar el formato: Nombre: Texto Alemán. (Traducción) [vocab-trad]"); 
    }
};

          const handleBxDistribToLevels = (target) => {
              const text = (bxImportText || '').trim() || (scriptInput || '').trim();
              if (!text) { alert('Pega texto en el cuadro de “Distribuir a B1/B2” o en el guion de arriba.'); return; }
              const flat = mullerBibliotecaFlatItems(text);
              if (flat.length === 0) { alert('No se detectaron frases. Usa formato Nombre: Alemán. (Traducción) o listas “alemán - español” por línea.'); return; }
              const z = () => ({ vocabulario: 0, verbos: 0, preposiciones: 0, conectores: 0, redemittel: 0 });
              let snap = null;
              setBxUserOverlay((prev) => {
                  const base = normalizeBxPayload(prev);
                  const c1 = z();
                  const c2 = z();
                  let nuevos = 0;
                  flat.forEach(({ cat, item, seg }) => {
                      const lv = target === 'auto' ? mullerGuessBibliotecaItemLevel(item, seg) : target;
                      const trickBase = 'Biblioteca · ' + cat + (target === 'auto' ? ' · nivel estimado ' + lv.toUpperCase() : ' · heurística local (sin IA)');
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
                      setBxImportSummary(`Nivel automático · B1: ${sum(snap.c1)} · B2: ${sum(snap.c2)} · nuevos: ${snap.nuevos} (detectados: ${snap.detectados})`);
                  } else {
                      const c = snap.target === 'b2' ? snap.c2 : snap.c1;
                      setBxImportSummary(`Todo a ${snap.target.toUpperCase()}: ${sum(c)} · nuevos: ${snap.nuevos} (detectados: ${snap.detectados})`);
                  }
              }
          };

          const clearBxUserOverlay = () => {
              if (!window.confirm('Esto borra solo lo que añadiste con «Distribuir texto» (tu biblioteca local). Las tarjetas del archivo b1-b2-database.json del proyecto no se quitan: seguirán viéndose en B1/B2. ¿Borrar tus aportaciones?')) return;
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
              if (!window.confirm(`¿Seguro? Se borrarán TODAS tus aportaciones en ${lab} (vocabulario, verbos, preposiciones, conectores y Redemittel). No se toca el archivo b1-b2-database.json.`)) return;
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
              if (!window.confirm(`¿Seguro? Se borran solo tus aportaciones en «${name}» (${lab}). El resto de categorías y el JSON base no se tocan.`)) return;
              setBxUserOverlay((prev) => {
                  const base = normalizeBxPayload(prev);
                  base[levelKey][catKey] = [];
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
              setBxIndex(0);
          };

          const mullerTranslateGtxFull = async (text, sl, tl) => {
              const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
              const r = await fetch(url);
              if (!r.ok) throw new Error('gtx');
              const data = await r.json();
              let out = '';
              if (data && data[0]) data[0].forEach((p) => { if (p && p[0]) out += p[0]; });
              const detected = data && data[2] != null ? String(data[2]) : '';
              return { text: out.trim(), detected };
          };

          const mullerTranslateViaGtx = async (text, sl, tl) => {
              const { text: out } = await mullerTranslateGtxFull(text, sl, tl);
              return out;
          };

          const mullerTranslateViaMyMemory = async (text, pair) => {
              const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(pair)}`);
              const j = await r.json();
              const st = j && j.responseStatus;
              if (!r.ok || (st != null && Number(st) !== 200 && st !== '200')) throw new Error('mm');
              return String((j.responseData && j.responseData.translatedText) || '').trim();
          };

        const mullerStoryClean = (t) => String(t || '').replace(/\s+/g, ' ').replace(/\s([,.;:!?])/g, '$1').trim();
        const mullerStorySimplifyGerman = (txt) => {
            return String(txt || '')
                .replace(/\bjedoch\b/gi, 'aber')
                .replace(/\bdennoch\b/gi, 'trotzdem')
                .replace(/\baufgrund\b/gi, 'wegen')
                .replace(/\bbeziehungsweise\b/gi, 'oder')
                .replace(/\baußerdem\b/gi, 'auch')
                .replace(/\binsbesondere\b/gi, 'vor allem')
                .replace(/\ballerdings\b/gi, 'aber')
                .replace(/\bdaher\b/gi, 'deshalb');
        };
        const mullerStoryStylizeGerman = (txt, level, tone) => {
            let out = mullerStoryClean(txt);
            if (!out) return '';
            if (tone === 'natural') out = out.replace(/\s,\s/g, ', ');
            if (tone === 'formal') {
                out = out
                    .replace(/\bich\b/g, 'Ich')
                    .replace(/\bwir\b/g, 'Wir')
                    .replace(/\bman\b/g, 'man');
            }
            if (level === 'A2') out = mullerStorySimplifyGerman(out);
            if (level === 'B1') out = mullerStorySimplifyGerman(out).replace(/\bwelche[rnms]?\b/gi, 'die');
            return out;
        };
        const mullerStorySplitScenes = (deText, esText) => {
            const deParts = String(deText || '').split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
            const esParts = String(esText || '').split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
            const out = deParts.slice(0, 14).map((line, i) => ({
                speaker: i % 2 === 0 ? 'Lukas' : 'Elena',
                text: line,
                translation: esParts[i] || ''
            }));
            return out.length ? out : [{ speaker: 'Lukas', text: mullerStoryClean(deText), translation: mullerStoryClean(esText) }];
        };
        const mullerStoryGlossary = (deText) => {
            const words = String(deText || '')
                .toLowerCase()
                .replace(/[^a-zäöüß\s-]/gi, ' ')
                .split(/\s+/)
                .map((w) => w.trim())
                .filter((w) => w.length >= 6 && !/^\d+$/.test(w));
            const unique = Array.from(new Set(words)).slice(0, 10);
            return unique.map((w) => ({ de: w, es: '(revísalo en Lexikon)' }));
        };

          const mullerLexikonApplyPairsFromTranslate = (sourceText, translated, detectedLang, targetLang) => {
              const d = String(detectedLang || '').toLowerCase();
              const t = String(targetLang || '').toLowerCase();
              const outClean = String(translated || '').replace(/^\(sin resultado\)$/, '');
              const src = String(sourceText || '').trim();
              if (!outClean) return;
              if (t === 'de') {
                  if (d === 'de' || d.startsWith('de')) {
                      setLexikonPairDe(src);
                      setLexikonPairEs(outClean);
                  } else {
                      setLexikonPairEs(src);
                      setLexikonPairDe(outClean);
                  }
              } else if (t === 'es') {
                  if (d === 'de' || d.startsWith('de')) {
                      setLexikonPairDe(src);
                      setLexikonPairEs(outClean);
                  } else {
                      setLexikonPairEs(src);
                      setLexikonPairDe(outClean);
                  }
              }
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
                  alert('No se pudo completar la búsqueda (red o bloqueo). Prueba otra vez.');
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
                      setLexikonTransOut('Error de traducción. Comprueba la conexión.');
                  }
              } finally {
                  setLexikonTransLoading(false);
              }
          };

          const runHistoriasProOcr = async (file) => {
              if (!file) return;
              if (typeof Tesseract === 'undefined') {
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
              const title = `Historias Pro · ${storiesProLevel} · ${new Date().toLocaleDateString()}`;
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
              if (!d || !e) { alert('Falta alemán o español.'); return; }
              let lessonId = lexikonSaveLessonId;
              if (lessonId === '__new__') {
                  const t = (lexikonNewLessonTitle || '').trim() || `Lexikon ${new Date().toLocaleDateString()}`;
                  const newLesson = { id: Date.now().toString() + Math.random().toString(36).slice(2, 9), title: t, words: [{ de: d, es: e, diff: 0 }] };
                  const updated = [...customVocabLessons, newLesson];
                  setCustomVocabLessons(updated);
                  try { localStorage.setItem('mullerCustomVocab', JSON.stringify(updated)); } catch (err) {}
                  setLexikonSaveLessonId(newLesson.id);
                  setLexikonNewLessonTitle('');
                  alert(`Guardado en nueva lección: «${t}». Puedes practicarla en Vocab.`);
                  return;
              }
              if (!lessonId) { alert('Elige una lección o «Nueva lección⬦».'); return; }
              setCustomVocabLessons((prev) => {
                  let hit = false;
                  const next = prev.map((l) => {
                      if (l.id !== lessonId) return l;
                      hit = true;
                      if (l.words.some((w) => w.de === d && w.es === e)) return l;
                      return { ...l, words: [...l.words, { de: d, es: e, diff: 0 }] };
                  });
                  if (!hit) {
                      alert('No se encontró esa lección.');
                      return prev;
                  }
                  try { localStorage.setItem('mullerCustomVocab', JSON.stringify(next)); } catch (err) {}
                  return next;
              });
              alert('Palabra añadida a la lección.');
          };

          const handleBxUserCardDelete = () => {
              const item = bxCurrentList[bxIndex];
              if (!item || !item._mullerUser || !item._mullerUid) return;
              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
              let srcCat = bxCategory === 'mix' ? (item._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, item._mullerUid)) : bxCategory;
              if (!srcCat) {
                  alert('No se encontró la categoría de esta tarjeta.');
                  return;
              }
              if (!window.confirm('¿Eliminar esta tarjeta solo de tu biblioteca local?')) return;
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
                  alert('No se encontró la categoría de origen.');
                  return;
              }
              const toCat = bxMoveTargetCat;
              if (srcCat === toCat) {
                  alert('Elige otra categoría distinta.');
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
                  alert('Pega un texto más largo o usa “Cargar escena actual”.');
                  return;
              }
              if (!('Summarizer' in self)) {
                  setChromeAiLine('Tu navegador no expone la API Summarizer. Usa Google Chrome 138+ en escritorio con IA integrada (Gemini Nano). En Edge puede ir detrás de flags; revisa la documentación de Built-in AI.');
                  setChromeAiOut('');
                  return;
              }
              setChromeAiBusy(true);
              setChromeAiOut('');
              setChromeAiLine('Comprobando⬦');
              try {
                  const Summarizer = self.Summarizer;
                  const availability = await Summarizer.availability();
                  if (availability === 'unavailable') {
                      setChromeAiLine('Gemini Nano no disponible en este equipo (requisitos de hardware, espacio ~22 GB libres en el perfil de Chrome, o política).');
                      setChromeAiBusy(false);
                      return;
                  }
                  setChromeAiLine('Preparando modelo local (la primera vez puede descargarse)⬦');
                  const summarizer = await Summarizer.create({
                      type: 'key-points',
                      format: 'markdown',
                      length: 'short',
                      expectedInputLanguages: ['de', 'en'],
                      outputLanguage: 'es',
                      sharedContext: 'Estudiante de alemán TELC; resúmenes claros en español.',
                      monitor(m) {
                          m.addEventListener('downloadprogress', (e) => {
                              const p = typeof e.loaded === 'number' ? Math.round(e.loaded * 100) : 0;
                              setChromeAiLine('Descarga del modelo en tu PC⬦ ' + p + '%');
                          });
                      }
                  });
                  setChromeAiLine('Generando resumen (proceso local)⬦');
                  const summary = await summarizer.summarize(text, { context: 'Texto o diálogo en alemán para estudio.' });
                  setChromeAiOut(typeof summary === 'string' ? summary : String(summary));
                  setChromeAiLine('Listo: sin enviar datos a los servidores de Müller.');
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
                  alert('Este guion no tiene id interno; recarga la página y prueba de nuevo.');
                  return;
              }
              if (!window.confirm('¿Eliminar este guion de la lista?')) return;
              const stripBx = window.confirm(
                  '¿Quitar también de B1/B2 las frases que añadiste con «Distribuir texto» mientras tenías cargado este guion en Historia?\n\n' +
                  '(Solo afecta a tarjetas nuevas vinculadas a este guion. Las que enviaste antes sin esta vinculación, o el contenido del archivo b1-b2-database.json, no se tocan.)'
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
                      { speaker: 'Erzähler', text: 'Es war ein kalter Morgen in der großen Stadt.', translation: 'Era una fría mañana en la gran ciudad.' },
                      { speaker: 'Lukas', text: 'Ich muss heute so viel erledigen. Wo fange ich an?', translation: 'Tengo tanto que hacer hoy. ¿Por dónde empiezo?' },
                      { speaker: 'Anna', text: 'Vergiss nicht, dass wir später zusammen essen gehen.', translation: 'No olvides que luego vamos a comer juntos.' },
                      { speaker: 'Lukas', text: 'Natürlich nicht! Ich habe den Tisch schon reserviert.', translation: '¡Por supuesto que no! Ya he reservado la mesa.' },
                      { speaker: 'Anna', text: 'Das ist wunderbar. Ich freue mich wirklich darauf.', translation: 'Eso es maravilloso. De verdad me alegro de ello.' },
                      { speaker: 'Erzähler', text: 'Später am Abend trafen sie sich im neuen Restaurant.', translation: 'Más tarde en la noche se encontraron en el nuevo restaurante.' },
                      { speaker: 'Kellner', text: 'Guten Abend! Was darf ich Ihnen heute bringen?', translation: '¡Buenas tardes! ¿Qué les puedo traer hoy?' },
                      { speaker: 'Lukas', text: 'Wir hätten gerne die Speisekarte und ein Wasser, bitte.', translation: 'Nos gustaría la carta y un agua, por favor.' },
                      { speaker: 'Anna', text: 'Und ich hätte gerne ein Glas Rotwein.', translation: 'Y a mí me gustaría una copa de vino tinto.' },
                      { speaker: 'Kellner', text: 'Kommt sofort! Haben Sie schon gewählt?', translation: '¡Enseguida! ¿Ya han elegido?' }
                  ];
                  if (wordsArray.length > 0) {
                      wordsArray.forEach((word, index) => {
                          let i = (index + 1) * 2; 
                          if (i >= mockLongStory.length) i = mockLongStory.length - 1;
                          mockLongStory.splice(i, 0, {
                              speaker: 'Anna', text: `Übrigens, erinnerst du dich an ${word}? Das war eine interessante Erfahrung.`,
                              translation: `Por cierto, ¿te acuerdas de ${word}? Fue una experiencia interesante.`,
                              vocab: [{ de: word, es: 'Palabra Custom', diff: 1 }]
                          });
                      });
                  }
                  setGuionData(mockLongStory); setActiveScriptTitle(`AI Generated: ${aiLevel} - ${aiTheme}`);
                  setIsDefaultScript(false); setActiveSavedScriptId(null); setSceneIndex(0); setMode('dialogue'); stopAudio(); resetModes(); setIsReviewing(false);
                  setIsGeneratingStory(false); setActiveTab('historia'); setAiCustomWords(""); 
              }, 3000);
          };

          const sanitizeHistoriaSpeechText = (text) => {
              return String(text || '')
                  .replace(/\[R\]/gi, '')
                  .replace(/\bN[üu]tzlich\b\.?/gi, '')
                  .replace(/\b[ÚU]TIL\b\.?/gi, '')
                  .replace(/\s{2,}/g, ' ')
                  .trim();
          };

          const playSceneAudio = (text, speaker) => {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = 'de-DE';
              if (speaker === 'Lukas') { utterance.voice = getVoice('de', 'male'); utterance.pitch = 1.1; } 
              else if (speaker === 'Elena' || speaker === 'Anna') { utterance.voice = getVoice('de', 'female'); utterance.pitch = 1.2; } 
              else if (speaker.includes('Weber') || speaker === 'Professor' || speaker === 'Erzähler') { utterance.voice = getVoice('de', 'male', true); utterance.pitch = 0.8; } 
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
           // Limpiamos el texto de símbolos que el motor de voz lee por error (.;)
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
                const esUtter = new SpeechSynthesisUtterance(currentScene.translation || "Traducción no disponible");
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
              if (found) { saveProgress({ difficultGrammar: newGrammar }); alert("¡Estructura automática detectada y guardada en tu mazo!"); } 
              else { setShowGrammarPrompt(true); }
          };

          const handleCustomGrammarSave = () => {
              if(!customGrammarInput.trim()) return;
              const text = guionData[getActualSceneIndex()].text;
              const translation = guionData[getActualSceneIndex()].translation || "";
              let newGrammar = [...userStats.difficultGrammar];
              newGrammar.push({ base: customGrammarInput, exampleDe: text, exampleEs: translation });
              saveProgress({ difficultGrammar: newGrammar });
              setShowGrammarPrompt(false); setCustomGrammarInput(""); alert("¡Estructura personalizada guardada con éxito!");
          };

          const generateTutorFeedback = (text) => {
              let feedback = [];
              const tLower = text.toLowerCase();
              if (tLower.match(/\b(weil|dass|obwohl|wenn|als|damit|ob|bevor|nachdem)\b/i)) feedback.push("🟣 **Nebensatz (Subordinada):** Has usado un conector subordinante. El verbo conjugado va a la última posición de la frase.");
              if (tLower.match(/\b(deshalb|deswegen|darum|trotzdem|dann|danach|außerdem)\b/i)) feedback.push("🟠 **Hauptsatz (Inversión):** Conector en Posición 1. Inmediatamente después tiene que ir el verbo (Pos 2), y luego el sujeto.");
              if (tLower.match(/\b(und|aber|oder|denn|sondern)\b/i)) feedback.push("🟢 **Conector ADUSO (Posición 0):** Une dos frases sin alterar el orden normal (Sujeto + Verbo).");
              if (tLower.match(/\b(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\b.*\b(ge[a-zäöüß]+t|ge[a-zäöüß]+en|.+[ie]rt)\b/i)) feedback.push("🕰️ **Perfekt:** Auxiliar (haben/sein) en Posición 2 y Participio al final.");
              if (tLower.match(/\b(wurde|wurdest|wurden|wurdet|war|warst|waren|wart|hatte|hattest|hatten|hattet|gab|musste|konnte|wollte|sollte|durfte)\b/i) && !tLower.match(/\b(worden)\b/i)) feedback.push("📖 **Präteritum:** Pasado simple. Usado para verbos auxiliares, modales o narración.");
              if (tLower.match(/\b(wurde|worden)\b/i) || (tLower.match(/\b(werden|wird|werden|werdet)\b/i) && tLower.match(/\b(ge[a-zäöüß]+t|ge[a-zäöüß]+en)\b/i))) feedback.push("🏛️ **Passiv:** 'Werden' + Participio II. Lo importante es la acción, no el sujeto.");
              if (tLower.match(/\b(muss|musst|müssen|kann|kannst|können|darf|darfst|dürfen|soll|sollst|sollen|will|willst|wollen|möchte|möchtest|möchten)\b/i)) feedback.push("💪 **Modalverben:** Verbo modal en Pos 2, obliga al verbo principal en Infinitivo al final.");
              if (tLower.match(/\b(an|ein|auf|zu|mit|aus|vor|nach|ab|her|hin|los|teil)\s*[.,!?]*$/i)) feedback.push("✂️ **Trennbare Verben:** El prefijo del verbo se ha separado al final de la frase.");
              if (tLower.match(/\b(aus|bei|mit|nach|seit|von|zu|ab)\b/i)) feedback.push("🔵 **Dativo (Preposición):** Preposición que rige Dativo estricto.");
              if (tLower.match(/\b(durch|für|gegen|ohne|um)\b/i)) feedback.push("🔴 **Acusativo (Preposición):** Preposición que rige Acusativo estricto.");
              if (tLower.match(/\b(in|an|auf|neben|hinter|über|unter|vor|zwischen)\b/i)) feedback.push("🟡 **Wechselpräposition:** Rige Dativo (Wo?) o Acusativo (Wohin?).");
              GRAMMAR_PATTERNS.forEach(p => { if (text.match(p.regex)) feedback.push(`🌟 **Verbo con Preposición Fija:** ${p.tooltip}.`); });
              return feedback.join("\n\n") || "🟢 **Hauptsatz:** Estructura estándar perfecta.";
          };

          const showAITutor = () => {
              setTutorMessage(generateTutorFeedback(guionData[getActualSceneIndex()].text));
              setShowTutor(true);
          };

          const handleDiktatCheck = () => {
              if (!diktatInput.trim()) { alert("Por favor, escribe lo que has escuchado primero."); return; }
              setShowDiktatResult(true);
              const cleanText = (t) => t.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[.,!?]/g, '').trim();
              const originalText = cleanText(guionData[getActualSceneIndex()].text);
              const typedText = cleanText(diktatInput);
              if (originalText !== typedText) {
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false);
                  setDiktatMotivationMsg(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Sigue intentándolo.');
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
              if (!SpeechRecognition) { alert("Tu navegador no soporta esta función. Usa Google Chrome."); return; }
              const ok = await mullerEnsureMicPermission({ autoPrompt: true, showToast: true });
              if (!ok) {
                  setGrammarPolizeiMsg('Sin permiso de micrófono. Puedes seguir con texto y audio.');
                  return;
              }
              if (recognitionRef.current) {
                  try { recognitionRef.current.stop(); } catch (e) {}
              }
              const recognition = new SpeechRecognition();
              recognition.lang = 'de-DE';
              const mobileStt = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || ''));
              /* continuous: una sola sesión por pulsación; en móvil interimResults=false reduce duplicados del motor */
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
                              else if (cur.startsWith(f) && f.length < cur.length) { /* mantener frase más larga */ }
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
                      alert("Permiso de micrófono denegado. Activa el mic en la barra del navegador.");
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
                      setGrammarPolizeiMsg("No se detectó voz. Comprueba el micrófono o habla más cerca.");
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
                  polizeiMsg = "🚨 Grammatik-Polizei: Has external DATIVO en vez de GENITIVO. -1 ❤️";
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
              const cleanDeAudio = currentVocab.de.replace(/^[0-9]+[.\-):\]]*\s*/g, '').replace(/^[a-zA-ZäöüßÄÖÜ]{1,10}\s*[.:]\s*/g, '').replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]|\u{FE0F}/gu, '').trim();
              const cleanEsAudio = currentVocab.es.replace(/^[0-9]+[.\-):\]]*\s*/g, '').replace(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]{1,10}\s*[.:]\s*/g, '').replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]|\u{FE0F}/gu, '').trim();
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
                setCelebrationModal({ title: '¡Lista completada!', subtitle: 'Has repasado todas las tarjetas de esta sesión.', xp: 15, coins: 10 });
                saveProgress({ xp: userStats.xp + 15, coins: userStats.coins + 10, activityByDay: mergeActivityPoints(35) });
                setActiveTab('guiones');
            }
          };

          const startPractice = (type) => {
              if (type === 'diff' && (!userStats.difficultVocab || userStats.difficultVocab.length === 0)) { alert("Tu mazo de Vocabulario Difícil está vacío."); return; }
              if (type === 'norm' && (!userStats.normalVocab || userStats.normalVocab.length === 0)) { alert("Tu mazo de Vocabulario Normal está vacío."); return; }
              if (type === 'grammar' && (!userStats.difficultGrammar || userStats.difficultGrammar.length === 0)) { alert("Tu mazo de Gramática está vacío."); return; }
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
                  setCelebrationModal({ title: '¡Sesión de mazos!', subtitle: '+20 XP · +5 monedas', xp: 20, coins: 5 });
                  saveProgress({ xp: userStats.xp + 20, coins: userStats.coins + 5, activityByDay: mergeActivityPoints(30) });
                  setPracticeActive(null);
              }
          };

          const getArticleVisual = (word) => {
            if (!word) return null;
            if (word.startsWith('der ')) return <span className="text-blue-400 mr-2">🔵</span>;
            if (word.startsWith('die ')) return <span className="text-red-400 mr-2">🔴</span>;
            if (word.startsWith('das ')) return <span className="text-green-400 mr-2">🟢</span>;
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
                   const regex = new RegExp(`(?![^<]*>)(^|[^a-zäöüßA-ZÄÖÜáºž])(${safeWord})([^a-zäöüßA-ZÄÖÜáºž]|$)`, 'gi');
                   if (lueckentextMode) htmlText = htmlText.replace(regex, `$1<span class="bg-gray-800 text-transparent border-b border-yellow-500/70 rounded px-3 mx-1 select-none" title="${v.es}">[ ??? ]</span>$3`);
                   else htmlText = htmlText.replace(regex, `$1<span class="bg-amber-500/20 text-amber-100 border-b border-amber-400/60 px-1 mx-0.5 rounded-sm font-bold shadow-sm" title="Traducción: ${v.es}">$2</span>$3`);
                });
            }
            GRAMMAR_PATTERNS.forEach(p => { htmlText = htmlText.replace(p.regex, `<span class="bg-cyan-800/40 text-cyan-200 border-b border-cyan-400/60 px-1 mx-0.5 rounded-sm shadow-sm" title="${p.tooltip}">$1</span>`); });
            if (tempusMode) {
                Object.keys(TEMPUS_DICT).forEach(verb => {
                    const safeVerb = verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`(?![^<]*>)\\b(${safeVerb})\\b`, 'gi');
                    htmlText = htmlText.replace(regex, `<span class="tempus-clickable text-blue-100 font-bold underline decoration-blue-400/70 decoration-2 underline-offset-4 cursor-pointer px-0.5 rounded" data-tempus-verb="$1" title="Toca para ver infinitivo y tiempos">$1</span>`);
                });
                const genericInfRegex = /(?![^<]*>)\b([a-zäöüß]{4,}(?:en|eln|ern))\b/gi;
                htmlText = htmlText.replace(genericInfRegex, `<span class="tempus-clickable text-blue-100 font-bold underline decoration-blue-400/70 decoration-2 underline-offset-4 cursor-pointer px-0.5 rounded" data-tempus-verb="$1" title="Toca para ver infinitivo y tiempos">$1</span>`);
            }
            const connRegex = new RegExp(`(?![^<]*>)\\b(${CONN_LIST.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(connRegex, `<span class="text-purple-300 font-bold underline decoration-purple-500/70 decoration-2 underline-offset-4" title="Conector">$1</span>`);
            const datRegex = new RegExp(`(?![^<]*>)\\b(${PREP_DAT.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(datRegex, `<span class="text-blue-300 font-bold underline decoration-blue-500/70 decoration-2 underline-offset-4" title="Preposición Dativo (Estático)">$1</span>`);
            const akkRegex = new RegExp(`(?![^<]*>)\\b(${PREP_AKK.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(akkRegex, `<span class="text-red-300 font-bold underline decoration-red-500/70 decoration-2 underline-offset-4" title="Preposición Acusativo (Movimiento)">$1</span>`);
            const wechRegex = new RegExp(`(?![^<]*>)\\b(${PREP_WECHSEL.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(wechRegex, `<span class="text-yellow-500/90 font-bold underline decoration-yellow-600/70 decoration-2 underline-offset-4" title="Wechselpräposition (Mixta)">$1</span>`);
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
              const cleanWord = (w) => w.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[.,!?]/g, '').trim();
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
                if (!userStats.difficultVocab || userStats.difficultVocab.length === 0) { alert("Vacío."); return; }
                userStats.difficultVocab.forEach((v) => { csvContent += `"${v.de}","${v.es}<br><small>TELC B1</small>","Dificil"\r\n`; });
            } else if (type === 'vocab_norm') {
                if (!userStats.normalVocab || userStats.normalVocab.length === 0) { alert("Vacío."); return; }
                userStats.normalVocab.forEach((v) => { csvContent += `"${v.de}","${v.es}<br><small>TELC B1</small>","Repaso"\r\n`; });
            } else {
                if (!userStats.difficultGrammar || userStats.difficultGrammar.length === 0) { alert("Vacío."); return; }
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
                    <h1>📝 ${escPdf(activeScriptTitle)}</h1>
                    <p class="meta"><strong>Müller</strong> · Entrenador alemán TELC · ${escPdf(genDate)} · ${totalScenes} escena${totalScenes === 1 ? '' : 's'}</p>
            `;
            let uniqueGrammarRules = new Set();
            guionData.forEach((scene, sceneIdx) => {
                let deText = scene.text;
                const feedback = generateTutorFeedback(deText);
                if (feedback && !feedback.includes("Estructura estándar perfecta")) {
                    feedback.split('\n\n').forEach(f => uniqueGrammarRules.add(f));
                }
                if (scene.vocab) {
                    const sortedVocab = [...scene.vocab].sort((a, b) => b.de.length - a.de.length);
                    sortedVocab.forEach(v => {
                        let searchWord = v.de.replace(/^(der|die|das|sich)\s/i, '').trim();
                        const safeWord = searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const regex = new RegExp(`(?![^<]*>)(^|[^a-zäöüßA-ZÄÖÜáºž])(${safeWord})([^a-zäöüßA-ZÄÖÜáºž]|$)`, 'gi');
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
                    ? `<div class="block-es"><div class="label-row label-es">Español · traducción</div><p class="text-es">${escPdf(tr)}</p></div>`
                    : `<div class="block-es"><div class="label-row label-es">Español · traducción</div><p class="text-es text-es-empty">(Sin traducción en esta línea del guion — puedes añadirla en Biblioteca al editar.)</p></div>`;
                const vocabHtml = scene.vocab && scene.vocab.length > 0
                    ? `<div class="vocab-box">📖 Vocabulario: ${scene.vocab.map((v) => `${escPdf(v.de)} → ${escPdf(v.es)}`).join(' · ')}</div>`
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
                htmlContent += `<div class="grammar-summary"><h2>🧠 Análisis Gramatical del Guion</h2><ul>`;
                uniqueGrammarRules.forEach(rule => { let cleanRule = rule.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); htmlContent += `<li>${cleanRule}</li>`; });
                htmlContent += `</ul></div>`;
            }
            htmlContent += `
                <div class="legend">
                    <h3>Leyenda de marcas en el alemán</h3>
                    <ul>
                        <li><strong>Resaltado amarillo:</strong> ítems del vocabulario de la escena.</li>
                        <li><strong>Cyan (fondo):</strong> verbos con preposición detectados.</li>
                        <li><strong>Subrayados de color:</strong> conectores; preposiciones con Dativ / Akkusativ / Wechsel.</li>
                        <li><strong>Etiquetas moradas (Tempus):</strong> referencia de formas verbales (Prät/Perf).</li>
                    </ul>
                </div>
                <div class="footer">Müller · TELC · ¡Viel Erfolg beim Deutschlernen!</div>
                <script>window.onload = function() { window.print(); }<\/script></body></html>`;
            printWindow.document.write(htmlContent);
            printWindow.document.close();
          };

          const exportProgressPDF = () => {
            const printWindow = window.open('', '_blank');
            if (!printWindow) { alert("Por favor, permite las ventanas emergentes (pop-ups) en tu navegador para generar el PDF."); return; }
            const htmlContent = `
                <html><head><title>Mi Resumen de Alemán - Profesor Müller</title><style>body { font-family: 'Segoe UI', sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; } h1 { color: #2563eb; text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 15px; } h2 { color: #0f172a; margin-top: 40px; } table { width: 100%; border-collapse: collapse; margin-top: 15px; } th, td { border: 1px solid #94a3b8; padding: 12px; } th { background-color: #f1f5f9; } .diff { color: #dc2626; font-weight: bold; } .norm { color: #2563eb; } .grammar-base { color: #0891b2; }</style></head><body>
                <h1>📚 Resumen de Estudio - B1/B2</h1>
                <div><h2>🔴 Vocabulario Difícil</h2>${userStats.difficultVocab?.length ? `<table><tr><th>Alemán</th><th>Español</th></tr>${userStats.difficultVocab.map(v => `<tr><td class="diff">${v.de}</td><td>${v.es}</td></tr>`).join('')}</table>` : '<p>Vacío.</p>'}</div>
                <div><h2>🔵 Vocabulario Normal</h2>${userStats.normalVocab?.length ? `<table><tr><th>Alemán</th><th>Español</th></tr>${userStats.normalVocab.map(v => `<tr><td class="norm">${v.de}</td><td>${v.es}</td></tr>`).join('')}</table>` : '<p>Vacío.</p>'}</div>
                <div><h2>🧠 Reglas Gramaticales</h2>${userStats.difficultGrammar?.length ? `<table><tr><th>Regla</th><th>Ejemplo</th><th>Traducción</th></tr>${userStats.difficultGrammar.map(g => `<tr><td class="grammar-base">${g.base}</td><td><i>"${g.exampleDe}"</i></td><td>${g.exampleEs}</td></tr>`).join('')}</table>` : '<p>Vacío.</p>'}</div>
                <script>window.onload = function() { window.print(); }<\/script></body></html>
            `;
            printWindow.document.write(htmlContent);
            printWindow.document.close();
          };

          // COLORES DE FONDO SUAVIZADOS (Corrección) + temas UI
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
