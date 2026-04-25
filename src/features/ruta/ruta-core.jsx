window.mullerRutaDefaultProgress = function () {
    return { completed: {}, placementDone: false, suggestedLevelIdx: 0, playTimeMs: 0, lessonsCompleted: 0 };
};

window.mullerRutaLoad = function () {
    try {
        var raw = localStorage.getItem('muller_ruta_progress_v1');
        return raw ? Object.assign(window.mullerRutaDefaultProgress(), JSON.parse(raw)) : window.mullerRutaDefaultProgress();
    } catch (e) {
        return window.mullerRutaDefaultProgress();
    }
};

window.mullerRutaSave = function (p) {
    try { localStorage.setItem('muller_ruta_progress_v1', JSON.stringify(p)); } catch (e) {}
};

window.mullerRutaIsLessonUnlocked = function (levels, levelIdx, lessonIdx, completed) {
    if (!levels[levelIdx] || !levels[levelIdx].lessons[lessonIdx]) return false;
    if (levelIdx === 0 && lessonIdx === 0) return true;
    if (lessonIdx === 0) {
        var prev = levels[levelIdx - 1];
        return prev.lessons.every(function (l) { return completed[l.id]; });
    }
    var prevId = levels[levelIdx].lessons[lessonIdx - 1].id;
    return !!completed[prevId];
};
