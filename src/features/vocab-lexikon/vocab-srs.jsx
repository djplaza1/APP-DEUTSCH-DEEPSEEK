var MULLER_VOCAB_SRS_STORAGE = 'muller_vocab_srs_v1';

function mullerVocabSrsKey(w) {
    const de = (w && w.de ? String(w.de) : '').trim().toLowerCase();
    const es = (w && w.es ? String(w.es) : '').trim().toLowerCase();
    return de + '\u0000' + es;
}

function mullerGetVocabSrsMap() {
    try {
        const raw = localStorage.getItem(MULLER_VOCAB_SRS_STORAGE);
        return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
}

function mullerSetVocabSrsMap(map) {
    try { localStorage.setItem(MULLER_VOCAB_SRS_STORAGE, JSON.stringify(map)); } catch (e) {}
}

function mullerApplyVocabSrsRating(map, word, level) {
    const key = mullerVocabSrsKey(word);
    const todayStr = new Date().toISOString().slice(0, 10);
    const prev = map[key] || null;
    const q = level === 'hard' ? 2 : level === 'normal' ? 3 : 4;
    let interval = prev && typeof prev.interval === 'number' ? prev.interval : 0;
    let repetitions = prev && typeof prev.repetitions === 'number' ? prev.repetitions : 0;
    let easeFactor = prev && typeof prev.easeFactor === 'number' ? prev.easeFactor : 2.5;
    if (q < 3) {
        repetitions = 0;
        interval = 1;
        easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else {
        if (repetitions === 0) interval = 1;
        else if (repetitions === 1) interval = 6;
        else interval = Math.max(1, Math.round(interval * easeFactor));
        repetitions += 1;
        easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        easeFactor = Math.max(1.3, easeFactor);
    }
    const dueDate = new Date(todayStr + 'T12:00:00');
    dueDate.setDate(dueDate.getDate() + interval);
    const due = dueDate.toISOString().slice(0, 10);
    const prevVC = prev && typeof prev.viewCount === 'number' ? prev.viewCount : 0;
    const ratedCount = (prev && typeof prev.ratedCount === 'number' ? prev.ratedCount : 0) + 1;
    return { ...map, [key]: { interval, repetitions, easeFactor, due, lastRated: todayStr, viewCount: Math.max(prevVC, 1), ratedCount, lastViewed: todayStr } };
}

function mullerIncrementSrsView(map, word) {
    const key = mullerVocabSrsKey(word);
    const prev = map[key] || {};
    const viewCount = (typeof prev.viewCount === 'number' ? prev.viewCount : 0) + 1;
    const todayStr = new Date().toISOString().slice(0, 10);
    return { ...map, [key]: { ...prev, viewCount, lastViewed: todayStr } };
}

function mullerSortVocabBySrs(words, map) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const today = new Date(todayStr + 'T12:00:00');
    function urgency(w) {
        const rec = map[mullerVocabSrsKey(w)];
        if (!rec || !rec.due) return 0.3;
        const due = new Date(rec.due + 'T12:00:00');
        const diffDays = Math.floor((due - today) / 864e5);
        if (diffDays < 0) return diffDays;
        if (diffDays === 0) return 0;
        return 500 + diffDays;
    }
    return [...words].sort((a, b) => {
        const ua = urgency(a), ub = urgency(b);
        if (ua !== ub) return ua - ub;
        return (a.de || '').localeCompare(b.de || '');
    });
}

function mullerCountVocabSrsDue(words, map) {
    const todayStr = new Date().toISOString().slice(0, 10);
    let n = 0;
    words.forEach((w) => {
        const rec = map[mullerVocabSrsKey(w)];
        if (!rec || !rec.due) { n++; return; }
        if (rec.due <= todayStr) n++;
    });
    return n;
}
