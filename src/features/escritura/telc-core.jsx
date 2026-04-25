var mullerBuildTelcWritingCoach = (rawText, task, normalizeFn) => {
    const text = String(rawText || '').trim();
    if (!text) return null;

    const normalize = typeof normalizeFn === 'function'
        ? normalizeFn
        : ((s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim());
    const low = normalize(text);
    const words = low.split(/\s+/).filter(Boolean);
    const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
    const connectors = ['weil', 'deshalb', 'außerdem', 'denn', 'damit', 'trotzdem', 'obwohl', 'zuerst', 'danach', 'zum schluss', 'daher', 'allerdings'];
    const formalMarkers = ['sehr geehrte', 'mit freundlichen grüßen', 'ich möchte', 'hiermit', 'vielen dank', 'bitte'];
    const informalMarkers = ['liebe', 'hallo', 'viele grüße', 'bis bald'];
    const hasFormal = formalMarkers.some((x) => low.includes(x));
    const hasInformal = informalMarkers.some((x) => low.includes(x));
    const connectorHits = connectors.filter((x) => low.includes(x)).length;
    const scoreTask = Math.max(0, Math.min(5, Math.round((words.length >= 65 ? 3 : words.length >= 40 ? 2 : 1) + (task && Array.isArray(task.checklist) ? Math.min(2, task.checklist.filter((c) => low.includes(normalize(c).split(/\s+/)[0] || '')).length) : 0))));
    const scoreRegister = Math.max(0, Math.min(5, hasFormal ? 5 : hasInformal ? 3 : 2));
    const scoreCohesion = Math.max(0, Math.min(5, Math.round((sentences.length >= 4 ? 2 : 1) + Math.min(3, connectorHits))));
    const umlautHits = (text.match(/[äöüß]/gi) || []).length;
    const punctHits = (text.match(/[.,!?]/g) || []).length;
    const scoreGrammar = Math.max(0, Math.min(5, Math.round((punctHits >= 3 ? 2 : 1) + (umlautHits >= 2 ? 1 : 0) + (words.length >= 50 ? 2 : words.length >= 30 ? 1 : 0))));
    const total = scoreTask + scoreRegister + scoreCohesion + scoreGrammar;
    const max = 20;
    const pct = Math.round((total / max) * 100);
    const suggestion = [
        scoreTask < 4 ? 'Añade más contenido concreto del encargo (datos, petición y cierre).' : null,
        scoreRegister < 4 ? 'Refuerza registro formal TELC (Sehr geehrte..., Mit freundlichen Grüßen).' : null,
        scoreCohesion < 4 ? 'Usa más conectores: weil, deshalb, außerdem, trotzdem.' : null,
        scoreGrammar < 4 ? 'Revisa signos de puntuación, mayúsculas de sustantivos y umlauts.' : null
    ].filter(Boolean);

    return {
        total,
        max,
        pct,
        scoreTask,
        scoreRegister,
        scoreCohesion,
        scoreGrammar,
        suggestionText: suggestion.length ? suggestion.join(' ') : 'Muy buen texto para TELC. Solo pule estilo y precisión.'
    };
};
