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
                setFeedback({ type: 'success', text: `¡Richtig! 🟢 ${current.de}`, tip: getCardTip('articulos', current), currentCard: current, kind: 'articulos' });
                if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
            } else {
                setFeedback({ type: 'error', text: `⚠️ FALSCH! Era: ${current.de}`, tip: getCardTip('articulos', current), currentCard: current, kind: 'articulos' });
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
            setFeedback({ type: 'error', text: `⚠️ FALSCH: Era '${currentItem.answer}'`, currentCard: currentItem, tip: getCardTip(cloudType, currentItem), kind: card.kind });
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
            <button type="button" onClick={onBack} className="absolute top-2 left-2 md:top-4 md:left-4 bg-slate-800/90 p-2 rounded-lg text-gray-300 text-sm z-10">⬅ Salir del examen</button>
            <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl text-center max-w-4xl w-full border border-amber-600/35 shadow-[0_0_40px_rgba(245,158,11,0.06)]">
                <TelcExamHud examCtx={examCtx} onUseTranslationHint={handleTranslationHint} answered={!!feedback} translationVisible={showTranslation} />
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 text-left">Mezcla B1/B2 · {card.kind}</p>
                {card.kind === 'articulos' ? (
                    <>
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-2">{current.de.split(' ').slice(1).join(' ')}</h3>
                        {examHideEs ? (
                            <p className="text-slate-500 mb-6 text-sm italic border border-dashed border-slate-600 rounded-lg py-4 px-3">Traducción oculta — usa una pista arriba si la necesitas.</p>
                        ) : (
                            <p className="text-gray-400 mb-6 text-xl italic">{current.es}</p>
                        )}
                    </>
                ) : (
                    <>
                        <p className="text-blue-400 font-bold mb-2 uppercase tracking-widest text-sm">{current.prepCase || '🟡 Wechsel'}</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{current.de.replace('___', '_____')}</h3>
                        {examHideEs ? (
                            <p className="text-slate-500 mb-6 text-sm italic border border-dashed border-slate-600 rounded-lg py-4 px-3">Traducción oculta — usa una pista arriba si la necesitas.</p>
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
                            <p className="text-amber-400 font-bold text-xs uppercase mb-1">💡 Tipp</p>
                            <p className="text-gray-200 text-sm italic">{feedback.tip}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <button type="button" onClick={() => registerTrainingResult('easy')} className="bg-emerald-700 text-white py-2 rounded-lg font-bold text-sm">Fácil</button>
                            <button type="button" onClick={() => registerTrainingResult('normal')} className="bg-yellow-700 text-white py-2 rounded-lg font-bold text-sm">Normal</button>
                            <button type="button" onClick={() => registerTrainingResult('difficult')} className="bg-rose-700 text-white py-2 rounded-lg font-bold text-sm">Difícil</button>
                        </div>
                        <button type="button" onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-black">Continuar ➔</button>
                    </div>
                )}
                <p className="text-gray-500 text-xs mt-4">Restantes: {queue.length}</p>
            </div>
        </div>
    );
}

window.TelcMixedExamFinal = TelcMixedExamFinal;