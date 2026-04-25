       /** Racha “honesta”: el día cuenta solo si hay actividad mínima (umbrales fijos en código). */
        const MULLER_STREAK_QUAL_KEY = 'muller_streak_qualifying_days_v1';
        const MULLER_STREAK_TODAY_KEY = 'muller_streak_today_stats_v1';
        const MULLER_STREAK_MIN_VOCAB_RATINGS = 8;
        const MULLER_STREAK_MIN_ACTIVITY_POINTS = 45;
        const MULLER_STREAK_MIN_ACTIVE_SEC = 420;
        const MULLER_ONBOARDING_KEY = 'muller_onboarding_done_v1';
        const MULLER_THEME_KEY = 'muller_ui_theme_v1';
        const MULLER_MAIN_GOAL_KEY = 'muller_main_daily_goal_v1';
        const MULLER_GOAL_CLAIM_KEY = 'muller_main_goal_claim_date_v1';
        const MULLER_OCR_HIST_KEY = 'muller_ocr_history_v1';
        const MULLER_TTS_RATE_KEY = 'muller_tts_rate_preset_v1';
        function mullerGetStreakTodayStats() {
            const today = new Date().toISOString().slice(0, 10);
            try {
                const raw = localStorage.getItem(MULLER_STREAK_TODAY_KEY);
                if (!raw) return { date: today, vocabRated: 0, points: 0, activeSec: 0 };
                const o = JSON.parse(raw);
                if (o.date !== today) return { date: today, vocabRated: 0, points: 0, activeSec: 0 };
                return o;
            } catch (e) {
                return { date: today, vocabRated: 0, points: 0, activeSec: 0 };
            }
        }
        function mullerSaveStreakTodayStats(o) {
            try { localStorage.setItem(MULLER_STREAK_TODAY_KEY, JSON.stringify(o)); } catch (e) {}
        }
        function mullerQualifyingMap() {
            try { return JSON.parse(localStorage.getItem(MULLER_STREAK_QUAL_KEY) || '{}'); } catch (e) { return {}; }
        }
        function mullerSetQualifyingMap(m) {
            try { localStorage.setItem(MULLER_STREAK_QUAL_KEY, JSON.stringify(m)); } catch (e) {}
        }
        function mullerUpdateQualifyingForStats(stats) {
            const today = new Date().toISOString().slice(0, 10);
            if (stats.date !== today) return;
            const ok = stats.vocabRated >= MULLER_STREAK_MIN_VOCAB_RATINGS
                || stats.points >= MULLER_STREAK_MIN_ACTIVITY_POINTS
                || stats.activeSec >= MULLER_STREAK_MIN_ACTIVE_SEC;
            const m = mullerQualifyingMap();
            if (ok) m[today] = true;
            else delete m[today];
            mullerSetQualifyingMap(m);
        }
        function mullerComputeHonestStreakDays() {
            const qual = mullerQualifyingMap();
            const today = new Date().toISOString().slice(0, 10);
            let streak = 0;
            const d = new Date();
            if (!qual[today]) d.setDate(d.getDate() - 1);
            for (let guard = 0; guard < 400; guard++) {
                const key = d.toISOString().slice(0, 10);
                if (qual[key]) {
                    streak++;
                    d.setDate(d.getDate() - 1);
                } else break;
            }
            return streak;
        }
        function mullerBumpVocabStreakRating() {
            let st = mullerGetStreakTodayStats();
            const today = new Date().toISOString().slice(0, 10);
            if (st.date !== today) st = { date: today, vocabRated: 0, points: 0, activeSec: 0 };
            st.vocabRated += 1;
            mullerSaveStreakTodayStats(st);
            mullerUpdateQualifyingForStats(st);
        }
        function mullerGetMainDailyGoalCards() {
            try {
                const n = parseInt(localStorage.getItem(MULLER_MAIN_GOAL_KEY) || '15', 10);
                return Math.max(3, Math.min(120, n || 15));
            } catch (e) { return 15; }
        }
        function mullerPushOcrHistory(entry) {
            try {
                const raw = localStorage.getItem(MULLER_OCR_HIST_KEY);
                const arr = raw ? JSON.parse(raw) : [];
                arr.unshift({
                    ...entry,
                    at: new Date().toISOString(),
                    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
                });
                while (arr.length > 15) arr.pop();
                localStorage.setItem(MULLER_OCR_HIST_KEY, JSON.stringify(arr));
                return arr;
            } catch (e) {
                return [];
            }
        }