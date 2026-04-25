function ArticlePracticeFinal({ onBack, examCtx, setExamCtx, examAutoLevel }) {
    const [mode, setMode] = React.useState(null);
    const [queue, setQueue] = React.useState([]);
    const [feedback, setFeedback] = React.useState(null);
    const [loading, setLoading] = React.useState(() => !!(examCtx && examAutoLevel));
    const [progressMap, setProgressMap] = React.useState(() => getAdvancedProgress());
    const [queueFilter, setQueueFilter] = React.useState('smart');
    const [showTranslation, setShowTranslation] = React.useState(false);
    const examLoadRef = React.useRef(false);

    // 🧠 Persistencia de palabras dominadas (Cerebro de Oro)
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
                alert(`¡Increíble! Ya dominas todo el mazo ${selectedMode}. 🏆`);
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

    // 🌟 Acción: "Ya me la sé" (Descartar para siempre)
    const handleMastered = () => {
        const currentWord = queue[0].de;
        const newMastered = [...masteredArticles, currentWord];
        setMasteredArticles(newMastered);
        localStorage.setItem('muller_mastered_articles', JSON.stringify(newMastered));
        setQueue(prev => prev.slice(1));
        setFeedback(null);
    };

    // 🔄 Acción: Siguiente / Reintento
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
            setFeedback({ type: 'success', text: `¡Richtig! 🟢 ${current.de}`, tip: getCardTip('articulos', current), currentCard: current });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
        } else {
            setFeedback({ type: 'error', text: `⚠️ FALSCH! Era: ${current.de}`, tip: getCardTip('articulos', current), currentCard: current });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
        }
    };

    if (!mode) {
        if (examCtx && examAutoLevel) {
            return <div className="p-10"><div className="muller-skeleton h-5 w-56 rounded mb-4 mx-auto" /><div className="muller-skeleton h-4 w-72 rounded mx-auto" /></div>;
        }
        return (
        <div className="flex flex-col items-center justify-center p-4 h-full w-full max-w-4xl mx-auto animate-in fade-in">
            <button onClick={onBack} className="absolute top-4 left-4 bg-gray-800 p-2 rounded text-white hover:bg-gray-700">⬅ Volver</button>
            <h2 className="text-3xl font-bold mb-2 text-blue-300">Artículos Müller</h2>
            <p className="text-gray-400 mb-8 font-bold">⭐ {masteredArticles.length} palabras en tu "Memoria de Oro"</p>
            <div className="bg-black/30 border border-blue-800/50 rounded-xl p-3 mb-5 w-full text-sm text-gray-200">
                {(() => {
                    const c = getProgressCounts(progressMap, 'articulos');
                    return <p>📊 Intentos: <b>{c.attempts}</b> · Fallos: <b>{c.errors}</b> · Fácil: <b>{c.easy}</b> · Normal: <b>{c.normal}</b> · Difícil: <b>{c.difficult}</b> · Problemáticas: <b>{c.weak}</b></p>;
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
                <button onClick={() => loadData('historia')} className="col-span-2 md:col-span-3 bg-purple-900 border-2 border-purple-500 p-6 rounded-xl font-bold text-xl hover:bg-purple-800 transition">📖 Historia Actual</button>
                {['A1', 'A2', 'B1', 'B2', 'C1', 'MIXTO'].map(lvl => (
                    <button key={lvl} onClick={() => loadData(lvl)} className="bg-slate-800 border-b-4 border-blue-500 p-6 rounded-xl font-bold text-lg hover:bg-slate-700 transition">{lvl}</button>
                ))}
            </div>
        </div>
        );
    }

    if (loading) return <div className="p-10"><div className="muller-skeleton h-6 w-64 rounded mb-4" /><div className="muller-skeleton h-36 w-full max-w-xl rounded-2xl" /></div>;
    if (queue.length === 0) return <div className="p-20 text-center"><h2 className="text-2xl text-green-400">¡Mazo completado! 🏆</h2><button onClick={() => setMode(null)} className="mt-4 bg-gray-800 p-2 rounded text-white">Elegir otro</button></div>;

    const wordWithoutArticle = queue[0].de.split(' ').slice(1).join(' ');
    const examHideEs = !!(examCtx && !showTranslation && !feedback);

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full relative">
            {examCtx && <button type="button" onClick={onBack} className="absolute top-2 left-2 md:top-4 md:left-4 bg-slate-800/90 p-2 rounded-lg text-gray-300 text-sm hover:bg-slate-700 z-10">⬅ Salir del examen</button>}
            <div className={`bg-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border ${examCtx ? 'border-amber-600/35 shadow-[0_0_40px_rgba(245,158,11,0.06)]' : 'border-slate-700'}`}>
                {examCtx && (
                    <TelcExamHud examCtx={examCtx} onUseTranslationHint={handleTranslationHint} answered={!!feedback} translationVisible={showTranslation} />
                )}
                <h3 className="text-5xl font-black text-white mb-2">{wordWithoutArticle}</h3>
                {examHideEs ? (
                    <p className="text-slate-500 mb-8 text-sm italic border border-dashed border-slate-600 rounded-lg py-6 px-3">Traducción oculta — usa una pista arriba si la necesitas (como en examen).</p>
                ) : (
                    <p className="text-gray-400 mb-8 text-xl italic">{queue[0].es}</p>
                )}
                
                {!feedback ? (
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => check('der')} className="bg-blue-600 py-6 rounded-xl font-bold text-xl transition">🔵 DER</button>
                        <button onClick={() => check('die')} className="bg-red-600 py-6 rounded-xl font-bold text-xl transition">🔴 DIE</button>
                        <button onClick={() => check('das')} className="bg-green-600 py-6 rounded-xl font-bold text-xl transition">🟢 DAS</button>
                    </div>
                ) : (
                    <div className="animate-in zoom-in">
                        <div className={`p-6 rounded-xl font-black text-2xl mb-6 ${feedback.type === 'error' ? 'bg-red-900 border-2 border-red-500 text-red-100' : 'bg-green-900 border-2 border-green-500 text-green-100'}`}>
                            {feedback.text}
                        </div>
                        <p className="text-gray-400 mb-4 text-lg italic border border-slate-600/50 rounded-lg py-2 px-3 bg-black/20">ES: {(feedback.currentCard || queue[0]).es}</p>
                        <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/30 text-left mb-5">
                            <p className="text-cyan-300 font-bold text-sm uppercase mb-1">💡 Truco para recordarlo</p>
                            <p className="text-gray-200 text-sm italic">{feedback.tip}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => registerTrainingResult('easy')} className="bg-emerald-700 hover:bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm">Fácil</button>
                                <button onClick={() => registerTrainingResult('normal')} className="bg-yellow-700 hover:bg-yellow-600 text-white py-2 rounded-lg font-bold text-sm">Normal</button>
                                <button onClick={() => registerTrainingResult('difficult')} className="bg-rose-700 hover:bg-rose-600 text-white py-2 rounded-lg font-bold text-sm">Difícil</button>
                            </div>
                            {!examCtx && (
                                <button onClick={handleMastered} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold border-b-4 border-emerald-800 transition">🌟 ¡Ya me la sé para siempre!</button>
                            )}
                            <button onClick={handleNextWord} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold transition">
                                {feedback.type === 'error' ? 'Reintentar luego ➔' : 'Siguiente ➔'}
                            </button>
                        </div>
                    </div>
                )}
                <p className="text-gray-500 text-xs mt-6">Restantes en esta sesión: {queue.length}</p>
            </div>
        </div>
    );
}

window.ArticlePracticeFinal = ArticlePracticeFinal;