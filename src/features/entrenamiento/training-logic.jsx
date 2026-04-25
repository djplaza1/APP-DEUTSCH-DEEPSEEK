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

/** ¿La tarjeta cuenta para el mazo A1/A2/B1… o MIXTO? */
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