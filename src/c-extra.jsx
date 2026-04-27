// ========== MÃ“DULO COMPLETO Y DEFINITIVO (4 PESTAÃ‘AS + AUDIOLIBRO REAL) ==========
// No modifica nada del código original, solo añade funcionalidad.

// -------------------- DATOS DE RESPALDO --------------------
const DEFAULT_PLURALS = [
    { singular: "der Tisch", plural: "die Tische", regla: "+e" },
    { singular: "die Lampe", plural: "die Lampen", regla: "+n" },
    { singular: "das Buch", plural: "die Bücher", regla: "¨+er" }
];
const DEFAULT_VERBPREP = [
    { verbo: "warten", preposicion: "auf", ejemplo: "Ich warte auf den Bus." },
    { verbo: "sich interessieren", preposicion: "für", ejemplo: "Ich interessiere mich für Kunst." },
    { verbo: "denken", preposicion: "an", ejemplo: "Ich denke an dich." }
];
const DEFAULT_PREPOSITIONS = [
    { preposicion: "aus", caso: "Dativ", ejemplo: "Ich komme aus Spanien." },
    { preposicion: "für", caso: "Akkusativ", ejemplo: "Das Geschenk ist für dich." },
    { preposicion: "in", caso: "Wechsel", ejemplo: "Ich bin in der Stadt (Dativ) / Ich gehe in die Stadt (Akkusativ)." }
];

// -------------------- EXTRACTORES (guardan en localStorage) --------------------
function extractPluralsFromGuion(guionData, scriptTitle) {
    if (!guionData || !Array.isArray(guionData)) return;
    let existing = JSON.parse(localStorage.getItem('muller_extracted_plurals') || '[]');
    guionData.forEach(scene => {
        const text = scene.text;
        const matches = text.match(/\bdie\s+([A-ZÃ„Ã–Ãœ][a-zÃ¤Ã¶Ã¼ÃŸ]+(?:e|er|en|n|s)?)\b/g) || [];
        matches.forEach(m => {
            const plural = m.replace('die ', '');
            let singular = plural.replace(/[äöü]/g, c => ({'ä':'a','ö':'o','ü':'u'}[c]));
            singular = singular.replace(/(e|er|n|en|s)$/, '');
            if (singular && !existing.find(p => p.plural === plural)) {
                existing.push({ singular, plural, example: text, scriptTitle, regla: 'extraído' });
            }
        });
    });
    localStorage.setItem('muller_extracted_plurals', JSON.stringify(existing));
}

function extractVerbPrepsFromGuion(guionData, scriptTitle) {
    let existing = JSON.parse(localStorage.getItem('muller_extracted_verbprep') || '[]');
    const patterns = DEFAULT_VERBPREP.map(v => ({ verbo: v.verbo, prep: v.preposicion }));
    guionData.forEach(scene => {
        const text = scene.text;
        patterns.forEach(p => {
            if (text.includes(p.verbo) && text.includes(p.prep)) {
                if (!existing.find(v => v.verbo === p.verbo)) {
                    existing.push({ ...p, ejemplo: text, scriptTitle });
                }
            }
        });
    });
    localStorage.setItem('muller_extracted_verbprep', JSON.stringify(existing));
}

function extractPrepositionsFromGuion(guionData, scriptTitle) {
    let existing = JSON.parse(localStorage.getItem('muller_extracted_prepositions') || '[]');
    guionData.forEach(scene => {
        const text = scene.text;
        DEFAULT_PREPOSITIONS.forEach(p => {
            if (text.includes(p.preposicion)) {
                if (!existing.find(pr => pr.preposicion === p.preposicion)) {
                    existing.push({ ...p, example: text, scriptTitle });
                }
            }
        });
    });
    localStorage.setItem('muller_extracted_prepositions', JSON.stringify(existing));
}

function extractArticlesFromGuionFinal(guionData, scriptTitle) {
    if (!guionData || !Array.isArray(guionData)) return;
    const corrections = JSON.parse(localStorage.getItem('muller_article_corrections') || '{}');
    let existing = JSON.parse(localStorage.getItem('muller_extracted_articles') || '[]');
    const regex = /\b(Der|Die|Das|Ein|Eine)\s+([A-ZÃ„Ã–Ãœ][a-zÃ¤Ã¶Ã¼ÃŸ]+)\s+(ist|sind|hat|haben|kann|muss|will|mÃ¶chte|kommt|geht|steht|liegt|sitzt|arbeitet|spricht|denkt|findet|glaubt|weiÃŸ|sieht|hÃ¶rt|fÃ¤hrt|lÃ¤uft|bringt|nimmt|gibt|hilft|trifft|schlÃ¤ft|wÃ¤scht|trÃ¤gt|verliert|schreibt|liest|kennt|nennt)\b/gi;
    guionData.forEach(scene => {
        const text = scene.text || '';
        let match;
        while ((match = regex.exec(text)) !== null) {
            const articleRaw = match[1].toLowerCase();
            const noun = match[2];
            let finalArticle = corrections[noun];
            if (!finalArticle) {
                const found = existing.find(item => item.word === noun);
                if (found) finalArticle = found.article;
            }
            if (!finalArticle) {
                if (noun.toLowerCase().endsWith('ung') || noun.toLowerCase().endsWith('heit') || noun.toLowerCase().endsWith('keit')) finalArticle = 'die';
                else if (noun.toLowerCase().endsWith('chen') || noun.toLowerCase().endsWith('lein')) finalArticle = 'das';
                else if (noun.toLowerCase().endsWith('er') || noun.toLowerCase().endsWith('ling')) finalArticle = 'der';
                else finalArticle = articleRaw === 'ein' ? 'der' : articleRaw === 'eine' ? 'die' : articleRaw;
            }
            if (finalArticle && noun.length > 1 && !existing.find(item => item.word === noun)) {
                existing.push({
                    word: noun, article: finalArticle,
                    examples: [text], translation: scene.translation || '',
                    scriptTitle, dateAdded: new Date().toISOString(),
                    inferred: !corrections[noun]
                });
            }
        }
    });
    localStorage.setItem('muller_extracted_articles', JSON.stringify(existing));
}



// ============================================================================
// ðŸ“ SISTEMA DE ENTRENAMIENTO AVANZADO - LOGICA MÃœLLER (SRS + MEMORIA)
// ============================================================================

const ADVANCED_PROGRESS_KEY = 'muller_advanced_progress';
const DAILY_ACTIVITY_KEY = 'muller_daily_activity';
const DAILY_GOAL_DEFAULT = 30;

function getAdvancedProgress() {
    try {
        return JSON.parse(localStorage.getItem(ADVANCED_PROGRESS_KEY) || '{}');
    } catch (e) {
        return {};
    }
}

function saveAdvancedProgress(progress) {
    localStorage.setItem(ADVANCED_PROGRESS_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event('advancedProgressUpdated'));
    runAchievementsCheck();
}

function getTodayISODate() {
    return new Date().toISOString().slice(0, 10);
}

function getDailyActivity() {
    try {
        const parsed = JSON.parse(localStorage.getItem(DAILY_ACTIVITY_KEY) || '{}');
        return {
            dailyGoal: parsed.dailyGoal || DAILY_GOAL_DEFAULT,
            days: parsed.days || {}
        };
    } catch (e) {
        return { dailyGoal: DAILY_GOAL_DEFAULT, days: {} };
    }
}

function saveDailyActivity(activity) {
    localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(activity));
    window.dispatchEvent(new Event('advancedProgressUpdated'));
    runAchievementsCheck();
}

const ACHIEVEMENTS_KEY = 'muller_achievements';

const ACHIEVEMENT_DEFS = [
    { id: 'telc_first', icon: 'ðŸ“Œ', title: 'Erste Schritte', desc: '10 intentos en entrenamiento avanzado', test: (d) => d.totalAttempts >= 10 },
    { id: 'telc_steady', icon: 'ðŸ’ª', title: 'Konstant', desc: '50 intentos acumulados', test: (d) => d.totalAttempts >= 50 },
    { id: 'telc_marathon', icon: 'ðŸƒ', title: 'Ausdauer', desc: '200 intentos acumulados', test: (d) => d.totalAttempts >= 200 },
    { id: 'telc_daily', icon: 'âœ…', title: 'Tagesziel', desc: 'Completaste el objetivo diario', test: (d) => d.todayAttempts >= d.dailyGoal && d.dailyGoal > 0 },
    { id: 'telc_streak3', icon: 'ðŸ”¥', title: 'Serie 3', desc: 'Racha de 3 dÃ­as seguidos', test: (d) => d.streakDays >= 3 },
    { id: 'telc_streak7', icon: 'ðŸ”¥', title: 'Serie 7', desc: 'Racha de 7 dÃ­as seguidos', test: (d) => d.streakDays >= 7 },
    { id: 'telc_streak30', icon: 'ðŸ†', title: 'Serie 30', desc: 'Racha de 30 dÃ­as seguidos', test: (d) => d.streakDays >= 30 },
    { id: 'telc_precision', icon: 'ðŸŽ¯', title: 'PrÃ¤zision', desc: 'â‰¥85% precisiÃ³n con â‰¥40 intentos', test: (d) => d.totalAttempts >= 40 && d.accuracy >= 85 },
    { id: 'telc_three_pillars', icon: 'âš¡', title: 'Drei SÃ¤ulen', desc: 'Has practicado ArtÃ­culos, Verbos+Prep y Preposiciones', test: (d) => d.art.total > 0 && d.verb.total > 0 && d.prep.total > 0 },
    { id: 'telc_weak_zero', icon: 'ðŸ›¡ï¸', title: 'SchwÃ¤chen im Griff', desc: '0 tarjetas dÃ©biles con â‰¥80 intentos', test: (d) => d.totalAttempts >= 80 && d.weak === 0 }
];

function getAchievementsUnlocked() {
    try {
        return JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '{}');
    } catch (e) {
        return {};
    }
}

function runAchievementsCheck() {
    const dash = getAdvancedDashboard();
    const unlocked = { ...getAchievementsUnlocked() };
    let changed = false;
    ACHIEVEMENT_DEFS.forEach((def) => {
        if (!unlocked[def.id] && def.test(dash)) {
            unlocked[def.id] = new Date().toISOString();
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
        window.dispatchEvent(new Event('achievementsUpdated'));
    }
}

function setDailyGoalCount(n) {
    const activity = getDailyActivity();
    activity.dailyGoal = Math.max(5, Math.min(200, Math.round(Number(n))));
    saveDailyActivity(activity);
}

function registerDailyAttempt() {
    const activity = getDailyActivity();
    const today = getTodayISODate();
    const todayStats = activity.days[today] || { attempts: 0 };
    activity.days[today] = { attempts: todayStats.attempts + 1 };
    saveDailyActivity(activity);
}

function calculateStreak(daysMap) {
    let streak = 0;
    const cursor = new Date();
    while (true) {
        const dateKey = cursor.toISOString().slice(0, 10);
        const count = daysMap[dateKey]?.attempts || 0;
        if (count <= 0) break;
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

function getCardTip(type, item) {
    if (type === 'articulos') {
        const fullWord = (item.de || '').toLowerCase();
        const noun = fullWord.split(' ').slice(1).join(' ');
        if (noun.endsWith('ung') || noun.endsWith('heit') || noun.endsWith('keit') || noun.endsWith('schaft')) {
            return "Truco: muchas palabras en -ung/-heit/-keit/-schaft son DIE.";
        }
        if (noun.endsWith('chen') || noun.endsWith('lein')) {
            return "Truco: diminutivos en -chen/-lein casi siempre son DAS.";
        }
        if (noun.endsWith('er') || noun.endsWith('ling') || noun.endsWith('ismus')) {
            return "Truco: muchos sustantivos en -er/-ling/-ismus son DER.";
        }
        return "Truco: aprende cada palabra junto a su artículo (DER/DIE/DAS) como un bloque. En TELC, el género marca concordancia en la frase entera.";
    }
    const prep = (item.answer || '').toLowerCase();
    const tips = {
        'für': "'Für' rige Akkusativ (objetivo/duración). Muy frecuente en redacción y cloze TELC.",
        'mit': "'Mit' + Dativ: compañía/medio. Error típico: confundir con Akkusativ.",
        'auf': "En verbos fijos, 'auf' suele Akk. (objetivo/respuesta). Memoriza la colocación completa.",
        'bei': "'Bei' + Dativ: lugar abstracto/situación (bei der Arbeit).",
        'nach': "'Nach' + Dativ: dirección con nombres de ciudad/país; tiempo después de un hecho.",
        'von': "'Von' + Dativ: origen/partitivo; en TELC aparece mucho en textos informativos."
    };
    const base = item.trick || item.tipp || tips[prep] || "Fija verbo + preposición + caso como una unidad; en el examen no hay tiempo para deducirlo.";
    return base + " (TELC: prioriza colocaciones frecuentes en B1/B2.)";
}

/** Si no pasas maxItems, se usan todas las tarjetas (sin tope 120). El examen mixto pasa un límite explícito (p. ej. 55). */
function buildAdaptiveQueue(items, progress, getId, maxItems) {
    const weighted = items.map((item) => {
        const id = getId(item);
        const stats = progress[id] || {};
        const attempts = stats.attempts || 0;
        const errors = stats.errors || 0;
        const difficult = stats.difficult || 0;
        const easy = stats.easy || 0;
        const consecutiveErrors = stats.consecutiveErrors || 0;
        const lastSeenAt = stats.lastSeenAt ? new Date(stats.lastSeenAt).getTime() : 0;
        const hoursSinceSeen = lastSeenAt ? Math.max(0, (Date.now() - lastSeenAt) / (1000 * 60 * 60)) : 72;
        const recencyBoost = Math.min(3, hoursSinceSeen / 24);
        const score = attempts === 0
            ? 5
            : 2 + (errors * 2.2) + (difficult * 1.4) + (consecutiveErrors * 1.8) + recencyBoost - (easy * 0.7);
        return { item, score: Math.max(0.5, score + Math.random()) };
    });
    weighted.sort((a, b) => b.score - a.score);
    const cap = maxItems != null ? Math.min(maxItems, weighted.length) : weighted.length;
    return weighted.slice(0, cap).map(entry => entry.item);
}

function getProgressCounts(progress, prefix) {
    const entries = Object.entries(progress).filter(([key]) => key.startsWith(prefix + '::'));
    return entries.reduce((acc, [, stats]) => {
        acc.total += 1;
        acc.attempts += stats.attempts || 0;
        acc.errors += stats.errors || 0;
        acc.easy += stats.easy || 0;
        acc.normal += stats.normal || 0;
        acc.difficult += stats.difficult || 0;
        if ((stats.errors || 0) > (stats.correct || 0)) acc.weak += 1;
        return acc;
    }, { total: 0, attempts: 0, errors: 0, easy: 0, normal: 0, difficult: 0, weak: 0 });
}

function filterQueueByMode(items, progress, getId, mode) {
    if (mode === 'smart') return items;
    return items.filter((item) => {
        const stats = progress[getId(item)] || {};
        const errors = stats.errors || 0;
        const correct = stats.correct || 0;
        const difficult = stats.difficult || 0;
        const attempts = stats.attempts || 0;
        if (mode === 'failed') return errors > 0;
        if (mode === 'difficult') return difficult > 0 || errors > 0;
        if (mode === 'weak') return attempts >= 3 && (errors / Math.max(1, errors + correct)) >= 0.4;
        if (mode === 'new') return attempts === 0;
        return true;
    });
}

/** Une entradas con el mismo `de` y combina niveles. Acepta `level` (legacy) o `levels` (array). */
function normalizeArticulosDataset(raw) {
    if (!Array.isArray(raw)) return [];
    const byDe = new Map();
    for (const item of raw) {
        const de = (item.de || '').trim();
        if (!de) continue;
        const fromArr = Array.isArray(item.levels) ? item.levels.map((x) => String(x).trim()).filter(Boolean) : [];
        const fromSingle = item.level != null && String(item.level).trim() !== '' ? [String(item.level).trim()] : [];
        const combined = [...new Set([...fromArr, ...fromSingle])];
        const prev = byDe.get(de);
        if (!prev) {
            byDe.set(de, { ...item, de, levels: combined });
        } else {
            const mergedLv = [...new Set([...(prev.levels || []), ...combined])];
            byDe.set(de, { ...prev, ...item, de, levels: mergedLv });
        }
    }
    return Array.from(byDe.values()).map((it) => {
        if (!it.levels || it.levels.length === 0) {
            return { ...it, levels: ['A1'] };
        }
        return it;
    });
}

/** ¿La tarjeta cuenta para el mazo A1/A2/B1⬦ o MIXTO? */
function articleItemMatchesLevel(item, selectedMode) {
    if (selectedMode === 'MIXTO') return true;
    const lv = Array.isArray(item.levels) && item.levels.length ? item.levels : (item.level ? [item.level] : []);
    return lv.includes(selectedMode);
}

function getAdvancedDashboard() {
    const progress = getAdvancedProgress();
    const daily = getDailyActivity();
    const today = getTodayISODate();
    const todayAttempts = daily.days[today]?.attempts || 0;
    const dailyGoal = daily.dailyGoal || DAILY_GOAL_DEFAULT;
    const art = getProgressCounts(progress, 'articulos');
    const verb = getProgressCounts(progress, 'verbos');
    const prep = getProgressCounts(progress, 'preposiciones');
    const totalAttempts = art.attempts + verb.attempts + prep.attempts;
    const totalErrors = art.errors + verb.errors + prep.errors;
    const accuracy = totalAttempts > 0 ? Math.round(((totalAttempts - totalErrors) / totalAttempts) * 100) : 0;
    return {
        art, verb, prep, totalAttempts, totalErrors, accuracy,
        weak: art.weak + verb.weak + prep.weak,
        todayAttempts,
        dailyGoal,
        dailyProgress: Math.min(100, Math.round((todayAttempts / Math.max(1, dailyGoal)) * 100)),
        streakDays: calculateStreak(daily.days)
    };
}

function useTelcExamClock(examCtx) {
    const [, setTick] = React.useState(0);
    React.useEffect(() => {
        if (!examCtx) return undefined;
        const id = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, [examCtx]);
}

function TelcExamHud({ examCtx, onUseTranslationHint, answered, translationVisible }) {
    useTelcExamClock(examCtx);
    if (!examCtx) return null;
    const now = Date.now();
    const totalMs = Math.max(1, examCtx.durationMin * 60 * 1000);
    const left = Math.max(0, examCtx.deadline - now);
    const pct = Math.min(100, (left / totalMs) * 100);
    const softOver = left <= 0;
    const urgent = !softOver && left < 5 * 60 * 1000;
    const hintsLeft = Math.max(0, examCtx.hintsTotal - examCtx.hintsUsed);
    const mm = Math.floor(left / 60000);
    const ss = Math.floor((left % 60000) / 1000);
    const canHint = hintsLeft > 0 && !answered && !translationVisible;
    return (
        <div className={`mb-4 rounded-xl border p-3 text-left transition-all ${urgent ? 'border-amber-500/70 bg-amber-950/25 shadow-[0_0_20px_rgba(245,158,11,0.12)]' : softOver ? 'border-rose-600/55 bg-rose-950/35' : 'border-slate-600/45 bg-black/35'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <p className={`text-[11px] font-bold uppercase tracking-widest ${softOver ? 'text-rose-300' : urgent ? 'text-amber-300' : 'text-slate-400'}`}>
                    {softOver ? 'Tiempo guÃ­a agotado â€” puedes seguir' : urgent ? 'Ãšltimos minutos (ritmo TELC)' : 'Modo examen TELC'}
                </p>
                <span className="font-mono text-sm text-white tabular-nums">{softOver ? '0:00' : `${mm}:${ss < 10 ? '0' : ''}${ss}`}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
                <div className={`h-full rounded-full transition-all duration-1000 ${softOver ? 'bg-rose-500/90' : urgent ? 'bg-amber-500' : 'bg-cyan-500/90'}`} style={{ width: `${softOver ? 100 : pct}%` }} />
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-between">
                <p className="text-xs text-slate-400">Pistas para traducción: <span className="text-cyan-300 font-bold">{hintsLeft}</span> / {examCtx.hintsTotal}</p>
                <button type="button" onClick={() => canHint && onUseTranslationHint && onUseTranslationHint()} disabled={!canHint}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${!canHint ? 'opacity-40 border-slate-700 text-slate-500 cursor-not-allowed' : 'border-cyan-600/60 text-cyan-200 hover:bg-cyan-900/40'}`}>
                    âˆ’1 pista: mostrar traducciÃ³n
                </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 leading-snug">El cronómetro es orientativo (estilo TELC): no corta la sesión. Usa las pistas con moderación, como en un examen real.</p>
        </div>
    );
}

function ArticlePracticeFinal({ onBack, examCtx, setExamCtx, examAutoLevel }) {
    const [mode, setMode] = React.useState(null);
    const [queue, setQueue] = React.useState([]);
    const [feedback, setFeedback] = React.useState(null);
    const [loading, setLoading] = React.useState(() => !!(examCtx && examAutoLevel));
    const [progressMap, setProgressMap] = React.useState(() => getAdvancedProgress());
    const [queueFilter, setQueueFilter] = React.useState('smart');
    const [showTranslation, setShowTranslation] = React.useState(false);
    const examLoadRef = React.useRef(false);

    // ðŸ§  Persistencia de palabras dominadas (Cerebro de Oro)
    const [masteredArticles, setMasteredArticles] = React.useState(() => {
        const saved = localStorage.getItem('muller_mastered_articles');
        return saved ? JSON.parse(saved) : [];
    });

    const loadData = (selectedMode) => {
        setMode(selectedMode);
        setLoading(true);
        
        const processData = (rawData) => {
            const data = Array.isArray(rawData) ? normalizeArticulosDataset(rawData) : rawData;
            let filtered = data;
            if (selectedMode !== 'MIXTO' && selectedMode !== 'historia') {
                filtered = data.filter((item) => articleItemMatchesLevel(item, selectedMode));
            }
            // Müller-Filter: Eliminamos lo que ya te sabes para siempre
            const finalQueue = filtered.filter(item => !masteredArticles.includes(item.de));
            
            if (finalQueue.length === 0) {
                alert(`Â¡IncreÃ­ble! Ya dominas todo el mazo ${selectedMode}. ðŸ†`);
                if (examCtx) onBack();
                else setMode(null);
            } else {
                const getId = (item) => `articulos::${item.de}`;
                const adaptive = buildAdaptiveQueue(finalQueue, progressMap, getId);
                const filtered = filterQueueByMode(adaptive, progressMap, getId, queueFilter);
                setQueue(filtered.length > 0 ? filtered : adaptive);
            }
            setLoading(false);
        };

        if (selectedMode === 'historia') {
            const allVocab = window.__DEFAULT_GUION__?.flatMap(s => s.vocab || []) || [];
            const nouns = allVocab.filter(v => /^(der|die|das)\s/i.test(v.de));
            const uniqueNouns = [...new Map(nouns.map(item => [item.de, item])).values()];
            processData(uniqueNouns);
        } else {
            const GIST_URL = "https://gist.githubusercontent.com/djplaza1/a53fde18c901a7f2d86977174b5b9a72/raw/articulos.json?nocache=" + new Date().getTime();
            fetch(GIST_URL).then(res => res.json()).then(processData).catch(() => {
                alert("Error de conexión con la base de datos Müller.");
                if (examCtx) onBack();
                else {
                    setMode(null);
                    setLoading(false);
                }
            });
        }
    };

    React.useEffect(() => {
        if (examCtx && examAutoLevel && !examLoadRef.current) {
            examLoadRef.current = true;
            loadData(examAutoLevel);
        }
    }, [examCtx, examAutoLevel]);

    React.useEffect(() => {
        const id = queue[0]?.de;
        if (id) setShowTranslation(false);
    }, [queue[0]?.de]);

    const handleTranslationHint = () => {
        if (!examCtx || !setExamCtx) return;
        const left = examCtx.hintsTotal - examCtx.hintsUsed;
        if (left <= 0) return;
        setExamCtx((prev) => (prev ? { ...prev, hintsUsed: (prev.hintsUsed || 0) + 1 } : prev));
        setShowTranslation(true);
    };

    // ðŸŒŸ AcciÃ³n: "Ya me la sÃ©" (Descartar para siempre)
    const handleMastered = () => {
        const currentWord = queue[0].de;
        const newMastered = [...masteredArticles, currentWord];
        setMasteredArticles(newMastered);
        localStorage.setItem('muller_mastered_articles', JSON.stringify(newMastered));
        setQueue(prev => prev.slice(1));
        setFeedback(null);
    };

    // ðŸ”„ AcciÃ³n: Siguiente / Reintento
    const handleNextWord = () => {
        if (feedback.type === 'success') {
            setQueue(prev => prev.slice(1)); // Si acertó, se va de la sesión
        } else {
            // PELIGRO: Si falló, al final de la cola (Spaced Retrieval)
            setQueue(prev => [...prev.slice(1), prev[0]]);
        }
        setFeedback(null);
    };

    const registerTrainingResult = (difficulty) => {
        if (!feedback || queue.length === 0) return;
        registerDailyAttempt();
        const current = feedback.currentCard || queue[0];
        const id = `articulos::${current.de}`;
        const prev = progressMap[id] || { attempts: 0, correct: 0, errors: 0, easy: 0, normal: 0, difficult: 0 };
        const next = {
            ...prev,
            attempts: prev.attempts + 1,
            correct: prev.correct + (feedback.type === 'success' ? 1 : 0),
            errors: prev.errors + (feedback.type === 'error' ? 1 : 0),
            easy: prev.easy + (difficulty === 'easy' ? 1 : 0),
            normal: prev.normal + (difficulty === 'normal' ? 1 : 0),
            difficult: prev.difficult + (difficulty === 'difficult' ? 1 : 0),
            consecutiveErrors: feedback.type === 'error' ? (prev.consecutiveErrors || 0) + 1 : 0,
            lastSeenAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const merged = { ...progressMap, [id]: next };
        setProgressMap(merged);
        saveAdvancedProgress(merged);
        handleNextWord();
    };

    const check = (guess) => {
        if (queue.length === 0) return;
        const current = queue[0];
        const correct = current.de.split(' ')[0].toLowerCase();

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(current.de);
        utterance.lang = 'de-DE';
        window.__mullerApplyPreferredDeVoice(utterance);
        window.speechSynthesis.speak(utterance);

        if (guess === correct) {
            setFeedback({ type: 'success', text: `Â¡Richtig! ðŸŸ¢ ${current.de}`, tip: getCardTip('articulos', current), currentCard: current });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
        } else {
            setFeedback({ type: 'error', text: `âš ï¸ FALSCH! Era: ${current.de}`, tip: getCardTip('articulos', current), currentCard: current });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
        }
    };

    if (!mode) {
        if (examCtx && examAutoLevel) {
            return <div className="p-10"><div className="muller-skeleton h-5 w-56 rounded mb-4 mx-auto" /><div className="muller-skeleton h-4 w-72 rounded mx-auto" /></div>;
        }
        return (
        <div className="flex flex-col items-center justify-center p-4 h-full w-full max-w-4xl mx-auto animate-in fade-in">
            <button onClick={onBack} className="absolute top-4 left-4 bg-gray-800 p-2 rounded text-white hover:bg-gray-700">â¬… Volver</button>
            <h2 className="text-3xl font-bold mb-2 text-blue-300">Artículos Müller</h2>
            <p className="text-gray-400 mb-8 font-bold">⭐ {masteredArticles.length} palabras en tu "Memoria de Oro"</p>
            <div className="bg-black/30 border border-blue-800/50 rounded-xl p-3 mb-5 w-full text-sm text-gray-200">
                {(() => {
                    const c = getProgressCounts(progressMap, 'articulos');
                    return <p>ðŸ“Š Intentos: <b>{c.attempts}</b> Â· Fallos: <b>{c.errors}</b> Â· FÃ¡cil: <b>{c.easy}</b> Â· Normal: <b>{c.normal}</b> Â· DifÃ­cil: <b>{c.difficult}</b> Â· ProblemÃ¡ticas: <b>{c.weak}</b></p>;
                })()}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full mb-6">
                <button onClick={() => setQueueFilter('smart')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'smart' ? 'bg-blue-700 text-white' : 'bg-slate-800 text-gray-300'}`}>Mezcla inteligente</button>
                <button onClick={() => setQueueFilter('failed')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'failed' ? 'bg-red-700 text-white' : 'bg-slate-800 text-gray-300'}`}>Solo falladas</button>
                <button onClick={() => setQueueFilter('difficult')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'difficult' ? 'bg-rose-700 text-white' : 'bg-slate-800 text-gray-300'}`}>Solo difíciles</button>
                <button onClick={() => setQueueFilter('weak')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'weak' ? 'bg-fuchsia-700 text-white' : 'bg-slate-800 text-gray-300'}`}>Solo débiles</button>
                <button onClick={() => setQueueFilter('new')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'new' ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-gray-300'}`}>Solo nuevas</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                <button onClick={() => loadData('historia')} className="col-span-2 md:col-span-3 bg-purple-900 border-2 border-purple-500 p-6 rounded-xl font-bold text-xl hover:bg-purple-800 transition">ðŸ“– Historia Actual</button>
                {['A1', 'A2', 'B1', 'B2', 'C1', 'MIXTO'].map(lvl => (
                    <button key={lvl} onClick={() => loadData(lvl)} className="bg-slate-800 border-b-4 border-blue-500 p-6 rounded-xl font-bold text-lg hover:bg-slate-700 transition">{lvl}</button>
                ))}
            </div>
        </div>
        );
    }

    if (loading) return <div className="p-10"><div className="muller-skeleton h-6 w-64 rounded mb-4" /><div className="muller-skeleton h-36 w-full max-w-xl rounded-2xl" /></div>;
    if (queue.length === 0) return <div className="p-20 text-center"><h2 className="text-2xl text-green-400">Â¡Mazo completado! ðŸ†</h2><button onClick={() => setMode(null)} className="mt-4 bg-gray-800 p-2 rounded text-white">Elegir otro</button></div>;

    const wordWithoutArticle = queue[0].de.split(' ').slice(1).join(' ');
    const examHideEs = !!(examCtx && !showTranslation && !feedback);

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full relative">
            {examCtx && <button type="button" onClick={onBack} className="absolute top-2 left-2 md:top-4 md:left-4 bg-slate-800/90 p-2 rounded-lg text-gray-300 text-sm hover:bg-slate-700 z-10">â¬… Salir del examen</button>}
            <div className={`bg-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border ${examCtx ? 'border-amber-600/35 shadow-[0_0_40px_rgba(245,158,11,0.06)]' : 'border-slate-700'}`}>
                {examCtx && (
                    <TelcExamHud examCtx={examCtx} onUseTranslationHint={handleTranslationHint} answered={!!feedback} translationVisible={showTranslation} />
                )}
                <h3 className="text-5xl font-black text-white mb-2">{wordWithoutArticle}</h3>
                {examHideEs ? (
                    <p className="text-slate-500 mb-8 text-sm italic border border-dashed border-slate-600 rounded-lg py-6 px-3">TraducciÃ³n oculta â€” usa una pista arriba si la necesitas (como en examen).</p>
                ) : (
                    <p className="text-gray-400 mb-8 text-xl italic">{queue[0].es}</p>
                )}
                
                {!feedback ? (
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => check('der')} className="bg-blue-600 py-6 rounded-xl font-bold text-xl transition">ðŸ”µ DER</button>
                        <button onClick={() => check('die')} className="bg-red-600 py-6 rounded-xl font-bold text-xl transition">ðŸ”´ DIE</button>
                        <button onClick={() => check('das')} className="bg-green-600 py-6 rounded-xl font-bold text-xl transition">ðŸŸ¢ DAS</button>
                    </div>
                ) : (
                    <div className="animate-in zoom-in">
                        <div className={`p-6 rounded-xl font-black text-2xl mb-6 ${feedback.type === 'error' ? 'bg-red-900 border-2 border-red-500 text-red-100' : 'bg-green-900 border-2 border-green-500 text-green-100'}`}>
                            {feedback.text}
                        </div>
                        <p className="text-gray-400 mb-4 text-lg italic border border-slate-600/50 rounded-lg py-2 px-3 bg-black/20">ES: {(feedback.currentCard || queue[0]).es}</p>
                        <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/30 text-left mb-5">
                            <p className="text-cyan-300 font-bold text-sm uppercase mb-1">ðŸ’¡ Truco para recordarlo</p>
                            <p className="text-gray-200 text-sm italic">{feedback.tip}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => registerTrainingResult('easy')} className="bg-emerald-700 hover:bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm">Fácil</button>
                                <button onClick={() => registerTrainingResult('normal')} className="bg-yellow-700 hover:bg-yellow-600 text-white py-2 rounded-lg font-bold text-sm">Normal</button>
                                <button onClick={() => registerTrainingResult('difficult')} className="bg-rose-700 hover:bg-rose-600 text-white py-2 rounded-lg font-bold text-sm">Difícil</button>
                            </div>
                            {!examCtx && (
                                <button onClick={handleMastered} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold border-b-4 border-emerald-800 transition">ðŸŒŸ Â¡Ya me la sÃ© para siempre!</button>
                            )}
                            <button onClick={handleNextWord} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold transition">
                                {feedback.type === 'error' ? 'Reintentar luego âž”' : 'Siguiente âž”'}
                            </button>
                        </div>
                    </div>
                )}
                <p className="text-gray-500 text-xs mt-6">Restantes en esta sesión: {queue.length}</p>
            </div>
        </div>
    );
}

function CloudPracticeFinal({ onBack, type, examCtx, setExamCtx }) {
    const [queue, setQueue] = React.useState([]);
    const [feedback, setFeedback] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [progressMap, setProgressMap] = React.useState(() => getAdvancedProgress());
    const [queueFilter, setQueueFilter] = React.useState('smart');
    const [showTranslation, setShowTranslation] = React.useState(false);
    const effectiveFilter = examCtx ? 'smart' : queueFilter;

    React.useEffect(() => {
        const id = queue[0]?.de + (queue[0]?.answer || '');
        if (id) setShowTranslation(false);
    }, [queue[0]?.de, queue[0]?.answer]);

    const handleTranslationHint = () => {
        if (!examCtx || !setExamCtx) return;
        const left = examCtx.hintsTotal - examCtx.hintsUsed;
        if (left <= 0) return;
        setExamCtx((prev) => (prev ? { ...prev, hintsUsed: (prev.hintsUsed || 0) + 1 } : prev));
        setShowTranslation(true);
    };

    React.useEffect(() => {
        const URL_VERBOS = "https://gist.githubusercontent.com/djplaza1/142845d2f0fb5a0b2b86e28fbf308809/raw/verbos_con_preposiciones.json";
        const URL_PREPOSICIONES = "https://gist.githubusercontent.com/djplaza1/4f44a8b19a8aa2d451e183859e3f764f/raw/preposiciones.json";
        const GIST_URL = type === 'verbos' ? URL_VERBOS : URL_PREPOSICIONES;
        
        setLoading(true);
        fetch(GIST_URL + "?nocache=" + new Date().getTime())
            .then(res => res.json())
            .then(data => {
                const queueType = type === 'verbos' ? 'verbos' : 'preposiciones';
                const getId = (item) => `${queueType}::${item.de}::${item.answer}`;
                const adaptive = buildAdaptiveQueue(data, progressMap, getId);
                const filtered = filterQueueByMode(adaptive, progressMap, getId, effectiveFilter);
                setQueue(filtered.length > 0 ? filtered : adaptive);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [type, effectiveFilter]);

    const check = (guess) => {
        if (queue.length === 0) return;
        const currentItem = queue[0];
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentItem.de.replace('___', currentItem.answer));
        utterance.lang = 'de-DE';
        window.__mullerApplyPreferredDeVoice(utterance);
        window.speechSynthesis.speak(utterance);

        if (guess === currentItem.answer) {
            setFeedback({ type: 'success', text: `¡Richtig! Es '${currentItem.answer}'`, currentCard: currentItem, tip: getCardTip(type, currentItem) });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
        } else {
            setFeedback({ type: 'error', text: `âš ï¸ FALSCH: Era '${currentItem.answer}'`, currentCard: currentItem, tip: getCardTip(type, currentItem) });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
        }
    };

    const registerTrainingResult = (difficulty) => {
        if (!feedback || queue.length === 0) return;
        registerDailyAttempt();
        const current = feedback.currentCard || queue[0];
        const queueType = type === 'verbos' ? 'verbos' : 'preposiciones';
        const id = `${queueType}::${current.de}::${current.answer}`;
        const prev = progressMap[id] || { attempts: 0, correct: 0, errors: 0, easy: 0, normal: 0, difficult: 0 };
        const next = {
            ...prev,
            attempts: prev.attempts + 1,
            correct: prev.correct + (feedback.type === 'success' ? 1 : 0),
            errors: prev.errors + (feedback.type === 'error' ? 1 : 0),
            easy: prev.easy + (difficulty === 'easy' ? 1 : 0),
            normal: prev.normal + (difficulty === 'normal' ? 1 : 0),
            difficult: prev.difficult + (difficulty === 'difficult' ? 1 : 0),
            consecutiveErrors: feedback.type === 'error' ? (prev.consecutiveErrors || 0) + 1 : 0,
            lastSeenAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const merged = { ...progressMap, [id]: next };
        setProgressMap(merged);
        saveAdvancedProgress(merged);
        handleContinue();
    };

    const handleContinue = () => {
        if (feedback.type === 'success') {
            setQueue(prev => prev.slice(1));
        } else {
            setQueue(prev => [...prev.slice(1), prev[0]]); // Los errores vuelven al final
        }
        setFeedback(null);
    };

    if (loading) return <div className="p-10"><div className="muller-skeleton h-5 w-64 rounded mb-4 mx-auto" /><div className="muller-skeleton h-36 w-full max-w-2xl rounded-2xl mx-auto" /></div>;
    if (queue.length === 0) return <div className="text-center p-20"><h2 className="text-3xl font-bold text-green-400">Â¡Mazo Completado! ðŸ†</h2><button onClick={onBack} className="mt-4 bg-gray-800 p-2 rounded text-white">Volver</button></div>;

    const current = queue[0];
    const options = type === 'verbos' 
        ? ['für', 'auf', 'an', 'von', 'über', 'mit', 'um', 'zu', 'vor', 'nach', 'in', 'bei', 'aus', 'durch', 'ohne', 'gegen']
        : ['an', 'auf', 'in', 'aus', 'bei', 'mit', 'nach', 'seit', 'von', 'zu', 'durch', 'für', 'um', 'vor', 'über', 'unter', 'neben', 'zwischen', 'hinter', 'gegen', 'ohne'];
    const examHideEs = !!(examCtx && !showTranslation && !feedback);

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full w-full relative">
            <button type="button" onClick={onBack} className="absolute top-4 left-4 bg-gray-800 p-2 rounded text-gray-300 z-10">{examCtx ? 'â¬… Salir del examen' : 'â¬… Volver'}</button>
            <div className={`bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl text-center max-w-4xl w-full border ${examCtx ? 'border-amber-600/35 shadow-[0_0_40px_rgba(245,158,11,0.06)]' : 'border-slate-700'}`}>
                {examCtx && (
                    <TelcExamHud examCtx={examCtx} onUseTranslationHint={handleTranslationHint} answered={!!feedback} translationVisible={showTranslation} />
                )}
                <div className="bg-black/30 border border-purple-800/40 rounded-xl p-3 mb-4 text-xs text-gray-200 text-left">
                    {(() => {
                        const scope = type === 'verbos' ? 'verbos' : 'preposiciones';
                        const c = getProgressCounts(progressMap, scope);
                        return <p>ðŸ“Š Intentos: <b>{c.attempts}</b> Â· Fallos: <b>{c.errors}</b> Â· FÃ¡cil: <b>{c.easy}</b> Â· Normal: <b>{c.normal}</b> Â· DifÃ­cil: <b>{c.difficult}</b> Â· ProblemÃ¡ticas: <b>{c.weak}</b></p>;
                    })()}
                </div>
                {!examCtx && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        <button type="button" onClick={() => setQueueFilter('smart')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'smart' ? 'bg-blue-700 text-white' : 'bg-slate-700 text-gray-200'}`}>Mezcla inteligente</button>
                        <button type="button" onClick={() => setQueueFilter('failed')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'failed' ? 'bg-red-700 text-white' : 'bg-slate-700 text-gray-200'}`}>Solo falladas</button>
                        <button type="button" onClick={() => setQueueFilter('difficult')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'difficult' ? 'bg-rose-700 text-white' : 'bg-slate-700 text-gray-200'}`}>Solo difíciles</button>
                        <button type="button" onClick={() => setQueueFilter('weak')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'weak' ? 'bg-fuchsia-700 text-white' : 'bg-slate-700 text-gray-200'}`}>Solo débiles</button>
                        <button type="button" onClick={() => setQueueFilter('new')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'new' ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-gray-200'}`}>Solo nuevas</button>
                    </div>
                )}
                {examCtx && <p className="text-[11px] text-slate-500 mb-3 text-left">Examen: mezcla inteligente fija (sin filtros).</p>}
                <p className="text-blue-400 font-bold mb-2 uppercase tracking-widest">{current.prepCase || 'ðŸŸ¡ Wechsel'}</p>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{current.de.replace('___', '_____')}</h3>
                {examHideEs ? (
                    <p className="text-slate-500 mb-8 text-sm italic border border-dashed border-slate-600 rounded-lg py-6 px-3">TraducciÃ³n oculta â€” usa una pista arriba si la necesitas.</p>
                ) : (
                    <p className="text-gray-400 mb-8 text-xl italic">{current.es}</p>
                )}
                
                {!feedback ? (
                    <div className="flex flex-wrap justify-center gap-2 max-h-[250px] overflow-y-auto p-2">
                        {options.map(p => (
                            <button key={p} type="button" onClick={() => check(p)} className="bg-gray-700 hover:bg-amber-600 py-2 px-3 rounded-lg font-bold text-sm text-white transition min-w-[70px]">
                                {p}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="animate-in zoom-in">
                        <div className={`p-4 rounded-xl font-bold text-xl mb-4 ${feedback.type === 'error' ? 'bg-red-900 border-red-500 border' : 'bg-green-900 border-green-500 border'}`}>
                            {feedback.text}
                        </div>
                        <p className="text-gray-400 mb-4 text-lg italic border border-slate-600/50 rounded-lg py-2 px-3 bg-black/20">ES: {(feedback.currentCard || current).es}</p>
                        <div className="bg-black/40 p-4 rounded-xl border border-amber-500/30 text-left mb-6">
                            <p className="text-amber-400 font-bold text-sm uppercase mb-1">ðŸ’¡ MÃ¼ller-Tipp:</p>
                            <p className="text-gray-200 text-sm italic">{feedback.tip}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <button type="button" onClick={() => registerTrainingResult('easy')} className="bg-emerald-700 hover:bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm">Fácil</button>
                            <button type="button" onClick={() => registerTrainingResult('normal')} className="bg-yellow-700 hover:bg-yellow-600 text-white py-2 rounded-lg font-bold text-sm">Normal</button>
                            <button type="button" onClick={() => registerTrainingResult('difficult')} className="bg-rose-700 hover:bg-rose-600 text-white py-2 rounded-lg font-bold text-sm">Difícil</button>
                        </div>
                        <button type="button" onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-xl transition">CONTINUAR âž”</button>
                    </div>
                )}
            </div>
        </div>
    );
}

function TelcMixedExamFinal({ onBack, examCtx, setExamCtx }) {
    const [queue, setQueue] = React.useState([]);
    const [feedback, setFeedback] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [progressMap, setProgressMap] = React.useState(() => getAdvancedProgress());
    const [showTranslation, setShowTranslation] = React.useState(false);

    React.useEffect(() => {
        if (queue[0]) setShowTranslation(false);
    }, [queue[0]?.kind, queue[0]?.item?.de]);

    const handleTranslationHint = () => {
        if (!examCtx || !setExamCtx) return;
        const left = examCtx.hintsTotal - examCtx.hintsUsed;
        if (left <= 0) return;
        setExamCtx((prev) => (prev ? { ...prev, hintsUsed: (prev.hintsUsed || 0) + 1 } : prev));
        setShowTranslation(true);
    };

    React.useEffect(() => {
        const GIST_ART = 'https://gist.githubusercontent.com/djplaza1/a53fde18c901a7f2d86977174b5b9a72/raw/articulos.json';
        const URL_VERBOS = 'https://gist.githubusercontent.com/djplaza1/142845d2f0fb5a0b2b86e28fbf308809/raw/verbos_con_preposiciones.json';
        const URL_PREP = 'https://gist.githubusercontent.com/djplaza1/4f44a8b19a8aa2d451e183859e3f764f/raw/preposiciones.json';
        const nocache = '?nocache=' + Date.now();
        setLoading(true);
        Promise.all([
            fetch(GIST_ART + nocache).then((r) => r.json()),
            fetch(URL_VERBOS + nocache).then((r) => r.json()),
            fetch(URL_PREP + nocache).then((r) => r.json())
        ]).then(([artData, verbData, prepData]) => {
            const artNorm = normalizeArticulosDataset(artData);
            const artFiltered = artNorm.filter((item) => articleItemMatchesLevel(item, 'B1') || articleItemMatchesLevel(item, 'B2'));
            const getIdArt = (item) => `articulos::${item.de}`;
            const getIdV = (item) => `verbos::${item.de}::${item.answer}`;
            const getIdP = (item) => `preposiciones::${item.de}::${item.answer}`;
            const aQ = buildAdaptiveQueue(artFiltered, progressMap, getIdArt, 55);
            const vQ = buildAdaptiveQueue(verbData, progressMap, getIdV, 55);
            const pQ = buildAdaptiveQueue(prepData, progressMap, getIdP, 55);
            const fa = filterQueueByMode(aQ, progressMap, getIdArt, 'smart');
            const fv = filterQueueByMode(vQ, progressMap, getIdV, 'smart');
            const fp = filterQueueByMode(pQ, progressMap, getIdP, 'smart');
            const aa = fa.length > 0 ? fa : aQ;
            const vv = fv.length > 0 ? fv : vQ;
            const pp = fp.length > 0 ? fp : pQ;
            const mixed = [];
            let ia = 0;
            let iv = 0;
            let ip = 0;
            while (mixed.length < 45 && (ia < aa.length || iv < vv.length || ip < pp.length)) {
                if (ia < aa.length) mixed.push({ kind: 'articulos', item: aa[ia++] });
                if (mixed.length >= 45) break;
                if (iv < vv.length) mixed.push({ kind: 'verbos', item: vv[iv++] });
                if (mixed.length >= 45) break;
                if (ip < pp.length) mixed.push({ kind: 'preposiciones', item: pp[ip++] });
            }
            for (let x = mixed.length - 1; x > 0; x--) {
                const y = Math.floor(Math.random() * (x + 1));
                const t = mixed[x];
                mixed[x] = mixed[y];
                mixed[y] = t;
            }
            setQueue(mixed);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
            setQueue([]);
        });
    }, []);

    const handleContinue = () => {
        if (!feedback) return;
        if (feedback.type === 'success') {
            setQueue((prev) => prev.slice(1));
        } else {
            setQueue((prev) => [...prev.slice(1), prev[0]]);
        }
        setFeedback(null);
    };

    const registerTrainingResult = (difficulty) => {
        if (!feedback || queue.length === 0) return;
        registerDailyAttempt();
        const card = queue[0];
        const current = feedback.currentCard || card.item;
        if (card.kind === 'articulos') {
            const id = `articulos::${current.de}`;
            const prev = progressMap[id] || { attempts: 0, correct: 0, errors: 0, easy: 0, normal: 0, difficult: 0 };
            const next = {
                ...prev,
                attempts: prev.attempts + 1,
                correct: prev.correct + (feedback.type === 'success' ? 1 : 0),
                errors: prev.errors + (feedback.type === 'error' ? 1 : 0),
                easy: prev.easy + (difficulty === 'easy' ? 1 : 0),
                normal: prev.normal + (difficulty === 'normal' ? 1 : 0),
                difficult: prev.difficult + (difficulty === 'difficult' ? 1 : 0),
                consecutiveErrors: feedback.type === 'error' ? (prev.consecutiveErrors || 0) + 1 : 0,
                lastSeenAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const merged = { ...progressMap, [id]: next };
            setProgressMap(merged);
            saveAdvancedProgress(merged);
        } else {
            const queueType = card.kind === 'verbos' ? 'verbos' : 'preposiciones';
            const id = `${queueType}::${current.de}::${current.answer}`;
            const prev = progressMap[id] || { attempts: 0, correct: 0, errors: 0, easy: 0, normal: 0, difficult: 0 };
            const next = {
                ...prev,
                attempts: prev.attempts + 1,
                correct: prev.correct + (feedback.type === 'success' ? 1 : 0),
                errors: prev.errors + (feedback.type === 'error' ? 1 : 0),
                easy: prev.easy + (difficulty === 'easy' ? 1 : 0),
                normal: prev.normal + (difficulty === 'normal' ? 1 : 0),
                difficult: prev.difficult + (difficulty === 'difficult' ? 1 : 0),
                consecutiveErrors: feedback.type === 'error' ? (prev.consecutiveErrors || 0) + 1 : 0,
                lastSeenAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const merged = { ...progressMap, [id]: next };
            setProgressMap(merged);
            saveAdvancedProgress(merged);
        }
        handleContinue();
    };

    const check = (guess) => {
        if (queue.length === 0 || !queue[0]) return;
        const card = queue[0];
        if (card.kind === 'articulos') {
            const current = card.item;
            const correct = current.de.split(' ')[0].toLowerCase();
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(current.de);
            utterance.lang = 'de-DE';
            window.__mullerApplyPreferredDeVoice(utterance);
            window.speechSynthesis.speak(utterance);
            if (guess === correct) {
                setFeedback({ type: 'success', text: `Â¡Richtig! ðŸŸ¢ ${current.de}`, tip: getCardTip('articulos', current), currentCard: current, kind: 'articulos' });
                if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
            } else {
                setFeedback({ type: 'error', text: `âš ï¸ FALSCH! Era: ${current.de}`, tip: getCardTip('articulos', current), currentCard: current, kind: 'articulos' });
                if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
            }
            return;
        }
        const currentItem = card.item;
        const cloudType = card.kind === 'verbos' ? 'verbos' : 'preposiciones';
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentItem.de.replace('___', currentItem.answer));
        utterance.lang = 'de-DE';
        window.__mullerApplyPreferredDeVoice(utterance);
        window.speechSynthesis.speak(utterance);
        if (guess === currentItem.answer) {
            setFeedback({ type: 'success', text: `¡Richtig! Es '${currentItem.answer}'`, currentCard: currentItem, tip: getCardTip(cloudType, currentItem), kind: card.kind });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
        } else {
            setFeedback({ type: 'error', text: `âš ï¸ FALSCH: Era '${currentItem.answer}'`, currentCard: currentItem, tip: getCardTip(cloudType, currentItem), kind: card.kind });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
        }
    };

    if (loading) return <div className="p-10"><div className="muller-skeleton h-5 w-64 rounded mb-4 mx-auto" /><div className="muller-skeleton h-36 w-full max-w-2xl rounded-2xl mx-auto" /></div>;
    if (queue.length === 0) return (
        <div className="text-center p-20">
            <h2 className="text-2xl font-bold text-amber-200 mb-4">No hay tarjetas para mezclar (revisa la conexión).</h2>
            <button type="button" onClick={onBack} className="bg-gray-800 p-2 rounded text-white">Volver</button>
        </div>
    );

    const card = queue[0];
    const current = card.item;
    const examHideEs = !!(examCtx && !showTranslation && !feedback);
    const optionsVerb = ['für', 'auf', 'an', 'von', 'über', 'mit', 'um', 'zu', 'vor', 'nach', 'in', 'bei', 'aus', 'durch', 'ohne', 'gegen'];
    const optionsPrep = ['an', 'auf', 'in', 'aus', 'bei', 'mit', 'nach', 'seit', 'von', 'zu', 'durch', 'für', 'um', 'vor', 'über', 'unter', 'neben', 'zwischen', 'hinter', 'gegen', 'ohne'];
    const options = card.kind === 'verbos' ? optionsVerb : optionsPrep;

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full w-full relative">
            <button type="button" onClick={onBack} className="absolute top-2 left-2 md:top-4 md:left-4 bg-slate-800/90 p-2 rounded-lg text-gray-300 text-sm z-10">â¬… Salir del examen</button>
            <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl text-center max-w-4xl w-full border border-amber-600/35 shadow-[0_0_40px_rgba(245,158,11,0.06)]">
                <TelcExamHud examCtx={examCtx} onUseTranslationHint={handleTranslationHint} answered={!!feedback} translationVisible={showTranslation} />
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 text-left">Mezcla B1/B2 · {card.kind}</p>
                {card.kind === 'articulos' ? (
                    <>
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-2">{current.de.split(' ').slice(1).join(' ')}</h3>
                        {examHideEs ? (
                            <p className="text-slate-500 mb-6 text-sm italic border border-dashed border-slate-600 rounded-lg py-4 px-3">TraducciÃ³n oculta â€” usa una pista arriba si la necesitas.</p>
                        ) : (
                            <p className="text-gray-400 mb-6 text-xl italic">{current.es}</p>
                        )}
                    </>
                ) : (
                    <>
                        <p className="text-blue-400 font-bold mb-2 uppercase tracking-widest text-sm">{current.prepCase || 'ðŸŸ¡ Wechsel'}</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{current.de.replace('___', '_____')}</h3>
                        {examHideEs ? (
                            <p className="text-slate-500 mb-6 text-sm italic border border-dashed border-slate-600 rounded-lg py-4 px-3">TraducciÃ³n oculta â€” usa una pista arriba si la necesitas.</p>
                        ) : (
                            <p className="text-gray-400 mb-6 text-xl italic">{current.es}</p>
                        )}
                    </>
                )}
                {!feedback ? (
                    card.kind === 'articulos' ? (
                        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                            <button type="button" onClick={() => check('der')} className="bg-blue-600 py-5 rounded-xl font-bold text-lg">DER</button>
                            <button type="button" onClick={() => check('die')} className="bg-red-600 py-5 rounded-xl font-bold text-lg">DIE</button>
                            <button type="button" onClick={() => check('das')} className="bg-green-600 py-5 rounded-xl font-bold text-lg">DAS</button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-2 max-h-[220px] overflow-y-auto p-2">
                            {options.map((p) => (
                                <button key={p} type="button" onClick={() => check(p)} className="bg-gray-700 hover:bg-amber-600 py-2 px-3 rounded-lg font-bold text-sm text-white min-w-[68px]">{p}</button>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="animate-in zoom-in text-left">
                        <div className={`p-4 rounded-xl font-bold text-lg mb-3 text-center ${feedback.type === 'error' ? 'bg-red-900 border border-red-500' : 'bg-green-900 border border-green-500'}`}>{feedback.text}</div>
                        <p className="text-gray-400 mb-3 text-base italic border border-slate-600/50 rounded-lg py-2 px-3 bg-black/20">ES: {feedback.currentCard.es}</p>
                        <div className="bg-black/40 p-3 rounded-xl border border-amber-500/30 mb-4">
                            <p className="text-amber-400 font-bold text-xs uppercase mb-1">ðŸ’¡ Tipp</p>
                            <p className="text-gray-200 text-sm italic">{feedback.tip}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <button type="button" onClick={() => registerTrainingResult('easy')} className="bg-emerald-700 text-white py-2 rounded-lg font-bold text-sm">Fácil</button>
                            <button type="button" onClick={() => registerTrainingResult('normal')} className="bg-yellow-700 text-white py-2 rounded-lg font-bold text-sm">Normal</button>
                            <button type="button" onClick={() => registerTrainingResult('difficult')} className="bg-rose-700 text-white py-2 rounded-lg font-bold text-sm">Difícil</button>
                        </div>
                        <button type="button" onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-black">Continuar âž”</button>
                    </div>
                )}
                <p className="text-gray-500 text-xs mt-4">Restantes: {queue.length}</p>
            </div>
        </div>
    );
}

function AdvancedPracticePanelFinal({ embedded = false, onRequestClose = null }) {
    const [show, setShow] = React.useState(false);
    const [activeMode, setActiveMode] = React.useState('menu');
    const [dashboard, setDashboard] = React.useState(() => getAdvancedDashboard());
    const [achUnlocked, setAchUnlocked] = React.useState(() => getAchievementsUnlocked());
    const [examCtx, setExamCtx] = React.useState(null);
    const [examSetup, setExamSetup] = React.useState({ durationMin: 20, hintsTotal: 8, track: 'articulos', articleLevel: 'B1' });

    React.useEffect(() => {
        if (embedded) return;
        const open = () => {
            runAchievementsCheck();
            setShow(true);
            setActiveMode('menu');
            setExamCtx(null);
            setDashboard(getAdvancedDashboard());
            setAchUnlocked(getAchievementsUnlocked());
        };
        const close = () => {
            setShow(false);
            setExamCtx(null);
            setActiveMode('menu');
        };
        const refresh = () => {
            setDashboard(getAdvancedDashboard());
            setAchUnlocked(getAchievementsUnlocked());
        };
        window.addEventListener('toggleAdvancedModal', open);
        window.addEventListener('closeAdvancedModal', close);
        window.addEventListener('advancedProgressUpdated', refresh);
        window.addEventListener('achievementsUpdated', refresh);
        return () => {
            window.removeEventListener('toggleAdvancedModal', open);
            window.removeEventListener('closeAdvancedModal', close);
            window.removeEventListener('advancedProgressUpdated', refresh);
            window.removeEventListener('achievementsUpdated', refresh);
        };
    }, [embedded]);

    React.useEffect(() => {
        const visible = embedded || show;
        if (visible && window.lucide) window.lucide.createIcons();
    }, [embedded, show, activeMode]);

    const handleClosePanel = () => {
        if (!embedded) setShow(false);
        setExamCtx(null);
        setActiveMode('menu');
        if (embedded && typeof onRequestClose === 'function') onRequestClose();
    };

    const visible = embedded || show;
    if (!visible) return null;

    return (
        <div className={embedded ? "w-full text-white" : "fixed inset-0 bg-gray-950/95 backdrop-blur-md z-[100] flex flex-col p-4 md:p-10 text-white overflow-y-auto"}>
            <div className="flex justify-between items-center mb-10 border-b border-purple-900/50 pb-4 gap-2 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-purple-600 p-2 rounded-lg"><i data-lucide="graduation-cap" className="w-6 h-6"></i></span>
                    <h2 className="text-2xl md:text-3xl font-bold text-purple-100">Área de Entrenamiento Müller</h2>
                    <button type="button" onClick={() => window.__MULLER_OPEN_EXERCISE_HELP && window.__MULLER_OPEN_EXERCISE_HELP(activeMode === 'exam_setup' ? 'advanced_exam' : 'advanced_menu')} className="text-xs font-bold text-purple-200 border border-purple-500/40 rounded-lg px-2 py-1.5 hover:bg-purple-900/50 transition">Ayuda</button>
                </div>
                {!embedded && <button type="button" onClick={handleClosePanel} className="bg-red-600/20 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition">X Cerrar</button>}
            </div>

            {activeMode === 'exam_setup' && (
                <div className="max-w-lg mx-auto w-full space-y-5 mb-6">
                    <button type="button" onClick={() => setActiveMode('menu')} className="text-sm text-gray-400 hover:text-white">â† Volver al menÃº</button>
                    <div className="bg-slate-900/85 border border-amber-600/45 rounded-2xl p-6 shadow-xl shadow-amber-900/10">
                        <h3 className="text-xl font-bold text-amber-100 mb-1 flex items-center gap-2"><i data-lucide="timer" className="w-5 h-5"></i> Modo examen TELC</h3>
                        <p className="text-sm text-gray-400 mb-5 leading-relaxed">Cronómetro orientativo (no detiene la sesión), traducción al español oculta hasta que uses una pista. Pensado para la presión del examen sin castigos duros.</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Duración guía</p>
                        <div className="flex flex-wrap gap-2 mb-5">
                            {[15, 20, 30, 45].map((m) => (
                                <button key={m} type="button" onClick={() => setExamSetup((s) => ({ ...s, durationMin: m }))}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${examSetup.durationMin === m ? 'bg-amber-700/50 border-amber-500 text-amber-100' : 'bg-slate-800 border-slate-600 text-gray-300 hover:border-amber-700/50'}`}>{m} min</button>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pistas de traducción (toda la sesión)</p>
                        <div className="flex flex-wrap gap-2 mb-5">
                            {[5, 8, 12].map((h) => (
                                <button key={h} type="button" onClick={() => setExamSetup((s) => ({ ...s, hintsTotal: h }))}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${examSetup.hintsTotal === h ? 'bg-cyan-800/50 border-cyan-500 text-cyan-100' : 'bg-slate-800 border-slate-600 text-gray-300'}`}>{h} pistas</button>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Contenido</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                            {[
                                { id: 'articulos', label: 'Artículos' },
                                { id: 'verbos', label: 'Verbos + prep.' },
                                { id: 'preposiciones', label: 'Preposiciones' },
                                { id: 'mix', label: 'Mezcla B1/B2 (45 tarjetas)' }
                            ].map((t) => (
                                <button key={t.id} type="button" onClick={() => setExamSetup((s) => ({ ...s, track: t.id }))}
                                    className={`p-3 rounded-xl text-left text-sm font-bold border transition ${examSetup.track === t.id ? 'bg-amber-950/50 border-amber-500/70 text-amber-100' : 'bg-slate-800/80 border-slate-600 text-gray-300'}`}>{t.label}</button>
                            ))}
                        </div>
                        {examSetup.track === 'articulos' && (
                            <div className="mb-5">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nivel artículos</p>
                                <div className="flex flex-wrap gap-2">
                                    {['B1', 'B2', 'MIXTO', 'historia'].map((lvl) => (
                                        <button key={lvl} type="button" onClick={() => setExamSetup((s) => ({ ...s, articleLevel: lvl }))}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${examSetup.articleLevel === lvl ? 'bg-blue-800/60 border-blue-400' : 'bg-slate-800 border-slate-600 text-gray-400'}`}>{lvl}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <button type="button" onClick={() => {
                            const deadline = Date.now() + examSetup.durationMin * 60 * 1000;
                            setExamCtx({
                                durationMin: examSetup.durationMin,
                                deadline,
                                hintsTotal: examSetup.hintsTotal,
                                hintsUsed: 0,
                                track: examSetup.track
                            });
                            if (examSetup.track === 'articulos') setActiveMode('exam_articulos');
                            else if (examSetup.track === 'verbos') setActiveMode('exam_verbos');
                            else if (examSetup.track === 'preposiciones') setActiveMode('exam_preposiciones');
                            else setActiveMode('exam_mix');
                        }} className="w-full py-4 rounded-xl font-black text-lg bg-gradient-to-r from-amber-600 to-orange-800 hover:from-amber-500 hover:to-orange-700 border border-amber-500/30 shadow-lg transition">
                            Iniciar sesión tipo examen
                        </button>
                    </div>
                </div>
            )}

            {activeMode === 'menu' && (
                <div className="max-w-5xl mx-auto w-full">
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6">
                        <div className="bg-slate-900/80 border border-blue-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Intentos</p><p className="text-xl font-black text-white">{dashboard.totalAttempts}</p></div>
                        <div className="bg-slate-900/80 border border-red-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Fallos</p><p className="text-xl font-black text-red-300">{dashboard.totalErrors}</p></div>
                        <div className="bg-slate-900/80 border border-emerald-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Precisión</p><p className="text-xl font-black text-emerald-300">{dashboard.accuracy}%</p></div>
                        <div className="bg-slate-900/80 border border-fuchsia-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Débiles</p><p className="text-xl font-black text-fuchsia-300">{dashboard.weak}</p></div>
                        <div className="bg-slate-900/80 border border-amber-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Art/Verb/Prep</p><p className="text-sm font-black text-amber-300">{dashboard.art.total}/{dashboard.verb.total}/{dashboard.prep.total}</p></div>
                        <div className="bg-slate-900/80 border border-cyan-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Objetivo Hoy</p><p className="text-xl font-black text-cyan-300">{dashboard.todayAttempts}/{dashboard.dailyGoal}</p><p className="text-[10px] text-cyan-200">{dashboard.dailyProgress}%</p></div>
                        <div className="bg-slate-900/80 border border-orange-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Racha</p><p className="text-xl font-black text-orange-300">ðŸ”¥ {dashboard.streakDays}</p><p className="text-[10px] text-orange-200">dÃ­as</p></div>
                    </div>
                    <div className="bg-slate-900/60 border border-purple-800/40 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                            <p className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-2">Objetivo diario (tarjetas calificadas)</p>
                            <div className="flex items-center gap-3">
                                <input type="range" min="5" max="100" step="5" value={dashboard.dailyGoal}
                                    onChange={(e) => { setDailyGoalCount(parseInt(e.target.value, 10)); setDashboard(getAdvancedDashboard()); }}
                                    className="flex-1 accent-cyan-500" />
                                <span className="text-cyan-300 font-mono font-bold w-12 text-right">{dashboard.dailyGoal}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 md:max-w-xs">Ajusta el ritmo: en TELC cuenta más la constancia diaria que un solo día intenso.</p>
                    </div>
                    <button type="button" onClick={() => setActiveMode('exam_setup')} className="w-full mb-6 text-left bg-gradient-to-br from-amber-950/55 to-slate-900/85 border border-amber-600/45 hover:border-amber-500/80 rounded-2xl p-5 transition shadow-lg shadow-amber-900/15 group">
                        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Simulación</p>
                        <h3 className="text-lg font-bold text-amber-100 mb-1 group-hover:text-white transition">Modo examen TELC</h3>
                        <p className="text-sm text-gray-400 leading-snug">Cronómetro suave, traducción oculta con pistas limitadas y ritmo de presión sin bloquear la sesión.</p>
                    </button>
                    <div className="mb-6">
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Insignias TELC / Müller</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                            {ACHIEVEMENT_DEFS.map((def) => {
                                const unlockedAt = achUnlocked[def.id];
                                return (
                                    <div key={def.id} title={def.desc}
                                        className={`rounded-lg p-2 text-center border text-[11px] leading-tight ${unlockedAt ? 'bg-amber-950/40 border-amber-600/50 text-amber-100' : 'bg-slate-900/60 border-slate-700 text-gray-600'}`}>
                                        <div className="text-lg mb-0.5">{def.icon}</div>
                                        <div className="font-bold">{def.title}</div>
                                        {unlockedAt && <div className="text-[9px] text-amber-300/80 mt-1">Desbloqueada</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button onClick={() => setActiveMode('articulos')} className="bg-slate-900 border border-blue-800/50 p-8 rounded-2xl hover:bg-blue-900/30 transition shadow-lg group flex flex-col items-center text-center">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition">ðŸ“˜</div>
                        <h3 className="text-2xl font-bold text-blue-400 mb-2">Artículos (Der/Die/Das)</h3>
                        <p className="text-sm text-gray-400">Extraído en Nominativo estricto. Usa teclado (1, 2, 3).</p>
                    </button>

                    <button onClick={() => setActiveMode('verbos_prep')} className="bg-slate-900 border border-green-800/50 p-8 rounded-2xl hover:bg-green-900/30 transition shadow-lg group flex flex-col items-center text-center">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition">ðŸ“—</div>
                        <h3 className="text-2xl font-bold text-green-400 mb-2">Verbos + Prep (Nube)</h3>
                        <p className="text-sm text-gray-400">Conectado a tu GitHub. Sistema de repetición de fallos.</p>
                    </button>

                <button onClick={() => setActiveMode('preposiciones')} className="bg-slate-900 border border-amber-800/50 p-8 rounded-2xl hover:bg-amber-900/30 transition shadow-lg group flex flex-col items-center text-center">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">ðŸ“™</div>
            <h3 className="text-2xl font-bold text-amber-400 mb-2">Preposiciones</h3>
            <p className="text-sm text-gray-400">Base de datos en tiempo real (GitHub). Casos y ejemplos B1/B2.</p>
        </button>
    </div>
    </div>
)}

            {activeMode === 'articulos' && <ArticlePracticeFinal onBack={() => setActiveMode('menu')} />}
            {activeMode === 'verbos_prep' && <CloudPracticeFinal onBack={() => setActiveMode('menu')} type="verbos" />}
            {activeMode === 'preposiciones' && <CloudPracticeFinal onBack={() => setActiveMode('menu')} type="preposiciones" />}
            {activeMode === 'exam_articulos' && examCtx && (
                <ArticlePracticeFinal examCtx={examCtx} setExamCtx={setExamCtx} examAutoLevel={examSetup.articleLevel} onBack={() => { setExamCtx(null); setActiveMode('menu'); }} />
            )}
            {activeMode === 'exam_verbos' && examCtx && (
                <CloudPracticeFinal examCtx={examCtx} setExamCtx={setExamCtx} type="verbos" onBack={() => { setExamCtx(null); setActiveMode('menu'); }} />
            )}
            {activeMode === 'exam_preposiciones' && examCtx && (
                <CloudPracticeFinal examCtx={examCtx} setExamCtx={setExamCtx} type="preposiciones" onBack={() => { setExamCtx(null); setActiveMode('menu'); }} />
            )}
            {activeMode === 'exam_mix' && examCtx && (
                <TelcMixedExamFinal examCtx={examCtx} setExamCtx={setExamCtx} onBack={() => { setExamCtx(null); setActiveMode('menu'); }} />
            )}
        </div>
    );
}

// ============================================================================

// -------------------- MODO AUDIOLIBRO (guion TTS encadenado) â€” control desde React --------------------
(function() {
    let isPlaying = false;
    let currentIdx = 0;
    let guionCache = null;
    let timeoutId = null;
    function sanitizeAudiobookText(text) {
        return String(text || '')
            .replace(/\[R\]/gi, '')
            .replace(/\bN[üu]tzlich\b\.?/gi, '')
            .replace(/\b[ÃšU]TIL\b\.?/gi, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
    }

    function dispatchPlaying(playing) {
        window.dispatchEvent(new CustomEvent('mullerAudiobookState', { detail: { playing } }));
    }

    function getCurrentGuion() {
        const live = window.__MULLER_ACTIVE_GUION__;
        if (Array.isArray(live) && live.length > 0) return live;
        const scripts = JSON.parse(localStorage.getItem('mullerScripts') || '[]');
        if (scripts.length > 0) {
            const last = scripts[scripts.length - 1];
            try { return JSON.parse(last.data); } catch (e) {}
        }
        return window.__DEFAULT_GUION__ || [];
    }

    function stopAudioBook() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        window.speechSynthesis.cancel();
        isPlaying = false;
        dispatchPlaying(false);
    }

    function playScene(index) {
        if (!guionCache || index >= guionCache.length) {
            stopAudioBook();
            if (window.__mullerToast) window.__mullerToast('Audiolibro finalizado.', 'info');
            return;
        }
        const scene = guionCache[index];
        const utterance = new SpeechSynthesisUtterance(sanitizeAudiobookText(scene.text));
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        window.__mullerApplyPreferredDeVoice(utterance);
        utterance.onend = () => {
            timeoutId = setTimeout(() => {
                playScene(index + 1);
            }, 800);
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        currentIdx = index;
    }

    function startAudioBook() {
        guionCache = getCurrentGuion();
        if (!guionCache || guionCache.length === 0) {
            if (window.__mullerToast) window.__mullerToast('No hay ningún guion cargado.', 'error');
            return;
        }
        stopAudioBook();
        isPlaying = true;
        dispatchPlaying(true);
        playScene(0);
    }

    function toggleAudioBook() {
        if (isPlaying) stopAudioBook();
        else startAudioBook();
    }

    window.__mullerAudiobook = {
        toggle: toggleAudioBook,
        start: startAudioBook,
        stop: stopAudioBook,
        get playing() { return isPlaying; },
        get currentIndex() { return currentIdx; }
    };
})();
