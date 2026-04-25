        function mullerLeagueComputeUserScore(stats) {
            if (!stats || typeof stats !== 'object') return 0;
            const xp = Number(stats.xp) || 0;
            const coins = Number(stats.coins) || 0;
            const streak = Number(stats.streakDays) || 0;
            const diktat = Number(stats.diktatCorrect) || 0;
            const pron = Number(stats.pronunciationAttempts) || 0;
            const raw = xp * 0.12 + coins * 0.35 + streak * 28 + diktat * 3 + pron * 2;
            return Math.max(0, Math.min(99999, Math.floor(raw)));
        }

        function mullerBotWeekScore(botId, weekKey) {
            const h = mullerHash32(String(botId) + '|' + String(weekKey));
            const h2 = mullerHash32(String(weekKey) + '|' + String(botId));
            const base = 900 + (h % 4200);
            const wave = (h2 % 1400) - 200;
            return Math.max(100, Math.min(99999, base + wave));
        }

        function mullerLeagueBuildRanking(userStats, username, session) {
            const week = mullerIsoWeekMonday();
            const userScore = mullerLeagueComputeUserScore(userStats);
            const rows = [
                {
                    id: 'local_player',
                    name: username || 'Estudiante',
                    isBot: false,
                    isSelf: true,
                    score: userScore,
                    sub: session ? mullerMaskEmail(session.email) : 'Invitado (sin email en este dispositivo)',
                    rank: 0
                },
                ...MULLER_BOT_PLAYERS.map((b) => ({
                    id: b.id,
                    name: b.name,
                    isBot: true,
                    isSelf: false,
                    score: mullerBotWeekScore(b.id, week),
                    sub: b.tag + ' · ' + b.lvl,
                    rank: 0
                }))
            ];
            rows.sort((a, b) => b.score - a.score);
            rows.forEach((r, i) => { r.rank = i + 1; });
            return { week, rows };
        }