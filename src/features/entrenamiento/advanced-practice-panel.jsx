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
                    <button type="button" onClick={() => setActiveMode('menu')} className="text-sm text-gray-400 hover:text-white">← Volver al menú</button>
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
                        <div className="bg-slate-900/80 border border-orange-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Racha</p><p className="text-xl font-black text-orange-300">🔥 {dashboard.streakDays}</p><p className="text-[10px] text-orange-200">días</p></div>
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
                        <div className="text-5xl mb-4 group-hover:scale-110 transition">📘</div>
                        <h3 className="text-2xl font-bold text-blue-400 mb-2">Artículos (Der/Die/Das)</h3>
                        <p className="text-sm text-gray-400">Extraído en Nominativo estricto. Usa teclado (1, 2, 3).</p>
                    </button>

                    <button onClick={() => setActiveMode('verbos_prep')} className="bg-slate-900 border border-green-800/50 p-8 rounded-2xl hover:bg-green-900/30 transition shadow-lg group flex flex-col items-center text-center">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition">📗</div>
                        <h3 className="text-2xl font-bold text-green-400 mb-2">Verbos + Prep (Nube)</h3>
                        <p className="text-sm text-gray-400">Conectado a tu GitHub. Sistema de repetición de fallos.</p>
                    </button>

                <button onClick={() => setActiveMode('preposiciones')} className="bg-slate-900 border border-amber-800/50 p-8 rounded-2xl hover:bg-amber-900/30 transition shadow-lg group flex flex-col items-center text-center">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">📙</div>
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

window.AdvancedPracticePanelFinal = AdvancedPracticePanelFinal;