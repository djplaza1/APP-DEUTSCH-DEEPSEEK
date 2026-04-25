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
            setFeedback({ type: 'error', text: `⚠️ FALSCH: Era '${currentItem.answer}'`, currentCard: currentItem, tip: getCardTip(type, currentItem) });
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
    if (queue.length === 0) return <div className="text-center p-20"><h2 className="text-3xl font-bold text-green-400">¡Mazo Completado! 🏆</h2><button onClick={onBack} className="mt-4 bg-gray-800 p-2 rounded text-white">Volver</button></div>;

    const current = queue[0];
    const options = type === 'verbos' 
        ? ['für', 'auf', 'an', 'von', 'über', 'mit', 'um', 'zu', 'vor', 'nach', 'in', 'bei', 'aus', 'durch', 'ohne', 'gegen']
        : ['an', 'auf', 'in', 'aus', 'bei', 'mit', 'nach', 'seit', 'von', 'zu', 'durch', 'für', 'um', 'vor', 'über', 'unter', 'neben', 'zwischen', 'hinter', 'gegen', 'ohne'];
    const examHideEs = !!(examCtx && !showTranslation && !feedback);

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full w-full relative">
            <button type="button" onClick={onBack} className="absolute top-4 left-4 bg-gray-800 p-2 rounded text-gray-300 z-10">{examCtx ? '⬅ Salir del examen' : '⬅ Volver'}</button>
            <div className={`bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl text-center max-w-4xl w-full border ${examCtx ? 'border-amber-600/35 shadow-[0_0_40px_rgba(245,158,11,0.06)]' : 'border-slate-700'}`}>
                {examCtx && (
                    <TelcExamHud examCtx={examCtx} onUseTranslationHint={handleTranslationHint} answered={!!feedback} translationVisible={showTranslation} />
                )}
                <div className="bg-black/30 border border-purple-800/40 rounded-xl p-3 mb-4 text-xs text-gray-200 text-left">
                    {(() => {
                        const scope = type === 'verbos' ? 'verbos' : 'preposiciones';
                        const c = getProgressCounts(progressMap, scope);
                        return <p>📊 Intentos: <b>{c.attempts}</b> · Fallos: <b>{c.errors}</b> · Fácil: <b>{c.easy}</b> · Normal: <b>{c.normal}</b> · Difícil: <b>{c.difficult}</b> · Problemáticas: <b>{c.weak}</b></p>;
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
                <p className="text-blue-400 font-bold mb-2 uppercase tracking-widest">{current.prepCase || '🟡 Wechsel'}</p>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{current.de.replace('___', '_____')}</h3>
                {examHideEs ? (
                    <p className="text-slate-500 mb-8 text-sm italic border border-dashed border-slate-600 rounded-lg py-6 px-3">Traducción oculta — usa una pista arriba si la necesitas.</p>
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
                            <p className="text-amber-400 font-bold text-sm uppercase mb-1">💡 Müller-Tipp:</p>
                            <p className="text-gray-200 text-sm italic">{feedback.tip}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <button type="button" onClick={() => registerTrainingResult('easy')} className="bg-emerald-700 hover:bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm">Fácil</button>
                            <button type="button" onClick={() => registerTrainingResult('normal')} className="bg-yellow-700 hover:bg-yellow-600 text-white py-2 rounded-lg font-bold text-sm">Normal</button>
                            <button type="button" onClick={() => registerTrainingResult('difficult')} className="bg-rose-700 hover:bg-rose-600 text-white py-2 rounded-lg font-bold text-sm">Difícil</button>
                        </div>
                        <button type="button" onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-xl transition">CONTINUAR ➔</button>
                    </div>
                )}
            </div>
        </div>
    );
}

window.CloudPracticeFinal = CloudPracticeFinal;