function useTelcExamClock(examCtx) {
    const [, setTick] = React.useState(0);
    React.useEffect(() => {
        if (!examCtx) return undefined;
        const id = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, [examCtx]);
}

function TelcExamHud({ examCtx, onUseTranslationHint, answered, translationVisible }) {
    useTelcExamClock(examCtx);
    if (!examCtx) return null;
    const now = Date.now();
    const totalMs = Math.max(1, examCtx.durationMin * 60 * 1000);
    const left = Math.max(0, examCtx.deadline - now);
    const pct = Math.min(100, (left / totalMs) * 100);
    const softOver = left <= 0;
    const urgent = !softOver && left < 5 * 60 * 1000;
    const hintsLeft = Math.max(0, examCtx.hintsTotal - examCtx.hintsUsed);
    const mm = Math.floor(left / 60000);
    const ss = Math.floor((left % 60000) / 1000);
    const canHint = hintsLeft > 0 && !answered && !translationVisible;
    return (
        <div className={`mb-4 rounded-xl border p-3 text-left transition-all ${urgent ? 'border-amber-500/70 bg-amber-950/25 shadow-[0_0_20px_rgba(245,158,11,0.12)]' : softOver ? 'border-rose-600/55 bg-rose-950/35' : 'border-slate-600/45 bg-black/35'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <p className={`text-[11px] font-bold uppercase tracking-widest ${softOver ? 'text-rose-300' : urgent ? 'text-amber-300' : 'text-slate-400'}`}>
                    {softOver ? 'Tiempo guía agotado — puedes seguir' : urgent ? 'Últimos minutos (ritmo TELC)' : 'Modo examen TELC'}
                </p>
                <span className="font-mono text-sm text-white tabular-nums">{softOver ? '0:00' : `${mm}:${ss < 10 ? '0' : ''}${ss}`}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
                <div className={`h-full rounded-full transition-all duration-1000 ${softOver ? 'bg-rose-500/90' : urgent ? 'bg-amber-500' : 'bg-cyan-500/90'}`} style={{ width: `${softOver ? 100 : pct}%` }} />
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-between">
                <p className="text-xs text-slate-400">Pistas para traducción: <span className="text-cyan-300 font-bold">{hintsLeft}</span> / {examCtx.hintsTotal}</p>
                <button type="button" onClick={() => canHint && onUseTranslationHint && onUseTranslationHint()} disabled={!canHint}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${!canHint ? 'opacity-40 border-slate-700 text-slate-500 cursor-not-allowed' : 'border-cyan-600/60 text-cyan-200 hover:bg-cyan-900/40'}`}>
                    −1 pista: mostrar traducción
                </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 leading-snug">El cronómetro es orientativo (estilo TELC): no corta la sesión. Usa las pistas con moderación, como en un examen real.</p>
        </div>
    );
}
