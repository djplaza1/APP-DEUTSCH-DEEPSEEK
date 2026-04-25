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
    { id: 'telc_first', icon: '📌', title: 'Erste Schritte', desc: '10 intentos en entrenamiento avanzado', test: (d) => d.totalAttempts >= 10 },
    { id: 'telc_steady', icon: '💪', title: 'Konstant', desc: '50 intentos acumulados', test: (d) => d.totalAttempts >= 50 },
    { id: 'telc_marathon', icon: '🏃', title: 'Ausdauer', desc: '200 intentos acumulados', test: (d) => d.totalAttempts >= 200 },
    { id: 'telc_daily', icon: '✅', title: 'Tagesziel', desc: 'Completaste el objetivo diario', test: (d) => d.todayAttempts >= d.dailyGoal && d.dailyGoal > 0 },
    { id: 'telc_streak3', icon: '🔥', title: 'Serie 3', desc: 'Racha de 3 días seguidos', test: (d) => d.streakDays >= 3 },
    { id: 'telc_streak7', icon: '🔥', title: 'Serie 7', desc: 'Racha de 7 días seguidos', test: (d) => d.streakDays >= 7 },
    { id: 'telc_streak30', icon: '🏆', title: 'Serie 30', desc: 'Racha de 30 días seguidos', test: (d) => d.streakDays >= 30 },
    { id: 'telc_precision', icon: '🎯', title: 'Präzision', desc: '≥85% precisión con ≥40 intentos', test: (d) => d.totalAttempts >= 40 && d.accuracy >= 85 },
    { id: 'telc_three_pillars', icon: '⚡', title: 'Drei Säulen', desc: 'Has practicado Artículos, Verbos+Prep y Preposiciones', test: (d) => d.art.total > 0 && d.verb.total > 0 && d.prep.total > 0 },
    { id: 'telc_weak_zero', icon: '🛡️', title: 'Schwächen im Griff', desc: '0 tarjetas débiles con ≥80 intentos', test: (d) => d.totalAttempts >= 80 && d.weak === 0 }
];